# Note(rstankov):
#
# Preload associations
#
#  **Don't use for `connection`s, only for `field` attributes**
#
#  supported definitions:
#  - [x] :assoc
#  - [x] { assoc: :assoc }
#  - [x] { assoc: { assoc: :assoc } }
#  - [x] [:assoc, :assoc]
#  - [x] { assoc: [ :assoc, :assoc ] }
#
#  not supported: (because their response is not obvious)
#  - [ ] [ :assoc, { assoc: :assoc } }
#  - [ ] [ { assoc: :assoc }, { assoc: :assoc } }

class Resolvers::Association < GraphQL::Function
  def initialize(preload, &block)
    @preload = normalize_preloads(preload)
    @handler = block || DefaultHandler
  end

  def call(obj, _args = nil, _ctx = nil)
    return unless obj.present?
    next_step preload.dup, obj, obj
  end

  private

  def next_step(items, obj, previous_assoc)
    preload_associations(previous_assoc, items.shift).then do |assoc|
      if items.empty?
        handle obj, assoc
      else
        next_step items, obj, assoc
      end
    end
  end

  def preload_associations(model, associations)
    if associations.is_a? Array
      Promise.all(associations.map { |name| preload_association(model, name) })
    else
      preload_association(model, associations)
    end
  end

  def preload_association(model, association_name)
    AssociationLoader.for(model.class, association_name).load(model)
  end

  def normalize_preloads(preloads)
    if preloads.is_a? Hash
      keys = preloads.keys
      raise NotSupported, 'only one nested association supported currently' unless keys.size == 1
      first_key = keys.first
      [first_key] + normalize_preloads(preloads[first_key])
    else
      [preloads]
    end
  end

  def handle(obj, assoc)
    if handler.arity == 2
      handler.call assoc, obj
    else
      handler.call assoc
    end
  end

  attr_reader :preload, :handler

  class NotSupported < StandardError; end

  module DefaultHandler
    extend self

    def arity
      1
    end

    def call(assoc)
      assoc
    end
  end

  # NOTE(rstankov): Taken from:
  #  https://github.com/xuorig/graphql-active_record_batcher/blob/master/lib/graphql/active_record_batcher/association_loader.rb
  #  (gem is not used since too young and it doesn't support nested associations)
  class AssociationLoader < GraphQL::Batch::Loader
    def initialize(model, association)
      @model = model
      @association = association
    end

    def load(record)
      raise TypeError, "#{ @model } loader can't load association for #{ record.class }" unless record.is_a?(@model)
      return Promise.resolve(read_association(record)) if association_loaded?(record)
      super
    end

    # We want to load the associations on all records, even if they have the same id
    def cache_key(record)
      record.object_id
    end

    def perform(records)
      ::ActiveRecord::Associations::Preloader.new.preload(records, association)

      records.each do |record|
        fulfill(record, read_association(record))
      end
    end

    private

    attr_reader :model, :association

    def read_association(record)
      record.public_send(association)
    end

    def association_loaded?(record)
      record.association(association).loaded?
    end
  end
end

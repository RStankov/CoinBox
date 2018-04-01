class Resolvers::Mutation
  def self.call(object, inputs, context)
    new(object, inputs, context).call
  end

  attr_reader :object, :inputs, :context, :current_player, :current_game

  def initialize(object, inputs, context)
    @object = object
    @inputs = HashWithIndifferentAccess.new(inputs.to_h)
    @context = context
    @current_player = context[:current_player]
    @current_game = context[:current_game]
  end

  def perform
    raise NotImplementedError
  end

  def call
    raise Pundit::NotAuthorizedError if self.class.require_player? && current_player.nil?

    result = perform

    if result.nil?
      success
    elsif result.is_a? Hash
      result
    elsif result.respond_to?(:errors) && result.errors.any?
      errors_from_record result
    elsif result.respond_to? :node
      success result.node
    else
      success result
    end
  rescue ActiveRecord::RecordInvalid => e
    errors_from_record(e.record)
  rescue ActiveRecord::RecordNotFound
    error :base, :record_not_found
  rescue MiniForm::InvalidForm => e
    { errors: e.errors.map { |field, messages| Error.new(field, messages) } }
  rescue Pundit::NotAuthorizedError
    error :base, :access_denied
  end

  def success(node = nil)
    if node.present?
      { node: node, errors: [] }
    else
      { errors: [] }
    end
  end

  def error(field, message)
    { errors: [Error.new(field, message)] }
  end

  def errors_from_record(record)
    { errors: record.errors.map { |field, messages| Error.new(field, messages) } }
  end

  class Error
    attr_reader :field, :messages

    def initialize(field, messages)
      @field = field
      @messages = Array(messages)
    end

    def ==(other)
      field == other.field && messages == other.messages
    end
  end

  class << self
    def inherited(base)
      base.instance_eval do
        @inputs = []
        @returns = nil
        @field = nil
      end
    end

    def input(name, type)
      @inputs << [name, type]
    end

    def returns(type) # rubocop:disable TrivialAccessors
      @returns = type
    end

    def types
      GraphQL::Define::TypeDefiner.instance
    end

    def require_payer
      @require_payer = true
    end

    def require_player?
      @require_payer.present?
    end

    def field
      @field ||= begin
                  inputs = @inputs
                  returns = @returns
                  resolver = self
                  mutation = GraphQL::Relay::Mutation.define do
                    name resolver.name.demodulize

                    inputs.each do |(name, field)|
                      input_field name, field
                    end

                    return_field :node, returns if returns
                    return_field :errors, !types[!Types::ErrorType]

                    resolve resolver
                  end
                  mutation.field
                end
    end
  end
end

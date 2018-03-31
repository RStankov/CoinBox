class Resolvers::ById < GraphQL::Function
  argument :id, types.ID

  attr_reader :type

  def initialize(model_class, type = nil)
    @model_class = model_class
    @type = type || "::Types::#{ model_class }Type".safe_constantize
  end

  def call(_obj, args, _ctx)
    @model_class.find_by id: args[:id]
  end
end

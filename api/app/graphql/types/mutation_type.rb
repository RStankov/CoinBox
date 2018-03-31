Types::MutationType = GraphQL::ObjectType.define do
  name 'Mutation'

  # TODO: remove me
  field :testField, types.String do
    description 'An example field added by the generator'
    resolve ->(obj, args, ctx) { 'Hello World!' }
  end
end

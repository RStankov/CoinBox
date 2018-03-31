Types::ErrorType = GraphQL::ObjectType.define do
  name 'Error'

  field :field, !types.String
  field :messages, !types[types.String]
end

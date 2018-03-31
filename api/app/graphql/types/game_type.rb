Types::GameType = GraphQL::ObjectType.define do
  name 'Game'

  field :id, !types.String
  field :name, !types.String
end

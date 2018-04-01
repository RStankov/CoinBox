Types::PlayerType = GraphQL::ObjectType.define do
  name 'Player'

  field :id, !types.String
  field :username, !types.String
  field :properties, !Types::JsonType
end

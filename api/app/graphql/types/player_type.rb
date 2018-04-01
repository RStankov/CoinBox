Types::PlayerType = GraphQL::ObjectType.define do
  name 'Player'

  field :id, !types.ID
  field :username, !types.String
  field :properties, !Types::JsonType
  field :wallet, function: Resolvers::PlayerWalletResolver.new
end

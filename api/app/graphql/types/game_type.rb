Types::GameType = GraphQL::ObjectType.define do
  name 'Game'

  field :id, !types.ID
  field :name, !types.String

  connection :store, Types::TransferableType.connection_type, function: Resolvers::StoreResolver
  connection :players, Types::PlayerType.connection_type, function: Resolvers::PlayersResolver
end

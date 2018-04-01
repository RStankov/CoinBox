Types::GameType = GraphQL::ObjectType.define do
  name 'Game'

  field :id, !types.String
  field :name, !types.String

  connection :store, Types::TransferableType.connection_type, function: Resolvers::StoreResolver
end

Types::PlayerWalletType = GraphQL::ObjectType.define do
  name 'PlayerWallet'

  field :id, !types.ID
  field :consumables, !types[!Types::ConsumableAmountType]

  connection :transferables, Types::TransferableType.connection_type
end

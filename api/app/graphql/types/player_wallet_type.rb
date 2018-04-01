Types::PlayerWalletType = GraphQL::ObjectType.define do
  name 'PlayerWallet'

  field :consumables, !types[!Types::ConsumableAmountType]
  connection :transferables, Types::TransferableType.connection_type
end

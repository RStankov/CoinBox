Types::ConsumableAmountType = GraphQL::ObjectType.define do
  name 'ConsumableAmount'

  field :amount, !types.Int
  field :consumable, Types::ConsumableType
end

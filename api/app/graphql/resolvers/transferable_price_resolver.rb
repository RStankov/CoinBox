class Resolvers::TransferablePriceResolver < GraphQL::Function
  type do
    name 'TransferablePrice'

    field :amount, !types.Int
    field :consumable, Types::ConsumableType
  end

  def call(obj, _args, _ctx)
    consumable = obj.game.consumables.where(primary: true).first

    if consumable
      OpenStruct.new(
        amount: (obj.value.to_f / consumable.value).round,
        consumable: consumable,
      )
    else
      OpenStruct.new(
        amount: obj.amount,
        consumable: nil,
      )
    end
  end
end
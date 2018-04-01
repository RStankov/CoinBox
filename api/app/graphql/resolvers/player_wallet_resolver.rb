class Resolvers::PlayerWalletResolver < GraphQL::Function
  type Types::PlayerWalletType

  def call(obj, _args, ctx)
    return nil if obj != ctx[:current_player]

    # TODO(rstankov): User ledger api
    OpenStruct.new(
      transferables: obj.game.transferables,
      consumables: obj.game.consumables.map do |c|
        OpenStruct.new amount: 10, consumable: c
      end
    )
  end
end

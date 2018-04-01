class Resolvers::PlayerWalletResolver < GraphQL::Function
  type do
    name 'Wallet'

    # TODO(rstankov): Expose consumables
    connection :transferables, Types::TransferableType.connection_type
  end

  def call(obj, _args, ctx)
    return nil if obj != ctx[:current_player]

    # TODO(rstankov): User ledger
    OpenStruct.new(
      transferables: obj.game.transferables
    )
  end
end

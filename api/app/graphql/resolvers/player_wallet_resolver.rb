class Resolvers::PlayerWalletResolver < GraphQL::Function
  type Types::PlayerWalletType

  def call(obj, _args, ctx)
    return nil if obj != ctx[:current_player]

    PlayerWallet.new(ctx[:current_player])
  end
end

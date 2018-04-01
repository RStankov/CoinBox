class Mutations::TransferableBuy < Resolvers::Mutation
  input :transferable_id, !types.ID
  input :consumable_id, !types.ID

  returns Types::PlayerWalletType

  require_payer

  def perform
    transferable = current_game.transferables.find_by! identifier: inputs[:transferable_id]
    consumable = current_game.consumables.find_by! identifier: inputs[:consumable_id]

    Ledger.buy(
      player: current_player,
      transferable: transferable,
      consumable: consumable,
      amount: consumable.amount_for_transfarable(transferable)
    )

    PlayerWallet.new(current_player)
  end
end

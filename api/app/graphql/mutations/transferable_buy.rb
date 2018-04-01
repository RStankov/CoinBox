class Mutations::TransferableBuy < Resolvers::Mutation
  input :transferable_id, !types.ID
  input :consumable_id, !types.ID

  returns Types::PlayerWalletType

  require_payer

  def perform
    transferable = current_game.transferables.find_by! identifier: inputs[:transferable_id]
    consumable = current_game.consumables.find_by! identifier: inputs[:consumable_id]

    player_id = current_player.id,
    transferable_id = transferable.id
    consumable_id = consumable.id
    amount = consumable.amount_for_transfarable(transferable)

    # TODO(rstankov): LedgerApi.buy(payer_id, transferable_id, consumable_id, amount)

    PlayerWallet.new(current_player)
  end
end

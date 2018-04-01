class Mutations::WalletReceive < Resolvers::Mutation
  TransferableInput = GraphQL::InputObjectType.define do
    name 'WalletReceiveTransferableInput'

    argument :id, !types.ID
  end

  ConsumableInput = GraphQL::InputObjectType.define do
    name 'WalletReceiveConsumableInput'

    argument :id, !types.ID
    argument :amount, !types.Int
  end

  input :transferables, types[!TransferableInput]
  input :consumables, types[!ConsumableInput]

  returns Types::PlayerWalletType

  require_payer

  def perform
    player_id = current_player.id

    (inputs[:transferables] || []).each do |input|
      transferable = current_game.transferables.find_by! identifier: input[:id]
      # TODO(rstankov): LedgerApi.give_transferable(player_id, transferable.id)
    end

    (inputs[:consumables] || []).each do |input|
      consumable = current_game.consumables.find_by! identifier: input[:id]
      # TODO(rstankov): LedgerApi.give_consumable(player_id, consumable.id, input[:amount])
    end

    PlayerWallet.new(current_player)
  end
end

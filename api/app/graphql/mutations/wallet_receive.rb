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
    ActiveRecord::Base.transaction do
      (inputs[:transferables] || []).each do |input|
        transferable = current_game.transferables.find_by! identifier: input[:id]
        Ledger.give_transferable(
          player: current_player,
          transferable: transferable,
        )
      end

      (inputs[:consumables] || []).each do |input|
        consumable = current_game.consumables.find_by! identifier: input[:id]
        Ledger.give_consumable(
          player: current_player,
          consumable: consumable,
          amount: input[:amount]
        )
      end
    end

    PlayerWallet.new(current_player)
  end
end

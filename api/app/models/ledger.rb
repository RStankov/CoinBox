# TODO(rstankov): Replace cache with Hyperledger API
module Ledger
  extend self

  Amount = Struct.new(:consumable, :amount)

  def fetch_consumables(player:)
    consumables = []
    PlayerWalletCache.for(player).consumables.each do |(id, amount)|
      consumable = player.game.consumables.find_by identifier: id
      consumables << Amount.new(consumable, amount || 0) if consumable
    end
    consumables
  end

  def fetch_transferables(player:)
    PlayerWalletCache.for(player).transferables.map do |id|
      player.game.transferables.find_by identifier: id
    end.compact
  end

  def buy(player:, transferable:, consumable:, amount:)
    cache = PlayerWalletCache.for(player)

    cache.consumables[consumable.identifier] ||= 0
    cache.consumables[consumable.identifier] -= amount
    raise 'ledger error' if cache.consumables[consumable.identifier] < 0

    cache.transferables << transferable.identifier
    cache.save!
  end

  def sell(player:, transferable:, consumable:, amount:)
    cache = PlayerWalletCache.for(player)

    index = cache.transferables.index(transferable.identifier)

    raise 'ledger error' if index.nil?

    cache.transferables.delete_at(index)

    cache.consumables[consumable.identifier] ||= 0
    cache.consumables[consumable.identifier] += amount

    cache.save!
  end

  def give_transferable(player:, transferable:)
    cache = PlayerWalletCache.for(player)
    cache.transferables << transferable.identifier
    cache.save!
  end

  def give_consumable(player:, consumable:, amount:)
    cache = PlayerWalletCache.for(player)
    cache.consumables[consumable.identifier] ||= 0
    cache.consumables[consumable.identifier] += amount
    cache.save!
  end
end

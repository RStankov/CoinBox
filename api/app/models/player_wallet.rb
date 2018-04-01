class PlayerWallet
  attr_reader :player

  delegate :id, to: :player

  def initialize(player)
    @player = player
  end

  def transferables
    Ledger.fetch_transferables(player: player)
  end

  def consumables
    Ledger.fetch_consumables(player: player)
  end
end

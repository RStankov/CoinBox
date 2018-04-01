class PlayerWallet
  attr_reader :player

  delegate :id, to: :player

  def initialize(player)
    @player = player
  end

  def transferables
    # TODO(rstankov): User ledger api
    @transferables ||= player.game.transferables
  end

  def consumables
    # TODO(rstankov): User ledger api
    @consumables ||= player.game.consumables.map do |c|
      Amount.new c, 10
    end
  end

  Amount = Struct.new(:consumable, :amount)
end

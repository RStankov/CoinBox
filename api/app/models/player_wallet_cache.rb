# == Schema Information
#
# Table name: player_wallet_caches
#
#  id            :integer          not null, primary key
#  player_id     :uuid             not null
#  consumables   :jsonb            not null
#  transferables :jsonb            not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

class PlayerWalletCache < ApplicationRecord
  belongs_to :player, inverse_of: :player_wallet_cache

  def self.for(player)
    find_or_create_by! player_id: player.id
  end
end

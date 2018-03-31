# == Schema Information
#
# Table name: consumables
#
#  id         :uuid             not null, primary key
#  game_id    :uuid             not null
#  identifier :string           not null
#  name       :string           not null
#  value      :integer          default(0), not null
#  tradeable  :boolean          default(FALSE), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Consumable < ApplicationRecord
  belongs_to :game, inverse_of: :consumables, counter_cache: true

  validates :identifier, presence: true, uniqueness: { scope: :game_id }
  validates :name, presence: true, uniqueness: { scope: :game_id }

  has_one_attached :image

  delegate :account, to: :game
end

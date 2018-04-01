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
#  primary    :boolean          default(FALSE), not null
#

class Consumable < ApplicationRecord
  belongs_to :game, inverse_of: :consumables, counter_cache: true

  validates :identifier, presence: true, uniqueness: { scope: :game_id }
  validates :name, presence: true, uniqueness: { scope: :game_id }

  has_one_attached :image

  delegate :account, to: :game

  scope :ordered, -> { order(identifier: :desc) }

  after_save :ensure_only_one_primary

  private

  def ensure_only_one_primary
    return unless primary?

    game.consumables.where.not(id: id).where(primary: true).update_all primary: false
  end
end

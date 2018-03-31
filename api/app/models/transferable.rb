# == Schema Information
#
# Table name: transferables
#
#  id         :integer          not null, primary key
#  game_id    :uuid             not null
#  identifier :string           not null
#  name       :string           not null
#  value      :integer          default(0), not null
#  properties :jsonb            not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Transferable < ApplicationRecord
  belongs_to :game, inverse_of: :transferables

  validates :identifier, presence: true, uniqueness: { scope: :game_id }
  validates :name, presence: true

  has_one_attached :image

  delegate :account, to: :game
end

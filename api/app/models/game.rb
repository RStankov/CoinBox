# == Schema Information
#
# Table name: games
#
#  id             :uuid             not null, primary key
#  account_id     :integer          not null
#  name           :string           not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  api_keys_count :integer          default(0), not null
#

class Game < ApplicationRecord
  belongs_to :account, inverse_of: :games

  has_many :api_keys, class_name: 'GameApiKey', inverse_of: :game, dependent: :destroy
  has_many :consumables, inverse_of: :game, dependent: :destroy

  has_one_attached :icon

  validates :name, presence: true, uniqueness: { scope: :account }

  attr_readonly :account_id
end

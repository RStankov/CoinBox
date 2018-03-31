# == Schema Information
#
# Table name: game_api_keys
#
#  id           :uuid             not null, primary key
#  game_id      :uuid             not null
#  name         :string           not null
#  token        :string           not null
#  last_used_at :datetime
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

class GameApiKey < ApplicationRecord
  belongs_to :game, inverse_of: :api_keys, counter_cache: 'api_keys_count'

  validates :name, presence: true
  validates :token, presence: true, uniqueness: true

  attr_readonly :game_id, :token

  before_validation :generate_token, on: :create

  private

  def generate_token
    self.token ||= GenerateToken.call(model: self, attribute_name: :token, length: 40)
  end
end

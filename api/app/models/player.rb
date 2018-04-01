# == Schema Information
#
# Table name: players
#
#  id                     :uuid             not null, primary key
#  game_id                :uuid             not null
#  username               :string           not null
#  properties             :jsonb            not null
#  email                  :string           not null
#  encrypted_password     :string           not null
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default(0), not null
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :inet
#  last_sign_in_ip        :inet
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  access_token           :string
#

class Player < ApplicationRecord
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :trackable, :validatable

  belongs_to :game, inverse_of: :players, counter_cache: true

  validates :username, presence: true, uniqueness: { scope: :game_id }

  delegate :account, to: :game

  def generate_access_token
    update! access_token: GenerateToken.call(model: self, attribute_name: :access_token, length: 20)
  end
end

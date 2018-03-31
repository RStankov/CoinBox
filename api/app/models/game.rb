# == Schema Information
#
# Table name: games
#
#  id         :uuid             not null, primary key
#  account_id :integer          not null
#  name       :string           not null
#

class Game < ApplicationRecord
  belongs_to :account, inverse_of: :games

  validates :name, presence: true, uniqueness: { scope: :account }

  attr_readonly :account_id
end

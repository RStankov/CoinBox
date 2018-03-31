# == Schema Information
#
# Table name: accounts
#
#  id         :integer          not null, primary key
#  user_id    :integer          not null
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Account < ApplicationRecord
  belongs_to :user, inverse_of: :account

  has_many :games, inverse_of: :account, dependent: :destroy

  validates :name, presence: true, uniqueness: true

  attr_readonly :user_id
end

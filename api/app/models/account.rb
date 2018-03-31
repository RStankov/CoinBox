# == Schema Information
#
# Table name: accounts
#
#  id      :integer          not null, primary key
#  user_id :integer          not null
#  name    :string           not null
#

class Account < ApplicationRecord
  belongs_to :user, inverse_of: :account

  validates :name, presence: true, uniqueness: true
end

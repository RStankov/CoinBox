class AddAccessTokenToPlayers < ActiveRecord::Migration[5.2]
  def change
    add_column :players, :access_token, :string, null: true, index: { unique: true }
  end
end

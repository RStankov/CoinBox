class CreateGames < ActiveRecord::Migration[5.2]
  def change
    create_table :games, id: :uuid do |t|
      t.references :account, null: false, foreign_key: true, index: true
      t.string :name, null: false
    end

    add_index :games, %i(account_id name), unique: true
  end
end

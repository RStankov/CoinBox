class CreateGameApiKeys < ActiveRecord::Migration[5.2]
  def change
    create_table :game_api_keys, id: :uuid do |t|
      t.references :game, null: false, foreign_key: true, index: true, type: :uuid
      t.string :name, null: false
      t.string :token, null: false, index: { unique: true }
      t.datetime :last_used_at
      t.timestamps null: false
    end

    add_column :games, :api_keys_count, :integer, default: 0, null: false
  end
end

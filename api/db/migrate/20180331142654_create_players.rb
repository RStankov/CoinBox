class CreatePlayers < ActiveRecord::Migration[5.2]
  def change
    create_table :players, id: :uuid do |t|
      t.references :game, null: false, foreign_key: true, index: true, type: :uuid
      t.string :username, null: false
      t.jsonb :properties, null: false, default: {}

      ## Database authenticatable
      t.string :email,              null: false
      t.string :encrypted_password, null: false

      ## Recoverable
      t.string   :reset_password_token
      t.datetime :reset_password_sent_at

      ## Rememberable
      t.datetime :remember_created_at

      ## Trackable
      t.integer  :sign_in_count, default: 0, null: false
      t.datetime :current_sign_in_at
      t.datetime :last_sign_in_at
      t.inet     :current_sign_in_ip
      t.inet     :last_sign_in_ip
      t.timestamps null: false
    end

    add_index :players, %i(game_id email), unique: true
    add_column :games, :players_count, :integer, default: 0, null: false
  end
end

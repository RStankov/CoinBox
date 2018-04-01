class CreatePlayerWalletCache < ActiveRecord::Migration[5.2]
  def change
    create_table :player_wallet_caches do |t|
      t.references :player, null: false, foreign_key: true, index: { unique: true }, type: :uuid
      t.jsonb :consumables, null: false, default: {}
      t.jsonb :transferables, null: false, default: []
      t.timestamps null: false
    end
  end
end

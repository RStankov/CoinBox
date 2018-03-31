class CreateTransferables < ActiveRecord::Migration[5.2]
  def change
    create_table :transferables, id: :uuid do |t|
      t.references :game, null: false, foreign_key: true, index: true, type: :uuid
      t.string :identifier, null: false
      t.string :name, null: false
      t.integer :value, null: false, default: 0
      t.jsonb :properties, null: false, default: {}
      t.timestamps null: false
    end

    add_index :transferables, %i(game_id identifier), unique: true
    add_column :games, :transferables_count, :integer, default: 0, null: false
  end
end

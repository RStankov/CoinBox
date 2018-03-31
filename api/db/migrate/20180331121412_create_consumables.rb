class CreateConsumables < ActiveRecord::Migration[5.2]
  def change
    create_table :consumables, id: :uuid do |t|
      t.references :game, null: false, foreign_key: true, index: true, type: :uuid
      t.string :identifier, null: false
      t.string :name, null: false
      t.integer :value, null: false, default: 0
      t.boolean :tradeable, null: false, default: false
      t.timestamps null: false
    end

    add_index :consumables, %i(game_id identifier), unique: true
    add_index :consumables, %i(game_id name), unique: true
    add_column :games, :consumables_count, :integer, default: 0, null: false
  end
end

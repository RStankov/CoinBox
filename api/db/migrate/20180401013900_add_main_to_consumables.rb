class AddMainToConsumables < ActiveRecord::Migration[5.2]
  def change
    add_column :consumables, :primary, :boolean, default: false, null: false, index: true
  end
end

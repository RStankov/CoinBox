class AddShowInStoreToTransferables < ActiveRecord::Migration[5.2]
  def change
    add_column :transferables, :purchasable, :boolean, default: false, null: false
  end
end

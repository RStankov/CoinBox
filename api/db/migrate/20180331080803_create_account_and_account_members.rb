class CreateAccountAndAccountMembers < ActiveRecord::Migration[5.2]
  def change
    create_table :accounts do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false, index: { unique: true }
    end
  end
end

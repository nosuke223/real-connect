class AddIndexToCreatedAt < ActiveRecord::Migration[5.2]
  def change
    add_index :messages, :created_at
    add_index :place_users, :created_at
  end
end

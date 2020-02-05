class CreatePlaceUsers < ActiveRecord::Migration[5.1]
  def change
    create_table :place_users do |t|
      t.integer  :place_id
      t.integer  :user_id

      t.timestamps
      t.datetime :deleted_at
    end

    add_index :place_users, :place_id
    add_index :place_users, :user_id
    add_index :place_users, :deleted_at
  end
end

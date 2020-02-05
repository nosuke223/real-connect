class CreateEventUsers < ActiveRecord::Migration[5.1]
  def change
    create_table :event_users do |t|
      t.integer  :event_id
      t.integer  :user_id
      t.datetime :checked_out_at

      t.timestamps
      t.datetime :deleted_at
    end

    add_index :event_users, :event_id
    add_index :event_users, :user_id
    add_index :event_users, :deleted_at
  end
end

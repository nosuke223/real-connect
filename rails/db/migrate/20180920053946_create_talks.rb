class CreateTalks < ActiveRecord::Migration[5.2]
  def change
    create_table :talks do |t|
      t.integer :user_id, null: false
      t.integer :partner_id, null: false
      t.integer :event_id, null: false
      t.integer :last_message_id
      t.datetime :last_read_at
      t.datetime :deleted_at
      t.timestamps
    end

    add_index :talks, :user_id
    add_index :talks, :partner_id
    add_index :talks, :event_id
    add_index :talks, :deleted_at
  end
end

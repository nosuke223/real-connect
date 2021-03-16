class CreatePlaceTalks < ActiveRecord::Migration[5.2]
  def change
    create_table :place_talks do |t|
      t.integer :user_id, null: false
      t.integer :partner_id, null: false
      t.integer :place_id, null: false
      t.integer :last_message_id
      t.datetime :last_read_at
      t.datetime :deleted_at
      t.timestamps
    end

    add_index :place_talks, :user_id
    add_index :place_talks, :partner_id
    add_index :place_talks, :place_id
    add_index :place_talks, :deleted_at
  end
end

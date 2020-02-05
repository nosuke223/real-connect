class CreateMessages < ActiveRecord::Migration[5.1]
  def change
    create_table :messages do |t|
      t.integer  :event_id, null: false
      t.integer  :sender_id, null: false
      t.integer  :partner_id, null: false
      t.string   :body
      t.string   :image

      t.timestamps
      t.datetime :deleted_at
    end

    add_index :messages, :event_id
    add_index :messages, :sender_id
    add_index :messages, :partner_id
    add_index :messages, :deleted_at
  end
end

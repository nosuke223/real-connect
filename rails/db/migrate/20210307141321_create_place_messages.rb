class CreatePlaceMessages < ActiveRecord::Migration[5.1]
  def change
    create_table :place_messages do |t|
      t.integer  :place_id, null: false
      t.integer  :sender_id, null: false
      t.integer  :partner_id, null: false
      t.string   :body
      t.string   :image

      t.timestamps
      t.datetime :deleted_at

      t.string   :sender_nickname, :string
      t.string   :partner_nickname, :string
    end

    add_index :place_messages, :place_id
    add_index :place_messages, :sender_id
    add_index :place_messages, :partner_id
    add_index :place_messages, :deleted_at
  end
end

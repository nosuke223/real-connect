class CreateEventPlaces < ActiveRecord::Migration[5.2]
  def change
    create_table :event_places do |t|
      t.integer  :event_id
      t.integer  :place_id

      t.timestamps
      t.datetime :deleted_at
    end

    add_index :event_places, :event_id
    add_index :event_places, :place_id
    add_index :event_places, :deleted_at
  end
end

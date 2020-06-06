class CreateEventCheckInHistories < ActiveRecord::Migration[5.2]
  def change
    create_table :event_check_in_histories do |t|
      t.integer :event_id, null: false
      t.integer :user_id, null: false
      t.datetime :checked_in_at
      t.datetime :checked_out_at

      t.timestamps
    end
  end
end

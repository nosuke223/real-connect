class CreateEvents < ActiveRecord::Migration[5.1]
  def change
    create_table :events do |t|
      t.integer  :area_id
      t.string   :name
      t.string   :check_in_code
      t.datetime :start_time
      t.datetime :end_time

      t.timestamps
      t.datetime :deleted_at
    end

    add_index :events, :deleted_at
  end
end

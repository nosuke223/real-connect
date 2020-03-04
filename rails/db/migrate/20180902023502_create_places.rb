class CreatePlaces < ActiveRecord::Migration[5.1]
  def change
    create_table :places do |t|
      t.integer  :owner_id
      t.string   :name
      t.integer  :area_id
      t.string   :address
      t.string   :building
      t.string   :telephone
      t.string   :url
      t.string   :logo_image
      t.string   :cover_image
      t.string   :store_type
      t.string   :description
      t.string   :note
      t.integer  :seat_status, default: 1000, null: false

      t.time :sun_start_at
      t.time :sun_end_at
      t.boolean  :is_sun_holiday, default: false, null: false

      t.time :mon_start_at
      t.time :mon_end_at
      t.boolean  :is_mon_holiday, default: false, null: false

      t.time :tue_start_at
      t.time :tue_end_at
      t.boolean  :is_tue_holiday, default: false, null: false

      t.time :wed_start_at
      t.time :wed_end_at
      t.boolean  :is_wed_holiday, default: false, null: false

      t.time :thu_start_at
      t.time :thu_end_at
      t.boolean  :is_thu_holiday, default: false, null: false

      t.time :fri_start_at
      t.time :fri_end_at
      t.boolean  :is_fri_holiday, default: false, null: false

      t.time :sat_start_at
      t.time :sat_end_at
      t.boolean  :is_sat_holiday, default: false, null: false

      t.timestamps
      t.datetime :deleted_at
    end

    add_index :places, :owner_id
    add_index :places, :area_id
    add_index :places, :deleted_at
  end
end

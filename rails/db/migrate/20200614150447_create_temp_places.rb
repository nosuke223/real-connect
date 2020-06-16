class CreateTempPlaces < ActiveRecord::Migration[5.2]
  def change
    create_table :temp_places do |t|
      t.integer :owner_id
      t.string :name
      t.integer :area_id
      t.string :address1
      t.string :telephone
      t.string :url
      t.string :logo_image
      t.string :cover_image
      t.string :store_type
      t.string :description
      t.string :note
      t.integer :seat_status
      t.time :sun_start_at
      t.time :sun_end_at
      t.boolean :is_sun_holiday
      t.time :mon_start_at
      t.time :mon_end_at
      t.boolean :is_mon_holiday
      t.time :tue_start_at
      t.time :tue_end_at
      t.boolean :is_tue_holiday
      t.time :wed_start_at
      t.time :wed_end_at
      t.boolean :is_wed_holiday
      t.time :thu_start_at
      t.time :thu_end_at
      t.boolean :is_thu_holiday
      t.time :fri_start_at
      t.time :fri_end_at
      t.boolean :is_fri_holiday
      t.time :sat_start_at
      t.time :sat_end_at
      t.boolean :is_sat_holiday
      t.datetime :deleted_at
      t.integer :place_users_count
      t.string :zipcode
      t.string :address2
      t.string :address3
      t.boolean :payment_flag
      t.datetime :last_payment_at
      t.string :application_comment
      t.integer :application_status
      t.string :application_email

      t.timestamps
    end

  add_index :temp_places, :deleted_at
  end
end

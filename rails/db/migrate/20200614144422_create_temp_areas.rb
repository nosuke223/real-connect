class CreateTempAreas < ActiveRecord::Migration[5.2]
  def change
    create_table :temp_areas do |t|
      t.string :name
      t.integer :prefecture_id
      t.datetime :deleted_at
      t.string :zipcode
      t.string :application_comment
      t.integer :application_status
      t.string :application_email

      t.timestamps
    end

  add_index :temp_areas, :deleted_at
  end
end

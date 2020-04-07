class CreatePrefectures < ActiveRecord::Migration[5.2]
  def change
    create_table :prefectures do |t|
      t.integer :region_id
      t.string :code
      t.string :name
      t.string :kana

      t.timestamps
    end
  end
end

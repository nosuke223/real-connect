class CreateAreas < ActiveRecord::Migration[5.2]
  def change
    create_table :areas do |t|
      t.string   :name
      t.integer :prefecture

      t.timestamps
      t.datetime :deleted_at
    end

    add_index :areas, :deleted_at
  end
end

class ChangeColumnPrefectureOfAreas < ActiveRecord::Migration[5.2]
  def up
    rename_column :areas, :prefecture, :prefecture_id
    change_column :areas, :prefecture_id, :bigint
  end

  def down
    rename_column :areas, :prefecture_id, :prefecture
    change_column :areas, :prefecture, :int
  end

end

class ChangeColumnPrefectureOfUsers < ActiveRecord::Migration[5.2]
  def up
    rename_column :users, :prefecture, :prefecture_id
    change_column :users, :prefecture_id, :bigint
  end

  def down
    rename_column :users, :prefecture_id, :prefecture
    change_column :users, :prefecture, :int
  end
end

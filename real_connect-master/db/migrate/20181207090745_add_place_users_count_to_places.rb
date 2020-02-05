class AddPlaceUsersCountToPlaces < ActiveRecord::Migration[5.2]
  def self.up
    add_column :places, :place_users_count, :integer, null: false, default: 0
  end

  def self.down
    remove_column :places, :place_users_count
  end
end

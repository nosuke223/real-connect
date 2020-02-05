class AddPlaceIdToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :current_place_id, :integer
    add_column :users, :last_place_id, :integer
  end
end

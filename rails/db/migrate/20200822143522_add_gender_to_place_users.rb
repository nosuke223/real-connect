class AddGenderToPlaceUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :place_users, :gender, :integer
  end
end

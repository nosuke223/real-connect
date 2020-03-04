class AddAgeToPlaceUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :place_users, :age, :integer
  end
end

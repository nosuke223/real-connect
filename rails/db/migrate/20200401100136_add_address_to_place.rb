class AddAddressToPlace < ActiveRecord::Migration[5.2]
  def up
    rename_column :places, :address, :address1
    add_column :places, :zipcode, :string, :limit => 8
    add_column :places, :address2, :string
    add_column :places, :address3, :string
    remove_column :places, :building
  end

  def down
    add_column :places, :building, :string
    rename_column :places, :address1, :address
    remove_column :places, :zipcode
    remove_column :places, :address2
    remove_column :places, :address3
  end
end

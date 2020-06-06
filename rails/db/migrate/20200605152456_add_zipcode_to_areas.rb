class AddZipcodeToAreas < ActiveRecord::Migration[5.2]
  def change
    add_column :areas, :zipcode, :string
  end
end

class AddMunicipalityToAreaAndTempArea < ActiveRecord::Migration[5.2]
  def change
    add_column :areas, :municipality, :string
    add_column :temp_areas, :municipality, :string
  end
end

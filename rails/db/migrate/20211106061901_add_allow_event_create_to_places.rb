class AddAllowEventCreateToPlaces < ActiveRecord::Migration[5.2]
  def change
    add_column :places, :allow_event_create, :boolean, default: true, null: false
  end
end

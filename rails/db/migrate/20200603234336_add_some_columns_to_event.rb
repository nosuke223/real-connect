class AddSomeColumnsToEvent < ActiveRecord::Migration[5.2]
  def change
    add_column :events, :organizer_type, :integer
    add_column :events, :organize_place_id, :integer
    add_column :events, :organize_user_id, :integer
    add_column :events, :organizer_name, :string
    add_column :events, :detail, :string
    add_column :events, :capacity, :string
  end
end

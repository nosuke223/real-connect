class AddColumnToEvent < ActiveRecord::Migration[5.2]
  def change
    add_column :events, :event_status_id, :integer
  end
end

class CreateEventStatuses < ActiveRecord::Migration[5.2]
  def up
    create_table :event_statuses do |t|
      t.string :name , null: false, default: ''

      t.timestamps
    end
  end
  
  def down
    drop_table :event_statuses
  end
end

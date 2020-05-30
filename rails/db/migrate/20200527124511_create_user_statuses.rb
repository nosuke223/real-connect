class CreateUserStatuses < ActiveRecord::Migration[5.2]
  def up
    create_table :user_statuses do |t|
      t.string :name , null: false, default: ''

      t.timestamps
    end
  end

  def down
    drop_table :user_statuses
  end
end

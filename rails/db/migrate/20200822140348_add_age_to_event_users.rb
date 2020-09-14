class AddAgeToEventUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :event_users, :age, :integer
  end
end

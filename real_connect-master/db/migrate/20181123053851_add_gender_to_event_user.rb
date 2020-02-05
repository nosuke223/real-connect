class AddGenderToEventUser < ActiveRecord::Migration[5.2]
  def change
    add_column :event_users, :gender, :integer
  end
end

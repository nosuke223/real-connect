class AddFromToEvent < ActiveRecord::Migration[5.2]
  def change
    add_column :events, :from, :integer
    add_column :events, :to, :integer
  end
end

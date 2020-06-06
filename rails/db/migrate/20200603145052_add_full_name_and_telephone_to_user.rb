class AddFullNameAndTelephoneToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :full_name, :string
    add_column :users, :telephone, :string
  end
end

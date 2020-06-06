class AddColumnsForPaymentToPlace < ActiveRecord::Migration[5.2]
  def change
    add_column :places, :payment_flag, :boolean
    add_column :places, :last_payment_at, :datetime
  end
end

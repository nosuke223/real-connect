class AddSenderNicknameAndPartnerNicknameToMessage < ActiveRecord::Migration[5.2]
  def change
    add_column :messages, :sender_nickname, :string
    add_column :messages, :partner_nickname, :string
  end
end

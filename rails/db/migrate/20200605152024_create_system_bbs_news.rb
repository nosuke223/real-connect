class CreateSystemBbsNews < ActiveRecord::Migration[5.2]
  def change
    create_table :system_bbs_news do |t|
      t.string :detail, null: false, default: ''
      t.boolean :display_flag

      t.timestamps
    end
  end
end

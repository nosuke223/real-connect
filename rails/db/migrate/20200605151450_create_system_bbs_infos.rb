class CreateSystemBbsInfos < ActiveRecord::Migration[5.2]
  def change
    create_table :system_bbs_infos do |t|
      t.string :detail, null: false, default: ''
      t.boolean :display_flag

      t.timestamps
    end
  end
end

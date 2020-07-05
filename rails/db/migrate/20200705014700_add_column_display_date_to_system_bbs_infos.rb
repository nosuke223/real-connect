# frozen_string_literal: true

class AddColumnDisplayDateToSystemBbsInfos < ActiveRecord::Migration[5.2]
  def change
    add_column :system_bbs_infos, :display_date, :date
  end
end

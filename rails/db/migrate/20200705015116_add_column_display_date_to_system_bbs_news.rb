# frozen_string_literal: true

class AddColumnDisplayDateToSystemBbsNews < ActiveRecord::Migration[5.2]
  def change
    add_column :system_bbs_news, :display_date, :date
  end
end

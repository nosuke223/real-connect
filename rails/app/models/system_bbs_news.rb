# frozen_string_literal: true

# == Schema Information
#
# Table name: system_bbs_news
#
#  id           :bigint(8)        not null, primary key
#  detail       :string           default(""), not null
#  display_date :date
#  display_flag :boolean
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

class SystemBbsNews < ApplicationRecord
  include CommonModule
  # -------------------------------------------------------------------------------
  # validation
  # -------------------------------------------------------------------------------
  validates :detail, presence: true
  validates :display_date, presence: true
end

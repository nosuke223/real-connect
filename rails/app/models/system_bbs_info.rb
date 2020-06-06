# == Schema Information
#
# Table name: system_bbs_infos
#
#  id           :bigint(8)        not null, primary key
#  detail       :string           default(""), not null
#  display_flag :boolean
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

class SystemBbsInfo < ApplicationRecord
end

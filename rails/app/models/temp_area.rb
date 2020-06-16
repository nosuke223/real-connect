# == Schema Information
#
# Table name: temp_areas
#
#  id                  :bigint(8)        not null, primary key
#  application_comment :string
#  application_email   :string
#  application_status  :integer
#  deleted_at          :datetime
#  name                :string
#  zipcode             :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  prefecture_id       :integer
#
# Indexes
#
#  index_temp_areas_on_deleted_at  (deleted_at)
#

class TempArea < ApplicationRecord
  acts_as_paranoid
end

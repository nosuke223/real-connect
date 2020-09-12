# == Schema Information
#
# Table name: prefectures
#
#  id         :bigint(8)        not null, primary key
#  code       :string
#  name       :string
#  kana       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  region_id  :integer
#

class Prefecture < ApplicationRecord
  belongs_to :region
  has_many :areas
end

# == Schema Information
#
# Table name: areas
#
#  id            :bigint(8)        not null, primary key
#  deleted_at    :datetime
#  name          :string
#  zipcode       :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  prefecture_id :bigint(8)
#
# Indexes
#
#  index_areas_on_deleted_at  (deleted_at)
#

class Area < ApplicationRecord
  acts_as_paranoid
  include CommonModule

  # -------------------------------------------------------------------------------
  # Relations
  # -------------------------------------------------------------------------------
  has_many :events
  has_many :places
  belongs_to :prefecture, class_name: :Prefecture , foreign_key: :prefecture_id , primary_key: :id, optional: true

  # -------------------------------------------------------------------------------
  # validation
  # -------------------------------------------------------------------------------
  validates :name, presence: true
  validates :zipcode, allow_blank: true, format: {with: /\A[0-9]{3}-[0-9]{4}\z/}
end

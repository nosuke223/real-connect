# frozen_string_literal: true
# == Schema Information
#
# Table name: temp_areas
#
#  id                  :bigint(8)        not null, primary key
#  application_comment :string
#  application_email   :string
#  application_status  :integer
#  deleted_at          :datetime
#  municipality        :string
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
  include CommonModule

  # -------------------------------------------------------------------------------
  # Relations
  # -------------------------------------------------------------------------------
  belongs_to :prefecture, class_name: :Prefecture, foreign_key: :prefecture_id, primary_key: :id, optional: true

  # -------------------------------------------------------------------------------
  # validation
  # -------------------------------------------------------------------------------
  validates :name, presence: true
  validates :zipcode, allow_blank: true, format: { with: /\A[0-9]{3}[0-9]{4}\z/ }
end

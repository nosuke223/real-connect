# frozen_string_literal: true

# == Schema Information
#
# Table name: temp_places
#
#  id                  :bigint(8)        not null, primary key
#  address1            :string
#  address2            :string
#  address3            :string
#  application_comment :string
#  application_email   :string
#  application_status  :integer
#  cover_image         :string
#  deleted_at          :datetime
#  description         :string
#  fri_end_at          :time
#  fri_start_at        :time
#  is_fri_holiday      :boolean
#  is_mon_holiday      :boolean
#  is_sat_holiday      :boolean
#  is_sun_holiday      :boolean
#  is_thu_holiday      :boolean
#  is_tue_holiday      :boolean
#  is_wed_holiday      :boolean
#  last_payment_at     :datetime
#  logo_image          :string
#  mon_end_at          :time
#  mon_start_at        :time
#  name                :string
#  note                :string
#  payment_flag        :boolean
#  place_users_count   :integer
#  sat_end_at          :time
#  sat_start_at        :time
#  seat_status         :integer
#  store_type          :string
#  sun_end_at          :time
#  sun_start_at        :time
#  telephone           :string
#  thu_end_at          :time
#  thu_start_at        :time
#  tue_end_at          :time
#  tue_start_at        :time
#  url                 :string
#  wed_end_at          :time
#  wed_start_at        :time
#  zipcode             :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  area_id             :integer
#  owner_id            :integer
#
# Indexes
#
#  index_temp_places_on_deleted_at  (deleted_at)
#

class TempPlace < ApplicationRecord
  acts_as_paranoid
  include CommonModule
  belongs_to :area

  # -------------------------------------------------------------------------------
  # validation
  # -------------------------------------------------------------------------------
  validates :application_comment, presence: true
  validates :application_email, presence: true
end

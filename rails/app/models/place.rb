# == Schema Information
#
# Table name: places
#
#  id                :bigint(8)        not null, primary key
#  address1          :string
#  address2          :string
#  address3          :string
#  cover_image       :string
#  deleted_at        :datetime
#  description       :string
#  fri_end_at        :time
#  fri_start_at      :time
#  is_fri_holiday    :boolean          default(FALSE), not null
#  is_mon_holiday    :boolean          default(FALSE), not null
#  is_sat_holiday    :boolean          default(FALSE), not null
#  is_sun_holiday    :boolean          default(FALSE), not null
#  is_thu_holiday    :boolean          default(FALSE), not null
#  is_tue_holiday    :boolean          default(FALSE), not null
#  is_wed_holiday    :boolean          default(FALSE), not null
#  logo_image        :string
#  mon_end_at        :time
#  mon_start_at      :time
#  name              :string
#  note              :string
#  place_users_count :integer          default(0), not null
#  sat_end_at        :time
#  sat_start_at      :time
#  seat_status       :integer          default("open"), not null
#  store_type        :string
#  sun_end_at        :time
#  sun_start_at      :time
#  telephone         :string
#  thu_end_at        :time
#  thu_start_at      :time
#  tue_end_at        :time
#  tue_start_at      :time
#  url               :string
#  wed_end_at        :time
#  wed_start_at      :time
#  zipcode           :string(8)
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  area_id           :integer
#  owner_id          :integer
#
# Indexes
#
#  index_places_on_area_id     (area_id)
#  index_places_on_deleted_at  (deleted_at)
#  index_places_on_owner_id    (owner_id)
#

class Place < ApplicationRecord
  acts_as_paranoid
  mount_uploader :logo_image, PlaceLogoImageUploader
  mount_uploader :cover_image, PlaceCoverImageUploader
  
  # -------------------------------------------------------------------------------
  # Relations
  # -------------------------------------------------------------------------------
  belongs_to :owner, class_name: 'User', foreign_key: 'owner_id'
  belongs_to :area
  has_many :place_users
  has_many :users, through: :place_users
  has_many :event_places
  has_many :events, through: :event_places


  # -------------------------------------------------------------------------------
  # Enumerables
  # -------------------------------------------------------------------------------
  enum seat_status: {
    open: 1000, # 空席あり
    few:  2000, # もうすぐ満席
    full: 3000  # 満席
  }

end

# == Schema Information
#
# Table name: events
#
#  id                :bigint(8)        not null, primary key
#  capacity          :string
#  check_in_code     :string
#  deleted_at        :datetime
#  detail            :string
#  end_time          :datetime
#  name              :string
#  organizer_name    :string
#  organizer_type    :integer
#  start_time        :datetime
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  area_id           :integer
#  event_status_id   :integer
#  organize_place_id :integer
#  organize_user_id  :integer
#
# Indexes
#
#  index_events_on_deleted_at  (deleted_at)
#

class Event < ApplicationRecord
  acts_as_paranoid

  # -------------------------------------------------------------------------------
  # Relations
  # -------------------------------------------------------------------------------
  belongs_to :area
  has_many :event_places
  has_many :places, through: :event_places
  has_many :event_users
  has_many :users, through: :event_users
  has_many :talks

  accepts_nested_attributes_for :places, :allow_destroy => true

  # -------------------------------------------------------------------------------
  # Callbacks
  # -------------------------------------------------------------------------------
  before_save :set_check_in_code

  # -------------------------------------------------------------------------------
  # Scopes
  # -------------------------------------------------------------------------------
  scope :now, -> (area_id = nil) {
    now = Time.zone.now
    
    events = self
      .eager_load(:event_users)
      .where('start_time <= ?', now)
      .where('end_time >= ?', now)

    events = events.where(area_id: area_id) if area_id.present?
    events
  }

  scope :past, -> (area_id) {
    now = Time.zone.now
    self
      .eager_load(:event_users)
      .where(area_id: area_id)
      .where('end_time <= ?', now)
      .where('end_time >= ?', now.yesterday)
  }

  def male_count
    event_users.select { |eu| eu.male? }.count
  end

  def female_count
    event_users.select { |eu| eu.female? }.count
  end

  private

  def set_check_in_code
    self.check_in_code ||= (('A'..'Z').to_a).sample(4).join
  end
end

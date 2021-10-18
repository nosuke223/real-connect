# frozen_string_literal: true
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
#  from              :integer
#  name              :string
#  organizer_name    :string
#  organizer_type    :integer
#  start_time        :datetime
#  to                :integer
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
  include CommonModule

  # -------------------------------------------------------------------------------
  # Relations
  # -------------------------------------------------------------------------------
  belongs_to :area
  has_many :event_places
  has_many :places, through: :event_places
  has_many :event_users
  has_many :users, through: :event_users
  has_many :talks
  has_many :messages, -> { order('created_at ASC') }
  belongs_to :event_status, optional: true
  belongs_to :organizer_place, class_name: 'Place', foreign_key: 'organize_place_id'

  accepts_nested_attributes_for :places, allow_destroy: true

  # -------------------------------------------------------------------------------
  # validation
  # -------------------------------------------------------------------------------

  validates :name, presence: true

  # -------------------------------------------------------------------------------
  # Callbacks
  # -------------------------------------------------------------------------------
  before_save :set_check_in_code

  # -------------------------------------------------------------------------------
  # Enumerables
  # -------------------------------------------------------------------------------
  enum from: {
    early_twenty: 1, # 20代前半
    late_twenty:  2, # 20代後半
    early_thirty: 3, # 30代前半
    early_fourty: 4, # 40代前半
    early_fifty:  5, # 50代前半
    mid_twenty:   6, # 20代中頃
    mid_thirty:   7, # 30代中頃
    late_thirty:  8, # 30代後半
    mid_fourty:   9, # 40代中頃
    late_fourty:  10, # 40代後半
    mid_fifty:    11, # 50代中頃
    late_fifty:   12  # 50代後半
  }, _prefix: true

  enum to: {
    early_twenty: 1, # 20代前半
    late_twenty:  2, # 20代後半
    early_thirty: 3, # 30代前半
    early_fourty: 4, # 40代前半
    early_fifty:  5, # 50代前半
    mid_twenty:   6, # 20代中頃
    mid_thirty:   7, # 30代中頃
    late_thirty:  8, # 30代後半
    mid_fourty:   9, # 40代中頃
    late_fourty:  10, # 40代後半
    mid_fifty:    11, # 50代中頃
    late_fifty:   12  # 50代後半
  }, _prefix: true

  # -------------------------------------------------------------------------------
  # Scopes
  # -------------------------------------------------------------------------------
  scope :now, lambda { |area_id = nil|
    now = Time.zone.now

    events =
      eager_load(:event_users)
      .where('start_time <= ?', now)
      .where('end_time >= ?', now)

    events = events.where(area_id: area_id) if area_id.present?
    events
  }

  scope :past, lambda { |area_id|
    now = Time.zone.now

    eager_load(:event_users)
      .where(area_id: area_id)
      .where('end_time <= ?', now)
      .where('end_time >= ?', now.yesterday)
  }

  def male_count
    event_users.select(&:male?).count
  end

  def female_count
    event_users.select(&:female?).count
  end

  private

  def set_check_in_code
    self.check_in_code ||= ('A'..'Z').to_a.sample(4).join
  end
end

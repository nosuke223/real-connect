# == Schema Information
#
# Table name: place_users
#
#  id         :bigint(8)        not null, primary key
#  age        :integer
#  deleted_at :datetime
#  gender     :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  place_id   :integer
#  user_id    :integer
#
# Indexes
#
#  index_place_users_on_created_at  (created_at)
#  index_place_users_on_deleted_at  (deleted_at)
#  index_place_users_on_place_id    (place_id)
#  index_place_users_on_user_id     (user_id)
#

class PlaceUser < ApplicationRecord
  acts_as_paranoid

  # -------------------------------------------------------------------------------
  # Enumerables
  # -------------------------------------------------------------------------------
  enum age: {
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
  }

  enum gender: {
    male: 1, # 男性
    female: 2 #女性
  }

  # -------------------------------------------------------------------------------
  # Relations
  # -------------------------------------------------------------------------------
  belongs_to :place, optional: true
  counter_culture :place
  belongs_to :user

  # -------------------------------------------------------------------------------
  # Scope
  # -------------------------------------------------------------------------------
  scope :latest, -> { order(id: :desc) }

  # -------------------------------------------------------------------------------
  # Callbacks
  # -------------------------------------------------------------------------------
  after_create :place_checkin_short_interval?

  private

  #
  # 最後の場所チェックインから一定時間がたっているか
  #
  def place_checkin_short_interval?
    last_place_user = user.place_users.where.not(id: self.id).last
    return false if last_place_user.blank?
    raise Exception.new('しばらく時間をおいてからお試しください') if (created_at - last_place_user.created_at) < 5.seconds
  end
end

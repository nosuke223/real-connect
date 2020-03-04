# == Schema Information
#
# Table name: place_users
#
#  id         :bigint(8)        not null, primary key
#  age        :integer
#  deleted_at :datetime
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
    late_twenty: 2, # 20代後半
    thirty:  3, # 30代
    fourty:  4, # 40代
    fifty:  5 # 50代
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

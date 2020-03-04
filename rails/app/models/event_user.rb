# == Schema Information
#
# Table name: event_users
#
#  id             :bigint(8)        not null, primary key
#  checked_out_at :datetime
#  deleted_at     :datetime
#  gender         :integer
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  event_id       :integer
#  user_id        :integer
#
# Indexes
#
#  index_event_users_on_deleted_at  (deleted_at)
#  index_event_users_on_event_id    (event_id)
#  index_event_users_on_user_id     (user_id)
#

class EventUser < ApplicationRecord
  acts_as_paranoid

  # -------------------------------------------------------------------------------
  # Relations
  # -------------------------------------------------------------------------------
  belongs_to :event
  belongs_to :user

  # -------------------------------------------------------------------------------
  # Enumerables
  # -------------------------------------------------------------------------------
  enum gender: {
    male: 1,  # 男性
    female: 2 #女性
  }
end

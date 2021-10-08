# == Schema Information
#
# Table name: event_users
#
#  id             :bigint(8)        not null, primary key
#  age            :integer
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
end

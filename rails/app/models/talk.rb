# == Schema Information
#
# Table name: talks
#
#  id              :bigint(8)        not null, primary key
#  deleted_at      :datetime
#  last_read_at    :datetime
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  event_id        :integer          not null
#  last_message_id :integer
#  partner_id      :integer          not null
#  user_id         :integer          not null
#
# Indexes
#
#  index_talks_on_deleted_at  (deleted_at)
#  index_talks_on_event_id    (event_id)
#  index_talks_on_partner_id  (partner_id)
#  index_talks_on_user_id     (user_id)
#

class Talk < ApplicationRecord
  acts_as_paranoid

  # -------------------------------------------------------------------------------
  # Relations
  # -------------------------------------------------------------------------------
  belongs_to :event
  belongs_to :user
  belongs_to :partner, class_name: 'User', foreign_key: 'partner_id'
  belongs_to :last_message, class_name: 'Message', foreign_key: 'last_message_id'
  # -------------------------------------------------------------------------------
  # Validation
  # -------------------------------------------------------------------------------
  validates :event_id, presence: true
  validates :partner_id, presence: true
  validates :user_id, presence: true
  # -------------------------------------------------------------------------------
  # Methods
  # -------------------------------------------------------------------------------

  def read!
    update!(last_read_at: Time.now)
  end

  def unread_count
    return messages.count if self.last_read_at.nil?
    messages.where('created_at >= ?', last_read_at).count
  end

  def messages
    @messages ||= Message.search(event_id: self.event_id, sender_id: self.user_id, partner_id: self.partner_id)
  end
end

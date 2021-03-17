# == Schema Information
#
# Table name: place_talks
#
#  id              :bigint(8)        not null, primary key
#  deleted_at      :datetime
#  last_read_at    :datetime
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  place_id        :integer          not null
#  last_message_id :integer
#  partner_id      :integer          not null
#  user_id         :integer          not null
#
# Indexes
#
#  index_place_talks_on_deleted_at  (deleted_at)
#  index_place_talks_on_place_id    (place_id)
#  index_place_talks_on_partner_id  (partner_id)
#  index_place_talks_on_user_id     (user_id)
#

class PlaceTalk < ApplicationRecord
  acts_as_paranoid

  # -------------------------------------------------------------------------------
  # Relations
  # -------------------------------------------------------------------------------
  belongs_to :place
  belongs_to :user
  belongs_to :partner, class_name: 'User', foreign_key: 'partner_id'
  belongs_to :last_message, class_name: 'PlaceMessage', foreign_key: 'last_message_id'
  # -------------------------------------------------------------------------------
  # Validation
  # -------------------------------------------------------------------------------
  validates :place_id, presence: true
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
    @messages ||= PlaceMessage.search(place_id: self.place_id, sender_id: self.user_id, partner_id: self.partner_id)
  end
end

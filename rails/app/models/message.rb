# == Schema Information
#
# Table name: messages
#
#  id         :bigint(8)        not null, primary key
#  body       :string
#  deleted_at :datetime
#  image      :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  event_id   :integer          not null
#  partner_id :integer          not null
#  sender_id  :integer          not null
#
# Indexes
#
#  index_messages_on_created_at  (created_at)
#  index_messages_on_deleted_at  (deleted_at)
#  index_messages_on_event_id    (event_id)
#  index_messages_on_partner_id  (partner_id)
#  index_messages_on_sender_id   (sender_id)
#

class Message < ApplicationRecord
  acts_as_paranoid

  # -------------------------------------------------------------------------------
  # Enumerables
  # -------------------------------------------------------------------------------
  enum type: {
    text: 1,
    image: 2,
  }

  # -------------------------------------------------------------------------------
  # Relations
  # -------------------------------------------------------------------------------
  belongs_to :event
  belongs_to :sender, class_name: 'User', foreign_key: 'sender_id'
  belongs_to :partner, class_name: 'User', foreign_key: 'partner_id'

  # -------------------------------------------------------------------------------
  # Callbacks
  # -------------------------------------------------------------------------------
  after_save :update_talks

  # -------------------------------------------------------------------------------
  # Methods
  # -------------------------------------------------------------------------------

  def self.search(event_id:, sender_id:, partner_id:)
    where(event_id: event_id, sender_id: sender_id, partner_id: partner_id)
    .or(self.where(event_id: event_id, sender_id: partner_id, partner_id: sender_id))
    .order(id: :desc)
  end

  def update_talks
    Talk.find_or_initialize_by(event: event, user: sender, partner: partner).update_attributes(last_message_id: id)
    Talk.find_or_initialize_by(event: event, user: partner, partner: sender).update_attributes(last_message_id: id)
  end
end

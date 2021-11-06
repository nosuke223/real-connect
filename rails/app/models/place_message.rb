# == Schema Information
#
# Table name: place_messages
#
#  id               :bigint(8)        not null, primary key
#  body             :string
#  deleted_at       :datetime
#  image            :string
#  partner_nickname :string
#  sender_nickname  :string
#  string           :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  partner_id       :integer          not null
#  place_id         :integer          not null
#  sender_id        :integer          not null
#
# Indexes
#
#  index_place_messages_on_deleted_at  (deleted_at)
#  index_place_messages_on_partner_id  (partner_id)
#  index_place_messages_on_place_id    (place_id)
#  index_place_messages_on_sender_id   (sender_id)
#

class PlaceMessage < ApplicationRecord
  acts_as_paranoid
  include CommonModule

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
  belongs_to :place
  belongs_to :sender, class_name: 'User', foreign_key: 'sender_id'
  belongs_to :partner, class_name: 'User', foreign_key: 'partner_id'

  # -------------------------------------------------------------------------------
  # Validation
  # -------------------------------------------------------------------------------
  validates :place_id, presence: true
  validates :sender_id, presence: true
  validates :partner_id, presence: true

  # -------------------------------------------------------------------------------
  # Callbacks
  # -------------------------------------------------------------------------------
  after_save :update_place_talks

  # -------------------------------------------------------------------------------
  # Methods
  # -------------------------------------------------------------------------------

  def self.search(place_id:, sender_id:, partner_id:)
    where(place_id: place_id, sender_id: sender_id, partner_id: partner_id)
    .or(self.where(place_id: place_id, sender_id: partner_id, partner_id: sender_id))
    .order(id: :desc)
  end

  def update_place_talks
    PlaceTalk.find_or_initialize_by(place: place, user: sender, partner: partner).update_attributes(last_message_id: id)
    PlaceTalk.find_or_initialize_by(place: place, user: partner, partner: sender).update_attributes(last_message_id: id)
  end
end

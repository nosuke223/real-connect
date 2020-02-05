# == Schema Information
#
# Table name: event_places
#
#  id         :bigint(8)        not null, primary key
#  deleted_at :datetime
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  event_id   :integer
#  place_id   :integer
#
# Indexes
#
#  index_event_places_on_deleted_at  (deleted_at)
#  index_event_places_on_event_id    (event_id)
#  index_event_places_on_place_id    (place_id)
#

class EventPlace < ApplicationRecord
  acts_as_paranoid

  # -------------------------------------------------------------------------------
  # Relations
  # -------------------------------------------------------------------------------
  belongs_to :event
  belongs_to :place
end

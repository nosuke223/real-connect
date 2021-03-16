class PlaceTalkSerializer < ActiveModel::Serializer
  attributes :id,
  :place_id,
  :unread_count

  belongs_to :partner, serializer: UserSerializer
  belongs_to :last_message, serializer: PlaceMessageSerializer
end

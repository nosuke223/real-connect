class PlaceMessageSerializer < ActiveModel::Serializer
  attributes :id,
    :body,
    :image,
    :sent_at,
    :sender_id

  def sent_at
    object.created_at
  end

  def image
    object.image&.url
  end
end

class PlaceUserSerializer < ActiveModel::Serializer
  attributes :id,
    :age,
    :checked_in_at
  
  class UserSerializer < ActiveModel::Serializer
    attributes :id,
      :nickname,
      :avatar_thumb_image,
      :gender,
      :is_deleted

    def avatar_thumb_image
      object.avatar_image&.versions[:thumb]&.url
    end

    def is_deleted
      object.deleted?
    end
  end

  belongs_to :user, serializer: UserSerializer

  def checked_in_at
    object.created_at
  end
end

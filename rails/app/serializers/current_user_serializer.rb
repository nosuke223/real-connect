class CurrentUserSerializer < ActiveModel::Serializer
  attributes :id,
    :email,
    :area_id,
    :prefecture,
    :nickname,
    :avatar_image,
    :avatar_thumb_image,
    :cover_image,
    :height,
    :age,
    :blood,
    :gender,
    :income,
    :education,
    :alcohol,
    :tobacco,
    :business,
    :birthplace,
    :attracted_type,
    :hobbies,
    :fashion,
    :is_confirmed,
    :current_place_id,
    :last_place_id

  has_many :own_places, serializer: PlaceDetailSerializer, if: :owner?

  def owner?
    object.owner?
  end


  def avatar_image
    object.avatar_image&.url
  end

  def avatar_thumb_image
    object.avatar_image&.versions[:thumb]&.url
  end

  def cover_image
    object.cover_image&.url
  end

  def is_confirmed
    object.confirmed?
  end

  def area_id
    object.area_id
  end

  # TODO 一旦ひとつ
  def own_places
    object.own_places.last
  end
end

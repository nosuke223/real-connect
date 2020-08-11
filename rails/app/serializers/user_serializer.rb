class UserSerializer < ActiveModel::Serializer
  attribute :id
  attribute :nickname, unless: :deleted?
  attribute :avatar_thumb_image, unless: :deleted?
  attribute :avatar_image, unless: :deleted?
  attribute :cover_image, unless: :deleted?
  attribute :height, unless: :deleted?
  attribute :age, unless: :deleted?
  attribute :blood, unless: :deleted?
  attribute :gender, unless: :deleted?
  attribute :income, unless: :deleted?
  attribute :education, unless: :deleted?
  attribute :alcohol, unless: :deleted?
  attribute :tobacco, unless: :deleted?
  attribute :business, unless: :deleted?
  attribute :birthplace, unless: :deleted?
  attribute :attracted_type, unless: :deleted?
  attribute :hobbies, unless: :deleted?
  attribute :fashion, unless: :deleted?
  attribute :prefecture, unless: :deleted?
  attribute :current_place_id, unless: :deleted?
  attribute :last_place_id, unless: :deleted?
  attribute :full_name, unless: :deleted?
  attribute :telephone, unless: :deleted?
  attribute :is_deleted

  def deleted?
    object.deleted?
  end

  def avatar_image
    object.avatar_image.url
  end

  def avatar_thumb_image
    object.avatar_image&.versions[:thumb]&.url
  end

  def cover_image
    object.cover_image.url
  end

  def is_deleted
    object.deleted?
  end
end

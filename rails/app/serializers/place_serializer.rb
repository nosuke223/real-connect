class PlaceSerializer < ActiveModel::Serializer
  attributes :id,
  :name,
  :logo_image,
  :cover_image,
  :zipcode,
  :address1,
  :address2,
  :address3,
  :description,
  :telephone,
  :note,
  :store_type,
  :url

  def logo_image
    object.logo_image.url
  end

  def cover_image
    object.cover_image.url
  end
end

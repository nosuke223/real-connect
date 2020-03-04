class PlaceLogoImageUploader < ImageUploader

  process resize_to_fill: [1280, 1280]

end

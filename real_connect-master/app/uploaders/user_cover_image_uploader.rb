class UserCoverImageUploader < ImageUploader

  process resize_to_fill: [1280, 640]

end

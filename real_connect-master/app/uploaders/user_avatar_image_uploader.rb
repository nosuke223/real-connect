class UserAvatarImageUploader < ImageUploader

  process resize_to_fill: [640, 640]

  version :thumb do
    process resize_to_fill: [240, 240]
  end
end

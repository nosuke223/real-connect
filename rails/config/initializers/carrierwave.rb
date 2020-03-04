require 'carrierwave/storage/abstract'
require 'carrierwave/storage/file'
require 'carrierwave/storage/fog'

def setup_in_s3
  CarrierWave.configure do |config|
    config.storage = :fog
    config.fog_provider = 'fog/aws'
    config.fog_credentials = {
      provider:              'AWS',
      aws_access_key_id:     ENV['AWS_ACCESS_KEY'] || '',
      aws_secret_access_key: ENV['AWS_SECRET_KEY'] || '',
      region:                ENV['AWS_REGION'] || '',
      host:                  ENV['AWS_S3_HOST']
    }

    config.fog_directory = ENV['AWS_S3_BUCKET_NAME'] || ''
    config.asset_host = ENV['AWS_S3_ASSET_HOST'] || ''
    config.cache_storage = :fog
    config.cache_dir = 'tmp/image-cache'
  end
end

case Rails.env
when 'production'
  setup_in_s3
end

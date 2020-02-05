class PlaceDetailSerializer < ActiveModel::Serializer
  attributes :id,
  :name,
  :logo_image,
  :cover_image,
  :address,
  :building,
  :description,
  :telephone,
  :note,
  :store_type,
  :url,
  :seat_status,
  :is_sun_holiday,
  :sun_start_at,
  :sun_end_at,
  :is_mon_holiday,
  :mon_start_at,
  :mon_end_at,
  :is_tue_holiday,
  :tue_start_at,
  :tue_end_at,
  :is_wed_holiday,
  :wed_start_at,
  :wed_end_at,
  :is_thu_holiday,
  :thu_start_at,
  :thu_end_at,
  :is_fri_holiday,
  :fri_start_at,
  :fri_end_at,
  :is_sat_holiday,
  :sat_start_at,
  :sat_end_at

  def logo_image
    object.logo_image.url
  end

  def cover_image
    object.cover_image.url
  end

  def sun_start_at
    object.sun_start_at&.strftime('%H:%M')
  end

  def sun_end_at
    object.sun_end_at&.strftime('%H:%M')
  end

  def mon_start_at
    object.mon_start_at&.strftime('%H:%M')
  end

  def mon_end_at
    object.mon_end_at&.strftime('%H:%M')
  end

  def tue_start_at
    object.tue_start_at&.strftime('%H:%M')
  end

  def tue_end_at
    object.tue_end_at&.strftime('%H:%M')
  end

  def wed_start_at
    object.wed_start_at&.strftime('%H:%M')
  end

  def wed_end_at
    object.wed_end_at&.strftime('%H:%M')
  end

  def thu_start_at
    object.thu_start_at&.strftime('%H:%M')
  end

  def thu_end_at
    object.thu_end_at&.strftime('%H:%M')
  end

  def fri_start_at
    object.fri_start_at&.strftime('%H:%M')
  end

  def fri_end_at
    object.fri_end_at&.strftime('%H:%M')
  end

  def sat_start_at
    object.sat_start_at&.strftime('%H:%M')
  end

  def sat_end_at
    object.sat_end_at&.strftime('%H:%M')
  end
end

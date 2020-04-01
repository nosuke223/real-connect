class Api::V1::Owners::PlacesController < Api::V1::Owners::BaseController
  #
  # 所有している店舗・場所の現在のイベント取得する
  #
  # PUT /api/v1/owners/places
  #
  def update
    place = current_user.own_places.find(params[:id])
    place.update!(place_params)

    render json: place, serializer: PlaceDetailSerializer
  end

  private

  def place_params
    params.permit(
      :zipcode, :address1, :address2, :address3, :cover_image, :deleted_at, :description, :fri_end_at,
      :fri_start_at, :is_fri_holiday, :is_mon_holiday, :is_sat_holiday,
      :is_sun_holiday, :is_thu_holiday, :is_tue_holiday, :is_wed_holiday,
      :logo_image, :mon_end_at, :mon_start_at, :name, :note, :sat_end_at,
      :sat_start_at, :seat_status, :store_type, :sun_end_at, :sun_start_at,
      :telephone, :thu_end_at, :thu_start_at, :tue_end_at, :tue_start_at,
      :url, :wed_end_at, :wed_start_at
    )
  end
end


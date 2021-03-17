class Api::V1::PlacesController < Api::BaseController

  skip_before_action :authenticate_user!, only: [:index, :show]

  #
  # 場所の情報を返す
  #
  # GET /api/v1/places
  #
  def index
    places = Place.where(area_id: params[:area_id])
    render json: places, each_serializer: PlaceDetailSerializer
  end

  #
  # 場所へのチェックインを行う
  #
  # POST /api/v1/places/:id/checkin
  #
  def checkin
    current_user.place_checkin(params[:id])
    render_empty(:ok)
  end

  #
  # 場所のユーザー一覧返す
  #
  # GET /api/v1/places/:id/users
  #
  def users
    place = Place.eager_load(:users).find(params[:id])
    render json: place.users.uniq
  end

  #
  # 場所のトーク一覧返す
  #
  # GET /api/v1/places/:id/talks
  #
  def talks
    talks = current_user.place_talks.eager_load(:last_message, :partner).where(place_id: params[:id])
    render json: talks
  end

  private

  def place_update_params
    params.permit(
      :email, :nickname, :avatar_image, :cover_image, :area_id, :height, :age
    )
  end

end

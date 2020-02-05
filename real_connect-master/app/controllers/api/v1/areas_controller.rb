class Api::V1::AreasController < Api::BaseController

  skip_before_action :authenticate_user!, only: [:index, :prefectures]

  #
  # 地域一覧を返す
  #
  # GET /api/v1/areas
  #
  def index
    render json: Area.where(prefecture: params[:prefecture])
  end

  #
  # 都道府県一覧を返す
  #
  # GET /api/v1/areas/prefectures
  #
  def prefectures
    render json: PrefectureMaster.all
  end
end

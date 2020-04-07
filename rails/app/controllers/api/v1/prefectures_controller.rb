class Api::V1::PrefecturesController < Api::BaseController

  skip_before_action :authenticate_user!, only: [:index]

  #
  # 都道府県一覧を返す
  #
  # GET /api/v1/prefectures
  #
  def index
    prefectures = Prefecture.all
    render json: prefectures
  end
end

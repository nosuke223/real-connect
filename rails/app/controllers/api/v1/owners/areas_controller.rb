# frozen_string_literal: true

class Api::V1::Owners::AreasController < Api::V1::Owners::BaseController
  skip_before_action :authenticate_owner!, only: %i[index]

  #
  # 地域一覧を返す
  #
  # GET /api/v1/sytem_admins/areas
  #
  def index
    if params[:prefecture]
      render json: Area.where(prefecture_id: params[:prefecture])
    else
      render json: Area.all.as_json(include: :prefecture)
    end
  end

  #
  # 設定可能な候補エリアの一覧を取得
  #
  # GET /api/v1/sytem_admins/candidate_areas
  #
  def candidate_areas
    prefecture = Prefecture.find_by(name: params[:pref_name])
    if prefecture
      candidate_areas = prefecture.areas
      render json: candidate_areas
    else
      render_empty(500)
    end
  end


  private

  def area_params
    columns = Area.column_symbolized_names
    params.require(:area).permit(*columns)
  end
end

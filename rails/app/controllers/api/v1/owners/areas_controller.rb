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


  private

  def area_params
    columns = Area.column_symbolized_names
    params.require(:area).permit(*columns)
  end
end

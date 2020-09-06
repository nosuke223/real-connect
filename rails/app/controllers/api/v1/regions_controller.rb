# frozen_string_literal: true

class Api::V1::RegionsController < Api::BaseController
  skip_before_action :authenticate_user!, only: [:index]

  #
  # 地方一覧と紐づく都道府県の一覧を返却する
  #
  # GET /api/v1/regions
  #
  def index
    regions = Region.all.order(id: 'asc')
    render json: regions.as_json(
      include: [:prefectures]
    )
  end
end

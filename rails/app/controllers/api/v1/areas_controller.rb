class Api::V1::AreasController < Api::BaseController

  skip_before_action :authenticate_user!, only: [:index, :prefectures]
  before_action :set_area, only: [:show, :update, :destroy]

  #
  # 地域一覧を返す
  #
  # GET /api/v1/areas
  #
  def index
    if params[:prefecture]
      render json: Area.where(prefecture_id: params[:prefecture])
    else
      render json: Area.all.as_json(include: :prefecture)
    end
  end
  #
  # 地域詳細を返す
  #
  # GET /api/v1/areas/:id
  #
  def show
    render json: @area.as_json(include: :prefecture)
  end

  # POST /areaes
  def create
    @area = Area.new(area_params)
    if @area.save
      render json:@area.as_json
    else
      render_empty(500)
    end
  end

  # PATCH/PUT /areaes/1
  # PATCH/PUT /areaes/1.json
  def update
    if @area.update(area_params)
      render json: @area.as_json
    else
      render_empty(500)
    end
  end

  # DELETE /areaes/1
  # DELETE /areaes/1.json
  def destroy
    @area.destroy
  end

  private

  def set_area
    @area = Area.find(params[:id])
  end

  def area_params
    columns = Area.column_symbolized_names
    params.require(:area).permit(*columns)
  end

end

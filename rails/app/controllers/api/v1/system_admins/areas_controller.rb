# frozen_string_literal: true

class Api::V1::SystemAdmins::AreasController < Api::V1::SystemAdmins::BaseController
  before_action :set_area, only: %i[show update destroy]
  skip_before_action :authenticate_system_admin!, only: %i[index]

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
  # 地域詳細を返す
  #
  # GET /api/v1/sytem_admins/areas/:id
  #
  def show
    render json: @area.as_json(include: :prefecture)
  end

  # POST /areaes
  def create
    @area = Area.new(area_params)
    if @area.save
      render json: @area.as_json
    else
      render_valid_error(@area.errors.full_messages)
    end
  end

  # PATCH/PUT /areaes/1
  # PATCH/PUT /areaes/1.json
  def update
    if @area.update(area_params)
      render json: @area.as_json
    else
      render_valid_error(@area.errors.full_messages)
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

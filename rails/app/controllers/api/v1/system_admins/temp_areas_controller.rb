# frozen_string_literal: true

class Api::V1::SystemAdmins::TempAreasController < Api::V1::SystemAdmins::BaseController
  before_action :set_temp_area, only: %i[show update destroy approval reject_application]

  #
  # 地域一覧を返す
  #
  # GET /api/v1/sytem_admins/temp_areas
  #
  def index
    if params[:prefecture]
      render json: TempArea.where(prefecture_id: params[:prefecture])
    else
      render json: TempArea.all.as_json(include: :prefecture)
    end
  end

  #
  # 地域詳細を返す
  #
  # GET /api/v1/sytem_admins/temp_areas/:id
  #
  def show
    render json: @temp_area.as_json(include: :prefecture)
  end

  # POST /temp_areaes
  def create
    @temp_area = temp_area.new(temp_area_params)
    if @temp_area.save
      render json: @temp_area.as_json
    else
      render_valid_error(@temp_area.errors.full_messages)
    end
  end

  # PATCH/PUT /temp_areaes/1
  # PATCH/PUT /temp_areaes/1.json
  def update
    if @temp_area.update(temp_area_params)
      render json: @temp_area.as_json
    else
      render_valid_error(@temp_area.errors.full_messages)
    end
  end

  # DELETE /temp_areaes/1
  # DELETE /temp_areaes/1.json
  def destroy
    @temp_area.destroy
  end

  def approval
    attributes = @temp_area.attributes
    Area.transaction do
      Area.create!(
        {
          name: attributes.dig('name'),
          prefecture_id: attributes.dig('prefecture_id'),
          zipcode: attributes.dig('zipcode')
        }
      )
      TempArea.transaction do
        TempAreaMailer.send_approve(@temp_area).deliver
        @temp_area.destroy!
        SystemBbsInfo.transaction do
          SystemBbsInfo.create!(
            {
              detail: "#{@temp_area.name}エリアが承認されました",
              display_flag: true,
              display_date: Date.today
            }
          )
        end
      end
    end
  end

  def reject_application
    SystemBbsInfo.transaction do
      SystemBbsInfo.create!(
        {
          detail: "#{@temp_area.name}エリアが承認されませんでした",
          display_flag: true,
          display_date: Date.today
        }
      )
      TempArea.transaction do
        TempAreaMailer.send_reject_application(@temp_area).deliver
        @temp_area.destroy
      end
    end
  end

  private

  def set_temp_area
    @temp_area = TempArea.find(params[:id])
  end

  def temp_area_params
    columns = TempArea.column_symbolized_names
    params.require(:temp_area).permit(*columns)
  end
end

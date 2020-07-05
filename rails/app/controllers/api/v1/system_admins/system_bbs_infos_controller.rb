# frozen_string_literal: true

class Api::V1::SystemAdmins::SystemBbsInfosController < Api::V1::SystemAdmins::BaseController
  before_action :set_system_bbs_info, only: %i[show edit update destroy]

  # GET /system_bbs_infos
  # GET /system_bbs_infos.json
  def index
    system_bbs_infos = SystemBbsInfo.all
    render json: system_bbs_infos
  end

  # GET /system_bbs_infos/1
  # GET /system_bbs_infos/1.json
  def show
    render json: @system_bbs_info
  end

  # POST /system_bbs_infos
  # POST /system_bbs_infos.json
  def create
    @system_bbs_info = SystemBbsInfo.new(system_bbs_info_params)
    if @system_bbs_info.save
      render json: @system_bbs_info
    else
      render_valid_error(@system_bbs_info.errors.full_messages)
    end
  end

  # PATCH/PUT /system_bbs_infos/1
  # PATCH/PUT /system_bbs_infos/1.json
  def update
    if @system_bbs_info.update(system_bbs_info_params)
      render json: @system_bbs_info
    else
      render_valid_error(@system_bbs_info.errors.full_messages)
    end
  end

  # DELETE /system_bbs_infos/1
  # DELETE /system_bbs_infos/1.json
  def destroy
    @system_bbs_info.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_system_bbs_info
    @system_bbs_info = SystemBbsInfo.find(params[:id])
  end

  # Strong Parameter
  def system_bbs_info_params
    columns = SystemBbsInfo.column_symbolized_names
    params.require(:system_bbs_info).permit(*columns)
  end
end

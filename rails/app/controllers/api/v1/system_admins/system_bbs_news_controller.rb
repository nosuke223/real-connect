# frozen_string_literal: true

class Api::V1::SystemAdmins::SystemBbsNewsController < Api::V1::SystemAdmins::BaseController
  before_action :set_system_bbs_news, only: %i[show edit update destroy]

  # GET /system_bbs_news
  # GET /system_bbs_news.json
  def index
    system_bbs_news = SystemBbsNews.all
    render json: system_bbs_news
  end

  # GET /system_bbs_news/1
  # GET /system_bbs_news/1.json
  def show
    render json: @system_bbs_news
  end

  # POST /system_bbs_news
  # POST /system_bbs_news.json
  def create
    @system_bbs_news = SystemBbsNews.new(system_bbs_news_params)
    if @system_bbs_news.save
      render json: @system_bbs_news
    else
      render_valid_error(@system_bbs_news.errors.full_messages)
    end
  end

  # PATCH/PUT /system_bbs_news/1
  # PATCH/PUT /system_bbs_news/1.json
  def update
    if @system_bbs_news.update(system_bbs_news_params)
      render json: @system_bbs_news
    else
      render_valid_error(@system_bbs_news.errors.full_messages)
    end
  end

  # DELETE /system_bbs_news/1
  # DELETE /system_bbs_news/1.json
  def destroy
    @system_bbs_news.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_system_bbs_news
    @system_bbs_news = SystemBbsNews.find(params[:id])
  end

  # Strong Parameter
  def system_bbs_news_params
    columns = SystemBbsNews.column_symbolized_names
    params.require(:system_bbs_news).permit(*columns)
  end
end

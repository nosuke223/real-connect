# frozen_string_literal: true

class Api::V1::SystemAdmins::EventStatusesController < Api::V1::SystemAdmins::BaseController
  skip_before_action :authenticate_system_admin!, only: [:index]
  before_action :set_event_status, only: %i[show edit update destroy]

  # GET /event_statuses
  # GET /event_statuses.json
  def index
    event_statuses = EventStatus.all
    render json: event_statuses
  end

  # GET /event_statuses/1
  # GET /event_statuses/1.json
  def show
    render json: @event_status
  end

  # POST /event_statuses
  # POST /event_statuses.json
  def create
    @event_status = EventStatus.new(event_status_params)
    if @event_status.save
      render json: @event_status
    else
      render_valid_error(@event_status.errors.full_messages)
    end
  end

  # PATCH/PUT /event_statuses/1
  # PATCH/PUT /event_statuses/1.json
  def update
    if @event_status.update(event_status_params)
      render json: @event_status
    else
      render_valid_error(@event_status.errors.full_messages)
    end
  end

  # DELETE /event_statuses/1
  # DELETE /event_statuses/1.json
  def destroy
    @event_status.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_event_status
    @event_status = EventStatus.find(params[:id])
  end

  # Strong Parameter
  def event_status_params
    columns = EventStatus.column_symbolized_names
    params.require(:event_status).permit(*columns)
  end
end

# frozen_string_literal: true

class Api::V1::SystemAdmins::EventsController < Api::V1::SystemAdmins::BaseController
  before_action :set_event, only: %i[show edit update destroy detail_with_messages]
  skip_before_action :authenticate_system_admin!, only: %i[index detail_with_messages]
  # GET /event
  def index
    events = if params[:area_id]
               Event.where(area_id: params[:area_id])
             else
               Event.all.order(updated_at: 'desc')
             end
    render json: events.as_json(
      include: %i[area event_status users]
    )
  end

  # GET /events/:id
  def show
    render json: @event.as_json(
      include: %i[area event_status users]
    )
  end

  # POST /events
  def create
    @event = Event.new(event_params)
    if @event.save
      render json: @event.as_json(
        include: %i[area event_status users]
      )
    else
      render_valid_error(@event.errors.full_messages)
    end
  end

  # PATCH/PUT /events/1
  def update
    if @event.update(event_params)
      render json: @event.as_json(
        include: %i[area event_status users]
      )
    else
      render_valid_error(@event.errors.full_messages)
    end
  end

  # DELETE /events/1
  # DELETE /events/1.json
  def destroy
    @event.destroy
  end

  # GET /detail_with_messages
  def detail_with_messages
    render json: @event.as_json(
      include: [:messages]
    )
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_event
    @event = Event.find(params[:id])
  end

  # Strong Parameter
  def event_params
    columns = Event.column_symbolized_names
    params.require(:event).permit(*columns)
  end
end

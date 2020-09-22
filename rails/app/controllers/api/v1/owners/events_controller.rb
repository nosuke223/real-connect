# frozen_string_literal: true

class Api::V1::Owners::EventsController < Api::V1::Owners::BaseController
  before_action :set_event, only: %i[show update destroy ]
  #
  # 所有している店舗・場所の現在のイベント取得する
  #
  # GET /api/v1/owners/events
  #
  def index
    page = params[:page] ? params[:page] : 1
    place = current_user.own_places.find(params[:place_id])
    events = place.events
    events = params[:now] == 'true' ? events.now.page(page).per(20) : events.page(page).per(20)
    render json: events,
           adapter: :json,
           meta: {
            total_count: events.total_count,
            total_pages: events.total_pages,
            current_page: events.current_page
           }
  end

  # GET /api/v1/owners/events/:id
  def show
    render json:@event
  end

  # POST /api/v1/owners/events
  def create
    @event = Event.new(event_params)
    Event.transaction do
      @event.save!
      event_place = EventPlace.new({
        event_id: @event.id,
        place_id: params.dig(:event, :organize_place_id)
      })
      EventPlace.transaction do
        event_place.save!
        render json: @event.as_json(
          include: %i[area event_status users]
        )
      end
    end
  rescue => e
    render_valid_error(e.message.split())
  end

  # PUT /api/v1/owners/events/:id
  def update
    if @event.update(event_params)
      render json: @event
    else
      render_valid_error(@event.errors.full_messages)
    end
  end

  # DELETE /api/v1/owners/events/:id
  def destroy
    @event.destroy
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

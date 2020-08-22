# frozen_string_literal: true

class Api::V1::Owners::EventsController < Api::V1::Owners::BaseController
  #
  # 所有している店舗・場所の現在のイベント取得する
  #
  # GET /api/v1/owners/events
  #
  def index
    place = current_user.own_places.last
    render json: place.events.now
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

  private

  # Strong Parameter
  def event_params
    columns = Event.column_symbolized_names
    params.require(:event).permit(*columns)
  end
end

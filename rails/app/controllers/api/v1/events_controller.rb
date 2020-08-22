class Api::V1::EventsController < Api::BaseController
  #
  # イベント一覧を返す
  #
  # GET /api/v1/events
  #
  def index
    events = Event.now(current_user.area_id)
    render json: events
  end

  # POST /api/v1/events
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

  #
  # 過去のイベント一覧を返す
  #
  # GET /api/v1/events/past
  #
  def past
    events = Event.past(current_user.area_id)
    render json: events
  end

  #
  # イベントのユーザー一覧返す
  #
  # GET /api/v1/events/:id/users
  #
  def users
    event = Event.eager_load(:users).find(params[:id])
    render json: event.users.with_deleted
  end

  #
  # イベントのトーク一覧返す
  #
  # GET /api/v1/events/:id/talks
  #
  def talks
    talks = current_user.talks.eager_load(:last_message, :partner).where(event_id: params[:id])
    render json: talks
  end

  #
  # チェックインを行う
  #
  # POST /api/v1/events/:id/checkin
  #
  def checkin
    event = Event.find(params[:id])
    # current_user.event_checkin(event, params[:code])
    current_user.event_checkin(event)
    current_user.place_checkin(params[:place_id])
    render_empty(:ok)
  end

  private

  # Strong Parameter
  def event_params
    columns = Event.column_symbolized_names
    params.require(:event).permit(*columns)
  end
end

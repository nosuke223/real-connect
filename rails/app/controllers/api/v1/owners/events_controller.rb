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
end

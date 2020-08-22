# frozen_string_literal: true

class Api::V1::Owners::EventStatusesController < Api::V1::Owners::BaseController
  skip_before_action :authenticate_owner!, only: [:index]
  #
  # イベントステータスの一覧を返却する
  #
  # GET /api/v1/owners/event_statuses
  #
  def index
    event_statuses = EventStatus.all.order(id: 'asc')
    render json: event_statuses
  end
end

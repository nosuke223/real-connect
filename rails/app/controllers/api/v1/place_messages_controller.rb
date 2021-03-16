class Api::V1::PlaceMessagesController < Api::BaseController
  #
  # メッセージ一覧を返す
  #
  # GET /api/v1/place_messages
  #
  def show
    place_messages = PlaceMessage.search(
      place_id: params[:place_id],
      sender_id: current_user.id,
      partner_id: params[:partner_id]
    ).page(params[:page]).per(50)

    render json: place_messages
  end

  #
  # メッセージを送信する
  #
  # POST /api/v1/place_messages
  #
  def create
    PlaceMessage.create(place_message_params.merge!(
      sender: current_user
    ))

    render_empty(:created)
  end

  private

  def place_message_params
    params.permit(:place_id, :partner_id, :body, :image)
  end
end

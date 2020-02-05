class Api::V1::MessagesController < Api::BaseController
  #
  # メッセージ一覧を返す
  #
  # GET /api/v1/messages
  #
  def show
    messages = Message.search(
      event_id: params[:event_id],
      sender_id: current_user.id,
      partner_id: params[:partner_id]
    ).page(params[:page]).per(50)

    render json: messages
  end

  #
  # メッセージを送信する
  #
  # POST /api/v1/messages
  #
  def create
    Message.create(message_params.merge!(
      sender: current_user
    ))

    render_empty(:created)
  end

  private

  def message_params
    params.permit(:event_id, :partner_id, :body, :image)
  end
end

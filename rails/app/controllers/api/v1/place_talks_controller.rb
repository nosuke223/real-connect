class Api::V1::PlaceTalksController < Api::BaseController
  #
  # メッセージを既読にする
  #
  # PUT /api/v1/place_talks/:id/read
  #
  def read
    current_user.place_talks.find(params[:id]).read!
    render_empty(:no_content)
  end
end

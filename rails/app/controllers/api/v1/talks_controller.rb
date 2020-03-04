class Api::V1::TalksController < Api::BaseController
  #
  # メッセージを既読にする
  #
  # PUT /api/v1/talks/:id/read
  #
  def read
    current_user.talks.find(params[:id]).read!
    render_empty(:no_content)
  end
end

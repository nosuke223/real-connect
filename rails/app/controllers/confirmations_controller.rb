class ConfirmationsController < ApplicationController
  protect_from_forgery with: :null_session

  #
  # GET /confirmation?confirmation_token=abcdef
  #
  def show
    user = User.confirm_by_token(params[:confirmation_token])
    redirect_to 'https://real-connect.jp/user' if user.user?
    redirect_to 'https://real-connect.jp/admin' if user.owner?
  end
end
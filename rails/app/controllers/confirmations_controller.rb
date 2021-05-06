class ConfirmationsController < ApplicationController
  protect_from_forgery with: :null_session

  #
  # GET /confirmation?confirmation_token=abcdef
  #
  def show
    user = User.confirm_by_token(params[:confirmation_token])
    host = Rails.env.production? ? 'https://rc1.onssl.jp' : 'https://localhost:3000'
    redirect_to "#{host}/user" if user.user?
    redirect_to "#{host}/admin" if user.owner?
  end
end
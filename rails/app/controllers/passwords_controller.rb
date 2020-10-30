class PasswordsController < ApplicationController
  protect_from_forgery with: :null_session

  #
  # パスワードリセットトークンを含んでDeep Linkにリダイレクトを行う
  #
  # GET /passwords/reset
  #
  def reset
    host = Rails.env.production? ? 'https://real-connect.jp' : 'https://localhost:3000'
    redirect_url = "#{host}/user/reset_password?reset_password_token=#{params[:reset_password_token]}"
    redirect_to redirect_url
  end
end

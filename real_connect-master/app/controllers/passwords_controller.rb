class PasswordsController < ApplicationController
  protect_from_forgery with: :null_session

  #
  # パスワードリセットトークンを含んでDeep Linkにリダイレクトを行う
  #
  # GET /passwords/reset
  #
  def reset
    redirect_url = "https://real-connect.jp/user/reset_password?reset_password_token=#{params[:reset_password_token]}"
    redirect_to redirect_url
  end
end

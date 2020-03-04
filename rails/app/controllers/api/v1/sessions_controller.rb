class Api::V1::SessionsController < Devise::SessionsController
  respond_to :json
  protect_from_forgery with: :null_session

  include ExceptionHandler
  include CommonRender

  after_action :remove_unused_headers_for_api

  #
  # ログイン処理を行う
  #
  # POST /api/v1/sessions
  #
  def create
    raise Exception.new t('devise.failure.user.invalid_email') unless User.exists?(email: params[:email])
    super { |resource| @resource = resource }
  end

  #
  # ログアウト処理を行う
  #
  # DELETE /api/v1/sessions
  #
  # def destroy
  #   super
  # end

  private

  def sign_in_params
    params.permit(:email, :password)
  end

  #
  # create実行時の処理
  #
  def respond_with(resource, _opts = {})
    if user_signed_in?
      render json: resource, serializer: CurrentUserSerializer, status: :created
    end
  end

  #
  # destroy実行時の処理
  #
  def respond_to_on_destroy
    render_empty(:no_content)
  end

  def verify_signed_out_user
    user_signed_in?

    if all_signed_out?
      unauthorized Exception.new('authorization failed')
    end
  end
end

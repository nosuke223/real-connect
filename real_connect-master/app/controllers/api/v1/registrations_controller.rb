class Api::V1::RegistrationsController < Devise::RegistrationsController
  respond_to :json
  protect_from_forgery with: :null_session

  include ExceptionHandler
  include CommonRender

  #
  # 会員登録処理を行う
  #
  # POST /api/v1/registrations
  #
  def create
    super do |resource|
      raise ActiveRecord::RecordInvalid.new(resource) if resource.errors.present?
      resource.send_on_create_confirmation_instructions
    end
  end

  #
  # 退会処理を行う
  #
  # DELETE /api/v1/registrations
  #
  # def destroy
  #   super
  # end

  private

  # def sign_up_params
  #   # {
  #   #   user: params.permit(:email, :password)
  #   # }
  #   params.permit(:email, :password)
  # end

  #
  # create実行時の処理
  #
  def respond_with(resource, _opts = {})
    if user_signed_in?
      render json: resource, serializer: CurrentUserSerializer, status: :created
    else
      bad_request Exception.new('registration failed')
    end
  end

  #
  # destroy実行時の処理
  #
  def respond_with_navigational(*args, &block)
    render_empty(:no_content)
  end
end

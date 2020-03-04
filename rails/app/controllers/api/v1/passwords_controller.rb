class Api::V1::PasswordsController < Devise::PasswordsController
  respond_to :json
  protect_from_forgery with: :null_session

  include ExceptionHandler

  #
  # パスワードリセットメールを送信する
  #
  # POST /api/v1/password
  #
  def create
    super do |resource|
      raise ActiveRecord::RecordNotFound.new(nil, 'User') if resource.id.nil?
    end
  end

  #
  # パスワードの更新を行う
  #
  # PUT /api/v1/password
  # 
  def update
    super do |resource|
      raise ExceptionHandler::ValidationError, resource.errors.full_messages.join("\n") unless resource.errors.empty?
    end
  end

  private

  def resource_params
    params.permit(:email, :reset_password_token, :password, :password_confirmation)
  end

  #
  # create実行時の処理
  #
  def respond_with(resource, _opts = {})
    render json: {}, status: :created
  end
end

class ApplicationController < ActionController::Base
  before_action :configure_permitted_parameters, if: :devise_controller?

  #
  # エンドポイントが見つからなかった時にエラーを返す
  #
  def raise_not_found
    raise ActionController::RoutingError, "No route matches #{params[:unmatched_route]}"
  end

  #
  # ActiveAdminで 403 例外が発生した場合、 403 ページを表示
  #
  def admin_access_denied(_exception)
    render 'errors/403', layout: 'error', status: :forbidden
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_in) do |user_params|
      user_params.permit(:email, :password)
    end

    devise_parameter_sanitizer.permit(:sign_up) do |user_params|
      user_params.permit(
        :email, :password, :password_confirmation
      )
    end
  end

  def devise_parameter_sanitizer
    @devise_parameter_sanitizer ||= ParameterSanitizer.new(User, :user, params)
  end
end

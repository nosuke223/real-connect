class Api::V1::Owners::BaseController < Api::BaseController
  before_action :authenticate_owner!

  private

  #
  # オーナーアカウントか認証する
  #
  def authenticate_owner!
    raise AuthenticationError unless current_user.owner?
  end
end

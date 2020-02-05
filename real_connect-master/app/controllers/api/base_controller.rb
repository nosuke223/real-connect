class Api::BaseController < ApplicationController
  include ExceptionHandler
  include CommonRender

  respond_to :json

  before_action :authenticate_user!
  after_action :remove_unused_headers_for_api

  protect_from_forgery with: :null_session

  private

  #
  # HTTPメソッドに対してデフォルトで返すHTTPステータス
  #
  # @return [Symbol] HTTPステータス
  #
  def status_from_request
    if request.post?
      :created
    elsif request.delete?
      :no_content
    else
      :ok
    end
  end
end

module CommonRender
  extend ActiveSupport::Concern

  #
  # 空のJSONを返すと、クライアント側でエラーが発生するため、statusを追加
  #
  def render_empty(status)
    render json: {}, status: status
  end

  def render_valid_error(messages)
    render json: messages, status: 400
  end

  private

  def remove_unused_headers_for_api
    response.headers.except! 'X-Frame-Options'
    response.headers.except! 'X-XSS-Protection'
    response.headers.except! 'X-Download-Options'
    response.headers.except! 'X-Permitted-Cross-Domain-Policies'
    response.headers.except! 'Referrer-Policy'
    response.headers.except! 'ETag'
  end
end

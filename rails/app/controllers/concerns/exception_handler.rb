module ExceptionHandler
  extend ActiveSupport::Concern

  # 独自のエラークラス
  class AuthenticationError < StandardError; end
  class MissingToken < StandardError; end
  class InvalidToken < StandardError; end
  class ExpiredSignature < StandardError; end
  class NotPermittedError < StandardError; end
  class ValidationError < StandardError; end

  included do
    rescue_from ActiveRecord::RecordNotFound, with: :not_found
    rescue_from ActionController::RoutingError, with: :route_error
    rescue_from ActiveRecord::RecordInvalid, with: :unprocessable_entity
    rescue_from ExceptionHandler::ValidationError, with: :validation_error
    rescue_from ExceptionHandler::AuthenticationError, with: :unauthorized
    rescue_from ExceptionHandler::MissingToken, with: :missing_token
    rescue_from ExceptionHandler::InvalidToken, with: :invalid_token
    rescue_from ExceptionHandler::ExpiredSignature, with: :expired_signature
    rescue_from Exception, with: :raise_exception
  end

  private

  #
  # エラーメッセージ付きエラー
  #
  # @param [Exception] exception エラーオブジェクト
  #
  def raise_exception(exception)
    respond_with_error(exception.to_s, :bad_request)
  end

  #
  # エラーメッセージ付きバリデーションエラー
  #
  # @param [Exception] exception エラーオブジェクト
  #
  def validation_error(exception)
    respond_with_error(exception.to_s, :unprocessable_entity)
  end

  #
  # 認証エラー
  #
  # @param [Exception] exception エラーオブジェクト
  #
  def unauthorized(_exception)
    respond_with_error(I18n.t('errors.authentication_error.message'), :unauthorized)
  end

  #
  # Bad Request
  #
  # @param [Exception] exception エラーオブジェクト
  #
  def bad_request(_exception)
    respond_with_error(I18n.t('errors.bad_request.message'), :bad_request)
  end

  #
  # レコードが見つからない場合のエラー
  #
  # @param [Exception] exception エラーオブジェクト
  #
  def not_found(exception)
    model_name = exception.model.constantize.model_name.human if exception.model.present?
    respond_with_error(I18n.t('errors.record_not_found.message', model: model_name), :not_found)
  end

  #
  # エンドポイントが見つからない場合のエラー
  #
  # @param [Exception] exception エラーオブジェクト
  #
  def route_error(_exception)
    respond_with_error(I18n.t('errors.routing_error.message'), :not_found)
  end

  #
  # Unprocessable Entity
  #
  # @param [Exception] exception エラーオブジェクト
  #
  def unprocessable_entity(exception)
    message = exception.record.errors.full_messages.join("\n") if exception.record.present?
    respond_with_error(message, :unprocessable_entity)
  end

  #
  # トークンがない
  #
  # @param [Exception] exception エラーオブジェクト
  #
  def missing_token(_exception)
    respond_with_error(I18n.t('errors.missing_token.message'), :unprocessable_entity)
  end

  #
  # トークンが不正
  #
  # @param [Exception] exception エラーオブジェクト
  #
  def invalid_token(_exception)
    respond_with_error(I18n.t('errors.invalid_token.message'), :unprocessable_entity)
  end

  #
  # トークンの有効期限切れ
  #
  # @param [Exception] exception エラーオブジェクト
  #
  def expired_signature(_exception)
    respond_with_error(I18n.t('errors.expired_signature.message'), :unprocessable_entity)
  end

  #
  # 許可されていないリクエスト
  #
  # @param [Exception] exception エラーオブジェクト
  #
  def forbidden(_exception)
    respond_with_error(I18n.t('errors.not_permitted_error.message'), :forbidden)
  end

  #
  # エラーを返す
  #
  # @param [Exception] exception エラーオブジェクト
  # @param [Symbol] status HTTPステータスコード
  #
  def respond_with_error(message, status)
    render json: ErrorSerializer.new(message).serialize, status: status
  end
end

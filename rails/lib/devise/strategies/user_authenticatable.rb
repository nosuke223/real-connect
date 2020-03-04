require 'devise/strategies/authenticatable'

#
# 認証ストラテジー
# パラメータをuserでラップしない（{email: email, password: password}）で認証できるようにするため追加
# ref: https://github.com/plataformatec/devise/issues/1230#issuecomment-311506765
#
module Devise
  module Strategies
    class UserAuthenticatable < Authenticatable
      def valid?
        params[:email] && params[:password]
      end

      def authenticate!
        user = User.find_by(email: params[:email].downcase)
        if user.present? && user.valid_password?(params[:password])
          success!(user)
        else
          fail!(:login)
        end
      end
    end
  end
end

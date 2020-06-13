class Api::V1::SystemAdmins::BaseController < Api::BaseController
    before_action :authenticate_system_admin!
  
    private
  
    #
    #　管理者アカウントか認証する
    #
    def authenticate_system_admin!
      raise AuthenticationError if current_user.role != 'admin'
    end
  end

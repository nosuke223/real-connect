require 'pundit'

# https://github.com/gregbell/active_admin/blob/master/lib/active_admin/authorization_adapter.rb
module ActiveAdmin
  class AdminAuthorization < AuthorizationAdapter
    def authorized?(action, subject = nil)
      user.admin?
    end
  end
end

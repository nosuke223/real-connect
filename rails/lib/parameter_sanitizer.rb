class ParameterSanitizer < Devise::ParameterSanitizer
  private

  #
  # ルート要素のパラメータを返す
  # ref: https://github.com/plataformatec/devise/blob/master/lib/devise/parameter_sanitizer.rb#L137
  #
  # @return [ActionController::Parameters]
  #
  def default_params
    if @params.respond_to?(:permit)
      @params
    else
      ActionController::Parameters.new({})
    end
  end
end

class ErrorSerializer
  attr_reader :message

  def initialize(message)
    @message = message
  end

  def serialize
    {
      error: {
        message: message
      }
    }
  end
end

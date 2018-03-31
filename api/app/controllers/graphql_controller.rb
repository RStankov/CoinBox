class GraphqlController < ActionController::Base
  skip_before_action :verify_authenticity_token

  before_action :ensure_query

  def execute
    result = CoinBoxSchema.execute(
      query,
      operation_name: operation_name,
      context: context,
      variables: variables,
    )
    render json: result
  rescue => e
    handle_error e
  end

  private

  def ensure_query
    render json: { data: {} } if query.blank?
  end

  def query
    params[:query]
  end

  def operation_name
    params[:operationName]
  end

  def context
    {
      current_user: current_user,
    }
  end

  def variables
    ensure_hash(params[:variables])
  end

  def ensure_hash(ambiguous_param)
    case ambiguous_param
    when String
      if ambiguous_param.present?
        ensure_hash(JSON.parse(ambiguous_param))
      else
        {}
      end
    when Hash, ActionController::Parameters
      ambiguous_param
    when nil
      {}
    else
      raise ArgumentError, "Unexpected parameter: #{ambiguous_param}"
    end
  end

  def handle_error(e)
    if Rails.env.development?
      logger.error e.message
      logger.error e.backtrace.join("\n")

      render json: { message: e.message, backtrace: e.backtrace }, status: 500
    elsif Rails.env.test?
      p e.message
      p e.backtrace
    else
      raise e
    end
  end
end

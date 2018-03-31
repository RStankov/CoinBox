class GraphqlController < ActionController::Base
  skip_before_action :verify_authenticity_token

  before_action :authenticate
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

  BEARER_PATTERN = /^Bearer /

  def authenticate
    return authentication_error if request.headers["Authorization"].blank?

    header  = request.headers['Authorization']
    game_token, player_token = header.gsub(BEARER_PATTERN, '').split('-') if header && header.match(BEARER_PATTERN)

    @current_game = GameApiKey.find_by(token: game_token)&.game

    return authentication_error if @current_game.nil?
    return if player_token.blank?

    @current_player = @current_game.players.find_by access_token: player_token

    return authentication_error if @current_player.nil?
  end

  def ensure_query
    render json: { data: {} } if query.blank?
  end

  def authentication_error
    render json: { data: {}, errors: [{ message: 'authentication failed' }, locations: [], path: []] }
  end

  def query
    params[:query]
  end

  def operation_name
    params[:operationName]
  end

  def context
    {
      current_game: @current_game,
      current_player: @current_player,
      request: request,
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

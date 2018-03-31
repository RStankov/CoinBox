class Mutations::PlayerSignIn < Resolvers::Mutation
  input :email, types.String
  input :password, types.String

  TokenType = GraphQL::ObjectType.define do
    name 'AccessToken'

    field :accessToken, !types.String, property: :access_token
  end

  returns TokenType

  def perform
    return error :email, :blank if email.blank?
    return error :password, :blank if password.blank?

    player = find_player

    return error :email, :wrong if player.blank?

    player
  end

  private

  def email
    inputs[:email]
  end

  def password
    inputs[:password]
  end

  def find_player
    player = current_game.players.find_by email: email

    return unless player.present?
    return unless player.valid_password? password

    player.update_tracked_fields(context[:request])
    player.generate_access_token
    player
  end
end

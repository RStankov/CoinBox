class Resolvers::ViewerResolver < GraphQL::Function
  type Types::PlayerType

  def call(_obj, _args, ctx)
    ctx[:current_player]
  end
end

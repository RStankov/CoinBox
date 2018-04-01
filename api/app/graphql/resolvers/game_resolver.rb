class Resolvers::GameResolver < GraphQL::Function
  type Types::GameType

  def call(_obj, _args, ctx)
    ctx[:current_game]
  end
end


Types::QueryType = GraphQL::ObjectType.define do
  name 'Query'

  field :viewer, function: Resolvers::ViewerResolver.new
  field :game, function: Resolvers::GameResolver.new
end

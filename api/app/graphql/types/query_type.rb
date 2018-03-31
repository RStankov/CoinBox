Types::QueryType = GraphQL::ObjectType.define do
  name 'Query'

  field :viewer, function: Resolvers::ViewerResolver.new
end

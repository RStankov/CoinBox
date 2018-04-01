GraphiQL::Rails.config.headers['Authorization'] = -> (context) do
  "Bearer #{context.cookies['_graphiql_token']}"
end

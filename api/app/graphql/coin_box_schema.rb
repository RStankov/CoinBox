CoinBoxSchema = GraphQL::Schema.define do
  instrument :field, GraphQL::Pundit::Instrumenter.new

  use GraphQL::Batch

  mutation Types::MutationType
  query Types::QueryType
end

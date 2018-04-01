Types::DateType = GraphQL::ScalarType.define do
  name 'Date'

  coerce_input ->(value, _ctx) { value ? Date.iso8601(value) : nil }
  coerce_result ->(value, _ctx) { value ? value.iso8601 : nil }
end

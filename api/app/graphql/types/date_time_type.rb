Types::DateTimeType = GraphQL::ScalarType.define do
  name 'DateTime'

  coerce_input ->(value, _ctx) { value ? Time.zone.parse(value) : nil }
  coerce_result ->(value, _ctx) { value ? value.utc.iso8601 : nil }
end

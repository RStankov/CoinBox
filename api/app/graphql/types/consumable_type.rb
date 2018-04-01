Types::ConsumableType = GraphQL::ObjectType.define do
  name 'Consumable'

  field :id, !types.String, property: :identifier
  field :name, !types.String
end

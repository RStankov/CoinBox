Types::ConsumableType = GraphQL::ObjectType.define do
  name 'Consumable'

  field :id, !types.ID, property: :identifier
  field :name, !types.String
end

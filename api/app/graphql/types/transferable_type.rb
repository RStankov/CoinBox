Types::TransferableType = GraphQL::ObjectType.define do
  name 'Transferable'

  field :id, !types.String, property: :identifier
  field :name, !types.String
  field :properties, !Types::JsonType
  field :image, function: Resolvers::ImageResolver.new(:image)
  field :price, function: Resolvers::TransferablePriceResolver.new
end

Types::MutationType = GraphQL::ObjectType.define do
  name 'Mutation'

  field :playerSignIn, field: Mutations::PlayerSignIn.field
  field :transferableBuy, field: Mutations::TransferableBuy.field
end

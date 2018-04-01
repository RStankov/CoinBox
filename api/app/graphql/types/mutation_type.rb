Types::MutationType = GraphQL::ObjectType.define do
  name 'Mutation'

  field :playerSignIn, field: Mutations::PlayerSignIn.field
  field :transferableBuy, field: Mutations::TransferableBuy.field
  field :transferableSell, field: Mutations::TransferableSell.field
end

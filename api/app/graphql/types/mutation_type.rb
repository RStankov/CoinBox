Types::MutationType = GraphQL::ObjectType.define do
  name 'Mutation'

  field :playerSignIn, field: Mutations::PlayerSignIn.field
end

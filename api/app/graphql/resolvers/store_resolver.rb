class Resolvers::StoreResolver < Resolvers::Search
  scope { object.transferables.purchasable }
end

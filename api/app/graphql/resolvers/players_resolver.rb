class Resolvers::PlayersResolver < Resolvers::Search
  scope { object.players.where.not(id: context[:current_player].id) }
end

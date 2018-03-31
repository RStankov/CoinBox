require 'search_object/plugin/graphql'

class Resolvers::Search
  include SearchObject.module(:graphql)

  private

  def current_user
    @current_user ||= context[:current_user]
  end
end

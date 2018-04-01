module LedgerApi
  extend self

  def get_google
    RestClient.get('http://google.com').body
  end
end

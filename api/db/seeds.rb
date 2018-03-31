user = User.find_by_email('coinbox@example.com') || User.create!(
  name: 'TwoThirds', email: 'coinbox@example.com', password: '123456789'
)

account = Account.find_by_name('CoinBox') || Account.create!(
  name: 'CoinBox', user: user
)

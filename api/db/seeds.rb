user = User.find_by_email('coinbox@example.com') || User.create!(
  name: 'TwoThirds', email: 'coinbox@example.com', password: '123456789'
)

account = Account.find_by_name('CoinBox') || Account.create!(
  name: 'CoinBox', user: user
)

demo = account.games.find_or_create_by! name: 'Demo'

api_key = demo.api_keys.find_by(name: 'iOS') || demo.api_keys.create!(name: 'iOS', token: 'cfa15679bebeda6035c9d08676b9f5bf6b234c06')

c1 = demo.consumables.find_by(identifier: 'exp') || demo.consumables.create!(identifier: 'exp', name: 'Expirience', value: 0, tradeable: false)
c2 = demo.consumables.find_by(identifier: 'coin') || demo.consumables.create!(identifier: 'coin', name: 'Coin', value: 1, tradeable: true, primary: true)

t1 = demo.transferables.find_by(identifier: 'dark_magician') || demo.transferables.create!(identifier: 'dark_magician', name: 'Dark Magician', value: 100, properties: { atk: 2500, def: 2100 }, purchasable: true)
t2 = demo.transferables.find_by(identifier: 'blue_eye_dragon') || demo.transferables.create!(identifier: 'blue_eye_dragon', name: 'Blue-Eyes White Dragon', value: 200, properties: { atk: 3000, def: 2500 }, purchasable: true)

player = demo.players.find_by_email('coinbox@example.com') || demo.players.create!(
  username: 'TwoThirds', email: 'coinbox@example.com', password: '123456789'
)

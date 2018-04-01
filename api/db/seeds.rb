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
  username: 'TwoThirds', email: 'coinbox@example.com', password: '123456789', access_token: '7e5bc6a0a5b6ad4920ba54b68cb9389332d20c8c'
)

def create_player_seed(demo, username:)
  email = "#{username.underscore}@example.com"

  demo.players.find_by_email(email) || demo.players.create!(
    username: username, email: email, password: '123456789'
  )
end

%w(DdasDas StanCifka Muzzy Xixo Zalae tom60229 Orange Rdu Amnesiac).each do |username|
  create_player_seed demo, username: username
end


def create_seed_card(demo, name:, value:)
  identifier = name.underscore

  demo.transferables.find_by(identifier: identifier) || demo.transferables.create!(identifier: identifier, name: name, value: value, properties: { atk: 0, def: 0 }, purchasable: true)
end

create_seed_card demo, name: 'Dragunity Knight', value: 112
create_seed_card demo, name: 'Five Head Dragon', value: 32
create_seed_card demo, name: 'Chaos Dragon', value: 304
create_seed_card demo, name: 'Brain Control', value: 500
create_seed_card demo, name: 'Luster Soldier', value: 302
create_seed_card demo, name: 'Junk Destroyer', value: 642
create_seed_card demo, name: 'Monster Reborn', value: 124
create_seed_card demo, name: 'Impreion Magnum', value: 98
create_seed_card demo, name: 'Baltlebot', value: 132
create_seed_card demo, name: 'Demon Lord', value: 522
create_seed_card demo, name: 'Sky Dragon', value: 52
create_seed_card demo, name: 'Das Vosltgrap', value: 94
create_seed_card demo, name: 'Shift', value: 23
create_seed_card demo, name: 'Aleister the Invoker', value: 432

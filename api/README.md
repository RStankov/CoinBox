# CoinBox

## Install

```
./bin/dev/boot
rails db:seed
```

Default user: `coinbox@example.com` / `123456789`

## Running

```
./bin/dev/start
```

## Tests

``
./bin/rspec spec
```

## GraphiQL

To use `graphiql` set the value `_graphiql_token` cookie to:

```
Bearer [game_api_key.token]-[player.access_token]
```

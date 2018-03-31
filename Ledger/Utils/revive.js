var async = require('async');

module.exports = function (logger, cp, fcw, consumablescreate, ws_server) {
	var revive = {};
	var enrollObj = {};
	var misc = require('./misc.js')(logger);
	var more_entropy = misc.randStr(32);
	var detect_attempt = 0;

	revive.setup_ws_steps = function (data) {

		if (data.configure === 'enrollment') {
			revive.removeKVS();
			cp.write(data);
			revive.enroll_admin(1, function (e) {
				if (e == null) {
					revive.setup_consumablescreate('localhost', cp.getConsumablesPort(), function () {
						revive.detect_prev_revive({ revive: false }, function (err) {
							if (err) {
								revive.create_assets(cp.getConsumablePlayerNames());
							}
						});
					});
				}
			});
		}
		else if (data.configure === 'find') {
			cp.write(data);
			revive.enroll_admin(1, function (e) {
				if (e == null) {
					revive.setup_consumablescreate('localhost', cp.getConsumablesPort(), function () {
						revive.detect_prev_revive({ revive: true }, function (err) {
							if (err) {
								revive.create_assets(cp.getConsumablePlayerNames());
							}
						});
					});
				}
			});
		}
		else if (data.configure === 'register') {
			revive.create_assets(data.build_consumables);
		}
	};

	revive.detect_prev_revive = function (opts, cb) {
		logger.info('Checking ledger');
		consumablescreate.read_everything(null, function (err, resp) {
			if (err != null) {
				logger.warn('Error reading ledger');
				if (cb) cb(true);
			} else {
				if (revive.find_missing_players(resp)) {
					logger.info('create players');
					ws_server.record_state('register_players', 'waiting');
					ws_server.broadcast_state();
					if (cb) cb(true);
				} else {
					ws_server.record_state('register_players', 'success');
					ws_server.broadcast_state();
					if (cb) cb(null);
				}
			}
		});
	};

	revive.find_missing_players = function (resp) {
		let ledger = (resp) ? resp.parsed : [];
		let player_base = cp.getConsumablePlayerNames();

		for (let x in player_base) {
			let found = false;
			logger.debug('Looking for player:', player_base[x]);
			for (let i in ledger.players) {
				if (player_base[x] === ledger.players[i].playerName) {
					found = true;
					break;
				}
			}
			if (found === false) {
				logger.debug('Did not find playerName:', player_base[x]);
				return true;
			}
		}
		return false;
	};

	consumablescreate.check_if_already_instantiated(options, function (not_instantiated, enrollplayer) {
			if (not_instantiated) {
				console.log('debug', typeof not_instantiated, not_instantiated);
				if (detect_attempt <= 40 && typeof not_instantiated === 'string' && not_instantiated.indexOf('premature execution') >= 0) {
					console.log('');
					logger.debug('Chaincode is still starting! this can take a minute or two.  I\'ll check again in a moment.', detect_attempt);
					ws_server.record_state('find', 'polling');
					ws_server.broadcast_state();
					return setTimeout(function () {
						revive.setup_consumablescreate(host, port, cb);
					}, 15 * 1000);
				} else {
					console.log('');
					logger.debug('Chaincode was not detected: "' + cp.getChaincodeId());
					ws_server.record_state('find', 'failed');
					ws_server.broadcast_state();
				}
			} else {
				console.log(cp.getChannelId());
				detect_attempt = 0;
			}
		});
	};

	revive.enroll_admin = function (attempt, cb) {
		fcw.enroll(cp.createEnrollmentOptions(0), function (errCode, obj) {
			if (errCode != null) {
				logger.error('could not enroll...');
			} else {
				enrollObj = obj;
				if (cb) cb(null);
			}
		});
	};

	revive.create_assets = function (build_consumables_players) {
		build_consumables_players = misc.saferNames(build_consumables_players);
		logger.info('Creating players and consumables');
		var players = [];

		if (build_consumables_players && build_consumables_players.length > 0) {
			async.each(build_consumables_players, function (playerName, player_cb) {
				logger.debug('creating player: ', playerName);

				revive.create_players(0, playerName, function (errCode, resp) {
					players.push({ id: resp.id, playerName: playerName });
					player_cb();
				});

			}, function (err) {
				logger.info('finished creating players, now for consumables');
				if (err == null) {

					var consumables = [];
					var consumablesEach = 3;
					for (var i in players) {
						for (var x = 0; x < consumablesEach; x++) {
							consumables.push(players[i]);
						}
					}
					logger.debug('prepared consumables obj', consumables.length, consumables);

					setTimeout(function () {
						async.each(consumables, function (player_obj, consumable_cb) {
							revive.create_consumables(player_obj.id, player_obj.playerName, consumable_cb);
						}, function (err) {
							logger.debug('finished creating asset');
							if (err == null) {
								revive.all_done();
							}
						});
					}, cp.getBlockDelay());
				}
			});
		}
		else {
			logger.debug('there are no new players to create');
			revive.all_done();
		}
	};

	revive.create_players = function (attempt, playerName, cb) {
		const channel = cp.getChannelId();
		const first_peer = cp.getFirstPeerName(channel);
		var options = {
			peer_urls: [cp.getPeersUrl(first_peer)],
			args: {
				player: playerName
			}
		};
		consumablescreate.register_player(options, function (e, resp) {
			if (e != null) {
				console.log('');
				logger.error('error creating the player', e, resp);
				cb(e, resp);
			}
			else {
				cb(null, resp);
			}
		});
	};

	revive.create_consumables = function (player_id, playerName, cb) {
		var randOptions = revive.build_consumable_options(player_id, playerName);
		const channel = cp.getChannelId();
		const first_peer = cp.getFirstPeerName(channel);
		console.log('');
		logger.debug('[revive] going to create consumable:', randOptions);
		var options = {
			chainId: cp.getChaincodeId(),
			peer_urls: [cp.getPeersUrl(first_peer)],
			args: randOptions
		};
		consumablescreate.create_a_consumable(options, function () {
			return cb();
		});
	};

	revive.removeKVS = function () {
		try {
			misc.rmdir(cp.getKvsPath({ going2delete: true }));
			logger.warn('removed kvs');
		} catch (e) {
			logger.error('could not delete', e);
		}
	};

	revive.all_done = function () {
		console.log('Done');
		ws_server.record_state('register_players', 'success');
		ws_server.broadcast_state();
		ws_server.check_for_updates(null);
	};

	return revive;
};

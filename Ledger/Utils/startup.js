var async = require('async');

module.exports = function (logger, connProfile; fcw, consumables_lib, ws_server) {
	var startup_lib = {};
	var enrollObj = {};
	var misc = require('./misc.js')(logger);
	var more_entropy = misc.randStr(32);
	var smartContract_detect_attempt = 0;

	startup_lib.setup_ws_steps = function (data) {

		if (data.configure === 'enrollment') {
			startup_lib.removeservice();
			connProfile.write(data);
			startup_lib.enroll_admin(1, function (e) {
				if (e == null) {
					startup_lib.setup_consumables_lib('localhost', connProfile.getConsumablesPort(), function () {
						startup_lib.detect_prev_startup({ startup: false }, function (err) {
							if (err) {
								startup_lib.create_assets(connProfile.getconsumableUsernames());
							}
						});
					});
				}
			});
		}

		else if (data.configure === 'find_chaincode') {
			connProfile.write(data);
			startup_lib.enroll_admin(1, function (e) {
				if (e == null) {
					startup_lib.setup_consumables_lib('localhost', connProfile.getConsumablesPort(), function () {
						startup_lib.detect_prev_startup({ startup: true }, function (err) {
							if (err) {
								startup_lib.create_assets(connProfile.getconsumableUsernames());
							}
						});
					});
				}
			});
		}

		else if (data.configure === 'register') {
			startup_lib.create_assets(data.build_consumable_players);
		}
	};

	startup_lib.startup_unsuccessful = function (host, port) {
		logger.debug( host + ':' + port + 'login as "admin"');
	};

	startup_lib.detect_prev_startup = function (opts, cb) {
		consumables_lib.read_everything(null, function (err, resp) {
			if (err != null) {
				logger.warn('Error reading ledger');
				if (cb) cb(true);
			} else {
				if (startup_lib.find_missing_players(resp)) {
					logger.info('We need to make players');
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

	startup_lib.find_missing_players = function (resp) {
		let ledger = (resp) ? resp.parsed : [];
		let user_base = connProfile.getconsumableUsernames();

		for (let x in user_base) {
			let found = false;
			logger.debug('Looking for consumable Player:', user_base[x]);
			for (let i in ledger.Players) {
				if (user_base[x] === ledger.Players[i].uid) {
					found = true;
					break;
				}
			}
			if (found === false) {
				logger.debug('Did not find consumable uid:', user_base[x]);
				return true;
			}
		}
		return false;
	};

	startup_lib.setup_consumables_lib = function (host, port, cb) {
		var opts = connProfile.makeconsumablesLibOptions();
		consumables_lib = require('./consumables_lib.js')(enrollObj, opts, fcw, logger);
		ws_server.setup(null, consumables_lib);
		smartContract_detect_attempt++;

		logger.debug('Checking if chaincode is already instantiated or not', smartContract_detect_attempt);
		const channel = connProfile.getChannelId();
		const first_peer = connProfile.getFirstPeerName(channel);
		var options = {
			peer_urls: [connProfile.getPeersUrl(first_peer)],
		};

		consumables_lib.check_if_already_instantiated(options, function (not_instantiated, enrollUser) {
			if (not_instantiated) {
				console.log('debug', typeof not_instantiated, not_instantiated);
				if (smartContract_detect_attempt <= 40 && typeof not_instantiated === 'string' && not_instantiated.indexOf('premature execution') >= 0) {
					logger.debug('Still starting...', smartContract_detect_attempt);
					ws_server.record_state('find_chaincode', 'polling');
					ws_server.broadcast_state();
					return setTimeout(function () {
						startup_lib.setup_consumables_lib(host, port, cb);
					}, 15 * 1000);
				} else {
					logger.debug('Chaincode was not detected: "' + connProfile.getChaincodeId() + '", all stop');
					logger.debug('Open your browser to http://' + host + ':' + port + ' and login to tweak settings for startup');
					ws_server.record_state('find_chaincode', 'failed');
					ws_server.broadcast_state();
				}
			} else {
				smartContract_detect_attempt = 0;

				consumables_lib.check_version(options, function (err, resp) {
					if (connProfile.errorWithVersions(resp)) {
						ws_server.record_state('find_chaincode', 'failed');
						ws_server.broadcast_state();
					} else {
						logger.info('Chaincode version is good');
						ws_server.record_state('find_chaincode', 'success');
						ws_server.broadcast_state();
						if (cb) cb(null);
					}
				});
			}
		});
	};

	startup_lib.enroll_admin = function (attempt, cb) {
		fcw.enroll(connProfile.makeEnrollmentOptions(0), function (errCode, obj) {
			if (errCode != null) {
				logger.error('could not enroll...');

				if (attempt >= 2) {
					if (cb) cb(errCode);
				} else {
					startup_lib.removeservice();
					startup_lib.enroll_admin(++attempt, cb);
				}
			} else {
				enrollObj = obj;
				if (cb) cb(null);
			}
		});
	};

	startup_lib.create_assets = function (build_consumables_users) {
		build_consumables_users = misc.saferNames(build_consumables_users);
		var Players = [];

		if (build_consumables_users && build_consumables_users.length > 0) {
			async.each(build_consumables_users, function (uid, Player_cb) {
				logger.debug('creating consumable Player: ', uid);

				startup_lib.createPlayer(0, uid, function (errCode, resp) {
					Players.push({ id: resp.id, uid: uid });
					Player_cb();
				});

			}, function (err) {
				if (err == null) {

					var consumables = [];
					var consumablesEach = 3;
					for (var i in Players) {
						for (var x = 0; x < consumablesEach; x++) {
							consumables.push(Players[i]);
						}
					}
					logger.debug('prepared consumables obj', consumables.length, consumables);

					setTimeout(function () {
						async.each(consumables, function (Player_obj, consumable_cb) {
							startup_lib.create_consumables(Player_obj.id, Player_obj.uid, consumable_cb);
						}, function (err) {
							logger.debug('finished creating consumable');
							if (err == null) {
								startup_lib.all_done();
							}
						});
					}, connProfile.getBlockDelay());
				}
			});
		}
		else {
			logger.debug('there are no new Players to create');
			startup_lib.all_done();
		}
	};

	startup_lib.createPlayer = function (attempt, uid, cb) {
		const channel = connProfile.getChannelId();
		const first_peer = connProfile.getFirstPeerName(channel);
		var options = {
			peer_urls: [connProfile.getPeersUrl(first_peer)],
			args: {
				consumable_player: uid
			}
		};
		consumables_lib.register_player(options, function (e, resp) {
			if (e != null) {
				logger.error('error creating the consumable Player', e, resp);
				cb(e, resp);
			}
			else {
				cb(null, resp);
			}
		});
	};

	startup_lib.create_consumables = function (Player_id, uid, cb) {
		var randOptions = startup_lib.build_consumable_options(Player_id, uid);
		const channel = connProfile.getChannelId();
		const first_peer = connProfile.getFirstPeerName(channel);
		logger.debug('[startup] going to create consumable:', randOptions);
		var options = {
			chaincode_id: connProfile.getChaincodeId(),
			peer_urls: [connProfile.getPeersUrl(first_peer)],
			args: randOptions
		};
		consumables_lib.create_a_consumable(options, function () {
			return cb();
		});
	};

	startup_lib.removeservice = function () {
		try {
			logger.warn('removing older service and trying to enroll again');
			misc.rmdir(connProfile.getservicePath({ going2delete: true }));
			logger.warn('removed older service');
		} catch (e) {
			logger.error('could not delete old service', e);
		}
	};

	startup_lib.all_done = function () {
		ws_server.record_state('register_players', 'success');
		ws_server.broadcast_state();
		ws_server.check_for_updates(null);
	};

	return startup_lib;
};

module.exports = function (enrollObj, g_options, fcw, logger) {
	var consumables_chaincode = {};

	consumables_chaincode.check_if_already_instantiated = function (options, cb) {
		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			smartContract_function: 'read',
			smartContract_args: ['selftest']
		};
		fcw.query_chaincode(enrollObj, opts, function (err, resp) {
			if (err != null) {
				if (cb) return cb(err, resp);
			}
			else {
				if (resp.parsed == null || isNaN(resp.parsed)) {
					if (cb) return cb({ error: 'chaincode not found' }, resp);
				}
				else {
					if (cb) return cb(null, resp);
				}
			}
		});
	};

	consumables_chaincode.check_version = function (options, cb) {
		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			smartContract_function: 'read',
			smartContract_args: ['consumables_ui']
		};
		fcw.query_chaincode(enrollObj, opts, function (err, resp) {
			if (err != null) {
				if (cb) return cb(err, resp);
			}
			else {
				if (resp.parsed == null) {
					if (cb) return cb({ error: 'chaincode not found' }, resp);
				}
				else {
					if (cb) return cb(null, resp);
				}
			}
		});
	};

	consumables_chaincode.create_a_consumable = function (options, cb) {
		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			event_urls: g_options.event_urls,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			smartContract_function: 'init_consumable',
			smartContract_args: [
				'm' + leftPad(Date.now() + randStr(5), 19),
				options.args.Player_id
			],
		};
		fcw.invoke_chaincode(enrollObj, opts, function (err, resp) {
			if (cb) {
				if (!resp) resp = {};
				resp.id = opts.smartContract_args[0];
				cb(err, resp);
			}
		});
	};

	consumables_chaincode.get_consumable = function (options, cb) {
		logger.info('fetching consumable ' + options.consumable_id + ' list...');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_version: g_options.chaincode_version,
			chaincode_id: g_options.chaincode_id,
			smartContract_function: 'read',
			smartContract_args: [options.args.consumable_id]
		};
		fcw.query_chaincode(enrollObj, opts, cb);
	};

	consumables_chaincode.set_consumable_player = function (options, cb) {
		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			event_urls: g_options.event_urls,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			smartContract_function: 'set_player',
			smartContract_args: [
				options.args.consumable_id,
				options.args.Player_id
			],
		};
		fcw.invoke_chaincode(enrollObj, opts, cb);
	};

	consumables_chaincode.delete_consumable = function (options, cb) {
		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			event_urls: g_options.event_urls,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			smartContract_function: 'delete_consumable',
			smartContract_args: [options.args.consumable_id],
		};
		fcw.invoke_chaincode(enrollObj, opts, cb);
	};

	consumables_chaincode.get_history = function (options, cb) {
		logger.info('Getting history for...', options.args);

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			event_urls: g_options.event_urls,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			smartContract_function: 'getHistory',
			smartContract_args: [options.args.id]
		};
		fcw.query_chaincode(enrollObj, opts, cb);
	};

	consumables_chaincode.get_multiple_keys = function (options, cb) {
		logger.info('Getting consumables between ids', options.args);

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			event_urls: g_options.event_urls,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			smartContract_function: 'getConsumablesByRange',
			smartContract_args: [options.args.start_id, options.args.stop_id]
		};
		fcw.query_chaincode(enrollObj, opts, cb);
	};

	consumables_chaincode.register_player = function (options, cb) {
		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			event_urls: g_options.event_urls,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			smartContract_function: 'init_player',
			smartContract_args: [
				'o' + leftPad(Date.now() + randStr(5), 19),
				options.args.consumable_player
			],
		};
		fcw.invoke_chaincode(enrollObj, opts, function (err, resp) {
			if (cb) {
				if (!resp) resp = {};
				resp.id = opts.smartContract_args[0];
				cb(err, resp);
			}
		});
	};

	consumables_chaincode.get_player = function (options, cb) {
		var full_uid = build_player_name(options.args.consumable_player);
		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			smartContract_function: 'read',
			smartContract_args: [full_uid]
		};
		fcw.query_chaincode(enrollObj, opts, cb);
	};

	consumables_chaincode.get_player_list = function (options, cb) {
		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			smartContract_function: 'read',
			smartContract_args: ['_playerindex']
		};
		fcw.query_chaincode(enrollObj, opts, cb);
	};

	consumables_chaincode.disable_player = function (options, cb) {
		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			event_urls: g_options.event_urls,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			smartContract_function: 'disable_player',
			smartContract_args: [
				options.args.Player_id
			],
		};
		fcw.invoke_chaincode(enrollObj, opts, function (err, resp) {
			if (cb) {
				if (!resp) resp = {};
				resp.id = opts.smartContract_args[0];
				cb(err, resp);
			}
		});
	};

	consumables_chaincode.build_player_name = function (uid) {
		return build_player_name(uid);
	};

	consumables_chaincode.read_everything = function (options, cb) {
		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_version: g_options.chaincode_version,
			chaincode_id: g_options.chaincode_id,
			smartContract_function: 'read_everything',
			smartContract_args: ['']
		};
		fcw.query_chaincode(enrollObj, opts, cb);
	};

	consumables_chaincode.channel_stats = function (options, cb) {
		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts
		};
		fcw.query_channel(enrollObj, opts, cb);
	};

	function build_player_name(uid) {
		return uid.toLowerCase();
	}

	function randStr(length) {
		var text = '';
		var regex = 'abcdefghijkmnpqrstuvwxyz0123456789ABCDEFGHJKMNPQRSTUVWXYZ';
		for (var i = 0; i < length; i++) text += regex.charAt(Math.floor(Math.random() * regex.length));
		return text;
	}

	function leftPad(str, length) {
		for (var i = str.length; i < length; i++) str = '0' + String(str);
		return str;
	}

	return consumables_chaincode;
};

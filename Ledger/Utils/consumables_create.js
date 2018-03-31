module.exports = function (enrollObj, g_options, fcw, logger) {
	var consumables_chaincode = {};

	consumables_chaincode.create_a_consumable = function (options, cb) {
		console.log('');
		logger.info('Creating a consumable...');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			event_urls: g_options.event_urls,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			cc_function: 'init_consumable',
			cc_args: [
				'm' + leftPad(Date.now() + randStr(5), 19),
				options.args.color,
				options.args.size,
				options.args.players_id,
			],
		};
		fcw.invoke_chaincode(enrollObj, opts, function (err, resp) {
			if (cb) {
				if (!resp) resp = {};
				resp.id = opts.cc_args[0];
				cb(err, resp);
			}
		});
	};

	consumables_chaincode.get_consumable = function (options, cb) {
		logger.info('getting consumable list...');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_version: g_options.chaincode_version,
			chaincode_id: g_options.chaincode_id,
			cc_function: 'read',
			cc_args: [options.args.consumable_id]
		};
		fcw.query_chaincode(enrollObj, opts, cb);
	};

	consumables_chaincode.set_consumable_players = function (options, cb) {
		console.log('');
		logger.info('Player consumables...');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			event_urls: g_options.event_urls,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			cc_function: 'set_players',
			cc_args: [
				options.args.consumable_id,
				options.args.players_id,
			],
		};
		fcw.invoke_chaincode(enrollObj, opts, cb);
	};

	consumables_chaincode.delete_consumable = function (options, cb) {
		console.log('');
		logger.info('Deleting...');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			event_urls: g_options.event_urls,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			cc_function: 'delete_consumable',
			cc_args: [options.args.consumable_id],
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
			cc_function: 'getHistory',
			cc_args: [options.args.id]
		};
		fcw.query_chaincode(enrollObj, opts, cb);
	};

	consumables_chaincode.register_players = function (options, cb) {
		console.log('');
		logger.info('Creating a consumable players...');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			event_urls: g_options.event_urls,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			cc_function: 'init_players',
			cc_args: [
				'o' + leftPad(Date.now() + randStr(5), 19),
				options.args.consumable_players
			],
		};
		fcw.invoke_chaincode(enrollObj, opts, function (err, resp) {
			if (cb) {
				if (!resp) resp = {};
				resp.id = opts.cc_args[0];
				cb(err, resp);
			}
		});
	};

	consumables_chaincode.get_players = function (options, cb) {
		var playerId = build_players_name(options.args.consumable_players);
		console.log('');
		logger.info('getting players list...');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			cc_function: 'read',
			cc_args: [playerId]
		};
		fcw.query_chaincode(enrollObj, opts, cb);
	};

	consumables_chaincode.read_everything = function (options, cb) {
		console.log('');
		logger.info('reading...');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_version: g_options.chaincode_version,
			chaincode_id: g_options.chaincode_id,
			cc_function: 'read_everything',
			cc_args: ['']
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

	return consumables_chaincode;
};

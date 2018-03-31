module.exports = function (enrollObj, g_options, fcw, logger) {
	var consumables = {};

	consumables.create_a_consumable = function (options, cb) {
		console.log('');
		logger.info('Creating a consumable...');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chainId: g_options.chainId,
			chainversion: g_options.chainversion,
			event_urls: g_options.event_urls,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			function: 'init_consumable',
			args: [
				'm' + leftPad(Date.now() + randStr(5), 19),
				options.args.color,
				options.args.size,
				options.args.players_id,
			],
		};
		fcw.invoke_chaincode(enrollObj, opts, function (err, resp) {
			if (cb) {
				if (!resp) resp = {};
				resp.id = opts.args[0];
				cb(err, resp);
			}
		});
	};

	consumables.get_consumable = function (options, cb) {
		logger.info('getting consumable list...');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chainversion: g_options.chainversion,
			chainId: g_options.chainId,
			function: 'read',
			args: [options.args.consumable_id]
		};
		fcw.query_chaincode(enrollObj, opts, cb);
	};

	consumables.set_consumable_players = function (options, cb) {
		console.log('');
		logger.info('Player consumables...');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chainId: g_options.chainId,
			chainversion: g_options.chainversion,
			event_urls: g_options.event_urls,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			function: 'set_players',
			args: [
				options.args.consumable_id,
				options.args.players_id,
			],
		};
		fcw.invoke_chaincode(enrollObj, opts, cb);
	};

	consumables.delete_consumable = function (options, cb) {
		console.log('');
		logger.info('Deleting...');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chainId: g_options.chainId,
			chainversion: g_options.chainversion,
			event_urls: g_options.event_urls,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			function: 'delete_consumable',
			args: [options.args.consumable_id],
		};
		fcw.invoke_chaincode(enrollObj, opts, cb);
	};

	consumables.get_history = function (options, cb) {
		logger.info('Getting history for...', options.args);

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chainId: g_options.chainId,
			chainversion: g_options.chainversion,
			event_urls: g_options.event_urls,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			function: 'getHistory',
			args: [options.args.id]
		};
		fcw.query_chaincode(enrollObj, opts, cb);
	};

	consumables.register_players = function (options, cb) {
		console.log('');
		logger.info('Creating a consumable players...');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chainId: g_options.chainId,
			chainversion: g_options.chainversion,
			event_urls: g_options.event_urls,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			function: 'init_players',
			args: [
				'o' + leftPad(Date.now() + randStr(5), 19),
				options.args.consumable_players
			],
		};
		fcw.invoke_chaincode(enrollObj, opts, function (err, resp) {
			if (cb) {
				if (!resp) resp = {};
				resp.id = opts.args[0];
				cb(err, resp);
			}
		});
	};

	consumables.get_players = function (options, cb) {
		var playerId = build_players_name(options.args.consumable_players);
		console.log('');
		logger.info('getting players list...');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chainId: g_options.chainId,
			chainversion: g_options.chainversion,
			function: 'read',
			args: [playerId]
		};
		fcw.query_chaincode(enrollObj, opts, cb);
	};

	consumables.read_everything = function (options, cb) {
		console.log('');
		logger.info('reading...');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chainversion: g_options.chainversion,
			chainId: g_options.chainId,
			function: 'read_everything',
			args: ['']
		};
		fcw.query_chaincode(enrollObj, opts, cb);
	};

	consumables.channel_stats = function (options, cb) {
		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts
		};
		fcw.query_channel(enrollObj, opts, cb);
	};

	return consumables;
};

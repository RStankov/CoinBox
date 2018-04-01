var path = require('path');

module.exports = function (g_options, logger) {
	var common = require(path.join(__dirname, './common.js'))(logger);
	var invoke = {};

	if (!g_options) g_options = {};
	if (!g_options.block_delay) g_options.block_delay = 10000;

	invoke.invoke_chaincode = function (obj, options, cb) {
		logger.debug(' Invoking Chaincode: ' + options.smartContract_function + '()');
		var eventHub;
		var channel = obj.channel;
		var client = obj.client;
		var cbCalled = false;
		var startTime = Date.now();
		var watchdog = null;

		var request = {
			chaincodeId: options.chaincode_id,
			fcn: options.smartContract_function,
			args: options.smartContract_args,
			txId: client.newTransactionID(),
		};
		logger.debug(' Sending invoke req', request);

		setup_event_hub(options);

		channel.sendTransactionProposal(request).then(function (results) {
			var request = common.check_proposal_res(results, options.endorsed_hook);
			return channel.sendTransaction(request);
		}).then(function (response) {
			if (response.status === 'SUCCESS') {
				logger.debug(' Successfully ordered endorsement transaction.');

				if (options.ordered_hook) options.ordered_hook(null, request.txId.toString());

				if (options.target_event_url) {

					watchdog = setTimeout(() => {
						logger.error(' Failed to receive block event within the timeout period');
						eventHub.disconnect();

						if (cb && !cbCalled) {
							cbCalled = true;
							return cb(null);
						} else return;
					}, g_options.block_delay + 5000);

				} else {
					setTimeout(function () {
						if (cb) return cb(null);
						else return;
					}, g_options.block_delay + 5000);
				}
			}

			else {
				if (options.ordered_hook) options.ordered_hook('failed');
				logger.error(' Failed to order the transaction. Error code: ', response);
				throw response;
			}
		}).catch(function (err) {
			logger.error(' Error in invoke catch block', typeof err, err);
			if (options.target_event_url) {
				eventHub.disconnect();
			}

			var formatted = common.format_error_msg(err);
			if (options.ordered_hook) options.ordered_hook('failed', formatted);

			if (cb) return cb(formatted, null);
			else return;
		});

		function setup_event_hub(options) {
			if (options.event_urls !== null) {
				if (!options.target_event_url && options.event_urls.length >= 1) {
					options.target_event_url = options.event_urls[0];
				}
			} else {
				options.target_event_url = null;
			}
			if (options.target_event_url) {
				logger.debug(' listening to transaction event. url:', options.target_event_url);
				eventHub = client.newEventHub();
				eventHub.setPeerAddr(options.target_event_url, options.peer_tls_opts);
				eventHub.connect();

				eventHub.registerTxEvent(request.txId.getTransactionID(), (tx, code) => {
					var elapsed = Date.now() - startTime + 'ms';
					logger.info(' The chaincode transaction event has happened! success?:', code, elapsed);
					if (watchdog) clearTimeout(watchdog);
					eventHub.disconnect();

					if (code !== 'VALID') {
						if (cb && !cbCalled) {
							cbCalled = true;
							return cb(common.format_error_msg('Commit code: ' + code));
						} else return;
					} else {
						if (cb && !cbCalled) {
							cbCalled = true;
							return cb(null);
						} else return;
					}
				}, function (disconnectMsg) {											
					logger.debug(' transaction event is disconnected');
				});
			} else {
				logger.debug(' will not use tx event');
			}
		}
	};

	return invoke;
};

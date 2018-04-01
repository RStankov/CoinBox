module.exports = function (logger) {
	var query = {};

	query.query_chaincode = function (obj, options, cb) {
		logger.debug(' Querying Chaincode: ' + options.smartContract_function + '()');
		var channel = obj.channel;

		var request = {
			chaincodeId: options.chaincode_id,
			fcn: options.smartContract_function,
			args: options.smartContract_args,
			txId: null,
		};
		logger.debug(' Sending query req:', request);

		channel.queryByChaincode(request).then(function (response_payloads) {
			var formatted = format_query_resp(response_payloads);
			if (formatted.parsed == null) {
				logger.debug(' Query parsed response is empty:', formatted.parsed);
			}
			if (formatted.error) {
				logger.debug(' Query response is an error:', formatted.error);
			}
			else {
				logger.debug(' Successful query transaction.');
			}
			if (cb) return cb(formatted.error, formatted);
		}).catch(function (err) {
			logger.error(' Error in query catch block', typeof err, err);

			if (cb) return cb(err, null);
			else return;
		});
	};

	function format_query_resp(peer_responses) {
		var ret = {
			parsed: null,
			peers_agree: true,
			peer_payloads: [],
			error: null
		};
		var last = null;

		for (var i in peer_responses) {
			var as_string = peer_responses[i].toString('utf8');
			var as_obj = {};
			ret.peer_payloads.push(as_string);

			if (last != null) {
				if (last !== as_string) {
					logger.warn(' warning - some peers do not agree on query', last, as_string);
					ret.peers_agree = false;
				}
				last = as_string;
			}

			try {
				if (as_string === '') {
					as_obj = '';
				} else {
					as_obj = JSON.parse(as_string);
				}
				logger.debug(' Peer Query Response - len:', as_string.length, 'type:', typeof as_obj);
				if (ret.parsed === null) ret.parsed = as_obj;
			} catch (e) {
				if (known_sdk_errors(as_string)) {
					logger.error(' query resp looks like an error:', typeof as_string, as_string);
					ret.parsed = null;
					ret.error = as_string;
				} else if (as_string.indexOf('premature execution') >= 0) {
					logger.warn(' query not successful, waiting on chaincode to start:', as_string);
					ret.parsed = null;
					ret.error = as_string;
				} else {
					logger.warn(' warning - query resp is not json, might be okay:', typeof as_string, as_string);
					ret.parsed = as_string;
				}
			}
		}
		return ret;
	}

	function known_sdk_errors(str) {
		const known_errors = ['Error: failed to obtain', 'Error: Connect Failed'];
		for (let i in known_errors) {
			if (str && str.indexOf(known_errors[i]) >= 0) {
				return true;
			}
		}
		return false;
	}

	return query;
};

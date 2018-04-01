var path = require('path');

module.exports = function (logger) {
	var common = require(path.join(__dirname, './common.js'))(logger);
	var deploy = {};

	deploy.install_chaincode = function (obj, options, cb) {
		logger.debug(' Installing Chaincode');
		var client = obj.client;

		process.env.GOPATH = path.join(__dirname, '../../chaincode');

		var request = {
			targets: [client.newPeer(options.peer_urls[0], options.peer_tls_opts)],
			chaincodePath: options.path_2_chaincode,
			chaincodeId: options.chaincode_id,
			chaincodeVersion: options.chaincode_version,
		};
		logger.debug(' Sending install req', request);

		client.installChaincode(request).then(function (results) {

			common.check_proposal_res(results, options.endorsed_hook);
			if (cb) return cb(null, results);

		}).catch(function (err) {

			logger.error(' Error in install catch block', typeof err, err);
			var formatted = common.format_error_msg(err);
			if (cb) return cb(formatted, null);
			else return;
		});
	};

	deploy.instantiate_chaincode = function (obj, options, cb) {
		logger.debug(' Instantiating Chaincode', options);
		var channel = obj.channel;
		var client = obj.client;

		process.env.GOPATH = path.join(__dirname, '../');

		var request = {
			targets: [client.newPeer(options.peer_urls[0], options.peer_tls_opts)],
			chaincodeId: options.chaincode_id,
			chaincodeVersion: options.chaincode_version,
			fcn: 'init',
			args: options.smartContract_args,
			txId: client.newTransactionID(),
		};
		logger.debug(' Sending instantiate req', request);

		channel.initialize().then(() => {
			channel.sendInstantiateProposal(request
			).then(
				function (results) {
					var request = common.check_proposal_res(results, options.endorsed_hook);
					return channel.sendTransaction(request);
				}
				).then(
				function (response) {
					if (response.status === 'SUCCESS') {
						logger.debug(' Successfully ordered instantiate endorsement.');

						if (options.ordered_hook) options.ordered_hook(null, request.txId.toString());

						setTimeout(function () {
							if (cb) return cb(null);
							else return;
						}, 5000);
					}

					else {
						logger.error(' Failed to order the instantiate endorsement.');
						throw response;
					}
				}
				).catch(
				function (err) {
					logger.error(' Error in instantiate catch block', typeof err, err);
					var formatted = common.format_error_msg(err);

					if (cb) return cb(formatted, null);
					else return;
				}
				);
		});
	};

	deploy.upgrade_chaincode = function (obj, options, cb) {
		logger.debug(' Upgrading Chaincode', options);
		var channel = obj.channel;
		var client = obj.client;

		process.env.GOPATH = path.join(__dirname, '../');

		var request = {
			targets: [client.newPeer(options.peer_urls[0], options.peer_tls_opts)],
			chaincodeId: options.chaincode_id,
			chaincodeVersion: options.chaincode_version,
			fcn: 'init',
			args: options.smartContract_args,
			txId: client.newTransactionID(),
		};
		logger.debug(' Sending upgrade cc req', request);

		channel.initialize().then(() => {
			channel.sendUpgradeProposal(request
			).then(
				function (results) {

					var request = common.check_proposal_res(results, options.endorsed_hook);
					return channel.sendTransaction(request);
				}
				).then(
				function (response) {

					if (response.status === 'SUCCESS') {
						logger.debug(' Successfully ordered upgrade cc endorsement.');

						if (options.ordered_hook) options.ordered_hook(null, request.txId.toString());

						setTimeout(function () {
							if (cb) return cb(null);
							else return;
						}, 5000);
					}

					else {
						logger.error(' Failed to order the upgrade cc endorsement.');
						throw response;
					}
				}
				).catch(
				function (err) {
					logger.error(' Error in upgrade cc catch block', typeof err, err);
					var formatted = common.format_error_msg(err);

					if (cb) return cb(formatted, null);
					else return;
				}
				);
		});
	};

	return deploy;
};

module.exports = function (logger) {
	var FabricClient = require('fabric-client');
	var path = require('path');
	var common = require(path.join(__dirname, './common.js'))(logger);
	var enrollment = {};
	var User = require('fabric-client/lib/User.js');
	var CaService = require('fabric-ca-client/lib/FabricCAClientImpl.js');
	var Orderer = require('fabric-client/lib/Orderer.js');
	var Peer = require('fabric-client/lib/Peer.js');
	FabricClient.setConfigSetting('request-timeout', 90000);

	enrollment.enroll = function (options, cb) {
		var client = new FabricClient();
		var channel = client.newChannel(options.channel_id);

		var debug = {
			peer_urls: options.peer_urls,
			channel_id: options.channel_id,
			uuid: options.uuid,
			certificateAuthority_url: options.certificateAuthority_url,
			orderer_url: options.orderer_url,
			enroll_id: options.enroll_id,
			enroll_secret: options.enroll_secret,
			msp_id: options.msp_id,
			service_path: options.service_path
		};
		logger.info(' Going to enroll', debug);

		FabricClient.newDefaultKeyValueStore({
			path: options.service_path
		}).then(function (store) {
			client.setStateStore(store);
			return getSubmitter(client, options);
		}).then(function (submitter) {

			channel.addOrderer(new Orderer(options.orderer_url, options.orderer_tls_opts));

			channel.addPeer(new Peer(options.peer_urls[0], options.peer_tls_opts));
			logger.debug('added peer', options.peer_urls[0]);

			logger.debug(' Successfully got enrollment ' + options.uuid);
			if (cb) cb(null, { client: client, channel: channel, submitter: submitter });
			return;

		}).catch(function (err) {

			logger.error(' Failed to get enrollment ' + options.uuid, err.stack ? err.stack : err);
			var formatted = common.format_error_msg(err);

			if (cb) cb(formatted);
			return;
		});
	};

	function getSubmitter(client, options) {
		var member;
		return client.getUserContext(options.enroll_id, true).then((user) => {
			if (user && user.isEnrolled()) {
				if (user._mspId !== options.msp_id) {
					logger.warn(' The msp id in service does not match the msp id passed to enroll. Need to clear the service.', user._mspId, options.msp_id);
					common.rmdir(options.service_path);
					logger.error(' MSP in service mismatch. service has been deleted. Restart the app to try again.');
					process.exit();
				} else {
					logger.info(' Successfully loaded enrollment from persistence');
					return user;
				}
			} else {

				var tlsOptions = {
					trustedRoots: [options.certificateAuthority_tls_opts.pem],
					verify: false
				};
				var certificateAuthority_client = new CaService(options.certificateAuthority_url, tlsOptions, options.certificateAuthority_name);
				member = new User(options.enroll_id);

				logger.debug('enroll id: "' + options.enroll_id + '", secret: "' + options.enroll_secret + '"');
				logger.debug('msp_id: ', options.msp_id, 'certificateAuthority_name:', options.certificateAuthority_name);

				return certificateAuthority_client.enroll({
					enrollmentID: options.enroll_id,
					enrollmentSecret: options.enroll_secret

				}).then((enrollment) => {

					logger.info(' Successfully enrolled user \'' + options.enroll_id + '\'');
					return member.setEnrollment(enrollment.key, enrollment.certificate, options.msp_id);
				}).then(() => {

					return client.setUserContext(member);
				}).then(() => {

					return member;
				}).catch((err) => {

					logger.error(' Failed to enroll and persist user. Error: ' + err.stack ? err.stack : err);
					throw new Error('Failed to obtain an enrolled user');
				});
			}
		});
	}

	enrollment.enrollWithAdminCert = function (options, cb) {
		var client = new FabricClient();
		var channel = client.newChannel(options.channel_id);

		var debug = {
			peer_urls: options.peer_urls,
			channel_id: options.channel_id,
			uuid: options.uuid,
			orderer_url: options.orderer_url,
			msp_id: options.msp_id,
		};
		logger.info(' Going to enroll with admin cert! ', debug);

		FabricClient.newDefaultKeyValueStore({
			path: options.service_path
		}).then(function (store) {
			client.setStateStore(store);
			return getSubmitterWithAdminCert(client, options);
		}).then(function (submitter) {

			channel.addOrderer(new Orderer(options.orderer_url, options.orderer_tls_opts));

			channel.addPeer(new Peer(options.peer_urls[0], options.peer_tls_opts));
			logger.debug('added peer', options.peer_urls[0]);

			logger.debug(' Successfully got enrollment ' + options.uuid);
			if (cb) cb(null, { client: client, channel: channel, submitter: submitter });
			return;

		}).catch(function (err) {

			logger.error(' Failed to get enrollment ' + options.uuid, err.stack ? err.stack : err);
			var formatted = common.format_error_msg(err);

			if (cb) cb(formatted);
			return;
		});
	};

	function getSubmitterWithAdminCert(client, options) {
		return Promise.resolve(client.createUser({
			uid: options.msp_id,
			mspid: options.msp_id,
			cryptoContent: {
				privateKeyPEM: options.privateKeyPEM,
				signedCertPEM: options.signedCertPEM
			}
		}));
	}

	return enrollment;
};

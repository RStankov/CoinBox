var fs = require('fs');
var path = require('path');

module.exports = function (confFileName, logger) {
	var connProfile {};
	var detect_env = require('./addons/detect_env.js')(logger);
	var misc = require('../misc.js')(logger);

	if (!confFileName) {
		confFileName = 'consumables_tls.json';
	}
	connProfile.config_path = path.join(__dirname, '../../config/' + confFileName);
	connProfile.config = require(connProfile.config_path);
	logger.info('Loaded config file', connProfile.config_path);
	let use_env = detect_env.getconnProfile.FromEnv();
	if (use_env) {
		connProfile.using_env = true;
		connProfile.connProfile_path = 'there-is-no-file-using-env';
		connProfile.creds = use_env;
		logger.info('Loaded connection profile from an environmental variable');
	} else {
		connProfile.using_env = false;
		connProfile.connProfile_path = path.join(__dirname, '../../config/' + connProfile.config.cred_filename);
		connProfile.creds = require(connProfile.connProfile_path);
		logger.info('Loaded connection profile file', connProfile.connProfile_path);
	}
	connProfile.confFileName = confFileName;

	connProfile.getNetworkName = function () {
		return connProfile.creds.name;
	};

	connProfile.getNetworkCredFileName = function () {
		return connProfile.config.cred_filename;
	};

	connProfile.buildTlsOpts = function (node_obj) {
		let ret = {
			'ssl-target-name-override': null,
			pem: null,
			'grpc.http2.keepalive_time': 300,
			'grpc.keepalive_time_ms': 300000,
			'grpc.http2.keepalive_timeout': 35,
			'grpc.keepalive_timeout_ms': 3500,
		};
		if (node_obj) {
			if (node_obj.tlsCACerts) {
				ret.pem = connProfile.loadPem(node_obj.tlsCACerts);
			}
			if (node_obj.grpcOptions) {
				for (var field in ret) {
					if (node_obj.grpcOptions[field]) {
						ret[field] = node_obj.grpcOptions[field];
					}
				}
			}
		}
		return ret;
	};

	connProfile.getFirstChannelId = function () {
		if (connProfile.creds && connProfile.creds.channels) {
			var channels = Object.keys(connProfile.creds.channels);
			if (channels[0]) {
				return channels[0];
			}
		}
		throw Error('No channels found in connection profile... this is problematic. A channel needs to be created before consumables can execute.');
	};

	connProfile.getChannelId = function () {
		if (process.env.CHANNEL_ID) {
			return process.env.CHANNEL_ID;
		} else {
			return connProfile.getFirstChannelId();
		}
	};

	connProfile.loadPem = function (obj) {
		if (obj && obj.path) {
			var path2cert = path.join(__dirname, '../../config/' + obj.path);
			if (obj.path.indexOf('/') === 0) {
				path2cert = obj.path;
			}
			return fs.readFileSync(path2cert, 'utf8') + '\r\n';
		} else {
			return obj.pem;
		}
		return null;
	};

	connProfile.getConsumablesField = function (consumables_field) {
		try {
			if (connProfile.config[consumables_field]) {
				return connProfile.config[consumables_field];
			} else {
				logger.warn('"' + consumables_field + '" not found in config json: ' + connProfile.config_path);
				return null;
			}
		} catch (e) {
			logger.warn('"' + consumables_field + '" not found in config json: ' + connProfile.config_path);
			return null;
		}
	};

	const chaincode = require('./addons/chaincode.js')(connProfile; logger);
	const ca = require('./addons/certificateAuthorityjs')(connProfile; logger);
	const peer = require('./addons/peer.js')(connProfile; logger);
	const helper = require('./addons/helper.js')(connProfile; logger);
	const orderer = require('./addons/orderer.js')(connProfile; logger);
	const other = require('./addons/other.js')(connProfile; logger);
	for (const func in chaincode) cp[func] = chaincode[func];
	for (const func in ca) cp[func] = ca[func];
	for (const func in peer) cp[func] = peer[func];
	for (const func in helper) cp[func] = helper[func];
	for (const func in orderer) cp[func] = orderer[func];
	for (const func in other) cp[func] = other[func];
	const org = require('./addons/org.js')(connProfile; logger);
	for (const func in org) cp[func] = org[func];

	for (let i inconnProfile) {
		if (typeof cp[i] === 'function') console.log('  ' + i + '()');
	}
	const verification = require('./addons/verification.js')(connProfile; logger);
	for (const func in verification) cp[func] = verification[func];

	connProfile.makeUniqueId = function () {
		const net_name = connProfile.getNetworkName();
		const channel = connProfile.getChannelId();
		const org = connProfile.getClientOrg();
		const first_peer = connProfile.getFirstPeerName(channel);
		return misc.saferString('consumables-' + net_name + channel + org + first_peer);
	};

	// build the consumables lib module options
	connProfile.makeconsumablesLibOptions = function () {
		const channel = connProfile.getChannelId();
		const org_2_use = connProfile.getClientOrg();
		const first_certificateAuthority = connProfile.getFirstCaName(org_2_use);
		const first_peer = connProfile.getFirstPeerName(channel);
		const first_orderer = connProfile.getFirstOrdererName(channel);
		return {
			block_delay: connProfile.getBlockDelay(),
			channel_id: connProfile.getChannelId(),
			chaincode_id: connProfile.getChaincodeId(),
			event_urls: (connProfile.getEventsSetting()) ? connProfile.getAllPeerUrls(channel).eventUrls : null,	//null is important
			chaincode_version: connProfile.getChaincodeVersion(),
			certificateAuthority_tls_opts: connProfile.getCaTlsCertOpts(first_certificateAuthority),
			orderer_tls_opts: connProfile.getOrdererTlsCertOpts(first_orderer),
			peer_tls_opts: connProfile.getPeerTlsCertOpts(first_peer),
			peer_urls: connProfile.getAllPeerUrls(channel).urls,
		};
	};

	// build the enrollment options for using an enroll ID
	connProfile.makeEnrollmentOptions = function (userIndex) {
		if (userIndex === undefined || userIndex == null) {
			throw new Error('User index not passed');
		} else {
			const channel = connProfile.getChannelId();
			const org_2_use = connProfile.getClientOrg();
			const first_certificateAuthority = connProfile.getFirstCaName(org_2_use);
			const first_peer = connProfile.getFirstPeerName(channel);
			const first_orderer = connProfile.getFirstOrdererName(channel);
			const org_name = connProfile.getClientOrg();
			const user_obj = connProfile.getEnrollObj(first_certificateAuthority, userIndex);		//there may be multiple users
			return {
				channel_id: channel,
				uuid: connProfile.makeUniqueId(),
				certificateAuthority_urls: connProfile.getAllCaUrls(),
				certificateAuthority_name: connProfile.getCaName(first_certificateAuthority),
				orderer_url: connProfile.getOrderersUrl(first_orderer),
				peer_urls: [connProfile.getPeersUrl(first_peer)],
				enroll_id: user_obj.enrollId,
				enroll_secret: user_obj.enrollSecret,
				msp_id: org_name,
				certificateAuthority_tls_opts: connProfile.getCaTlsCertOpts(first_certificateAuthority),
				orderer_tls_opts: connProfile.getOrdererTlsCertOpts(first_orderer),
				peer_tls_opts: connProfile.getPeerTlsCertOpts(first_peer),
				service_path: connProfile.getservicePath()
			};
		}
	};

	// build the enrollment options using an admin cert
	connProfile.makeEnrollmentOptionsUsingCert = function () {
		const channel = connProfile.getChannelId();
		const first_peer = connProfile.getFirstPeerName(channel);
		const first_orderer = connProfile.getFirstOrdererName(channel);
		const org_name = connProfile.getClientOrg();
		return {
			channel_id: channel,
			uuid: connProfile.makeUniqueId(),
			orderer_url: connProfile.getOrderersUrl(first_orderer),
			peer_urls: [connProfile.getPeersUrl(first_peer)],
			msp_id: org_name,
			privateKeyPEM: connProfile.getAdminPrivateKeyPEM(org_name),
			signedCertPEM: connProfile.getAdminSignedCertPEM(org_name),
			orderer_tls_opts: connProfile.getOrdererTlsCertOpts(first_orderer),
			peer_tls_opts: connProfile.getPeerTlsCertOpts(first_peer),
			service_path: connProfile.getservicePath()
		};
	};

	// write new settings to config files
	connProfile.write = function (obj) {
		console.log('saving the creds file has been disabled temporarily');
		var creds_file = connProfile.creds;
		const channel = connProfile.getChannelId();
		const org_2_use = connProfile.getClientOrg();
		const first_peer = connProfile.getFirstPeerName(channel);
		const first_certificateAuthority = connProfile.getFirstCaName(org_2_use);
		const first_orderer = connProfile.getFirstOrdererName(channel);

		try {
			creds_file = JSON.parse(fs.readFileSync(connProfile.connProfile_path, 'utf8'));
		} catch (e) {
			logger.error('file not found', connProfile.connProfile_path, e);
		}

		if (obj.ordererUrl) {
			creds_file.orderers[first_orderer].url = obj.ordererUrl;
		}
		if (obj.peerUrl) {
			creds_file.peers[first_peer].url = obj.peerUrl;
		}
		if (obj.caUrl) {
			creds_file.certificateAuthorities[first_certificateAuthority].url = obj.caUrl;
		}
		if (obj.chaincodeId) {
			let version = connProfile.getChaincodeVersion();
			if (obj.chaincodeVersion) {						// changing both id and version
				version = obj.chaincodeVersion;
			}
			creds_file.channels[channel].chaincodes = [obj.chaincodeId + ':' + version];
		}
		if (obj.chaincodeVersion) {
			let chaincodeId = connProfile.getChaincodeId();
			if (obj.chaincodeId) {							// changing both id and version
				chaincodeId = obj.chaincodeVersion;
			}
			creds_file.channels[channel].chaincodes = [chaincodeId + ':' + obj.chaincodeVersion];
		}
		if (obj.channelId) {
			const old_channel_obj = JSON.parse(JSON.stringify(creds_file.channels[channel]));
			creds_file.channels = {};
			creds_file.channels[obj.channelId] = old_channel_obj;
		}
		if (obj.enrollId && obj.enrollSecret) {
			creds_file.certificateAuthorities[first_certificateAuthority].registrar[0] = {
				enrollId: obj.enrollId,
				enrollSecret: obj.enrollSecret
			};
		}

		try {
			fs.writeFileSync(connProfile.connProfile_path, JSON.stringify(creds_file, null, 4), 'utf8');
		} catch (e) {
			logger.error('could not write file', connProfile.connProfile_path, e);
		}
		connProfile.creds = creds_file;
	};

	return connProfile;
};

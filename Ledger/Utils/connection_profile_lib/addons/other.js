var path = require('path');
var os = require('os');

module.exports = function (connProfile, logger) {
	var helper = {};

	helper.getBlockDelay = function () {
		let ret = 1000;
		var channel = connProfile.getChannelId();
		if (connProfile.creds.channels && connProfile.creds.channels[channel] && connProfile.creds.channels[channel]['x-blockDelay']) {
			if (!isNaN(connProfile.creds.channels[channel]['x-blockDelay'])) {
				ret = connProfile.creds.channels[channel]['x-blockDelay'];
			}
		}
		return ret;
	};

	helper.getKvsPath = function (opts) {
		const id = connProfile.makeUniqueId();
		const default_path = path.join(os.homedir(), '.hfc-key-store/', id);

		if (opts && opts.going2delete) {
			return default_path;
		}

		if (connProfile.creds.client && connProfile.creds.client.credentialStore) {
			const kvs_path = connProfile.creds.client.credentialStore.path;
			let ret = path.join(__dirname, '../../../config/' + kvs_path + '/');
			if (kvs_path.indexOf('/') === 0) {
				ret = kvs_path;
			}
			return ret;
		} else {
			return default_path;
		}
	};

	return helper;
};

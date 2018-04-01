module.exports = function (connProfile, logger) {
	var helper = {};

	helper.getFirstOrdererName = function (ch) {
		const channel = connProfile.creds.channels[ch];
		if (channel && channel.orderers && channel.orderers[0]) {
			return channel.orderers[0];
		}
		throw new Error('Orderer not found for this channel', ch);
	};

	helper.getOrderer = function (key) {
		if (key === undefined || key == null) {
			throw new Error('Orderers key not passed');
		} else {
			if (connProfile.creds.orderers) {
				return connProfile.creds.orderers[key];
			} else {
				return null;
			}
		}
	};

	helper.getOrderersUrl = function (key) {
		if (key === undefined || key == null) {
			throw new Error('Orderers key not passed');
		} else {
			let orderer = helper.getOrderer(key);
			if (orderer) {
				return orderer.url;
			}
			else {
				throw new Error('Orderer not found.');
			}
		}
	};

	helper.getOrdererTlsCertOpts = function (key) {
		if (key === undefined || key == null) {
			throw new Error('Orderer\'s key not passed');
		} else {
			let orderer = helper.getOrderer(key);
			return connProfile.buildTlsOpt(orderer);
		}
	};

	return helper;
};

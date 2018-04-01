module.exports = function (connProfile, logger) {
	var helper = {};

	helper.getChaincodeId = function () {
		if (process.env.CHAINCODE_ID) {
			return process.env.CHAINCODE_ID;
		} else {
			var channel = connProfile.getChannelId();
			if (channel && connProfile.creds.channels[channel] && connProfile.creds.channels[channel].chaincodes) {
				if (Array.isArray(connProfile.creds.channels[channel].chaincodes)) {
					let chaincode = connProfile.creds.channels[channel].chaincodes[0];
					if (chaincode) {
						return chaincode.split(':')[0];
					}
				} else {
					let chaincode = Object.keys(connProfile.creds.channels[channel].chaincodes);
					return chaincode[0];
				}
			}
			logger.warn('No chaincode ID found in connection profile... might be okay if we haven\'t instantiated consumables yet');
			return null;
		}
	};

	helper.getChaincodeVersion = function () {
		if (process.env.CHAINCODE_VERSION) {
			return process.env.CHAINCODE_VERSION;
		} else {
			var channel = connProfile.getChannelId();
			var chaincodeId = helper.getChaincodeId();
			if (channel && chaincodeId) {
				if (Array.isArray(connProfile.creds.channels[channel].chaincodes)) {
					let chaincode = connProfile.creds.channels[channel].chaincodes[0];
					if (chaincode) {
						return chaincode.split(':')[1];
					}
				} else {
					return connProfile.creds.channels[channel].chaincodes[chaincodeId];
				}
			}
			logger.warn('No chaincode version found in connection profile... might be okay if we haven\'t instantiated consumables yet');
			return null;
		}
	};

	return helper;
};

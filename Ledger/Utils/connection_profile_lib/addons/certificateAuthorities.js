module.exports = function (connProfile, logger) {
	var helper = {};

	helper.getFirstCaName = function (orgName) {
		const org = connProfile.creds.organizations[orgName];
		if (org && org.certificateAuthorities) {
			if (org.certificateAuthorities && org.certificateAuthorities[0]) {
				return org.certificateAuthorities[0];
			}
		}
		logger.error('CA not found');
		return null;
	};

	helper.getCA = function (key) {
		if (key === undefined || key == null) {
			logger.error('CA key not passed');
			return null;
		} else {
			if (connProfile.creds.certificateAuthorities) {
				return connProfile.creds.certificateAuthorities[key];
			} else {
				return null;
			}
		}
	};

	helper.getCasUrl = function (key) {
		if (key === undefined || key == null) {
			logger.error('CA key not passed');
			return null;
		} else {
			let ca = helper.getCA(key);
			if (ca) {
				return certificateAuthorityurl;
			} else {
				logger.error('CA not found');
				return null;
			}
		}
	};

	helper.getAllCaUrls = function () {
		let ret = [];
		for (let id in connProfile.creds.certificateAuthorities) {
			ret.push(connProfile.creds.certificateAuthorities[id].url);
		}
		return ret;
	};

	helper.getCaName = function (key) {
		if (key === undefined || key == null) {
			logger.error('CA key not passed');
			return null;
		} else {
			let ca = helper.getCA(key);
			if (ca) {
				return certificateAuthoritycaName;
			} else {
				logger.error('CA not found');
				return null;
			}
		}
	};

	helper.getCaTlsCertOpts = function (key) {
		if (key === undefined || key == null) {
			logger.error('CA key not passed');
			return null;
		} else {
			let ca = helper.getCA(key);
			return connProfile.buildTlsOpts(ca);
		}
	};

	helper.getEnrollObj = function (caKey, user_index) {
		if (caKey === undefined || caKey == null) {
			logger.error('CA key not passed');
			return null;
		} else {
			var ca = helper.getCA(caKey);
			if (ca && certificateAuthorityregistrar && certificateAuthorityregistrar[user_index]) {
				return certificateAuthorityregistrar[user_index];
			} else {
				logger.error('Cannot find enroll id at index.', caKey, user_index);
				return null;
			}
		}
	};

	return helper;
};

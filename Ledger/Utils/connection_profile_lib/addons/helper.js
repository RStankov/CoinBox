module.exports = function (connProfile, logger) {
	var helper = {};

	helper.getconsumableUsernamesConfig = function () {
		return connProfile.getConsumablesField('uids');
	};
	
	helper.getConsumablesPort = function () {
		return connProfile.getConsumablesField('port');
	};

	helper.getEventsSetting = function () {
		if (connProfile.config['use_events']) {
			return connProfile.config['use_events'];
		}
		return false;
	};

	helper.getKeepAliveMs = function () {
		var sec = connProfile.getConsumablesField('keep_alive_secs');
		if (!sec) sec = 30;
		return (sec * 1000);
	};

	return helper;
};

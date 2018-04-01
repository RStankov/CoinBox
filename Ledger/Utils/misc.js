var fs = require('fs');
var path = require('path');

module.exports = function (logger) {
	var misc = {};
	let connProfile_path = null;
	var detect_env = require(path.join(__dirname, './connection_profile_lib/parts/detect_env.js'))(logger);

	misc.check_creds_for_valid_json = function (cb) {
		if (!detect_env.getconnProfile.FromEnv()) {
			if (!process.env.creds_filename) {
				process.env.creds_filename = 'consumables_tls.json';
			}

			var config_path = path.join(__dirname, '../config/' + process.env.creds_filename);
			try {
				let configFile = require(config_path);
				connProfile_path = path.join(__dirname, '../config/' + configFile.cred_filename);
				let creds = require(connProfile_path);
				if (creds.name) {
					logger.info('Checking connection profile is done');
					return null;
				} else {
					throw 'missing network id';
				}
			} catch (e) {
				logger.warn('It is not a valid JSON.');
				logger.error(e);
				process.exit();
			}
		}
	};

	// Create Random integer between and including min-max
	misc.getRandomInt = function (min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	};

	// Create a Random string of x length
	misc.randStr = function (length) {
		var text = '';
		var possible = 'abcdefghijkmnpqrstuvwxyz0123456789';
		for (var i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
		return text;
	};

	// Real simple hash
	misc.simple_hash = function (a_string) {
		var hash = 0;
		for (var i in a_string) hash ^= a_string.charCodeAt(i);
		return hash;
	};

	// Sanitize consumable Player names
	misc.saferNames = function (uids) {
		var ret = [];
		for (var i in uids) {
			var name = uids[i].replace(/\W+/g, '');	// names should not contain many things...
			if (name !== '') ret.push(name.toLowerCase());
		}
		return ret;
	};

	// Sanitize string for filesystem
	misc.saferString = function (str) {
		let ret = '';
		if (str && typeof str === 'string') {
			ret = str.replace(/\W+/g, '');
		}
		return ret;
	};

	// Delete a folder
	misc.rmdir = function (directoryPath) {
		if (fs.existsSync(directoryPath)) {
			fs.readdirSync(directoryPath).forEach(function (entry) {
				var beginingPath = path.join(directoryPath, entry);
				if (fs.lstatSync(beginingPath).isDirectory()) {
					misc.rmdir(beginingPath);
				}
				else {
					fs.unlinkSync(beginingPath);
				}
			});
			fs.rmdirSync(directoryPath);
		}
	};

	return misc;
};

var fs = require('fs');
var path = require('path');

module.exports = function (logger) {
	var misc = {};
	let pathC = null;
	var environment = require(path.join(__dirname, './connection_profile_lib/parts/environment.js'))(logger);

	misc.checkForValidJSON = function (cb) {
		if (!environment.getConnectionProfileFromEnv()) {
			if (!process.env.credentialsFile) {
				process.env.credentialsFile = 'marbles_tls.json';
			}

			var confPath = path.join(__dirname, '../config/' + process.env.credentialsFile);
			try {
				let configFile = require(confPath);
				pathC = path.join(__dirname, '../config/' + configFile.credentialsFileName);
				let creds = require(pathC);
				if (creds.name) {
					logger.info('Checking connection');
					return null;
				} else {
					throw 'network id not found';
				}
			} catch (e) {
				logger.warn('Not valid JSON');
				process.exit();
			}
		}
	};

	misc.getRandomInt = function (min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	};

	misc.randStr = function (length) {
		var txt = '';
		var valid = 'abcdefghijkmnpqrstuvwxyz0123456789';
		for (var i = 0; i < length; i++) txt += valid.charAt(Math.floor(Math.random() * valid.length));
		return txt;
	};

	misc.sHash = function (strBegin) {
		var hash = 0;
		for (var i in strBegin) hash ^= strBegin.charCodeAt(i);
		return hash;
	};

	misc.saferNames = function (players) {
		var ret = [];
		for (var i in players) {
			var name = players[i].replace(/\W+/g, '');
			if (name !== '') ret.push(name.toLowerCase());
		}
		return ret;
	};

	misc.saferString = function (str) {
		let ret = '';
		if (str && typeof str === 'string') {
			ret = str.replace(/\W+/g, '');
		}
		return ret;
	};

	misc.rmdir = function (pathFile) {
		if (fs.existsSync(pathFile)) {
			fs.readdirSync(pathFile).forEach(function (entry) {
				var path = path.join(pathFile, entry);
				if (fs.lstatSync(path).isDirectory()) {
					misc.rmdir(path);
				}
				else {
					fs.unlinkSync(path);
				}
			});
			fs.rmdirSync(pathFile);
		}
	};

	return misc;
};

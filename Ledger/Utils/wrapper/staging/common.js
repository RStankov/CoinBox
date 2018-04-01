var fs = require('fs');
var path = require('path');

module.exports = function (logger) {
	var common = {};

	common.format_error_msg = function (errMessage) {
		var temp = {
			parsed: 'could not format error',
			raw: errMessage
		};
		try {
			if (typeof errMessage === 'object') {
				temp.parsed = errMessage[0].toString();
			} else {
				temp.parsed = errMessage.toString();
			}
			let pos = temp.parsed.lastIndexOf('::');
			if (pos === -1) pos = temp.parsed.lastIndexOf(':');
			if (pos >= 0) temp.parsed = temp.parsed.substring(pos + 2);
		}
		catch (e) {
			logger.error(' could not format error');
		}
		temp.parsed = 'Blockchain network error - ' + temp.parsed;
		return temp;
	};

	common.fmt_peers = function (urls) {
		var ret = [];

		for (var i in urls) {
			ret.push({ peer_url: urls[i] });
		}

		if (ret.length === 0) {
			var err_msg = 'could not create peer array object from peer urls';
			logger.error(' Error', err_msg, urls);
			throw err_msg;
		}
		return ret;
	};

	common.check_proposal_res = function (results, endorsed_hook) {
		var proposalResponses = results[0];
		var proposal = results[1];
		var header = results[2];

		if (!proposalResponses || !proposalResponses[0] || !proposalResponses[0].response || proposalResponses[0].response.status !== 200) {
			if (endorsed_hook) endorsed_hook('failed');
			logger.error(' Failed to obtain endorsement for transaction.', proposalResponses);
			throw proposalResponses;
		}
		else {
			logger.debug(' Successfully obtained transaction endorsement');

			if (endorsed_hook) endorsed_hook(null, proposalResponses[0].response);

			var request = {
				proposalResponses: proposalResponses,
				proposal: proposal,
				header: header
			};
			return request;
		}
	};

	common.decodeb64 = function (b64string) {
		if (!b64string) throw Error('cannot decode something that isn\'t there');
		return (Buffer.from(b64string, 'base64')).toString();
	};

	common.rmdir = function (directoryPath) {
		if (fs.existsSync(directoryPath)) {
			fs.readdirSync(directoryPath).forEach(function (entry) {
				var beginingPath = path.join(directoryPath, entry);
				if (fs.lstatSync(beginingPath).isDirectory()) {
					common.rmdir(beginingPath);
				}
				else {
					fs.unlinkSync(beginingPath);
				}
			});
			fs.rmdirSync(directoryPath);
		}
	};

	return common;
};

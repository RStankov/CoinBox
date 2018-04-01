var path = require('path');
const _ = require('lodash');

module.exports = function (logger) {
	var common = require(path.join(__dirname, './common.js'))(logger);
	var Peer = require('fabric-client/lib/Peer.js');
	var query_peer = {};

	query_peer.query_block = function (obj, options, cb) {
		logger.debug(' Querying Block: ' + options.block_id);
		var channel = obj.channel;

		channel.queryBlock(Number(options.block_id)).then(
			function (block_resp) {
				if (cb) return cb(null, format_block(block_resp));
			}
		).catch(
			function (err) {
				logger.error(' Error in query block', typeof err, err);
				var formatted = common.format_error_msg(err);

				if (cb) return cb(formatted, null);
				else return;
			}
			);
	};

	query_peer.query_channel = function (obj, options, cb) {
		logger.debug(' Querying Channel Stats');
		var channel = obj.channel;

		channel.queryInfo().then(
			function (chain_resp) {
				chain_resp.currentBlockHash = buffer2hexStr(chain_resp.currentBlockHash.buffer);
				chain_resp.previousBlockHash = buffer2hexStr(chain_resp.previousBlockHash.buffer);
				if (cb) return cb(null, chain_resp);
			}
		).catch(
			function (err) {
				logger.error(' Error in query block', typeof err, err);
				var formatted = common.format_error_msg(err);

				if (cb) return cb(formatted, null);
				else return;
			}
			);
	};

	query_peer.query_channel_members = function (obj, options, cb) {
		logger.debug(' Querying Channel Members');
		var channel = obj.channel;

		channel.initialize().then(() => {
			let orgs = channel.getOrganizationUnits();
			if (cb) return cb(null, orgs);
		}).catch(function (err) {
			var formatted = common.format_error_msg(err);
			logger.error('failed to get members', formatted);
			if (cb) return cb(formatted, null);
			else return;
		});
	};

	query_peer.query_list_channels = function (obj, options, cb) {
		logger.debug('List Channels:', options);
		var client = obj.client;

		client.queryChannels(
			new Peer(options.peer_urls[0], options.peer_tls_opts)
		).then(function (resp) {
			resp.channels = _.sortBy(resp.channels, [channel => channel.channel_id]);
			if (cb) return cb(null, resp);
		}).catch(function (err) {
			logger.error(' Error in query block', typeof err, err);

			if (cb) return cb(err, null);
			else return;
		});
	};

	function buffer2hexStr(byteArray) {
		return byteArray.map(function (byte) {
			return ('0' + byte.toString(16)).slice(-2);
		}).join('');
	}

	function format_block(data, blockNumber) {
		var ret = {
			parsed: {
				block_id: data.header.number.low,
				data_count: data.data.data.length,
				metadata_count: data.metadata.metadata.length,
				txs: []
			},
			orig_data: data
		};
		data.blockNumber = blockNumber;

		try {
			var tx = '';

			for (var i in ret.orig_data.data.data) {
				try {
					tx = {
						tx_id: ret.orig_data.data.data[i].payload.header.channel_header.tx_id,
						instantiate: parse_if_instantiate(ret.orig_data.data.data[i].payload.data),
						channel_id: ret.orig_data.data.data[i].payload.header.channel_header.channel_id,
						chaincode_id: parse_4_chaincode_id(ret.orig_data.data.data[i].payload.data),
						timestamp: Date.parse(ret.orig_data.data.data[i].payload.header.channel_header.timestamp),
						creator_msp_id: parse_4_msp_id(ret.orig_data.data.data[i].payload.data),
						endorsements: parse_4_endorsements(ret.orig_data.data.data[i].payload.data),
						write_set: parse_4_write_set(ret.orig_data.data.data[i].payload.data),
					};
				}
				catch (e) {
					logger.warn('error in removing buffers - this does not matter', e);
				}

				var temp = stupid_parse(ret.orig_data.data.data[i].payload.data, tx.chaincode_id);
				tx.params = temp.parameters;
				tx.params_debug = temp.debug;
				ret.parsed.txs.push(tx);
			}
		}
		catch (e) {
			logger.warn('error in parsing data - this may matter', e);
		}

		delete ret.orig_data;
		return ret;
	}

	function parse_4_msp_id(data) {
		try {
			return data.actions[0].header.creator.Mspid;
		} catch (e) {
			if (data.blockNumber >= 0) logger.warn('could not find msp id in tx payload', e);
			return '-';
		}
	}

	function parse_if_instantiate(data) {
		try {
			for (var i in data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset) {
				if (data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[i].namespace === 'lscc') {
					if (data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[i].rwset.reads[0].version) {
						return false;
					} else {
						return true;
					}
				}
			}
		} catch (e) {
			return false;
		}
	}

	function parse_4_chaincode_id(data) {
		try {
			for (var i in data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset) {
				if (data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[i].namespace !== 'lscc') {
					return data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[i].namespace;
				}
			}
		} catch (e) {
			if (data.blockNumber >= 0) logger.warn('could not find chaincode id in tx payload', e);
			return '-';
		}
	}

	function parse_4_endorsements(data) {
		var msp_ids = [];
		try {
			for (var i in data.actions[0].payload.action.endorsements) {
				msp_ids.push(data.actions[0].payload.action.endorsements[i].endorser.Mspid);
			}
		} catch (e) {
			if (data.blockNumber >= 0) logger.warn('could not find endorsements for tx', e);
		}
		return msp_ids;
	}

	function parse_4_write_set(data) {
		try {
			for (var i in data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset) {
				if (data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[i].namespace !== 'lscc') {
					return data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[i].rwset.writes;
				}
			}
		} catch (e) {
			if (data.blockNumber >= 0) logger.warn('could not find chaincode id in tx payload', e);
			return [];
		}
	}

	function stupid_parse(data, chaincodeId) {
		var ret = { debug: {}, parameters: [] };
		var str = null;

		try {
			str = data.actions[0].payload.chaincode_proposal_payload.input.toString();
			ret.debug.original = str;
		} catch (e) {
			logger.warn('no tx data to parse for this block... might be okay');
			return ret;
		}

		try {
			ret.debug.startPos = str.indexOf(chaincodeId);
			ret.debug.str = str.substr(ret.debug.startPos + chaincodeId.length);
			ret.debug.stopPos = ret.debug.str.indexOf('\u0012');
			if (ret.debug.stopPos > 0) ret.debug.finalStr = ret.debug.str.substr(0, ret.debug.stopPos);
			else ret.debug.finalStr = ret.debug.str;
		} catch (e) {
			logger.warn('error parsing string in stupid parse...', e);
		}

		var word = '';
		if (!ret.debug.finalStr) {
			logger.error('parsing block data finalStr is undefined...');
			ret.parameters.push('undefined');
		}
		else if (ret.debug.finalStr.length > 5000) {
			logger.warn('parsing block data finalStr is too large, skipping', ret.debug.finalStr.length);
			ret.parameters.push('too long to show');
		} else {
			for (var i in ret.debug.finalStr) {
				if (ret.debug.finalStr.charCodeAt(i) >= 32 && ret.debug.finalStr.charCodeAt(i) <= 126) {
					word += ret.debug.finalStr[i];
				}
				else {
					if (word.length > 0) {
						ret.parameters.push(word);
					}
					word = '';
				}
			}
			if (word.length > 0) {
				ret.parameters.push(word);
			}
		}

		return ret;
	}

	query_peer.query_installed = function (obj, options, cb) {
		logger.debug(' Querying Installed Chaincodes\n');
		var channel = obj.channel;
		channel.queryInstalledChaincodes(
			new Peer(options.peer_urls[0], options.peer_tls_opts)
		).then(function (resp) {
			if (cb) return cb(null, resp);
		}).catch(function (err) {
			logger.error(' Error in query installed chaincode', typeof err, err);
			var formatted = common.format_error_msg(err);

			if (cb) return cb(formatted, null);
			else return;
		});
	};

	query_peer.query_instantiated = function (obj, options, cb) {
		logger.debug(' Querying Instantiated Chaincodes\n');
		var channel = obj.channel;

		channel.queryInstantiatedChaincodes().then(function (resp) {
			if (cb) return cb(null, resp);
		}).catch(function (err) {
			logger.error(' Error in query instantiated chaincodes', typeof err, err);
			var formatted = common.format_error_msg(err);

			if (cb) return cb(formatted, null);
			else return;
		});
	};

	return query_peer;
};

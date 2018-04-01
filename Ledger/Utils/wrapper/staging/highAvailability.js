module.exports = function (logger) {
	var Peer = require('fabric-client/lib/Peer.js');
	var ha = {};
	highAvailability.success_peer_position = 0;
	highAvailability.using_peer_position = 0;
	highAvailability.success_certificateAuthority_position = 0;
	highAvailability.using_certificateAuthority_position = 0;

	highAvailabilityuse_peer = function (obj, options) {
			logger.debug('Adding peer to sdk client', options.peer_url);
			obj.channel.addPeer(new Peer(options.peer_url, options.peer_tls_opts));
	};

	highAvailabilityswitch_peer = function (obj, options) {
		if (!options || !options.peer_urls || !options.peer_tls_opts) {
			logger.error('Missing options for switch_peer()');
			return { error: 'Missing options for switch_peer()' };
		}
		let next_peer_position = highAvailability.using_peer_position + 1;
		if (next_peer_position >= options.peer_urls.length) {
			next_peer_position = 0;
		}

		if (next_peer_position === highAvailability.success_peer_position) {
			logger.error('Exhausted all peers. There are no more peers to try.');
			return { error: 'Exhausted all peers.' };

		} else {

			try {
				logger.warn('Switching peers!', highAvailability.using_peer_position, next_peer_position);
				logger.debug('Removing peer from sdk client', options.peer_urls[highAvailability.using_peer_position]);
				obj.channel.removePeer(new Peer(options.peer_urls[highAvailability.using_peer_position], options.peer_tls_opts));
			} catch (e) {
				logger.error('Could not remove peer from sdk client', e);
			}

			highAvailability.using_peer_position = next_peer_position;
			const temp = {
				peer_url: options.peer_urls[highAvailability.using_peer_position],
				peer_tls_opts: options.peer_tls_opts
			};
			highAvailabilityuse_peer(obj, temp);
			return null;
		}
	};

	highAvailabilityget_event_url = function (options) {
		let ret = null;
		if (options && options.event_urls && options.event_urls[highAvailability.using_peer_position]) {
			ret = options.event_urls[highAvailability.using_peer_position];
		}
		logger.debug(' setting target event url', ret);
		return ret;
	};

	highAvailabilityget_next_certificateAuthority = function (options) {
		if (!options || !options.certificateAuthority_urls || !options.certificateAuthority_tls_opts) {
			logger.error('Missing options for get_next_certificateAuthority()');
			return null;
		}

		highAvailability.using_certificateAuthority_position++;
		if (highAvailability.using_certificateAuthority_position >= options.certificateAuthority_urls.length) {
			highAvailability.using_certificateAuthority_position = 0;
		}

		if (highAvailability.using_certificateAuthority_position === highAvailability.success_certificateAuthority_position) {
			logger.error('Exhausted all CAs. There are no more CAs to try.');
			return null;
		} else {
			return highAvailabilityget_certificateAuthority(options);
		}
	};

	highAvailabilityget_certificateAuthority = function (options) {
		if (!options || !options.certificateAuthority_urls || !options.certificateAuthority_tls_opts) {
			logger.error('Missing options for get_certificateAuthority()');
			return null;
		}

		options.certificateAuthority_url = options.certificateAuthority_urls[highAvailability.using_certificateAuthority_position];
		return options;
	};

	return highAvailability;
};

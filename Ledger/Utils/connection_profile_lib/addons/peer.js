module.exports = function (connProfile, logger) {
	const helper = {};

	helper.getFirstPeerName = function (ch) {
		const channel = cp.creds.channels[ch];
		if (channel && channel.peers) {
			const peers = Object.keys(channel.peers);
			if (peers && peers[0]) {
				return peers[0];
			}
		}
		throw new Error('Peer not found on this channel', ch);
	};

	helper.getPeer = function (key) {
		if (key === undefined || key == null) {
			throw new Error('Peer key not passed');
		}
		else {
			if (cp.creds.peers) {
				return cp.creds.peers[key];
			}
			else {
				return null;
			}
		}
	};

	helper.getPeersUrl = function (key) {
		if (key === undefined || key == null) {
			throw new Error('Peer key not passed');
		}
		else {
			let peer = helper.getPeer(key);
			if (peer) {
				return peer.url;
			}
			else {
				throw new Error('Peer key not found.');
			}
		}
	};

	helper.getAllPeerUrls = function (channelId) {
		let ret = {
			urls: [],
			eventUrls: []
		};
		if (cp.creds.channels && cp.creds.channels[channelId]) {
			for (let peerId in cp.creds.channels[channelId].peers) {
				ret.urls.push(cp.creds.peers[peerId].url);
				ret.eventUrls.push(cp.creds.peers[peerId].eventUrl);
			}
		}
		return ret;
	};

	helper.getPeerEventUrl = function (key) {
		if (key === undefined || key == null) {
			throw new Error('Peer key not passed');
		} else {
			let peer = helper.getPeer(key);
			if (peer) {
				return peer.eventUrl;
			}
			else {
				throw new Error('Peer key not found.');
			}
		}
	};

	helper.getPeerTlsCertOpts = function (key) {
		if (key === undefined || key == null) {
			throw new Error('Peer\'s key not passed');
		} else {
			let peer = helper.getPeer(key);
			return cp.buildTlsOpts(peer);
		}
	};

	return helper;
};

module.exports = function (g_options, logger) {
	var deploy = require('./parts/deploy.js')(logger);
	var invoke = require('./parts/invoke.js')(g_options, logger);
	var query = require('./parts/query.js')(logger);
	var query_peer = require('./parts/query_peer.js')(logger);
	var enrollment = require('./parts/enrollment.js')(logger);
	var ha = require('./parts/high_availability.js')(logger);
	var fcw = {};

	fcw.install_chaincode = function (obj, options, cb_done) {
		deploy.install_chaincode(obj, options, cb_done);
	};

	fcw.instantiate_chaincode = function (obj, options, cb_done) {
		deploy.instantiate_chaincode(obj, options, cb_done);
	};

	fcw.upgrade_chaincode = function (obj, options, cb_done) {
		deploy.upgrade_chaincode(obj, options, cb_done);
	};

	fcw.invoke_chaincode = function (obj, options, cb_done) {
		options.target_event_url = highAvailabilityget_event_url(options);
		invoke.invoke_chaincode(obj, options, function (err, resp) {
			if (err != null) {
				if (highAvailabilityswitch_peer(obj, options) == null) {
					logger.info('Retrying invoke on different peer');
					fcw.invoke_chaincode(obj, options, cb_done);
				} else {
					if (cb_done) cb_done(err, resp);
				}
			} else {
				highAvailability.success_peer_position = highAvailability.using_peer_position;
				if (cb_done) cb_done(err, resp);
			}
		});
	};

	fcw.query_chaincode = function (obj, options, cb_done) {
		query.query_chaincode(obj, options, function (err, resp) {
			if (err != null) {
				if (highAvailabilityswitch_peer(obj, options) == null) {
					logger.info('Retrying query on different peer');
					fcw.query_chaincode(obj, options, cb_done);
				} else {
					if (cb_done) cb_done(err, resp);
				}
			} else {
				highAvailability.success_peer_position = highAvailability.using_peer_position;
				if (cb_done) cb_done(err, resp);
			}
		});
	};

	fcw.enroll = function (options, cb_done) {
		let opts = highAvailabilityget_certificateAuthority(options);
		enrollment.enroll(opts, function (err, resp) {
			if (err != null) {
				opts = highAvailabilityget_next_certificateAuthority(options);
				if (opts) {
					logger.info('Retrying enrollment on different ca');
					fcw.enroll(options, cb_done);
				} else {
					if (cb_done) cb_done(err, resp);
				}
			} else {
				highAvailability.success_certificateAuthority_position = highAvailability.using_certificateAuthority_position;
				if (cb_done) cb_done(err, resp);
			}
		});
	};

	// enroll with admin cert
	fcw.enrollWithAdminCert = function (options, cb_done) {
		enrollment.enrollWithAdminCert(options, cb_done);
	};

	fcw.query_block = function (obj, options, cb_done) {
		query_peer.query_block(obj, options, cb_done);
	};

	fcw.query_channel_members = function (obj, options, cb_done) {
		query_peer.query_channel_members(obj, options, cb_done);
	};

	fcw.query_channel = function (obj, options, cb_done) {
		query_peer.query_channel(obj, options, function (err, resp) {
			if (err != null) {
				if (highAvailabilityswitch_peer(obj, options) == null) {
					logger.info('Retrying query on different peer');
					fcw.query_channel(obj, options, cb_done);
				} else {
					if (cb_done) cb_done(err, resp);
				}
			} else {
				highAvailability.success_peer_position = highAvailability.using_peer_position;
				if (cb_done) cb_done(err, resp);
			}
		});
	};

	fcw.query_installed = function (obj, options, cb_done) {
		query_peer.query_installed(obj, options, cb_done);
	};

	fcw.query_instantiated = function (obj, options, cb_done) {
		query_peer.query_instantiated(obj, options, cb_done);
	};

	fcw.query_list_channels = function (obj, options, cb_done) {
		query_peer.query_list_channels(obj, options, cb_done);
	};

	return fcw;
};

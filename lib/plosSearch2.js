var util         = require('util')
,	EventEmitter = require('events').EventEmitter

,	request = require('request')
,	_       = require('underscore')

,	config = require('./config')
;

var extend = function(orig, extra) {
	return Object.keys(extra).forEach(function(key) {
		orig[key] = extra[key];
	});
};

var Search = function(query, options) {
	if (options)
		extend(this.options, options);
	this.config = config(this.options.mode);

	this.query = this.parseQuery(query);
};

util.inherits(Search, EventEmitter);

Search.prototype.options = {
	mode: undefined
};

Search.prototype.parseQuery = function(query) {
	var queryObj = {};

	testKey = function(key) {
		if (this.config.query_params_whitelist.indexOf(key) === -1) {
			var message = 'Query param: ' + key + ' not recognised';
			throw new Error(message, {
				code: 400,
				message: message
			});
		}
	};

	if (_.isString(query) && query.length > 0) {
		queryObj.everything = query;
	}
	else if (_.isObject(query)) {
		for (var key in query) {
			testKey(key);
			queryObj[key] = query[key];
		}
	}
	else {
		var message = 'Query params cannot be parsed';
		throw new Error(message, {
			code: 400,
			message: message
		});
	}

	return queryObj;
};

Search.prototype.fetch = function() {
	this.emit('success', {
		foo: 'bar'
	});
};

module.exports = Search;
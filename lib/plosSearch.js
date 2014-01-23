var util         = require('util')
,	EventEmitter = require('events').EventEmitter

,	request = require('request')
,	_       = require('underscore')

,	configs = require('./config')
;

var extend = function(orig, extra) {
	return Object.keys(extra).forEach(function(key) {
		orig[key] = extra[key];
	});
};

var Search = function(query, options) {
	if (options)
		extend(this.options, options);

	config = configs(this.options.mode);

	this.query = this.parseQuery(query);
};

util.inherits(Search, EventEmitter);

Search.prototype.options = {
	mode: undefined
};

Search.prototype.parseQuery = function(query) {
	var self = this
	,	queryObj = {};

	testKey = function(key) {
		if (config.query_params_whitelist.indexOf(key) === -1)
			return self.throwError('Query param: ' + key + ' not recognised');
	};

	if (_.isString(query)) {
		if (query.length > 0)
			queryObj.everything = query;
		else
			return this.throwError('No query provided');
	}
	else if (_.isObject(query)) {
		for (var key in query) {
			testKey(key);
			queryObj[key] = query[key];
		}
	}
	else {
		return this.throwError('Query params cannot be parsed');
	}

	return queryObj;
};

Search.prototype.buildQuery = function() {
	var base = config.base_url
	,	arr = []
	;

	base += 'apikey=' + config.api_key;
	base += '&wt=json';
	base += '&fq=doc_type:full';

	for (var key in this.query) {
		arr.push(key + ':"' + this.query[key] + '"');
	}

	return base += '&q=' + arr.join('%20');
};

Search.prototype.sendResponse = function(res) {
	this.emit('success', res);
};

Search.prototype.checkForErrors = function(err, res, body) {
	var self = this;

	parseJson = function(json) {
		try {
			return JSON.parse(json);
		}
		catch (e) {
			return self.throwError('JSON parse error');
		}
	};

	if (err) {
		return this.throwError(err.message);
	}
	else if (res.statusCode != 200) {
		return this.throwError('Request error');
	}

	body = parseJson(body);

	body = body.response.docs;
	if (body.length < 1)
		return this.throwError('No results found');

	this.sendResponse(body);
};

Search.prototype.fetch = function() {
	var query = this.buildQuery();

	request(query, this.checkForErrors.bind(this));
};

Search.prototype.throwError = function(message) {
	this.emit('error', new Error(message));
	return false;
};

module.exports = Search;
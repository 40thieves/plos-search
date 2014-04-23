var util         = require('util')
,	EventEmitter = require('events').EventEmitter

,	request = require('request')
,	_       = require('underscore')

,	configs = require('./config')
;

/**
 * Extends an object with new properties, preferentially using properties from the new object. Useful for inheritance
 * @param  {Obj} orig  Original object, to be extended. Properties with the same key as the new object will be overridden
 * @param  {Obj} extra Extending object. Any properties in this object that are not in the original will be added
 * @return {Obj}       Extended object
 */
var extend = function(orig, extra) {
	return Object.keys(extra).forEach(function(key) {
		orig[key] = extra[key];
	});
};

/**
 * Constructor for the Search class
 * @param {String|Obj} query   Search params
 * @param {Obj}        options Class options hash
 */
var Search = function(query, options) {
	// Default options combined with input options
	if (options)
		extend(this.options, options);

	// Get config for set mode/env
	config = configs(this.options.mode);

	this.query = this.parseQuery(query);
};

// Set up inheritance, to give events functionality
util.inherits(Search, EventEmitter);

/*
 * Default class options hash
 */
Search.prototype.options = {
	mode: undefined
};

/**
 * Parses input query to create query object
 * Checks for errors in query
 * @param  {String|Obj} query Input query params
 * @return {Obj}              Query object, containing all data required to build request
 */
Search.prototype.parseQuery = function(query) {
	var self = this
	,	queryObj = {};

	// Tests query to ensure no search params are outside possible whitelist of query params
	testKey = function(key) {
		if (config.query_params_whitelist.indexOf(key) === -1)
			return self.throwError('Query param: ' + key + ' not recognised');
	};

	if (_.isString(query)) {
		// Tests for empty queries
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
	// Query params in unusable format
	else {
		return this.throwError('Query params cannot be parsed');
	}

	return queryObj;
};

/**
 * Builds request using query object
 * @return {String} Built request string
 */
Search.prototype.buildQuery = function() {
	var base = config.base_url
	,	arr = []
	;

	base += 'apikey=' + config.api_key; // Adds api key
	base += '&wt=json'; // JSON response required
	base += '&fq=doc_type:full';

	// Iterates through each property in params, adding to request string
	for (var key in this.query) {
		arr.push(key + ':"' + this.query[key] + '"');
	}

	return base += '&q=' + arr.join('%20');
};

/**
 * Emits success event, with data from successful response
 * @param  {Obj} res Response data
 */
Search.prototype.sendResponse = function(res) {
	this.emit('success', res);
};

/**
 * Checks response for errors
 * Errors can be in body (with 200 OK status), so must check body to find errors
 * @param  {Obj} err  Error object
 * @param  {Obj} res  Full response object
 * @param  {Obj} body Body of response
 */
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

	// No 404 error, so check for empty body
	body = body.response.docs;
	if (body.length < 1)
		return this.throwError('No results found');

	this.sendResponse(body);
};

/**
 * Kicks off request to API
 */
Search.prototype.fetch = function() {
	var query = this.buildQuery();

	request(query, this.checkForErrors.bind(this));
};

/**
 * Emits error event
 * @param  {String} message Error message
 * @return {Bool}           Prevents further execution
 */
Search.prototype.throwError = function(message) {
	this.emit('error', new Error(message));
	return false;
};

module.exports = Search;
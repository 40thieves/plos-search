/* jshint expr: true */
var expect = require('chai').expect
,	Search = require('../lib/plosSearch')
;

describe('Search', function() {
	describe('General Search', function() {
		this.timeout(10000);

		it('should take a query as the first argument', function(done) {
			var search = new Search('altmetrics');

			search.on('success', function(data) {
				expect(data).to.exist;

				done();
			});

			search.fetch();
		});

		it('should return an array of article objects', function(done) {
			var search = new Search('altmetrics');

			search.on('success', function(data) {
				expect(data).to.be.a('array');

				done();
			});

			search.fetch();
		});

		it('should return article objects containing article metadata', function(done) {
			var search = new Search('altmetrics');

			search.on('success', function(data) {
				data.forEach(function(result) {
					expect(result).to.have.property('id');
					expect(result).to.have.property('publication_date');
					expect(result).to.have.property('article_type');
					expect(result).to.have.property('author_display');
					expect(result).to.have.property('abstract');
					expect(result).to.have.property('title_display');
				});

				done();
			});

			search.fetch();
		});

		it('should return article objects containing an array of authors', function(done) {
			var search = new Search('altmetrics');

			search.on('success', function(data) {
				data.forEach(function(result) {
					expect(result.author_display).to.be.a('array');
				});

				done();
			});

			search.fetch();
		});
	});

	describe('Error handling', function() {
		this.timeout(10000);

		it('should return error query not provided', function(done) {
			try {
				var search = new Search('');
			}
			catch (err) {
				expect(err).to.exist;

				done();
			}
		});

		it('should return a useful error response if query not provided', function(done) {
			try {
				var search = new Search('');
			}
			catch (err) {
				expect(err.message).to.equal('No query provided');

				done();
			}
		});

		it('should only accept query params from the whitelist of possible params', function(done) {
			try {
				var search = new Search({
					foo: 'bar'
				});
			}
			catch (err) {
				expect(err).to.exist;
				expect(err).to.have.property('message').that.equals('Query param: foo not recognised');

				done();
			}
		});

		it('should return an error response if query not found', function(done) {
			var search = new Search('akldfhkdshskfhklsdhskldhfk');

			search.on('error', function(err) {
				expect(err.message).to.equal('No results found');

				done();
			});

			search.fetch();
		});

		it('should return an error if the API request returns an error', function(done) {
			var search = new Search({
				test: 'test'
			}, {
				mode: 'test'
			});

			search.on('error', function(err) {
				expect(err).to.exist;

				done();
			});

			search.fetch();
		});

		it('should return an error if no query argument provided', function(done) {
			try {
				var search = new Search();
			}
			catch (err) {
				expect(err).to.exist;
				expect(err.message).to.equal('Query params cannot be parsed');
				
				done();
			}
		});
	});

	describe('Advanced Search', function() {
		this.timeout(10000);

		it('should take an object as the search parameter', function(done) {
			var search = new Search({
				author: 'neylon'
			});

			search.on('success', function(data) {
				expect(data).to.exist;

				done();
			});

			search.fetch();
		});

		it('should return an array of article objects', function(done) {
			var search = new Search({
				author: 'neylon'
			});

			search.on('success', function(data) {
				expect(data).to.be.a('array');

				done();
			});

			search.fetch();
		});

		it('should return article objects with article metadata written by the author', function(done) {
			var search = new Search({
				author: 'neylon'
			});

			search.on('success', function(data) {
				data.forEach(function(result) {
					expect(result).to.have.property('id');
					expect(result).to.have.property('publication_date');
					expect(result).to.have.property('article_type');
					expect(result).to.have.property('author_display');
					expect(result).to.have.property('abstract');
					expect(result).to.have.property('title_display');
				});

				done();
			});

			search.fetch();
		});

		it('should return article objects with article metadata from searches with multiple query params', function(done) {
			var search = new Search({
				abstract: 'open access',
				journal: 'plos biology'
			});

			search.on('success', function(data) {
				data.forEach(function(result) {
					expect(result).to.have.property('id');
					expect(result).to.have.property('publication_date');
					expect(result).to.have.property('article_type');
					expect(result).to.have.property('author_display');
					expect(result).to.have.property('abstract');
					expect(result).to.have.property('title_display');
				});

				done();
			});

			search.fetch();
		});
	});

	describe('Options', function() {
		this.timeout(10000);

		it('should take an options object as the second argument', function(done) {
			var search = new Search('altmetrics', {
				mode: 'test'
			});

			search.on('success', function(data) {
				expect(data).to.exist;

				done();
			});

			search.fetch();
		});
	});
});
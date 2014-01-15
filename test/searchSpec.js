var expect = require('chai').expect
,	config = require('../lib/config')()
,	search = require('../lib/plosSearch')
;

describe('PLOS Search', function() {
	describe('#search()', function() {
		this.timeout(10000);

		it('should take a query as the first argument', function(done) {
			search.search('altmetrics', function(err, result) {
				expect(result).to.exist;

				done();
			});
		});

		it('should return an array of article objects', function(done) {
			search.search('altmetrics', function(err, result) {
				expect(result).to.be.a('array');

				done();
			});
		});

		it('should return article objects containing article metadata', function(done) {
			search.search('altmetrics', function(err, result) {
				result.forEach(function(r) {
					expect(r).to.have.property('id');
					expect(r).to.have.property('journal');
					expect(r).to.have.property('publication_date');
					expect(r).to.have.property('article_type');
					expect(r).to.have.property('author_display');
					expect(r).to.have.property('abstract');
					expect(r).to.have.property('title_display');
				});

				done();
			});
		});

		it('should return article objects containing an array of authors', function(done) {
			search.search('altmetrics', function(err, result) {
				expect(result[0].author_display).to.be.a('array');

				done();
			});
		});
	});

	describe('#search() error handling', function() {
		this.timeout(10000);

		it('should return error query not provided', function(done) {
			search.search('', function(err, result) {
				expect(err).to.exist;
				expect(result).to.not.exist;

				done();
			});
		});

		it('should return a useful error response if query not provided', function(done) {
			search.search('', function(err, result) {
				var expected = {
					statusCode: 404,
					statusResponse: 'No results found',
					body: { response: { numFound: 0, start: 0, maxScore: 0, docs: [] } }
				};

				expect(err).to.deep.equal(expected);

				done();
			});

		});
	});

	describe('#authorSearch()', function() {
		it('should take an author name as the first argument', function(done) {
			search.authorSearch('neylon', function(err, result) {
				expect(result).to.exist;

				done();
			});
		});

		it('should return an array of article objects', function(done) {
			search.authorSearch('neylon', function(err, result) {
				expect(result).to.be.a('array');

				done();
			});
		});

		it('should return article objects with article metadata written by the author', function(done) {
			search.authorSearch('neylon', function(err, result) {
				result.forEach(function(r) {
					expect(r).to.have.property('id');
					expect(r).to.have.property('publication_date');
					expect(r).to.have.property('article_type');
					expect(r).to.have.property('author_display');
					expect(r).to.have.property('abstract');
					expect(r).to.have.property('title_display');
				});

				done();
			});
		});
	});

	describe('#titleSearch()', function() {

	});

	describe('#subjectSearch()', function() {

	});

	describe('#abstractSearch()', function() {

	});

	describe('#rawSearch()', function() {

	});
});
## plos-search

### Node wrapper for the PLOS Search API

A wrapper for the Public Library of Science (PLOS) [Search API](http://api.plos.org/solr/faq/).

```js
var Search = require('plos-search');

var search = new Search('altmetrics');

search.on('success', function(data) {
	console.log(data); // Array of matching articles
});
```

### Installation

	npm install plos-search

### Usage

#### Example response

```js
var Search = require('plos-search');

var search = new Search('firefly');

search.on('success', function(data) {
	data.forEach(function(article) {
		console.log('Id: ', article.id);
		console.log('Publication date: ', article.publication_date);
		console.log('Article type: ', article.article_type);
		console.log('Author: ', article.author_display); // Array of authors
		console.log('Abstract: ', article.abstract);
		console.log('Title: ', article.title_display);
	});
});

search.fetch();
```

#### Advanced usage

Using a query map. A whitelist of possible query params is found in the config, adapted from the API's [Search Fields](http://api.plos.org/solr/search-fields/) page.
```js
var Search = require('plos-search');

var search = new Search({
	author: 'Reynolds',
	title: 'Cant stop the signal'
});
```

#### Error handling

Init errors
```js
var Search = require('plos-search');

try {
	var search = new Search('');
}
catch (err) {
	// Handle error
}
```

Request errors
```js
var Search = require('plos-search');

var search = new Search('wont find anything');

search.on('error', function(err) {
	// Handle error
});

search.fetch();
```

### Running tests

Tests are provided with [`mocha`](http://visionmedia.github.io/mocha/). Run the tests with

	npm test

(Please note that some tests will hit the API, and so will take longer to complete. At least until I start mocking the API).

### License

(The MIT License)

Copyright &copy; 2014 Alasdair Smith, [http://alasdairsmith.org.uk](http://alasdairsmith.org.uk)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

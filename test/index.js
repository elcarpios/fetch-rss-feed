const assert = require('assert');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('fetch-rss-feeder', () => {
	let fetchRssFeedInjected, parseURLSpy, fsMock;
	const feeds = ['url1'];

	function rssParserMock() {
		this.parseURL = parseURLSpy
	};

	const expectedValues = { 'item1': {} };

	beforeEach(() => {
		parseURLSpy = sinon.fake.returns(expectedValues);

		fsMock = {
			writeFileSync: sinon.fake()
		};

		fetchRssFeedInjected = proxyquire('../src/index', {
			'fs': fsMock,
			'rss-parser': rssParserMock
		});
	});

	afterEach(() => {
		sinon.restore();
	});	

    it('should fetch per every url in the array', () => {
		fetchRssFeedInjected(feeds);

		assert.equal(parseURLSpy.callCount, 1);
	});
	
	it('should write the output in a file', async () => {
		await fetchRssFeedInjected(feeds, 'path');

		assert.equal(fsMock.writeFileSync.callCount, 1);
	});
	
	it('should return the values if there is no path defined', async () => {
		const values = await fetchRssFeedInjected(feeds);

		assert.notDeepStrictEqual(values, expectedValues);
    });

});
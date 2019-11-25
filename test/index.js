const assert = require('assert');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('fetch-rss-feeder', () => {
	let fetchRssFeedInjected, parseURLSpy, fsMock, mkdirpMock, pathMock, caseAnithingMock, normalizeStringsMock;
	const feeds = ['url1'];

	function rssParserMock() {
		this.parseURL = parseURLSpy
	};

	const expectedValues = { 'title': 'test', items: [] };

	beforeEach(() => {
		parseURLSpy = sinon.fake.returns(Promise.resolve(expectedValues));

		fsMock = {
			writeFileSync: sinon.fake()
		};

		mkdirpMock = {
			sync: sinon.spy()
		};

		pathMock = {
			join: sinon.spy()
		};

		caseAnithingMock = {
			kebabCase: sinon.fake.returns('test')		
		};

		normalizeStringsMock = sinon.spy()

		fetchRssFeedInjected = proxyquire('../src/index', {
			'fs': fsMock,
			'path': pathMock,
			'mkdirp': mkdirpMock,
			'rss-parser': rssParserMock,
			'case-anything': caseAnithingMock,
			'normalize-strings': normalizeStringsMock
		});
	});

	afterEach(() => {
		sinon.restore();
	});	

    it('should fetch per every url in the array', () => {
		fetchRssFeedInjected(feeds, 'path');

		assert.equal(parseURLSpy.callCount, 1);
	});
});
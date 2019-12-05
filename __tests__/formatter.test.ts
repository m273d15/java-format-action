import sinon, { SinonStub } from 'sinon';
import { Formatter } from '../src/formatter';
import * as tc from '@actions/tool-cache';
import { rejects } from 'assert';


describe('Formatter.getJar()', () => {
    afterEach(() => {
        sinon.restore();
    });

    const toolVersion = '1.7'
    const formatterCachePath = 'path/to/cache/tool';
    const noCachedToolPath = '';
    const cachedToolPath = `${formatterCachePath}/some-formatter.jar`;
    const downloadedJarName = 'dGhpc2lzYXZhbGlkZmlsZQ'; // downloaded file has a hash name
    const formatterCacheFilePathPattern = new RegExp(formatterCachePath + '/.+\.jar')

    function stubFind(version: string, path: string, reject: boolean = false) {
        let stub = sinon.stub(tc, 'find')
            .withArgs(sinon.match.any, version);
        if (reject) stub.rejects()
        else stub.resolves(path);
    }

    function stubDownloadTool(downloadedJarName: string, reject: boolean = false) {
        let stub = sinon.stub(tc, 'downloadTool')
            .withArgs(sinon.match.any);
        if (reject) stub.rejects();
        else stub.resolves(downloadedJarName);
    }

    function stubCacheFile(jarPath: string, version: string, reject: boolean = false) {
        let stub = sinon.stub(tc, 'cacheFile')
            .withArgs(sinon.match.any, sinon.match.any, sinon.match.any, version);
        if (reject) stub.rejects();
        else stub.resolves(jarPath);
    }

    function withoutCachedTool() {
        stubFind(toolVersion, noCachedToolPath);
    }

    function withCachedTool() {
        stubFind(toolVersion, cachedToolPath);
    }

    function withFailedFindCachedVersion() {
        stubFind(toolVersion, cachedToolPath, true);
    }

    function withSuccessfulCacheFile() {
        stubCacheFile(formatterCachePath, toolVersion);
    }

    function withFailedCacheFile() {
        stubCacheFile(formatterCachePath, toolVersion, true);
    }

    function withSuccessfulToolDownlad() {
        stubDownloadTool(downloadedJarName);
    }

    function withFailedToolDownload() {
        stubDownloadTool(downloadedJarName, true);
    }

    
    test('without a cached tool and succesful download', async () => {
        withoutCachedTool();
        withSuccessfulToolDownlad();
        withSuccessfulCacheFile();

        expect(await new Formatter(toolVersion).getJar()).toMatch(formatterCacheFilePathPattern);
    });

    test('with a cached tool', async () => {
        withCachedTool();

        expect(await new Formatter(toolVersion).getJar()).toEqual(cachedToolPath);
    });

    test('with failed download', async () => {
        withoutCachedTool();
        withFailedToolDownload();

        await expect(new Formatter(toolVersion).getJar()).rejects.toThrow();
    });

    test('with failed caching', async () => {
        withoutCachedTool();
        withSuccessfulToolDownlad();
        withFailedCacheFile();

        await expect(new Formatter(toolVersion).getJar()).rejects.toThrow();
    });

    test('with failure during finding cached version', async () => {
        withFailedFindCachedVersion();

        await expect(new Formatter(toolVersion).getJar()).rejects.toThrow();
    });
});


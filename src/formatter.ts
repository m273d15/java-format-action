import * as tc from '@actions/tool-cache';

export class Formatter {
    private formatterName: string = 'formatter.jar';
    private toolName: string = 'google-java-format'
    private version: string;
    private jarName: string;
    constructor(version: string) {
        this.version = version;
        this.jarName = this.determineFormatJarName();
    }

    private determineDownloadUrl(): string {
        return `https://repo.maven.apache.org/maven2/com/google/googlejavaformat/google-java-format/${this.version}/${this.jarName}`
    }

    private determineFormatJarName(): string {
        return `google-java-format-${this.version}-all-deps.jar`
    }

    private async downloadJar() {
        const downloadedJarName = await tc.downloadTool(this.determineDownloadUrl());
        const jarDirPath = await tc.cacheFile(downloadedJarName, this.formatterName, this.toolName, this.version);
        return `${jarDirPath}/${this.formatterName}`;
    }

    public async findCachedJar() {
        return await tc.find(this.toolName, this.version);
    }

    public async getJar(): Promise<string> {
        let formatter = await this.findCachedJar();
        if (!formatter) {
            formatter = await this.downloadJar();
        }
        return formatter;
    }
}
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tc = __importStar(require("@actions/tool-cache"));
class Formatter {
    constructor(version) {
        this.formatterName = 'formatter.jar';
        this.toolName = 'google-java-format';
        this.version = version;
        this.jarName = this.determineFormatJarName();
    }
    determineDownloadUrl() {
        return `https://repo.maven.apache.org/maven2/com/google/googlejavaformat/google-java-format/${this.version}/${this.jarName}`;
    }
    determineFormatJarName() {
        return `google-java-format-${this.version}-all-deps.jar`;
    }
    downloadJar() {
        return __awaiter(this, void 0, void 0, function* () {
            const downloadedJarName = yield tc.downloadTool(this.determineDownloadUrl());
            const jarDirPath = yield tc.cacheFile(downloadedJarName, this.formatterName, this.toolName, this.version);
            return `${jarDirPath}/${this.formatterName}`;
        });
    }
    findCachedJar() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield tc.find(this.toolName, this.version);
        });
    }
    getJar() {
        return __awaiter(this, void 0, void 0, function* () {
            let formatter = yield this.findCachedJar();
            if (!formatter) {
                formatter = yield this.downloadJar();
            }
            return formatter;
        });
    }
}
exports.Formatter = Formatter;

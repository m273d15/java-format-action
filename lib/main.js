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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const glob_1 = __importDefault(require("glob"));
const formatter_1 = require("./formatter");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const version = core.getInput('version', { required: true });
            const dir = core.getInput('dir');
            const pattern = core.getInput('pattern');
            const formatter = new formatter_1.Formatter(version);
            const jar = yield formatter.getJar();
            const files = glob_1.default.sync(`${dir}/${pattern}`);
            yield exec.exec('java', ['-jar', jar, '--dry-run', '--set-exit-if-changed', ...files]);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();

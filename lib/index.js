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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var yargs = require("yargs");
var readline = require("readline");
var helpers_1 = require("./utils/helpers");
var log_1 = require("./utils/log");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
var argv = yargs
    .options({
    major: { type: 'boolean', default: false },
    minor: { type: 'boolean', default: false },
    patch: { type: 'boolean', default: false },
    build: { type: 'boolean', default: false },
    pathToPackage: { type: 'string' },
    pathToGradle: { type: 'string' },
    pathToPbxproj: { type: 'string' },
    m: { type: 'string' },
    message: { type: 'string' },
})
    .parseSync();
var pathToRoot = process.cwd();
var pathToPackage = argv.pathToPackage || "".concat(pathToRoot, "/package.json");
var info = helpers_1.default.getPackageInfo(pathToPackage);
var pathToPbxproj = argv.pathToPbxproj || "".concat(pathToRoot, "/ios/").concat(info.name, ".xcodeproj/project.pbxproj");
var pathToGradle = argv.pathToGradle || "".concat(pathToRoot, "/android/app/build.gradle");
// getting next version
var versionCurrent = info.version;
var versions = helpers_1.default.versions(versionCurrent);
var major = helpers_1.default.version(versions[0], argv.major);
var minor = helpers_1.default.version(versions[1], argv.minor, argv.major);
var patch = helpers_1.default.version(versions[2], argv.patch, argv.major || argv.minor);
var version = "".concat(major, ".").concat(minor, ".").concat(patch);
// getting next build number
var androidBuildCurrent = helpers_1.default.getBuildNumberFromGradle(pathToGradle);
var androidBuild = androidBuildCurrent + 1;
var iosBuildCurrent = helpers_1.default.getBuildNumberFromPbxproj(pathToPbxproj);
var iosBuild = 1;
if (argv.build) {
    iosBuild = iosBuildCurrent + 1;
}
// getting commit message
var messageTemplate = argv.m || argv.message || "release ".concat(version, ": increase versions and build numbers");
var message = messageTemplate.replace("".concat(version), iosBuild > 1 ? "".concat(version, "-").concat(iosBuild) : version);
log_1.default.info("\nI'm going to increase the version in:");
log_1.default.info("- package.json (".concat(pathToPackage, ");"), 1);
log_1.default.info("- ios project (".concat(pathToPbxproj, ");"), 1);
log_1.default.info("- android project (".concat(pathToGradle, ")."), 1);
log_1.default.notice("\nThe version will be changed:");
log_1.default.notice("- on iOS", 1);
log_1.default.notice("- from: ".concat(versionCurrent, " (").concat(iosBuildCurrent, ");"), 2);
log_1.default.notice("- to:   ".concat(version, " (").concat(iosBuild, ")."), 2);
log_1.default.notice("- on android", 1);
log_1.default.notice("- from: ".concat(versionCurrent, " (").concat(androidBuildCurrent, ");"), 2);
log_1.default.notice("- to:   ".concat(version, " (").concat(androidBuild, ")."), 2);
if (version === versionCurrent && (iosBuild === iosBuildCurrent || androidBuild === androidBuildCurrent)) {
    log_1.default.warning('\nNothing to change in the version. Canceled.');
    process.exit();
}
var chain = new Promise(function (resolve, reject) {
    log_1.default.line();
    if (versions.length !== 3) {
        log_1.default.warning("I can't understand format of the version \"".concat(versionCurrent, "\"."));
    }
    var question = log_1.default.info("Use \"".concat(version, "\" as the next version? [y/n] "), 0, true);
    rl.question(question, function (answer) {
        // eslint-disable-next-line prefer-promise-reject-errors
        answer.match(/^y(es)?$/i) ? resolve() : reject('Process canceled.');
    });
});
var update = chain
    .then(function () {
    log_1.default.notice('\nUpdating versions');
})
    .then(function () {
    log_1.default.info('Updating version in package.json...', 1);
    helpers_1.default.changeVersionInPackage(pathToPackage, version);
    log_1.default.success("Version in package.json changed.", 2);
})
    .then(function () {
    log_1.default.info('Updating version in xcode project...', 1);
    helpers_1.default.changeVersionAndBuildInPbxproj(pathToPbxproj, version, iosBuild);
    log_1.default.success("Version and build number in ios project (pbxproj file) changed.", 2);
})
    .then(function () {
    log_1.default.info('Updating version in android project...', 1);
    helpers_1.default.changeVersionAndBuildInGradle(pathToGradle, version, androidBuild);
    log_1.default.success("Version and build number in android project (gradle file) changed.", 2);
});
var commit = update.then(function () { return __awaiter(void 0, void 0, void 0, function () {
    var question, answer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_1.default.notice("\nI'm ready to cooperate with the git!");
                log_1.default.info('I want to make a commit with message:', 1);
                log_1.default.info("\"".concat(message, "\""), 2);
                log_1.default.info("I want to add a tag:", 1);
                if (iosBuild > 1) {
                    log_1.default.info("\"v".concat(version, "-").concat(iosBuild, "\""), 2);
                }
                else {
                    log_1.default.info("\"v".concat(version, "\""), 2);
                }
                question = log_1.default.info("Do you allow me to do this? [y/n] ", 1, true);
                return [4 /*yield*/, new Promise(function (resolve) {
                        rl.question(question, resolve);
                    })];
            case 1:
                answer = _a.sent();
                if (answer.match(/^y(es)?$/i)) {
                    return [2 /*return*/, helpers_1.default
                            .commitVersionIncrease(version, iosBuild, message, [pathToPackage, pathToPbxproj, pathToGradle])
                            .then(function () {
                            log_1.default.success("Commit with files added. Run \"git push\".", 1);
                        })];
                }
                else {
                    log_1.default.warning("Skipped.", 1);
                }
                return [2 /*return*/];
        }
    });
}); });
commit
    .then(function () {
    log_1.default.success("\nDone!");
})
    .catch(function (e) {
    log_1.default.line();
    log_1.default.error(e);
})
    .finally(function () {
    rl.close();
});
//# sourceMappingURL=index.js.map
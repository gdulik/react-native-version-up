'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var argv = require('yargs').argv;
var readlineSync = require('readline-sync');
var helpers_1 = require("./utils/helpers");
var log_1 = require("./utils/log");
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
var messageTemplate = argv.m || argv.message || 'release ${version}: increase versions and build numbers';
var message = messageTemplate.replace('${version}', iosBuild > 1 ? "".concat(version, "-").concat(iosBuild) : version);
log_1.default.info('\nI\'m going to increase the version in:');
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
    var answer = readlineSync.question(question).toLowerCase();
    answer === 'y' ? resolve() : reject('Process canceled.');
});
var update = chain.then(function () {
    log_1.default.notice('\nUpdating versions');
}).then(function () {
    log_1.default.info('Updating version in package.json...', 1);
    helpers_1.default.changeVersionInPackage(pathToPackage, version);
    log_1.default.success("Version in package.json changed.", 2);
}).then(function () {
    log_1.default.info('Updating version in xcode project...', 1);
    helpers_1.default.changeVersionAndBuildInPbxproj(pathToPbxproj, version, iosBuild);
    log_1.default.success("Version and build number in ios project (pbxproj file) changed.", 2);
}).then(function () {
    log_1.default.info('Updating version in android project...', 1);
    helpers_1.default.changeVersionAndBuildInGradle(pathToGradle, version, androidBuild);
    log_1.default.success("Version and build number in android project (gradle file) changed.", 2);
});
var commit = update.then(function () {
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
    var question = log_1.default.info("Do you allow me to do this? [y/n] ", 1, true);
    var answer = readlineSync.question(question).toLowerCase();
    if (answer === 'y') {
        return helpers_1.default.commitVersionIncrease(version, iosBuild, message, [
            pathToPackage,
            pathToPbxproj,
            pathToGradle
        ]).then(function () {
            log_1.default.success("Commit with files added. Run \"git push\".", 1);
        });
    }
    else {
        log_1.default.warning("Skipped.", 1);
    }
});
commit.then(function () {
    log_1.default.success("\nDone!");
}).catch(function (e) {
    log_1.default.line();
    log_1.default.error(e);
});
//# sourceMappingURL=index.js.map
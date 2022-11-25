'use strict';
var fs = require('fs');
var argv = require('yargs').argv;
var readlineSync = require('readline-sync');
var helpers = require('./lib/helpers');
var log = require('./lib/log');
var pathToRoot = process.cwd();
var pathToPackage = argv.pathToPackage || "".concat(pathToRoot, "/package.json");
var info = helpers.getPackageInfo(pathToPackage);
var pathToPbxproj = argv.pathToPbxproj || "".concat(pathToRoot, "/ios/").concat(info.name, ".xcodeproj/project.pbxproj");
var pathToGradle = argv.pathToGradle || "".concat(pathToRoot, "/android/app/build.gradle");
// getting next version
var versionCurrent = info.version;
var versions = helpers.versions(versionCurrent);
var major = helpers.version(versions[0], argv.major);
var minor = helpers.version(versions[1], argv.minor, argv.major);
var patch = helpers.version(versions[2], argv.patch, argv.major || argv.minor);
var version = "".concat(major, ".").concat(minor, ".").concat(patch);
// getting next build number
var androidBuildCurrent = helpers.getBuildNumberFromGradle(pathToGradle);
var androidBuild = androidBuildCurrent + 1;
var iosBuildCurrent = helpers.getBuildNumberFromPbxproj(pathToPbxproj);
var iosBuild = 1;
if (argv.build) {
    iosBuild = iosBuildCurrent + 1;
}
// getting commit message
var messageTemplate = argv.m || argv.message || 'release ${version}: increase versions and build numbers';
var message = messageTemplate.replace('${version}', iosBuild > 1 ? "".concat(version, "-").concat(iosBuild) : version);
log.info('\nI\'m going to increase the version in:');
log.info("- package.json (".concat(pathToPackage, ");"), 1);
log.info("- ios project (".concat(pathToPbxproj, ");"), 1);
log.info("- android project (".concat(pathToGradle, ")."), 1);
log.notice("\nThe version will be changed:");
log.notice("- on iOS", 1);
log.notice("- from: ".concat(versionCurrent, " (").concat(iosBuildCurrent, ");"), 2);
log.notice("- to:   ".concat(version, " (").concat(iosBuild, ")."), 2);
log.notice("- on android", 1);
log.notice("- from: ".concat(versionCurrent, " (").concat(androidBuildCurrent, ");"), 2);
log.notice("- to:   ".concat(version, " (").concat(androidBuild, ")."), 2);
if (version === versionCurrent && (iosBuild === iosBuildCurrent || androidBuild === androidBuildCurrent)) {
    log.warning('\nNothing to change in the version. Canceled.');
    process.exit();
}
var chain = new Promise(function (resolve, reject) {
    log.line();
    if (versions.length !== 3) {
        log.warning("I can't understand format of the version \"".concat(versionCurrent, "\"."));
    }
    var question = log.info("Use \"".concat(version, "\" as the next version? [y/n] "), 0, true);
    var answer = readlineSync.question(question).toLowerCase();
    answer === 'y' ? resolve() : reject('Process canceled.');
});
var update = chain.then(function () {
    log.notice('\nUpdating versions');
}).then(function () {
    log.info('Updating version in package.json...', 1);
    helpers.changeVersionInPackage(pathToPackage, version);
    log.success("Version in package.json changed.", 2);
}).then(function () {
    log.info('Updating version in xcode project...', 1);
    helpers.changeVersionAndBuildInPbxproj(pathToPbxproj, version, iosBuild);
    log.success("Version and build number in ios project (pbxproj file) changed.", 2);
}).then(function () {
    log.info('Updating version in android project...', 1);
    helpers.changeVersionAndBuildInGradle(pathToGradle, version, androidBuild);
    log.success("Version and build number in android project (gradle file) changed.", 2);
});
var commit = update.then(function () {
    log.notice("\nI'm ready to cooperate with the git!");
    log.info('I want to make a commit with message:', 1);
    log.info("\"".concat(message, "\""), 2);
    log.info("I want to add a tag:", 1);
    if (iosBuild > 1) {
        log.info("\"v".concat(version, "-").concat(iosBuild, "\""), 2);
    }
    else {
        log.info("\"v".concat(version, "\""), 2);
    }
    var question = log.info("Do you allow me to do this? [y/n] ", 1, true);
    var answer = readlineSync.question(question).toLowerCase();
    if (answer === 'y') {
        return helpers.commitVersionIncrease(version, iosBuild, message, [
            pathToPackage,
            pathToPbxproj,
            pathToGradle
        ]).then(function () {
            log.success("Commit with files added. Run \"git push\".", 1);
        });
    }
    else {
        log.warning("Skipped.", 1);
    }
});
commit.then(function () {
    log.success("\nDone!");
}).catch(function (e) {
    log.line();
    log.error(e);
});
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var child_process_1 = require("child_process");
var helpers = {
    versions: function (raw) {
        return typeof raw === 'string' ? raw.split('.') : [];
    },
    version: function (raw, flag, reset) {
        if (reset === void 0) { reset = false; }
        if (reset) {
            return 0;
        }
        var parsed = parseInt(raw);
        var value = parsed >= 0 ? parsed : 0;
        return flag ? value + 1 : value;
    },
    getPackageInfo: function (pathToFile) {
        return JSON.parse((0, fs_1.readFileSync)(pathToFile, 'utf8'));
    },
    getBuildNumberFromGradle: function (pathToGradle) {
        var content = (0, fs_1.readFileSync)(pathToGradle, 'utf8');
        var match = content.match(/(\s*versionCode\s+["']?)(\d+)(["']?\s*)/);
        if (match && match[2]) {
            return parseInt(match[2]);
        }
        return 1;
    },
    getBuildNumberFromPbxproj: function (pathToPbxproj) {
        var content = (0, fs_1.readFileSync)(pathToPbxproj, 'utf8');
        var match = content.match(/(CURRENT_PROJECT_VERSION = )(\d+)/);
        if (match && match[2]) {
            return parseInt(match[2]);
        }
        return 1;
    },
    changeVersionInPackage: function (pathToFile, version) {
        var packageContent = (0, fs_1.readFileSync)(pathToFile, 'utf8');
        packageContent = packageContent.replace(/("version":\s*")([\d.]+)(")/g, "$1".concat(version, "$3"));
        (0, fs_1.writeFileSync)(pathToFile, packageContent, 'utf8');
    },
    changeVersionAndBuildInPbxproj: function (pathToFile, version, build) {
        var content = (0, fs_1.readFileSync)(pathToFile, 'utf8');
        content = content.replace(/(MARKETING_VERSION = )([\d.]+)/g, "$1".concat(version));
        content = content.replace(/(CURRENT_PROJECT_VERSION = )(\d+)/g, "$1".concat(build));
        (0, fs_1.writeFileSync)(pathToFile, content, 'utf8');
    },
    changeVersionAndBuildInGradle: function (pathToFile, version, build) {
        var content = (0, fs_1.readFileSync)(pathToFile, 'utf8');
        content = content.replace(/(\s*versionName\s+["']?)([\d.]+)(["']?\s*)/g, "$1".concat(version, "$3"));
        content = content.replace(/(\s*versionCode\s+["']?)(\d+)(["']?\s*)/g, "$1".concat(build, "$3"));
        (0, fs_1.writeFileSync)(pathToFile, content, 'utf8');
    },
    commitVersionIncrease: function (version, build, message, pathsToAdd) {
        if (pathsToAdd === void 0) { pathsToAdd = []; }
        return new Promise(function (resolve, reject) {
            if (build > 1) {
                (0, child_process_1.exec)("git add ".concat(pathsToAdd.join(' '), " && git commit -m '").concat(message, "' && git tag -a v").concat(version, "-").concat(build, " -m '").concat(message, "'"), function (error) {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve();
                });
            }
            else {
                (0, child_process_1.exec)("git add ".concat(pathsToAdd.join(' '), " && git commit -m '").concat(message, "' && git tag -a v").concat(version, " -m '").concat(message, "'"), function (error) {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve();
                });
            }
        });
    },
};
exports.default = helpers;
//# sourceMappingURL=helpers.js.map
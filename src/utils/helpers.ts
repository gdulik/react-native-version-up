'use strict';

const fs = require('fs');
const exec = require('child_process').exec;

module.exports = {
  versions(raw) {
    return typeof raw === 'string'
      ? raw.split('.') : [];
  },

  version(raw, flag, reset = false) {
    if (reset) {
      return 0;
    }

    const parsed = parseInt(raw);
    const value = parsed >= 0 ? parsed : 0;
    return flag ? value + 1 : value;
  },

  getPackageInfo(pathToFile) {
    return JSON.parse(fs.readFileSync(pathToFile, 'utf8'));
  },

  getBuildNumberFromGradle(pathToGradle) {
    const content = fs.readFileSync(pathToGradle, 'utf8');
    const match = content.match(/(\s*versionCode\s+["']?)(\d+)(["']?\s*)/);
    if (match && match[2]) {
      return parseInt(match[2]);
    }

    return 1;
  },

  getBuildNumberFromPbxproj(pathToPbxproj) {
    const content = fs.readFileSync(pathToPbxproj, 'utf8');
    const match = content.match(/(CURRENT_PROJECT_VERSION = )(\d+)/);
    if (match && match[2]) {
      return parseInt(match[2]);
    }

    return 1;
  },

  changeVersionInPackage(pathToFile, version) {
    let packageContent = fs.readFileSync(pathToFile, 'utf8');
    packageContent = packageContent.replace(/("version":\s*")([\d\.]+)(")/g, `$1${version}$3`);
    fs.writeFileSync(pathToFile, packageContent, 'utf8');
  },

  changeVersionAndBuildInPbxproj(pathToFile, version, build) {
    let content = fs.readFileSync(pathToFile, 'utf8');
    content = content.replace(/(MARKETING_VERSION = )([\d\.]+)/g, `$1${version}`);
    content = content.replace(/(CURRENT_PROJECT_VERSION = )(\d+)/g, `$1${build}`);
    fs.writeFileSync(pathToFile, content, 'utf8');
  },

  changeVersionAndBuildInGradle(pathToFile, version, build) {
    let content = fs.readFileSync(pathToFile, 'utf8');
    content = content.replace(/(\s*versionName\s+["']?)([\d\.]+)(["']?\s*)/g, `$1${version}$3`);
    content = content.replace(/(\s*versionCode\s+["']?)(\d+)(["']?\s*)/g, `$1${build}$3`);
    fs.writeFileSync(pathToFile, content, 'utf8');
  },

  commitVersionIncrease(version, build, message, pathsToAdd = []) {
    return new Promise((resolve, reject) => {
      if(build > 1) {
        exec(`git add ${pathsToAdd.join(' ')} && git commit -m '${message}' && git tag -a v${version}-${build} -m '${message}'`, error => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      } else {
        exec(`git add ${pathsToAdd.join(' ')} && git commit -m '${message}' && git tag -a v${version} -m '${message}'`, error => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      }
    });
  }
};

import {writeFileSync, readFileSync} from 'fs';
import {exec} from 'child_process';

const helpers = {
  versions(raw: string) {
    return typeof raw === 'string'
      ? raw.split('.') : [];
  },

  version(raw: string, flag: boolean, reset = false) {
    if (reset) {
      return 0;
    }

    const parsed = parseInt(raw);
    const value = parsed >= 0 ? parsed : 0;
    return flag ? value + 1 : value;
  },

  getPackageInfo(pathToFile: string) {
    return JSON.parse(readFileSync(pathToFile, 'utf8'));
  },

  getBuildNumberFromGradle(pathToGradle: string) {
    const content = readFileSync(pathToGradle, 'utf8');
    const match = content.match(/(\s*versionCode\s+["']?)(\d+)(["']?\s*)/);
    if (match && match[2]) {
      return parseInt(match[2]);
    }

    return 1;
  },

  getBuildNumberFromPbxproj(pathToPbxproj: string) {
    const content = readFileSync(pathToPbxproj, 'utf8');
    const match = content.match(/(CURRENT_PROJECT_VERSION = )(\d+)/);
    if (match && match[2]) {
      return parseInt(match[2]);
    }

    return 1;
  },

  changeVersionInPackage(pathToFile: string, version: string) {
    let packageContent = readFileSync(pathToFile, 'utf8');
    packageContent = packageContent.replace(/("version":\s*")([\d\.]+)(")/g, `$1${version}$3`);
    writeFileSync(pathToFile, packageContent, 'utf8');
  },

  changeVersionAndBuildInPbxproj(pathToFile: string, version: string, build: number) {
    let content = readFileSync(pathToFile, 'utf8');
    content = content.replace(/(MARKETING_VERSION = )([\d\.]+)/g, `$1${version}`);
    content = content.replace(/(CURRENT_PROJECT_VERSION = )(\d+)/g, `$1${build}`);
    writeFileSync(pathToFile, content, 'utf8');
  },

  changeVersionAndBuildInGradle(pathToFile: string, version: string, build: number) {
    let content = readFileSync(pathToFile, 'utf8');
    content = content.replace(/(\s*versionName\s+["']?)([\d\.]+)(["']?\s*)/g, `$1${version}$3`);
    content = content.replace(/(\s*versionCode\s+["']?)(\d+)(["']?\s*)/g, `$1${build}$3`);
    writeFileSync(pathToFile, content, 'utf8');
  },

  commitVersionIncrease(version: string, build: number, message: string, pathsToAdd: string[] = []) {
    return new Promise<void>((resolve, reject) => {
      if(build > 1) {
        exec(`git add ${pathsToAdd.join(' ')} && git commit -m '${message}' && git tag -a v${version}-${build} -m '${message}'`, (error: any) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      } else {
        exec(`git add ${pathsToAdd.join(' ')} && git commit -m '${message}' && git tag -a v${version} -m '${message}'`, (error: any) => {
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

export default helpers;
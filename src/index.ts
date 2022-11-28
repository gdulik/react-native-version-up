import * as yargs from 'yargs';
import * as readline from 'readline';
import helpers from './utils/helpers';
import log from './utils/log';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const argv = yargs
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

const pathToRoot: string = process.cwd();
const pathToPackage: string = argv.pathToPackage || `${pathToRoot}/package.json`;
const info = helpers.getPackageInfo(pathToPackage);

const pathToPbxproj: string = argv.pathToPbxproj || `${pathToRoot}/ios/${info.name}.xcodeproj/project.pbxproj`;
const pathToGradle: string = argv.pathToGradle || `${pathToRoot}/android/app/build.gradle`;

// getting next version
const versionCurrent = info.version;
const versions = helpers.versions(versionCurrent);
const major = helpers.version(versions[0], argv.major);
const minor = helpers.version(versions[1], argv.minor, argv.major);
const patch = helpers.version(versions[2], argv.patch, argv.major || argv.minor);
const version = `${major}.${minor}.${patch}`;

// getting next build number
const androidBuildCurrent = helpers.getBuildNumberFromGradle(pathToGradle);
const androidBuild = androidBuildCurrent + 1;
const iosBuildCurrent = helpers.getBuildNumberFromPbxproj(pathToPbxproj);
let iosBuild = 1;
if (argv.build) {
  iosBuild = iosBuildCurrent + 1;
}

// getting commit message
const messageTemplate = argv.m || argv.message || `release ${version}: increase versions and build numbers`;
const message = messageTemplate.replace(`${version}`, iosBuild > 1 ? `${version}-${iosBuild}` : version);

log.info("\nI'm going to increase the version in:");
log.info(`- package.json (${pathToPackage});`, 1);
log.info(`- ios project (${pathToPbxproj});`, 1);
log.info(`- android project (${pathToGradle}).`, 1);

log.notice(`\nThe version will be changed:`);
log.notice(`- on iOS`, 1);
log.notice(`- from: ${versionCurrent} (${iosBuildCurrent});`, 2);
log.notice(`- to:   ${version} (${iosBuild}).`, 2);
log.notice(`- on android`, 1);
log.notice(`- from: ${versionCurrent} (${androidBuildCurrent});`, 2);
log.notice(`- to:   ${version} (${androidBuild}).`, 2);

if (version === versionCurrent && (iosBuild === iosBuildCurrent || androidBuild === androidBuildCurrent)) {
  log.warning('\nNothing to change in the version. Canceled.');
  process.exit();
}

const chain = new Promise<void>((resolve, reject) => {
  log.line();

  if (versions.length !== 3) {
    log.warning(`I can't understand format of the version "${versionCurrent}".`);
  }

  const question = log.info(`Use "${version}" as the next version? [y/n] `, 0, true);
  rl.question(question, (answer) => {
    // eslint-disable-next-line prefer-promise-reject-errors
    answer.match(/^y(es)?$/i) ? resolve() : reject('Process canceled.');
  });
});

const update = chain
  .then(() => {
    log.notice('\nUpdating versions');
  })
  .then(() => {
    log.info('Updating version in package.json...', 1);

    helpers.changeVersionInPackage(pathToPackage, version);
    log.success(`Version in package.json changed.`, 2);
  })
  .then(() => {
    log.info('Updating version in xcode project...', 1);

    helpers.changeVersionAndBuildInPbxproj(pathToPbxproj, version, iosBuild);
    log.success(`Version and build number in ios project (pbxproj file) changed.`, 2);
  })
  .then(() => {
    log.info('Updating version in android project...', 1);

    helpers.changeVersionAndBuildInGradle(pathToGradle, version, androidBuild);
    log.success(`Version and build number in android project (gradle file) changed.`, 2);
  });

const commit = update.then(async () => {
  log.notice(`\nI'm ready to cooperate with the git!`);
  log.info('I want to make a commit with message:', 1);
  log.info(`"${message}"`, 2);
  log.info(`I want to add a tag:`, 1);
  if (iosBuild > 1) {
    log.info(`"v${version}-${iosBuild}"`, 2);
  } else {
    log.info(`"v${version}"`, 2);
  }

  const question = log.info(`Do you allow me to do this? [y/n] `, 1, true);
  const answer = await new Promise<string>((resolve) => {
    rl.question(question, resolve);
  });
  if (answer.match(/^y(es)?$/i)) {
    return helpers
      .commitVersionIncrease(version, iosBuild, message, [pathToPackage, pathToPbxproj, pathToGradle])
      .then(() => {
        log.success(`Commit with files added. Run "git push".`, 1);
      });
  } else {
    log.warning(`Skipped.`, 1);
  }
});

commit
  .then(() => {
    log.success(`\nDone!`);
  })
  .catch((e) => {
    log.line();
    log.error(e);
  })
  .finally(() => {
    rl.close();
  });

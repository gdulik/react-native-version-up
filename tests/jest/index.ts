import colorize, { COLORS, OPTIONS } from '../../src/utils/colorize';
import helpers from '../../src/utils/helpers';
import log from '../../src/utils/log';

const pathToRoot = process.cwd();
const pathToPackage = `${pathToRoot}/tests/jest/test.package.json`
const pathToGradle = `${pathToRoot}/tests/jest/test.build.gradle`
const pathToPbxproj = `${pathToRoot}/tests/jest/test.project.pbxproj`

describe('Helpers module', () => {
  test('Versions splitter', () => {
    expect(helpers.versions('1.2.3')).toEqual(['1','2','3'])
  })

  test('Version not increased', () => {
    expect(helpers.version('1', false)).toBe(1)
  })

  test('Version increased', () => {
    expect(helpers.version('1', true)).toBe(2)
  })

  test('Version reset', () => {
    expect(helpers.version('1', false, true)).toBe(0)
  })

  test('Get package info', () => {
    expect(helpers.getPackageInfo(pathToPackage)).toEqual({
      "name": "testapp",
      "version": "1.4.2",
      "scripts": {
        "android": "react-native run-android",
        "ios": "react-native run-ios"
      },
      "dependencies": {
        "react": "17.0.1",
        "react-native": "0.64.4"
      },
      "devDependencies": {
        "@gdulik/react-native-version-up": "1.1.0"
      }
    })
  })

  test('Get build number from gradle', () => {
    expect(helpers.getBuildNumberFromGradle(pathToGradle)).toBe(27)
  })

  test('Get build number from pbxproj', () => {
    expect(helpers.getBuildNumberFromPbxproj(pathToPbxproj)).toBe(1)
  })

  test('Change version in package', () => {
    helpers.changeVersionInPackage(pathToPackage, '1.4.3')

    expect(helpers.getPackageInfo(pathToPackage)).toEqual({
      "name": "testapp",
      "version": "1.4.3",
      "scripts": {
        "android": "react-native run-android",
        "ios": "react-native run-ios"
      },
      "dependencies": {
        "react": "17.0.1",
        "react-native": "0.64.4"
      },
      "devDependencies": {
        "@gdulik/react-native-version-up": "1.1.0"
      }
    });

    helpers.changeVersionInPackage(pathToPackage, '1.4.2');
  })

  test('Change version and build number in gradle', () => {
    helpers.changeVersionAndBuildInGradle(pathToGradle, '1.4.3', 28);

    expect(helpers.getBuildNumberFromGradle(pathToGradle)).toBe(28);

    helpers.changeVersionAndBuildInGradle(pathToGradle, '1.4.2', 27);
  })

  test('Change version and build number in pbxproj', () => {
    helpers.changeVersionAndBuildInPbxproj(pathToPbxproj, '1.4.3', 2);

    expect(helpers.getBuildNumberFromPbxproj(pathToPbxproj)).toBe(2);

    helpers.changeVersionAndBuildInPbxproj(pathToPbxproj, '1.4.2', 1);
  })
})

describe('Log module', () => {
  test('Echo with level', () => {
    expect(log.echo('Test message', 1, null, true)).toBe('  Test message')
  })

  test('Error log', () => {
    expect(log.error('Test message', 0, true)).toBe('\u001B[31mTest message\u001B[39m')
  })

  test('Success log', () => {
    expect(log.success('Test message', 0, true)).toBe('\u001B[32mTest message\u001B[39m')
  })

  test('Warning log', () => {
    expect(log.warning('Test message', 0, true)).toBe('\u001B[33mTest message\u001B[39m')
  })

  test('Notice log', () => {
    expect(log.notice('Test message', 0, true)).toBe('\u001B[34mTest message\u001B[39m')
  })

  test('Info log', () => {
    expect(log.info('Test message', 0, true)).toBe('Test message')
  })

  test('Line log', () => {
    expect(log.line(true)).toBe('')
  })
})

describe('Colorize module', () => {
  test('Only color', () => {
    expect(colorize('Test message', COLORS.red)).toBe('\u001B[31mTest message\u001B[39m')
  })

  test('Single option', () => {
    expect(colorize('Test message', null, [OPTIONS.bold])).toBe('\u001B[1mTest message\u001B[0m')
  })

  test('Multiple options', () => {
    expect(colorize('Test message', null, [OPTIONS.bold, OPTIONS.underline])).toBe('\u001B[4m\u001B[1mTest message\u001B[0m')
  })

  test('Color with option', () => {
    expect(colorize('Test message', COLORS.red, [OPTIONS.bold])).toBe('\u001B[1m\u001B[31mTest message\u001B[39m\u001B[0m')
  })
})
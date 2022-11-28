**Please, create pull request to the project if you improve something!**
**It will help us to create hight-quality package together.**

# React native version upper
Increase `major`, `minor` or `patch` part of the version or `build` number in your app in package.json and in ios and android projects with one command.
```
node ./node_modules/@gdulik/react-native-version-up/lib/index.js --patch -m 'commit message'
```

With this script you can:
- Increase `major`, `minor` or `patch` part in the version or `build` number.
- Make a git commit with version changes.
- Make a git tag with new version.

## Example
```bash
> yarn run version:up -- --patch
$ node ./node_modules/@gdulik/react-native-version-up/lib/index.js "--patch"

I'm going to increase the version in:
  - package.json (./package.json);
  - ios project (./ios/packagename.xcodeproj/project.pbxproj);
  - android project (./android/app/build.gradle).

The version will be changed:
  - on iOS
    - from: 1.4.1 (6);
    - to:   1.4.2 (1).
  - on android
    - from: 1.4.1 (30);
    - to:   1.4.2 (31).

Use "1.4.2" as the next version? [y/n] y

Updating versions
  Updating version in package.json...
    Version in package.json changed.
  Updating version in xcode project...
    Version and build number in ios project (pbxproj file) changed.
  Updating version in android project...
    Version and build number in android project (gradle file) changed.

I'm ready to cooperate with the git!
  I want to make a commit with message:
    "release 1.4.2: increase versions and build numbers"
  I want to add a tag:
    "v1.4.2"
  Do you allow me to do this? [y/n] y
  Commit with files added. Run "git push".

Done!
```

## Installation
```
yarn add -D react-native-version-up
```

Or via npm:
```
npm install react-native-version-up --save-dev
```

## Usage
**1. Add command in the section `scripts` in the `package.json`**
```json
{
  "name": "your-project-name",
  "scripts": {
    "version:up": "node ./node_modules/@gdulik/react-native-version-up/lib/index.js"
  }
}
```

**2. Make sure you have defined the version**
```json
{
  "name": "your-project-name",
  "version": "1.0.0",
  "scripts": {
    "version:up": "node ./node_modules/@gdulik/react-native-version-up/lib/index.js"
  }
}
```

**3. Commit the package.json (optional)**
```bash
git add package.json
git commit -m 'version:up command added'
```

**4. Increase version when needed**
```bash
yarn version:up --major
```

Or via npm:
```bash
npm run version:up -- --major
```
## Options
You can pass option name and value with following syntax (remember to put `--` before options if you are using npm, with yarn this is not needed):
```
yarn version:up --flag value
```

| **Option** | **Type** | **Default value** | **Description** |
|------------|----------|-------------------|-----------------|
| **`--major`** | `flag` | | Increase `major` version:<br/>**0**.0.0 -> **1**.0.0 |
| **`--minor`** | `flag` | | Increase `minor` version:<br/>0.**0**.0 -> 0.**1**.0 |
| **`--patch`** | `flag` | | Increase `patch` version:<br/>0.0.**0** -> 0.0.**1** |
| **`--build`** | `flag` | | Increase `build` number:<br/>0.0.0(**1**) -> 0.0.0(**2**) |
| **`--message` or `-m`** | `string` | `"release ${version}: increase versions and build numbers"` | Custom commit message. |
| **`--pathToPackage './path'`** | `string` | `./package.json` | Path to `package.json` file in your project. |
| **`--pathToPbxproj './path'`** | `string` | `./ios/${package.name}.xcodeproj/project.pbxproj` | Path to `project.pbxproj` file (ios project). |
| **`--pathToGradle './path'`** | `string` | `./android/app/build.gradle` | Path to `build.gradle` file (android project). |

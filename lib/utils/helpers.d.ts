declare const helpers: {
    versions(raw: string): string[];
    version(raw: string, flag: boolean, reset?: boolean): number;
    getPackageInfo(pathToFile: string): any;
    getBuildNumberFromGradle(pathToGradle: string): number;
    getBuildNumberFromPbxproj(pathToPbxproj: string): number;
    changeVersionInPackage(pathToFile: string, version: string): void;
    changeVersionAndBuildInPbxproj(pathToFile: string, version: string, build: number): void;
    changeVersionAndBuildInGradle(pathToFile: string, version: string, build: number): void;
    commitVersionIncrease(version: string, build: number, message: string, pathsToAdd?: string[]): Promise<void>;
};
export default helpers;

/**
 * Dictionary that contains all requirement names mapped to version number strings
 */
export interface IVersionContainer {
  [name: string]: string;
}

/**
 * Different types of environments
 */
export enum IEnvironmentType {
  /**
   * This is the catch-all type value, any environments that are randomly found or
   * entered will have this type
   */
  Path = 'path',
  /**
   * This environment type is reserved for the type level of conda installations
   */
  CondaRoot = 'conda-root',
  /**
   * This environment type is reserved for sub environments of a conda installation
   */
  CondaEnv = 'conda-env',
  /**
   * This environment type is for environments that were derived from the WindowsRegistry
   */
  WindowsReg = 'windows-reg',
  VirtualEnv = 'venv'
}

export const EnvironmentTypeName: { [key in IEnvironmentType]: string } = {
  [IEnvironmentType.Path]: 'system',
  [IEnvironmentType.CondaRoot]: 'conda',
  [IEnvironmentType.CondaEnv]: 'conda',
  [IEnvironmentType.WindowsReg]: 'win',
  [IEnvironmentType.VirtualEnv]: 'venv'
};

/**
 * The representation of the python environment
 */
export interface IPythonEnvironment {
  /**
   * The file path of the python executable
   */
  path: string;
  /**
   * Arbitrary name used for display, not guaranteed to be unique
   */
  name: string;
  /**
   * The type of the environment
   */
  type: IEnvironmentType;
  /**
   * For each requirement specified by the registry, there will be one corresponding version
   * There will also be a version that accompanies the python executable
   */
  versions: IVersionContainer;
  /**
   * Default kernel name
   */
  defaultKernel: string;
}

export enum PythonEnvResolveErrorType {
  PathNotFound = 'path-not-found',
  InvalidPythonBinary = 'invalid-python-binary',
  ResolveError = 'resolve-error',
  RequirementsNotSatisfied = 'requirements-not-satisfied'
}

export interface IPythonEnvResolveError {
  type: PythonEnvResolveErrorType;
  message?: string;
}

export interface IPythonEnvValidateResult {
  valid: boolean;
  error?: IPythonEnvResolveError;
}

export interface IDisposable {
  dispose(): Promise<void>;
}

export interface ICLIArguments {
  cwd?: string;
  _: (string | number)[];
  // eslint-disable-next-line id-match
  $0: string;
  [x: string]: unknown;
  pythonPath: string | unknown;
  workingDir: string | unknown;
  persistSessionData: boolean | unknown;
}

export interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

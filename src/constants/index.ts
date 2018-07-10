import DefaultOptions from "../interfaces/DefaultOptions";

export const BELLO_URL = 'https://ainoob.com/bello/nooboss';

export const defaultOptions: DefaultOptions = {
  notifyStateChange: true,
  notifyInstallation: true,
  notifyRemoval: true,
  historyInstall: true,
  historyRemove: true,
  historyUpdate: true,
  historyEnable: true,
  historyDisable: true,
  autoState: true,
  autoStateNotification: false,
  autoStateRules: [],
  sortOrder: 'nameState',
  joinCommunity: true,
  recoExtensions: true,
  notificationDuration_autoState: 5,
  notificationDuration_stateChange: 5,
  notificationDuration_installation: -1,
  notificationDuration_removal: -1,
  viewMode: 'tile',
  sendUsage: true,
  groupList: [],
  mainColor: { r: 0, g: 0, b: 0, a: 1 },
  subColor: { r: 0, g: 0, b: 0, a: 1 },
  extensions: true,
  userscripts: true,
};

export const defaultOptionsDisplay = {
  experience: true,
  experienceTheme: true,
  extensions: true,
  extensionsExtensions: true,
  extensionsNotifications: true,
  extensionsHistory: true,
  extensionsAutoState: true,
  autoStateBasics: true,
  userscripts: true,
  advanced: true,
  advancedBasics: true,
  advancedClean: true,
  advancedBackup: true,
};
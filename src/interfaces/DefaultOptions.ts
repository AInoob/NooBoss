import AutoState from "./AutoState";
import Group from "./Group";
import Color from "./Color";

export default interface DefaultOptions {
  notifyStateChange: boolean
  notifyInstallation: boolean
  notifyRemoval: boolean
  historyInstall: boolean
  historyRemove: boolean
  historyUpdate: boolean
  historyEnable: boolean
  historyDisable: boolean
  autoState: boolean
  autoStateNotification: false
  autoStateRules: AutoState[]
  sortOrder: 'nameState'
  joinCommunity: boolean
  recoExtensions: boolean
  notificationDuration_autoState: number
  notificationDuration_stateChange: number
  notificationDuration_installation: number
  notificationDuration_removal: number
  viewMode: 'tile' | 'bigTile' | 'list'
  sendUsage: boolean
  groupList: Group[]
  mainColor: Color
  subColor: Color
  extensions: boolean
  userscripts: boolean
}
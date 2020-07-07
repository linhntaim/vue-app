import {PromiseManager} from '@dsquare-gbu/vue-utils'
import {SCOPE} from './constants'
import PluginUse from './plugin-use'

export default class PluginUseManager {
    constructor() {
        this.pluginUses = {}
        this.pluginUses[SCOPE.always] = []
        this.pluginUses[SCOPE.default] = []
        this.pluginUses[SCOPE.failed] = []
        this.attached = {}
    }

    use(name, {plugin, attached = null, options = null, promiseCallback = null, scope = SCOPE.always}) {
        this.pluginUses[scope].push(new PluginUse(name, plugin, attached, options, promiseCallback))
    }

    resetAttaching() {
        this.attached = {}
        return this
    }

    ready(scope = SCOPE.always) {
        const promiseManager = new PromiseManager
        this.pluginUses[scope].forEach(pluginUse => promiseManager.add(pluginUse.name, pluginUse.promise()))
        return promiseManager.ready().then(() => this.pluginUses[scope].forEach(pluginUse => {
            if (pluginUse.hasAttached) {
                this.attached[pluginUse.name] = pluginUse.attached
            }
        }))
    }
}

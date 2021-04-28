import {PluginUse} from './plugin-use'
import {PromiseManager} from '@linhntaim/vue-utils'
import {SCOPE} from './constants'

export class PluginUseManager {
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

    readyByScopes(scopes) {
        const promiseManager = new PromiseManager
        scopes.forEach(
            scope => this.pluginUses[scope].forEach(
                pluginUse => promiseManager.add(pluginUse.name, pluginUse.promise()),
            ),
        )
        return promiseManager.ready()
            .then(() => scopes.forEach(
                scope => this.pluginUses[scope].forEach(
                    pluginUse => pluginUse.hasAttached && (this.attached[pluginUse.name] = pluginUse.attached),
                ),
            ))
    }

    ready(scope = SCOPE.always) {
        return this.readyByScopes(scope === SCOPE.always ? [scope] : [scope, SCOPE.always])
    }
}

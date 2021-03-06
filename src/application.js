import Vue from 'vue'
import {PluginUseManager, SCOPE} from './plugin-use'

export class Application {
    constructor() {
        this.instance = null
        this.pluginUseManager = new PluginUseManager()

        this.clientIps = []
        this.maintenanceMode = null
        this.limitationMode = null
    }

    maintenance(maintenanceMode) {
        if (typeof maintenanceMode !== 'undefined') {
            this.maintenanceMode = maintenanceMode
        }
        return this.maintenanceMode
    }

    limitation(limitationMode) {
        if (typeof limitationMode !== 'undefined') {
            this.limitationMode = limitationMode
        }
        return this.limitationMode
    }

    ips(clientIps) {
        if (typeof clientIps !== 'undefined') {
            this.clientIps = clientIps
        }
        return this.clientIps
    }

    get() {
        return new Promise((resolve, reject) => {
            const tryInstance = (tried = 1, maxTried = 100) => {
                if (this.instance) {
                    resolve(this.instance)
                    return
                }

                if (tried === maxTried) {
                    reject()
                    return
                }

                setTimeout(() => tryInstance(++tried), 200)
            }

            tryInstance()
        })
    }

    use(pluginUses = {}) {
        Object.keys(pluginUses).forEach(name => this.pluginUseManager.use(name, pluginUses[name]))
        return this
    }

    register(handle) {
        let register = false
        Vue.mixin({
            beforeCreate() {
                if (!register) {
                    register = true
                    handle(this)
                }
            },
        })
        return this
    }

    pluginsReady() {
        return this.pluginUseManager.resetAttaching().ready()
    }

    createDefault(appComponent, appElement = '#app') {
        this.instance = new Vue(Object.assign({
            render: h => h(appComponent),
        }, this.pluginUseManager.attached)).$mount(appElement)
    }

    createFailed(appFailedComponent, appElement = '#app') {
        this.pluginsReady()
            .then(() => this.pluginUseManager.ready(SCOPE.failed)
                .then(() => this.createDefault(appFailedComponent, appElement, true))
                .catch(() => this.createDefault(appFailedComponent, appElement, true)))
            .catch(() => this.createDefault(appFailedComponent, appElement, true))
    }

    create(appComponent, appFailedComponent, appElement = '#app') {
        this.pluginsReady()
            .then(() => this.pluginUseManager.ready(SCOPE.default)
                .then(() => this.createDefault(appComponent, appElement))
                .catch(() => this.createFailed(appFailedComponent, appElement)))
            .catch(() => this.createFailed(appFailedComponent, appElement))
    }
}

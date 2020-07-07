import Vue from 'vue'
import PluginUseManager, {SCOPE} from './plugin-use'

export default class Application {
    constructor() {
        this.instance = null
        this.pluginUseManager = new PluginUseManager()
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

    pluginsReady() {
        return this.pluginUseManager.resetAttaching().ready()
    }

    createDefault(appComponent, readyCallback = null, appElement = '#app', failed = false) {
        this.instance = new Vue(Object.assign({
            render: h => h(appComponent),
            beforeCreate() {
                readyCallback && readyCallback(this, failed)
            },
        }, this.pluginUseManager.attached)).$mount(appElement)
    }

    createFailed(appFailedComponent, readyCallback = null, appElement = '#app') {
        this.pluginsReady()
            .then(() => this.pluginUseManager.ready(SCOPE.failed)
                .then(() => this.createDefault(appFailedComponent, readyCallback, appElement, true))
                .catch(() => this.createDefault(appFailedComponent, readyCallback, appElement, true)))
            .catch(() => this.createDefault(appFailedComponent, readyCallback, appElement, true))
    }

    create(appComponent, appFailedComponent, appPluginUses = [], readyCallback = null, appElement = '#app') {
        this.use(appPluginUses)
            .pluginsReady()
            .then(() => this.pluginUseManager.ready(SCOPE.default)
                .then(() => this.createDefault(appComponent, readyCallback, appElement))
                .catch(() => this.createFailed(appFailedComponent, readyCallback, appElement)))
            .catch(() => this.createFailed(appFailedComponent, readyCallback, appElement))
    }
}

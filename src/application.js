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

    createDefault(appComponent, appElement = '#app') {
        this.instance = new Vue(Object.assign({
            render: h => h(appComponent),
        }, this.pluginUseManager.attached)).$mount(appElement)
    }

    createFailed(appFailedComponent, appElement = '#app') {
        this.pluginsReady()
            .then(() => this.pluginUseManager.ready(SCOPE.failed)
                .then(() => this.createDefault(appFailedComponent, appElement))
                .catch(() => this.createDefault(appFailedComponent, appElement)))
            .catch(() => this.createDefault(appFailedComponent, appElement))
    }

    create(appComponent, appFailedComponent, appPluginUses = [], appElement = '#app') {
        this.use(appPluginUses)
            .pluginsReady()
            .then(() => this.pluginUseManager.ready(SCOPE.default)
                .then(() => this.createDefault(appComponent, appElement))
                .catch(() => this.createFailed(appFailedComponent, appElement)))
            .catch(() => this.createFailed(appFailedComponent, appElement))
    }
}

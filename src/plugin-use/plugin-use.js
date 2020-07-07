import Vue from 'vue'

export default class PluginUse {
    constructor(name, plugin, attached = null, options = null, promiseCallback = null) {
        this.name = name
        this.hasAttached = !!attached

        const use = () => {
            if (options) Vue.use(plugin, options)
            else Vue.use(plugin)
            this.attached = this.hasAttached ? (typeof attached === 'function' ? attached() : attached) : null
        }
        this.promiseCallback = promiseCallback ? (resolve, reject) => {
            use()
            promiseCallback(resolve, reject, this)
        } : resolve => {
            use()
            resolve()
        }
    }

    promise() {
        return new Promise(this.promiseCallback)
    }
}

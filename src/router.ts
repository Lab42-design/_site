//
import Events from "./events.js"

const ROUTER_TYPES = {
        hash: "hash", history: "history"
    }, defer = x => { setTimeout(() => x(), 10)
}


/**
 * SPA Router - replacement for Framework Routers (history and hash).
*/

interface Router {
    [on: string]: any
}

class Router {
    constructor(options = {}) {
        console.log('_42 / Router')
        this.events = new Events(this)
        this.options = { type: ROUTER_TYPES.hash, ...options }
    }

    /**
     * Start listening for route changes.
     * @returns {Router} reference to itself.
     */
    listen() {
        console.log('_42 / Router / listen')
        this.routeHash = Object.keys(this.options.routes)

        if (!this.routeHash.includes("/")) {
            throw TypeError("No home route found")
        }
        if (this.isHashRouter) {
            window.addEventListener('hashchange', this._hashChanged.bind(this))
            defer(() => this._tryNav(document.location.hash.substring(1)))
        }
        else {
            let href = document.location.origin;
            if (this._findRoute(document.location.pathname)) {
                href += document.location.pathname;
            }
            document.addEventListener("click", this._onNavClick.bind(this))
            window.addEventListener("popstate", this._triggerPopState.bind(this))

            defer(() => this._tryNav(href))
        }
        return this
    }

    _hashChanged() {
        console.log('_42 / Router / _hashChanged')
        this._tryNav(document.location.hash.substring(1))
    }

    _triggerPopState(e) {
        console.log('_42 / Router / _triggerPopState')
        this._triggerRouteChange(e.state.path, e.target.location.href)
    }

    _triggerRouteChange(path, url) {
        console.log('_42 / Router / _triggerRouteChange')
        this.events.trigger("route", {
            route: this.options.routes[path], path: path, url: url
        })
    }

    _findRoute(url) {
        console.log('_42 / Router / _findRoute')
        let test = "/" + url.match(/([A-Za-z_0-9.]*)/gm, (match, token) => { return token })[1]
        return this.routeHash.includes(test) ? test : null
    }

    _tryNav(href) {
        console.log('_42 / Router / _tryNav')
        const url = this._createUrl(href)
        const routePath = this._findRoute(url.pathname)

        if (routePath && this.options.routes[routePath]) {
            if (this.options.type === "history") {
                window.history.pushState({ path: routePath }, routePath, url.origin + url.pathname)
            }
            this._triggerRouteChange(routePath, url)
            return true
        }
    }

    _createUrl(href) {
        console.log('_42 / Router / _createUrl')
        if (this.isHashRouter && href.startsWith("!")) { // was "#"
            href = href.substring(1)
        }
        return new URL(href, document.location.origin)
    }

    _onNavClick(e) { // handle click in document
        console.log('_42 / Router / _onNavClick')
        const href = e.target?.closest("[href]")?.href
        if (href && this._tryNav(href)) {
            e.preventDefault()
        }
    }

    /**
     * Makes the router navigate to the given route
     * @param {String} path 
     */
    setRoute(path) {
        console.log('_42 / Router / setRoute')
        if (!this._findRoute(path)) {
            throw TypeError("Invalid route")
        }
            
        let href = this.isHashRouter ? '#!' + path : document.location.origin + path;

        console.log('___ function setRoute = ' + href)

        history.replaceState(null, null, href)
        this._tryNav(href)
    }

    get isHashRouter() {
        console.log('_42 / Router / isHashRouter')
        return this.options.type === ROUTER_TYPES.hash
    }
}

export default Router
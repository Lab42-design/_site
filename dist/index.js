// imports
import PromiseDom from "./promiseDom.js";
import Router from "./router.js";
import FetchPartial from "./fetchPartial.js";
// check if dom is ready
let dom = new PromiseDom;
dom.ready.then(__start());
function __start() {
    console.log('---------------------');
    console.log(' dom is ready');
    console.log('---------------------');
    console.log(' starting');
    includePartials();
}
// router
const router = new Router({
    type: "hash",
    routes: {
        "/": "home",
        "/about": "about",
        "/products": "products"
    }
}).listen().on("route", async (e) => {
    console.log(e.detail.route, e.detail.url);
    document.querySelector("section").innerHTML = await fetch("/" + e.detail.route + ".html").then(x => x.text());
});
// partial
function includePartials() {
    console.log('---------------------');
    console.log(' including partials');
    const partial = new FetchPartial();
    partial.fetchAll();
}

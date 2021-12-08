/**
 *
 * document.readyStates = loading || interactive || complete
 *
 * usage
 *
 * let dom = new PromiseDom()
 *
 * dom.ready.then(() => start('one'))
 * dom.ready.then(() => start('two'))
 * etc...
 *
 * function start(message) {
 *     console.log('___ startup script: ', message)
 * }
 *
 */
class PromiseDom {
    constructor() {
        this.ready = new Promise(function (resolve, reject) {
            const _state = document.readyState;
            try {
                if (_state === 'interactive' || _state === 'complete') {
                    return Promise.resolve();
                }
                document.addEventListener('DOMContentLoaded', () => resolve(), false);
            }
            catch (error) {
                console.error(error);
            }
        });
        console.log('_42 / PromiseDom');
    }
}
export default PromiseDom;

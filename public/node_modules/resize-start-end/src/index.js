const mitt = require('mitt')
const debounce = require('lodash.debounce')

/** Resize: Listens for start and end of a series of window resize events
 *  @name resize
 *  @returns {Resize}
 */
module.exports = function resize ({debounceWaitTime = 200} = {}) {
  const emitter = mitt()
  const debounced = debounce(onEnd, debounceWaitTime)
  let state = false

  return {
    /**
     * Register a handler for the given type.
     *
     * @param  {String} type Type of event to listen for: 'start' or 'end'
     * @param  {Function} handler Function to call in response to given event
     * @memberOf resize
     */
    on (type, handler) {
      if (type !== 'start' && type !== 'end') {
        throw new Error(`Given type must be either 'start' or 'end'`)
      }

      listen(onStart)
      emitter.on(type, handler)
    },

    /**
     * Remove an event handler for the given type.
     *
     * @param  {String} type Type of event to unregister `handler` from
     * @param  {Function} handler Handler function to remove
     * @memberOf resize
     */
    off (type, handler) {
      if (type !== 'start' && type !== 'end') {
        throw new Error(`Given type must be either 'start' or 'end'`)
      }

      unlisten(onStart)
      emitter.off(type, handler)
    },

    /**
     * Check if the window is currently being resized.
     *
     * @returns {Boolean} True if the window is currently being resized
     * @memberOf resize
     */
    isResizing () {
      return state
    }
  }

  function listen (handler) {
    window.addEventListener('resize', handler)
  }

  function unlisten (handler) {
    window.removeEventListener('resize', handler)
  }

  function onStart () {
    emitter.emit('start')
    state = true
    unlisten(onStart)
    listen(debounced)
  }

  function onEnd () {
    emitter.emit('end')
    state = false
    unlisten(debounced.cancel)
    listen(onStart)
  }
}

/******/ var __webpack_modules__ = ({

/***/ "./node_modules/@ryze-digital/js-utilities/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@ryze-digital/js-utilities/index.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Base: () => (/* reexport safe */ _src_Base_js__WEBPACK_IMPORTED_MODULE_0__.Base),
/* harmony export */   BreakpointProvider: () => (/* reexport safe */ _src_BreakpointProvider_js__WEBPACK_IMPORTED_MODULE_1__.BreakpointProvider),
/* harmony export */   DateToInputConverter: () => (/* reexport safe */ _src_DateToInputConverter_js__WEBPACK_IMPORTED_MODULE_2__.DateToInputConverter),
/* harmony export */   DetectSticky: () => (/* reexport safe */ _src_DetectSticky_js__WEBPACK_IMPORTED_MODULE_3__.DetectSticky),
/* harmony export */   FontVerification: () => (/* reexport safe */ _src_FontVerification_js__WEBPACK_IMPORTED_MODULE_4__.FontVerification),
/* harmony export */   ReduceFunctionCalls: () => (/* reexport safe */ _src_ReduceFunctionCalls_js__WEBPACK_IMPORTED_MODULE_5__.ReduceFunctionCalls),
/* harmony export */   Selectors: () => (/* reexport safe */ _src_Selectors_js__WEBPACK_IMPORTED_MODULE_6__.Selectors)
/* harmony export */ });
/* harmony import */ var _src_Base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/Base.js */ "./node_modules/@ryze-digital/js-utilities/src/Base.js");
/* harmony import */ var _src_BreakpointProvider_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/BreakpointProvider.js */ "./node_modules/@ryze-digital/js-utilities/src/BreakpointProvider.js");
/* harmony import */ var _src_DateToInputConverter_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./src/DateToInputConverter.js */ "./node_modules/@ryze-digital/js-utilities/src/DateToInputConverter.js");
/* harmony import */ var _src_DetectSticky_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/DetectSticky.js */ "./node_modules/@ryze-digital/js-utilities/src/DetectSticky.js");
/* harmony import */ var _src_FontVerification_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./src/FontVerification.js */ "./node_modules/@ryze-digital/js-utilities/src/FontVerification.js");
/* harmony import */ var _src_ReduceFunctionCalls_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./src/ReduceFunctionCalls.js */ "./node_modules/@ryze-digital/js-utilities/src/ReduceFunctionCalls.js");
/* harmony import */ var _src_Selectors_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./src/Selectors.js */ "./node_modules/@ryze-digital/js-utilities/src/Selectors.js");










/***/ }),

/***/ "./node_modules/@ryze-digital/js-utilities/src/Base.js":
/*!*************************************************************!*\
  !*** ./node_modules/@ryze-digital/js-utilities/src/Base.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Base: () => (/* binding */ Base)
/* harmony export */ });
/**
 * Basis-Klasse zur einheitlichen Verwendung von Events und Optionen.
 * Jede Adventure-Komponente leitet von dieser Basis-Klasse ab.
 *
 * @example
 * export class Example extends adventure.Base {
 *     constructor () {
 *          const element = document.querySelector('.example');
 *
 *          this.on(element, 'click', (event) => {...});
 *     }
 * }
 */
class Base {
    /**
     * @param {object} defaultOptions
     * @param {object} options
     */
    constructor(defaultOptions, options) {
        this._defaultOptions = defaultOptions;
        this._options = options;
        this._eventListeners = new Map();
    }

    /**
     * @returns {object}
     */
    get options() {
        return {
            ...this._defaultOptions,
            ...this._options
        };
    }

    /**
     * @private
     * @param {object} selector
     * @returns {boolean}
     */
    _isNodeList(selector) {
        // eslint-disable-next-line
        return NodeList.prototype.isPrototypeOf(selector);
    }

    /**
     * @private
     * @param {Node} element
     * @param {string} eventName
     * @param {Function} callback
     */
    _attachEvent(element, eventName, callback) {
        if (this._eventListeners.has(element)) {
            this._eventListeners.get(element).push({
                [eventName]: callback
            });
        } else {
            this._eventListeners.set(element, [{
                [eventName]: callback
            }]);
        }
        element.addEventListener(eventName, callback);
    }

    /**
     * @private
     * @param {Node} element
     * @param {string} eventName
     * @param {Function} callback
     * @param {number} eventIndex - Es können gleichzeitig mehrere Listener für den gleichen eventName registriert sein.
     */
    _detachEvent(element, eventName, callback, eventIndex) {
        element.removeEventListener(eventName, callback);
        this._eventListeners.get(element).splice(eventIndex, 1);
    }

    /**
     * @private
     * @param {Node} element
     * @param {string} eventName
     */
    _detachEvents(element, eventName) {
        const allListenersForElement = this._eventListeners.get(element);

        allListenersForElement.forEach((listener, index) => {
            if (eventName === '') {
                this._detachEvent(element, Object.keys(listener)[0], Object.values(listener)[0], index);
            } else {
                const callback = listener[eventName];

                if (typeof callback === 'function') {
                    this._detachEvent(element, eventName, callback, index);
                }
            }
        });

        if (this._eventListeners.get(element).length === 0) {
            this._eventListeners.delete(element);
        }
    }

    /**
     * @param {string} name
     * @param {object} [data={}]
     * @param {Element} el
     */
    emitEvent(name = '', data = {}, el = this.options.el) {
        const event = new CustomEvent(name, {
            detail: data
        });

        el.dispatchEvent(event);
    }

    /**
     * Fügt einem oder mehreren Elementen ein Event hinzu.
     *
     * @param {Node|NodeList} selector
     * @param {string} eventName
     * @param {Function} callback
     */
    on(selector, eventName, callback) {
        // Todo: ermögliche Übergabe von Options (wie passive: true) für addEventlistener

        if (this._isNodeList(selector)) {
            selector.forEach((element) => {
                this._attachEvent(element, eventName, callback);
            });
        } else {
            this._attachEvent(selector, eventName, callback);
        }
    }

    /**
     * Entfernt einem Element oder mehreren Elementen das übergebene Event.
     *
     * @param {Node|NodeList} selector
     * @param {string} [eventName] - Kann ausgelassen werden, um alle Events zu entfernen.
     */
    off(selector, eventName = '') {
        if (this._isNodeList(selector)) {
            selector.forEach((element) => {
                this._detachEvents(element, eventName);
            });
        } else {
            this._detachEvents(selector, eventName);
        }
    }

    /**
     * Entfernt alle registrierten Events.
     */
    offAll() {
        this._eventListeners.forEach((allListenersForElement, element) => {
            this._detachEvents(element, '');
        });
    }
}

/***/ }),

/***/ "./node_modules/@ryze-digital/js-utilities/src/BreakpointProvider.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@ryze-digital/js-utilities/src/BreakpointProvider.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BreakpointProvider: () => (/* binding */ BreakpointProvider)
/* harmony export */ });
/**
 * Stellt in adventure-scss definierte Breakpoints im JavaScript zur Verfügung
 *
 * @example
 * const {breakpoints} = new adventure.BreakpointProvider();
 *
 * window.matchMedia(`(min-width: ${breakpoints.large})`).addListener(() => {...});
 */
class BreakpointProvider {
    /**
     * @param {HTMLElement} el
     * @param {string} pseudoElement
     */
    constructor(el = document.querySelector('html'), pseudoElement = 'after') {
        this._el = el;
        this._pseudoElement = pseudoElement;
        this._breakpoints = this._getBreakpoints();
    }

    /**
     * @private
     * @returns {string}
     */
    _getContentValue() {
        return window.getComputedStyle(this._el, `::${this._pseudoElement}`).getPropertyValue('content').replace(/['"]/g, '');
    }

    /**
     * @private
     * @returns {object}
     */
    _getBreakpoints() {
        const breakpointsString = this._getContentValue();
        const breakpoints = {};

        breakpointsString.split(',').forEach((keyValuePair) => {
            const breakpoint = keyValuePair.split(':');

            breakpoints[breakpoint[0]] = breakpoint[1];
        });

        return breakpoints;
    }

    /**
     * @returns {object}
     */
    get breakpoints() {
        return this._breakpoints;
    }
}

/***/ }),

/***/ "./node_modules/@ryze-digital/js-utilities/src/DateToInputConverter.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@ryze-digital/js-utilities/src/DateToInputConverter.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DateToInputConverter: () => (/* binding */ DateToInputConverter)
/* harmony export */ });
/**
 * Konvertiert ein Date-Objekt zur Verwendung mit input[type="date"] und input[type="time"]
 *
 * @example
 * const dateToInputConverter = new adventure.DateToInputConverter();
 *
 * document.querySelector('input[type="date"]').value = dateToInputConverter.date;
 */
class DateToInputConverter {
    constructor() {
        // eslint-disable-next-line prefer-rest-params
        this.dateObj = new Date(...arguments);
    }

    /**
     * @private
     * @param {number} number
     * @returns {string}
     */
    _prependLeadingZero(number) {
        let numberAsString = number.toString();

        if (number < 10) {
            numberAsString = `0${number}`;
        }

        return numberAsString;
    }

    /**
     * @returns {string}
     */
    get date() {
        return this.dateObj.toISOString().substr(0, 10);
    }

    /**
     * @returns {string}
     */
    get hours() {
        const hours = this.dateObj.getHours();

        return this._prependLeadingZero(hours);
    }

    /**
     * @returns {string}
     */
    get minutes() {
        const minutes = this.dateObj.getMinutes();

        return this._prependLeadingZero(minutes);
    }

    /**
     * @returns {string}
     */
    get time() {
        return `${this.hours}:${this.minutes}`;
    }
}

/***/ }),

/***/ "./node_modules/@ryze-digital/js-utilities/src/DetectSticky.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@ryze-digital/js-utilities/src/DetectSticky.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DetectSticky: () => (/* binding */ DetectSticky)
/* harmony export */ });
/**
 * Setzt Klasse während ein Element "sticky" ist
 *
 * @see https://davidwalsh.name/detect-sticky
 * @example
 * const element = document.getElementById('id');
 *
 * new adventure.DetectSticky(element);
 */
class DetectSticky {
    /**
     * @param {HTMLElement} el
     */
    constructor(el) {
        this._el = el;
        this._observer = this._getObserver();

        this._el.style.top = '-1px';

        this._observer.observe(this._el);
    }

    /**
     * @private
     * @returns {IntersectionObserver}
     */
    _getObserver() {
        return new IntersectionObserver(([{ target, intersectionRatio }]) => {
            target.classList.toggle('is-sticky', intersectionRatio < 1);
        }, {
            threshold: [1]
        });
    }

    /**
     * @returns {IntersectionObserver}
     */
    get observer() {
        return this._observer;
    }
}

/***/ }),

/***/ "./node_modules/@ryze-digital/js-utilities/src/FontVerification.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@ryze-digital/js-utilities/src/FontVerification.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FontVerification: () => (/* binding */ FontVerification)
/* harmony export */ });
/**
 * Verifiziert ein Fonts.net Projekt asynchron
 *
 * @example
 * new adventure.FontVerification('your fonts.net project ID');
 */
class FontVerification {
    /**
     * @param {string} projectId
     * @param {string} baseUrl
     */
    constructor(projectId, baseUrl = 'fast.fonts.net/t/1.css?apiType=css&projectid=') {
        this._projectId = projectId;
        this._baseUrl = baseUrl;

        if (document.readyState !== 'loading') {
            this._createVerificationTag();

            return;
        }

        document.addEventListener('DOMContentLoaded', this._createVerificationTag);
    }

    /**
     *  @private
     */
    _createVerificationTag() {
        const linkTag = document.createElement('link');
        const url = `https://${this._baseUrl}${this._projectId}`;

        linkTag.rel = 'stylesheet';
        linkTag.media = 'all';
        linkTag.href = url;

        document.body.appendChild(linkTag);
    }
}

/***/ }),

/***/ "./node_modules/@ryze-digital/js-utilities/src/ReduceFunctionCalls.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@ryze-digital/js-utilities/src/ReduceFunctionCalls.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ReduceFunctionCalls: () => (/* binding */ ReduceFunctionCalls)
/* harmony export */ });
/**
 * Reduziert Funktionsaufrufe
 *
 * @example
 * window.addEventListener('resize', adventure.ReduceFunctionCalls.throttle(() => {...}));
 */
class ReduceFunctionCalls {
    /**
     * @param {Function} callback
     * @param {number} delay
     * @param {object} scope
     * @param {Array} args
     * @returns {Function}
     * @see https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf
     */
    static throttle(callback, delay = 250, scope = this, ...args) {
        let timeout;
        let lastRan;

        return () => {
            if (!lastRan) {
                callback.apply(scope, args);
                lastRan = Date.now();
            } else {
                clearTimeout(timeout);

                timeout = setTimeout(() => {
                    if ((Date.now() - lastRan) >= delay) {
                        callback.apply(scope, args);
                        lastRan = Date.now();
                    }
                }, delay - (Date.now() - lastRan));
            }
        };
    }

    /**
     * @param {Function} callback
     * @param {number} delay
     * @param {object} scope
     * @param {Array} args
     * @returns {Function}
     * @see https://davidwalsh.name/javascript-debounce-function
     */
    static debounce(callback, delay = 250, scope = this, ...args) {
        let timeout;

        return () => {
            const debouncedCallback = () => {
                timeout = null;

                callback.apply(scope, args);
            };

            clearTimeout(timeout);

            timeout = setTimeout(debouncedCallback, delay);
        };
    }
}

/***/ }),

/***/ "./node_modules/@ryze-digital/js-utilities/src/Selectors.js":
/*!******************************************************************!*\
  !*** ./node_modules/@ryze-digital/js-utilities/src/Selectors.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Selectors: () => (/* binding */ Selectors)
/* harmony export */ });
/**
 * DOM-Zugriffe, die nicht mit CSS möglich sind
 *
 * @example
 * document.querySelector('button').addEventListener('click', (event) => {
 *     const siblings = adventure.Selectors.siblings(event.target);
 * });
 */
class Selectors {
    /**
     *
     * @param {HTMLElement} element
     * @returns {Array}
     */
    static siblings(element) {
        return [...element.parentElement.children].filter((siblings) => {
            return siblings !== element;
        });
    }
}

/***/ }),

/***/ "./src/scripts/Accordion.js":
/*!**********************************!*\
  !*** ./src/scripts/Accordion.js ***!
  \**********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Accordion: () => (/* binding */ Accordion)
/* harmony export */ });
/* harmony import */ var _ryze_digital_js_utilities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ryze-digital/js-utilities */ "./node_modules/@ryze-digital/js-utilities/index.js");
/* harmony import */ var _AccordionItem_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AccordionItem.js */ "./src/scripts/AccordionItem.js");



/**
 * Erweitert das details-Element um Funktionen wie Deep Linking und Animationen.
 */
class Accordion extends _ryze_digital_js_utilities__WEBPACK_IMPORTED_MODULE_0__.Base {
    /**
     *
     * @param {Object} options
     * @param {HTMLElement} [options.el=document.querySelector('[data-accordion]')]
     * @param {Boolean} [options.allowMultipleOpened=false]
     * @param {Boolean} [options.allowDeepLink=true]
     * @param {Object} [options.animation]
     * @param {Number} [options.animation.duration=400]
     * @param {String} [options.animation.easing='ease-out']
     */
    constructor (options = {}) {
        super({
            el: document.querySelector('[data-accordion]'),
            allowMultipleOpened: false,
            allowDeepLink: true,
            animation: {
                duration: 400,
                easing: 'ease-out'
            }
        }, options);

        if (this._getOpenedChildren().length > 1) {
            this.options.allowMultipleOpened = true;
        }
    }
    /**
     *
     * @method init
     * @fires Accordion#afterInit
     * @public
     */
    init () {
        this.accordionItems = [];
        Array.from(this._getChildren()).forEach((child) => {
            const accordionItemInstance = new _AccordionItem_js__WEBPACK_IMPORTED_MODULE_1__.AccordionItem({
                accordion: this,
                el: child
            });

            this.accordionItems.push(accordionItemInstance);
        });

        if (this.options.allowDeepLink) {
            this._initByDeepLink();
        }

        /**
         * @event Accordion#afterInit
         */
        this.emitEvent('afterInit');
    }
    /**
     *
     * @private
     */
    _initByDeepLink () {
        const accordionItem = this._getDeepLinkedItem();

        if (!accordionItem) {
            return;
        }

        this.closeAllItems();
        accordionItem.open();
        this._scrollIntoView(accordionItem.el);
    }
    /**
     *
     * @method openAllItems
     * @public
     */
    openAllItems () {
        if (!this.options.allowMultipleOpened) {
            return;
        }

        this.accordionItems.forEach((accordionItem) => {
            accordionItem.open();
        });
    }
    /**
     *
     * @method closeAllItems
     * @public
     */
    closeAllItems () {
        this.accordionItems.forEach((accordionItem) => {
            accordionItem.close();
        });
    }
    /**
     *
     * Öffnet ein bestimmtes Item des Akkordeons.
     * @method open
     * @param {HTMLElement} el
     * @param {Boolean} updateUrl
     * @fires Accordion#beforeItemOpen
     * @fires Accordion#afterItemOpen
     * @public
     */
    open (el, updateUrl = false) {
        /**
         * @event Accordion#beforeItemOpen
         * @type {object}
         * @property {HTMLElement} el - Das HTMLElement, welches geöffnet wird
         */
        this.emitEvent('beforeItemOpen', {el});
        this.expand(el);

        if (this.options.allowDeepLink && updateUrl && el.id) {
            this._updateUrl(`#${el.id}`);
        }

        /**
         * @event Accordion#afterItemOpen
         * @type {object}
         * @property {HTMLElement} el - Das HTMLElement, welches geöffnet wurde
         */
        this.emitEvent('afterItemOpen', {el});
    }
    /**
     *
     * Schließt ein bestimmtes Item des Akkordeons.
     * @method close
     * @param {HTMLElement} el
     * @fires Accordion#beforeItemClose
     * @fires Accordion#afterItemClose
     * @public
     */
    close (el) {
        /**
         * @event Accordion#beforeItemClose
         * @type {object}
         * @property {HTMLElement} el - Das HTMLElement, welches geschlossen wird
         */
        this.emitEvent('beforeItemClose', {el});
        this.shrink(el);

        if (this.options.allowDeepLink) {
            this._updateUrl();
        }

        /**
         * @event Accordion#afterItemClose
         * @type {object}
         * @property {HTMLElement} el - Das HTMLElement, welches geschlossen wurde
         */
        this.emitEvent('afterItemClose', {el});
    }
    /**
     *
     * Startet die Schließen-Animation für ein bestimmtes Item.
     * Überschreibe diese Methode, wenn eigene Schließen-Animation gewünscht ist
     * @method shrink
     * @param {HTMLElement} el
     * @public
     */
    shrink (el) {
        // "open" Attribut erforderlich, sodass Akkordeon-Inhalt für Animation sichtbar ist; denn Browser verstecken den Akkordeon-Inhalt sofort, wenn das "open" Attribut auf dem "details" Element fehlt
        el.open = true;

        const accordionItem = this.getItemByElement(el);
        const startHeight = `${accordionItem.title.offsetHeight + accordionItem.content.offsetHeight}px`;
        const endHeight = `${accordionItem.title.offsetHeight}px`;

        this._animate(accordionItem, startHeight, endHeight);
    }
    /**
     *
     * Startet die Öffnen-Animation für ein bestimmtes Item.
     * Überschreibe diese Methode, wenn eigene Öffnen-Animation gewünscht ist
     * @method expand
     * @param {HTMLElement} el
     * @public
     */
    expand (el) {
        // "open" Attribut erforderlich, sodass Akkordeon-Inhalt für Animation sichtbar ist; denn Browser verstecken den Akkordeon-Inhalt sofort, wenn das "open" Attribut auf dem "details" Element fehlt
        el.open = true;

        const accordionItem = this.getItemByElement(el);
        const startHeight = `${accordionItem.title.offsetHeight}px`;
        const endHeight = `${accordionItem.title.offsetHeight + accordionItem.content.offsetHeight}px`;

        el.style.height = startHeight;

        this._animate(accordionItem, startHeight, endHeight);
    }
    /**
     *
     * @method destroy
     * @fires Accordion#beforeDestroy
     * @fires Accordion#afterDestroy
     * @public
     */
    destroy () {
        /**
         * @event Accordion#beforeDestroy
         */
        this.emitEvent('beforeDestroy');
        this.offAll();
        this.accordionItems.forEach((accordionItem) => {
            accordionItem.destroy();
        });

        /**
         * @event Accordion#afterDestroy
         */
        this.emitEvent('afterDestroy');
    }
    /**
     *
     * @param {AccordionItem} item
     * @param {String} startHeight - Höhe beim Start der Animation (muss Einheit, z.B. "px", enthalten).
     * @param {String} endHeight - Gewünschte Höhe nach der Animation (muss Einheit, z.B. "px", enthalten).
     * @fires Accordion#afterItemAnimationFinish
     * @fires Accordion#afterItemAnimationCancel
     * @private
     */
    _animate (item, startHeight, endHeight) {
        item.isAnimating = true;

        if (item.animation) {
            item.animation.cancel();
        }

        item.animation = item.el.animate({
            height: [startHeight, endHeight]
        }, this.options.animation);

        item.animation.onfinish = () => {
            item.resetItemStates(item.isOpen);

            /**
             * @event Accordion#afterItemAnimationFinish
             * @type {object}
             * @property {HTMLElement} el - Das HTMLElement, auf welchem die Animation ausgeführt wurde
             */
            this.emitEvent('afterItemAnimationFinish', {el: item.el});
        };

        item.animation.oncancel = () => {
            item.resetAnimationStates();

            /**
             * @event Accordion#afterItemAnimationCancel
             * @type {object}
             * @property {HTMLElement} el - Das HTMLElement, auf welchem die Animation abgebrochen wurde
             */
            this.emitEvent('afterItemAnimationCancel', {el: item.el});
        };
    }
    /**
     *
     * @method getItemByElement
     * @param {HTMLElement} el
     * @returns {AccordionItem}
     * @public
     */
    getItemByElement (el) {
        const currentItemIndex = Array.from(this.options.el.children).indexOf(el);

        return this.accordionItems.filter((accordionItem, accordionItemIndex) => {
            return accordionItemIndex === currentItemIndex;
        })[0];
    }
    /**
     *
     * @param {HTMLElement} el
     * @private
     */
    _scrollIntoView (el) {
        el.scrollIntoView({
            behavior: 'smooth'
        });
    }
    /**
     *
     * @returns {AccordionItem}
     * @private
     */
    _getDeepLinkedItem () {
        return this.accordionItems.filter((accordionItem) => {
            return window.location.hash === `#${accordionItem.el.id}`;
        })[0];
    }
    /**
     *
     * @param {String} [hash=window.location.pathname]
     * @private
     */
    _updateUrl (hash = window.location.pathname) {
        window.history.replaceState(null, null, hash);
    }
    /**
     *
     * @returns {HTMLCollection}
     * @private
     */
    _getChildren () {
        return this.options.el.children;
    }
    /**
     *
     * @returns {Array}
     * @private
     */
    _getOpenedChildren () {
        const children = Array.from(this._getChildren());

        return children.filter((child) => {
            return child.open;
        });
    }
}

/***/ }),

/***/ "./src/scripts/AccordionItem.js":
/*!**************************************!*\
  !*** ./src/scripts/AccordionItem.js ***!
  \**************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AccordionItem: () => (/* binding */ AccordionItem)
/* harmony export */ });
/* harmony import */ var _ryze_digital_js_utilities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ryze-digital/js-utilities */ "./node_modules/@ryze-digital/js-utilities/index.js");


/**
 * Enthält States und Events eines einzelnen Akkordeon Items.
 * @ignore
 */
class AccordionItem extends _ryze_digital_js_utilities__WEBPACK_IMPORTED_MODULE_0__.Base {
    /**
     * @param {Object} options
     * @param {Accordion} options.accordion
     * @param {HTMLElement} options.el
     */
    constructor (options = {}) {
        super({}, options);

        this._isOpen = false;
        this._title = this.el.querySelector('[data-title]');
        this._content = this.el.querySelector('[data-content]');

        this._bindEvents();
    }
    /**
     * @private
     */
    _bindEvents () {
        this.on(this._title, 'click', (event) => {
            event.preventDefault();

            this.toggle();
        });
    }
    toggle () {
        if (!this.isAnimating && !this.el.open) {
            if (!this.options.accordion.options.allowMultipleOpened) {
                this.options.accordion.closeAllItems();
            }

            this.open(true);

            return;
        }

        this.close();
    }
    /**
     * @param {Boolean} updateUrl
     */
    open (updateUrl = false) {
        this._isOpen = true;
        this.el.open = true;
        this.options.accordion.open(this.el, updateUrl);
    }
    close () {
        if (!this.el.open) {
            return;
        }

        this._isOpen = false;
        this.el.open = false;
        this.options.accordion.close(this.el);
    }
    destroy () {
        if (this.animation) {
            this.animation.cancel();
        }

        this.offAll();
    }
    /**
     * @param {Boolean} isOpen
     */
    resetItemStates (isOpen) {
        this.isAnimating = false;
        this.el.open = isOpen;
        this.el.style.height = '';
        this.animation = null;
    }
    resetAnimationStates () {
        this.isAnimating = false;
        this.animation = null;
    }
    get isOpen () {
        return this._isOpen;
    }
    get title () {
        return this._title;
    }
    get content () {
        return this._content;
    }
    get el () {
        return this.options.el;
    }
}

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
/*!******************!*\
  !*** ./index.js ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Accordion: () => (/* reexport safe */ _src_scripts_Accordion_js__WEBPACK_IMPORTED_MODULE_0__.Accordion)
/* harmony export */ });
/* harmony import */ var _src_scripts_Accordion_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/scripts/Accordion.js */ "./src/scripts/Accordion.js");



var __webpack_exports__Accordion = __webpack_exports__.Accordion;
export { __webpack_exports__Accordion as Accordion };

import { Base } from '@ryze-digital/js-utilities';
import { AccordionItem } from './AccordionItem.js';

/**
 * Erweitert das details-Element um Funktionen wie Deep Linking und Animationen.
 */
export class Accordion extends Base {
    /**
     * @type {boolean}
     */
    #isExclusive = false;

    /**
     * @type {Array}
     */
    #children;

    /**
     *
     * @param {object} options
     * @param {HTMLElement} [options.el]
     * @param {boolean} [options.allowMultipleOpened]
     * @param {boolean} [options.allowDeepLink]
     * @param {object} [options.animation]
     * @param {number} [options.animation.duration]
     * @param {string} [options.animation.easing]
     */
    constructor(options = {}) {
        super({
            el: document.querySelector('[data-accordion]'),
            allowDeepLink: true,
            animation: {
                duration: 400,
                easing: 'ease-out'
            }
        }, options);

        this.#children = Array.from(this.options.el.children);
        this.#isExclusive = this.#hasSameNames();
    }

    /**
     * @returns {boolean}
     */
    #hasSameNames() {
        const names = this.#children.map((details) => {
            return details.getAttribute('name');
        });

        return names.every((name, index, array) => {
            return name === array[0] && name !== null;
        });
    }

    /**
     *
     * @function init
     * @fires Accordion#afterInit
     * @public
     */
    init() {
        this.accordionItems = [];
        this.#children.forEach((child) => {
            const accordionItemInstance = new AccordionItem({
                accordion: this,
                el: child
            }, this.#isExclusive);

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
    _initByDeepLink() {
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
     * @function openAllItems
     * @public
     */
    openAllItems() {
        if (this.#isExclusive) {
            return;
        }

        this.accordionItems.forEach((accordionItem) => {
            accordionItem.open();
        });
    }

    /**
     *
     * @function closeAllItems
     * @public
     */
    closeAllItems() {
        this.accordionItems.forEach((accordionItem) => {
            accordionItem.close();
        });
    }

    /**
     *
     * Öffnet ein bestimmtes Item des Akkordeons.
     * @function open
     * @param {HTMLElement} el
     * @param {boolean} updateUrl
     * @fires Accordion#beforeItemOpen
     * @fires Accordion#afterItemOpen
     * @public
     */
    open(el, updateUrl = false) {
        /**
         * @event Accordion#beforeItemOpen
         * @type {object}
         * @property {HTMLElement} el - Das HTMLElement, welches geöffnet wird
         */
        this.emitEvent('beforeItemOpen', { el });
        this.expand(el);

        if (this.options.allowDeepLink && updateUrl && el.id) {
            this._updateUrl(`#${el.id}`);
        }

        /**
         * @event Accordion#afterItemOpen
         * @type {object}
         * @property {HTMLElement} el - Das HTMLElement, welches geöffnet wurde
         */
        this.emitEvent('afterItemOpen', { el });
    }

    /**
     *
     * Schließt ein bestimmtes Item des Akkordeons.
     * @function close
     * @param {HTMLElement} el
     * @fires Accordion#beforeItemClose
     * @fires Accordion#afterItemClose
     * @public
     */
    close(el) {
        /**
         * @event Accordion#beforeItemClose
         * @type {object}
         * @property {HTMLElement} el - Das HTMLElement, welches geschlossen wird
         */
        this.emitEvent('beforeItemClose', { el });
        this.shrink(el);

        if (this.options.allowDeepLink) {
            this._updateUrl();
        }

        /**
         * @event Accordion#afterItemClose
         * @type {object}
         * @property {HTMLElement} el - Das HTMLElement, welches geschlossen wurde
         */
        this.emitEvent('afterItemClose', { el });
    }

    /**
     *
     * Startet die Schließen-Animation für ein bestimmtes Item.
     * Überschreibe diese Methode, wenn eigene Schließen-Animation gewünscht ist
     * @function shrink
     * @param {HTMLElement} el
     * @public
     */
    shrink(el) {
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
     * @function expand
     * @param {HTMLElement} el
     * @public
     */
    expand(el) {
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
     * @function destroy
     * @fires Accordion#beforeDestroy
     * @fires Accordion#afterDestroy
     * @public
     */
    destroy() {
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
     * @param {string} startHeight - Höhe beim Start der Animation (muss Einheit, z.B. "px", enthalten).
     * @param {string} endHeight - Gewünschte Höhe nach der Animation (muss Einheit, z.B. "px", enthalten).
     * @fires Accordion#afterItemAnimationFinish
     * @fires Accordion#afterItemAnimationCancel
     * @private
     */
    _animate(item, startHeight, endHeight) {
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
            this.emitEvent('afterItemAnimationFinish', { el: item.el });
        };

        item.animation.oncancel = () => {
            item.resetAnimationStates();

            /**
             * @event Accordion#afterItemAnimationCancel
             * @type {object}
             * @property {HTMLElement} el - Das HTMLElement, auf welchem die Animation abgebrochen wurde
             */
            this.emitEvent('afterItemAnimationCancel', { el: item.el });
        };
    }

    /**
     *
     * @function getItemByElement
     * @param {HTMLElement} el
     * @returns {AccordionItem}
     * @public
     */
    getItemByElement(el) {
        const currentItemIndex = this.#children.indexOf(el);

        return this.accordionItems.filter((accordionItem, accordionItemIndex) => {
            return accordionItemIndex === currentItemIndex;
        })[0];
    }

    /**
     *
     * @param {HTMLElement} el
     * @private
     */
    _scrollIntoView(el) {
        el.scrollIntoView({
            behavior: 'smooth'
        });
    }

    /**
     *
     * @returns {AccordionItem}
     * @private
     */
    _getDeepLinkedItem() {
        return this.accordionItems.filter((accordionItem) => {
            return window.location.hash === `#${accordionItem.el.id}`;
        })[0];
    }

    /**
     *
     * @param {string} [hash]
     * @private
     */
    _updateUrl(hash = window.location.pathname) {
        window.history.replaceState(null, null, hash);
    }

    /**
     *
     * @returns {Array}
     * @private
     */
    _getOpenedChildren() {
        return this.#children.filter((child) => {
            return child.open;
        });
    }
}
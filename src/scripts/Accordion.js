import {Base} from '@ryze-digital/js-utilities';
import {AccordionItem} from './AccordionItem.js';

/**
 * Erweitert das details-Element um Funktionen wie Deep Linking und Animationen.
 */
export class Accordion extends Base {
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
            const accordionItemInstance = new AccordionItem({
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
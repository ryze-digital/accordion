import { Base } from '@ryze-digital/js-utilities';

/**
 * Enthält States und Events eines einzelnen Akkordeon Items.
 * @ignore
 */
export class AccordionItem extends Base {
    /**
     * @param {object} options
     * @param {Accordion} options.accordion
     * @param {HTMLElement} options.el
     */
    constructor(options = {}) {
        super({}, options);

        this._isOpen = false;
        this._title = this.el.querySelector('[data-title]');
        this._content = this.el.querySelector('[data-content]');

        this._bindEvents();
    }

    /**
     * @private
     */
    _bindEvents() {
        this.on(this._title, 'click', (event) => {
            event.preventDefault();

            this.toggle();
        });
    }

    toggle() {
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
     * @param {boolean} updateUrl
     */
    open(updateUrl = false) {
        this._isOpen = true;
        this.el.open = true;
        this.options.accordion.open(this.el, updateUrl);
    }

    close() {
        if (!this.el.open) {
            return;
        }

        this._isOpen = false;
        this.el.open = false;
        this.options.accordion.close(this.el);
    }

    destroy() {
        if (this.animation) {
            this.animation.cancel();
        }

        this.offAll();
    }

    /**
     * @param {boolean} isOpen
     */
    resetItemStates(isOpen) {
        this.isAnimating = false;
        this.el.open = isOpen;
        this.el.style.height = '';
        this.animation = null;
    }

    resetAnimationStates() {
        this.isAnimating = false;
        this.animation = null;
    }

    get isOpen() {
        return this._isOpen;
    }

    get title() {
        return this._title;
    }

    get content() {
        return this._content;
    }

    get el() {
        return this.options.el;
    }
}
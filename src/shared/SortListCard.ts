import { css, CSSResultGroup, html, LitElement, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LovelaceCardConfig } from "../types/homeassistant/data/lovelace/config/card";
import { SortItem } from '../types/strategy/strategy-model'
import Sortable from "sortablejs";
import { repeat } from 'lit/directives/repeat.js';
import { localize } from "../utilities/localize";
import { ActionConfig } from "../types/homeassistant/data/lovelace/config/action";



@customElement('chuguan-sort-list')
export class SortListCard extends LitElement {
    @property({ type: String }) title: string = ''
    @property({ type: String }) event: string = ''
    @property({ type: Object }) action: ActionConfig = { action: 'none' }
    @property({ type: Array })
    list: SortItem[] = [];
    sortable?: Sortable

    constructor() {
        super();
        addDragClass()
    }

    setConfig(config: LovelaceCardConfig) {
        console.log(config)
        this.list = config.list || [];
        this.title = config.title || ''
        this.event = config.event || ''
        this.action = config.action || { action: 'none' }
    }

    connectedCallback(): void {
        super.connectedCallback();
        this.setupSortable();
    }

    setupSortable() {
        if (this.sortable) return;
        const sortList = this.renderRoot.querySelector('.chuguan-sort-list');
        if (!sortList) {
            setTimeout(() => {
                this.setupSortable();
            }, 10);
            return;
        }
        this.sortable = new Sortable(sortList as HTMLElement, {
            scroll: true,
            scrollSensitivity: 100,
            scrollSpeed: 3,
            bubbleScroll: false,
            forceAutoScrollFallback: true,
            forceFallback: true,
            fallbackOnBody: true,
            swapThreshold: 1,
            animation: 150,
            easing: "cubic-bezier(1, 0, 0, 1)",
            delay: 150,
            delayOnTouchOnly: true,
            draggable: '.chuguan-sort-item',
            handle: '.sort-item-drag',
            filter: '.sort-item-visibility-toggle',
            preventOnFilter: false,
            ghostClass: 'sortable-ghost',
            dragClass: 'sortable-drag',
            chosenClass: 'sortable-chosen',
            fallbackClass: 'sortable-fallback',
            onStart: (evt) => {
            },
            onEnd: (evt) => {
                const from = evt.oldDraggableIndex
                const to = evt.newDraggableIndex
                if (from == undefined || to == undefined || from == to) {
                    return
                }
                const item = this.list.splice(from, 1)[0]
                this.list.splice(to, 0, item)
                this.list.forEach((item, index) => {
                    item.order = index
                })
            },
        });
    }

    clickItem(element: SortItem) {
        const newList = this.list.map((item) => ({
            ...item,
            visible: item.id === element.id ? !item.visible : item.visible
        }))
        this.list = newList
    }

    clickSave() {
        if (this.action.action != 'none') {
            const detail = {
                config: {
                    tap_action: this.action
                },
                action: 'tap'
            }
            const ce = new CustomEvent('hass-action', { detail, bubbles: true, composed: true });
            this.dispatchEvent(ce);
        }
        if (this.event) {
            this.dispatchEvent(new CustomEvent(this.event, {
                detail: this.list,
                bubbles: true,
                composed: true
            }))
        }
    }

    protected render(): TemplateResult {
        return html`
            <div>
                <ha-card>
                    <div class="chuguan-sort-list-title">${this.title}</div>
                    <div class="chuguan-sort-list">
                        ${repeat(
            this.list,
            (item) => item.id, // 👈 必须是稳定唯一的 key
            (item) => html`
                            <div class="chuguan-sort-item ${item.visible ? 'visible' : 'hidden'}">
                                <button class="sort-item-visibility-toggle ${item.visible ? 'visible' : 'hidden'}" @click="${() => this.clickItem(item)}">
                                    <ha-icon icon="${item.visible ? 'mdi:eye' : 'mdi:eye-off'}"></ha-icon>
                                </button>
                                <div class="sort-item-info">
                                    <span class="sort-item-name">${item.name}</span>
                                </div>
                                <div class="sort-item-drag">
                                    <ha-icon icon="mdi:menu"></ha-icon>
                                </div>
                            </div>
                        `
        )}
                    </div>
                </ha-card>
                <ha-card style="margin-top: 10px;">
                    <button class="save-button" @click="${() => this.clickSave()}">
                        <span>${localize('setting.save')}</span>
                    </button>
                </ha-card>
            </div>
            
    `;
    }

    static get styles(): CSSResultGroup {
        return css`
                .chuguan-sort-list-title {
                    font-size: 16px;
                    font-weight: 500;
                    color: var(--primary-text-color);
                    text-align: center;
                    line-height: 36px;
                }
                    .save-button {
                        line-height: 1;
                        padding: 16px;
                        color: var(--primary-color);
                        background-color: unset;
                        border: none;
                        width: 100%;
                        font-size: 16px;
                        font-weight: 500;
                    }
                    .save-button:active {
                        opacity: 0.5;
                    }
            .chuguan-sort-list {
                padding: 16px;
                .chuguan-sort-item {
                    display: flex;
                    align-items: center;
                    padding: 6px 12px;
                    border-bottom: 0.5px solid var(--secondary-background-color);
                    user-select: none;
                    -webkit-user-select: none;
                    transition: background 0.2s ease;
                }
                .chuguan-sort-item:last-child {
                    border-bottom: none;
                }
                .chuguan-sort-item.hidden {
                    opacity: 0.5;
                }
                .sort-item-visibility-toggle {
                    background: none;
                    border: none;
                    color: var(--primary-text-color);
                    cursor: pointer;
                    border-radius: 16px;
                    transition: all 0.2s ease;
                    margin-right: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    -webkit-tap-highlight-color: transparent;
                    touch-action: manipulation;
                    user-select: none;
                    -webkit-user-select: none;
                }
                .sort-item-visibility-toggle:active {
                    // opacity: 0.5;
                }
                .sort-item-visibility-toggle * {
                    pointer-events: none;
                    user-select: none;
                    -webkit-user-select: none;
                }
                .sort-item-visibility-toggle.hidden {
                    color: var(--secondary-text-color);
                }
                .sort-item-info {
                    flex: 1;
                    min-width: 0;
                }
                .sort-item-name {
                    font-size: 14px;
                    font-weight: 500;
                    display: block;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .chuguan-sort-item.hidden .sort-item-name {
                    color: var(--secondary-text-color);
                }
                .sort-item-drag {
                    color: var(--primary-text-color);
                    cursor: grab;
                    padding: 8px;
                    margin: -8px;
                    touch-action: none;
                }
                .chuguan-sort-item.hidden .sort-item-drag {
                    color: var(--secondary-text-color);
                }
                .sort-item-drag:active {
                    cursor: grabbing;
                }
                .sort-item-drag * {
                    pointer-events: none;
                    user-select: none;
                    -webkit-user-select: none;
                }
                .chuguan-sort-item.dragging {
                    background: rgba(44, 44, 46, 1);
                    transform: scale(1.02);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    z-index: 1000;
                }
                .chuguan-sort-item.drag-over {
                    border-top: 2px solid #ffaf00;
                }
                .sortable-ghost {
                    opacity: 0 !important;
                }
                .chuguan-sort-item.sortable-chosen {
                    background: var(--secondary-background-color) !important;
                }
                .chuguan-sort-item.sortable-fallback,.sortable-fallback {
                    opacity: 1 !important;
                    visibility: visible !important;
                    display: flex !important;
                }
            }
            
        `;
    }
}

function addDragClass() {
    const query = document.querySelector('chuguan-sort-list-drag-class')
    if (query) return
    const style = document.createElement('style')
    style.id = 'chuguan-sort-list-drag-class'
    style.textContent = `
            .chuguan-sort-item {
                display: flex;
                align-items: center;
                padding: 6px 12px;
                user-select: none;
                -webkit-user-select: none;
                transition: background 0.2s ease;
                background: var(--secondary-background-color);
                opacity: 1;

                .sort-item-visibility-toggle {
                    background: none;
                    border: none;
                    color: var(--primary-text-color);
                    cursor: pointer;
                    border-radius: 16px;
                    transition: all 0.2s ease;
                    margin-right: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    -webkit-tap-highlight-color: transparent;
                    touch-action: manipulation;
                    user-select: none;
                    -webkit-user-select: none;
                }
                    .sort-item-info {
                    flex: 1;
                    min-width: 0;
                }
                .sort-item-name {
                    font-size: 14px;
                    font-weight: 500;
                    display: block;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                    .sort-item-drag {
                    color: var(--primary-text-color);
                    cursor: grab;
                    padding: 8px;
                    margin: -8px;
                    touch-action: none;
                }
            }
            .chuguan-sort-item.hidden {
                opacity: 0.5 !important;
                color: var(--secondary-text-color);
                .sort-item-name {
                    color: var(--secondary-text-color);
                }
                .sort-item-drag {
                    color: var(--secondary-text-color);
                }
            }
            .chuguan-sort-item.hidden .sort-item-name {
                color: var(--secondary-text-color);
            }
            .chuguan-sort-item.hidden .sort-item-drag {
                color: var(--secondary-text-color);
            }
    `
    document.head.appendChild(style)
}


import { CSSResultGroup, LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { HomeAssistant } from '../types/homeassistant/types'
import { Registry } from '../Registry'
import { EntityRegistryEntry } from '../types/homeassistant/data/entity_registry'
import { computeDomain } from '../types/homeassistant/data/icons'
import { ENTITY_COMPONENT_ICONS } from '../types/homeassistant/data/entity_component_icons'
import { localize } from '../utilities/localize'

interface EntityItem {
  entity_id: string
  name: string
  icon: string
}



type ComboBoxLitRenderer<T> = (item: T, index: number) => any

@customElement('chuguan-favorite-dialog')
export class FavoriteDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant
  @property({ type: Boolean }) public open = false

  @state() private _favoriteEntities: EntityRegistryEntry[] = []
  @state() private _newEntityId: string = ''

  @state() private _config: any

  private _rowRenderer: ComboBoxLitRenderer<EntityRegistryEntry> = (item: EntityRegistryEntry) => {
    const state = Registry.hassStates[item.entity_id]
    const name = this._getEntityName(item).trim()
    return  html`<ha-list-item graphic="avatar" .twoline=${true}>
      ${state.state
        ? html`<state-badge
            slot="graphic"
            .stateObj=${state}
            .hass=${this.hass}
          ></state-badge>`
        : ""}
      <span>${name}</span>
      <span slot="secondary">${item.entity_id}</span>
    </ha-list-item>`
  }
   

  private _getEntityIcon(entityId: string): string {
    const domain = computeDomain(entityId)
    const domainIcons = ENTITY_COMPONENT_ICONS[domain]
    
    if (domainIcons) {
      // 返回默认图标
      return domainIcons._.default
    }
    
    // 如果找不到，返回默认图标
    return 'mdi:help-circle'
  }

  setConfig(config: any) {
    this._config = config
  }

  connectedCallback() {
    super.connectedCallback()
    this._loadFavorites()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
  }

  public openDialog() {
    this.open = true
    this._loadFavorites()
    this._newEntityId = ''
  }

  attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
    if (name === 'open' && newVal === 'true') {
      this._loadFavorites()
      this._newEntityId = ''
    }
  }

  private _loadFavorites() {
    const favoriteIds = Registry.strategyOptions.favorite_entities || []
    this._favoriteEntities = favoriteIds
      .map(id => Registry.entities.find(e => e.entity_id === id))
      .filter((e): e is EntityRegistryEntry => e !== undefined)
  }

  private _closeDialog() {
    this.open = false
    this._newEntityId = ''
  }

  private _closeAndSave() {
    this._saveOrder()
    this._closeDialog()
  }

  private _handleSortUpdate(e: CustomEvent) {
    const { oldIndex, newIndex } = e.detail
    if (oldIndex !== undefined && newIndex !== undefined) {
      // 创建数组副本以确保 Lit 能检测到变化
      const newEntities = [...this._favoriteEntities]
      const [item] = newEntities.splice(oldIndex, 1)
      newEntities.splice(newIndex, 0, item)
      this._favoriteEntities = newEntities
    }
  }

  private async _saveOrder() {
    const entityIds = this._favoriteEntities.map(e => e.entity_id)
    this.dispatchEvent(new CustomEvent('cg_save_favorites', {
      detail: { entities: entityIds },
      bubbles: true,
      composed: true
    }))
  }

  private _removeFavorite(entityId: string) {
    const newEntities = [...this._favoriteEntities]
    this._favoriteEntities = newEntities.filter(e => e.entity_id !== entityId)
  }

  private _handleEntityChange(e: CustomEvent, entityId: string) {
    console.log('Entity changed:', e.detail.value, entityId)
    const newEntityId = e.detail.value
    if (newEntityId && newEntityId !== entityId) {
      const index = this._favoriteEntities.findIndex(e => e.entity_id === entityId)
      if (index !== -1) {
        const newEntity = Registry.entities.find(e => e.entity_id === newEntityId)
        if (newEntity) {
          const newEntities = [...this._favoriteEntities]
          newEntities[index] = newEntity
          const filterEntities: EntityRegistryEntry[] = []
          newEntities.forEach(e => {
            if (!filterEntities.some(e2 => e2.entity_id === e.entity_id)) {
              filterEntities.push(e)
            }
          })
          this._favoriteEntities = filterEntities
        }
      }
    }
    if (newEntityId == undefined) {
      this._removeFavorite(entityId)
    }
  }

  private _handleNewEntityChange(e: CustomEvent) {
    this._newEntityId = e.detail.value || ''
    this._addNewFavorite()
  }

  private async _addNewFavorite() {
    if (!this._newEntityId) return

    if (this._favoriteEntities.some(e => e.entity_id === this._newEntityId)) {
      return
    }

    const entity = Registry.entities.find(e => e.entity_id === this._newEntityId)
    if (entity) {
      this._favoriteEntities = [...this._favoriteEntities, entity]
      setTimeout(() => {
        this._newEntityId = ''
      }, 1);
    }
  }

  private _getListAvailableEntities(): Array<EntityRegistryEntry> {
    return Registry.entities
      .map(entity => {
        const name = this._getEntityName(entity).trim()
        return {...entity, name}
      })
  }

  private _getAvailableEntities(): Array<EntityRegistryEntry> {
    return Registry.entities
      .filter(entity => !this._favoriteEntities.some(e => e.entity_id === entity.entity_id))
      .map(entity => {
        const name = this._getEntityName(entity).trim()
        return {...entity, name}
      })
  }

  private _getEntityName(entity: EntityRegistryEntry): string {
    if (entity.name) return entity.name
    const state = Registry.hassStates[entity.entity_id]
    if (state && state.attributes.friendly_name) return state.attributes.friendly_name
    if (entity.original_name) return entity.original_name
    const domain = entity.entity_id.split('.')[0]
    const entityId = entity.entity_id.split('.')[1]
    return `${domain} - ${entityId.replace(/_/g, ' ')}`
  }

  render() {
    return html`
    <div>
      <ha-dialog
        ?open=${this.open}
        @closed=${this._closeDialog}
        .heading=${true}
        scrimClickAction
        escapeKeyAction
      >
        <ha-dialog-header slot="heading">
            <ha-icon-button class="navigation-icon"
              slot="navigationIcon"
              @click=${this._closeDialog}
            >
                <ha-icon style="display: flex;" icon="mdi:close"></ha-icon>
            </ha-icon-button>
            <span slot="title">${localize('favorite.manage')}</span>
        </ha-dialog-header>
        
        <div class="dialog-content">
            
          <div class="section-title">${localize('favorite.entity')} (${this._favoriteEntities.length})</div>
          
          <ha-sortable
            @item-moved=${this._handleSortUpdate}
            handle-selector=".drag-handle"
            draggable-selector=".favorite-item"
          >
            <div class="favorite-list">
              ${this._favoriteEntities.map((entity) => html`
                <div class="favorite-item">
                  <div class="drag-handle">
                    <ha-icon icon="mdi:drag"></ha-icon>
                  </div>
                  <div class="combo-wrapper">
                    <ha-combo-box
                      .hass=${this.hass}
                      .value=${entity.entity_id}
                      @value-changed=${(e: CustomEvent) => this._handleEntityChange(e, entity.entity_id)}
                      .items=${this._getListAvailableEntities()}
                      .renderer=${this._rowRenderer}
                      item-value-path="entity_id"
                      item-label-path="name"
                      .icon=${true}
                    >
                      <state-badge
                        slot="icon"
                        .stateObj=${Registry.hassStates[entity.entity_id]}
                        .hass=${this.hass}
                      ></state-badge>  
                    </ha-combo-box>
                  </div>
                </div>
              `)}
              
            </div>
          </ha-sortable>

            <div class="add-section">
                <div class="add-combo-wrapper">
                    <ha-combo-box
                        .hass=${this.hass}
                        .value=${this._newEntityId}
                        @value-changed=${this._handleNewEntityChange}
                        .items=${this._getAvailableEntities()}
                        .renderer=${this._rowRenderer}
                        label="${localize('favorite.add')}"
                        item-value-path="entity_id"
                        item-label-path="name"
                    ></ha-combo-box>
                </div>
            </div>

        </div>

        
        <mwc-button slot="secondaryAction" @click=${this._closeDialog}>
          ${localize('favorite.cancel')}
        </mwc-button>
        <mwc-button slot="primaryAction" @click=${this._closeAndSave} dialogInitialFocus>
          ${localize('favorite.save')}
        </mwc-button>
      </ha-dialog>
      </div>
    `
  }

  static get styles(): CSSResultGroup {
    console.log('dialog get styles')
    return css`
      :host {
        display: block;
      }
      
      ha-dialog {
        --dialog-content-padding: 0;
        --mdc-dialog-min-width: 580px !important;
        --mdc-dialog-max-width: 90vw;
        --mdc-dialog-max-height: 85vh;
        --dialog-surface-width: 580px !important;
        --mdc-dialog-heading-ink-color: var(--primary-text-color);
        --mdc-dialog-content-ink-color: var(--primary-text-color);
      }

      .mdc-dialog__surface {
        min-width: 580px !important;
      }
      
      ha-dialog > div {
        width: 532px !important;
        max-width: 90vw;
        min-width: 532px !important;
      }
      
      .dialog-content {
        width: 532px;
        padding: 16px 0;
        max-height: 100%;
        overflow-y: auto;
        margin: 0 auto;
      }

      .dialog-content::-webkit-scrollbar {
        display: none; /* 或者设置 width: 0; height: 0; */
      }
      
      .section-title {
        font-size: 14px;
        font-weight: 500;
        color: var(--secondary-text-color);
        margin-bottom: 12px;
        padding: 0 8px;
      }
      
      .favorite-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 24px;
      }
      
      .favorite-item {
        display: flex;
        align-items: center;
        padding: 8px;
        background-color: var(--card-background-color);
        border-radius: 12px;
        gap: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
      }
      
      .drag-handle {
        cursor: grab;
        color: var(--secondary-text-color);
        padding: 4px;
        display: flex;
        align-items: center;
      }
      
      .drag-handle:active {
        cursor: grabbing;
      }
      
      .drag-handle ha-icon {
        font-size: 20px;
      }
      
      .combo-wrapper {
        flex: 1;
        min-width: 0;
      }
      
      .remove-btn {
        flex-shrink: 0;
        color: var(--secondary-text-color);
      }
      
      .remove-btn:hover {
        color: var(--red-color);
      }
      
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 48px 24px;
        color: var(--secondary-text-color);
        gap: 12px;
      }
      
      .empty-state ha-icon {
        font-size: 48px;
        opacity: 0.5;
      }
      
      .empty-hint {
        font-size: 14px;
      }
      
      .add-section {
        padding: 16px 0;
        border-top: 1px solid var(--divider-color);
      }
      
      .add-label {
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
        margin-bottom: 8px;
      }
      
      .add-combo-wrapper {
        width: 100%;
      }
      
      ha-combo-box {
        width: 100%;
      }

    `
  }
}

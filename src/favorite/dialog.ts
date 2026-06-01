import { CSSResultGroup, LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import Sortable from 'sortablejs'
import { HomeAssistant } from '../types/homeassistant/types'
import { Registry } from '../Registry'
import { EntityRegistryEntry } from '../types/homeassistant/data/entity_registry'

@customElement('chuguan-favorite-dialog')
export class FavoriteDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant
  @property({ type: Boolean }) public open = false
  
  @state() private _favoriteEntities: EntityRegistryEntry[] = []
  @state() private _newEntityId: string = ''

  private _sortable: Sortable | null = null

  @state() private _config: any

  setConfig(config: any) {
    this._config = config
  }

  connectedCallback() {
    super.connectedCallback()
    this._loadFavorites()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    if (this._sortable) {
      this._sortable.destroy()
      this._sortable = null
    }
  }

  attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
    if (name === 'open' && newVal === 'true') {
      this._loadFavorites()
      this._newEntityId = ''
      setTimeout(() => this._initSortable(), 100)
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
    this.dispatchEvent(new CustomEvent('close', {
      bubbles: true,
      composed: true
    }))
  }

  private _initSortable() {
    const list = this.shadowRoot?.querySelector('.favorite-list')
    if (list && !this._sortable) {
      this._sortable = new Sortable(list as HTMLElement, {
        animation: 150,
        handle: '.drag-handle',
        onEnd: (evt) => {
          if (evt.oldIndex !== undefined && evt.newIndex !== undefined) {
            const item = this._favoriteEntities.splice(evt.oldIndex, 1)[0]
            this._favoriteEntities.splice(evt.newIndex, 0, item)
            this._saveOrder()
          }
        }
      })
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
    this._favoriteEntities = this._favoriteEntities.filter(e => e.entity_id !== entityId)
    this._saveOrder()
  }

  private _handleEntityChange(e: CustomEvent, entityId: string) {
    const newEntityId = e.detail.value
    if (newEntityId && newEntityId !== entityId) {
      const index = this._favoriteEntities.findIndex(e => e.entity_id === entityId)
      if (index !== -1) {
        const newEntity = Registry.entities.find(e => e.entity_id === newEntityId)
        if (newEntity) {
          this._favoriteEntities[index] = newEntity
          this._saveOrder()
        }
      }
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
      await this._saveOrder()
      this._newEntityId = ''
    }
  }

  private _getAvailableEntities(): Array<{ entity_id: string; name: string }> {
    return Registry.entities
      .map(entity => {
        const name = this._getEntityName(entity)
        return {
          entity_id: entity.entity_id,
          name: `${name} - ${entity.entity_id}`
        }
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  private _getEntityName(entity: EntityRegistryEntry): string {
    if (entity.name) return entity.name
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
            <span slot="title">管理收藏实体</span>
        </ha-dialog-header>
        
        <div class="dialog-content">
            <div class="add-section">
                <div class="add-label">
                    添加新实体
                </div>
                <div class="add-combo-wrapper">
                    <ha-combo-box
                        .hass=${this.hass}
                        .value=${this._newEntityId}
                        @value-changed=${this._handleNewEntityChange}
                        .items=${this._getAvailableEntities()}
                        label="选择实体"
                        item-value-path="entity_id"
                        item-label-path="name"
                    ></ha-combo-box>
                </div>
          </div>
          <div class="section-title">收藏实体 (${this._favoriteEntities.length})</div>
          
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
                    .items=${this._getAvailableEntities()}
                    item-value-path="entity_id"
                    item-label-path="name"
                  ></ha-combo-box>
                </div>
                <ha-icon-button
                  class="remove-btn"
                  @click=${() => this._removeFavorite(entity.entity_id)}
                  .path=${'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z'}
                ></ha-icon-button>
              </div>
            `)}
            
            ${this._favoriteEntities.length === 0 ? html`
              <div class="empty-state">
                <ha-icon icon="mdi:star-outline"></ha-icon>
                <div>暂无收藏实体</div>
                <div class="empty-hint">在下方选择实体添加</div>
              </div>
            ` : ''}
          </div>
        </div>

        
        <mwc-button slot="secondaryAction" @click=${this._closeDialog}>
          取消
        </mwc-button>
        <mwc-button slot="primaryAction" @click=${this._closeDialog} dialogInitialFocus>
          保存
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

      ha-header-bar {
      min-width: 580px !important;
    }
      
      ha-dialog > div {
        width: 580px !important;
        max-width: 90vw;
        min-width: 580px !important;
      }
      
      .dialog-content {
        padding: 16px 24px;
        max-height: 70vh;
        overflow-y: auto;
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

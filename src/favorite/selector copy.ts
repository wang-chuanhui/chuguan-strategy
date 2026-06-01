import { CSSResultGroup, LitElement, css, html, TemplateResult } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import Sortable from 'sortablejs'
import { HomeAssistant } from '../types/homeassistant/types';
import { Registry } from '../Registry';
import { EntityRegistryEntry } from '../types/homeassistant/data/entity_registry';

@customElement('chuguan-favorite-selector')
export class FavoriteSelector extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _showDialog: boolean = false;
  @state() private _favoriteEntities: EntityRegistryEntry[] = [];
  @state() private _newEntityId: string = '';

  @state() private _config: any

  private _sortable: Sortable | null = null;

  public setConfig(config: any) {
    this._config = config;
  }

  connectedCallback() {
    super.connectedCallback();
    this._loadFavorites();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._sortable) {
      this._sortable.destroy();
      this._sortable = null;
    }
  }

  private _loadFavorites() {
    const favoriteIds = Registry.strategyOptions.favorite_entities || [];
    this._favoriteEntities = favoriteIds
      .map(id => Registry.entities.find(e => e.entity_id === id))
      .filter((e): e is EntityRegistryEntry => e !== undefined);
  }

  private _openDialog() {
    this._showDialog = true;
    this._loadFavorites();
    this._newEntityId = '';
    setTimeout(() => this._initSortable(), 100);
  }

  private _closeDialog() {
    this._showDialog = false;
    this._newEntityId = '';
  }

  private _initSortable() {
    const list = this.shadowRoot?.querySelector('.favorite-list');
    if (list && !this._sortable) {
      this._sortable = new Sortable(list as HTMLElement, {
        animation: 150,
        handle: '.drag-handle',
        onEnd: (evt) => {
          if (evt.oldIndex !== undefined && evt.newIndex !== undefined) {
            const item = this._favoriteEntities.splice(evt.oldIndex, 1)[0];
            this._favoriteEntities.splice(evt.newIndex, 0, item);
            this._saveOrder();
          }
        }
      });
    }
  }

  private async _saveOrder() {
    const entityIds = this._favoriteEntities.map(e => e.entity_id);
    this.dispatchEvent(new CustomEvent('cg_save_favorites', {
      detail: { entities: entityIds },
      bubbles: true,
      composed: true
    }));
  }

  private _removeFavorite(entityId: string) {
    this._favoriteEntities = this._favoriteEntities.filter(e => e.entity_id !== entityId);
    this._saveOrder();
  }

  private _handleEntityChange(e: CustomEvent, entityId: string) {
    const newEntityId = e.detail.value;
    if (newEntityId && newEntityId !== entityId) {
      const index = this._favoriteEntities.findIndex(e => e.entity_id === entityId);
      if (index !== -1) {
        const newEntity = Registry.entities.find(e => e.entity_id === newEntityId);
        if (newEntity) {
          this._favoriteEntities[index] = newEntity;
          this._saveOrder();
        }
      }
    }
  }

  private _handleNewEntityChange(e: CustomEvent) {
    this._newEntityId = e.detail.value || '';
    this._addNewFavorite()
  }

  private async _addNewFavorite() {
    console.log('Adding new favorite:', this._newEntityId);
    if (!this._newEntityId) return;
    
    if (this._favoriteEntities.some(e => e.entity_id === this._newEntityId)) {
      console.log('Entity already favorite:', this._newEntityId);
      return;
    }

    const entity = Registry.entities.find(e => e.entity_id === this._newEntityId);
    console.log('Found entity:', entity);
    if (entity) {
      this._favoriteEntities = [...this._favoriteEntities, entity];
      await this._saveOrder();
      this._newEntityId = ''; // 重置为待选状态
    }
  }

  private _getAvailableEntities(): Array<{ entity_id: string; name: string }> {
    return Registry.entities
      .map(entity => {
        const name = this._getEntityName(entity);
        return {
          entity_id: entity.entity_id,
          name: `${name} - ${entity.entity_id}`
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  private _getEntityName(entity: EntityRegistryEntry): string {
    if (entity.name) return entity.name;
    if (entity.original_name) return entity.original_name;
    const domain = entity.entity_id.split('.')[0];
    const entityId = entity.entity_id.split('.')[1];
    return `${domain} - ${entityId.replace(/_/g, ' ')}`;
  }

  private _getEntityIcon(entity: EntityRegistryEntry): string {
    const domain = entity.entity_id.split('.')[0];
    const state = Registry.hassStates[entity.entity_id];
    
    if (state?.attributes?.icon) {
      return state.attributes.icon;
    }
    
    const icons: Record<string, string> = {
      light: 'mdi:lightbulb',
      switch: 'mdi:power-socket',
      sensor: 'mdi:gauge',
      binary_sensor: 'mdi:eye',
      climate: 'mdi:thermostat',
      cover: 'mdi:window-shutter',
      fan: 'mdi:fan',
      media_player: 'mdi:speaker',
      camera: 'mdi:cctv',
      lock: 'mdi:lock',
      person: 'mdi:account',
      weather: 'mdi:weather-cloudy',
      vacuum: 'mdi:robot-vacuum',
      water_heater: 'mdi:water-boiler',
      scene: 'mdi:palette',
      button: 'mdi:gesture-tap-button',
      number: 'mdi:counter',
    };
    return icons[domain] || 'mdi:help-circle';
  }

  private _getEntityIconColor(entity: EntityRegistryEntry): string {
    const domain = entity.entity_id.split('.')[0];
    const state = Registry.hassStates[entity.entity_id];
    
    if (!state) return 'var(--secondary-text-color)';
    
    const colors: Record<string, string> = {
      light: state.state === 'on' ? 'var(--amber-color)' : 'var(--secondary-text-color)',
      switch: state.state === 'on' ? 'var(--green-color)' : 'var(--secondary-text-color)',
      climate: state.state !== 'off' ? 'var(--green-color)' : 'var(--secondary-text-color)',
      fan: state.state === 'on' ? 'var(--green-color)' : 'var(--secondary-text-color)',
      cover: state.state === 'open' ? 'var(--green-color)' : 'var(--secondary-text-color)',
      lock: state.state === 'locked' ? 'var(--green-color)' : 'var(--red-color)',
    };
    
    return colors[domain] || 'var(--secondary-text-color)';
  }

  private _getEntityState(entity: EntityRegistryEntry): string {
    const state = Registry.hassStates[entity.entity_id];
    if (!state) return '未知';
    
    const domain = entity.entity_id.split('.')[0];
    const stateMap: Record<string, Record<string, string>> = {
      light: { on: '开启', off: '关闭', unavailable: '不可用' },
      switch: { on: '开启', off: '关闭', unavailable: '不可用' },
      climate: { heat: '制热', cool: '制冷', heat_cool: '自动', off: '关闭', unavailable: '不可用' },
      cover: { open: '打开', closed: '关闭', unavailable: '不可用' },
      lock: { locked: '已锁', unlocked: '开锁', unavailable: '不可用' },
    };
    
    return stateMap[domain]?.[state.state] || state.state;
  }

  render() {
    return html`
      ${this._showDialog ? html`
        <ha-dialog
          open
          @closed=${this._closeDialog}
          .heading=${true}
          scrimClickAction
          escapeKeyAction
        >
          <div slot="heading">
            <ha-header-bar>
              <span slot="title">管理收藏实体</span>
              <ha-icon-button
                slot="actionItems"
                @click=${this._closeDialog}
                .path=${'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z'}
              ></ha-icon-button>
            </ha-header-bar>
          </div>
          
          <div class="dialog-content">
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
            
            <div class="add-section">
              <div class="add-label">添加新实体</div>
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
          </div>
          
          <mwc-button slot="secondaryAction" @click=${this._closeDialog}>
            取消
          </mwc-button>
          <mwc-button slot="primaryAction" @click=${this._closeDialog} dialogInitialFocus>
            保存
          </mwc-button>
        </ha-dialog>
      ` : ''}
      
      <mushroom-chip
        icon="mdi:star-plus"
        @click=${this._openDialog}
      >
        管理收藏
      </mushroom-chip>
    `;
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: inline-block;
      }
      
      ha-dialog {
        --dialog-content-padding: 0;
        --mdc-dialog-min-width: 580px !important;
        --mdc-dialog-max-width: 90vw;
        --mdc-dialog-max-height: 85vh;
        --dialog-surface-width: 580px !important;
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
      
      .entity-icon {
        flex-shrink: 0;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background-color: var(--secondary-background-color);
      }
      
      .entity-icon ha-icon {
        font-size: 20px;
      }
      
      .entity-info {
        flex: 1;
        min-width: 0;
      }
      
      .entity-name {
        font-weight: 500;
        color: var(--primary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 4px;
      }
      
      .entity-state {
        font-size: 12px;
        color: var(--secondary-text-color);
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
      
      mushroom-chip {
        cursor: pointer;
        --chip-background: var(--card-background-color);
      }
      
      mushroom-chip:hover {
        --chip-background: var(--secondary-background-color);
      }
    `;
  }
}

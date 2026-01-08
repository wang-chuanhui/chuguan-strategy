import { AlarmMode } from '../../homeassistant/data/alarm_control_panel';
import { LovelaceCardConfig } from '../../homeassistant/data/lovelace/config/card';
import { ActionsSharedConfig } from '../shared/config/actions-config';
import { AppearanceSharedConfig } from '../shared/config/appearance-config';
import { EntitySharedConfig } from '../shared/config/entity-config';

export type AlarmControlPanelCardConfig = LovelaceCardConfig &
  EntitySharedConfig &
  AppearanceSharedConfig &
  ActionsSharedConfig & {
    states?: AlarmMode[];
  };
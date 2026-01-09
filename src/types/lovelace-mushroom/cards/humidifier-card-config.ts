import { LovelaceCardConfig } from "../../homeassistant/data/lovelace/config/card";
import { ActionsSharedConfig } from "../shared/config/actions-config";
import { AppearanceSharedConfig } from "../shared/config/appearance-config";
import { EntitySharedConfig } from "../shared/config/entity-config";

export type HumidifierCardConfig = LovelaceCardConfig &
  EntitySharedConfig &
  AppearanceSharedConfig &
  ActionsSharedConfig & {
    show_target_humidity_control?: boolean;
    collapsible_controls?: boolean;
  };
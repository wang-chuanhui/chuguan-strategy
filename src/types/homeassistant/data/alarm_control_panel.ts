import {
  HassEntityAttributeBase,
  HassEntityBase,
} from "home-assistant-js-websocket";

export const enum AlarmControlPanelEntityFeature {
  ARM_HOME = 1,
  ARM_AWAY = 2,
  ARM_NIGHT = 4,
  TRIGGER = 8,
  ARM_CUSTOM_BYPASS = 16,
  ARM_VACATION = 32,
}

export type AlarmMode =
  | "armed_home"
  | "armed_away"
  | "armed_night"
  | "armed_vacation"
  | "armed_custom_bypass"
  | "disarmed";

interface AlarmControlPanelEntityAttributes extends HassEntityAttributeBase {
  code_format?: "text" | "number";
  changed_by?: string | null;
  code_arm_required?: boolean;
}

export interface AlarmControlPanelEntity extends HassEntityBase {
  attributes: AlarmControlPanelEntityAttributes;
}

type AlarmConfig = {
  service: string;
  feature?: AlarmControlPanelEntityFeature;
  icon: string;
};

export const ALARM_MODES: Record<AlarmMode, AlarmConfig> = {
  armed_home: {
    feature: AlarmControlPanelEntityFeature.ARM_HOME,
    service: "alarm_arm_home",
    icon: "mdi:home",
  },
  armed_away: {
    feature: AlarmControlPanelEntityFeature.ARM_AWAY,
    service: "alarm_arm_away",
    icon: "mdi:lock",
  },
  armed_night: {
    feature: AlarmControlPanelEntityFeature.ARM_NIGHT,
    service: "alarm_arm_night",
    icon: "mdi:moon-waning-crescent",
  },
  armed_vacation: {
    feature: AlarmControlPanelEntityFeature.ARM_VACATION,
    service: "alarm_arm_vacation",
    icon: "mdi:airplane",
  },
  armed_custom_bypass: {
    feature: AlarmControlPanelEntityFeature.ARM_CUSTOM_BYPASS,
    service: "alarm_arm_custom_bypass",
    icon: "mdi:shield",
  },
  disarmed: {
    service: "alarm_disarm",
    icon: "mdi:shield-off",
  },
};


import { HassEntity, HassEntityAttributeBase, HassEntityBase } from "home-assistant-js-websocket";
import { HomeAssistant } from "../types";
import { EntityRegistryDisplayEntry, EntityRegistryEntry } from "./entity_registry";

export const computeDomain = (entityId: string): string =>
  entityId.substring(0, entityId.indexOf("."));

export const computeStateDomain = (stateObj: HassEntity) =>
  computeDomain(stateObj.entity_id);

export const entityIcon = async (
  hass: HomeAssistant,
  stateObj: HassEntity,
  state?: string
) => {
  const entry = hass.entities?.[stateObj.entity_id] as
    | EntityRegistryDisplayEntry
    | undefined;
  if (entry?.icon) {
    return entry.icon;
  }
  const domain = computeStateDomain(stateObj);

  return getEntityIcon(hass, domain, stateObj, state, entry);
};

const getEntityIcon = async (
  hass: HomeAssistant,
  domain: string,
  stateObj?: HassEntity,
  stateValue?: string,
  entry?: EntityRegistryEntry | EntityRegistryDisplayEntry
) => {
  const platform = entry?.platform;
  const translation_key = entry?.translation_key;
  const device_class = stateObj?.attributes.device_class;
  const state = stateValue ?? stateObj?.state;

  let icon: string | undefined;
  if (translation_key && platform) {
    const platformIcons = await getPlatformIcons(hass, platform);
    if (platformIcons) {
      const domainIcons = platformIcons[domain];
      const translations = (domainIcons as any)?.[translation_key];

      icon = getIconFromTranslations(state, translations);
    }
  }

  if (!icon && stateObj) {
    icon = stateIcon(stateObj, state);
  }

  if (!icon) {
    const entityComponentIcons = await getComponentIcons(hass, domain);
    if (entityComponentIcons) {
      const translations =
        (device_class && entityComponentIcons[device_class]) ||
        entityComponentIcons._;

      icon = getIconFromTranslations(state, translations);
    }
  }
  return icon;
};

type PlatformIcons = Record<
  string,
  {
    state: Record<string, string>;
    range?: Record<string, string>;
    state_attributes: Record<
      string,
      {
        state: Record<string, string>;
        range?: Record<string, string>;
        default: string;
      }
    >;
    default: string;
  }
>;

export type ComponentIcons = Record<
  string,
  {
    state?: Record<string, string>;
    range?: Record<string, string>;
    state_attributes?: Record<
      string,
      {
        state: Record<string, string>;
        range?: Record<string, string>;
        default: string;
      }
    >;
    default: string;
  }
>;


type ServiceIcons = Record<
  string,
  { service: string; sections?: Record<string, string> }
>;

type TriggerIcons = Record<
  string,
  { trigger: string; sections?: Record<string, string> }
>;

type ConditionIcons = Record<
  string,
  { condition: string; sections?: Record<string, string> }
>;


const resources: {
  entity: Record<string, Promise<PlatformIcons>>;
  entity_component: {
    domains?: string[];
    resources?: Promise<Record<string, ComponentIcons>>;
  };
  services: {
    all?: Promise<Record<string, ServiceIcons>>;
    domains: Record<string, ServiceIcons | Promise<ServiceIcons>>;
  };
  triggers: {
    all?: Promise<Record<string, TriggerIcons>>;
    domains: Record<string, TriggerIcons | Promise<TriggerIcons>>;
  };
  conditions: {
    all?: Promise<Record<string, ConditionIcons>>;
    domains: Record<string, ConditionIcons | Promise<ConditionIcons>>;
  };
} = {
  entity: {},
  entity_component: {},
  services: { domains: {} },
  triggers: { domains: {} },
  conditions: { domains: {} },
};

export const isComponentLoaded = (
  hass: HomeAssistant,
  component: string
): boolean => hass && hass.config.components.includes(component);

export const atLeastVersion = (
  version: string,
  major: number,
  minor: number,
  patch?: number
): boolean => {
  return true
}



export type IconCategory =
  | "entity"
  | "entity_component"
  | "services"
  | "triggers"
  | "conditions";

interface CategoryType {
  entity: PlatformIcons;
  entity_component: ComponentIcons;
  services: ServiceIcons;
  triggers: TriggerIcons;
  conditions: ConditionIcons;
}

interface IconResources<
  T extends
    | ComponentIcons
    | PlatformIcons
    | ServiceIcons
    | TriggerIcons
    | ConditionIcons,
> {
  resources: Record<string, T>;
}

export const getHassIcons = async <T extends IconCategory>(
  hass: HomeAssistant,
  category: T,
  integration?: string
) =>
  hass.callWS<IconResources<CategoryType[T]>>({
    type: "frontend/get_icons",
    category,
    integration,
  });

export const getPlatformIcons = async (
  hass: HomeAssistant,
  integration: string,
  force = false
): Promise<PlatformIcons | undefined> => {
  if (!force && integration in resources.entity) {
    return resources.entity[integration];
  }
  if (
    !isComponentLoaded(hass, integration) ||
    !atLeastVersion(hass.connection.haVersion, 2024, 2)
  ) {
    return undefined;
  }
  const result = getHassIcons(hass, "entity", integration).then(
    (res) => res?.resources[integration]
  );
  resources.entity[integration] = result;
  return resources.entity[integration];
};




const getIconFromTranslations = (
  state: string | number | undefined,
  translations:
    | {
        default?: string;
        state?: Record<string, string>;
        range?: Record<string, string>;
      }
    | undefined
): string | undefined => {
  if (!translations) {
    return undefined;
  }

  // First check for exact state match
  if (state && translations.state?.[state]) {
    return translations.state[state];
  }
  // Then check for range-based icons if we have a numeric state
  if (state !== undefined && translations.range && !isNaN(Number(state))) {
    return (
      getIconFromRange(Number(state), translations.range) ??
      translations.default
    );
  }
  // Fallback to default icon
  return translations.default;
};

const sortedRangeCache = new WeakMap<Record<string, string>, number[]>();


const getIconFromRange = (
  value: number,
  range: Record<string, string>
): string | undefined => {
  // Get cached range values or compute and cache them
  let rangeValues = sortedRangeCache.get(range);
  if (!rangeValues) {
    rangeValues = Object.keys(range)
      .map(Number)
      .filter((k) => !isNaN(k))
      .sort((a, b) => a - b);
    sortedRangeCache.set(range, rangeValues);
  }

  if (rangeValues.length === 0) {
    return undefined;
  }

  // If the value is below the first threshold, return undefined
  // (we'll fall back to the default icon)
  if (value < rangeValues[0]) {
    return undefined;
  }

  // Find the highest threshold that's less than or equal to the value
  let selectedThreshold = rangeValues[0];
  for (const threshold of rangeValues) {
    if (value >= threshold) {
      selectedThreshold = threshold;
    } else {
      break;
    }
  }

  return range[selectedThreshold.toString()];
};

export interface UpdateEntity extends HassEntityBase {
  attributes: UpdateEntityAttributes;
}

interface UpdateEntityAttributes extends HassEntityAttributeBase {
  auto_update: boolean | null;
  display_precision: number;
  installed_version: string | null;
  in_progress: boolean;
  latest_version: string | null;
  release_summary: string | null;
  release_url: string | null;
  skipped_version: string | null;
  title: string | null;
  update_percentage: number | null;
}

export const updateIsInstalling = (entity: UpdateEntity): boolean =>
  !!entity.attributes.in_progress;

export const updateIcon = (stateObj: HassEntity, state?: string) => {
  const compareState = state ?? stateObj.state;
  return compareState === "on"
    ? updateIsInstalling(stateObj as UpdateEntity)
      ? "mdi:package-down"
      : "mdi:package-up"
    : "mdi:package";
};

export const deviceTrackerIcon = (stateObj: HassEntity, state?: string) => {
  const compareState = state ?? stateObj.state;
  if (stateObj?.attributes.source_type === "router") {
    return compareState === "home" ? "mdi:lan-connect" : "mdi:lan-disconnect";
  }
  if (
    ["bluetooth", "bluetooth_le"].includes(stateObj?.attributes.source_type)
  ) {
    return compareState === "home" ? "mdi:bluetooth-connect" : "mdi:bluetooth";
  }
  return compareState === "not_home"
    ? "mdi:account-arrow-right"
    : "mdi:account";
};



export const stateIcon = (
  stateObj: HassEntity,
  state?: string
): string | undefined => {
  const domain = computeStateDomain(stateObj);
  const compareState = state ?? stateObj.state;
  switch (domain) {
    case "update":
      return updateIcon(stateObj, compareState);

    case "device_tracker":
      return deviceTrackerIcon(stateObj, compareState);

    case "sun":
      return compareState === "above_horizon"
        ? "mdi:white-balance-sunny"
        : "mdi:weather-night";

    case "input_datetime":
      if (!stateObj.attributes.has_date) {
        return "mdi:clock";
      }
      if (!stateObj.attributes.has_time) {
        return "mdi:calendar";
      }
      break;
  }
  return undefined;
};




export const getComponentIcons = async (
  hass: HomeAssistant,
  domain: string,
  force = false
): Promise<ComponentIcons | undefined> => {
  // For Cast, old instances can connect to it.
  if (
    !atLeastVersion(hass.connection.haVersion, 2024, 2)
  ) {
    return import("./entity_component_icons")
      .then((mod) => mod.ENTITY_COMPONENT_ICONS)
      .then((res) => res[domain]);
  }

  if (
    !force &&
    resources.entity_component.resources &&
    resources.entity_component.domains?.includes(domain)
  ) {
    return resources.entity_component.resources.then((res) => res[domain]);
  }

  if (!isComponentLoaded(hass, domain)) {
    return undefined;
  }
  resources.entity_component.domains = [...hass.config.components];
  resources.entity_component.resources = getHassIcons(
    hass,
    "entity_component"
  ).then((result) => result.resources);
  return resources.entity_component.resources.then((res) => res[domain]);
};
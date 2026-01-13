import { StrategyDefaults } from './types/strategy/strategy-generics';
import { localize } from './utilities/localize';

/**
 * Default configuration for the mushroom strategy.
 */
export const ConfigurationDefaults: StrategyDefaults = {
  areas: {
    _: {
      type: 'AreaCard',
    },
    undisclosed: {
      // TODO: Refactor undisclosed to other.
      aliases: [],
      area_id: 'undisclosed',
      created_at: 0,
      floor_id: null,
      hidden: false,
      humidity_entity_id: null,
      icon: 'mdi:floor-plan',
      labels: [],
      modified_at: 0,
      name: localize('generic.undisclosed'),
      picture: null,
      temperature_entity_id: null,
      order: Infinity,
    },
  },
  card_options: {},
  chips: {
    // TODO: Make chips sortable.
    weather_entity: 'auto',
    light_count: true,
    fan_count: true,
    cover_count: true,
    switch_count: true,
    climate_count: true,
    extra_chips: [],
  },
  debug: false,
  domains: {
    _: {
      hide_config_entities: undefined,
      hide_diagnostic_entities: undefined,
      showControls: false,
      stack_count: 1,
    },
    alarm_control_panel: {
      title: localize('alarm_control_panel.title'),
      showControls: false,
      hidden: false,
      stack_count: 1,
    },
    binary_sensor: {
      title: localize('sensor.binary'),
      showControls: false,
      hidden: false,
      stack_count: 2, // TODO: Add to wiki. also for other configurations.
    },
    button: {
      title: localize('button.buttons'),
      showControls: false,
      hidden: false,
      stack_count: 2,
    },
    camera: {
      title: localize('camera.cameras'),
      showControls: false,
      hidden: false,
    },
    climate: {
      title: localize('climate.climates'),
      showControls: false,
      hidden: false,
    },
    cover: {
      title: localize('cover.covers'),
      iconOn: 'mdi:arrow-up',
      iconOff: 'mdi:arrow-down',
      onService: 'cover.open_cover',
      offService: 'cover.close_cover',
      hidden: true,
    },
    default: {
      title: localize('generic.miscellaneous'),
      showControls: false,
      hidden: false,
      stack_count: 2,
    },
    fan: {
      title: localize('fan.fans'),
      iconOn: 'mdi:fan',
      iconOff: 'mdi:fan-off',
      onService: 'fan.turn_on',
      offService: 'fan.turn_off',
      hidden: true,
    },
    humidifier: {
      title: localize('humidifier.humidifiers'),
      showControls: false,
      hidden: false,
    },
    input_select: {
      title: localize('input_select.input_selects'),
      showControls: false,
      hidden: false,
    },
    light: {
      title: localize('light.lights'),
      iconOn: 'mdi:lightbulb',
      iconOff: 'mdi:lightbulb-off',
      onService: 'light.turn_on',
      offService: 'light.turn_off',
      hidden: false,
      stack_count: 2,
    },
    lock: {
      title: localize('lock.locks'),
      showControls: false,
      hidden: false,
    },
    media_player: {
      title: localize('media_player.media_players'),
      showControls: false,
      hidden: false,
    },
    number: {
      title: localize('generic.numbers'),
      showControls: false,
      hidden: false,
    },
    scene: {
      title: localize('scene.scenes'),
      showControls: false,
      onService: 'scene.turn_on',
      hidden: false,
    },
    select: {
      title: localize('select.selects'),
      showControls: false,
      hidden: false,
    },
    security: {
      title: localize('security.title'),
      showControls: false,
      hidden: false,
      stack_count: 1,
    },
    sensor: {
      title: localize('sensor.sensors'),
      showControls: false,
      hidden: false,
    },
    siren: {
      title: localize('siren.sirens'),
      showControls: false,
      hidden: false,
      stack_count: 2
    },
    text: {
      title: localize('text.texts'),
      showControls: false,
      hidden: false,
    },
    todo: {
      title: localize('todo.todos'),
      showControls: false,
      hidden: false,
    },
    switch: {
      title: localize('switch.switches'),
      iconOn: 'mdi:power-plug',
      iconOff: 'mdi:power-plug-off',
      onService: 'switch.turn_on',
      offService: 'switch.turn_off',
      hidden: false,
      stack_count: 2,
    },
    vacuum: {
      title: localize('vacuum.vacuums'),
      iconOn: 'mdi:robot-vacuum',
      iconOff: 'mdi:robot-vacuum-off',
      onService: 'vacuum.start',
      offService: 'vacuum.stop',
      hidden: false,
    },
    valve: {
      title: localize('valve.valves'),
      iconOn: 'mdi:valve-open',
      iconOff: 'mdi:valve-closed',
      onService: 'valve.open_valve',
      offService: 'valve.close_valve',
      hidden: false,
      stack_count: 2,
    },
    water_heater: {
      title: localize('water_heater.water_heaters'),
      showControls: false,
      hidden: false,
      stack_count: 2
    },
    weather: {
      title: localize('weather.weather'),
      showControls: false,
      hidden: false,
    },
  },
  extra_cards: [],
  extra_views: [],
  home_view: {
    hidden: [],
    stack_count: {
      _: 2,
    },
  },
  views: {
    camera: {
      order: 6,
      hidden: false,
    },
    button: {
      order: 9,
      hidden: false,
    },
    climate: {
      order: 5,
      hidden: false,
    },
    cover: {
      order: 4,
      hidden: false,
    },
    fan: {
      order: 8,
      hidden: false,
    },
    home: {
      order: 1,
      hidden: false,
    },
    light: {
      order: 2,
      hidden: false,
    },
    security: {
      order: 2,
      hidden: false,
    },
    lock: {
      order: 7,
      hidden: false,
    },
    scene: {
      order: 12,
      hidden: false,
    },
    switch: {
      order: 3,
      hidden: false,
    },
    vacuum: {
      order: 10,
      hidden: false,
    },
    valve: {
      order: 11,
      hidden: false,
    },
  },
  quick_access_cards: [],
};

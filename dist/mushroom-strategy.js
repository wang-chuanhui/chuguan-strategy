/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/deepmerge/dist/cjs.js":
/*!********************************************!*\
  !*** ./node_modules/deepmerge/dist/cjs.js ***!
  \********************************************/
/***/ ((module) => {

"use strict";


var isMergeableObject = function isMergeableObject(value) {
	return isNonNullObject(value)
		&& !isSpecial(value)
};

function isNonNullObject(value) {
	return !!value && typeof value === 'object'
}

function isSpecial(value) {
	var stringValue = Object.prototype.toString.call(value);

	return stringValue === '[object RegExp]'
		|| stringValue === '[object Date]'
		|| isReactElement(value)
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

function isReactElement(value) {
	return value.$$typeof === REACT_ELEMENT_TYPE
}

function emptyTarget(val) {
	return Array.isArray(val) ? [] : {}
}

function cloneUnlessOtherwiseSpecified(value, options) {
	return (options.clone !== false && options.isMergeableObject(value))
		? deepmerge(emptyTarget(value), value, options)
		: value
}

function defaultArrayMerge(target, source, options) {
	return target.concat(source).map(function(element) {
		return cloneUnlessOtherwiseSpecified(element, options)
	})
}

function getMergeFunction(key, options) {
	if (!options.customMerge) {
		return deepmerge
	}
	var customMerge = options.customMerge(key);
	return typeof customMerge === 'function' ? customMerge : deepmerge
}

function getEnumerableOwnPropertySymbols(target) {
	return Object.getOwnPropertySymbols
		? Object.getOwnPropertySymbols(target).filter(function(symbol) {
			return Object.propertyIsEnumerable.call(target, symbol)
		})
		: []
}

function getKeys(target) {
	return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
}

function propertyIsOnObject(object, property) {
	try {
		return property in object
	} catch(_) {
		return false
	}
}

// Protects from prototype poisoning and unexpected merging up the prototype chain.
function propertyIsUnsafe(target, key) {
	return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
		&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
			&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
}

function mergeObject(target, source, options) {
	var destination = {};
	if (options.isMergeableObject(target)) {
		getKeys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
		});
	}
	getKeys(source).forEach(function(key) {
		if (propertyIsUnsafe(target, key)) {
			return
		}

		if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
			destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
		} else {
			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
		}
	});
	return destination
}

function deepmerge(target, source, options) {
	options = options || {};
	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
	options.isMergeableObject = options.isMergeableObject || isMergeableObject;
	// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
	// implementations can use it. The caller may not replace it.
	options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

	var sourceIsArray = Array.isArray(source);
	var targetIsArray = Array.isArray(target);
	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

	if (!sourceAndTargetTypesMatch) {
		return cloneUnlessOtherwiseSpecified(source, options)
	} else if (sourceIsArray) {
		return options.arrayMerge(target, source, options)
	} else {
		return mergeObject(target, source, options)
	}
}

deepmerge.all = function deepmergeAll(array, options) {
	if (!Array.isArray(array)) {
		throw new Error('first argument should be an array')
	}

	return array.reduce(function(prev, next) {
		return deepmerge(prev, next, options)
	}, {})
};

var deepmerge_1 = deepmerge;

module.exports = deepmerge_1;


/***/ }),

/***/ "./src/Registry.ts":
/*!*************************!*\
  !*** ./src/Registry.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Registry: () => (/* binding */ Registry)
/* harmony export */ });
/* harmony import */ var deepmerge__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! deepmerge */ "./node_modules/deepmerge/dist/cjs.js");
/* harmony import */ var deepmerge__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(deepmerge__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _types_strategy_strategy_generics__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types/strategy/strategy-generics */ "./src/types/strategy/strategy-generics.ts");
/* harmony import */ var _utilities_debug__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utilities/debug */ "./src/utilities/debug.ts");
/* harmony import */ var _utilities_localize__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utilities/localize */ "./src/utilities/localize.ts");
/* harmony import */ var _utilities_RegistryFilter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utilities/RegistryFilter */ "./src/utilities/RegistryFilter.ts");





/**
 * Registry Class
 *
 * Contains the entries of Home Assistant's registries and Strategy configuration.
 */
class Registry {
    /**
     * Class constructor.
     *
     * @remarks
     * This class shouldn't be instantiated directly.
     * Instead, method {@link Registry.initialize} must be invoked.
     */
    // noinspection JSUnusedLocalSymbols
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() { }
    /** The configuration of the strategy. */
    static get strategyOptions() {
        return Registry._strategyOptions;
    }
    /**
     * Home Assistant's Area registry.
     *
     * @remarks
     * This module makes changes to the registry at {@link Registry.initialize}.
     */
    static get areas() {
        return Registry._areas;
    }
    /**
     * Home Assistant's Device registry.
     *
     * @remarks
     * This module makes changes to the registry at {@link Registry.initialize}.
     */
    static get devices() {
        return Registry._devices;
    }
    /**
     * Home Assistant's Entity registry.
     *
     * @remarks
     * This module makes changes to the registry at {@link Registry.initialize}.
     */
    static get entities() {
        return Registry._entities;
    }
    /** Home Assistant's State registry. */
    static get hassStates() {
        return Registry._hassStates;
    }
    /** Get the initialization status of the Registry class. */
    static get initialized() {
        return Registry._initialized;
    }
    /**
     * Initialize this module.
     *
     * Imports the registries of Home Assistant and the strategy options.
     *
     * After importing, the registries are sanitized according to the provided strategy options.
     * This method must be called before using any other Registry functionality that depends on the imported data.
     *
     * @param {DashboardInfo} info Strategy information object.
     */
    static async initialize(info) {
        (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_3__["default"])(info.hass);
        // Import the Hass States and strategy options.
        Registry._hassStates = info.hass.states;
        const { ConfigurationDefaults } = await Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ./configurationDefaults */ "./src/configurationDefaults.ts"));
        try {
            Registry._strategyOptions = deepmerge__WEBPACK_IMPORTED_MODULE_0___default()(ConfigurationDefaults, info.config?.strategy?.options ?? {});
        }
        catch (e) {
            (0,_utilities_debug__WEBPACK_IMPORTED_MODULE_2__.logMessage)(_utilities_debug__WEBPACK_IMPORTED_MODULE_2__.lvlFatal, 'Error importing strategy options!', e);
        }
        (0,_utilities_debug__WEBPACK_IMPORTED_MODULE_2__.setDebugLevel)(Registry.strategyOptions.debug ? _utilities_debug__WEBPACK_IMPORTED_MODULE_2__.lvlFatal : _utilities_debug__WEBPACK_IMPORTED_MODULE_2__.lvlOff);
        // Import the registries of Home Assistant.
        try {
            // noinspection ES6MissingAwait False positive? https://youtrack.jetbrains.com/issue/WEB-63746
            [Registry._entities, Registry._devices, Registry._areas] = await Promise.all([
                info.hass.callWS({ type: 'config/entity_registry/list' }),
                info.hass.callWS({ type: 'config/device_registry/list' }),
                info.hass.callWS({ type: 'config/area_registry/list' }),
            ]);
        }
        catch (e) {
            (0,_utilities_debug__WEBPACK_IMPORTED_MODULE_2__.logMessage)(_utilities_debug__WEBPACK_IMPORTED_MODULE_2__.lvlFatal, 'Error importing Home Assistant registries!', e);
        }
        // Process the entries of the Strategy Options.
        Registry._strategyOptions.extra_views.map((view) => ({
            ...view,
            subview: false,
        }));
        // Process entries of the HASS entity registry.
        Registry._entities = new _utilities_RegistryFilter__WEBPACK_IMPORTED_MODULE_4__["default"](Registry.entities)
            .not()
            .whereEntityCategory('config')
            .not()
            .whereEntityCategory('diagnostic')
            .isNotHidden()
            .whereDisabledBy(null)
            .orderBy(['name', 'original_name'], 'asc')
            .toList();
        Registry._entities = Registry.entities.map((entity) => ({
            ...entity,
            area_id: entity.area_id ?? 'undisclosed',
        }));
        // Process entries of the HASS device registry.
        Registry._devices = new _utilities_RegistryFilter__WEBPACK_IMPORTED_MODULE_4__["default"](Registry.devices)
            .isNotHidden()
            .whereDisabledBy(null)
            .orderBy(['name_by_user', 'name'], 'asc')
            .toList();
        Registry._devices = Registry.devices.map((device) => ({
            ...device,
            area_id: device.area_id ?? 'undisclosed',
        }));
        // Process entries of the HASS area registry.
        if (Registry.strategyOptions.areas._?.hidden) {
            Registry._areas = [];
        }
        else {
            // Create and add the undisclosed area if not hidden in the strategy options.
            if (!Registry.strategyOptions.areas.undisclosed?.hidden) {
                Registry.areas.push(ConfigurationDefaults.areas.undisclosed);
            }
            // Merge area configurations of the Strategy options into the entries of the area registry.
            // TODO: Check for to do the same for devices.
            Registry._areas = Registry.areas.map((area) => {
                return { ...area, ...Registry.strategyOptions.areas['_'], ...Registry.strategyOptions.areas?.[area.area_id] };
            });
            // Ensure the custom configuration of the undisclosed area doesn't overwrite the required property values.
            Registry.strategyOptions.areas.undisclosed.area_id = 'undisclosed';
            Registry.strategyOptions.areas.undisclosed.type = 'default';
            // Remove hidden areas if configured as so and sort them by name.
            Registry._areas = new _utilities_RegistryFilter__WEBPACK_IMPORTED_MODULE_4__["default"](Registry.areas).isNotHidden().orderBy(['order', 'name'], 'asc').toList();
        }
        // Sort views by order first and then by title.
        const sortViews = () => {
            const entries = Object.entries(Registry.strategyOptions.views);
            Registry.strategyOptions.views = Object.fromEntries(entries.sort(([_, a], [__, b]) => {
                return (a.order ?? Infinity) - (b.order ?? Infinity) || (a.title ?? '').localeCompare(b.title ?? '');
            }));
        };
        sortViews();
        // Sort domains by order first and then by title.
        const sortDomains = () => {
            const entries = Object.entries(Registry.strategyOptions.domains);
            Registry.strategyOptions.domains = Object.fromEntries(entries.sort(([, a], [, b]) => {
                if ((0,_types_strategy_strategy_generics__WEBPACK_IMPORTED_MODULE_1__.isSortable)(a) && (0,_types_strategy_strategy_generics__WEBPACK_IMPORTED_MODULE_1__.isSortable)(b)) {
                    return (a.order ?? Infinity) - (b.order ?? Infinity) || (a.title ?? '').localeCompare(b.title ?? '');
                }
                return 0; // Maintain the original order when none or only one item is sortable.
            }));
        };
        sortDomains();
        // Sort extra views by order first and then by title.
        // TODO: Add sorting to the wiki.
        const sortExtraViews = () => {
            Registry.strategyOptions.extra_views.sort((a, b) => {
                return (a.order ?? Infinity) - (b.order ?? Infinity) || (a.title ?? '').localeCompare(b.title ?? '');
            });
        };
        sortExtraViews();
        Registry._initialized = true;
    }
    /**
     * Get a template string to define the number of a given domain's entities with a certain state.
     *
     * States are compared against a given value by a given operator.
     * States `unavailable` and `unknown` are always excluded.
     *
     * @param {string} domain The domain of the entities.
     * @param {string} operator The comparison operator between state and value.
     * @param {string} value The value to which the state is compared against.
     */
    static getCountTemplate(domain, operator, value) {
        // noinspection JSMismatchedCollectionQueryUpdate
        /**
         * Array of entity state-entries, filtered by domain.
         *
         * Each element contains a template-string which is used to access home assistant's state machine (state object) in
         * a template; E.g. `states['light.kitchen']`.
         */
        const states = [];
        if (!Registry.initialized) {
            (0,_utilities_debug__WEBPACK_IMPORTED_MODULE_2__.logMessage)(_utilities_debug__WEBPACK_IMPORTED_MODULE_2__.lvlWarn, 'Registry not initialized!');
            return '?';
        }
        states.push(...new _utilities_RegistryFilter__WEBPACK_IMPORTED_MODULE_4__["default"](Registry.entities)
            .whereDomain(domain)
            .where((entity) => !entity.entity_id.endsWith('_stateful_scene'))
            .toList()
            .map((entity) => `states['${entity.entity_id}']`));
        return `{% set entities = [${states}] %}
       {{ entities
          | selectattr('state','${operator}','${value}')
          | selectattr('state','ne','unavailable')
          | selectattr('state','ne','unknown')
          | list
          | count
        }}`;
    }
    /**
     * Get the names of the specified type which aren't set to hidden in the strategy options.
     *
     * @param {string} type The type of options to filter ("domain", "view", "chip").
     *
     * @returns {string[]} For domains and views: names of items that aren't hidden.
     *                     For chips: names of items that are explicitly set to true.
     */
    static getExposedNames(type) {
        // TODO: Align chip with other types.
        if (type === 'chip') {
            return Object.entries(Registry.strategyOptions.chips)
                .filter(([_, value]) => value === true)
                .map(([key]) => key.split('_')[0]);
        }
        const group = Registry.strategyOptions[`${type}s`];
        return Object.keys(group).filter((key) => key !== '_' && key !== 'default' && !group[key].hidden);
    }
}
/** Entries of Home Assistant's area registry. */
Registry._areas = [];
/** Indicates whether this module is initialized. */
Registry._initialized = false;



/***/ }),

/***/ "./src/cards lazy recursive ^\\.\\/.*$":
/*!***************************************************!*\
  !*** ./src/cards/ lazy ^\.\/.*$ namespace object ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./AbstractCard": [
		"./src/cards/AbstractCard.ts"
	],
	"./AbstractCard.ts": [
		"./src/cards/AbstractCard.ts"
	],
	"./AreaCard": [
		"./src/cards/AreaCard.ts",
		"main"
	],
	"./AreaCard.ts": [
		"./src/cards/AreaCard.ts",
		"main"
	],
	"./BinarySensorCard": [
		"./src/cards/BinarySensorCard.ts",
		"main"
	],
	"./BinarySensorCard.ts": [
		"./src/cards/BinarySensorCard.ts",
		"main"
	],
	"./CameraCard": [
		"./src/cards/CameraCard.ts",
		"main"
	],
	"./CameraCard.ts": [
		"./src/cards/CameraCard.ts",
		"main"
	],
	"./ClimateCard": [
		"./src/cards/ClimateCard.ts",
		"main"
	],
	"./ClimateCard.ts": [
		"./src/cards/ClimateCard.ts",
		"main"
	],
	"./CoverCard": [
		"./src/cards/CoverCard.ts",
		"main"
	],
	"./CoverCard.ts": [
		"./src/cards/CoverCard.ts",
		"main"
	],
	"./FanCard": [
		"./src/cards/FanCard.ts",
		"main"
	],
	"./FanCard.ts": [
		"./src/cards/FanCard.ts",
		"main"
	],
	"./HaAreaCard": [
		"./src/cards/HaAreaCard.ts",
		"main"
	],
	"./HaAreaCard.ts": [
		"./src/cards/HaAreaCard.ts",
		"main"
	],
	"./HeaderCard": [
		"./src/cards/HeaderCard.ts"
	],
	"./HeaderCard.ts": [
		"./src/cards/HeaderCard.ts"
	],
	"./InputSelectCard": [
		"./src/cards/InputSelectCard.ts",
		"main"
	],
	"./InputSelectCard.ts": [
		"./src/cards/InputSelectCard.ts",
		"main"
	],
	"./LightCard": [
		"./src/cards/LightCard.ts",
		"main"
	],
	"./LightCard.ts": [
		"./src/cards/LightCard.ts",
		"main"
	],
	"./LockCard": [
		"./src/cards/LockCard.ts",
		"main"
	],
	"./LockCard.ts": [
		"./src/cards/LockCard.ts",
		"main"
	],
	"./MediaPlayerCard": [
		"./src/cards/MediaPlayerCard.ts",
		"main"
	],
	"./MediaPlayerCard.ts": [
		"./src/cards/MediaPlayerCard.ts",
		"main"
	],
	"./MiscellaneousCard": [
		"./src/cards/MiscellaneousCard.ts",
		"main"
	],
	"./MiscellaneousCard.ts": [
		"./src/cards/MiscellaneousCard.ts",
		"main"
	],
	"./NumberCard": [
		"./src/cards/NumberCard.ts",
		"main"
	],
	"./NumberCard.ts": [
		"./src/cards/NumberCard.ts",
		"main"
	],
	"./PersonCard": [
		"./src/cards/PersonCard.ts",
		"main"
	],
	"./PersonCard.ts": [
		"./src/cards/PersonCard.ts",
		"main"
	],
	"./SceneCard": [
		"./src/cards/SceneCard.ts",
		"main"
	],
	"./SceneCard.ts": [
		"./src/cards/SceneCard.ts",
		"main"
	],
	"./SelectCard": [
		"./src/cards/SelectCard.ts",
		"main"
	],
	"./SelectCard.ts": [
		"./src/cards/SelectCard.ts",
		"main"
	],
	"./SensorCard": [
		"./src/cards/SensorCard.ts"
	],
	"./SensorCard.ts": [
		"./src/cards/SensorCard.ts"
	],
	"./SwitchCard": [
		"./src/cards/SwitchCard.ts",
		"main"
	],
	"./SwitchCard.ts": [
		"./src/cards/SwitchCard.ts",
		"main"
	],
	"./VacuumCard": [
		"./src/cards/VacuumCard.ts",
		"main"
	],
	"./VacuumCard.ts": [
		"./src/cards/VacuumCard.ts",
		"main"
	],
	"./ValveCard": [
		"./src/cards/ValveCard.ts",
		"main"
	],
	"./ValveCard.ts": [
		"./src/cards/ValveCard.ts",
		"main"
	]
};
function webpackAsyncContext(req) {
	if(!__webpack_require__.o(map, req)) {
		return Promise.resolve().then(() => {
			var e = new Error("Cannot find module '" + req + "'");
			e.code = 'MODULE_NOT_FOUND';
			throw e;
		});
	}

	var ids = map[req], id = ids[0];
	return Promise.all(ids.slice(1).map(__webpack_require__.e)).then(() => {
		return __webpack_require__(id);
	});
}
webpackAsyncContext.keys = () => (Object.keys(map));
webpackAsyncContext.id = "./src/cards lazy recursive ^\\.\\/.*$";
module.exports = webpackAsyncContext;

/***/ }),

/***/ "./src/cards/AbstractCard.ts":
/*!***********************************!*\
  !*** ./src/cards/AbstractCard.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Registry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Registry */ "./src/Registry.ts");
/* harmony import */ var _utilities_debug__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utilities/debug */ "./src/utilities/debug.ts");


/**
 * Abstract Card Class
 *
 * To create a card configuration, this class should be extended by a child class.
 * Child classes should override the default configuration so the card correctly reflects the entity.
 *
 * @remarks
 * Before using this class, the Registry module must be initialized by calling {@link Registry.initialize}.
 */
class AbstractCard {
    /**
     * Class constructor.
     *
     * @param {RegistryEntry} entity The registry entry to create a card configuration for.
     *
     * @remarks
     * Before this class can be used, the Registry module must be initialized by calling {@link Registry.initialize}.
     */
    constructor(entity) {
        /**
         * The card configuration for this entity.
         *
         * Child classes should override this property to reflect their own card type and options.
         */
        this.configuration = {
            type: 'custom:mushroom-entity-card',
            icon: 'mdi:help-circle',
        };
        if (!_Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.initialized) {
            (0,_utilities_debug__WEBPACK_IMPORTED_MODULE_1__.logMessage)(_utilities_debug__WEBPACK_IMPORTED_MODULE_1__.lvlFatal, 'Registry not initialized!');
        }
        this.entity = entity;
    }
    /**
     * Get a card configuration.
     *
     * The configuration should be set by any of the child classes so the card correctly reflects an entity.
     */
    getCard() {
        return {
            ...this.configuration,
            entity: 'entity_id' in this.entity ? this.entity.entity_id : undefined,
        };
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AbstractCard);


/***/ }),

/***/ "./src/cards/AreaCard.ts":
/*!*******************************!*\
  !*** ./src/cards/AreaCard.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AbstractCard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractCard */ "./src/cards/AbstractCard.ts");

/**
 * Area Card Class
 *
 * Used to create card configuration for an entry of the HASS area registry.
 */
class AreaCard extends _AbstractCard__WEBPACK_IMPORTED_MODULE_0__["default"] {
    /** Returns the default configuration object for the card. */
    static getDefaultConfig() {
        return {
            type: 'custom:mushroom-template-card',
            primary: undefined,
            icon: 'mdi:floor-plan',
            icon_color: 'blue',
            tap_action: { action: 'navigate', navigation_path: '' },
            hold_action: { action: 'none' },
        };
    }
    /**
     * Class constructor.
     *
     * @param {AreaRegistryEntry} area The HASS area to create a card configuration for.
     * @param {TemplateCardConfig} [customConfiguration] Custom card configuration.
     */
    constructor(area, customConfiguration) {
        super(area);
        const configuration = AreaCard.getDefaultConfig();
        let customConfig = customConfiguration;
        configuration.primary = area.name;
        configuration.icon = area.icon || configuration.icon;
        if (configuration.tap_action && 'navigation_path' in configuration.tap_action) {
            configuration.tap_action.navigation_path = area.area_id;
        }
        // Don't override the card type if set differently in the strategy options.
        if (customConfig) {
            customConfig = { ...customConfig, type: configuration.type };
        }
        this.configuration = { ...this.configuration, ...configuration, ...customConfig };
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AreaCard);


/***/ }),

/***/ "./src/cards/BinarySensorCard.ts":
/*!***************************************!*\
  !*** ./src/cards/BinarySensorCard.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _SensorCard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SensorCard */ "./src/cards/SensorCard.ts");
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

/**
 * Sensor Card Class
 *
 * Used to create a card configuration to control an entity of the binary_sensor domain.
 */
class BinarySensorCard extends _SensorCard__WEBPACK_IMPORTED_MODULE_0__["default"] {
    /** Returns the default configuration object for the card. */
    static getDefaultConfig() {
        return {
            type: 'custom:mushroom-entity-card',
            icon: 'mdi:power-cycle',
            icon_color: 'green',
        };
    }
    /**
     * Class constructor.
     *
     * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
     * @param {EntityCardConfig} [customConfiguration] Custom card configuration.
     */
    constructor(entity, customConfiguration) {
        super(entity);
        this.configuration = { ...this.configuration, ...BinarySensorCard.getDefaultConfig(), ...customConfiguration };
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BinarySensorCard);


/***/ }),

/***/ "./src/cards/CameraCard.ts":
/*!*********************************!*\
  !*** ./src/cards/CameraCard.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AbstractCard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractCard */ "./src/cards/AbstractCard.ts");
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

/**
 * Camera Card Class
 *
 * Used to create a card configuration to control an entity of the camera domain.
 */
class CameraCard extends _AbstractCard__WEBPACK_IMPORTED_MODULE_0__["default"] {
    /** Returns the default configuration object for the card. */
    static getDefaultConfig() {
        return {
            entity: '',
            type: 'picture-entity',
            show_name: false,
            show_state: false,
            camera_view: 'live',
        };
    }
    /**
     * Class constructor.
     *
     * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
     * @param {PictureEntityCardConfig} [customConfiguration] Custom card configuration.
     */
    constructor(entity, customConfiguration) {
        super(entity);
        this.configuration = { ...this.configuration, ...CameraCard.getDefaultConfig(), ...customConfiguration };
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CameraCard);


/***/ }),

/***/ "./src/cards/ClimateCard.ts":
/*!**********************************!*\
  !*** ./src/cards/ClimateCard.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AbstractCard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractCard */ "./src/cards/AbstractCard.ts");
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

/**
 * Climate Card Class
 *
 * Used to create a card configuration to control an entity of the climate domain.
 */
class ClimateCard extends _AbstractCard__WEBPACK_IMPORTED_MODULE_0__["default"] {
    /** Returns the default configuration object for the card. */
    static getDefaultConfig() {
        return {
            type: 'custom:mushroom-climate-card',
            icon: undefined,
            hvac_modes: ['off', 'cool', 'heat', 'fan_only'],
            show_temperature_control: true,
        };
    }
    /**
     * Class constructor.
     *
     * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
     * @param {ClimateCardConfig} [customConfiguration] Custom card configuration.
     */
    constructor(entity, customConfiguration) {
        super(entity);
        this.configuration = { ...this.configuration, ...ClimateCard.getDefaultConfig(), ...customConfiguration };
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ClimateCard);


/***/ }),

/***/ "./src/cards/CoverCard.ts":
/*!********************************!*\
  !*** ./src/cards/CoverCard.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AbstractCard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractCard */ "./src/cards/AbstractCard.ts");
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

/**
 * Cover Card Class
 *
 * Used to create a card configuration to control an entity of the cover domain.
 */
class CoverCard extends _AbstractCard__WEBPACK_IMPORTED_MODULE_0__["default"] {
    /** Returns the default configuration object for the card. */
    static getDefaultConfig() {
        return {
            type: 'custom:mushroom-cover-card',
            icon: undefined,
            show_buttons_control: true,
            show_position_control: true,
            show_tilt_position_control: true,
        };
    }
    /**
     * Class constructor.
     *
     * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
     * @param {CoverCardConfig} [customConfiguration] Custom card configuration.
     */
    constructor(entity, customConfiguration) {
        super(entity);
        this.configuration = { ...this.configuration, ...CoverCard.getDefaultConfig(), ...customConfiguration };
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CoverCard);


/***/ }),

/***/ "./src/cards/FanCard.ts":
/*!******************************!*\
  !*** ./src/cards/FanCard.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AbstractCard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractCard */ "./src/cards/AbstractCard.ts");
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

/**
 * Fan Card Class
 *
 * Used to create a card configuration to control an entity of the fan domain.
 */
class FanCard extends _AbstractCard__WEBPACK_IMPORTED_MODULE_0__["default"] {
    /** Returns the default configuration object for the card. */
    static getDefaultConfig() {
        return {
            type: 'custom:mushroom-fan-card',
            icon: undefined,
            show_percentage_control: true,
            show_oscillate_control: true,
            icon_animation: true,
        };
    }
    /**
     * Class constructor.
     *
     * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
     * @param {FanCardConfig} [customConfiguration] Custom card configuration.
     */
    constructor(entity, customConfiguration) {
        super(entity);
        this.configuration = { ...this.configuration, ...FanCard.getDefaultConfig(), ...customConfiguration };
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FanCard);


/***/ }),

/***/ "./src/cards/HaAreaCard.ts":
/*!*********************************!*\
  !*** ./src/cards/HaAreaCard.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AbstractCard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractCard */ "./src/cards/AbstractCard.ts");
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

/**
 * HA Area Card Class
 *
 * Used to create card configuration for an entry of the HASS area registry.
 */
class AreaCard extends _AbstractCard__WEBPACK_IMPORTED_MODULE_0__["default"] {
    /** Returns the default configuration object for the card. */
    static getDefaultConfig() {
        return {
            type: 'area',
            area: '',
        };
    }
    /**
     * Class constructor.
     *
     * @param {AreaRegistryEntry} area The HASS entity to create a card configuration for.
     * @param {AreaCardConfig} [customConfiguration] Custom card configuration.
     */
    constructor(area, customConfiguration) {
        super(area);
        // Initialize the default configuration.
        const configuration = AreaCard.getDefaultConfig();
        configuration.area = area.area_id;
        configuration.navigation_path = configuration.area;
        this.configuration = {
            ...this.configuration,
            ...configuration,
            ...customConfiguration,
            type: configuration.type, // Enforce the card type.
        };
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AreaCard);


/***/ }),

/***/ "./src/cards/HeaderCard.ts":
/*!*********************************!*\
  !*** ./src/cards/HeaderCard.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Header Card class.
 *
 * Used to create a card configuration for a Header Card.
 * The card can be used to describe a group of cards and optionally to control multiple entities.
 */
class HeaderCard {
    /** Returns the default configuration object for the card. */
    static getDefaultConfig() {
        return {
            type: 'custom:mushroom-title-card',
            iconOn: 'mdi:power-on',
            iconOff: 'mdi:power-off',
            onService: 'none',
            offService: 'none',
        };
    }
    /**
     * Class constructor.
     *
     * @param {HassServiceTarget} target The target which is optionally controlled by the card.
     * @param {CustomHeaderCardConfig} [customConfiguration] Custom card configuration.
     *
     * @remarks
     * The target object can contain one or multiple ids of different entry types.
     */
    constructor(target, customConfiguration) {
        this.target = target;
        this.configuration = { ...HeaderCard.getDefaultConfig(), ...customConfiguration };
    }
    /**
     * Create a Header card configuration.
     *
     * @remarks
     * The card is represented by a horizontal stack of cards.
     * One title card and optionally two template cards to control entities.
     */
    createCard() {
        // Create a title card.
        const cards = [
            {
                type: 'custom:mushroom-title-card',
                title: this.configuration.title,
                subtitle: this.configuration.subtitle,
            },
        ];
        // Add controls to the card.
        if (this.configuration.showControls) {
            cards.push({
                type: 'horizontal-stack',
                cards: [
                    {
                        type: 'custom:mushroom-template-card',
                        icon: this.configuration.iconOff,
                        layout: 'vertical',
                        icon_color: 'red',
                        tap_action: {
                            action: 'call-service',
                            service: this.configuration.offService,
                            target: this.target,
                            data: {},
                        },
                    },
                    {
                        type: 'custom:mushroom-template-card',
                        icon: this.configuration.iconOn,
                        layout: 'vertical',
                        icon_color: 'amber',
                        tap_action: {
                            action: 'call-service',
                            service: this.configuration.onService,
                            target: this.target,
                            data: {},
                        },
                    },
                ],
            });
        }
        return {
            type: 'horizontal-stack',
            cards: cards,
        };
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HeaderCard);


/***/ }),

/***/ "./src/cards/InputSelectCard.ts":
/*!**************************************!*\
  !*** ./src/cards/InputSelectCard.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _SelectCard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SelectCard */ "./src/cards/SelectCard.ts");
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

/**
 * InputSelect Card Class
 *
 * Used to create a card configuration to control an entity of the input_select domain.
 */
class InputSelectCard extends _SelectCard__WEBPACK_IMPORTED_MODULE_0__["default"] {
    /** Returns the default configuration object for the card. */
    static getDefaultConfig() {
        return {
            type: 'custom:mushroom-select-card',
            icon: undefined,
        };
    }
    /**
     * Class constructor.
     *
     * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
     * @param {SelectCardConfig} [customConfiguration] Custom card configuration.
     */
    constructor(entity, customConfiguration) {
        super(entity);
        this.configuration = { ...this.configuration, ...InputSelectCard.getDefaultConfig(), ...customConfiguration };
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (InputSelectCard);


/***/ }),

/***/ "./src/cards/LightCard.ts":
/*!********************************!*\
  !*** ./src/cards/LightCard.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _types_strategy_strategy_generics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../types/strategy/strategy-generics */ "./src/types/strategy/strategy-generics.ts");
/* harmony import */ var _AbstractCard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AbstractCard */ "./src/cards/AbstractCard.ts");
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.


/**
 * Light Card Class
 *
 * Used to create a card configuration to control an entity of the light domain.
 */
class LightCard extends _AbstractCard__WEBPACK_IMPORTED_MODULE_1__["default"] {
    /** Returns the default configuration object for the card. */
    static getDefaultConfig() {
        return {
            type: 'custom:mushroom-light-card',
            icon: undefined,
            show_brightness_control: true,
            show_color_control: true,
            show_color_temp_control: true,
            use_light_color: true,
            double_tap_action: {
                action: 'call-service',
                perform_action: 'light.turn_on',
                target: {
                    entity_id: undefined,
                },
                data: {
                    rgb_color: [255, 255, 255],
                },
            },
        };
    }
    /**
     * Class constructor.
     *
     * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
     * @param {LightCardConfig} [customConfiguration] Custom card configuration.
     */
    constructor(entity, customConfiguration) {
        super(entity);
        const configuration = LightCard.getDefaultConfig();
        if ((0,_types_strategy_strategy_generics__WEBPACK_IMPORTED_MODULE_0__.isCallServiceActionConfig)(configuration.double_tap_action)) {
            configuration.double_tap_action.target = { entity_id: entity.entity_id };
        }
        this.configuration = { ...this.configuration, ...configuration, ...customConfiguration };
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LightCard);


/***/ }),

/***/ "./src/cards/LockCard.ts":
/*!*******************************!*\
  !*** ./src/cards/LockCard.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AbstractCard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractCard */ "./src/cards/AbstractCard.ts");
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

/**
 * Lock Card Class
 *
 * Used to create a card configuration to control an entity of the lock domain.
 */
class LockCard extends _AbstractCard__WEBPACK_IMPORTED_MODULE_0__["default"] {
    /** Returns the default configuration object for the card. */
    static getDefaultConfig() {
        return {
            type: 'custom:mushroom-lock-card',
            icon: undefined,
        };
    }
    /**
     * Class constructor.
     *
     * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
     * @param {LockCardConfig} [customConfiguration] Custom card configuration.
     */
    constructor(entity, customConfiguration) {
        super(entity);
        this.configuration = { ...this.configuration, ...LockCard.getDefaultConfig(), ...customConfiguration };
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LockCard);


/***/ }),

/***/ "./src/cards/MediaPlayerCard.ts":
/*!**************************************!*\
  !*** ./src/cards/MediaPlayerCard.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AbstractCard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractCard */ "./src/cards/AbstractCard.ts");
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

/**
 * Mediaplayer Card Class
 *
 * Used to create a card configuration to control an entity of the media_player domain.
 */
class MediaPlayerCard extends _AbstractCard__WEBPACK_IMPORTED_MODULE_0__["default"] {
    /** Returns the default configuration object for the card. */
    static getDefaultConfig() {
        return {
            type: 'custom:mushroom-media-player-card',
            use_media_info: true,
            media_controls: ['on_off', 'play_pause_stop'],
            show_volume_level: true,
            volume_controls: ['volume_mute', 'volume_set', 'volume_buttons'],
        };
    }
    /**
     * Class constructor.
     *
     * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
     * @param {MediaPlayerCardConfig} [customConfiguration] Custom card configuration.
     */
    constructor(entity, customConfiguration) {
        super(entity);
        this.configuration = { ...this.configuration, ...MediaPlayerCard.getDefaultConfig(), ...customConfiguration };
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MediaPlayerCard);


/***/ }),

/***/ "./src/cards/MiscellaneousCard.ts":
/*!****************************************!*\
  !*** ./src/cards/MiscellaneousCard.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AbstractCard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractCard */ "./src/cards/AbstractCard.ts");

/**
 * Miscellaneous Card Class
 *
 * Used to create a card configuration to control an entity of any domain.
 */
class MiscellaneousCard extends _AbstractCard__WEBPACK_IMPORTED_MODULE_0__["default"] {
    /** Returns the default configuration object for the card. */
    static getDefaultConfig() {
        return {
            type: 'custom:mushroom-entity-card',
            icon_color: 'blue-grey',
        };
    }
    /**
     * Class constructor.
     *
     * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
     * @param {EntityCardConfig} [customConfiguration] Custom card configuration.
     */
    constructor(entity, customConfiguration) {
        super(entity);
        this.configuration = { ...this.configuration, ...MiscellaneousCard.getDefaultConfig(), ...customConfiguration };
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MiscellaneousCard);


/***/ }),

/***/ "./src/cards/NumberCard.ts":
/*!*********************************!*\
  !*** ./src/cards/NumberCard.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AbstractCard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractCard */ "./src/cards/AbstractCard.ts");
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

/**
 * Number Card Class
 *
 * Used to create a card configuration to control an entity of the number domain.
 */
class NumberCard extends _AbstractCard__WEBPACK_IMPORTED_MODULE_0__["default"] {
    /** Returns the default configuration object for the card. */
    static getDefaultConfig() {
        return {
            type: 'custom:mushroom-number-card',
            icon: undefined,
        };
    }
    /**
     * Class constructor.
     *
     * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
     * @param {NumberCardConfig} [customConfiguration] Custom card configuration.
     */
    constructor(entity, customConfiguration) {
        super(entity);
        this.configuration = { ...this.configuration, ...NumberCard.getDefaultConfig(), ...customConfiguration };
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (NumberCard);


/***/ }),

/***/ "./src/cards/PersonCard.ts":
/*!*********************************!*\
  !*** ./src/cards/PersonCard.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AbstractCard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractCard */ "./src/cards/AbstractCard.ts");

/**
 * Person Card Class
 *
 * Used to create a card configuration to control an entity of the person domain.
 */
class PersonCard extends _AbstractCard__WEBPACK_IMPORTED_MODULE_0__["default"] {
    /** Returns the default configuration object for the card. */
    static getDefaultConfig() {
        return {
            type: 'custom:mushroom-person-card',
            layout: 'vertical',
            primary_info: 'none',
            secondary_info: 'none',
            icon_type: 'entity-picture',
        };
    }
    /**
     * Class constructor.
     *
     * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
     * @param {PersonCardConfig} [customConfiguration] Custom card configuration.
     */
    constructor(entity, customConfiguration) {
        super(entity);
        this.configuration = { ...this.configuration, ...PersonCard.getDefaultConfig(), ...customConfiguration };
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PersonCard);


/***/ }),

/***/ "./src/cards/SceneCard.ts":
/*!********************************!*\
  !*** ./src/cards/SceneCard.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Registry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Registry */ "./src/Registry.ts");
/* harmony import */ var _AbstractCard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AbstractCard */ "./src/cards/AbstractCard.ts");
/* harmony import */ var _SwitchCard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SwitchCard */ "./src/cards/SwitchCard.ts");
/* harmony import */ var _types_strategy_strategy_generics__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../types/strategy/strategy-generics */ "./src/types/strategy/strategy-generics.ts");
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.




/**
 * Scene Card Class
 *
 * Used to create a card configuration to control an entity of the scene domain.
 *
 * Supports Stateful scenes from https://github.com/hugobloem/stateful_scenes.
 * If the stateful scene entity is available, it will be used instead of the original scene entity.
 */
class SceneCard extends _AbstractCard__WEBPACK_IMPORTED_MODULE_1__["default"] {
    /** Returns the default configuration object for the card. */
    static getDefaultConfig() {
        return {
            type: 'custom:mushroom-entity-card',
            tap_action: {
                action: 'perform-action',
                perform_action: 'scene.turn_on',
                target: {},
            },
        };
    }
    /**
     * Class constructor.
     *
     * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
     * @param {EntityCardConfig} [customConfiguration] Custom card configuration.
     */
    constructor(entity, customConfiguration) {
        const sceneName = entity.entity_id.split('.').pop();
        const statefulScene = _Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.entities.find((entity) => entity.entity_id === `switch.${sceneName}_stateful_scene`);
        super(statefulScene ?? entity);
        // Stateful scene support.
        if (statefulScene) {
            this.configuration = new _SwitchCard__WEBPACK_IMPORTED_MODULE_2__["default"](statefulScene).getCard();
            return;
        }
        // Initialize the default configuration.
        const configuration = SceneCard.getDefaultConfig();
        if ((0,_types_strategy_strategy_generics__WEBPACK_IMPORTED_MODULE_3__.isCallServiceActionConfig)(configuration.tap_action)) {
            configuration.tap_action.target = { entity_id: entity.entity_id };
        }
        configuration.icon = _Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.hassStates[entity.entity_id]?.attributes.icon ?? configuration.icon;
        this.configuration = { ...this.configuration, ...configuration, ...customConfiguration };
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SceneCard);


/***/ }),

/***/ "./src/cards/SelectCard.ts":
/*!*********************************!*\
  !*** ./src/cards/SelectCard.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AbstractCard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractCard */ "./src/cards/AbstractCard.ts");
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

/**
 * Select Card Class
 *
 * Used to create a card configuration to control an entity of the select domain.
 */
class SelectCard extends _AbstractCard__WEBPACK_IMPORTED_MODULE_0__["default"] {
    /** Returns the default configuration object for the card. */
    static getDefaultConfig() {
        return {
            type: 'custom:mushroom-select-card',
            icon: undefined,
        };
    }
    /**
     * Class constructor.
     *
     * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
     * @param {SelectCardConfig} [customConfiguration] Custom card configuration.
     */
    constructor(entity, customConfiguration) {
        super(entity);
        this.configuration = { ...this.configuration, ...SelectCard.getDefaultConfig(), ...customConfiguration };
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SelectCard);


/***/ }),

/***/ "./src/cards/SensorCard.ts":
/*!*********************************!*\
  !*** ./src/cards/SensorCard.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AbstractCard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractCard */ "./src/cards/AbstractCard.ts");

/**
 * Sensor Card Class
 *
 * Used to create a card for controlling an entity of the sensor domain.
 */
class SensorCard extends _AbstractCard__WEBPACK_IMPORTED_MODULE_0__["default"] {
    /** Returns the default configuration object for the card. */
    static getDefaultConfig() {
        return {
            type: 'custom:mushroom-entity-card',
            icon: 'mdi:information',
            animate: true,
            line_color: 'green',
        };
    }
    /**
     * Class constructor.
     *
     * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
     * @param {EntityCardConfig} [customConfiguration] Custom card configuration.
     */
    constructor(entity, customConfiguration) {
        super(entity);
        this.configuration = { ...this.configuration, ...SensorCard.getDefaultConfig(), ...customConfiguration };
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SensorCard);


/***/ }),

/***/ "./src/cards/SwitchCard.ts":
/*!*********************************!*\
  !*** ./src/cards/SwitchCard.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AbstractCard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractCard */ "./src/cards/AbstractCard.ts");
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

/**
 * Switch Card Class
 *
 * Used to create a card configuration to control an entity of the switch domain.
 */
class SwitchCard extends _AbstractCard__WEBPACK_IMPORTED_MODULE_0__["default"] {
    /** Returns the default configuration object for the card. */
    static getDefaultConfig() {
        return {
            type: 'custom:mushroom-entity-card',
            icon: undefined,
            tap_action: {
                action: 'toggle',
            },
        };
    }
    /**
     * Class constructor.
     *
     * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
     * @param {EntityCardConfig} [customConfiguration] Custom card configuration.
     */
    constructor(entity, customConfiguration) {
        super(entity);
        this.configuration = { ...this.configuration, ...SwitchCard.getDefaultConfig(), ...customConfiguration };
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SwitchCard);


/***/ }),

/***/ "./src/cards/VacuumCard.ts":
/*!*********************************!*\
  !*** ./src/cards/VacuumCard.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _types_lovelace_mushroom_cards_vacuum_card_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../types/lovelace-mushroom/cards/vacuum-card-config */ "./src/types/lovelace-mushroom/cards/vacuum-card-config.ts");
/* harmony import */ var _AbstractCard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AbstractCard */ "./src/cards/AbstractCard.ts");
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.


/**
 * Vacuum Card Class
 *
 * Used to create a card configuration to control an entity of the vacuum domain.
 */
class VacuumCard extends _AbstractCard__WEBPACK_IMPORTED_MODULE_1__["default"] {
    /** Returns the default configuration object for the card. */
    static getDefaultConfig() {
        return {
            type: 'custom:mushroom-vacuum-card',
            icon: undefined,
            icon_animation: true,
            commands: [..._types_lovelace_mushroom_cards_vacuum_card_config__WEBPACK_IMPORTED_MODULE_0__.VACUUM_COMMANDS],
            tap_action: {
                action: 'more-info',
            },
        };
    }
    /**
     * Class constructor.
     *
     * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
     * @param {VacuumCardConfig} [customConfiguration] Custom card configuration.
     */
    constructor(entity, customConfiguration) {
        super(entity);
        this.configuration = { ...this.configuration, ...VacuumCard.getDefaultConfig(), ...customConfiguration };
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VacuumCard);


/***/ }),

/***/ "./src/cards/ValveCard.ts":
/*!********************************!*\
  !*** ./src/cards/ValveCard.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utilities_localize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utilities/localize */ "./src/utilities/localize.ts");
/* harmony import */ var _AbstractCard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AbstractCard */ "./src/cards/AbstractCard.ts");
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.


/**
 * Valve Card Class
 *
 * Used to create a card configuration to control an entity of the valve domain.
 */
class ValveCard extends _AbstractCard__WEBPACK_IMPORTED_MODULE_1__["default"] {
    /** Returns the default configuration object for the card. */
    static getDefaultConfig() {
        return {
            type: 'custom:mushroom-template-card',
            icon: 'mdi:valve',
            icon_color: 'blue',
            double_tap_action: {
                action: 'toggle',
            },
        };
    }
    /**
     * Class constructor.
     *
     * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
     * @param {VacuumCardConfig} [customConfiguration] Custom card configuration.
     */
    constructor(entity, customConfiguration) {
        super(entity);
        // Initialize the default configuration.
        const configuration = ValveCard.getDefaultConfig();
        configuration.entity = entity.entity_id;
        configuration.icon = entity.icon ?? configuration.icon;
        configuration.primary = entity.name ?? entity.original_name ?? '?';
        configuration.secondary = `{% 
                                 set mapping = {
                                   'open': '${(0,_utilities_localize__WEBPACK_IMPORTED_MODULE_0__.localize)('valve.open')}',
                                   'opening': '${(0,_utilities_localize__WEBPACK_IMPORTED_MODULE_0__.localize)('valve.opening')}',
                                   'closed': '${(0,_utilities_localize__WEBPACK_IMPORTED_MODULE_0__.localize)('valve.closed')}',
                                   'closing': '${(0,_utilities_localize__WEBPACK_IMPORTED_MODULE_0__.localize)('valve.closing')}',
                                   'stopped': '${(0,_utilities_localize__WEBPACK_IMPORTED_MODULE_0__.localize)('valve.stopped')}',
                                   'unavailable': '${(0,_utilities_localize__WEBPACK_IMPORTED_MODULE_0__.localize)('generic.unavailable')}'
                                 }
                               %}
                               {{ mapping.get(states('${entity.entity_id}'), '${(0,_utilities_localize__WEBPACK_IMPORTED_MODULE_0__.localize)('generic.unknown')}') }}`;
        this.configuration = { ...this.configuration, ...configuration, ...customConfiguration };
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ValveCard);


/***/ }),

/***/ "./src/chips lazy recursive ^\\.\\/.*$":
/*!***************************************************!*\
  !*** ./src/chips/ lazy ^\.\/.*$ namespace object ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./AbstractChip": [
		"./src/chips/AbstractChip.ts",
		"main"
	],
	"./AbstractChip.ts": [
		"./src/chips/AbstractChip.ts",
		"main"
	],
	"./ClimateChip": [
		"./src/chips/ClimateChip.ts",
		"main"
	],
	"./ClimateChip.ts": [
		"./src/chips/ClimateChip.ts",
		"main"
	],
	"./CoverChip": [
		"./src/chips/CoverChip.ts",
		"main"
	],
	"./CoverChip.ts": [
		"./src/chips/CoverChip.ts",
		"main"
	],
	"./FanChip": [
		"./src/chips/FanChip.ts",
		"main"
	],
	"./FanChip.ts": [
		"./src/chips/FanChip.ts",
		"main"
	],
	"./LightChip": [
		"./src/chips/LightChip.ts",
		"main"
	],
	"./LightChip.ts": [
		"./src/chips/LightChip.ts",
		"main"
	],
	"./SwitchChip": [
		"./src/chips/SwitchChip.ts",
		"main"
	],
	"./SwitchChip.ts": [
		"./src/chips/SwitchChip.ts",
		"main"
	],
	"./WeatherChip": [
		"./src/chips/WeatherChip.ts",
		"main"
	],
	"./WeatherChip.ts": [
		"./src/chips/WeatherChip.ts",
		"main"
	]
};
function webpackAsyncContext(req) {
	if(!__webpack_require__.o(map, req)) {
		return Promise.resolve().then(() => {
			var e = new Error("Cannot find module '" + req + "'");
			e.code = 'MODULE_NOT_FOUND';
			throw e;
		});
	}

	var ids = map[req], id = ids[0];
	return __webpack_require__.e(ids[1]).then(() => {
		return __webpack_require__(id);
	});
}
webpackAsyncContext.keys = () => (Object.keys(map));
webpackAsyncContext.id = "./src/chips lazy recursive ^\\.\\/.*$";
module.exports = webpackAsyncContext;

/***/ }),

/***/ "./src/chips/AbstractChip.ts":
/*!***********************************!*\
  !*** ./src/chips/AbstractChip.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Registry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Registry */ "./src/Registry.ts");
/* harmony import */ var _utilities_debug__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utilities/debug */ "./src/utilities/debug.ts");


class AbstractChip {
    /**
     * Class Constructor.
     *
     * @remarks
     * Before using this class, the Registry module must be initialized by calling {@link Registry.initialize}.
     */
    constructor() {
        /**
         * Abstract Chip class.
         *
         * To create a chip configuration, this class should be extended by a child class.
         * Child classes should override the default configuration so the chip correctly reflects the entity.
         *
         * @remarks
         * Before using this class, the Registry module must be initialized by calling {@link Registry.initialize}.
         */
        /**
         * Configuration of the chip.
         *
         * Child classes should override this property to reflect their own card type and options.
         */
        this.configuration = {
            // TODO: Check if this is correct vs custom:mushroom-template-badge. Also in child classes.
            type: 'template',
        };
        if (!_Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.initialized) {
            (0,_utilities_debug__WEBPACK_IMPORTED_MODULE_1__.logMessage)(_utilities_debug__WEBPACK_IMPORTED_MODULE_1__.lvlFatal, 'Registry not initialized!');
        }
    }
    /**
     * Get a chip configuration.
     *
     * The configuration should be set by any of the child classes so the chip correctly reflects an entity.
     */
    getChipConfiguration() {
        return this.configuration;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AbstractChip);


/***/ }),

/***/ "./src/chips/ClimateChip.ts":
/*!**********************************!*\
  !*** ./src/chips/ClimateChip.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Registry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Registry */ "./src/Registry.ts");
/* harmony import */ var _AbstractChip__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AbstractChip */ "./src/chips/AbstractChip.ts");
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.


/**
 * Climate Chip class.
 *
 * Used to create a chip configuration to indicate how many climates are operating.
 */
class ClimateChip extends _AbstractChip__WEBPACK_IMPORTED_MODULE_1__["default"] {
    /** Returns the default configuration object for the chip. */
    static getDefaultConfig() {
        return {
            type: 'template',
            icon: 'mdi:thermostat',
            icon_color: 'orange',
            content: _Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.getCountTemplate('climate', 'ne', 'off'),
            tap_action: {
                action: 'none',
            },
            hold_action: {
                action: 'navigate',
                navigation_path: 'climates',
            },
        };
    }
    /**
     * Class Constructor.
     *
     * @param {TemplateChipConfig} [customConfiguration] Custom chip configuration.
     */
    constructor(customConfiguration) {
        super();
        this.configuration = { ...this.configuration, ...ClimateChip.getDefaultConfig(), ...customConfiguration };
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ClimateChip);


/***/ }),

/***/ "./src/chips/CoverChip.ts":
/*!********************************!*\
  !*** ./src/chips/CoverChip.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Registry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Registry */ "./src/Registry.ts");
/* harmony import */ var _AbstractChip__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AbstractChip */ "./src/chips/AbstractChip.ts");
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.


/**
 * Cover Chip class.
 *
 * Used to create a chip configuration to indicate how many covers aren't closed.
 */
class CoverChip extends _AbstractChip__WEBPACK_IMPORTED_MODULE_1__["default"] {
    /** Returns the default configuration object for the chip. */
    static getDefaultConfig() {
        return {
            type: 'template',
            icon: 'mdi:window-open',
            icon_color: 'cyan',
            content: _Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.getCountTemplate('cover', 'search', '(open|opening|closing)'),
            tap_action: {
                action: 'none',
            },
            hold_action: {
                action: 'navigate',
                navigation_path: 'covers',
            },
        };
    }
    /**
     * Class Constructor.
     *
     * @param {TemplateChipConfig} [customConfiguration] Custom chip configuration.
     */
    constructor(customConfiguration) {
        super();
        this.configuration = { ...this.configuration, ...CoverChip.getDefaultConfig(), ...customConfiguration };
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CoverChip);


/***/ }),

/***/ "./src/chips/FanChip.ts":
/*!******************************!*\
  !*** ./src/chips/FanChip.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Registry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Registry */ "./src/Registry.ts");
/* harmony import */ var _AbstractChip__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AbstractChip */ "./src/chips/AbstractChip.ts");
/* harmony import */ var _utilities_RegistryFilter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utilities/RegistryFilter */ "./src/utilities/RegistryFilter.ts");
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.



/**
 * Fan Chip class.
 *
 * Used to create a chip to indicate how many fans are on and to switch them all off.
 */
class FanChip extends _AbstractChip__WEBPACK_IMPORTED_MODULE_1__["default"] {
    /** Returns the default configuration object for the chip. */
    static getDefaultConfig() {
        return {
            type: 'template',
            icon: 'mdi:fan',
            icon_color: 'green',
            content: _Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.getCountTemplate('fan', 'eq', 'on'),
            tap_action: {
                action: 'perform-action',
                perform_action: 'fan.turn_off',
                target: {
                    entity_id: new _utilities_RegistryFilter__WEBPACK_IMPORTED_MODULE_2__["default"](_Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.entities)
                        .whereDomain('fan')
                        .getValuesByProperty('entity_id'),
                },
            },
            hold_action: {
                action: 'navigate',
                navigation_path: 'fans',
            },
        };
    }
    /**
     * Class Constructor.
     *
     * @param {TemplateChipConfig} [customConfiguration] Custom chip configuration.
     */
    constructor(customConfiguration) {
        super();
        this.configuration = { ...this.configuration, ...FanChip.getDefaultConfig(), ...customConfiguration };
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FanChip);


/***/ }),

/***/ "./src/chips/LightChip.ts":
/*!********************************!*\
  !*** ./src/chips/LightChip.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Registry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Registry */ "./src/Registry.ts");
/* harmony import */ var _AbstractChip__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AbstractChip */ "./src/chips/AbstractChip.ts");
/* harmony import */ var _utilities_RegistryFilter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utilities/RegistryFilter */ "./src/utilities/RegistryFilter.ts");
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.



/**
 * Light Chip class.
 *
 * Used to create a chip configuration to indicate how many lights are on and to switch them all off.
 */
class LightChip extends _AbstractChip__WEBPACK_IMPORTED_MODULE_1__["default"] {
    /** Returns the default configuration object for the chip. */
    static getDefaultConfig() {
        return {
            type: 'template',
            icon: 'mdi:lightbulb-group',
            icon_color: 'amber',
            content: _Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.getCountTemplate('light', 'eq', 'on'),
            tap_action: {
                action: 'perform-action',
                perform_action: 'light.turn_off',
                target: {
                    entity_id: new _utilities_RegistryFilter__WEBPACK_IMPORTED_MODULE_2__["default"](_Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.entities)
                        .whereDomain('light')
                        .getValuesByProperty('entity_id'),
                },
            },
            hold_action: {
                action: 'navigate',
                navigation_path: 'lights',
            },
        };
    }
    /**
     * Class Constructor.
     *
     * @param {TemplateChipConfig} [customConfiguration] Custom chip configuration.
     */
    constructor(customConfiguration) {
        super();
        this.configuration = { ...this.configuration, ...LightChip.getDefaultConfig(), ...customConfiguration };
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LightChip);


/***/ }),

/***/ "./src/chips/SwitchChip.ts":
/*!*********************************!*\
  !*** ./src/chips/SwitchChip.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Registry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Registry */ "./src/Registry.ts");
/* harmony import */ var _AbstractChip__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AbstractChip */ "./src/chips/AbstractChip.ts");
/* harmony import */ var _utilities_RegistryFilter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utilities/RegistryFilter */ "./src/utilities/RegistryFilter.ts");
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.



/**
 * Switch Chip class.
 *
 * Used to create a chip configuration to indicate how many switches are on and to switch them all off.
 */
class SwitchChip extends _AbstractChip__WEBPACK_IMPORTED_MODULE_1__["default"] {
    /** Returns the default configuration object for the chip. */
    static getDefaultConfig() {
        return {
            type: 'template',
            icon: 'mdi:dip-switch',
            icon_color: 'blue',
            content: _Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.getCountTemplate('switch', 'eq', 'on'),
            tap_action: {
                action: 'perform-action',
                perform_action: 'switch.turn_off',
                target: {
                    entity_id: new _utilities_RegistryFilter__WEBPACK_IMPORTED_MODULE_2__["default"](_Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.entities)
                        .whereDomain('switch')
                        .getValuesByProperty('entity_id'),
                },
            },
            hold_action: {
                action: 'navigate',
                navigation_path: 'switches',
            },
        };
    }
    /**
     * Class Constructor.
     *
     * @param {TemplateChipConfig} [customConfiguration] Custom chip configuration.
     */
    constructor(customConfiguration) {
        super();
        this.configuration = { ...this.configuration, ...SwitchChip.getDefaultConfig(), ...customConfiguration };
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SwitchChip);


/***/ }),

/***/ "./src/chips/WeatherChip.ts":
/*!**********************************!*\
  !*** ./src/chips/WeatherChip.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AbstractChip__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractChip */ "./src/chips/AbstractChip.ts");
// noinspection JSUnusedGlobalSymbols False positive.

/**
 * Weather Chip class.
 *
 * Used to create a chip configuration to indicate the current weather.
 */
class WeatherChip extends _AbstractChip__WEBPACK_IMPORTED_MODULE_0__["default"] {
    /** Returns the default configuration object for the chip. */
    static getDefaultConfig(entityId) {
        return {
            type: 'weather',
            entity: entityId,
            show_temperature: true,
            show_conditions: true,
        };
    }
    /**
     * Class Constructor.
     *
     * @param {string} entityId Id of a weather entity.
     * @param {WeatherChipConfig} [customConfiguration] Custom chip configuration.
     */
    constructor(entityId, customConfiguration) {
        super();
        this.configuration = { ...this.configuration, ...WeatherChip.getDefaultConfig(entityId), ...customConfiguration };
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (WeatherChip);


/***/ }),

/***/ "./src/configurationDefaults.ts":
/*!**************************************!*\
  !*** ./src/configurationDefaults.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ConfigurationDefaults: () => (/* binding */ ConfigurationDefaults)
/* harmony export */ });
/* harmony import */ var _utilities_localize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utilities/localize */ "./src/utilities/localize.ts");

/**
 * Default configuration for the mushroom strategy.
 */
const ConfigurationDefaults = {
    areas: {
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
            name: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_0__.localize)('generic.undisclosed'),
            picture: null,
            temperature_entity_id: null,
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
            showControls: true,
        },
        binary_sensor: {
            title: `${(0,_utilities_localize__WEBPACK_IMPORTED_MODULE_0__.localize)('sensor.binary')} ` + (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_0__.localize)('sensor.sensors'),
            showControls: false,
            hidden: false,
        },
        camera: {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_0__.localize)('camera.cameras'),
            showControls: false,
            hidden: false,
        },
        climate: {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_0__.localize)('climate.climates'),
            showControls: false,
            hidden: false,
        },
        cover: {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_0__.localize)('cover.covers'),
            iconOn: 'mdi:arrow-up',
            iconOff: 'mdi:arrow-down',
            onService: 'cover.open_cover',
            offService: 'cover.close_cover',
            hidden: false,
        },
        default: {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_0__.localize)('generic.miscellaneous'),
            showControls: false,
            hidden: false,
        },
        fan: {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_0__.localize)('fan.fans'),
            iconOn: 'mdi:fan',
            iconOff: 'mdi:fan-off',
            onService: 'fan.turn_on',
            offService: 'fan.turn_off',
            hidden: false,
        },
        input_select: {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_0__.localize)('input_select.input_selects'),
            showControls: false,
            hidden: false,
        },
        light: {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_0__.localize)('light.lights'),
            iconOn: 'mdi:lightbulb',
            iconOff: 'mdi:lightbulb-off',
            onService: 'light.turn_on',
            offService: 'light.turn_off',
            hidden: false,
        },
        lock: {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_0__.localize)('lock.locks'),
            showControls: false,
            hidden: false,
        },
        media_player: {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_0__.localize)('media_player.media_players'),
            showControls: false,
            hidden: false,
        },
        number: {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_0__.localize)('generic.numbers'),
            showControls: false,
            hidden: false,
        },
        scene: {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_0__.localize)('scene.scenes'),
            showControls: false,
            onService: 'scene.turn_on',
            hidden: false,
        },
        select: {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_0__.localize)('select.selects'),
            showControls: false,
            hidden: false,
        },
        sensor: {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_0__.localize)('sensor.sensors'),
            showControls: false,
            hidden: false,
        },
        switch: {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_0__.localize)('switch.switches'),
            iconOn: 'mdi:power-plug',
            iconOff: 'mdi:power-plug-off',
            onService: 'switch.turn_on',
            offService: 'switch.turn_off',
            hidden: false,
        },
        vacuum: {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_0__.localize)('vacuum.vacuums'),
            iconOn: 'mdi:robot-vacuum',
            iconOff: 'mdi:robot-vacuum-off',
            onService: 'vacuum.start',
            offService: 'vacuum.stop',
            hidden: false,
        },
    },
    extra_cards: [],
    extra_views: [],
    home_view: {
        hidden: [],
    },
    views: {
        camera: {
            order: 7,
            hidden: false,
        },
        climate: {
            order: 6,
            hidden: false,
        },
        cover: {
            order: 4,
            hidden: false,
        },
        fan: {
            order: 3,
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
        lock: {
            order: 10,
            hidden: false,
        },
        scene: {
            order: 9,
            hidden: false,
        },
        switch: {
            order: 5,
            hidden: false,
        },
        vacuum: {
            order: 8,
            hidden: false,
        },
    },
    quick_access_cards: [],
};


/***/ }),

/***/ "./src/translations/de.json":
/*!**********************************!*\
  !*** ./src/translations/de.json ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"camera":{"all_cameras":"Alle Kameras","cameras":"Kameras"},"climate":{"all_climates":"Alle Klimaanlagen","climates":"Klimaanlagen"},"cover":{"all_covers":"Alle Abdeckungen","covers":"Abdeckungen"},"fan":{"all_fans":"Alle Ventilatoren","fans":"Ventilatoren"},"generic":{"all":"Alle","areas":"Bereiche","busy":"Beschäftigt","good_afternoon":"Guten Nachmittag","good_evening":"Guten Abend","good_morning":"Guten Morgen","hello":"Hallo","home":"Start","miscellaneous":"Sonstiges","numbers":"Zahlen","off":"Aus","on":"Ein","open":"Offen","unavailable":"Nicht verfügbar","unclosed":"Nicht Geschlossen","undisclosed":"Sonstiges","unknown":"Unbekannt"},"input_select":{"input_selects":"Auswahl-Eingaben"},"light":{"all_lights":"Alle Leuchten","lights":"Leuchten"},"lock":{"locked":"Gesperrt","all_locks":"Alle Schlösser","locks":"Schlösser","unlocked":"Entsperrt"},"media_player":{"media_players":"Wiedergabegeräte"},"scene":{"scenes":"Szenen"},"select":{"selects":"Auswahlen"},"sensor":{"binary":"Binäre","sensors":"Sensoren"},"switch":{"all_switches":"Alle Schalter","switches":"Schalter"},"vacuum":{"all_vacuums":"Alle Staubsauger","vacuums":"Staubsauger"},"valve":{"all_valves":"Alle Ventile","valves":"Ventile","open":"Offen","opening":"Öffnet","closed":"Geschlossen","closing":"Schließt","stopped":"Gestoppt"}}');

/***/ }),

/***/ "./src/translations/en.json":
/*!**********************************!*\
  !*** ./src/translations/en.json ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"camera":{"all_cameras":"All Cameras","cameras":"Cameras"},"climate":{"all_climates":"All Climates","climates":"Climates"},"cover":{"all_covers":"All Covers","covers":"Covers"},"fan":{"all_fans":"All Fans","fans":"Fans"},"generic":{"all":"All","areas":"Areas","busy":"Busy","good_afternoon":"Good afternoon","good_evening":"Good evening","good_morning":"Good morning","hello":"Hello","home":"Home","miscellaneous":"Miscellaneous","numbers":"Numbers","off":"Off","on":"On","open":"Open","unavailable":"Unavailable","unclosed":"Unclosed","undisclosed":"Other","unknown":"Unknown"},"input_select":{"input_selects":"Input Selects"},"light":{"all_lights":"All Lights","lights":"Lights"},"lock":{"all_locks":"All Locks","locked":"Locked","locks":"Locks","unlocked":"Unlocked"},"media_player":{"media_players":"Media Players"},"scene":{"scenes":"Scenes"},"select":{"selects":"Selects"},"sensor":{"binary":"Binary","sensors":"Sensors"},"switch":{"all_switches":"All Switches","switches":"Switches"},"vacuum":{"all_vacuums":"All Vacuums","vacuums":"Vacuums"},"valve":{"all_valves":"All Valves","valves":"Valves","open":"Open","opening":"Opening","closed":"Closed","closing":"Closing","stopped":"Stopped"}}');

/***/ }),

/***/ "./src/translations/es.json":
/*!**********************************!*\
  !*** ./src/translations/es.json ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"camera":{"all_cameras":"Todas las Cámaras","cameras":"Cámaras"},"climate":{"all_climates":"Todos los Termostatos","climates":"Termostatos"},"cover":{"all_covers":"Todas las Cubiertas","covers":"Cubiertas"},"fan":{"all_fans":"Todos los Ventiladores","fans":"Ventiladores"},"generic":{"all":"Todo","areas":"Áreas","busy":"Ocupado","good_afternoon":"Buenas tardes","good_evening":"Buenas noches","good_morning":"Buenos días","hello":"Hola","home":"Inicio","miscellaneous":"Varios","numbers":"Números","off":"Apagado","on":"Encendido","open":"Abierto","unavailable":"No Disponible","unclosed":"Sin Cerrar","undisclosed":"Varios","unknown":"Desconocido"},"input_select":{"input_selects":"Selecciones de Entrada"},"light":{"all_lights":"Todas las Luces","lights":"Luces"},"lock":{"all_locks":"Todas las Candados","locked":"Locked","locks":"Candados","unlocked":"Desbloqueado"},"media_player":{"media_players":"Reproductores Multimedia"},"scene":{"scenes":"Scenas"},"select":{"selects":"Seleccionar"},"sensor":{"binary":"Binario","sensors":"Sensores"},"switch":{"all_switches":"Todos los Apagadores","switches":"Apagadores"},"vacuum":{"all_vacuums":"Todas las Aspiradoras","vacuums":"Aspiradoras"},"valve":{"all_valves":"Todas las válvulas","valves":"Válvulas","open":"Abierta","opening":"Abriendo","closed":"Cerrada","closing":"Cerrando","stopped":"Detenida"}}');

/***/ }),

/***/ "./src/translations/nl.json":
/*!**********************************!*\
  !*** ./src/translations/nl.json ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"camera":{"all_cameras":"Alle Cameras","cameras":"Cameras"},"climate":{"all_climates":"Alle Klimaatregelingen","climates":"Klimaatregelingen"},"cover":{"all_covers":"Alle Bedekkingen","covers":"Bedekkingen"},"fan":{"all_fans":"Alle Ventilatoren","fans":"Ventilatoren"},"generic":{"all":"Alle","areas":"Ruimtes","busy":"Bezig","good_afternoon":"Goedemiddag","good_evening":"Goedeavond","good_morning":"Goedemorgen","hello":"Hallo","home":"Start","miscellaneous":"Overige","numbers":"Nummers","off":"Uit","on":"Aan","open":"Open","unavailable":"Onbeschikbaar","unclosed":"Niet Gesloten","undisclosed":"Overige","unknown":"Onbekend"},"input_select":{"input_selects":"Lijsten"},"light":{"all_lights":"Alle Lampen","lights":"Lampen"},"lock":{"all_locks":"Alle Sloten","locked":"Vergrendeld","locks":"Sloten","unlocked":"Ontgrendeld"},"media_player":{"media_players":"Mediaspelers"},"scene":{"scenes":"Scenes"},"select":{"selects":"Statuslijsten"},"sensor":{"binary":"Binaire","sensors":"Sensoren"},"switch":{"all_switches":"Alle Schakelaars","switches":"Schakelaars"},"vacuum":{"all_vacuums":"Alle Afzuiging","vacuums":"Afzuiging"},"valve":{"all_valves":"Alle kleppen","valves":"Kleppen","open":"Open","opening":"Openen","closed":"Gesloten","closing":"Sluiten","stopped":"Gestopt"}}');

/***/ }),

/***/ "./src/translations/pt-BR.json":
/*!*************************************!*\
  !*** ./src/translations/pt-BR.json ***!
  \*************************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"camera":{"all_cameras":"Todas as câmeras","cameras":"Câmeras"},"climate":{"all_climates":"Todos os climatizadores","climates":"Climatizadores"},"cover":{"all_covers":"Todas as persianas","covers":"Persianas"},"fan":{"all_fans":"Todos os ventiladores","fans":"Ventiladores"},"generic":{"all":"Todos","areas":"Áreas","busy":"Ocupado","good_afternoon":"Boa tarde","good_evening":"Boa noite","good_morning":"Bom dia","hello":"Olá","home":"Início","miscellaneous":"Variados","numbers":"Números","off":"Desligado","on":"Ligado","open":"Aberto","unavailable":"Indisponível","unclosed":"Não fechado","undisclosed":"Outro","unknown":"Desconhecido"},"input_select":{"input_selects":"Seleção de entrada"},"light":{"all_lights":"Todas as luzes","lights":"Luzes"},"lock":{"all_locks":"Todas as fechaduras","locked":"Travado","locks":"Fechaduras","unlocked":"Destravado"},"media_player":{"media_players":"Reprodutores de mídia"},"scene":{"scenes":"Cenas"},"select":{"selects":"Seleção"},"sensor":{"binary":"Binário","sensors":"Sensores"},"switch":{"all_switches":"Todos os interruptores","switches":"Interruptores"},"vacuum":{"all_vacuums":"Todos os aspiradores","vacuums":"Aspiradores"},"valve":{"all_valves":"Todas as válvulas","valves":"Válvulas","open":"Aberto","opening":"Abrindo","closed":"Fechado","closing":"Fechando","stopped":"Parado"}}');

/***/ }),

/***/ "./src/types/lovelace-mushroom/cards/vacuum-card-config.ts":
/*!*****************************************************************!*\
  !*** ./src/types/lovelace-mushroom/cards/vacuum-card-config.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VACUUM_COMMANDS: () => (/* binding */ VACUUM_COMMANDS)
/* harmony export */ });
const VACUUM_COMMANDS = ['on_off', 'start_pause', 'stop', 'locate', 'clean_spot', 'return_home'];


/***/ }),

/***/ "./src/types/strategy/strategy-generics.ts":
/*!*************************************************!*\
  !*** ./src/types/strategy/strategy-generics.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isCallServiceActionConfig: () => (/* binding */ isCallServiceActionConfig),
/* harmony export */   isSortable: () => (/* binding */ isSortable),
/* harmony export */   isSupportedChip: () => (/* binding */ isSupportedChip),
/* harmony export */   isSupportedDomain: () => (/* binding */ isSupportedDomain),
/* harmony export */   isSupportedView: () => (/* binding */ isSupportedView)
/* harmony export */ });
/**
 * List of supported domains.
 *
 * This constant array defines the domains that are supported by the strategy.
 * Each domain represents a specific type of entity within the Home Assistant ecosystem.
 *
 * @remarks
 * - `_` refers to all domains.
 * - `default` refers to the miscellaneous domain.
 */
const SUPPORTED_DOMAINS = [
    '_',
    'binary_sensor',
    'camera',
    'climate',
    'cover',
    'default',
    'fan',
    'input_select',
    'light',
    'lock',
    'media_player',
    'number',
    'scene',
    'select',
    'sensor',
    'switch',
    'vacuum',
];
/**
 * List of supported views.
 *
 * This constant array defines the views that are supported by the strategy.
 */
const SUPPORTED_VIEWS = [
    'camera',
    'climate',
    'cover',
    'fan',
    'home',
    'light',
    'lock',
    'scene',
    'switch',
    'vacuum',
];
/**
 * List of supported chips.
 *
 * This constant array defines the chips that are supported by the strategy.
 */
const SUPPORTED_CHIPS = ['light', 'fan', 'cover', 'switch', 'climate', 'weather'];
/**
 * List of home view sections.
 *
 * This constant array defines the sections that are present in the home view.
 */
const HOME_VIEW_SECTIONS = ['areas', 'areasTitle', 'chips', 'greeting', 'persons'];
/**
 * Checks if the given object is of a sortable type.
 *
 * Sortable types are objects that have an `order`, `title` or `name` property.
 *
 * @param {object} object - The object to check.
 * @returns {boolean} - True if the object is an instance of Sortable, false otherwise.
 */
function isSortable(object) {
    return object && ('order' in object || 'title' in object || 'name' in object);
}
/**
 * Type guard to check if an object matches the CallServiceActionConfig interface.
 *
 * @param {ActionConfig} [object] - The object to check.
 * @returns {boolean} - True if the object represents a valid service action configuration.
 */
function isCallServiceActionConfig(object) {
    return (!!object && (object.action === 'perform-action' || object.action === 'call-service') && 'perform_action' in object);
}
/**
 * Type guard to check if a given identifier exists in a list of supported identifiers.
 *
 *
 * @param id The identifier to check
 * @param supportedList The list of valid identifiers
 * @returns True if the identifier exists in the supported list
 *
 * @typeParam T - The type of supported identifiers
 */
function isInSupportedList(id, supportedList) {
    return supportedList.includes(id);
}
/**
 * Type guard to check if the strategy supports a given view identifier.
 *
 * @param {string} id - The view identifier to check (e.g., "light", "climate", "home").
 * @returns {boolean} - True if the identifier represents a supported view type
 */
function isSupportedView(id) {
    return isInSupportedList(id, SUPPORTED_VIEWS);
}
/**
 * Type guard to check if the strategy supports a given domain identifier.
 *
 * @param {string} id - The domain identifier to check (e.g., "light", "climate", "sensor").
 * @returns {boolean} - True if the identifier represents a supported domain.
 *
 * @remarks
 * Special domains:
 * - "_" represents all domains
 * - "default" represents the miscellaneous domain
 */
function isSupportedDomain(id) {
    return isInSupportedList(id, SUPPORTED_DOMAINS);
}
/**
 * Type guard to check if the strategy supports a given chip identifier.
 *
 * @param {string} id - The chip identifier to check (e.g., "light", "climate", "weather").
 * @returns {boolean} - True if the identifier represents a supported chip type.
 */
function isSupportedChip(id) {
    return isInSupportedList(id, SUPPORTED_CHIPS);
}


/***/ }),

/***/ "./src/utilities/RegistryFilter.ts":
/*!*****************************************!*\
  !*** ./src/utilities/RegistryFilter.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Registry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Registry */ "./src/Registry.ts");
/* harmony import */ var _debug__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./debug */ "./src/utilities/debug.ts");
// noinspection JSUnusedGlobalSymbols


/**
 * A class for filtering and sorting arrays of Home Assistant's registry entries.
 *
 * Supports chaining for building complex filter queries.
 *
 * @template T The specific type of RegistryEntry being filtered.
 */
class RegistryFilter {
    /**
     * Creates a RegistryFilter.
     *
     * @param {T[]} entries Registry entries to filter.
     */
    constructor(entries) {
        this.filters = [];
        this.invertNext = false;
        this.entries = entries;
        this.entryIdentifier = (entries.length === 0 || 'entity_id' in entries[0] ? 'entity_id' : 'floor_id' in entries[0] ? 'area_id' : 'id');
    }
    /**
     * Inverts the outcome of the next filter method in the chain.
     *
     * @remarks
     * Double chaining like `.not().not().whereX()` cancels out the inversion for whereX().
     */
    not() {
        this.invertNext = !this.invertNext;
        return this;
    }
    /**
     * Resets the internal filter chain, allowing the instance to be reused for new filtering operations on the same set
     * of entries.
     */
    resetFilters() {
        this.filters = [];
        this.invertNext = false;
        return this;
    }
    /**
     * Adds a custom filter predicate to the filter chain.
     *
     * @param {(entry: T) => boolean} predicate A function that takes a registry entry and returns true if it should be
     *                                          included.
     */
    where(predicate) {
        this.filters.push(this.checkInversion(predicate));
        return this;
    }
    /**
     * Filters entries by their `area_id`.
     *
     * @param {string | undefined} areaId - The area id to match.
     * @param {boolean} [expandToDevice=true] - Whether to evaluate the device's `area_id` (see remarks).
     *
     * @remarks
     * For entries with area id `undisclosed` or `undefined`, the device's `area_id` must also match if `expandToDevice`
     * is `true`.
     */
    whereAreaId(areaId, expandToDevice = true) {
        const predicate = (entry) => {
            let deviceAreaId = undefined;
            const entryObject = entry;
            if (expandToDevice && entryObject.device_id) {
                deviceAreaId = _Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.devices.find((device) => device.id === entryObject.device_id)?.area_id;
            }
            if (areaId === undefined) {
                return entry.area_id === undefined && deviceAreaId === undefined;
            }
            if (entry.area_id === 'undisclosed' || !entry.area_id) {
                return deviceAreaId === areaId;
            }
            return entry.area_id === areaId;
        };
        this.filters.push(this.checkInversion(predicate));
        return this;
    }
    /**
     * Filters entries by whether their name contains a specific subString.
     *
     * It checks different name properties based on the entry type (name, original_name, name_by_user).
     *
     * @param {string} subString The subString to search for in the entry's name.
     */
    whereNameContains(subString) {
        const lowered = subString.toLowerCase();
        const predicate = (entry) => {
            const entryObj = entry;
            return [entryObj.name, entryObj.original_name, entryObj.name_by_user]
                .filter((field) => typeof field === 'string')
                .some((field) => field.toLowerCase().includes(lowered));
        };
        this.filters.push(this.checkInversion(predicate));
        return this;
    }
    /**
     * Filters entities by their domain (e.g., "light", "sensor").
     *
     * @param {string} domain The domain to filter by.
     *                        Entries whose entity_id starts with the domain are kept.
     */
    whereDomain(domain) {
        const prefix = domain + '.';
        const predicate = (entry) => 'entity_id' in entry && entry.entity_id.startsWith(prefix);
        this.filters.push(this.checkInversion(predicate));
        return this;
    }
    /**
     * Filters entries by their floor id.
     *
     * - Entries with a **strictly** matching `floor_id` are kept.
     * - If `floorId` is undefined (or omitted), entries without a `floor_id` property are kept.
     *
     * @param {string | null | undefined} [floorId] The floor id to strictly match.
     */
    whereFloorId(floorId) {
        const predicate = (entry) => {
            const hasFloorId = 'floor_id' in entry;
            return floorId === undefined ? !hasFloorId : hasFloorId && entry.floor_id === floorId;
        };
        this.filters.push(this.checkInversion(predicate));
        return this;
    }
    /**
     * Filters entries by their device id.
     *
     * - Entries with a **strictly** matching `id` or `device_id` are kept.
     * - If `deviceId` is undefined, only entries without both `id` and `device_id` are kept.
     *
     * @param {string | null | undefined} [deviceId] The device id to strictly match.
     */
    whereDeviceId(deviceId) {
        const predicate = (entry) => {
            const hasId = 'id' in entry;
            const hasDeviceId = 'device_id' in entry;
            if (deviceId === undefined) {
                return !hasId && !hasDeviceId;
            }
            return (hasId && entry.id === deviceId) || (hasDeviceId && entry.device_id === deviceId);
        };
        this.filters.push(this.checkInversion(predicate));
        return this;
    }
    /**
     * Filters entities by their id.
     *
     * - Entities with a matching `entity_id` are kept.
     * - If `entityId` is undefined, only entries without an `entity_id` property are kept.
     *
     * @param {string | null | undefined} [entityId] The entity id to match.
     */
    whereEntityId(entityId) {
        const predicate = (entry) => entityId === undefined ? !('entity_id' in entry) : 'entity_id' in entry && entry.entity_id === entityId;
        this.filters.push(this.checkInversion(predicate));
        return this;
    }
    /**
     * Filters entries **strictly** by their `disabled_by` status.
     *
     * @param {EntityRegistryEntry['disabled_by'] | DeviceRegistryEntry['disabled_by'] | undefined} [disabledBy]
     *   The reason the entry was disabled (e.g., "user", "integration", etc.).
     *   Entries with a matching `disabled_by` value are kept.
     *   If `disabledBy` is undefined, only entries without a `disabled_by` property are kept.
     */
    whereDisabledBy(disabledBy) {
        const predicate = (entry) => {
            const hasDisabledBy = 'disabled_by' in entry;
            return disabledBy === undefined ? !hasDisabledBy : hasDisabledBy && entry.disabled_by === disabledBy;
        };
        this.filters.push(this.checkInversion(predicate));
        return this;
    }
    /**
     * Filters entities by their `hidden_by` status.
     *
     * @param {EntityRegistryEntry['hidden_by'] | undefined} [hiddenBy]
     *   The reason the entity was hidden (e.g., "user", "integration", etc.).
     *   Entries with a matching `hidden_by` value are included.
     *   If undefined, only entries without a `hidden_by` property are included.
     */
    whereHiddenBy(hiddenBy) {
        const predicate = (entry) => {
            const hasHiddenBy = 'hidden_by' in entry;
            return hiddenBy === undefined ? !hasHiddenBy : hasHiddenBy && entry.hidden_by === hiddenBy;
        };
        this.filters.push(this.checkInversion(predicate));
        return this;
    }
    /**
     * Filters out entries that are hidden.
     *
     * Optionally, it can also filter out entries that are marked as hidden in the strategy options.
     *
     * @param {boolean} [applyStrategyOptions = true] If true, entries marked as hidden in the strategy options are also
     *                                                filtered out.
     */
    isNotHidden(applyStrategyOptions = true) {
        const predicate = (entry) => {
            const isHiddenByProperty = 'hidden_by' in entry && entry.hidden_by;
            if (!applyStrategyOptions) {
                return !isHiddenByProperty;
            }
            const id = entry[this.entryIdentifier];
            const options = this.entryIdentifier === 'area_id'
                ? { ..._Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.strategyOptions.areas['_'], ..._Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.strategyOptions.areas[id] }
                : _Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.strategyOptions.card_options?.[id];
            const isHiddenByConfig = options?.hidden === true;
            return !isHiddenByProperty && !isHiddenByConfig;
        };
        this.filters.push(this.checkInversion(predicate));
        return this;
    }
    /**
     * Filters entries **strictly** by their `entity_category`.
     *
     * - Without `.not()`: returns only entries where `entity_category` exactly matches the given argument (e.g.,
     *   'config', 'diagnostic', null, or undefined).
     * - With `.not()`: returns all entries where `entity_category` does NOT match the given argument.
     *
     * @param {EntityCategory | null} entityCategory The desired entity_category (e.g., 'config', 'diagnostic', null, or
     *   undefined)
     *
     * @remarks
     * Visibility via the strategy options:
     * - If `hide_{category}_entities: true` is set, entries of that category are NEVER kept, regardless of the filter.
     * - If `hide_{category}_entities: false` is set, entries of that category are ALWAYS kept when filtering for that
     *   category, even when preceded by `.not()`.
     * - If neither is set:
     *   - If preceded by not(), entries of that category are implicitly filtered out.
     *   - Otherwise they are implicitly kept.
     *
     * @example
     *  .whereEntityCategory('config')           // Only 'config' entries (unless explicitly hidden)
     *  .not().whereEntityCategory('diagnostic') // All except 'diagnostic' entries
     *  .whereEntityCategory(null)               // Only entries with 'entity_category: null'
     *  .whereEntityCategory()                   // Only entries without an 'entity_category' field
     */
    whereEntityCategory(entityCategory) {
        const invert = this.invertNext;
        this.invertNext = false;
        const predicate = (entry) => {
            const category = 'entity_category' in entry ? entry.entity_category : undefined;
            const hideOption = typeof category === 'string'
                ? _Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.strategyOptions?.domains?.['_']?.[`hide_${category}_entities`]
                : undefined;
            if (hideOption === true) {
                return false;
            }
            if (hideOption === false && category === entityCategory) {
                return true;
            }
            return invert ? category !== entityCategory : category === entityCategory;
        };
        this.filters.push(predicate);
        return this;
    }
    /**
     * Sort the entries based in priority order of the provided keys.
     *
     * @template K A key to sort by, which must be a key of the registry entry types.
     * @template T The specific type of RegistryEntry being sorted.
     *
     * @param {K[]} keys The keys to sort on, in order of priority.
     * @param {'asc' | 'desc'} [direction='asc'] The sorting direction ('asc' for ascending, 'desc' for descending).
     *
     * @returns {RegistryFilter<T>} A new RegistryFilter instance with the sorted entries and the current filters.
     */
    orderBy(keys, direction = 'asc') {
        const getValue = (entry, keys) => {
            for (const k of keys) {
                const value = entry[k];
                if (value !== null && value !== undefined) {
                    return value;
                }
            }
            return undefined;
        };
        const sortedEntries = [...this.entries].sort((a, b) => {
            const valueA = getValue(a, keys);
            const valueB = getValue(b, keys);
            if (valueA === valueB) {
                return 0;
            }
            const ascendingMultiplier = direction === 'asc' ? 1 : -1;
            if (valueA === undefined || valueA === null) {
                return ascendingMultiplier;
            }
            if (valueB === undefined || valueB === null) {
                return -ascendingMultiplier;
            }
            if (typeof valueA === 'string' && typeof valueB === 'string') {
                return valueA.localeCompare(valueB) * ascendingMultiplier;
            }
            return (valueA < valueB ? -1 : 1) * ascendingMultiplier;
        });
        const newFilter = new RegistryFilter(sortedEntries);
        newFilter.filters = [...this.filters];
        return newFilter;
    }
    /**
     * Takes a specified number of entries from the beginning of the filtered results.
     *
     * @param {number} count The number of entries to take. If negative, defaults to 0.
     */
    take(count) {
        const safeCount = Math.max(0, count);
        this.filters.push((_, index) => index < safeCount);
        return this;
    }
    /**
     * Skips a specified number of entries from the beginning of the filtered results.
     *
     * @param {number} count The number of entries to skip. If negative, defaults to 0.
     */
    skip(count) {
        const safeCount = Math.max(0, count);
        this.filters.push((_, index) => index >= safeCount);
        return this;
    }
    /**
     * Applies all the accumulated filters to the entries and returns the resulting array.
     *
     * @remarks
     * - This method creates a forked (shallow-copied) RegistryFilter instance to ensure immutability.
     * - The original `entries` and `filters` arrays are not mutated or affected by this operation.
     * - This allows chainable and reusable filter logic, so you can call additional filtering methods on the original
     *   instance after calling this method.
     */
    toList() {
        const fork = new RegistryFilter(this.entries);
        fork.filters = [...this.filters];
        return fork.entries.filter((entry, index) => fork.filters.every((filter) => filter(entry, index)));
    }
    /**
     * Retrieves an array of values for a specified property from the filtered entries.
     *
     * @param {keyof T} propertyName - The name of the property whose values are to be retrieved.
     * @returns {Array<T[keyof T]>} An array of values corresponding to the specified property.
     *                               If the property does not exist in any entry, those entries will be filtered out.
     */
    getValuesByProperty(propertyName) {
        const entries = this.toList(); // Call toList to get the full entries
        return entries.map((entry) => entry[propertyName]).filter((value) => value !== undefined);
    }
    /**
     * Applies all the accumulated filters to the entries and returns the first remaining entry.
     *
     * @remarks
     * - This method creates a forked (shallow-copied) RegistryFilter instance to ensure immutability.
     * - The original `entries` and `filters` arrays are not mutated or affected by this operation.
     * - This allows chainable and reusable filter logic, so you can call additional filtering methods on the original
     *   instance after calling this method.
     */
    first() {
        const fork = new RegistryFilter(this.entries);
        fork.filters = [...this.filters];
        return fork.entries.find((entry, index) => fork.filters.every((filter) => filter(entry, index)));
    }
    /**
     * Applies the filters on a forked instance and returns the single matching entry.
     *
     * @remarks
     * - This method creates a forked (shallow-copied) RegistryFilter instance to ensure immutability.
     * - The original `entries` and `filters` arrays are not mutated or affected by this operation.
     */
    single() {
        const fork = new RegistryFilter(this.entries);
        fork.filters = [...this.filters];
        const result = fork.entries.filter((entry, index) => fork.filters.every((filter) => filter(entry, index)));
        if (result.length === 1) {
            return result[0];
        }
        (0,_debug__WEBPACK_IMPORTED_MODULE_1__.logMessage)(_debug__WEBPACK_IMPORTED_MODULE_1__.lvlWarn, `Expected a single element, but found ${result.length}.`);
        return undefined;
    }
    /**
     * Applies the filters on a forked instance and returns the number of matching entries.
     * The original RegistryFilter instance remains unchanged and can be reused for further filtering.
     *
     * @remarks
     * - This method creates a forked (shallow-copied) RegistryFilter instance to ensure immutability.
     * - The original `entries` and `filters` arrays are not mutated or affected by this operation.
     */
    count() {
        const fork = new RegistryFilter(this.entries);
        fork.filters = [...this.filters];
        return fork.entries.filter((entry, index) => fork.filters.every((filter) => filter(entry, index))).length;
    }
    /**
     * Checks the inversion flag set by {@link not} to a filter predicate and applies the inversion if necessary.
     *
     * @param {((entry: T) => boolean)} predicate The filter predicate to apply the inversion to.
     *
     * @returns {((entry: T) => boolean)} The predicate with the inversion applied, or the original predicate if no
     *                                    inversion is to be applied.
     *
     * @private
     */
    checkInversion(predicate) {
        if (this.invertNext) {
            this.invertNext = false;
            return (entry) => !predicate(entry);
        }
        return predicate;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RegistryFilter);


/***/ }),

/***/ "./src/utilities/auxiliaries.ts":
/*!**************************************!*\
  !*** ./src/utilities/auxiliaries.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   deepClone: () => (/* binding */ deepClone),
/* harmony export */   sanitizeClassName: () => (/* binding */ sanitizeClassName)
/* harmony export */ });
/**
 * Sanitize a classname.
 *
 * The name is sanitized by capitalizing the first character of the name or after an underscore.
 * The underscores are removed.
 *
 * @param {string} className Name of the class to sanitize.
 */
function sanitizeClassName(className) {
    return className.replace(/^([a-z])|([-_][a-z])/g, (match) => match.toUpperCase().replace(/[-_]/g, ''));
}
/**
 * Creates a deep clone of the provided value.
 *
 * - It uses the native `structuredClone` if available (supports most built-in types, circular references, etc.).
 * - Falls back to `JSON.parse(JSON.stringify(obj))` for plain objects and arrays if `structuredClone` is unavailable
 *   or fails.
 *
 * @template T
 * @param {T} obj - The value to deep clone.
 * @returns {T} A deep clone of the input value, or the original value if cloning fails.
 */
function deepClone(obj) {
    if (typeof structuredClone === 'function') {
        try {
            return structuredClone(obj);
        }
        catch {
            // Ignore error: fallback to the next method
        }
    }
    try {
        return JSON.parse(JSON.stringify(obj));
    }
    catch {
        return obj;
    }
}


/***/ }),

/***/ "./src/utilities/cardStacking.ts":
/*!***************************************!*\
  !*** ./src/utilities/cardStacking.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   stackHorizontal: () => (/* binding */ stackHorizontal)
/* harmony export */ });
/**
 * Stacks an array of Lovelace card configurations into horizontal stacks based on their type.
 *
 * This method processes sequences of cards with the same type and applies a specified column count
 * for each type of card.
 * It returns a new array of stacked card configurations, preserving the original order of the cards.
 *
 * @param cardConfigurations - An array of Lovelace card configurations to be stacked.
 * @param [columnCounts] - An object mapping card types to their respective column counts.
 *                         If a type is not found in the mapping, it defaults to 2.
 * @returns An array of stacked card configurations, where each configuration is a horizontal stack
 *          containing a specified number of cards.
 *
 * @example
 * ```typescript
 * stackedCards = stackHorizontal(card, {area: 1, "custom:card": 2});
 * ```
 */
function stackHorizontal(cardConfigurations, columnCounts) {
    // Function to process a sequence of cards
    const doStack = (cards, columnCount) => {
        const stackedCardConfigurations = [];
        for (let i = 0; i < cards.length; i += columnCount) {
            stackedCardConfigurations.push({
                type: 'horizontal-stack',
                cards: cards.slice(i, i + columnCount),
            });
        }
        return stackedCardConfigurations;
    };
    // Array to hold the processed cards
    const processedConfigurations = [];
    for (let i = 0; i < cardConfigurations.length;) {
        const currentCard = cardConfigurations[i];
        const currentType = currentCard.type; // Assuming each card has a 'type' property
        // Start a new sequence
        const sequence = [];
        // Collect all cards of the same type into the sequence
        while (i < cardConfigurations.length && cardConfigurations[i].type === currentType) {
            sequence.push(cardConfigurations[i]);
            i++; // Move to the next card
        }
        const columnCount = Math.max(columnCounts?.[currentType] || 2, 1);
        // Process the sequence and add the result to the processedConfigurations array
        processedConfigurations.push(...doStack(sequence, columnCount));
    }
    return processedConfigurations;
}


/***/ }),

/***/ "./src/utilities/debug.ts":
/*!********************************!*\
  !*** ./src/utilities/debug.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DebugLevel: () => (/* binding */ DebugLevel),
/* harmony export */   logMessage: () => (/* binding */ logMessage),
/* harmony export */   lvlDebug: () => (/* binding */ lvlDebug),
/* harmony export */   lvlError: () => (/* binding */ lvlError),
/* harmony export */   lvlFatal: () => (/* binding */ lvlFatal),
/* harmony export */   lvlInfo: () => (/* binding */ lvlInfo),
/* harmony export */   lvlOff: () => (/* binding */ lvlOff),
/* harmony export */   lvlWarn: () => (/* binding */ lvlWarn),
/* harmony export */   setDebugLevel: () => (/* binding */ setDebugLevel)
/* harmony export */ });
/* harmony import */ var _auxiliaries__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./auxiliaries */ "./src/utilities/auxiliaries.ts");

/**
 * Log levels for the debug logger.
 *
 * - Off:   Logging is disabled.
 * - Debug: Diagnostic information that can be helpful for troubleshooting and debugging.
 * - Info:  General information about the status of the system
 * - Warn:  Signal for potential issues that are not necessarily a critical error.
 * - Error: Significant problems that happened in the system.
 * - Fatal: severe conditions that cause the system to terminate or operate in a significantly degraded state.
 */
var DebugLevel;
(function (DebugLevel) {
    DebugLevel[DebugLevel["Off"] = 0] = "Off";
    DebugLevel[DebugLevel["Debug"] = 1] = "Debug";
    DebugLevel[DebugLevel["Info"] = 2] = "Info";
    DebugLevel[DebugLevel["Warn"] = 3] = "Warn";
    DebugLevel[DebugLevel["Error"] = 4] = "Error";
    DebugLevel[DebugLevel["Fatal"] = 5] = "Fatal";
})(DebugLevel || (DebugLevel = {}));
// noinspection JSUnusedGlobalSymbols
/**
 * Individually exported log level constants.
 *
 * @see DebugLevel
 */
const { Off: lvlOff, Debug: lvlDebug, Info: lvlInfo, Warn: lvlWarn, Error: lvlError, Fatal: lvlFatal, } = DebugLevel;
/**
 * The current global log level.
 *
 * Only messages with a level less than or equal to this will be logged.
 *
 * @default DebugLevel.Off
 */
let currentLevel = DebugLevel.Fatal;
/**
 * Extracts the name of the function or method that called the logger from a stack trace string.
 *
 * Handles both Chrome and Firefox stack trace formats:
 * - Chrome: "at ClassName.methodName (url:line:column)"
 * - Firefox: "methodName@url:line:column"
 *
 * Returns the full caller (including class, if available), or "unknown" if not found.
 *
 * @param stack - The stack trace string, typically from new Error().stack
 * @returns The caller's function/method name (with class if available), or "unknown"
 */
function getCallerName(stack) {
    if (!stack) {
        return 'unknown';
    }
    const lines = stack.split('\n').filter(Boolean);
    // Find the first line that contains '@' and is not logMessage itself
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.includes('@') && !line.startsWith('logMessage')) {
            return line.split('@')[0] || 'anonymous';
        }
        // Fallback for anonymous functions
        if (line.startsWith('@')) {
            return 'anonymous function';
        }
    }
    // Chrome fallback
    for (let i = 1; i < lines.length; i++) {
        const match = lines[i].match(/at ([^( ]+)/);
        if (match && match[1] && match[1] !== 'logMessage') {
            return match[1];
        }
    }
    return 'unknown function';
}
/**
 * Sets the global log level.
 *
 * @param {DebugLevel} level - The maximum level to log.
 * @see DebugLevel
 */
function setDebugLevel(level) {
    currentLevel = level;
}
/**
 * Logs a message in the console at the specified level if allowed by the current global log level.
 *
 * Only messages with a level less than or equal to the currentLevel are logged.
 *
 * @param {DebugLevel} level - The severity of the message.
 * @param {string} message - The message to log.
 * @param {unknown[]} [details] - Optional extra details (e.g., error object).
 *
 * @throws {Error} After logging, if the level is `lvlError` or `lvlFatal`.
 *
 * @remarks
 * It might be required to throw an additional Error after logging with `lvlError ` or `lvlFatal` to satify the
 * TypeScript compiler.
 */
function logMessage(level, message, ...details) {
    if (currentLevel === DebugLevel.Off || level > currentLevel) {
        return;
    }
    const frontEndMessage = 'Mushroom Strategy - An error occurred. Check the console (F12) for details.';
    const prefix = `[${DebugLevel[level].toUpperCase()}]`;
    const safeDetails = details.map(_auxiliaries__WEBPACK_IMPORTED_MODULE_0__.deepClone);
    const caller = `[at ${getCallerName(new Error().stack)}]`;
    switch (level) {
        case DebugLevel.Debug:
            console.debug(`${prefix}${caller} ${message}`, ...safeDetails);
            break;
        case DebugLevel.Info:
            console.info(`${prefix}${caller} ${message}`, ...safeDetails);
            break;
        case DebugLevel.Warn:
            console.warn(`${prefix}${caller} ${message}`, ...safeDetails);
            break;
        case DebugLevel.Error:
            console.error(`${prefix}${caller} ${message}`, ...safeDetails);
            throw frontEndMessage;
        case DebugLevel.Fatal:
            console.error(`${prefix}${caller} ${message}`, ...safeDetails);
            alert?.(`${prefix} ${message}`);
            throw frontEndMessage;
    }
}


/***/ }),

/***/ "./src/utilities/localize.ts":
/*!***********************************!*\
  !*** ./src/utilities/localize.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
var _translations_de_json__WEBPACK_IMPORTED_MODULE_0___namespace_cache;
var _translations_en_json__WEBPACK_IMPORTED_MODULE_1___namespace_cache;
var _translations_es_json__WEBPACK_IMPORTED_MODULE_2___namespace_cache;
var _translations_nl_json__WEBPACK_IMPORTED_MODULE_3___namespace_cache;
var _translations_pt_BR_json__WEBPACK_IMPORTED_MODULE_4___namespace_cache;
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ setupCustomLocalize),
/* harmony export */   localize: () => (/* binding */ localize)
/* harmony export */ });
/* harmony import */ var _translations_de_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../translations/de.json */ "./src/translations/de.json");
/* harmony import */ var _translations_en_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../translations/en.json */ "./src/translations/en.json");
/* harmony import */ var _translations_es_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../translations/es.json */ "./src/translations/es.json");
/* harmony import */ var _translations_nl_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../translations/nl.json */ "./src/translations/nl.json");
/* harmony import */ var _translations_pt_BR_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../translations/pt-BR.json */ "./src/translations/pt-BR.json");
/* harmony import */ var _debug__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./debug */ "./src/utilities/debug.ts");






/** Registry of currently supported languages */
const languages = {
    de: /*#__PURE__*/ (_translations_de_json__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_translations_de_json__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_translations_de_json__WEBPACK_IMPORTED_MODULE_0__, 2))),
    en: /*#__PURE__*/ (_translations_en_json__WEBPACK_IMPORTED_MODULE_1___namespace_cache || (_translations_en_json__WEBPACK_IMPORTED_MODULE_1___namespace_cache = __webpack_require__.t(_translations_en_json__WEBPACK_IMPORTED_MODULE_1__, 2))),
    es: /*#__PURE__*/ (_translations_es_json__WEBPACK_IMPORTED_MODULE_2___namespace_cache || (_translations_es_json__WEBPACK_IMPORTED_MODULE_2___namespace_cache = __webpack_require__.t(_translations_es_json__WEBPACK_IMPORTED_MODULE_2__, 2))),
    nl: /*#__PURE__*/ (_translations_nl_json__WEBPACK_IMPORTED_MODULE_3___namespace_cache || (_translations_nl_json__WEBPACK_IMPORTED_MODULE_3___namespace_cache = __webpack_require__.t(_translations_nl_json__WEBPACK_IMPORTED_MODULE_3__, 2))),
    'pt-BR': /*#__PURE__*/ (_translations_pt_BR_json__WEBPACK_IMPORTED_MODULE_4___namespace_cache || (_translations_pt_BR_json__WEBPACK_IMPORTED_MODULE_4___namespace_cache = __webpack_require__.t(_translations_pt_BR_json__WEBPACK_IMPORTED_MODULE_4__, 2))),
};
/** The fallback language if the user-defined language isn't defined */
const DEFAULT_LANG = 'en';
/**
 * Get a string by keyword and language.
 *
 * @param {string} key The key to look for in the object notation of the language file (E.g., `generic.home`).
 * @param {string} lang The language to get the string from (E.g., `en`).
 *
 * @returns {string | undefined} The requested string or undefined if the keyword doesn't exist/on error.
 */
function getTranslatedString(key, lang) {
    try {
        return key.split('.').reduce((o, i) => o[i], languages[lang]);
    }
    catch {
        return undefined;
    }
}
/**
 * Singleton instance of the localization function.
 *
 * This variable is set by {@link setupCustomLocalize} and used by {@link localize}.
 *
 * - Must be initialized before {@link localize} is called.
 * - Holds a closure that translates keys based on the language set during setup.
 *
 * @private
 */
let _localize = undefined;
/**
 * Set up the localization.
 *
 * It reads the user-defined language with a fall-back to English and returns a function to get strings from
 * language-files by keyword.
 *
 * If the keyword is undefined, or on an error, the keyword itself is returned.
 *
 * @param {HomeAssistant} hass The Home Assistant object.
 */
function setupCustomLocalize(hass) {
    const lang = hass?.locale.language ?? DEFAULT_LANG;
    _localize = (key) => getTranslatedString(key, lang) ?? getTranslatedString(key, DEFAULT_LANG) ?? key;
}
/**
 * Translate a key using the globally configured localize function.
 */
function localize(key) {
    if (!_localize) {
        (0,_debug__WEBPACK_IMPORTED_MODULE_5__.logMessage)(_debug__WEBPACK_IMPORTED_MODULE_5__.lvlWarn, 'localize is not initialized! Call setupCustomLocalize first.');
        return key;
    }
    return _localize(key);
}


/***/ }),

/***/ "./src/views lazy recursive ^\\.\\/.*$":
/*!***************************************************!*\
  !*** ./src/views/ lazy ^\.\/.*$ namespace object ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./AbstractView": [
		"./src/views/AbstractView.ts",
		"main"
	],
	"./AbstractView.ts": [
		"./src/views/AbstractView.ts",
		"main"
	],
	"./CameraView": [
		"./src/views/CameraView.ts",
		"main"
	],
	"./CameraView.ts": [
		"./src/views/CameraView.ts",
		"main"
	],
	"./ClimateView": [
		"./src/views/ClimateView.ts",
		"main"
	],
	"./ClimateView.ts": [
		"./src/views/ClimateView.ts",
		"main"
	],
	"./CoverView": [
		"./src/views/CoverView.ts",
		"main"
	],
	"./CoverView.ts": [
		"./src/views/CoverView.ts",
		"main"
	],
	"./FanView": [
		"./src/views/FanView.ts",
		"main"
	],
	"./FanView.ts": [
		"./src/views/FanView.ts",
		"main"
	],
	"./HomeView": [
		"./src/views/HomeView.ts",
		"main"
	],
	"./HomeView.ts": [
		"./src/views/HomeView.ts",
		"main"
	],
	"./LightView": [
		"./src/views/LightView.ts",
		"main"
	],
	"./LightView.ts": [
		"./src/views/LightView.ts",
		"main"
	],
	"./LockView": [
		"./src/views/LockView.ts",
		"main"
	],
	"./LockView.ts": [
		"./src/views/LockView.ts",
		"main"
	],
	"./SceneView": [
		"./src/views/SceneView.ts",
		"main"
	],
	"./SceneView.ts": [
		"./src/views/SceneView.ts",
		"main"
	],
	"./SwitchView": [
		"./src/views/SwitchView.ts",
		"main"
	],
	"./SwitchView.ts": [
		"./src/views/SwitchView.ts",
		"main"
	],
	"./VacuumView": [
		"./src/views/VacuumView.ts",
		"main"
	],
	"./VacuumView.ts": [
		"./src/views/VacuumView.ts",
		"main"
	]
};
function webpackAsyncContext(req) {
	if(!__webpack_require__.o(map, req)) {
		return Promise.resolve().then(() => {
			var e = new Error("Cannot find module '" + req + "'");
			e.code = 'MODULE_NOT_FOUND';
			throw e;
		});
	}

	var ids = map[req], id = ids[0];
	return __webpack_require__.e(ids[1]).then(() => {
		return __webpack_require__(id);
	});
}
webpackAsyncContext.keys = () => (Object.keys(map));
webpackAsyncContext.id = "./src/views lazy recursive ^\\.\\/.*$";
module.exports = webpackAsyncContext;

/***/ }),

/***/ "./src/views/AbstractView.ts":
/*!***********************************!*\
  !*** ./src/views/AbstractView.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cards_HeaderCard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../cards/HeaderCard */ "./src/cards/HeaderCard.ts");
/* harmony import */ var _Registry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Registry */ "./src/Registry.ts");
/* harmony import */ var _utilities_auxiliaries__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utilities/auxiliaries */ "./src/utilities/auxiliaries.ts");
/* harmony import */ var _utilities_debug__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utilities/debug */ "./src/utilities/debug.ts");
/* harmony import */ var _utilities_RegistryFilter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utilities/RegistryFilter */ "./src/utilities/RegistryFilter.ts");





/**
 * Abstract View Class.
 *
 * To create a view configuration, this class should be extended by a child class.
 * Child classes should override the default configuration so the view correctly reflects the entities of a domain.
 *
 * @remarks
 * Before this class can be used, the Registry module must be initialized by calling {@link Registry.initialize}.
 */
class AbstractView {
    get domain() {
        return this.constructor.domain;
    }
    /**
     * Class constructor.
     *
     * @remarks
     * Before this class can be used, the Registry module must be initialized by calling {@link Registry.initialize}.
     */
    constructor() {
        /** The base configuration of a view. */
        this.baseConfiguration = {
            icon: 'mdi:view-dashboard',
            subview: false,
        };
        /** A card configuration to control all entities in the view. */
        this.viewHeaderCardConfiguration = {
            cards: [],
            type: '',
        };
        if (!_Registry__WEBPACK_IMPORTED_MODULE_1__.Registry.initialized) {
            (0,_utilities_debug__WEBPACK_IMPORTED_MODULE_3__.logMessage)(_utilities_debug__WEBPACK_IMPORTED_MODULE_3__.lvlFatal, 'Registry not initialized!');
        }
    }
    /**
     * Create the configuration of the cards to include in the view.
     */
    async createCardConfigurations() {
        const viewCards = [];
        const moduleName = (0,_utilities_auxiliaries__WEBPACK_IMPORTED_MODULE_2__.sanitizeClassName)(this.domain + 'Card');
        const DomainCard = (await __webpack_require__("./src/cards lazy recursive ^\\.\\/.*$")(`./${moduleName}`)).default;
        const domainEntities = new _utilities_RegistryFilter__WEBPACK_IMPORTED_MODULE_4__["default"](_Registry__WEBPACK_IMPORTED_MODULE_1__.Registry.entities)
            .whereDomain(this.domain)
            .where((entity) => !entity.entity_id.endsWith('_stateful_scene'))
            .toList();
        // Create card configurations for each area.
        for (const area of _Registry__WEBPACK_IMPORTED_MODULE_1__.Registry.areas) {
            const areaCards = [];
            // Set the target of the Header card to the current area.
            let target = {
                area_id: [area.area_id],
            };
            const areaEntities = new _utilities_RegistryFilter__WEBPACK_IMPORTED_MODULE_4__["default"](domainEntities).whereAreaId(area.area_id).toList();
            // Set the target of the Header card to entities without an area.
            if (area.area_id === 'undisclosed') {
                target = {
                    entity_id: areaEntities.map((entity) => entity.entity_id),
                };
            }
            // Create a card configuration for each entity in the current area.
            areaCards.push(...areaEntities.map((entity) => new DomainCard(entity, _Registry__WEBPACK_IMPORTED_MODULE_1__.Registry.strategyOptions.card_options?.[entity.entity_id]).getCard()));
            // Vertically stack the cards of the current area.
            if (areaCards.length) {
                // Create and insert a Header card.
                const areaHeaderCardOptions = ('headerCardConfiguration' in this.baseConfiguration ? this.baseConfiguration.headerCardConfiguration : {});
                areaCards.unshift(new _cards_HeaderCard__WEBPACK_IMPORTED_MODULE_0__["default"](target, { title: area.name, ...areaHeaderCardOptions }).createCard());
                viewCards.push({ type: 'vertical-stack', cards: areaCards });
            }
        }
        // Add a Header Card to control all the entities in the view.
        if (this.viewHeaderCardConfiguration.cards.length && viewCards.length) {
            viewCards.unshift(this.viewHeaderCardConfiguration);
        }
        return viewCards;
    }
    /**
     * Get a view configuration.
     *
     * The configuration includes the card configurations which are created by createCardConfigurations().
     */
    async getView() {
        return {
            ...this.baseConfiguration,
            cards: await this.createCardConfigurations(),
        };
    }
    /**
     * Get the domain's entity ids to target for a HASS service call.
     */
    getDomainTargets() {
        return {
            entity_id: _Registry__WEBPACK_IMPORTED_MODULE_1__.Registry.entities
                .filter((entity) => entity.entity_id.startsWith(this.domain + '.'))
                .map((entity) => entity.entity_id),
        };
    }
    /**
     * Initialize the view configuration with defaults and custom settings.
     *
     * @param viewConfiguration The view's default configuration for the view.
     * @param customConfiguration The view's custom configuration to apply.
     * @param headerCardConfig The view's Header card configuration.
     */
    initializeViewConfig(viewConfiguration, customConfiguration = {}, headerCardConfig) {
        this.baseConfiguration = { ...this.baseConfiguration, ...viewConfiguration, ...customConfiguration };
        this.baseConfiguration.headerCardConfiguration = {
            showControls: _Registry__WEBPACK_IMPORTED_MODULE_1__.Registry.strategyOptions.domains[this.domain]?.showControls ??
                _Registry__WEBPACK_IMPORTED_MODULE_1__.Registry.strategyOptions.domains['_'].showControls,
        };
        this.viewHeaderCardConfiguration = new _cards_HeaderCard__WEBPACK_IMPORTED_MODULE_0__["default"](this.getDomainTargets(), {
            ...this.baseConfiguration.headerCardConfiguration,
            ...headerCardConfig,
        }).createCard();
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AbstractView);


/***/ }),

/***/ "./src/views/CameraView.ts":
/*!*********************************!*\
  !*** ./src/views/CameraView.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Registry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Registry */ "./src/Registry.ts");
/* harmony import */ var _utilities_localize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utilities/localize */ "./src/utilities/localize.ts");
/* harmony import */ var _AbstractView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AbstractView */ "./src/views/AbstractView.ts");
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.



/**
 * Camera View Class.
 *
 * Used to create a view configuration for entities of the camera domain.
 */
class CameraView extends _AbstractView__WEBPACK_IMPORTED_MODULE_2__["default"] {
    /** Returns the default configuration object for the view. */
    static getDefaultConfig() {
        return {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('camera.cameras'),
            path: 'cameras',
            icon: 'mdi:cctv',
            subview: false,
            headerCardConfiguration: {
                showControls: false, // FIXME: This should be named "show_controls". Also in other files and Wiki.
            },
        };
    }
    /** Returns the default configuration of the view's Header card. */
    static getViewHeaderCardConfig() {
        return {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('camera.all_cameras'),
            subtitle: `${_Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.getCountTemplate(CameraView.domain, 'ne', 'off')} ${(0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('camera.cameras')} ` +
                (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('generic.busy'),
        };
    }
    /**
     * Class constructor.
     *
     * @param {ViewConfig} [customConfiguration] Custom view configuration.
     */
    constructor(customConfiguration) {
        super();
        this.initializeViewConfig(CameraView.getDefaultConfig(), customConfiguration, CameraView.getViewHeaderCardConfig());
    }
}
/** The domain of the entities that the view is representing. */
CameraView.domain = 'camera';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CameraView);


/***/ }),

/***/ "./src/views/ClimateView.ts":
/*!**********************************!*\
  !*** ./src/views/ClimateView.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Registry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Registry */ "./src/Registry.ts");
/* harmony import */ var _utilities_localize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utilities/localize */ "./src/utilities/localize.ts");
/* harmony import */ var _AbstractView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AbstractView */ "./src/views/AbstractView.ts");
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.



/**
 * Climate View Class.
 *
 * Used to create a view configuration for entities of the climate domain.
 */
class ClimateView extends _AbstractView__WEBPACK_IMPORTED_MODULE_2__["default"] {
    /** Returns the default configuration object for the view. */
    static getDefaultConfig() {
        return {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('climate.climates'),
            path: 'climates',
            icon: 'mdi:thermostat',
            subview: false,
            headerCardConfiguration: {
                showControls: false,
            },
        };
    }
    /** Returns the default configuration of the view's Header card. */
    static getViewHeaderCardConfig() {
        return {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('climate.all_climates'),
            subtitle: `${_Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.getCountTemplate(ClimateView.domain, 'ne', 'off')} ${(0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('climate.climates')} ` +
                (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('generic.busy'),
        };
    }
    /**
     * Class constructor.
     *
     * @param {ViewConfig} [customConfiguration] Custom view configuration.
     */
    constructor(customConfiguration) {
        super();
        this.initializeViewConfig(ClimateView.getDefaultConfig(), customConfiguration, ClimateView.getViewHeaderCardConfig());
    }
}
/**The domain of the entities that the view is representing. */
ClimateView.domain = 'climate';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ClimateView);


/***/ }),

/***/ "./src/views/CoverView.ts":
/*!********************************!*\
  !*** ./src/views/CoverView.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Registry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Registry */ "./src/Registry.ts");
/* harmony import */ var _utilities_localize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utilities/localize */ "./src/utilities/localize.ts");
/* harmony import */ var _AbstractView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AbstractView */ "./src/views/AbstractView.ts");
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.



/**
 * Cover View Class.
 *
 * Used to create a view configuration for entities of the cover domain.
 */
class CoverView extends _AbstractView__WEBPACK_IMPORTED_MODULE_2__["default"] {
    /** Returns the default configuration object for the view. */
    static getDefaultConfig() {
        return {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('cover.covers'),
            path: 'covers',
            icon: 'mdi:window-open',
            subview: false,
            headerCardConfiguration: {
                iconOn: 'mdi:arrow-up',
                iconOff: 'mdi:arrow-down',
                onService: 'cover.open_cover',
                offService: 'cover.close_cover',
            },
        };
    }
    /** Returns the default configuration of the view's Header card. */
    static getViewHeaderCardConfig() {
        return {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('cover.all_covers'),
            subtitle: `${_Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.getCountTemplate(CoverView.domain, 'search', '(open|opening|closing)')} ` +
                `${(0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('cover.covers')} ` +
                `${(0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('generic.unclosed')}`,
        };
    }
    /**
     * Class constructor.
     *
     * @param {ViewConfig} [customConfiguration] Custom view configuration.
     */
    constructor(customConfiguration) {
        super();
        this.initializeViewConfig(CoverView.getDefaultConfig(), customConfiguration, CoverView.getViewHeaderCardConfig());
    }
}
/** The domain of the entities that the view is representing. */
CoverView.domain = 'cover';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CoverView);


/***/ }),

/***/ "./src/views/FanView.ts":
/*!******************************!*\
  !*** ./src/views/FanView.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Registry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Registry */ "./src/Registry.ts");
/* harmony import */ var _utilities_localize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utilities/localize */ "./src/utilities/localize.ts");
/* harmony import */ var _AbstractView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AbstractView */ "./src/views/AbstractView.ts");
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.



/**
 * Fan View Class.
 *
 * Used to create a view configuration for entities of the fan domain.
 */
class FanView extends _AbstractView__WEBPACK_IMPORTED_MODULE_2__["default"] {
    /** Returns the default configuration object for the view. */
    static getDefaultConfig() {
        return {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('fan.fans'),
            path: 'fans',
            icon: 'mdi:fan',
            subview: false,
            headerCardConfiguration: {
                iconOn: 'mdi:fan',
                iconOff: 'mdi:fan-off',
                onService: 'fan.turn_on',
                offService: 'fan.turn_off',
            },
        };
    }
    /** Returns the default configuration of the view's Header card. */
    static getViewHeaderCardConfig() {
        return {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('fan.all_fans'),
            subtitle: `${_Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.getCountTemplate(FanView.domain, 'eq', 'on')} ${(0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('fan.fans')} ` + (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('generic.on'),
        };
    }
    /**
     * Class constructor.
     *
     * @param {ViewConfig} [customConfiguration] Custom view configuration.
     */
    constructor(customConfiguration) {
        super();
        this.initializeViewConfig(FanView.getDefaultConfig(), customConfiguration, FanView.getViewHeaderCardConfig());
    }
}
/** The domain of the entities that the view is representing. */
FanView.domain = 'fan';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FanView);


/***/ }),

/***/ "./src/views/HomeView.ts":
/*!*******************************!*\
  !*** ./src/views/HomeView.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Registry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Registry */ "./src/Registry.ts");
/* harmony import */ var _types_strategy_strategy_generics__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../types/strategy/strategy-generics */ "./src/types/strategy/strategy-generics.ts");
/* harmony import */ var _utilities_auxiliaries__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utilities/auxiliaries */ "./src/utilities/auxiliaries.ts");
/* harmony import */ var _utilities_debug__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utilities/debug */ "./src/utilities/debug.ts");
/* harmony import */ var _utilities_localize__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utilities/localize */ "./src/utilities/localize.ts");
/* harmony import */ var _AbstractView__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./AbstractView */ "./src/views/AbstractView.ts");
/* harmony import */ var _utilities_RegistryFilter__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utilities/RegistryFilter */ "./src/utilities/RegistryFilter.ts");
/* harmony import */ var _utilities_cardStacking__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utilities/cardStacking */ "./src/utilities/cardStacking.ts");
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.








/**
 * Home View Class.
 *
 * Used to create a Home view.
 */
class HomeView extends _AbstractView__WEBPACK_IMPORTED_MODULE_5__["default"] {
    /** Returns the default configuration object for the view. */
    static getDefaultConfig() {
        return {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_4__.localize)('generic.home'),
            icon: 'mdi:home-assistant',
            path: 'home',
            subview: false,
        };
    }
    /**
     * Class constructor.
     *
     * @param {ViewConfig} [customConfiguration] Custom view configuration.
     */
    constructor(customConfiguration) {
        super();
        this.baseConfiguration = { ...this.baseConfiguration, ...HomeView.getDefaultConfig(), ...customConfiguration };
    }
    /**
     * Create the configuration of the cards to include in the view.
     *
     * @override
     */
    async createCardConfigurations() {
        const homeViewCards = [];
        let chipsSection, personsSection, areasSection;
        try {
            [chipsSection, personsSection, areasSection] = await Promise.all([
                this.createChipsSection(),
                this.createPersonsSection(),
                this.createAreasSection(),
            ]);
        }
        catch (e) {
            (0,_utilities_debug__WEBPACK_IMPORTED_MODULE_3__.logMessage)(_utilities_debug__WEBPACK_IMPORTED_MODULE_3__.lvlError, 'Error importing created sections!', e);
            return homeViewCards;
        }
        if (chipsSection) {
            homeViewCards.push(chipsSection);
        }
        if (personsSection) {
            homeViewCards.push(personsSection);
        }
        // Create the greeting section.
        if (!_Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.strategyOptions.home_view.hidden.includes('greeting')) {
            homeViewCards.push({
                type: 'custom:mushroom-template-card',
                primary: `{% set time = now().hour %}
           {% if (time >= 18) %}
             ${(0,_utilities_localize__WEBPACK_IMPORTED_MODULE_4__.localize)('generic.good_evening')},{{user}}!
           {% elif (time >= 12) %}
             ${(0,_utilities_localize__WEBPACK_IMPORTED_MODULE_4__.localize)('generic.good_afternoon')}, {{user}}!
           {% elif (time >= 6) %}
             ${(0,_utilities_localize__WEBPACK_IMPORTED_MODULE_4__.localize)('generic.good_morning')}, {{user}}!
           {% else %}
             ${(0,_utilities_localize__WEBPACK_IMPORTED_MODULE_4__.localize)('generic.hello')}, {{user}}! {% endif %}`,
                icon: 'mdi:hand-wave',
                icon_color: 'orange',
                tap_action: {
                    action: 'none',
                },
                double_tap_action: {
                    action: 'none',
                },
                hold_action: {
                    action: 'none',
                },
            });
        }
        if (_Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.strategyOptions.quick_access_cards) {
            homeViewCards.push(..._Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.strategyOptions.quick_access_cards);
        }
        if (areasSection) {
            homeViewCards.push(areasSection);
        }
        if (_Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.strategyOptions.extra_cards) {
            homeViewCards.push(..._Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.strategyOptions.extra_cards);
        }
        return homeViewCards;
    }
    /**
     * Create a chip section to include in the view
     *
     * If the section is marked as hidden in the strategy option, then the section is not created.
     */
    async createChipsSection() {
        if (_Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.strategyOptions.home_view.hidden.includes('chips')) {
            // The section is hidden.
            return;
        }
        const chipConfigurations = [];
        const exposedChips = _Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.getExposedNames('chip');
        let Chip;
        // Weather chip.
        // FIXME: It's not possible to hide the weather chip in the configuration.
        const weatherEntityId = _Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.strategyOptions.chips.weather_entity === 'auto'
            ? _Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.entities.find((entity) => entity.entity_id.startsWith('weather.'))?.entity_id
            : _Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.strategyOptions.chips.weather_entity;
        if (weatherEntityId) {
            try {
                Chip = (await Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ../chips/WeatherChip */ "./src/chips/WeatherChip.ts"))).default;
                const weatherChip = new Chip(weatherEntityId);
                chipConfigurations.push(weatherChip.getChipConfiguration());
            }
            catch (e) {
                (0,_utilities_debug__WEBPACK_IMPORTED_MODULE_3__.logMessage)(_utilities_debug__WEBPACK_IMPORTED_MODULE_3__.lvlError, 'Error importing chip weather!', e);
            }
        }
        else {
            (0,_utilities_debug__WEBPACK_IMPORTED_MODULE_3__.logMessage)(_utilities_debug__WEBPACK_IMPORTED_MODULE_3__.lvlInfo, 'Weather chip has no entities available.');
        }
        // Numeric chips.
        for (const chipName of exposedChips) {
            if (!(0,_types_strategy_strategy_generics__WEBPACK_IMPORTED_MODULE_1__.isSupportedChip)(chipName) || !new _utilities_RegistryFilter__WEBPACK_IMPORTED_MODULE_6__["default"](_Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.entities).whereDomain(chipName).count()) {
                (0,_utilities_debug__WEBPACK_IMPORTED_MODULE_3__.logMessage)(_utilities_debug__WEBPACK_IMPORTED_MODULE_3__.lvlInfo, `Chip for domain ${chipName} is unsupported or has no entities available.`);
                continue;
            }
            const moduleName = (0,_utilities_auxiliaries__WEBPACK_IMPORTED_MODULE_2__.sanitizeClassName)(chipName + 'Chip');
            try {
                Chip = (await __webpack_require__("./src/chips lazy recursive ^\\.\\/.*$")(`./${moduleName}`)).default;
                const currentChip = new Chip();
                chipConfigurations.push(currentChip.getChipConfiguration());
            }
            catch (e) {
                (0,_utilities_debug__WEBPACK_IMPORTED_MODULE_3__.logMessage)(_utilities_debug__WEBPACK_IMPORTED_MODULE_3__.lvlError, `Error importing chip ${chipName}!`, e);
            }
        }
        // Add extra chips.
        if (_Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.strategyOptions.chips?.extra_chips) {
            chipConfigurations.push(..._Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.strategyOptions.chips.extra_chips);
        }
        return {
            type: 'custom:mushroom-chips-card',
            alignment: 'center',
            chips: chipConfigurations,
        };
    }
    /**
     * Create a persons section to include in the view.
     *
     * If the section is marked as hidden in the strategy option, then the section is not created.
     */
    async createPersonsSection() {
        if (_Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.strategyOptions.home_view.hidden.includes('persons')) {
            // The section is hidden.
            return;
        }
        const cardConfigurations = [];
        const PersonCard = (await Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ../cards/PersonCard */ "./src/cards/PersonCard.ts"))).default;
        cardConfigurations.push(..._Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.entities
            .filter((entity) => entity.entity_id.startsWith('person.'))
            .map((person) => new PersonCard(person).getCard()));
        return {
            type: 'vertical-stack',
            cards: (0,_utilities_cardStacking__WEBPACK_IMPORTED_MODULE_7__.stackHorizontal)(cardConfigurations),
        };
    }
    /**
     * Create the area cards to include in the view.
     *
     * Area cards are grouped into two areas per row.
     * If the section is marked as hidden in the strategy option, then the section is not created.
     */
    async createAreasSection() {
        if (_Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.strategyOptions.home_view.hidden.includes('areas')) {
            // Areas section is hidden.
            return;
        }
        const cardConfigurations = [];
        for (const area of _Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.areas) {
            const moduleName = _Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.strategyOptions.areas[area.area_id]?.type ?? _Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.strategyOptions.areas['_']?.type ?? 'default';
            let AreaCard;
            try {
                AreaCard = (await __webpack_require__("./src/cards lazy recursive ^\\.\\/.*$")(`./${moduleName}`)).default;
            }
            catch (e) {
                // Fallback to the default strategy card.
                AreaCard = (await Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ../cards/AreaCard */ "./src/cards/AreaCard.ts"))).default;
                if (_Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.strategyOptions.debug && moduleName !== 'default') {
                    (0,_utilities_debug__WEBPACK_IMPORTED_MODULE_3__.logMessage)(_utilities_debug__WEBPACK_IMPORTED_MODULE_3__.lvlError, `Error importing ${moduleName}: card!`, e);
                }
            }
            cardConfigurations.push(new AreaCard(area, {
                ..._Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.strategyOptions.areas['_'],
                ..._Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.strategyOptions.areas[area.area_id],
            }).getCard());
        }
        return {
            type: 'vertical-stack',
            title: _Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.strategyOptions.home_view.hidden.includes('areasTitle') ? undefined : (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_4__.localize)('generic.areas'),
            cards: (0,_utilities_cardStacking__WEBPACK_IMPORTED_MODULE_7__.stackHorizontal)(cardConfigurations, { area: 1, 'custom:mushroom-template-card': 2 }),
        };
    }
}
/** The domain of the entities that the view is representing. */
HomeView.domain = 'home';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HomeView);


/***/ }),

/***/ "./src/views/LightView.ts":
/*!********************************!*\
  !*** ./src/views/LightView.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Registry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Registry */ "./src/Registry.ts");
/* harmony import */ var _utilities_localize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utilities/localize */ "./src/utilities/localize.ts");
/* harmony import */ var _AbstractView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AbstractView */ "./src/views/AbstractView.ts");
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.



/**
 * Light View Class.
 *
 * Used to create a view for entities of the light domain.
 *
 * @class LightView
 * @extends AbstractView
 */
class LightView extends _AbstractView__WEBPACK_IMPORTED_MODULE_2__["default"] {
    /** Returns the default configuration object for the view. */
    static getDefaultConfig() {
        return {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('light.lights'),
            path: 'lights',
            icon: 'mdi:lightbulb-group',
            subview: false,
            headerCardConfiguration: {
                iconOn: 'mdi:lightbulb',
                iconOff: 'mdi:lightbulb-off',
                onService: 'light.turn_on',
                offService: 'light.turn_off',
            },
        };
    }
    /** Returns the default configuration of the view's Header card. */
    static getViewHeaderCardConfig() {
        return {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('light.all_lights'),
            subtitle: `${_Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.getCountTemplate(LightView.domain, 'eq', 'on')} ${(0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('light.lights')} ` +
                (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('generic.on'),
        };
    }
    constructor(customConfiguration) {
        super();
        this.initializeViewConfig(LightView.getDefaultConfig(), customConfiguration, LightView.getViewHeaderCardConfig());
    }
}
/** The domain of the entities that the view is representing. */
LightView.domain = 'light';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LightView);


/***/ }),

/***/ "./src/views/LockView.ts":
/*!*******************************!*\
  !*** ./src/views/LockView.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Registry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Registry */ "./src/Registry.ts");
/* harmony import */ var _utilities_localize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utilities/localize */ "./src/utilities/localize.ts");
/* harmony import */ var _AbstractView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AbstractView */ "./src/views/AbstractView.ts");
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.



/**
 * Lock View Class.
 *
 * Used to create a view configuration for entities of the lock domain.
 */
class LockView extends _AbstractView__WEBPACK_IMPORTED_MODULE_2__["default"] {
    /** Returns the default configuration object for the view. */
    static getDefaultConfig() {
        return {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('locks.locks'),
            path: 'locks',
            icon: 'mdi:lock-open',
            subview: false,
            headerCardConfiguration: {
                iconOn: 'mdi:lock-open',
                iconOff: 'mdi:lock',
                onService: 'lock.lock',
                offService: 'lock.unlock',
            },
        };
    }
    /** Returns the default configuration of the view's Header card. */
    static getViewHeaderCardConfig() {
        return {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('lock.all_locks'),
            subtitle: `${_Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.getCountTemplate(LockView.domain, 'ne', 'locked')} ${(0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('lock.locks')} ` +
                (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('lock.unlocked'),
        };
    }
    /**
     * Class constructor.
     *
     * @param {ViewConfig} [customConfiguration] Custom view configuration.
     */
    constructor(customConfiguration) {
        super();
        this.initializeViewConfig(LockView.getDefaultConfig(), customConfiguration, LockView.getViewHeaderCardConfig());
    }
}
/** The domain of the entities that the view is representing. */
LockView.domain = 'lock';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LockView);


/***/ }),

/***/ "./src/views/SceneView.ts":
/*!********************************!*\
  !*** ./src/views/SceneView.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utilities_localize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utilities/localize */ "./src/utilities/localize.ts");
/* harmony import */ var _AbstractView__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AbstractView */ "./src/views/AbstractView.ts");
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.


/**
 * Scene View Class.
 *
 * sed to create a view configuration for entities of the scene domain.
 */
class SceneView extends _AbstractView__WEBPACK_IMPORTED_MODULE_1__["default"] {
    /** Returns the default configuration object for the view. */
    static getDefaultConfig() {
        return {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_0__.localize)('scene.scenes'),
            path: 'scenes',
            icon: 'mdi:palette',
            subview: false,
            headerCardConfiguration: {
                showControls: false,
            },
        };
    }
    /** Returns the default configuration of the view's Header card. */
    static getViewHeaderCardConfig() {
        return {};
    }
    /**
     * Class constructor.
     *
     * @param {ViewConfig} [customConfiguration] Custom view configuration.
     */
    constructor(customConfiguration) {
        super();
        this.initializeViewConfig(SceneView.getDefaultConfig(), customConfiguration, SceneView.getViewHeaderCardConfig());
    }
}
/** The domain of the entities that the view is representing. */
SceneView.domain = 'scene';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SceneView);


/***/ }),

/***/ "./src/views/SwitchView.ts":
/*!*********************************!*\
  !*** ./src/views/SwitchView.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Registry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Registry */ "./src/Registry.ts");
/* harmony import */ var _utilities_localize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utilities/localize */ "./src/utilities/localize.ts");
/* harmony import */ var _AbstractView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AbstractView */ "./src/views/AbstractView.ts");
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.



/**
 * Switch View Class.
 *
 * Used to create a view configuration for entities of the switch domain.
 */
class SwitchView extends _AbstractView__WEBPACK_IMPORTED_MODULE_2__["default"] {
    /** Returns the default configuration object for the view. */
    static getDefaultConfig() {
        return {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('switch.switches'),
            path: 'switches',
            icon: 'mdi:dip-switch',
            subview: false,
            headerCardConfiguration: {
                iconOn: 'mdi:power-plug',
                iconOff: 'mdi:power-plug-off',
                onService: 'switch.turn_on',
                offService: 'switch.turn_off',
            },
        };
    }
    /** Returns the default configuration of the view's Header card. */
    static getViewHeaderCardConfig() {
        return {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('switch.all_switches'),
            subtitle: `${_Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.getCountTemplate(SwitchView.domain, 'eq', 'on')} ${(0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('switch.switches')} ` +
                (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('generic.on'),
        };
    }
    /**
     * Class constructor.
     *
     * @param {ViewConfig} [customConfiguration] Custom view configuration.
     */
    constructor(customConfiguration) {
        super();
        this.initializeViewConfig(SwitchView.getDefaultConfig(), customConfiguration, SwitchView.getViewHeaderCardConfig());
    }
}
/** The domain of the entities that the view is representing. */
SwitchView.domain = 'switch';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SwitchView);


/***/ }),

/***/ "./src/views/VacuumView.ts":
/*!*********************************!*\
  !*** ./src/views/VacuumView.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Registry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Registry */ "./src/Registry.ts");
/* harmony import */ var _utilities_localize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utilities/localize */ "./src/utilities/localize.ts");
/* harmony import */ var _AbstractView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AbstractView */ "./src/views/AbstractView.ts");
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.



/**
 * Vacuum View Class.
 *
 * Used to create a view configuration for entities of the vacuum domain.
 */
class VacuumView extends _AbstractView__WEBPACK_IMPORTED_MODULE_2__["default"] {
    /** Returns the default configuration object for the view. */
    static getDefaultConfig() {
        return {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('vacuum.vacuums'),
            path: 'vacuums',
            icon: 'mdi:robot-vacuum',
            subview: false,
            headerCardConfiguration: {
                iconOn: 'mdi:robot-vacuum',
                iconOff: 'mdi:robot-vacuum-off',
                onService: 'vacuum.start',
                offService: 'vacuum.stop',
            },
        };
    }
    /** Returns the default configuration of the view's Header card. */
    static getViewHeaderCardConfig() {
        return {
            title: (0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('vacuum.all_vacuums'),
            subtitle: _Registry__WEBPACK_IMPORTED_MODULE_0__.Registry.getCountTemplate(VacuumView.domain, 'in', '[cleaning, returning]') +
                ` ${(0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('vacuum.vacuums')} ${(0,_utilities_localize__WEBPACK_IMPORTED_MODULE_1__.localize)('generic.busy')}`,
        };
    }
    /**
     * Class constructor.
     *
     * @param {ViewConfig} [customConfiguration] Custom view configuration.
     */
    constructor(customConfiguration) {
        super();
        this.initializeViewConfig(VacuumView.getDefaultConfig(), customConfiguration, VacuumView.getViewHeaderCardConfig());
    }
}
/** The domain of the entities that the view is representing. */
VacuumView.domain = 'vacuum';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VacuumView);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		// The chunk loading function for additional chunks
/******/ 		// Since all referenced chunks are already included
/******/ 		// in this file, this function is empty here.
/******/ 		__webpack_require__.e = () => (Promise.resolve());
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!**********************************!*\
  !*** ./src/mushroom-strategy.ts ***!
  \**********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _cards_HeaderCard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cards/HeaderCard */ "./src/cards/HeaderCard.ts");
/* harmony import */ var _cards_SensorCard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cards/SensorCard */ "./src/cards/SensorCard.ts");
/* harmony import */ var _Registry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Registry */ "./src/Registry.ts");
/* harmony import */ var _types_strategy_strategy_generics__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./types/strategy/strategy-generics */ "./src/types/strategy/strategy-generics.ts");
/* harmony import */ var _utilities_auxiliaries__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utilities/auxiliaries */ "./src/utilities/auxiliaries.ts");
/* harmony import */ var _utilities_debug__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utilities/debug */ "./src/utilities/debug.ts");
/* harmony import */ var _utilities_RegistryFilter__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utilities/RegistryFilter */ "./src/utilities/RegistryFilter.ts");
/* harmony import */ var _utilities_cardStacking__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utilities/cardStacking */ "./src/utilities/cardStacking.ts");








/**
 * Mushroom Dashboard Strategy.<br>
 * <br>
 * Mushroom dashboard strategy provides a strategy for Home-Assistant to create a dashboard automatically.<br>
 * The strategy makes use Mushroom and Mini Graph cards to represent your entities.
 *
 * @see https://github.com/DigiLive/mushroom-strategy
 */
class MushroomStrategy extends HTMLTemplateElement {
    /**
     * Generate a dashboard.
     *
     * This method creates views for each exposed domain and area.
     * It also adds custom views if specified in the strategy options.
     *
     * @param {DashboardInfo} info Dashboard strategy information object.
     *
     * @remarks
     * Called when opening a dashboard.
     */
    static async generateDashboard(info) {
        await _Registry__WEBPACK_IMPORTED_MODULE_2__.Registry.initialize(info);
        const views = [];
        // Parallelize view imports and creation.
        const viewPromises = _Registry__WEBPACK_IMPORTED_MODULE_2__.Registry.getExposedNames('view')
            .filter(_types_strategy_strategy_generics__WEBPACK_IMPORTED_MODULE_3__.isSupportedView)
            .map(async (viewName) => {
            try {
                const moduleName = (0,_utilities_auxiliaries__WEBPACK_IMPORTED_MODULE_4__.sanitizeClassName)(`${viewName}View`);
                const View = (await __webpack_require__("./src/views lazy recursive ^\\.\\/.*$")(`./${moduleName}`)).default;
                const currentView = new View(_Registry__WEBPACK_IMPORTED_MODULE_2__.Registry.strategyOptions.views[viewName]);
                const viewConfiguration = await currentView.getView();
                if (viewConfiguration.cards.length) {
                    return viewConfiguration;
                }
            }
            catch (e) {
                (0,_utilities_debug__WEBPACK_IMPORTED_MODULE_5__.logMessage)(_utilities_debug__WEBPACK_IMPORTED_MODULE_5__.lvlError, `Error importing ${viewName} view!`, e);
            }
            return null;
        });
        const resolvedViews = (await Promise.all(viewPromises)).filter(Boolean);
        views.push(...resolvedViews);
        // Subviews for areas
        views.push(..._Registry__WEBPACK_IMPORTED_MODULE_2__.Registry.areas.map((area) => ({
            title: area.name,
            path: area.area_id,
            subview: true,
            strategy: {
                type: 'custom:mushroom-strategy',
                options: { area },
            },
        })));
        // Extra views
        if (_Registry__WEBPACK_IMPORTED_MODULE_2__.Registry.strategyOptions.extra_views) {
            views.push(..._Registry__WEBPACK_IMPORTED_MODULE_2__.Registry.strategyOptions.extra_views);
        }
        return { views };
    }
    /**
     * Generate a view.
     *
     * The method creates cards for each domain (e.g., sensors, switches, etc.) in the current area, using a combination
     * of Header cards and entity-specific cards.
     * It also handles miscellaneous entities that don't fit into any supported domain.
     *
     * @param {ViewInfo} info The view's strategy information object.
     *
     * @remarks
     * Called upon opening a subview.
     */
    static async generateView(info) {
        const exposedDomainNames = _Registry__WEBPACK_IMPORTED_MODULE_2__.Registry.getExposedNames('domain');
        const area = info.view.strategy?.options?.area ?? {};
        const areaEntities = new _utilities_RegistryFilter__WEBPACK_IMPORTED_MODULE_6__["default"](_Registry__WEBPACK_IMPORTED_MODULE_2__.Registry.entities).whereAreaId(area.area_id).toList();
        const viewCards = [...(area.extra_cards ?? [])];
        // Set the target for any Header card to the current area.
        const target = { area_id: [area.area_id] };
        // Prepare promises for all supported domains
        const domainCardPromises = exposedDomainNames.filter(_types_strategy_strategy_generics__WEBPACK_IMPORTED_MODULE_3__.isSupportedDomain).map(async (domain) => {
            const moduleName = (0,_utilities_auxiliaries__WEBPACK_IMPORTED_MODULE_4__.sanitizeClassName)(domain + 'Card');
            const entities = new _utilities_RegistryFilter__WEBPACK_IMPORTED_MODULE_6__["default"](areaEntities)
                .whereDomain(domain)
                .where((entity) => !(domain === 'switch' && entity.entity_id.endsWith('_stateful_scene')))
                .toList();
            if (!entities.length) {
                return null;
            }
            const titleCard = new _cards_HeaderCard__WEBPACK_IMPORTED_MODULE_0__["default"]({ entity_id: entities.map((entity) => entity.entity_id) }, {
                ..._Registry__WEBPACK_IMPORTED_MODULE_2__.Registry.strategyOptions.domains['_'],
                ..._Registry__WEBPACK_IMPORTED_MODULE_2__.Registry.strategyOptions.domains[domain],
            }).createCard();
            try {
                const DomainCard = (await __webpack_require__("./src/cards lazy recursive ^\\.\\/.*$")(`./${moduleName}`)).default;
                if (domain === 'sensor') {
                    const domainCards = entities
                        .filter((entity) => _Registry__WEBPACK_IMPORTED_MODULE_2__.Registry.hassStates[entity.entity_id]?.attributes.unit_of_measurement)
                        .map((entity) => {
                        const options = {
                            ...(entity.device_id && _Registry__WEBPACK_IMPORTED_MODULE_2__.Registry.strategyOptions.card_options?.[entity.device_id]),
                            ..._Registry__WEBPACK_IMPORTED_MODULE_2__.Registry.strategyOptions.card_options?.[entity.entity_id],
                            type: 'custom:mini-graph-card',
                            entities: [entity.entity_id],
                        };
                        return new _cards_SensorCard__WEBPACK_IMPORTED_MODULE_1__["default"](entity, options).getCard();
                    });
                    return domainCards.length ? { type: 'vertical-stack', cards: [titleCard, ...domainCards] } : null;
                }
                let domainCards = entities.map((entity) => {
                    const cardOptions = {
                        ...(entity.device_id && _Registry__WEBPACK_IMPORTED_MODULE_2__.Registry.strategyOptions.card_options?.[entity.device_id]),
                        ..._Registry__WEBPACK_IMPORTED_MODULE_2__.Registry.strategyOptions.card_options?.[entity.entity_id],
                    };
                    return new DomainCard(entity, cardOptions).getCard();
                });
                if (domain === 'binary_sensor') {
                    domainCards = (0,_utilities_cardStacking__WEBPACK_IMPORTED_MODULE_7__.stackHorizontal)(domainCards);
                }
                return domainCards.length ? { type: 'vertical-stack', cards: [titleCard, ...domainCards] } : null;
            }
            catch (e) {
                (0,_utilities_debug__WEBPACK_IMPORTED_MODULE_5__.logMessage)(_utilities_debug__WEBPACK_IMPORTED_MODULE_5__.lvlError, `Error creating card configurations for domain ${domain}`, e);
                return null;
            }
        });
        // Await all domain card stacks
        const domainCardStacks = (await Promise.all(domainCardPromises)).filter(Boolean);
        viewCards.push(...domainCardStacks);
        // Miscellaneous domain
        if (!_Registry__WEBPACK_IMPORTED_MODULE_2__.Registry.strategyOptions.domains.default.hidden) {
            const miscellaneousEntities = new _utilities_RegistryFilter__WEBPACK_IMPORTED_MODULE_6__["default"](areaEntities)
                .not()
                .where((entity) => (0,_types_strategy_strategy_generics__WEBPACK_IMPORTED_MODULE_3__.isSupportedDomain)(entity.entity_id.split('.', 1)[0]))
                .toList();
            if (miscellaneousEntities.length) {
                try {
                    const MiscellaneousCard = (await Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ./cards/MiscellaneousCard */ "./src/cards/MiscellaneousCard.ts"))).default;
                    const miscellaneousCards = [
                        new _cards_HeaderCard__WEBPACK_IMPORTED_MODULE_0__["default"](target, _Registry__WEBPACK_IMPORTED_MODULE_2__.Registry.strategyOptions.domains.default).createCard(),
                        ...miscellaneousEntities.map((entity) => new MiscellaneousCard(entity, _Registry__WEBPACK_IMPORTED_MODULE_2__.Registry.strategyOptions.card_options?.[entity.entity_id]).getCard()),
                    ];
                    viewCards.push({
                        type: 'vertical-stack',
                        cards: miscellaneousCards,
                    });
                }
                catch (e) {
                    (0,_utilities_debug__WEBPACK_IMPORTED_MODULE_5__.logMessage)(_utilities_debug__WEBPACK_IMPORTED_MODULE_5__.lvlError, 'Error creating card configurations for domain `miscellaneous`', e);
                }
            }
        }
        return { cards: viewCards };
    }
}
customElements.define('ll-strategy-mushroom-strategy', MushroomStrategy);
const version = 'v2.3.2';
console.info('%c Mushroom Strategy %c '.concat(version, ' '), 'color: white; background: coral; font-weight: 700;', 'color: coral; background: white; font-weight: 700;');

})();

/******/ })()
;
//# sourceMappingURL=mushroom-strategy.js.map
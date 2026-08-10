import { Registry } from "../Registry";
import { EntityRegistryEntry } from "../types/homeassistant/data/entity_registry";

export function getDevice(deviceId: string) {
    for (const device of Registry.devices) {
        if (device.id === deviceId) {
            return device;
        }
    }
    return null;
}

export function groupByDevice(entities: EntityRegistryEntry[]) {
    const deviceMap = new Map<string, EntityRegistryEntry[]>();
    for (const entity of entities) {
        if (entity.device_id) {
            const arr = deviceMap.get(entity.device_id) ?? [];
            arr.push(entity);
            deviceMap.set(entity.device_id, arr);
        }
    }
    for (const [deviceId, entities] of deviceMap) {
        if (entities.length == 1) {
            deviceMap.delete(deviceId);
        }
    }
    return deviceMap;
}
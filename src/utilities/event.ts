import { Registry } from "../Registry";
import { SortItem } from "../types/strategy/strategy-model";
import { collapseSidebar } from "./sidebar";


let isSubscribe = false;

export function subscribeEvnets() {
    if (isSubscribe) {
        return
    }
    isSubscribe = true;
    // const originDispatchEvent = EventTarget.prototype.dispatchEvent
    // EventTarget.prototype.dispatchEvent = function (event: Event): boolean {
    //     console.log(event.type, (event as CustomEvent).detail, event.bubbles, event.composed)
    //     return originDispatchEvent.call(this, event);
    // }
}
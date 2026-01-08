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
    //     try {
    //         const detail = (event as CustomEvent).detail
    //         console.log(event.type, detail)
    //         //dialogImport
    //         if (event.type == 'show-dialog' && detail.dialogImport) {
    //             console.log(detail.dialogImport)
    //         }
    //     } catch (error) {
    //         console.log(event.type, error)
    //     }
    //     return originDispatchEvent.call(this, event);
    // }
}
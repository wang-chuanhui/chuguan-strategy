import { Registry } from "../Registry";
import { SortItem } from "../types/strategy/strategy-model";
import { collapseSidebar } from "./sidebar";


let isSubscribe = false;

export function subscribeEvnets() {
    if (isSubscribe) {
        return
    }
    isSubscribe = true;
}
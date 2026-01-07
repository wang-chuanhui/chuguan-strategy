import { Registry } from "../Registry";
import { SortItem } from "../types/strategy/strategy-model";
import { collapseSidebar } from "./sidebar";


let isSubscribe = false;

export function subscribeEvnets() {
    if (isSubscribe) {
        return
    }
    isSubscribe = true;
    document.addEventListener("cg_hide_sidebar", (e) => {
        collapseSidebar(true);
    });
    document.addEventListener("cg_show_sidebar", (e) => {
        collapseSidebar(false);
    })
    document.addEventListener('cg_sort_area', (e) => {
        const detail: SortItem[] = (e as CustomEvent).detail;
        Registry.config.saveAreaSort(detail)
    })
    document.addEventListener('cg_sort_domains', (e) => {
        const detail: SortItem[] = (e as CustomEvent).detail;
        Registry.config.saveDomainSort(detail)
    })
}
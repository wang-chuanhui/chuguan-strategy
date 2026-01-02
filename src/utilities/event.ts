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
    }
    )
}
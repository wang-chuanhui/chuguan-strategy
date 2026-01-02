


export function collapseSidebar(hide: boolean) {
    console.log('Collapse sidebar:', hide);
    try {
        const ha = document.querySelector("home-assistant");
        const main = ha?.shadowRoot?.querySelector("home-assistant-main");

        if (!main) {
            console.warn('Home Assistant main element not found for sidebar control');
            return;
        }

        if (hide) {
            main.dispatchEvent(new CustomEvent("hass-dock-sidebar", {
                detail: { dock: "always_hidden" },
                bubbles: true,
                composed: true,
            }));
        }else {
            main.dispatchEvent(new CustomEvent("hass-dock-sidebar", {
                detail: { dock: "docked" },
                bubbles: true,
                composed: true,
            }));
        }

    } catch (error) {
        console.warn('Error in collapseSidebar:', error);
    }
}

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
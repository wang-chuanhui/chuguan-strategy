import { Registry } from "./Registry"
import { LovelaceViewBackgroundConfig } from "./types/homeassistant/data/lovelace/config/view"
import img from './view_background.jpg'

const checked_urls: Record<string, boolean> = {}

function url_exists(url: string, method = 'HEAD') {
    // console.info('URL EXISTS', method, url)
    if (url in checked_urls) {
        return checked_urls[url]
    }

    var req = new XMLHttpRequest();
    req.open(method, url, false);
    req.send();

    if (req.status == 200) {
        checked_urls[url] = true
        return true
    }

    if (req.status == 405)
        // HEAD not allowed for some URLs (e.g. /api/image...)
        return url_exists(url, 'GET')

    checked_urls[url] = false
    return false
}

export function gen_background(id: string): LovelaceViewBackgroundConfig {
    const options = Registry.strategyOptions
    let view_background = options.background_images && options.background_images[id]
    img
    let bg_image = (
        view_background ||
        options.background_image ||
        '/hacsfiles/chuguan-strategy/view_background.jpg'
    )
    const exists = url_exists(bg_image)
    if (!exists) {
        bg_image = '/local/chuguan-strategy/view_background.jpg'
    }
    return {
        image: bg_image,
        alignment: 'center',
        attachment: 'fixed',
        opacity: 100,
        repeat: 'repeat',
        size: 'cover',
    }
}
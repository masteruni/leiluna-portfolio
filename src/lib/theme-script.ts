export const THEME_KEY = "leiluna:theme";

// Runs in <head> before the page paints, so there's no flash of the wrong theme: a saved choice wins,
// otherwise the device's setting decides. (Kept apart from theme.ts so the server layout can import it.)
export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="dark"}})()`;

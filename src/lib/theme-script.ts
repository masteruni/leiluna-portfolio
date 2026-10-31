export const THEME_KEY = "leiluna:theme";

// Runs in <head> before the page paints, so there's no flash of the wrong theme: a saved choice wins,
// otherwise the device's setting decides. It also marks a visitor who has already seen the intro this session,
// so the intro loader stays hidden from the first paint (see globals.css). (Kept apart from theme.ts so the server layout can import it.)
export const themeScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";d.dataset.theme=t}catch(e){d.dataset.theme="dark"}try{if(sessionStorage.getItem("leiluna:intro")==="1")d.dataset.intro="seen"}catch(e){}})()`;

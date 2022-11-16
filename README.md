# 📩 Auto CC/BCC 📩

Automatically CC/BCC emails according to configured rules.

![screenshot](https://i.imgur.com/1lJy1v8.png)

Powered by [KartikTalwar/gmail.js](https://github.com/KartikTalwar/gmail.js)

# Development

## Structure

* [common](common) - shared models between the different modules.
* [src](src) - core extension logic
    * [background.ts](src/background.ts) - the service worker. Responsible for listening to events.
    * [content.ts](src/content.ts) - middleware communicating between the target browser page (gmail) and the service worker. It also injects `injected.ts` to the page.
    * [injected.ts](src/injected.ts) - the logic that gets injected to the target browser page (gmail)
* [view](view) - React page for the extension configurations

## Communication and Storage

Extensions use dedicated storage that is different than the regular browser local storage. To read/write to this storage we must use our service worker. To pass intentions back and forth, we use the following mechanism:

* Browser page (`injected`): uses `window.addEventListener` and `window.dispatchEvent`.
* Service worker (`background`): uses `chrome.runtime.onMessage.addListener` and `chrome.tabs.sendMessage`.
* Middleware (`content`): uses both `window` and `chrome.runtime` hooks to move events from side to side.

## Developing Options page

```shell
yarn browser
# to re-build, run the following and refresh the browser page, currently no hot reloading
yarn browser-build
```

Options page will be available at `http://localhost:9000/`. It will use local storage - this won't affect the installed extension, as its using a different storage mechanism.

# Install Extension

Open chrome at [chrome://extensions/](chrome://extensions/), make sure `Developer mode` is turned on.

Run `make`, then go back to extensions window and click `Load unpacked`. Choose the `out` directory at the root of this repository.

Install [Extensions Reloader](https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid?hl=en) for quicker reloads, which are also triggered by `make`.

# Pack Extension

To create a proper `crx`, either do it manually from Chrome or run `make crx`. Note you cannot easily install a non-approved `crx`.

To create a simple `zip`, run `make zip`. Then you can ship it around and load to chrome the unzipped content.

# 📩 Auto CC/BCC 📩

Automatically CC/BCC emails according to configured rules.

![screenshot](https://i.imgur.com/1lJy1v8.png)

Powered by [KartikTalwar/gmail.js](https://github.com/KartikTalwar/gmail.js)

# Development

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

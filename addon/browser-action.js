browser.browserAction.onClicked.addListener(() => {
    browser.tabs.create({
        "url": "/page/index.html"
    })
});
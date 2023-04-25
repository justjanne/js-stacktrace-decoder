browser.action.onClicked.addListener(() => {
    browser.tabs.create({
        "url": "/page/index.html"
    })
});

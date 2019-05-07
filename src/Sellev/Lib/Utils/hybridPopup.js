export const openPopup = ( url, option, isWebview ) => {
    if () {

    } else {
        window.postMessage(JSON.stringify({
            type: 'download',
            pathname: location.pathname,
            search: location.search,
            url: location.pathname + location.search,
        }), "*");
    }
    window.open(url, option);
}
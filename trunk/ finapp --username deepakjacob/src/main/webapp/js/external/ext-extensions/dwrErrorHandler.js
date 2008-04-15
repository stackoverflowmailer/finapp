function handler(errorString, exception) {
    alert('Error :  ' + error);
}
dwr.engine.setErrorHandler(handler);
dwr.engine.setTextHtmlHandler(function(pageData) {
    alert('Pagedata :  ' + pageData);
});

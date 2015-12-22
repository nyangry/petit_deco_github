chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function() {
    var get_json_request = new XMLHttpRequest();

    get_json_request.open('GET', 'http://www.lgtm.in/g', true);
    get_json_request.setRequestHeader('Accept', 'application/json');

    get_json_request.onload = function() {
      if (get_json_request.status >= 200 && get_json_request.status < 400) {
        var data = JSON.parse(get_json_request.responseText);

        port.postMessage(data.markdown.match(/!\[LGTM\]\(.*?\)/)[0]);
      }
    };

    get_json_request.onerror = function() {
      // There was a connection error of some sort
    };

    get_json_request.send();
  });
});

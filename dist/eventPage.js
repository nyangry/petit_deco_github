chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function() {
    var get_json_request = new XMLHttpRequest();

    get_json_request.open('GET', 'https://lgtm.in/g', true);
    get_json_request.setRequestHeader('Accept', 'application/json');

    get_json_request.onload = function() {
      if (get_json_request.status >= 200 && get_json_request.status < 400) {
        var data             = JSON.parse(get_json_request.responseText);
        var markdown         = data.markdown.match(/!\[LGTM\]\(.*?\)/)[0];
        var image_source_url = markdown.match(/https:[^)]+/)[0];
        var image            = new Image();
        var base64_image     = null;

        image.onload = function() {
          var canvas    = document.createElement('canvas');
          canvas.width  = this.width;
          canvas.height = this.height;

          var ctx = canvas.getContext('2d');
          ctx.drawImage(this, 0, 0);

          base64_image = canvas.toDataURL('image/jpeg');

          canvas = null;

          port.postMessage({
            markdown: markdown,
            base64_image: base64_image
          });
        };

        image.src = image_source_url;
      }
    };

    get_json_request.onerror = function() {
      // There was a connection error of some sort
    };

    get_json_request.send();
  });
});

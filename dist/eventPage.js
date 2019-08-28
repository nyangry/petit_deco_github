chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((lgtm_image_index) => {
    const get_json_request = new XMLHttpRequest();

    get_json_request.open('GET', 'https://lgtm.in/g', true);
    get_json_request.setRequestHeader('Accept', 'application/json');

    get_json_request.onload = function () {
      if (get_json_request.status >= 200 && get_json_request.status < 400) {
        const data             = JSON.parse(get_json_request.responseText);
        const image_source_url = data.actualImageUrl;
        const markdown         = `![](${image_source_url})`;
        const image            = new Image();
        let base64_image     = null;

        image.onload = function () {
          let canvas    = document.createElement('canvas');
          canvas.width = this.width;
          canvas.height = this.height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(this, 0, 0);

          base64_image = canvas.toDataURL('image/jpeg');

          canvas = null;

          port.postMessage({
            lgtm_image_index,
            markdown,
            base64_image,
          });
        };

        image.src = image_source_url;
      }
    };

    get_json_request.onerror = function () {
      // There was a connection error of some sort
    };

    get_json_request.send();
  });
});

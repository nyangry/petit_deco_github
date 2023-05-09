chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(async (lgtm_image_index) => {
    var imageSourceUrl = await fetchRandomImagePage();
    var imageDataURI = await fetchImageDataURI(imageSourceUrl);

    port.postMessage({
      lgtm_image_index,
      imageSourceUrl,
      imageDataURI,
    });
  });
});

function fetchRandomImagePage() {
  return new Promise((resolve, reject) => {
    fetch(`https://www.lgtm.app/g`, {
      method: "GET",
    })
      .then((response) => {
        return response.text();
      })
      .then((htmlString) => {
        resolve(htmlString.match(/<input(?:.*?value=")(.*?)"/)[1]);
      })
      .catch((e) => {
        console.log(e);
      });
  });
}

function fetchImageDataURI(imageSourceUrl) {
  return new Promise((resolve, reject) => {
    fetch(imageSourceUrl, {
      method: "GET",
    })
      .then((response) => {
        return response.blob();
      })
      .then((ImageBlob) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(ImageBlob);
      })
      .catch((e) => {
        console.log(e);
      });
  });
}

chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(lgtm_image_index) {
    let get_json_request = new XMLHttpRequest()

    get_json_request.open('GET', 'https://lgtm.in/g', true)
    get_json_request.setRequestHeader('Accept', 'application/json')

    get_json_request.onload = function() {
      if (get_json_request.status >= 200 && get_json_request.status < 400) {
        let data             = JSON.parse(get_json_request.responseText)
        let image_source_url = data.actualImageUrl
        let markdown         = `![](${image_source_url})`
        let image            = new Image()
        let base64_image     = null

        image.onload = function() {
          let canvas    = document.createElement('canvas')
          canvas.width  = this.width
          canvas.height = this.height

          let ctx = canvas.getContext('2d')
          ctx.drawImage(this, 0, 0)

          base64_image = canvas.toDataURL('image/jpeg')

          canvas = null

          port.postMessage({
            lgtm_image_index: lgtm_image_index,
            markdown: markdown,
            base64_image: base64_image
          })
        }

        image.src = image_source_url
      }
    }

    get_json_request.onerror = function() {
      // There was a connection error of some sort
    }

    get_json_request.send()
  })
})

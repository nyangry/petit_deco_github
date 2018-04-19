{
  // define github selectors
  const GITHUB_SELECTORS = {}
  GITHUB_SELECTORS.NEW_COMMENT_FIELD_ID = '#new_comment_field'

  // define github elements
  const github_elements = {}
  github_elements.$new_comment_field = document.querySelector(GITHUB_SELECTORS.NEW_COMMENT_FIELD_ID)
  github_elements.$nav_above_new_comment_field = github_elements.$new_comment_field.closest('form').querySelectorAll('nav').item(0)

  // define app selectors
  const APP_SELECTORS = {}
  APP_SELECTORS.LGTM_IMAGES = '.js-petit-deco-lgtm-image'
  APP_SELECTORS.LGTM_SELECTION_PANEL_BACKDROP = '.js-petit-deco-lgtm-selection-panel-backdrop'
  APP_SELECTORS.LGTM_SELECTION_PANEL = '.js-petit-deco-lgtm-selection-panel'
  APP_SELECTORS.LGTM_SELECTION_STARTER = '.js-petit-deco-lgtm-selection-starter'
  APP_SELECTORS.QUICK_PLUS_ONE_BUTTON = '.js-petit-deco-quick-plus-one-button'

  // define app elements
  const app_elements = {}

  // Initialize
  {
    // insert lgtm selection block
    {
      document.body.insertAdjacentHTML('beforeend', `
        <div class="js-petit-deco-lgtm-selection-panel-backdrop petit-deco-lgtm-selection-backdrop"></div>

        <div class="js-petit-deco-lgtm-selection-panel petit-deco-lgtm-selection-panel">
          <div class="petit-deco-lgtm-selection-flex-container">
            <img class="js-petit-deco-lgtm-image">
            <img class="js-petit-deco-lgtm-image">
            <img class="js-petit-deco-lgtm-image">
            <img class="js-petit-deco-lgtm-image">
            <img class="js-petit-deco-lgtm-image">
            <img class="js-petit-deco-lgtm-image">
          </div>

          <div class="petit-deco-lgtm-selection-panel-triangle"></div>
        </div>
      `)

      app_elements.$lgtm_selection_panel_backdrop = document.querySelector(APP_SELECTORS.LGTM_SELECTION_PANEL_BACKDROP)
      app_elements.$lgtm_selection_panel          = document.querySelector(APP_SELECTORS.LGTM_SELECTION_PANEL)
      app_elements.$lgtm_images                   = document.querySelectorAll(APP_SELECTORS.LGTM_IMAGES)
    }

    // insert lgtm selection button
    {
      github_elements.$nav_above_new_comment_field.insertAdjacentHTML('beforeend', `
        <span class="btn btn-sm float-right ml-1 `+ APP_SELECTORS.LGTM_SELECTION_STARTER.replace(/\./, '') +`">LGTM</span>
        <span class="btn btn-sm float-right `+ APP_SELECTORS.QUICK_PLUS_ONE_BUTTON.replace(/\./, '') +`">+1</span>
      `)

      app_elements.$lgtm_selection_starter = document.querySelector(APP_SELECTORS.LGTM_SELECTION_STARTER)
      app_elements.$quick_plus_one_button = document.querySelector(APP_SELECTORS.QUICK_PLUS_ONE_BUTTON)
    }

    // fetch lgtm images
    {
      let port = chrome.runtime.connect({name: 'petit-deco-github'})

      // define callback
      port.onMessage.addListener(function(response) {
        let $lgtm_image = app_elements.$lgtm_images[response.lgtm_image_index]

        $lgtm_image.dataset.markdown = response.markdown
        $lgtm_image.setAttribute('loaded', true)
        $lgtm_image.setAttribute('src', response.base64_image)
      })

      for (let index = 0; index < app_elements.$lgtm_images.length; index++) {
        port.postMessage(index)
      }
    }
  }

  // Set Event Listeners
  {
    app_elements.$lgtm_selection_starter.addEventListener('click', (e) => {
      let $self = e.currentTarget

      let scroll_top = window.pageYOffset || document.documentElement.scrollTop
      let scroll_left = window.pageXOffset || document.documentElement.scrollLeft

      let self_rect = $self.getBoundingClientRect()
      let new_comment_field_rect = github_elements.$new_comment_field.getBoundingClientRect()

      let self_top = self_rect.top + scroll_top
      let new_comment_field_left = new_comment_field_rect.left + scroll_left

      app_elements.$lgtm_selection_panel.style.top = self_top - 245 + 'px'
      app_elements.$lgtm_selection_panel.style.left = new_comment_field_left + 170 + 'px'

      app_elements.$lgtm_selection_panel_backdrop.style.display = 'block'
      app_elements.$lgtm_selection_panel.style.display = 'block'
    })

    app_elements.$lgtm_images.forEach($lgtm_image => {
      $lgtm_image.addEventListener('click', (e) => {
        let $self = e.currentTarget

        github_elements.$new_comment_field.value = github_elements.$new_comment_field.value + '\n' + $self.dataset.markdown

        app_elements.$lgtm_selection_panel_backdrop.style.display = 'none'
        app_elements.$lgtm_selection_panel.style.display = 'none'

        github_elements.$new_comment_field.focus()
      })
    })

    app_elements.$lgtm_selection_panel_backdrop.addEventListener('click', () => {
      app_elements.$lgtm_selection_panel_backdrop.style.display = 'none'
      app_elements.$lgtm_selection_panel.style.display = 'none'
    })

    app_elements.$quick_plus_one_button.addEventListener('click', () => {
      github_elements.$new_comment_field.value = ':+1:'
    })
  }
}

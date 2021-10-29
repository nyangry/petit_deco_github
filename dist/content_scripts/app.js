// define github selectors
const GITHUB_SELECTORS = {};
GITHUB_SELECTORS.PJAX_CONTAINER_ID = '#repo-content-pjax-container';
GITHUB_SELECTORS.JS_NEW_COMMENT_FORM_CLASS = '.js-new-comment-form';
GITHUB_SELECTORS.JS_REVIEWS_CONTAINER_CLASS = '.js-reviews-container';
GITHUB_SELECTORS.JS_PREVIEWABLE_COMMENT_FORM_BLOCK_CLASS = '.js-previewable-comment-form';
GITHUB_SELECTORS.JS_COMMENT_FIELD_CLASS = '.js-comment-field';
GITHUB_SELECTORS.JS_TOGGLE_INLINE_COMMENT_FORM_CLASS = '.js-toggle-inline-comment-form';
GITHUB_SELECTORS.JS_INLINE_COMMENT_FORM_CONTAINER_CLASS = '.js-inline-comment-form-container';
GITHUB_SELECTORS.JS_ADD_SINGLE_LINE_COMMENT_CLASS = '.js-add-single-line-comment';

// define github elements
const github_elements = {};
github_elements.$pjax_container = document.querySelector(GITHUB_SELECTORS.PJAX_CONTAINER_ID);

// define app selectors
const APP_SELECTORS = {};
APP_SELECTORS.LGTM_IMAGES = '.js-petit-deco-lgtm-image';
APP_SELECTORS.LGTM_SELECTION_PANEL_BACKDROP = '.js-petit-deco-lgtm-selection-panel-backdrop';
APP_SELECTORS.LGTM_SELECTION_PANEL = '.js-petit-deco-lgtm-selection-panel';
APP_SELECTORS.ACTIONS = '.js-petit-deco-actions';
APP_SELECTORS.LGTM_SELECTION_STARTER = '.js-petit-deco-lgtm-selection-starter';
APP_SELECTORS.QUICK_PLUS_ONE_BUTTON = '.js-petit-deco-quick-plus-one-button';

// define app elements
const app_elements = {};

// fetch lgtm images
const fetchLgtmImages = () => {
  const port = chrome.runtime.connect({ name: 'petit-deco-github' });

  // define callback
  port.onMessage.addListener((response) => {
    const $lgtm_image = app_elements.$lgtm_images[response.lgtm_image_index];

    $lgtm_image.dataset.markdown = response.markdown;
    $lgtm_image.setAttribute('loaded', true);
    $lgtm_image.setAttribute('src', response.base64_image);
  });

  for (let index = 0; index < app_elements.$lgtm_images.length; index++) {
    port.postMessage(index);
  }
};

const insertDeco = ($previewable_comment_form_block) => {
  if ($previewable_comment_form_block === null) {
    return;
  }

  if ($previewable_comment_form_block.closest('form').querySelector(APP_SELECTORS.ACTIONS) !== null) {
    $previewable_comment_form_block.closest('form').querySelector(APP_SELECTORS.ACTIONS).remove();
  }

  const $comment_field = $previewable_comment_form_block.querySelector(GITHUB_SELECTORS.JS_COMMENT_FIELD_CLASS);
  const $form_actions_block = $previewable_comment_form_block.closest('form').querySelector('.form-actions');

  $form_actions_block.insertAdjacentHTML('afterbegin', `
    <div class="js-petit-deco-actions float-left mr-2">
      <span class="btn float-left ${APP_SELECTORS.LGTM_SELECTION_STARTER.replace(/\./, '')}">LGTM</span>
      <span class="btn float-left ml-1 ${APP_SELECTORS.QUICK_PLUS_ONE_BUTTON.replace(/\./, '')}">+1</span>
    </div>
  `);
  $form_actions_block.style.float = 'none';

  const $lgtm_selection_starter = $previewable_comment_form_block.closest('form').querySelector(APP_SELECTORS.LGTM_SELECTION_STARTER);
  const $quick_plus_one_button = $previewable_comment_form_block.closest('form').querySelector(APP_SELECTORS.QUICK_PLUS_ONE_BUTTON);

  // Set Event Listeners
  $lgtm_selection_starter.addEventListener('click', (e) => {
    const $self = e.currentTarget;

    // refetch lgtm images
    app_elements.$lgtm_images.forEach(($img) => {
      $img.setAttribute('alt', '');
      $img.removeAttribute('src');
    });

    fetchLgtmImages();

    // set current event button
    app_elements.$target_event_button = $self;

    // set position
    const scroll_top = window.pageYOffset || document.documentElement.scrollTop;
    const scroll_left = window.pageXOffset || document.documentElement.scrollLeft;

    const self_rect = $self.getBoundingClientRect();

    const self_top = self_rect.top + scroll_top;
    const self_left = self_rect.left + scroll_left;

    app_elements.$lgtm_selection_panel.style.top = `${self_top - 243}px`;
    app_elements.$lgtm_selection_panel.style.left = `${self_left - 70}px`;

    app_elements.$lgtm_selection_panel_backdrop.style.display = 'block';
    app_elements.$lgtm_selection_panel.style.display = 'block';
  });

  $quick_plus_one_button.addEventListener('click', () => {
    $comment_field.focus();

    $comment_field.value = ':+1:';

    // send input event to toggle comment button enabled
    $comment_field.dispatchEvent(new Event('input'));
  });
};

const insertDecos = () => {
  if (!!document.querySelector(GITHUB_SELECTORS.JS_REVIEWS_CONTAINER_CLASS)) {
    $previewable_comment_form_block = document.querySelector(GITHUB_SELECTORS.JS_REVIEWS_CONTAINER_CLASS).querySelector(GITHUB_SELECTORS.JS_PREVIEWABLE_COMMENT_FORM_BLOCK_CLASS)
  } else {
    $previewable_comment_form_block = document.querySelector(GITHUB_SELECTORS.JS_NEW_COMMENT_FORM_CLASS).querySelector(GITHUB_SELECTORS.JS_PREVIEWABLE_COMMENT_FORM_BLOCK_CLASS)
  }

  insertDeco($previewable_comment_form_block);

  document.querySelectorAll(GITHUB_SELECTORS.JS_TOGGLE_INLINE_COMMENT_FORM_CLASS).forEach(($js_toggle_inline_comment_form) => {
    $js_toggle_inline_comment_form.addEventListener('click', (e) => {
      const $self = e.currentTarget;
      const $container = $self.closest(GITHUB_SELECTORS.JS_INLINE_COMMENT_FORM_CONTAINER_CLASS);

      insertDeco($container.querySelector(GITHUB_SELECTORS.JS_PREVIEWABLE_COMMENT_FORM_BLOCK_CLASS));
    });
  });

  document.querySelectorAll(GITHUB_SELECTORS.JS_ADD_SINGLE_LINE_COMMENT_CLASS).forEach(($js_add_single_line_comment) => {
    $js_add_single_line_comment.addEventListener('click', (e) => {
      const $self = e.currentTarget;
      const $tr = $self.closest('tr');

      // wait sec to add dom
      setTimeout(() => {
        const $next_tr = $tr.nextElementSibling;

        insertDeco($next_tr.querySelector(GITHUB_SELECTORS.JS_PREVIEWABLE_COMMENT_FORM_BLOCK_CLASS));
      }, 200);
    });
  });
};

// Initialize
const initialize = () => {
  // insert lgtm selection block
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
  `);

  app_elements.$lgtm_selection_panel_backdrop = document.querySelector(APP_SELECTORS.LGTM_SELECTION_PANEL_BACKDROP);
  app_elements.$lgtm_selection_panel = document.querySelector(APP_SELECTORS.LGTM_SELECTION_PANEL);
  app_elements.$lgtm_images = document.querySelectorAll(APP_SELECTORS.LGTM_IMAGES);

  // Set Event Listeners
  app_elements.$lgtm_images.forEach(($lgtm_image) => {
    $lgtm_image.addEventListener('click', (e) => {
      const $self = e.currentTarget;
      const $form = app_elements.$target_event_button.closest('form');
      const $comment_field = $form.querySelector(GITHUB_SELECTORS.JS_COMMENT_FIELD_CLASS);

      app_elements.$lgtm_selection_panel_backdrop.style.display = 'none';
      app_elements.$lgtm_selection_panel.style.display = 'none';

      $comment_field.focus();

      $comment_field.value = `${$comment_field.value}\n${$self.dataset.markdown}`;

      // send input event to toggle comment button enabled
      $comment_field.dispatchEvent(new Event('input'));
    });
  });

  app_elements.$lgtm_selection_panel_backdrop.addEventListener('click', () => {
    app_elements.$lgtm_selection_panel_backdrop.style.display = 'none';
    app_elements.$lgtm_selection_panel.style.display = 'none';
  });
};

initialize();

insertDecos();

// Observe Mutation
{
  const observer = new MutationObserver((mutations) => {
    insertDecos();
  });

  observer.observe(github_elements.$pjax_container, { attributes: true, childList: true, characterData: true });
}

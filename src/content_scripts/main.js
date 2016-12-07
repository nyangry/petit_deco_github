var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

$(window).load(function() {
  var $body, AddPetitDecoAbilityToCommentFormOnFocus, BindPetitDecoEvents, CmdEnterBehavior, DecorateTruncateTargetTextAsLink, FetchLGTMImage, GITHUB_SELECTORS, InsertIcons, InsertLGTMImageSelectionBackdropAndPanel, PETIT_DECO_CSS_CLASSES, PETIT_DECO_JS_SELECTORS, decoratePreviewableCommentForm;
  $body = $('body');
  GITHUB_SELECTORS = {
    COMMENT_FIELD: '.js-comment-field',
    TABNAV_TABS: '.tabnav-tabs',
    CURRENT_BRANCH: '.current-branch',
    QUICK_SUBMIT: '.js-quick-submit',
    DISMISS_REVIEW_TUTORIAL: '.js-dismiss-review-tutorial'
  };
  PETIT_DECO_JS_SELECTORS = {
    PLUS_ONE: {
      STARTER: '.js-petit-deco-insert-plus-one'
    },
    LGTM_SELECTION: {
      STARTER: '.js-petit-deco-insert-lgtm-selection-panel',
      BACKDROP: '.js-petit-deco-lgtm-selection-panel-backdrop',
      PANEL: '.js-petit-deco-lgtm-selection-panel',
      LGTM_IMAGE: '.js-petit-deco-lgtm-image'
    }
  };
  PETIT_DECO_CSS_CLASSES = {
    LGTM_SELECTION: {
      PANEL: 'petit-deco-lgtm-selection-panel',
      BACKDROP: 'petit-deco-lgtm-selection-backdrop',
      FLEX_CONTAINER: 'petit-deco-lgtm-selection-flex-container',
      PANEL_TRIANGLE: 'petit-deco-lgtm-selection-panel-triangle'
    }
  };
  InsertLGTMImageSelectionBackdropAndPanel = (function() {
    function InsertLGTMImageSelectionBackdropAndPanel() {
      this.insertLGTMSelectionPanelBackdrop();
      this.insertLGTMSelectionPanel();
    }

    InsertLGTMImageSelectionBackdropAndPanel.prototype.insertLGTMSelectionPanelBackdrop = function() {
      var $lgtm_selection_panel_backdrop_node;
      $lgtm_selection_panel_backdrop_node = $('<div/>').attr({
        "class": [PETIT_DECO_JS_SELECTORS.LGTM_SELECTION.BACKDROP.replace(/\./, ''), PETIT_DECO_CSS_CLASSES.LGTM_SELECTION.BACKDROP].join(' ')
      });
      return $lgtm_selection_panel_backdrop_node.appendTo($body);
    };

    InsertLGTMImageSelectionBackdropAndPanel.prototype.insertLGTMSelectionPanel = function() {
      var $lgtm_image_node_base, $lgtm_selection_panel_node, $lgtm_selection_panel_triangle_node;
      $lgtm_selection_panel_node = $('<div/>').attr({
        "class": [PETIT_DECO_JS_SELECTORS.LGTM_SELECTION.PANEL.replace(/\./, ''), PETIT_DECO_CSS_CLASSES.LGTM_SELECTION.PANEL].join(' '),
        style: 'display: none;'
      });
      $lgtm_selection_panel_node.append($('<div/>').attr({
        "class": PETIT_DECO_CSS_CLASSES.LGTM_SELECTION.FLEX_CONTAINER
      }));
      $lgtm_image_node_base = $('<img/>').attr({
        "class": PETIT_DECO_JS_SELECTORS.LGTM_SELECTION.LGTM_IMAGE.replace(/\./, '')
      });
      $lgtm_selection_panel_node.find('div').append($lgtm_image_node_base.clone());
      $lgtm_selection_panel_node.find('div').append($lgtm_image_node_base.clone());
      $lgtm_selection_panel_node.find('div').append($lgtm_image_node_base.clone());
      $lgtm_selection_panel_node.find('div').append($lgtm_image_node_base.clone());
      $lgtm_selection_panel_node.find('div').append($lgtm_image_node_base.clone());
      $lgtm_selection_panel_node.find('div').append($lgtm_image_node_base.clone());
      $lgtm_selection_panel_triangle_node = $('<div/>').attr({
        "class": PETIT_DECO_CSS_CLASSES.LGTM_SELECTION.PANEL_TRIANGLE
      });
      $lgtm_selection_panel_node.append($lgtm_selection_panel_triangle_node);
      return $lgtm_selection_panel_node.appendTo($body);
    };

    return InsertLGTMImageSelectionBackdropAndPanel;

  })();
  FetchLGTMImage = (function() {
    function FetchLGTMImage() {
      var count;
      this.$lgtm_images = $(PETIT_DECO_JS_SELECTORS.LGTM_SELECTION.PANEL).find(PETIT_DECO_JS_SELECTORS.LGTM_SELECTION.LGTM_IMAGE);
      this.port = chrome.runtime.connect({
        name: 'petit-deco-github'
      });
      this.port.onMessage.addListener((function(_this) {
        return function(response) {
          return _this.setLGTMimage(response);
        };
      })(this));
      count = 0;
      while (count < 6) {
        this.port.postMessage();
        count++;
      }
    }

    FetchLGTMImage.prototype.setLGTMimage = function(lgtm_image_data) {
      var $lgtm_image;
      $lgtm_image = this.$lgtm_images.not('[loaded]').first();
      $lgtm_image.data('markdown', lgtm_image_data.markdown);
      return $lgtm_image.attr({
        loaded: true,
        src: lgtm_image_data.base64_image
      });
    };

    return FetchLGTMImage;

  })();
  CmdEnterBehavior = (function() {
    function CmdEnterBehavior() {
      this.onFocusin = bind(this.onFocusin, this);
      this.bindEvents();
    }

    CmdEnterBehavior.prototype.bindEvents = function() {
      $body.on('focusin', GITHUB_SELECTORS.QUICK_SUBMIT, this.onFocusin);
      return $body.on('focusout', GITHUB_SELECTORS.QUICK_SUBMIT, this.onFocusout);
    };

    CmdEnterBehavior.prototype.onFocusin = function(e) {
      var $add_single_comment_button, $form;
      $form = $(e.target.form);
      $add_single_comment_button = $form.find('button[name=single_comment]');
      if ($add_single_comment_button.length !== 0) {
        return $form.append($('<input>').attr({
          type: 'hidden',
          name: 'single_comment',
          value: 1
        }));
      }
    };

    CmdEnterBehavior.prototype.onFocusout = function(e) {
      return $(e.target.form).find('[type=hidden][name=single_comment]').remove();
    };

    return CmdEnterBehavior;

  })();
  DecorateTruncateTargetTextAsLink = (function() {
    function DecorateTruncateTargetTextAsLink() {
      var $current_branch_texts;
      $current_branch_texts = $body.find(GITHUB_SELECTORS.CURRENT_BRANCH);
      if ($current_branch_texts.length === 0) {
        return;
      }
      $current_branch_texts.each(function() {
        var $current_branch_text, $replacement;
        $current_branch_text = $(this);
        $replacement = $('<a>').html($current_branch_text.html()).attr({
          href: ['https://', location.host, '/', $current_branch_text.attr('title').replace(/:/, '/tree/')].join(''),
          target: '_new'
        });
        return $current_branch_text.html($replacement);
      });
    }

    return DecorateTruncateTargetTextAsLink;

  })();
  BindPetitDecoEvents = (function() {
    function BindPetitDecoEvents() {
      this.lgtmSelectionLGTMImageOnClick = bind(this.lgtmSelectionLGTMImageOnClick, this);
      this.lgtmSelectionBackdropOnClick = bind(this.lgtmSelectionBackdropOnClick, this);
      this.lgtmSelectionStarterOnClick = bind(this.lgtmSelectionStarterOnClick, this);
      this.$lgtm_selection_panel_node = $(PETIT_DECO_JS_SELECTORS.LGTM_SELECTION.PANEL);
      this.$lgtm_selection_panel_backdrop_node = $(PETIT_DECO_JS_SELECTORS.LGTM_SELECTION.BACKDROP);
      $body.on('click', PETIT_DECO_JS_SELECTORS.PLUS_ONE.STARTER, this.plusOneStarterOnClick);
      $body.on('click', PETIT_DECO_JS_SELECTORS.LGTM_SELECTION.STARTER, this.lgtmSelectionStarterOnClick);
      $body.on('click', PETIT_DECO_JS_SELECTORS.LGTM_SELECTION.BACKDROP, this.lgtmSelectionBackdropOnClick);
      $body.on('click', PETIT_DECO_JS_SELECTORS.LGTM_SELECTION.LGTM_IMAGE, this.lgtmSelectionLGTMImageOnClick);
    }

    BindPetitDecoEvents.prototype.plusOneStarterOnClick = function(e) {
      var $add_single_comment_button, $comment_field, $current_form, $other_submit_button;
      $current_form = $(e.target).parents('form');
      $comment_field = $current_form.find(GITHUB_SELECTORS.COMMENT_FIELD);
      $current_form.find(GITHUB_SELECTORS.COMMENT_FIELD).val($comment_field.val() + ' :+1:');
      $comment_field.focus();
      $add_single_comment_button = $current_form.find('button[name=single_comment]');
      if ($add_single_comment_button.length !== 0) {
        $add_single_comment_button.click();
        return;
      }
      $other_submit_button = $current_form.find("input[type=submit], button[type=submit]").first();
      if (!$other_submit_button.prop('disabled')) {
        return $other_submit_button.click();
      }
    };

    BindPetitDecoEvents.prototype.lgtmSelectionStarterOnClick = function(e) {
      var $comment_field, $current_form, $self;
      $self = $(e.currentTarget);
      $current_form = $self.parents('form');
      $comment_field = $current_form.find(GITHUB_SELECTORS.COMMENT_FIELD);
      this.$lgtm_selection_panel_node.css('top', $self.offset().top - 230);
      this.$lgtm_selection_panel_node.css('left', $comment_field.offset().left + 100);
      this.$lgtm_selection_panel_node.attr({
        comment_field_id: '#' + $comment_field.attr('id')
      });
      this.$lgtm_selection_panel_backdrop_node.show();
      return this.$lgtm_selection_panel_node.show();
    };

    BindPetitDecoEvents.prototype.lgtmSelectionBackdropOnClick = function(e) {
      $(e.target).hide();
      return this.$lgtm_selection_panel_node.hide();
    };

    BindPetitDecoEvents.prototype.lgtmSelectionLGTMImageOnClick = function(e) {
      var $comment_field, $lgtm_panel, $self;
      $self = $(e.currentTarget);
      $lgtm_panel = $self.parents(PETIT_DECO_JS_SELECTORS.LGTM_SELECTION.PANEL);
      $comment_field = $($lgtm_panel.attr('comment_field_id'));
      $comment_field.val($comment_field.val() + ' ' + $self.data('markdown'));
      this.$lgtm_selection_panel_backdrop_node.hide();
      this.$lgtm_selection_panel_node.hide();
      return $comment_field.focus();
    };

    return BindPetitDecoEvents;

  })();
  InsertIcons = (function() {
    function InsertIcons($form) {
      this.$form = $form;
      this.insertPlusOneIcon();
      this.insertLGTMSelectionIcon();
    }

    InsertIcons.prototype.insertPlusOneIcon = function() {
      var $icon_node, $new_tab;
      $icon_node = $('<span/>').attr({
        "class": 'octicon octicon-thumbsup'
      });
      $new_tab = $('<div/>').attr({
        "class": 'tabnav-tab ' + PETIT_DECO_JS_SELECTORS.PLUS_ONE.STARTER.replace(/\./, ''),
        style: 'cursor: pointer;'
      }).append($icon_node);
      return this.$form.find(GITHUB_SELECTORS.TABNAV_TABS).append($new_tab.clone());
    };

    InsertIcons.prototype.insertLGTMSelectionIcon = function() {
      var $icon_node, $new_tab;
      $icon_node = $('<span/>').attr({
        "class": 'octicon octicon-mortar-board'
      });
      $new_tab = $('<div/>').attr({
        "class": 'tabnav-tab ' + PETIT_DECO_JS_SELECTORS.LGTM_SELECTION.STARTER.replace(/\./, ''),
        style: 'cursor: pointer;'
      }).append($icon_node);
      return this.$form.find(GITHUB_SELECTORS.TABNAV_TABS).append($new_tab.clone());
    };

    return InsertIcons;

  })();
  AddPetitDecoAbilityToCommentFormOnFocus = (function() {
    function AddPetitDecoAbilityToCommentFormOnFocus() {
      this.bindEvents();
    }

    AddPetitDecoAbilityToCommentFormOnFocus.prototype.bindEvents = function() {
      return $body.on('focus', GITHUB_SELECTORS.COMMENT_FIELD, this.onFocus);
    };

    AddPetitDecoAbilityToCommentFormOnFocus.prototype.onFocus = function(e) {
      var $form;
      $form = $(e.target).closest('form');
      if ($form.attr('petit_deco_ability') != null) {
        return;
      }
      new InsertIcons($form);
      return $form.attr({
        petit_deco_ability: true
      });
    };

    return AddPetitDecoAbilityToCommentFormOnFocus;

  })();
  decoratePreviewableCommentForm = function() {
    if ($.inArray($('meta[name="selected-link"]').attr('value'), ['repo_pulls', 'repo_issues']) === -1) {
      return;
    }
    new InsertLGTMImageSelectionBackdropAndPanel;
    new FetchLGTMImage;
    new CmdEnterBehavior;
    new DecorateTruncateTargetTextAsLink;
    new BindPetitDecoEvents;
    return new AddPetitDecoAbilityToCommentFormOnFocus;
  };
  return decoratePreviewableCommentForm();
});

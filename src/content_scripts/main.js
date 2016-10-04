var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

$(window).load(function() {
  var $body, AddPetitDecoAbilityToCommentFormOnFocus, CmdEnterBehavior, FetchLGTMImage, GITHUB_SELECTORS, InsertLGTMImageSelectionBackdropAndPanel, LGTMImageSelectionAbility, PETIT_DECO_SELECTORS, PlusOneAbility, decoratePreviewableCommentForm, fetched_lgtm_responses;
  $body = $('body');
  GITHUB_SELECTORS = {
    COMMENT_FIELD: '.js-comment-field',
    TABNAV_TABS: '.tabnav-tabs'
  };
  PETIT_DECO_SELECTORS = {
    LGTM_SELECTION: {
      BACKDROP: '.js-petit-deco-lgtm-selection-panel-backdrop',
      PANEL: '.js-petit-deco-lgtm-selection-panel',
      LGTM_IMAGE: '.js-petit-deco-lgtm-image'
    }
  };
  fetched_lgtm_responses = [];
  FetchLGTMImage = (function() {
    function FetchLGTMImage() {
      var f, j, len, ref;
      ref = [this.fetch, this.fetch, this.fetch];
      for (j = 0, len = ref.length; j < len; j++) {
        f = ref[j];
        f();
      }
    }

    FetchLGTMImage.prototype.fetch = function() {
      var port;
      port = chrome.runtime.connect({
        name: 'petit-deco-github'
      });
      port.postMessage();
      return port.onMessage.addListener(function(response) {
        fetched_lgtm_responses.push(response);
        return console.log(response);
      });
    };

    return FetchLGTMImage;

  })();
  PlusOneAbility = (function() {
    PlusOneAbility.prototype.selectors = {
      starter: '.js-petit-deco-insert-plus-one'
    };

    function PlusOneAbility($form) {
      this.$form = $form;
      this.insertIcon();
      this.bindEvents();
    }

    PlusOneAbility.prototype.insertIcon = function() {
      var $icon_node, $new_tab;
      $icon_node = $('<span/>').attr({
        "class": 'octicon octicon-thumbsup'
      });
      $new_tab = $('<div/>').attr({
        "class": 'tabnav-tab ' + this.selectors['starter'].replace(/\./, ''),
        style: 'cursor: pointer;'
      }).append($icon_node);
      return this.$form.find(GITHUB_SELECTORS.TABNAV_TABS).append($new_tab.clone());
    };

    PlusOneAbility.prototype.bindEvents = function() {
      $body.off('click', this.selectors['starter']);
      return $body.on('click', this.selectors['starter'], function(e) {
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
      });
    };

    return PlusOneAbility;

  })();
  InsertLGTMImageSelectionBackdropAndPanel = (function() {
    function InsertLGTMImageSelectionBackdropAndPanel() {
      this.insertLGTMSelectionPanelBackdrop();
      this.insertLGTMSelectionPanel();
    }

    InsertLGTMImageSelectionBackdropAndPanel.prototype.insertLGTMSelectionPanelBackdrop = function() {
      var $lgtm_selection_panel_backdrop_node;
      $lgtm_selection_panel_backdrop_node = $('<div/>').attr({
        "class": PETIT_DECO_SELECTORS.LGTM_SELECTION.BACKDROP.replace(/\./, ''),
        style: 'z-index: 100; display:none; position:fixed; top:0; left:0; width:100%; height:120%;'
      });
      return $lgtm_selection_panel_backdrop_node.appendTo($body);
    };

    InsertLGTMImageSelectionBackdropAndPanel.prototype.insertLGTMSelectionPanel = function() {
      var $lgtm_selection_panel_node, $lgtm_selection_panel_triangle_node;
      $lgtm_selection_panel_node = $('<div/>').attr({
        "class": PETIT_DECO_SELECTORS.LGTM_SELECTION.PANEL.replace(/\./, '')
      });
      $lgtm_selection_panel_node.css({
        display: 'none',
        zIndex: '200',
        position: 'absolute',
        cursor: 'pointer',
        width: '640px',
        height: '220px',
        background: '#333',
        borderRadius: '3px',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.075)'
      });
      $lgtm_selection_panel_node.append($('<img/>').attr({
        "class": PETIT_DECO_SELECTORS.LGTM_SELECTION.LGTM_IMAGE.replace(/\./, ''),
        style: 'margin: 10px 0 10px 10px;',
        width: 200,
        height: 200
      }));
      $lgtm_selection_panel_node.append($('<img/>').attr({
        "class": PETIT_DECO_SELECTORS.LGTM_SELECTION.LGTM_IMAGE.replace(/\./, ''),
        style: 'margin: 10px;',
        width: 200,
        height: 200
      }));
      $lgtm_selection_panel_node.append($('<img/>').attr({
        "class": PETIT_DECO_SELECTORS.LGTM_SELECTION.LGTM_IMAGE.replace(/\./, ''),
        style: 'margin: 10px 10px 10px 0px;',
        width: 200,
        height: 200
      }));
      $lgtm_selection_panel_triangle_node = $('<div/>').css({
        position: 'absolute',
        bottom: '-10px',
        left: '32%',
        marginLeft: '-13px',
        width: '0',
        height: '0',
        borderTop: '10px solid #333',
        borderLeft: '10px solid transparent',
        borderRight: '10px solid transparent'
      });
      $lgtm_selection_panel_node.append($lgtm_selection_panel_triangle_node);
      return $lgtm_selection_panel_node.appendTo($body);
    };

    return InsertLGTMImageSelectionBackdropAndPanel;

  })();
  LGTMImageSelectionAbility = (function() {
    LGTMImageSelectionAbility.prototype.selectors = {
      starter: '.js-petit-deco-insert-lgtm-selection-panel'
    };

    function LGTMImageSelectionAbility($form) {
      this.bindEvents = bind(this.bindEvents, this);
      this.insertIcon = bind(this.insertIcon, this);
      this.$form = $form;
      this.insertIcon();
      this.bindEvents();
    }

    LGTMImageSelectionAbility.prototype.insertIcon = function() {
      var $icon_node, $new_tab;
      $icon_node = $('<span/>').attr({
        "class": 'octicon octicon-mortar-board'
      });
      $new_tab = $('<div/>').attr({
        "class": 'tabnav-tab ' + this.selectors['starter'].replace(/\./, ''),
        style: 'cursor: pointer;'
      }).append($icon_node);
      return this.$form.find(GITHUB_SELECTORS.TABNAV_TABS).append($new_tab.clone());
    };

    LGTMImageSelectionAbility.prototype.bindEvents = function() {
      var $current_form;
      $current_form = null;
      $body.off('click', this.selectors['starter']);
      $body.on('click', this.selectors['starter'], function(e) {
        var $comment_field, $lgtm_images, $lgtm_selection_panel_backdrop_node, $lgtm_selection_panel_node, $self;
        $self = $(e.currentTarget);
        $current_form = $self.parents('form');
        $comment_field = $current_form.find(GITHUB_SELECTORS.COMMENT_FIELD);
        $lgtm_selection_panel_backdrop_node = $(PETIT_DECO_SELECTORS.LGTM_SELECTION.BACKDROP);
        $lgtm_selection_panel_node = $(PETIT_DECO_SELECTORS.LGTM_SELECTION.PANEL);
        $lgtm_selection_panel_node.css('top', $self.offset().top - 220);
        $lgtm_selection_panel_node.css('left', $comment_field.offset().left);
        $lgtm_images = $lgtm_selection_panel_node.find(PETIT_DECO_SELECTORS.LGTM_SELECTION.LGTM_IMAGE);
        $lgtm_images.each(function(i, element) {
          var response;
          response = fetched_lgtm_responses[i];
          $(element).data('markdown', response.markdown);
          return $(element).attr({
            src: response.base64_image
          });
        });
        $lgtm_selection_panel_backdrop_node.show();
        return $lgtm_selection_panel_node.show();
      });
      $body.off('click', PETIT_DECO_SELECTORS.LGTM_SELECTION.BACKDROP);
      $body.on('click', PETIT_DECO_SELECTORS.LGTM_SELECTION.BACKDROP, function(e) {
        var $lgtm_selection_panel_node;
        $(e.target).hide();
        $lgtm_selection_panel_node = $(PETIT_DECO_SELECTORS.LGTM_SELECTION.PANEL);
        return $lgtm_selection_panel_node.hide();
      });
      $body.off('click', PETIT_DECO_SELECTORS.LGTM_SELECTION.LGTM_IMAGE);
      return $body.on('click', PETIT_DECO_SELECTORS.LGTM_SELECTION.LGTM_IMAGE, function(e) {
        var $comment_field, $lgtm_selection_panel_backdrop_node, $lgtm_selection_panel_node, $self;
        $self = $(e.currentTarget);
        $comment_field = $current_form.find(GITHUB_SELECTORS.COMMENT_FIELD);
        $comment_field.val($comment_field.val() + ' ' + $self.data('markdown'));
        $lgtm_selection_panel_backdrop_node = $(PETIT_DECO_SELECTORS.LGTM_SELECTION.BACKDROP);
        $lgtm_selection_panel_backdrop_node.hide();
        $lgtm_selection_panel_node = $(PETIT_DECO_SELECTORS.LGTM_SELECTION.PANEL);
        $lgtm_selection_panel_node.hide();
        return $comment_field.focus();
      });
    };

    return LGTMImageSelectionAbility;

  })();
  CmdEnterBehavior = (function() {
    function CmdEnterBehavior() {
      this.onClick = bind(this.onClick, this);
      this.bindEvents();
    }

    CmdEnterBehavior.prototype.bindEvents = function() {
      $(document).on('click', '.js-add-single-line-comment', this.onClick);
      return $('.js-quick-submit').on('keydown', this.onKeydown);
    };

    CmdEnterBehavior.prototype.onClick = function(e) {
      var $cloned_textarea, $inserted_tr, $textarea;
      $inserted_tr = $(e.target).closest('tr').next();
      $textarea = $inserted_tr.find('.js-quick-submit');
      $cloned_textarea = $textarea.clone();
      $textarea.after($cloned_textarea);
      $textarea.remove();
      $cloned_textarea.on('keydown', this.onKeydown);
      return $cloned_textarea.focus();
    };

    CmdEnterBehavior.prototype.onKeydown = function(e) {
      var $add_single_comment_button, $form, $other_submit_button;
      if (!(e.keyCode === 13 && e.metaKey)) {
        return;
      }
      $form = $(e.target.form);
      $add_single_comment_button = $form.find('button[name=single_comment]');
      if ($add_single_comment_button.length !== 0) {
        $add_single_comment_button.click();
        return;
      }
      $other_submit_button = $form.find("input[type=submit], button[type=submit]").first();
      if (!$other_submit_button.prop('disabled')) {
        return $other_submit_button.click();
      }
    };

    return CmdEnterBehavior;

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
      new PlusOneAbility($form);
      new LGTMImageSelectionAbility($form);
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
    new FetchLGTMImage;
    new InsertLGTMImageSelectionBackdropAndPanel;
    new AddPetitDecoAbilityToCommentFormOnFocus;
    return new CmdEnterBehavior;
  };
  return decoratePreviewableCommentForm();
});

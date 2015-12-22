var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

$(function() {
  var COMMON_SELECTORS, EmojiPallet, LGTMImageSelection, PlusOne, decoratePreviewableCommentForm;
  COMMON_SELECTORS = {
    PREVIEWABLE_COMMENT_FORM: '.js-previewable-comment-form',
    COMMENT_FIELD: '.js-comment-field',
    EMOJI_SUGGESTIONS: '.emoji-suggestions',
    NAVIGATION_ITEM: '.js-navigation-item'
  };
  PlusOne = (function() {
    PlusOne.prototype.selectors = {
      starter: '.js-petit-deco-insert-plus-one'
    };

    function PlusOne() {
      this.insertIcon();
      this.bindEvents();
    }

    PlusOne.prototype.insertIcon = function() {
      var $icon_node, $new_tab;
      $icon_node = $('<span/>').attr({
        "class": 'octicon octicon-thumbsup'
      });
      $new_tab = $('<div/>').attr({
        "class": 'tabnav-tab ' + this.selectors['starter'].replace(/\./, ''),
        style: 'cursor: pointer;'
      }).append($icon_node);
      return $(COMMON_SELECTORS.PREVIEWABLE_COMMENT_FORM).each(function() {
        return $(this).find('.tabnav-tabs').append($new_tab.clone());
      });
    };

    PlusOne.prototype.bindEvents = function() {
      return $('body').on('click', this.selectors['starter'], function(e) {
        var $comment_field, $current_form;
        $current_form = $(e.target).parents(COMMON_SELECTORS.PREVIEWABLE_COMMENT_FORM);
        $comment_field = $current_form.find(COMMON_SELECTORS.COMMENT_FIELD);
        $current_form.find(COMMON_SELECTORS.COMMENT_FIELD).val($comment_field.val() + ' :+1:');
        return $comment_field.focus();
      });
    };

    return PlusOne;

  })();
  LGTMImageSelection = (function() {
    LGTMImageSelection.prototype.selectors = {
      starter: '.js-petit-deco-insert-lgtm-selection-panel',
      backdrop: '.js-petit-deco-lgtm-selection-panel-backdrop',
      panel: '.js-petit-deco-lgtm-selection-panel',
      lgtm_image: '.js-petit-deco-lgtm-image'
    };

    function LGTMImageSelection() {
      this.bindEvents = bind(this.bindEvents, this);
      this.insertIcon = bind(this.insertIcon, this);
      this.insertLGTMSelectionPanel = bind(this.insertLGTMSelectionPanel, this);
      this.insertLGTMSelectionPanelBackdrop = bind(this.insertLGTMSelectionPanelBackdrop, this);
      this.deferred = new $.Deferred;
      this.insertLGTMSelectionPanelBackdrop();
      this.deferred.promise().then(this.insertLGTMSelectionPanel);
      this.deferred.promise().then(this.insertIcon);
      this.deferred.promise().then(this.bindEvents);
    }

    LGTMImageSelection.prototype.insertLGTMSelectionPanelBackdrop = function() {
      var $lgtm_selection_panel_backdrop_node;
      $lgtm_selection_panel_backdrop_node = $('<div/>').attr({
        "class": this.selectors['backdrop'].replace(/\./, ''),
        style: 'z-index: 100; display:none; position:fixed; top:0; left:0; width:100%; height:120%;'
      });
      $lgtm_selection_panel_backdrop_node.appendTo('body');
      return this.deferred.resolve();
    };

    LGTMImageSelection.prototype.insertLGTMSelectionPanel = function() {
      var $lgtm_selection_panel_node, $lgtm_selection_panel_triangle_node;
      $lgtm_selection_panel_node = $('<div/>').attr({
        "class": this.selectors['panel'].replace(/\./, '')
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
        "class": this.selectors['lgtm_image'].replace(/\./, ''),
        style: 'margin: 10px 0 10px 10px;',
        width: 200,
        height: 200
      }));
      $lgtm_selection_panel_node.append($('<img/>').attr({
        "class": this.selectors['lgtm_image'].replace(/\./, ''),
        style: 'margin: 10px;',
        width: 200,
        height: 200
      }));
      $lgtm_selection_panel_node.append($('<img/>').attr({
        "class": this.selectors['lgtm_image'].replace(/\./, ''),
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
      $lgtm_selection_panel_node.appendTo('body');
      return this.deferred.resolve();
    };

    LGTMImageSelection.prototype.insertIcon = function() {
      var $icon_node, $new_tab;
      $icon_node = $('<span/>').attr({
        "class": 'octicon octicon-mortar-board'
      });
      $new_tab = $('<div/>').attr({
        "class": 'tabnav-tab ' + this.selectors['starter'].replace(/\./, ''),
        style: 'cursor: pointer;'
      }).append($icon_node);
      $(COMMON_SELECTORS.PREVIEWABLE_COMMENT_FORM).each(function() {
        return $(this).find('.tabnav-tabs').append($new_tab.clone());
      });
      return this.deferred.resolve();
    };

    LGTMImageSelection.prototype.fetchLGTMImage = function($img_node) {
      var port;
      port = chrome.runtime.connect({
        name: 'petit-deco-github'
      });
      port.postMessage();
      return port.onMessage.addListener(function(markdown) {
        $img_node.data('markdown', markdown);
        return $img_node.attr({
          src: markdown.match(/http:[^)]+/)[0]
        });
      });
    };

    LGTMImageSelection.prototype.bindEvents = function() {
      var $current_form;
      $current_form = null;
      $('body').on('click', this.selectors['starter'], (function(_this) {
        return function(e) {
          var $comment_field, $lgtm_images, $lgtm_selection_panel_backdrop_node, $lgtm_selection_panel_node, $self;
          $self = $(e.currentTarget);
          $current_form = $self.parents(COMMON_SELECTORS.PREVIEWABLE_COMMENT_FORM);
          $comment_field = $current_form.find(COMMON_SELECTORS.COMMENT_FIELD);
          $lgtm_selection_panel_backdrop_node = $(_this.selectors['backdrop']);
          $lgtm_selection_panel_node = $(_this.selectors['panel']);
          $lgtm_selection_panel_node.css('top', $self.offset().top - 220);
          $lgtm_selection_panel_node.css('left', $comment_field.offset().left);
          $lgtm_images = $lgtm_selection_panel_node.find(_this.selectors['lgtm_image']);
          $lgtm_images.each(function(_i, element) {
            return _this.fetchLGTMImage($(element));
          });
          $lgtm_selection_panel_backdrop_node.show();
          return $lgtm_selection_panel_node.show();
        };
      })(this));
      $('body').on('click', this.selectors['backdrop'], (function(_this) {
        return function(e) {
          var $lgtm_selection_panel_node;
          $(e.target).hide();
          $lgtm_selection_panel_node = $(_this.selectors['panel']);
          return $lgtm_selection_panel_node.hide();
        };
      })(this));
      return $('body').on('click', this.selectors['lgtm_image'], (function(_this) {
        return function(e) {
          var $comment_field, $lgtm_selection_panel_backdrop_node, $lgtm_selection_panel_node, $self;
          $self = $(e.currentTarget);
          $comment_field = $current_form.find(COMMON_SELECTORS.COMMENT_FIELD);
          $comment_field.val($comment_field.val() + ' ' + $self.data('markdown'));
          $lgtm_selection_panel_backdrop_node = $(_this.selectors['backdrop']);
          $lgtm_selection_panel_backdrop_node.hide();
          $lgtm_selection_panel_node = $(_this.selectors['panel']);
          $lgtm_selection_panel_node.hide();
          return $comment_field.focus();
        };
      })(this));
    };

    return LGTMImageSelection;

  })();
  EmojiPallet = (function() {
    EmojiPallet.prototype.selectors = {
      starter: '.js-petit-deco-insert-emoji-pallet',
      backdrop: '.js-petit-deco-emoji-pallet-backdrop',
      pallet: '.js-petit-deco-emoji-pallet'
    };

    function EmojiPallet() {
      this.bindEvents = bind(this.bindEvents, this);
      this.insertIcon = bind(this.insertIcon, this);
      this.fetchSuggestions = bind(this.fetchSuggestions, this);
      this.insertEmojiPallet = bind(this.insertEmojiPallet, this);
      this.insertEmojiPalletBackdrop = bind(this.insertEmojiPalletBackdrop, this);
      this.deferred = new $.Deferred;
      this.insertEmojiPalletBackdrop();
      this.deferred.promise().then(this.insertEmojiPallet);
      this.deferred.promise().then(this.fetchSuggestions);
      this.deferred.promise().then(this.insertIcon);
      this.deferred.promise().then(this.bindEvents);
    }

    EmojiPallet.prototype.insertEmojiPalletBackdrop = function() {
      var $emoji_pallet_backdrop_node;
      $emoji_pallet_backdrop_node = $('<div/>').attr({
        "class": this.selectors['backdrop'].replace(/\./, ''),
        style: 'z-index: 100; display:none; position:fixed; top:0; left:0; width:100%; height:120%;'
      });
      $emoji_pallet_backdrop_node.appendTo('body');
      return this.deferred.resolve();
    };

    EmojiPallet.prototype.insertEmojiPallet = function() {
      var $emoji_pallet_node, $emoji_pallet_triangle_node;
      $emoji_pallet_node = $('<div/>').attr({
        "class": this.selectors['pallet'].replace(/\./, '')
      });
      $emoji_pallet_node.css({
        display: 'none',
        zIndex: '200',
        position: 'absolute',
        width: '670px',
        height: '200px',
        padding: '10px',
        background: '#333',
        borderRadius: '3px',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.075)',
        cursor: 'pointer'
      });
      $emoji_pallet_triangle_node = $('<div/>').css({
        zIndex: '300',
        position: 'absolute',
        bottom: '-10px',
        left: '37%',
        marginLeft: '-13px',
        width: '0',
        height: '0',
        borderTop: '10px solid #333',
        borderLeft: '10px solid transparent',
        borderRight: '10px solid transparent'
      });
      $emoji_pallet_node.append($emoji_pallet_triangle_node);
      $emoji_pallet_node.appendTo('body');
      return this.deferred.resolve();
    };

    EmojiPallet.prototype.fetchSuggestions = function() {
      return $.ajax($('.js-suggester').first().data('url')).done((function(_this) {
        return function(suggestions) {
          var $emoji_suggestion;
          $emoji_suggestion = $(suggestions).filter(COMMON_SELECTORS.EMOJI_SUGGESTIONS).show();
          $emoji_suggestion.css({
            fontSize: 0,
            height: '180px',
            overflow: 'scroll'
          });
          $(_this.selectors['pallet']).prepend($emoji_suggestion);
          $(_this.selectors['pallet']).find('li').each(function() {
            var $span;
            $span = $(this).find('span');
            $(this).html($span);
            return $(this).css({
              display: 'inline-block'
            });
          });
          return _this.deferred.resolve();
        };
      })(this));
    };

    EmojiPallet.prototype.insertIcon = function() {
      var $icon_node, $new_tab;
      $icon_node = $('<span/>').attr({
        "class": 'octicon octicon-octoface'
      });
      $new_tab = $('<div/>').attr({
        "class": 'tabnav-tab ' + this.selectors['starter'].replace(/\./, ''),
        style: 'cursor: pointer;'
      }).append($icon_node);
      $(COMMON_SELECTORS.PREVIEWABLE_COMMENT_FORM).each(function() {
        return $(this).find('.tabnav-tabs').append($new_tab.clone());
      });
      return this.deferred.resolve();
    };

    EmojiPallet.prototype.bindEvents = function() {
      var $current_form;
      $current_form = null;
      $('body').on('click', this.selectors['starter'], (function(_this) {
        return function(e) {
          var $comment_field, $emoji_pallet_backdrop_node, $emoji_pallet_node, $self;
          $self = $(e.currentTarget);
          $current_form = $self.parents(COMMON_SELECTORS.PREVIEWABLE_COMMENT_FORM);
          $comment_field = $current_form.find(COMMON_SELECTORS.COMMENT_FIELD);
          $emoji_pallet_backdrop_node = $(_this.selectors['backdrop']);
          $emoji_pallet_backdrop_node.show();
          $emoji_pallet_node = $(_this.selectors['pallet']);
          $emoji_pallet_node.css('top', $self.offset().top - 200);
          $emoji_pallet_node.css('left', $comment_field.offset().left);
          return $emoji_pallet_node.show();
        };
      })(this));
      $('body').on('click', this.selectors['backdrop'], (function(_this) {
        return function(e) {
          var $emoji_pallet_node;
          $(e.target).hide();
          $emoji_pallet_node = $(_this.selectors['pallet']);
          return $emoji_pallet_node.hide();
        };
      })(this));
      return $('body').on('click', COMMON_SELECTORS.NAVIGATION_ITEM, (function(_this) {
        return function(e) {
          var $comment_field, $emoji_pallet_backdrop_node, $emoji_pallet_node, $self;
          $self = $(e.currentTarget);
          $comment_field = $current_form.find(COMMON_SELECTORS.COMMENT_FIELD);
          $comment_field.val($comment_field.val() + ' ' + $self.data('value'));
          $emoji_pallet_backdrop_node = $(_this.selectors['backdrop']);
          $emoji_pallet_backdrop_node.hide();
          $emoji_pallet_node = $(_this.selectors['pallet']);
          $emoji_pallet_node.hide();
          return $comment_field.focus();
        };
      })(this));
    };

    return EmojiPallet;

  })();
  decoratePreviewableCommentForm = function() {
    if ($(COMMON_SELECTORS.PREVIEWABLE_COMMENT_FORM).length === 0) {
      return;
    }
    new PlusOne;
    new LGTMImageSelection;
    return new EmojiPallet;
  };
  return decoratePreviewableCommentForm();
});
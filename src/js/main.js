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
    PlusOne.prototype.selector = 'js-petit-deco-insert-plus-one';

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
        "class": 'tabnav-tab ' + this.selector,
        style: 'cursor: pointer;'
      }).append($icon_node);
      return $(COMMON_SELECTORS.PREVIEWABLE_COMMENT_FORM).each(function() {
        return $(this).find('.tabnav-tabs').append($new_tab.clone());
      });
    };

    PlusOne.prototype.bindEvents = function() {
      return $('body').on('click', '.' + this.selector, function(e) {
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
    function LGTMImageSelection() {
      this.insertSelectionPanel();
      this.insertIcon();
      this.bindEvents();
    }

    LGTMImageSelection.prototype.insertSelectionPanel = function() {};

    LGTMImageSelection.prototype.insertIcon = function() {};

    LGTMImageSelection.prototype.bindEvents = function() {};

    return LGTMImageSelection;

  })();
  EmojiPallet = (function() {
    EmojiPallet.prototype.selectors = {
      starter: '.js-petit-deco-insert-emoji-pallet',
      backdrop: '.js-petit-deco-emoji-pallet-backdrop',
      pallet: '.emoji-suggestions'
    };

    function EmojiPallet() {
      this.bindEvents = bind(this.bindEvents, this);
      this.insertIcon = bind(this.insertIcon, this);
      this.fetchSuggestions = bind(this.fetchSuggestions, this);
      this.insertEmojiPalletBackdrop = bind(this.insertEmojiPalletBackdrop, this);
      this.deferred = new $.Deferred;
      this.insertEmojiPalletBackdrop();
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

    EmojiPallet.prototype.fetchSuggestions = function() {
      return $.ajax($('.js-suggester').first().data('url')).done((function(_this) {
        return function(suggestions) {
          var $emoji_suggestion;
          $emoji_suggestion = $(suggestions).filter(COMMON_SELECTORS.EMOJI_SUGGESTIONS).show();
          $emoji_suggestion.appendTo('body');
          $(_this.selectors['pallet']).css({
            position: 'absolute',
            zIndex: '200',
            width: '670px',
            fontSize: '0px',
            background: '#f7f7f7',
            height: '200px',
            overflow: 'scroll'
          });
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
          $self = $(e.target);
          $current_form = $self.parents(COMMON_SELECTORS.PREVIEWABLE_COMMENT_FORM);
          $comment_field = $current_form.find(COMMON_SELECTORS.COMMENT_FIELD);
          $emoji_pallet_backdrop_node = $(_this.selectors['backdrop']);
          $emoji_pallet_backdrop_node.show();
          $emoji_pallet_node = $(_this.selectors['pallet']);
          $emoji_pallet_node.css('top', $comment_field.offset().top);
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
      $('body').on('click', COMMON_SELECTORS.NAVIGATION_ITEM, (function(_this) {
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
      return this.deferred.resolve();
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

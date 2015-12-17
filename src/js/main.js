var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

$(function() {
  var COMMON_SELECTORS, EmojiPallet, LGTMImageSelection, PlusOne, decoratePreviewableCommentForm;
  COMMON_SELECTORS = {
    PREVIEWABLE_COMMENT_FORM: '.js-previewable-comment-form',
    COMMENT_FIELD: '.js-comment-field'
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
        var $current_form, current_text;
        $current_form = $(e.target).parents(COMMON_SELECTORS.PREVIEWABLE_COMMENT_FORM);
        current_text = $current_form.find(COMMON_SELECTORS.COMMENT_FIELD).val();
        return $current_form.find(COMMON_SELECTORS.COMMENT_FIELD).val(current_text + ' :+1:');
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
        "class": this.selectors['backdrop'],
        style: 'z-index: 100; display:none; position:fixed; top:0; left:0; width:100%; height:120%;'
      });
      $emoji_pallet_backdrop_node.appendTo('body');
      return this.deferred.resolve();
    };

    EmojiPallet.prototype.fetchSuggestions = function() {
      return $.ajax($('.js-suggester').first().data('url')).done((function(_this) {
        return function(suggestions) {
          $(suggestions).appendTo(_this.selectors['backdrop']);
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
      $('body').on('click', '.' + this.selectors['starter'], function(e) {
        var $current_form, $emoji_pallet_backdrop_node, $emoji_pallet_node, $self;
        $self = $(this);
        $emoji_pallet_backdrop_node = $(this.selectors['backdrop']);
        $emoji_pallet_backdrop_node.show();
        $emoji_pallet_node = $(this.selectors['pallet']);
        $emoji_pallet_node.show();
        $emoji_pallet_node.css('top', $self.offset().top + 42);
        $emoji_pallet_node.css('left', '25%');
        return $current_form = $(this).parents('form');
      });
      $('body').on('click', this.selectors['backdrop'], function(e) {
        var $emoji_pallet_node;
        $(this).hide();
        $emoji_pallet_node = $('.js-pallet');
        return $emoji_pallet_node.hide();
      });
      $('body').on('click', '.js-pallet-icon', function(e) {
        var $emoji_pallet_backdrop_node, $emoji_pallet_node, $text_area;
        $text_area = $current_form.find('.js-note-text');
        $text_area.val($text_area.val() + ' ' + $(this).data('emoji'));
        $current_form.find('.js-comment-button').removeClass('disabled').removeAttr('disabled');
        $emoji_pallet_backdrop_node = $('.js-pallet-backdrop');
        $emoji_pallet_backdrop_node.hide();
        $emoji_pallet_node = $('.js-pallet');
        $emoji_pallet_node.hide();
        return $text_area.focus();
      });
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

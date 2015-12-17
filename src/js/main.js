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
    function EmojiPallet() {
      this.insertIcon();
      this.bindEvents();
    }

    EmojiPallet.prototype.insertIcon = function() {};

    EmojiPallet.prototype.bindEvents = function() {};

    return EmojiPallet;

  })();
  decoratePreviewableCommentForm = function() {
    new PlusOne;
    new LGTMImageSelection;
    return new EmojiPallet;
  };
  return decoratePreviewableCommentForm();
});

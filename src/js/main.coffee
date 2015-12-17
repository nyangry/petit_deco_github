$ ->
  COMMON_SELECTORS =
    PREVIEWABLE_COMMENT_FORM: '.js-previewable-comment-form'
    COMMENT_FIELD: '.js-comment-field'


  class PlusOne
    selector: 'js-petit-deco-insert-plus-one'

    constructor: ->
      @insertIcon()
      @bindEvents()

    insertIcon: ->
      $icon_node = $('<span/>').attr(
        class: 'octicon octicon-thumbsup'
      )

      $new_tab = $('<div/>').attr(
        class: 'tabnav-tab ' + @selector
        style: 'cursor: pointer;'
      ).append($icon_node)

      $(COMMON_SELECTORS.PREVIEWABLE_COMMENT_FORM).each ->
        $(@).find('.tabnav-tabs').append $new_tab.clone()


    bindEvents: ->
      $('body').on 'click', '.' + @selector, (e) ->
        $current_form = $(e.target).parents(COMMON_SELECTORS.PREVIEWABLE_COMMENT_FORM)

        current_text = $current_form.find(COMMON_SELECTORS.COMMENT_FIELD).val()

        $current_form.find(COMMON_SELECTORS.COMMENT_FIELD).val(current_text + ' :+1:')


  class LGTMImageSelection
    constructor: ->
      @insertSelectionPanel()
      @insertIcon()
      @bindEvents()

    insertSelectionPanel: ->

    insertIcon: ->

    bindEvents: ->


  class EmojiPallet
    constructor: ->
      @insertIcon()
      @bindEvents()

    insertIcon: ->

    bindEvents: ->


  decoratePreviewableCommentForm = ->
    new PlusOne
    new LGTMImageSelection
    new EmojiPallet


  decoratePreviewableCommentForm()

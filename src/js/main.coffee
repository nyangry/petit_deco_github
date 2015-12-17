$ ->
  COMMON_SELECTORS =
    PREVIEWABLE_COMMENT_FORM: '.js-previewable-comment-form'
    COMMENT_FIELD: '.js-comment-field'
    EMOJI_SUGGESTIONS: '.emoji-suggestions'
    NAVIGATION_ITEM: '.js-navigation-item'


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

        $comment_field = $current_form.find(COMMON_SELECTORS.COMMENT_FIELD)

        $current_form.find(COMMON_SELECTORS.COMMENT_FIELD).val($comment_field.val() + ' :+1:')

        $comment_field.focus()


  class LGTMImageSelection
    constructor: ->
      @insertSelectionPanel()
      @insertIcon()
      @bindEvents()

    insertSelectionPanel: ->

    insertIcon: ->

    bindEvents: ->


  class EmojiPallet
    selectors:
      starter: '.js-petit-deco-insert-emoji-pallet'
      backdrop: '.js-petit-deco-emoji-pallet-backdrop'
      pallet: '.emoji-suggestions'

    constructor: ->
      @deferred = new $.Deferred

      @insertEmojiPalletBackdrop()
      @deferred.promise().then(@fetchSuggestions)
      @deferred.promise().then(@insertIcon)
      @deferred.promise().then(@bindEvents)

    insertEmojiPalletBackdrop: =>
      $emoji_pallet_backdrop_node = $('<div/>').attr
        class: @selectors['backdrop'].replace(/\./, '')
        style: 'z-index: 100; display:none; position:fixed; top:0; left:0; width:100%; height:120%;'

      $emoji_pallet_backdrop_node.appendTo('body')

      @deferred.resolve()

    fetchSuggestions: =>
      $.ajax($('.js-suggester').first().data('url')).done (suggestions) =>
        $emoji_suggestion = $(suggestions).filter(COMMON_SELECTORS.EMOJI_SUGGESTIONS).show()
        $emoji_suggestion.appendTo('body')

        $(@selectors['pallet']).css(
          position: 'absolute'
          zIndex: '200'
          width: '670px'
          fontSize: '0px'
          background: '#f7f7f7'
          height: '200px'
          overflow: 'scroll'
        )

        $(@selectors['pallet']).find('li').each ->
          $span = $(@).find('span')

          $(@).html($span)

          $(@).css(
            display: 'inline-block'
          )

        @deferred.resolve()

    insertIcon: =>
      $icon_node = $('<span/>').attr(
        class: 'octicon octicon-octoface'
      )

      $new_tab = $('<div/>').attr(
        class: 'tabnav-tab ' + @selectors['starter'].replace(/\./, '')
        style: 'cursor: pointer;'
      ).append($icon_node)

      $(COMMON_SELECTORS.PREVIEWABLE_COMMENT_FORM).each ->
        $(@).find('.tabnav-tabs').append $new_tab.clone()

      @deferred.resolve()

    bindEvents: =>
      $current_form = null

      $('body').on 'click', @selectors['starter'], (e) =>
        $self = $(e.target)

        $current_form = $self.parents(COMMON_SELECTORS.PREVIEWABLE_COMMENT_FORM)
        $comment_field = $current_form.find(COMMON_SELECTORS.COMMENT_FIELD)

        $emoji_pallet_backdrop_node = $(@selectors['backdrop'])
        $emoji_pallet_backdrop_node.show()

        $emoji_pallet_node = $(@selectors['pallet'])
        $emoji_pallet_node.css 'top', $comment_field.offset().top
        $emoji_pallet_node.css 'left', $comment_field.offset().left
        $emoji_pallet_node.show()


      # 絵文字パレット以外の領域クリックでパレットを閉じる
      $('body').on 'click', @selectors['backdrop'], (e) =>
        $(e.target).hide()

        $emoji_pallet_node = $(@selectors['pallet'])
        $emoji_pallet_node.hide()

      # 絵文字を選択する
      $('body').on 'click', COMMON_SELECTORS.NAVIGATION_ITEM, (e) =>
        $self = $(e.currentTarget)

        $comment_field = $current_form.find(COMMON_SELECTORS.COMMENT_FIELD)

        # 絵文字タグを挿入する
        $comment_field.val $comment_field.val() + ' ' + $self.data('value')

        # パレットを閉じる
        $emoji_pallet_backdrop_node = $(@selectors['backdrop'])
        $emoji_pallet_backdrop_node.hide()

        $emoji_pallet_node = $(@selectors['pallet'])
        $emoji_pallet_node.hide()

        # テキストエリアにフォーカスする
        $comment_field.focus()

      @deferred.resolve()


  decoratePreviewableCommentForm = ->
    return if $(COMMON_SELECTORS.PREVIEWABLE_COMMENT_FORM).length is 0

    new PlusOne
    new LGTMImageSelection
    new EmojiPallet


  decoratePreviewableCommentForm()

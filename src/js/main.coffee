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
        class: @selectors['backdrop']
        style: 'z-index: 100; display:none; position:fixed; top:0; left:0; width:100%; height:120%;'

      $emoji_pallet_backdrop_node.appendTo 'body'

      @deferred.resolve()

    fetchSuggestions: =>
      $.ajax($('.js-suggester').first().data('url')).done (suggestions) =>
        $(suggestions).appendTo(@selectors['backdrop'])

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
      $('body').on 'click', '.' + @selectors['starter'], (e) ->
        $self = $(@)

        $emoji_pallet_backdrop_node = $(@selectors['backdrop'])
        $emoji_pallet_backdrop_node.show()

        $emoji_pallet_node = $(@selectors['pallet'])
        $emoji_pallet_node.show()
        $emoji_pallet_node.css 'top', $self.offset().top + 42
        # $emoji_pallet_node.css 'left', $self.offset().left + 18
        $emoji_pallet_node.css 'left', '25%'

        # 現在開いているコメント欄を保存しておく
        $current_form = $(@).parents('form')

      # 絵文字パレット以外の領域クリックでパレットを閉じる
      $('body').on 'click', @selectors['backdrop'], (e) ->
        $(@).hide()
        $emoji_pallet_node = $('.js-pallet')
        $emoji_pallet_node.hide()

      # 絵文字を選択する
      $('body').on 'click', '.js-pallet-icon', (e) ->
        $text_area = $current_form.find('.js-note-text')

        # 絵文字タグを挿入する
        $text_area.val $text_area.val() + ' ' + $(@).data 'emoji'

        # コメント追加ボタンのdisabledを解除する
        $current_form.find('.js-comment-button').removeClass('disabled').removeAttr('disabled')

        # パレットを閉じる
        $emoji_pallet_backdrop_node = $('.js-pallet-backdrop')
        $emoji_pallet_backdrop_node.hide()

        $emoji_pallet_node = $('.js-pallet')
        $emoji_pallet_node.hide()

        # テキストエリアにフォーカスする
        $text_area.focus()

      @deferred.resolve()


  decoratePreviewableCommentForm = ->
    return if $(COMMON_SELECTORS.PREVIEWABLE_COMMENT_FORM).length is 0

    new PlusOne
    new LGTMImageSelection
    new EmojiPallet


  decoratePreviewableCommentForm()

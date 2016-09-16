$ ->
  $body = $('body')

  COMMON_SELECTORS =
    PREVIEWABLE_COMMENT_FORM: '.js-previewable-comment-form'
    COMMENT_FIELD: '.js-comment-field'
    EMOJI_SUGGESTIONS: '.emoji-suggestions'
    NAVIGATION_ITEM: '.js-navigation-item'


  class PlusOne
    selectors:
      starter: '.js-petit-deco-insert-plus-one'

    constructor: ->
      @insertIcon()
      @bindEvents()

    insertIcon: ->
      $icon_node = $('<span/>').attr(
        class: 'octicon octicon-thumbsup'
      )

      $new_tab = $('<div/>').attr(
        class: 'tabnav-tab ' + @selectors['starter'].replace(/\./, '')
        style: 'cursor: pointer;'
      ).append($icon_node)

      $(COMMON_SELECTORS.PREVIEWABLE_COMMENT_FORM).each ->
        $(@).find('.tabnav-tabs').append $new_tab.clone()

    bindEvents: ->
      $body.off 'click', @selectors['starter']

      $body.on 'click', @selectors['starter'], (e) ->
        $current_form = $(e.target).parents 'form'

        $comment_field = $current_form.find(COMMON_SELECTORS.COMMENT_FIELD)

        $current_form.find(COMMON_SELECTORS.COMMENT_FIELD).val($comment_field.val() + ' :+1:')

        $comment_field.focus()

        $current_form.find('button[type=submit]').click()


  class LGTMImageSelection
    selectors:
      starter: '.js-petit-deco-insert-lgtm-selection-panel'
      backdrop: '.js-petit-deco-lgtm-selection-panel-backdrop'
      panel: '.js-petit-deco-lgtm-selection-panel'
      lgtm_image: '.js-petit-deco-lgtm-image'

    constructor: ->
      @deferred = new $.Deferred

      @insertLGTMSelectionPanelBackdrop()
      @deferred.promise().then(@insertLGTMSelectionPanel)
      @deferred.promise().then(@insertIcon)
      @deferred.promise().then(@bindEvents)

    insertLGTMSelectionPanelBackdrop: =>
      $lgtm_selection_panel_backdrop_node = $('<div/>').attr
        class: @selectors['backdrop'].replace(/\./, '')
        style: 'z-index: 100; display:none; position:fixed; top:0; left:0; width:100%; height:120%;'

      $lgtm_selection_panel_backdrop_node.appendTo $body

      @deferred.resolve()

    insertLGTMSelectionPanel: =>
      $lgtm_selection_panel_node = $('<div/>').attr
        class: @selectors['panel'].replace(/\./, '')

      $lgtm_selection_panel_node.css(
        display: 'none'
        zIndex: '200'
        position: 'absolute'
        cursor: 'pointer'
        width: '640px'
        height: '220px'
        background: '#333'
        borderRadius: '3px'
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.075)'
      )

      $lgtm_selection_panel_node.append $('<img/>').attr
        class: @selectors['lgtm_image'].replace(/\./, '')
        style: 'margin: 10px 0 10px 10px;'
        width: 200
        height: 200

      $lgtm_selection_panel_node.append $('<img/>').attr
        class: @selectors['lgtm_image'].replace(/\./, '')
        style: 'margin: 10px;'
        width: 200
        height: 200

      $lgtm_selection_panel_node.append $('<img/>').attr
        class: @selectors['lgtm_image'].replace(/\./, '')
        style: 'margin: 10px 10px 10px 0px;'
        width: 200
        height: 200

      $lgtm_selection_panel_triangle_node = $('<div/>').css(
        position: 'absolute'
        bottom: '-10px'
        left: '32%'
        marginLeft: '-13px'
        width: '0'
        height: '0'
        borderTop: '10px solid #333'
        borderLeft: '10px solid transparent'
        borderRight: '10px solid transparent'
      )

      $lgtm_selection_panel_node.append $lgtm_selection_panel_triangle_node

      $lgtm_selection_panel_node.appendTo $body

      @deferred.resolve()

    insertIcon: =>
      $icon_node = $('<span/>').attr(
        class: 'octicon octicon-mortar-board'
      )

      $new_tab = $('<div/>').attr(
        class: 'tabnav-tab ' + @selectors['starter'].replace(/\./, '')
        style: 'cursor: pointer;'
      ).append($icon_node)

      $(COMMON_SELECTORS.PREVIEWABLE_COMMENT_FORM).each ->
        $(@).find('.tabnav-tabs').append $new_tab.clone()

      @deferred.resolve()

    fetchLGTMImage: ($img_node) ->
      port = chrome.runtime.connect(name: 'petit-deco-github')

      port.postMessage()

      port.onMessage.addListener (response) ->
        $img_node.data 'markdown', response.markdown

        $img_node.attr
          src: response.base64_image

    bindEvents: =>
      $current_form = null

      $body.off 'click', @selectors['starter']

      $body.on 'click', @selectors['starter'], (e) =>
        $self = $(e.currentTarget)

        $current_form  = $self.parents 'form'
        $comment_field = $current_form.find(COMMON_SELECTORS.COMMENT_FIELD)

        $lgtm_selection_panel_backdrop_node = $(@selectors['backdrop'])

        $lgtm_selection_panel_node = $(@selectors['panel'])
        $lgtm_selection_panel_node.css 'top', $self.offset().top - 220
        $lgtm_selection_panel_node.css 'left', $comment_field.offset().left

        $lgtm_images = $lgtm_selection_panel_node.find(@selectors['lgtm_image'])

        $lgtm_images.each (_i, element)=>
          @fetchLGTMImage $(element)

        $lgtm_selection_panel_backdrop_node.show()
        $lgtm_selection_panel_node.show()

      $body.off 'click', @selectors['backdrop']

      $body.on 'click', @selectors['backdrop'], (e) =>
        $(e.target).hide()

        $lgtm_selection_panel_node = $(@selectors['panel'])
        $lgtm_selection_panel_node.hide()

      $body.off 'click', @selectors['lgtm_image']

      $body.on 'click', @selectors['lgtm_image'], (e) =>
        $self = $(e.currentTarget)

        $comment_field = $current_form.find(COMMON_SELECTORS.COMMENT_FIELD)

        $comment_field.val $comment_field.val() + ' ' + $self.data('markdown')

        $lgtm_selection_panel_backdrop_node = $(@selectors['backdrop'])
        $lgtm_selection_panel_backdrop_node.hide()

        $lgtm_selection_panel_node = $(@selectors['panel'])
        $lgtm_selection_panel_node.hide()

        # テキストエリアにフォーカスする
        $comment_field.focus()


  class EmojiPallet
    selectors:
      starter: '.js-petit-deco-insert-emoji-pallet'
      backdrop: '.js-petit-deco-emoji-pallet-backdrop'
      pallet: '.js-petit-deco-emoji-pallet'

    constructor: ->
      @deferred = new $.Deferred

      @insertEmojiPalletBackdrop()
      @deferred.promise().then(@insertEmojiPallet)
      @deferred.promise().then(@fetchSuggestions)
      @deferred.promise().then(@insertIcon)
      @deferred.promise().then(@bindEvents)

    insertEmojiPalletBackdrop: =>
      $emoji_pallet_backdrop_node = $('<div/>').attr
        class: @selectors['backdrop'].replace(/\./, '')
        style: 'z-index: 100; display:none; position:fixed; top:0; left:0; width:100%; height:120%;'

      $emoji_pallet_backdrop_node.appendTo $body

      @deferred.resolve()

    insertEmojiPallet: =>
      $emoji_pallet_node = $('<div/>').attr
        class: @selectors['pallet'].replace(/\./, '')

      $emoji_pallet_node.css(
        display: 'none'
        zIndex: '200'
        position: 'absolute'
        width: '670px'
        height: '200px'
        padding: '10px'
        background: '#333'
        borderRadius: '3px'
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.075)'
        cursor: 'pointer'
      )

      $emoji_pallet_triangle_node = $('<div/>').css(
        zIndex: '300'
        position: 'absolute'
        bottom: '-10px'
        left: '37%'
        marginLeft: '-13px'
        width: '0'
        height: '0'
        borderTop: '10px solid #333'
        borderLeft: '10px solid transparent'
        borderRight: '10px solid transparent'
      )

      $emoji_pallet_node.append $emoji_pallet_triangle_node

      $emoji_pallet_node.appendTo $body

      @deferred.resolve()

    fetchSuggestions: =>
      $.ajax($('.js-suggester').first().data('url')).done (suggestions) =>
        $emoji_suggestion = $(suggestions).filter(COMMON_SELECTORS.EMOJI_SUGGESTIONS).show()

        $emoji_suggestion.css(
          fontSize: 0
          height: '180px'
          overflow: 'scroll'
        )

        $(@selectors['pallet']).prepend($emoji_suggestion)

        $(@selectors['pallet']).find('li').each ->
          emoji = $(@).data('raw-value')

          $(@).html(emoji)

          $(@).css(
            fontSize: '20px'
            height: '20px'
            width: '20px'
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

      $body.off 'click', @selectors['starter']

      $body.on 'click', @selectors['starter'], (e) =>
        $self = $(e.currentTarget)

        $current_form  = $self.parents 'form'
        $comment_field = $current_form.find(COMMON_SELECTORS.COMMENT_FIELD)

        $emoji_pallet_backdrop_node = $(@selectors['backdrop'])
        $emoji_pallet_backdrop_node.show()

        $emoji_pallet_node = $(@selectors['pallet'])
        $emoji_pallet_node.css 'top', $self.offset().top - 200
        $emoji_pallet_node.css 'left', $comment_field.offset().left
        $emoji_pallet_node.show()

      # 絵文字パレット以外の領域クリックでパレットを閉じる
      $body.off 'click', @selectors['backdrop']

      $body.on 'click', @selectors['backdrop'], (e) =>
        $(e.target).hide()

        $emoji_pallet_node = $(@selectors['pallet'])
        $emoji_pallet_node.hide()

      # 絵文字を選択する
      $body.off 'click', COMMON_SELECTORS.NAVIGATION_ITEM

      $body.on 'click', COMMON_SELECTORS.NAVIGATION_ITEM, (e) =>
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


  # テキストエリアでの cmd + enter の挙動をフックして、Add single comment ボタンを押したことにする
  class CmdEnterBehavior
    constructor: ->
      @bindEvents()

    bindEvents: ->
      # textarea の動的な追加に対応する
      $(document).on 'click', '.js-add-single-line-comment', @onClick

      # GitHub のデフォルトの挙動を上書きする
      #
      # GitHub's CODE:
      #   return "ctrl+enter" === t.hotkey || "meta+enter" === t.hotkey ? (n = e(this).closest("form"),
      #   i = n.find("input[type=submit], button[type=submit]").first(),
      #   i.prop("disabled") || n.submit(),
      #   !1) : void 0
      $('.js-quick-submit').on 'keydown', @onKeydown

    onClick: (e) =>
      $inserted_tr = $(e.target).closest('tr').next()

      $inserted_tr.find('.js-quick-submit').on 'keydown', @onKeydown

    onKeydown: (e) ->
      return unless (e.keyCode == 13 and e.metaKey)

      $form = $(e.target.form)

      # Add single comment ボタンを探してみて、見つかれば click event を発火させる
      $add_single_comment_button = $form.find('button[name=single_comment]')

      if $add_single_comment_button.length isnt 0
        $add_single_comment_button.trigger 'click'

        return

      # Add single comment ボタンが見つからなかった場合、他の submit ボタンが disabled でなければ、click event を発火させる
      $other_submit_button = $form.find("input[type=submit], button[type=submit]").first()

      unless $other_submit_button.prop 'disabled'
        $other_submit_button.trigger 'click'


  decoratePreviewableCommentForm = ->
    return if $(COMMON_SELECTORS.PREVIEWABLE_COMMENT_FORM).length is 0

    new PlusOne
    new LGTMImageSelection
    new EmojiPallet
    new CmdEnterBehavior

  decoratePreviewableCommentForm()

  # PR画面のタブ切り替えで、アイコンがインサートされない問題の対応
  $(document).on 'pjax:end', ->
    decoratePreviewableCommentForm()

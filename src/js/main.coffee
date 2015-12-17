$ ->
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
      $('body').on 'click', @selectors['starter'], (e) ->
        $current_form = $(e.target).parents(COMMON_SELECTORS.PREVIEWABLE_COMMENT_FORM)

        $comment_field = $current_form.find(COMMON_SELECTORS.COMMENT_FIELD)

        $current_form.find(COMMON_SELECTORS.COMMENT_FIELD).val($comment_field.val() + ' :+1:')

        $comment_field.focus()


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

      $lgtm_selection_panel_backdrop_node.appendTo('body')

      @deferred.resolve()

    insertLGTMSelectionPanel: =>
      $lgtm_selection_panel_node = $('<div/>').attr
        class: @selectors['panel'].replace(/\./, '')

      $lgtm_selection_panel_node.css(
        display: 'none'
        zIndex: '200'
        position: 'absolute'
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
        left: '33%'
        marginLeft: '-10px'
        width: '0'
        height: '0'
        borderTop: '10px solid #333'
        borderLeft: '10px solid transparent'
        borderRight: '10px solid transparent'
      )

      $lgtm_selection_panel_node.append $lgtm_selection_panel_triangle_node

      $lgtm_selection_panel_node.appendTo('body')

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

    bindEvents: =>
      $current_form = null

      $('body').on 'click', @selectors['starter'], (e) =>
        $self = $(e.currentTarget)


        $current_form = $self.parents(COMMON_SELECTORS.PREVIEWABLE_COMMENT_FORM)
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


      $('body').on 'click', @selectors['backdrop'], (e) =>
        $(e.target).hide()

        $emoji_pallet_node = $(@selectors['panel'])
        $emoji_pallet_node.hide()

    fetchLGTMImage: ($img_node) =>
      # $.getJSON 'http://www.lgtm.in/g', (data) ->
      #   # LGTM画像を挿入する
      #   lgtm_image = data.markdown.split('\n\n')[0]
      #   console.log lgtm_image
      #   # $text_area.val $text_area.val() + ' ' + lgtm_image


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
          display: 'none'
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

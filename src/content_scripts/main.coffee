$(window).load ->
  $body = $('body')

  GITHUB_SELECTORS =
    COMMENT_FIELD: '.js-comment-field'
    TABNAV_TABS: '.tabnav-tabs'

  PETIT_DECO_SELECTORS = {
    LGTM_SELECTION:
      BACKDROP: '.js-petit-deco-lgtm-selection-panel-backdrop'
      PANEL: '.js-petit-deco-lgtm-selection-panel'
      LGTM_IMAGE: '.js-petit-deco-lgtm-image'
  }

  fetched_lgtm_responses = []

  class FetchLGTMImage
    constructor: ->
      for f in [@fetch, @fetch, @fetch]
        f()

    fetch: ->
      port = chrome.runtime.connect(name: 'petit-deco-github')

      port.postMessage()

      port.onMessage.addListener (response) ->
        fetched_lgtm_responses.push response
        console.log response

  class PlusOneAbility
    selectors:
      starter: '.js-petit-deco-insert-plus-one'

    constructor: ($form) ->
      @$form = $form

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

      @$form.find(GITHUB_SELECTORS.TABNAV_TABS).append $new_tab.clone()

    bindEvents: ->
      $body.off 'click', @selectors['starter']

      $body.on 'click', @selectors['starter'], (e) ->
        $current_form = $(e.target).parents 'form'

        $comment_field = $current_form.find(GITHUB_SELECTORS.COMMENT_FIELD)

        $current_form.find(GITHUB_SELECTORS.COMMENT_FIELD).val($comment_field.val() + ' :+1:')

        $comment_field.focus()

        # Add single comment ボタンを探してみて、見つかれば click event を発火させる
        $add_single_comment_button = $current_form.find('button[name=single_comment]')

        if $add_single_comment_button.length isnt 0
          $add_single_comment_button.click()

          return

        # Add single comment ボタンが見つからなかった場合、他の submit ボタンが disabled でなければ、click event を発火させる
        $other_submit_button = $current_form.find("input[type=submit], button[type=submit]").first()

        unless $other_submit_button.prop 'disabled'
          $other_submit_button.click()

  class InsertLGTMImageSelectionBackdropAndPanel
    constructor: ->
      @insertLGTMSelectionPanelBackdrop()
      @insertLGTMSelectionPanel()

    insertLGTMSelectionPanelBackdrop: ->
      $lgtm_selection_panel_backdrop_node = $('<div/>').attr
        class: PETIT_DECO_SELECTORS.LGTM_SELECTION.BACKDROP.replace(/\./, '')
        style: 'z-index: 100; display:none; position:fixed; top:0; left:0; width:100%; height:120%;'

      $lgtm_selection_panel_backdrop_node.appendTo $body

    insertLGTMSelectionPanel: ->
      $lgtm_selection_panel_node = $('<div/>').attr
        class: PETIT_DECO_SELECTORS.LGTM_SELECTION.PANEL.replace(/\./, '')

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
        class: PETIT_DECO_SELECTORS.LGTM_SELECTION.LGTM_IMAGE.replace(/\./, '')
        style: 'margin: 10px 0 10px 10px;'
        width: 200
        height: 200

      $lgtm_selection_panel_node.append $('<img/>').attr
        class: PETIT_DECO_SELECTORS.LGTM_SELECTION.LGTM_IMAGE.replace(/\./, '')
        style: 'margin: 10px;'
        width: 200
        height: 200

      $lgtm_selection_panel_node.append $('<img/>').attr
        class: PETIT_DECO_SELECTORS.LGTM_SELECTION.LGTM_IMAGE.replace(/\./, '')
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

  class LGTMImageSelectionAbility
    selectors:
      starter: '.js-petit-deco-insert-lgtm-selection-panel'

    constructor: ($form) ->
      @$form = $form

      @insertIcon()
      @bindEvents()

    insertIcon: =>
      $icon_node = $('<span/>').attr(
        class: 'octicon octicon-mortar-board'
      )

      $new_tab = $('<div/>').attr(
        class: 'tabnav-tab ' + @selectors['starter'].replace(/\./, '')
        style: 'cursor: pointer;'
      ).append($icon_node)

      @$form.find(GITHUB_SELECTORS.TABNAV_TABS).append $new_tab.clone()

    bindEvents: =>
      $current_form = null

      $body.off 'click', @selectors['starter']

      $body.on 'click', @selectors['starter'], (e) ->
        $self = $(e.currentTarget)

        $current_form  = $self.parents 'form'
        $comment_field = $current_form.find(GITHUB_SELECTORS.COMMENT_FIELD)

        $lgtm_selection_panel_backdrop_node = $(PETIT_DECO_SELECTORS.LGTM_SELECTION.BACKDROP)

        $lgtm_selection_panel_node = $(PETIT_DECO_SELECTORS.LGTM_SELECTION.PANEL)
        $lgtm_selection_panel_node.css 'top', $self.offset().top - 220
        $lgtm_selection_panel_node.css 'left', $comment_field.offset().left

        $lgtm_images = $lgtm_selection_panel_node.find(PETIT_DECO_SELECTORS.LGTM_SELECTION.LGTM_IMAGE)

        $lgtm_images.each (i, element) ->
          response = fetched_lgtm_responses[i]

          $(element).data 'markdown', response.markdown

          $(element).attr
            src: response.base64_image

        $lgtm_selection_panel_backdrop_node.show()
        $lgtm_selection_panel_node.show()

      $body.off 'click', PETIT_DECO_SELECTORS.LGTM_SELECTION.BACKDROP

      $body.on 'click', PETIT_DECO_SELECTORS.LGTM_SELECTION.BACKDROP, (e) ->
        $(e.target).hide()

        $lgtm_selection_panel_node = $(PETIT_DECO_SELECTORS.LGTM_SELECTION.PANEL)
        $lgtm_selection_panel_node.hide()

      $body.off 'click', PETIT_DECO_SELECTORS.LGTM_SELECTION.LGTM_IMAGE

      $body.on 'click', PETIT_DECO_SELECTORS.LGTM_SELECTION.LGTM_IMAGE, (e) ->
        $self = $(e.currentTarget)

        $comment_field = $current_form.find(GITHUB_SELECTORS.COMMENT_FIELD)

        $comment_field.val $comment_field.val() + ' ' + $self.data('markdown')

        $lgtm_selection_panel_backdrop_node = $(PETIT_DECO_SELECTORS.LGTM_SELECTION.BACKDROP)
        $lgtm_selection_panel_backdrop_node.hide()

        $lgtm_selection_panel_node = $(PETIT_DECO_SELECTORS.LGTM_SELECTION.PANEL)
        $lgtm_selection_panel_node.hide()

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

      # textarea イベントを削ぎ落とすために、Node を clone して、差し替える
      $textarea        = $inserted_tr.find('.js-quick-submit')
      $cloned_textarea = $textarea.clone()

      $textarea.after $cloned_textarea
      $textarea.remove()

      $cloned_textarea.on 'keydown', @onKeydown

      $cloned_textarea.focus()

    onKeydown: (e) ->
      return unless (e.keyCode == 13 and e.metaKey)

      $form = $(e.target.form)

      # Add single comment ボタンを探してみて、見つかれば click event を発火させる
      $add_single_comment_button = $form.find('button[name=single_comment]')

      if $add_single_comment_button.length isnt 0
        $add_single_comment_button.click()

        return

      # Add single comment ボタンが見つからなかった場合、他の submit ボタンが disabled でなければ、click event を発火させる
      $other_submit_button = $form.find("input[type=submit], button[type=submit]").first()

      unless $other_submit_button.prop 'disabled'
        $other_submit_button.click()

  class AddPetitDecoAbilityToCommentFormOnFocus
    constructor: ->
      @bindEvents()

    bindEvents: ->
      $body.on 'focus', GITHUB_SELECTORS.COMMENT_FIELD, @onFocus

    onFocus: (e) ->
      $form = $(e.target).closest 'form'

      # 既に機能を付与済みの form はスキップする
      return if $form.attr('petit_deco_ability')?

      new PlusOneAbility($form)
      new LGTMImageSelectionAbility($form)

      # 機能が一度しか付与されないように、フラグを設定しておく
      $form.attr
        petit_deco_ability: true

  decoratePreviewableCommentForm = ->
    # repo_pulls, repo_issues の場合のみ、実行する
    return if $.inArray($('meta[name="selected-link"]').attr('value'), ['repo_pulls', 'repo_issues']) is -1

    # 最初に非同期でLGTM画像を取得しておく
    new FetchLGTMImage

    # LGTM 画像選択パネルをページに埋め込んでおく
    new InsertLGTMImageSelectionBackdropAndPanel

    # パフォーマンス向上のため、
    # コメントフィールドにフォーカスがあったタイミングで、
    # 初めて当該コメントフィールドの form に機能を付与する
    new AddPetitDecoAbilityToCommentFormOnFocus

    new CmdEnterBehavior

  decoratePreviewableCommentForm()

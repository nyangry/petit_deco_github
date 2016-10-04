$(window).load ->
  $body = $('body')

  GITHUB_SELECTORS =
    COMMENT_FIELD: '.js-comment-field'
    TABNAV_TABS: '.tabnav-tabs'

  PETIT_DECO_JS_SELECTORS = {
    PLUS_ONE:
      STARTER: '.js-petit-deco-insert-plus-one'

    LGTM_SELECTION:
      STARTER: '.js-petit-deco-insert-lgtm-selection-panel'
      BACKDROP: '.js-petit-deco-lgtm-selection-panel-backdrop'
      PANEL: '.js-petit-deco-lgtm-selection-panel'
      LGTM_IMAGE: '.js-petit-deco-lgtm-image'
  }

  PETIT_DECO_CSS_CLASSES = {
    LGTM_SELECTION:
      PANEL: 'petit-deco-lgtm-selection-panel'
      BACKDROP: 'petit-deco-lgtm-selection-backdrop'
      FLEX_CONTAINER: 'petit-deco-lgtm-selection-flex-container'
      PANEL_TRIANGLE: 'petit-deco-lgtm-selection-panel-triangle'
  }

  class InsertLGTMImageSelectionBackdropAndPanel
    constructor: ->
      @insertLGTMSelectionPanelBackdrop()
      @insertLGTMSelectionPanel()

    insertLGTMSelectionPanelBackdrop: ->
      $lgtm_selection_panel_backdrop_node = $('<div/>').attr
        class: [
          PETIT_DECO_JS_SELECTORS.LGTM_SELECTION.BACKDROP.replace(/\./, ''),
          PETIT_DECO_CSS_CLASSES.LGTM_SELECTION.BACKDROP
        ].join ' '

      $lgtm_selection_panel_backdrop_node.appendTo $body

    insertLGTMSelectionPanel: ->
      $lgtm_selection_panel_node = $('<div/>').attr
        class: [
          PETIT_DECO_JS_SELECTORS.LGTM_SELECTION.PANEL.replace(/\./, ''),
          PETIT_DECO_CSS_CLASSES.LGTM_SELECTION.PANEL
        ].join(' ')
        style: 'display: none;'

      $lgtm_selection_panel_node.append $('<div/>').attr
        class: PETIT_DECO_CSS_CLASSES.LGTM_SELECTION.FLEX_CONTAINER

      $lgtm_image_node_base = $('<img/>').attr
        class: PETIT_DECO_JS_SELECTORS.LGTM_SELECTION.LGTM_IMAGE.replace(/\./, '')

      $lgtm_selection_panel_node.find('div').append $lgtm_image_node_base.clone()
      $lgtm_selection_panel_node.find('div').append $lgtm_image_node_base.clone()
      $lgtm_selection_panel_node.find('div').append $lgtm_image_node_base.clone()
      $lgtm_selection_panel_node.find('div').append $lgtm_image_node_base.clone()
      $lgtm_selection_panel_node.find('div').append $lgtm_image_node_base.clone()
      $lgtm_selection_panel_node.find('div').append $lgtm_image_node_base.clone()

      $lgtm_selection_panel_triangle_node = $('<div/>').attr
        class: PETIT_DECO_CSS_CLASSES.LGTM_SELECTION.PANEL_TRIANGLE

      $lgtm_selection_panel_node.append $lgtm_selection_panel_triangle_node

      $lgtm_selection_panel_node.appendTo $body

  class FetchLGTMImage
    constructor: ->
      @$lgtm_images = $(PETIT_DECO_JS_SELECTORS.LGTM_SELECTION.PANEL).find(PETIT_DECO_JS_SELECTORS.LGTM_SELECTION.LGTM_IMAGE)

      @port = chrome.runtime.connect(name: 'petit-deco-github')

      @port.onMessage.addListener (response) =>
        @setLGTMimage response

      count = 0

      while count < 6
        @port.postMessage()

        count++

    setLGTMimage: (lgtm_image_data) ->
      $lgtm_image = @$lgtm_images.not('[loaded]').first()

      $lgtm_image.data 'markdown', lgtm_image_data.markdown
      $lgtm_image.attr
        loaded: true
        src: lgtm_image_data.base64_image

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

  class BindPetitDecoEvents
    constructor: ->
      @$lgtm_selection_panel_node          = $(PETIT_DECO_JS_SELECTORS.LGTM_SELECTION.PANEL)
      @$lgtm_selection_panel_backdrop_node = $(PETIT_DECO_JS_SELECTORS.LGTM_SELECTION.BACKDROP)

      # +1
      $body.on 'click', PETIT_DECO_JS_SELECTORS.PLUS_ONE.STARTER, @plusOneStarterOnClick

      # LGTM selection
      $body.on 'click', PETIT_DECO_JS_SELECTORS.LGTM_SELECTION.STARTER, @lgtmSelectionStarterOnClick

      $body.on 'click', PETIT_DECO_JS_SELECTORS.LGTM_SELECTION.BACKDROP, @lgtmSelectionBackdropOnClick

      $body.on 'click', PETIT_DECO_JS_SELECTORS.LGTM_SELECTION.LGTM_IMAGE, @lgtmSelectionLGTMImageOnClick

    plusOneStarterOnClick: (e) ->
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

    lgtmSelectionStarterOnClick: (e) =>
      $self = $(e.currentTarget)

      $current_form  = $self.parents 'form'
      $comment_field = $current_form.find(GITHUB_SELECTORS.COMMENT_FIELD)

      @$lgtm_selection_panel_node.css 'top', $self.offset().top - 220
      @$lgtm_selection_panel_node.css 'left', $comment_field.offset().left

      @$lgtm_selection_panel_backdrop_node.show()
      @$lgtm_selection_panel_node.show()

    lgtmSelectionBackdropOnClick: (e) =>
      $(e.target).hide()

      @$lgtm_selection_panel_node.hide()

    lgtmSelectionLGTMImageOnClick: (e) =>
      $self = $(e.currentTarget)

      $comment_field = $current_form.find(GITHUB_SELECTORS.COMMENT_FIELD)

      $comment_field.val $comment_field.val() + ' ' + $self.data('markdown')

      @$lgtm_selection_panel_backdrop_node.hide()

      @$lgtm_selection_panel_node.hide()

      # テキストエリアにフォーカスする
      $comment_field.focus()

  class InsertIcons
    constructor: ($form) ->
      @$form = $form

      @insertPlusOneIcon()
      @insertLGTMSelectionIcon()

    insertPlusOneIcon: ->
      $icon_node = $('<span/>').attr(
        class: 'octicon octicon-thumbsup'
      )

      $new_tab = $('<div/>').attr(
        class: 'tabnav-tab ' + PETIT_DECO_JS_SELECTORS.PLUS_ONE.STARTER.replace(/\./, '')
        style: 'cursor: pointer;'
      ).append($icon_node)

      @$form.find(GITHUB_SELECTORS.TABNAV_TABS).append $new_tab.clone()

    insertLGTMSelectionIcon: ->
      $icon_node = $('<span/>').attr(
        class: 'octicon octicon-mortar-board'
      )

      $new_tab = $('<div/>').attr(
        class: 'tabnav-tab ' + PETIT_DECO_JS_SELECTORS.LGTM_SELECTION.STARTER.replace(/\./, '')
        style: 'cursor: pointer;'
      ).append($icon_node)

      @$form.find(GITHUB_SELECTORS.TABNAV_TABS).append $new_tab.clone()

  class AddPetitDecoAbilityToCommentFormOnFocus
    constructor: ->
      @bindEvents()

    bindEvents: ->
      $body.on 'focus', GITHUB_SELECTORS.COMMENT_FIELD, @onFocus

    onFocus: (e) ->
      $form = $(e.target).closest 'form'

      # 既に機能を付与済みの form はスキップする
      return if $form.attr('petit_deco_ability')?

      # form にアイコンを追加する
      new InsertIcons($form)

      # 機能が一度しか付与されないように、フラグを設定しておく
      $form.attr
        petit_deco_ability: true

  decoratePreviewableCommentForm = ->
    # repo_pulls, repo_issues の場合のみ、実行する
    return if $.inArray($('meta[name="selected-link"]').attr('value'), ['repo_pulls', 'repo_issues']) is -1

    # LGTM 画像選択パネルをページに埋め込んでおく
    new InsertLGTMImageSelectionBackdropAndPanel

    # 最初に非同期でLGTM画像を取得しておく
    new FetchLGTMImage

    new CmdEnterBehavior

    new BindPetitDecoEvents

    # パフォーマンス向上のため、
    # コメントフィールドにフォーカスがあったタイミングで、
    # 初めて当該コメントフィールドの form に機能を付与する
    new AddPetitDecoAbilityToCommentFormOnFocus

  decoratePreviewableCommentForm()

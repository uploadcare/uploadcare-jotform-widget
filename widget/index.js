/* global JFCustomWidget, uploadcare */

/**
 * Resize JotForm widget frame
 *
 * @param width
 * @param height
 */
function resize(width, height) {
  JFCustomWidget.requestFrameResize({
    width: width,
    height: height,
  })
}

function cropOption(mode, width, height) {
  switch (mode) {
  case 'free crop':
    return 'free'
  case 'aspect ratio':
    return parseInt(width) + ':' + parseInt(height)
  case 'downscale':
    return parseInt(width) + 'x' + parseInt(height)
  case 'downscale & upscale':
    return parseInt(width) + 'x' + parseInt(height) + ' upscale'
  case 'downscale & minimum size':
    return parseInt(width) + 'x' + parseInt(height) + ' minimum'
  default:
    return 'disabled'
  }
}

function sanitizeFileName(fileName) {
  var regexp = /[^A-Za-z0-9_]+/g
  var extension = fileName.split('.').pop()
  var name = fileName.substring(0, fileName.length - extension.length)
  return name.replace(regexp, '') + '.' + extension.replace(regexp, '')
}

JFCustomWidget.subscribe('ready', function(data) {
  var isMultiple = (JFCustomWidget.getWidgetSetting('multiple') === 'Yes')
  var hasEffectsTab = (JFCustomWidget.getWidgetSetting('effectsTab') === 'Yes')
  var addFileName = (JFCustomWidget.getWidgetSetting('addFileName') === 'Yes')
  var customString = JFCustomWidget.getWidgetSetting('customString') || ''

  var globalSettings = JFCustomWidget.getWidgetSetting('globalSettings')

  if (globalSettings) {
    var script = document.createElement('script')

    script.innerHTML = globalSettings

    document.head.appendChild(script)
  }

  if (hasEffectsTab) {
    var effectsTabScript = document.createElement('script')

    effectsTabScript.addEventListener('load', function() {
      if (window.uploadcareTabEffects) {
        uploadcare.registerTab('preview', window.uploadcareTabEffects)
      }
    })
    effectsTabScript.src = 'https://ucarecdn.com/libs/widget-tab-effects/1.x/uploadcare.tab-effects.min.js'

    document.body.appendChild(effectsTabScript)
  }

  uploadcare.start({
    integration: 'JotForm; File-Uploader/' + document.getElementById('index-script').src.split('?v=')[1],
    publicKey: JFCustomWidget.getWidgetSetting('publicKey'),
    locale: JFCustomWidget.getWidgetSetting('locale') || 'en',
    imagesOnly: (JFCustomWidget.getWidgetSetting('imagesOnly') === 'Yes'),
    previewStep: (JFCustomWidget.getWidgetSetting('previewStep') === 'Yes'),
    multiple: isMultiple,
    multipleMin: JFCustomWidget.getWidgetSetting('multipleMin'),
    multipleMax: JFCustomWidget.getWidgetSetting('multipleMax'),
    crop: cropOption(
      JFCustomWidget.getWidgetSetting('crop'),
      JFCustomWidget.getWidgetSetting('cropWidth'),
      JFCustomWidget.getWidgetSetting('cropHeight')
    ),
    imageShrink: JFCustomWidget.getWidgetSetting('imageShrink'),
    effects: JFCustomWidget.getWidgetSetting('effects'),
  })

  var widget = uploadcare.Widget('[role=uploadcare-uploader]')

  widget.onDialogOpen(function(dialog) {
    resize(618, 600)

    dialog.always(function() {
      resize(458, 40)
    })
  })

  var files = (data && data.value) ? data.value.split('\n') : []

  if (files.length) {
    widget.value(isMultiple ? files : files[0])
  }

  widget.onChange(function(file) {
    files = []

    if (file) {
      var uploadedFiles = file.files ? file.files() : [file]

      if(uploadedFiles.length){
        JFCustomWidget.hideWidgetError()
      }

      var $ = uploadcare.jQuery

      $.when.apply(null, uploadedFiles).done(function() {
        var fileInfos = arguments

        $.each(fileInfos, function(i, fileInfo) {
          var fileName = (addFileName) ? sanitizeFileName(fileInfo.name) : ''
          var url = fileInfo.cdnUrl + customString + fileName

          files.push(url)
        })

        JFCustomWidget.sendData({value: files.join('\n')})
      })
    }
    else {
      JFCustomWidget.sendData({value: ''})
    }
  })

  JFCustomWidget.subscribe('submit', function() {
    var msg = {
      valid: !!files.length,
      value: files.join('\n'),
    }

    JFCustomWidget.sendSubmit(msg)
  })
})

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
			break
		case 'aspect ratio':
			return parseInt(width) + ':' + parseInt(height)
			break
		case 'downscale':
			return parseInt(width) + 'x' + parseInt(height)
			break
		case 'downscale & upscale':
			return parseInt(width) + 'x' + parseInt(height) + ' upscale'
			break
		case 'downscale & minimum size':
			return parseInt(width) + 'x' + parseInt(height) + ' minimum'
			break
		default:
			return 'disabled'
	}
}

JFCustomWidget.subscribe('ready', function(data) {
	var isMultiple = (JFCustomWidget.getWidgetSetting('multiple') == 'Yes')

	var globalSettings = JFCustomWidget.getWidgetSetting('globalSettings')

	if (globalSettings) {
		var script = document.createElement('script')

		script.innerHTML = globalSettings

		document.head.appendChild(script)
	}

	uploadcare.start({
		publicKey: JFCustomWidget.getWidgetSetting('publicKey'),
		locale: JFCustomWidget.getWidgetSetting('locale') || 'en',
		imagesOnly: (JFCustomWidget.getWidgetSetting('imagesOnly') == 'Yes'),
		previewStep: (JFCustomWidget.getWidgetSetting('previewStep') == 'Yes'),
		multiple: isMultiple,
		multipleMin: JFCustomWidget.getWidgetSetting('multipleMin'),
		multipleMax: JFCustomWidget.getWidgetSetting('multipleMax'),
		crop: cropOption(
			JFCustomWidget.getWidgetSetting('crop'),
			JFCustomWidget.getWidgetSetting('cropWidth'),
			JFCustomWidget.getWidgetSetting('cropHeight')
		),
		imageShrink: JFCustomWidget.getWidgetSetting('imageShrink'),
	})

	var widget = uploadcare.Widget('[role=uploadcare-uploader]')

	var files = (data && data.value) ? data.value.split('\n') : []

	if (files.length) {
		widget.value(isMultiple ? files : files[0])
	}

	JFCustomWidget.subscribe('submit', function() {
		var msg = {
			valid: !!files.length,
			value: files.join('\n'),
		}

		JFCustomWidget.sendSubmit(msg)
	})

	widget.onDialogOpen(function(dialog) {
		resize(618, 600)

		dialog.always(function() {
			resize(458, 32)
		})
	})

	widget.onChange(function(file) {
		files = []
		var uploadedFiles = file.files ? file.files() : [file]

		uploadedFiles.forEach(function(uploadedFile) {
			uploadedFile.done(function(fileInfo) {
				files.push(fileInfo.cdnUrl)
			})
		})
	})
})

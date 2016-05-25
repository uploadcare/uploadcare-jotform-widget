function resize(w, h) {
    JFCustomWidget.requestFrameResize({
        width: w,
        height: h
    });
}

JFCustomWidget.subscribe('ready', function(){
    var fileOrGroupUUID = null;

    JFCustomWidget.subscribe("submit", function(){
        var msg = {
            valid: !!fileOrGroupUUID,
            value: fileOrGroupUUID
        };
        JFCustomWidget.sendSubmit(msg);
    });

    uploadcare.start({
        publicKey: JFCustomWidget.getWidgetSetting('publicKey'),
        locale: JFCustomWidget.getWidgetSetting('locale') || 'en',
        imagesOnly: (JFCustomWidget.getWidgetSetting('imagesOnly') == 'Yes'),
        multiple: (JFCustomWidget.getWidgetSetting('multiple') == 'Yes'),
        previewStep: (JFCustomWidget.getWidgetSetting('previewStep') == 'Yes'),
        tabs: 'all'
    });

    var widget = uploadcare.Widget('[role=uploadcare-uploader]');

    widget.onDialogOpen(function(dialog){
        resize(618, 600);

        dialog.always(function() {
            resize(458, 32);

        });
    });
    widget.onUploadComplete(function(info) {
        fileOrGroupUUID = info.cdnUrl;
    });
});
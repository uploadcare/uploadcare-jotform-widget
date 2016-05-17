function resize(w, h) {
    JFCustomWidget.requestFrameResize({
        width: w,
        height: h
    });
}

JFCustomWidget.subscribe('ready', function(){
    var file = null;

    JFCustomWidget.subscribe("submit", function(){
        var msg = {
            valid: !!file,
            value: file
        };
        JFCustomWidget.sendSubmit(msg);
    });

    UPLOADCARE_PUBLIC_KEY = JFCustomWidget.getWidgetSetting('publicKey');
    UPLOADCARE_LOCALE = JFCustomWidget.getWidgetSetting('locale') || 'en';
    UPLOADCARE_IMAGES_ONLY = (JFCustomWidget.getWidgetSetting('imagesOnly') == 'Yes');

    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = 'https://ucarecdn.com/widget/2.8.2/uploadcare/uploadcare.full.min.js';

    s.onload = function() {
        var widget = uploadcare.Widget('[role=uploadcare-uploader]');
        widget.onDialogOpen(function(dialog){
            resize(618, 500);

            dialog.always(function() {
                resize(458, 32);

            });
        });
        widget.onUploadComplete(function(info) {
            file = info.cdnUrl;
        });
    };

    document.body.appendChild(s);
});
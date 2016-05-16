var widget = uploadcare.Widget('[role=uploadcare-uploader]');

function resize() {
    JFCustomWidget.requestFrameResize({
        width: 618,
        height: 500
    });
}

JFCustomWidget.subscribe('ready', function(){
    widget.onDialogOpen(function(){
        resize();
    });
    
    uploadcare.start({
      publicKey: 'demopublickey'
    });
});

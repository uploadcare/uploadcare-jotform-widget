var widget = uploadcare.Widget('[role=uploadcare-uploader]');

function resize(w, h) {
    JFCustomWidget.requestFrameResize({
        width: w,
        height: h
    });
}

JFCustomWidget.subscribe('ready', function(){
    widget.onDialogOpen(function(dialog){
        resize(618, 500);
        
        dialog.always(function() {
            resize(300, 35);
        });
    });
    
    uploadcare.start({
      publicKey: 'demopublickey'
    });
});

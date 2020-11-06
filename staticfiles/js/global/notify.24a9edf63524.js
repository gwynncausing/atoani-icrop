/*
 * notify-bootstrap 
 * v1.0.0
 * https://github.com/the-muda-organization/notify-bootstrap
 * MIT License
 */
const notify = (type, title, message) => {
    
    //CREATE TOAST CONTAINER IF IT DOESN'T EXIST
    if($('.toast-container').length == 0){
        $('<div>',{
                'class':         'toast-container',
                'aria-live':     'polite',
                'aria-atomic':   'true',
            })
            .appendTo(document.body);
    }
    
    //VARIABLES
    let toast_container     = $('.toast-container'),
        toast_type          = type,
        toast_icon          = null,
        toast_title         = title,
        toast_message       = message,
        toast_btn_close_svg = '<svg class="svg-inline--fa fa-times fa-w-11 fa-fw fa-xs" width="24px" height="24px" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" data-fa-i2svg=""><path fill="#0a0a0a" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>';

    
    //VARIABLE - ICON
    switch(toast_type){
        //GENERAL:
        case 'success':    toast_icon = '<svg viewBox="0 0 512 512"><path fill="#69DC67" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"/></svg>';break;
        case 'error':      toast_icon = '<svg viewBox="0 0 512 512"><path fill="#f8f9fa" d="M497.9 150.5c9 9 14.1 21.2 14.1 33.9v143.1c0 12.7-5.1 24.9-14.1 33.9L361.5 497.9c-9 9-21.2 14.1-33.9 14.1H184.5c-12.7 0-24.9-5.1-33.9-14.1L14.1 361.5c-9-9-14.1-21.2-14.1-33.9V184.5c0-12.7 5.1-24.9 14.1-33.9L150.5 14.1c9-9 21.2-14.1 33.9-14.1h143.1c12.7 0 24.9 5.1 33.9 14.1l136.5 136.4zM377.6 338c4.7-4.7 4.7-12.3 0-17l-65-65 65.1-65.1c4.7-4.7 4.7-12.3 0-17L338 134.4c-4.7-4.7-12.3-4.7-17 0l-65 65-65.1-65.1c-4.7-4.7-12.3-4.7-17 0L134.4 174c-4.7 4.7-4.7 12.3 0 17l65.1 65.1-65.1 65.1c-4.7 4.7-4.7 12.3 0 17l39.6 39.6c4.7 4.7 12.3 4.7 17 0l65.1-65.1 65.1 65.1c4.7 4.7 12.3 4.7 17 0l39.4-39.8z"/></svg>';break;
        //DEFAULT
        default:           toast_icon = '<i style="width:35px;height:35px" class="fas fa-'+ toast_type +'"></i>';
    }
    
    //CREATE NOTIFICATION
    $('<div>',{
            'class':         'toast',
            'data-autohide': 'true',
            'data-delay':    '5000',
            'data-type':     toast_type,
            'role':          'alert',
            'aria-live':     'assertive',
            'aria-atomic':   'true',
        })
        .html('<div class="toast-content"><div class="toast-icon">'+ toast_icon +'</div><div class="toast-body"><strong><em>'+ toast_title +'</em></strong><div>'+ toast_message +'</div></div></div><button class="close" type="button" data-dismiss="toast" aria-label="Close"><span aria-hidden="true">'+ toast_btn_close_svg +'</span></button>')
        .appendTo(toast_container)
        .toast('show');
        
        
    //REMOVE HIDDEN TOAST
    $('.toast').on('hidden.bs.toast',function(){
        $(this).toast('dispose').remove();
    });
    
}
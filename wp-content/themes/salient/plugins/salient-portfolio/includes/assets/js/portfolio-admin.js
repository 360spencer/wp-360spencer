(function($){

    "use strict";

    $(document).ready(function(){

        if( window.salient_portfolio_admin_l10n.activate_unload ) {
            
            var submittingForm = false;

            var form = document.getElementById('post');
            form.addEventListener('submit', function(){
                submittingForm = true;
            });

            window.onbeforeunload = function(){

                if( form && !submittingForm &&
                    $('#vc_navbar-undo').length > 0 &&
                    $('#vc_navbar-undo[disabled]').length == 0 ) {
                    return window.salient_portfolio_admin_l10n.save_alert;
                }
            };
        }

    });


})(jQuery);
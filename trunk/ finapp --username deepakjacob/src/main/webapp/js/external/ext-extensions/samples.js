
/*
 * Ext JS Library 2.1
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://extjs.com/license
 */



Ext.EventManager.on(window, 'load', function() {


    Ext.QuickTips.init();
	Ext.form.Field.prototype.msgTarget = 'side';

	var bd = Ext.getBody();

	/*
	 * ================ Simple form =======================
	 */
	var element = bd.createChild({
		tag : 'h2',
		html : 'Login to finapp 0.1'
	});
	element.applyStyles('bgcolor:red');

	var loginForm = new Ext.FormPanel({

        
        labelWidth : 75, // label settings here cascade unless overridden
		// url:'save-form.php',
		frame : true,
		 title: 'Login to finapp 0.1',
		bodyStyle : 'padding:5px 5px 0',
		width : 350,
		defaults : {
			width : 230
		},
        defaultType : 'textfield',
        border : false,
		items : [{
			fieldLabel : 'Username',
			name : 'username',
			allowBlank : false
		}, {
			fieldLabel : 'Password',
			name : 'password'
		}]
	});

	var submit = loginForm.addButton({
		text : 'Login',
		disable : false,

        handler : function() {
            loginForm.getForm().doAction("dwrsubmit", {
                clientValidation:false,
                dwrFunction : User.checkUserCredentials,
                waitMsg: "Checking user credentials, Please wait...",

                success : function(str) {
    				Ext.Msg.alert("Action successfully completed ")
				},
                failure : function(str) {
					Ext.Msg.alert("Action not completed "+ str)
				},
                timeout:4000

            });
		}
	});

	loginForm.render('login-box');
    Ext.select('#sample-spacer').remove();

    setTimeout(function() {
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({remove:true});
    }, 2500);

    if (window.console && window.console.firebug) {
        Ext.Msg.alert('Warning', 'Firebug is known to cause performance issues with Ext JS.');
    }
});
Ext.onReady(function() {

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
		// title: 'Simple Form',
		bodyStyle : 'padding:5px 5px 0',
		width : 350,
		defaults : {
			width : 230
		},
		border : false,
		items : [{
			fieldLabel : 'Userame',
			name : 'userName',
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
				dwrFunction : Login.login,
				// this callback will never get called as DWRSubmit is not
				// considering following callback.
				// DWRSubmit is having it's own callbacks viz. 'success' and
				// 'failure'
				// to use following callback change DWRSubmit action.
				callback : function(str) {
					alert('In Callback !' + str);
				}
			});

		}
	});

	loginForm.render(document.body);
});


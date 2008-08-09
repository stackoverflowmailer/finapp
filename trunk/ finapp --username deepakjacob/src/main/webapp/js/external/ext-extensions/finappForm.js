Ext.onReady( function() {

	Ext.QuickTips.init();
	Ext.form.Field.prototype.msgTarget = 'side';

	var bd = Ext.getBody();

	/*
	 * ================ Simple form =======================
	 */
	var element = bd.createChild( {
		tag :'h2',
		html :'Employee Form'
	});
	element.applyStyles('bgcolor:red');

	var sampleForm = new Ext.FormPanel( {
		labelWidth :75, // label settings here cascade unless overridden
		// url:'save-form.php',
		frame :true,
		// title: 'Simple Form',
		bodyStyle :'padding:5px 5px 0',
		width :350,
		defaults : {
			width :230
		},
		defaultType :'textfield',
		border :false,
		items : [ {
			fieldLabel :'First Name',
			name :'firstName',
			allowBlank :false
		}, {
			fieldLabel :'Last Name',
			name :'lastName'
		}, {
			fieldLabel :'Salary',
			name :'salary'
		}, {
			fieldLabel :'Email',
			name :'email',
			vtype :'email'
		},

		new Ext.form.TimeField( {
			fieldLabel :'Time',
			name :'time',
			minValue :'8:00am',
			maxValue :'6:00pm'
		}) ]
	});

	var submit = sampleForm.addButton( {
		text :'Save',
		disable :false,

		handler : function() {
			sampleForm.getForm().doAction("dwrsubmit", {
				dwrFunction :Employee.saveEmployee,
				callback : function(str) {
					alert('In Callback !' + str);
				}
			});

		}
	});

	sampleForm.render(document.body);
});

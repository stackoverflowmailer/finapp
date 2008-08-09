Ext.onReady( function() {
	Ext.QuickTips.init();
	// shared reader
		var EmployeeRecord = Ext.data.Record.create( [ {
			name :'id'
		}, {
			name :'firstName'
		}, {
			name :'lastName'
		}, {
			name :'salary'
		} ]);

		var myEntityReader = new Ext.ux.data.EntityReader( {
			id :"id"
		}, EmployeeRecord);

		var myProxy = new Ext.ux.data.DWRProxy( {
			dwrFunction :Employee.getEmployee,
			listeners : {
				'beforeload' : function(dataProxy, params) {
					// setting the args that will get passed to the DWR function
			params[dataProxy.loadArgsKey] = [ 'Mukesh' ];
		}
	}
		});
		var myStore = new Ext.data.GroupingStore( {
			proxy :myProxy,
			sortInfo : {
				field :'firstName',
				direction :"ASC"
			},
			reader :myEntityReader
		});

		myStore.load();

		var grid = new Ext.grid.GridPanel(
				{
					store :myStore,
					columns : [ {
						id :'id',
						header :"ID",
						width :60,
						sortable :true,
						dataIndex :'id'
					}, {
						header :"First Name",
						width :20,
						sortable :true,
						dataIndex :'firstName'
					}, {
						header :"Last Name",
						width :20,
						sortable :true,
						dataIndex :'lastName'
					}, {
						header :"Salary",
						width :20,
						sortable :true,
						dataIndex :'salary',
						renderer :Ext.util.Format.usMoney
					} ],

					view :new Ext.grid.GroupingView(
							{
								forceFit :true,
								groupTextTpl :'{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
							}),

					frame :true,
					width :700,
					height :450,
					collapsible :true,
					animCollapse :false,
					title :'Employee Details',
					iconCls :'icon-grid',
					renderTo :document.body
				});
	});

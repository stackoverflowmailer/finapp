/**
 * @author Deepak Jacob
 */

Ext.namespace('com.dj.finapp.custom');

com.dj.finapp.custom.CustomScreen = function() {

    var getGridColumns = function() {

        return [
            {
                id: 'id',
                header: "ID",
                width: 60,
                sortable: true,
                dataIndex: 'id'
            },
            {
                header: "First Name",
                width: 20,
                sortable: true,
                dataIndex: 'firstName'
            },
            {
                header: "Last Name",
                width: 20,
                sortable: true,
                dataIndex: 'lastName'
            },
            {
                header: "Salary ",
                width: 20,
                sortable: true,
                dataIndex: 'salary',
                renderer: Ext.util.Format.usMoney
            }
        ];
    };
    var getDWRFunction = function() {
        return Employee.getAllEmployees;
    };
    var getParameters = function() {
        return [
            {
                firstName: 'deepak'
            }
        ];
    };
    var getRecordSortInfo = function() {
        return {
            field: 'firstName'
        };
    };
    var getRecordFormat = function() {
        return  [
            {
                name: 'id'
            },
            {
                name: 'firstName'
            },
            {
                name: 'lastName'
            },
            {
                name: 'salary'
            }
        ];
    };

    var initialize = function() {
        Ext.QuickTips.init();
    };
    //Initialize UI widgets
    var initializeUI = function() {
        initialize();
        //do some UI widgets here.
    };

    var initilizeStore = function() {
        //the format of the record to be read by a Reader instance
        var dataFormat = getRecordFormat();
        var recordFormat = Ext.data.Record.create(dataFormat);
        // here we are reading a custom object so use the the custom class Object Reader
        var objectReader = new Ext.ux.data.ObjectReader({
            id: 'id'
        },
                recordFormat);
        //Invoke the DWR Method using the DWRProxy and read the object returned using object reader instance
        var dataProxy = new Ext.ux.data.DWRProxy({
            dwrFunction: getDWRFunction(),
            listeners: {
                'beforeload': function(dataProxy, params) {
                    params[dataProxy.loadArgsKey] = getParameters();
                }
            }
        });
        var sortInfo = getRecordSortInfo();
        var dataStore = new Ext.data.GroupingStore({
            proxy: dataProxy,
            sortInfo: sortInfo,
            reader: objectReader
        });
        dataStore.load();
        return dataStore;
    };

    var initializeGrid = function() {
        var grid = new Ext.grid.GridPanel({
            store: initilizeStore(),
            columns: getGridColumns(),
            view: Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
            }),
            frame: true,
            width: 700,
            height: 450,
            collapsible: true,
            animCollapse: false,
            title: 'Employee Details',
            iconCls: 'icon-grid',
            renderTo: 'grid'
        });
        return grid;
    };


    return {
        init: function() {
            initializeUI();
        }
    };

};

var myModule = new com.dj.finapp.custom.CustomScreen();
myModule.init();
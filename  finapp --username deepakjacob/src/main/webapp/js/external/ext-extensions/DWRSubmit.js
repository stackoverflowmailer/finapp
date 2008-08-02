/**
 * @class Ext.form.Action.DWRLoad
 * @extends Ext.form.Action Load data from DWR function options: dwrFunction,
 *          dwrArgs
 * @constructor
 * @param {Object}
 *            form
 * @param {Object}
 *            options
 */
Ext.form.Action.DWRLoad = function(form, options) {
    Ext.form.Action.DWRLoad.superclass.constructor.call(this, form, options);
};

Ext.extend(Ext.form.Action.DWRLoad, Ext.form.Action, {
    // private
    type : 'load',

    run : function() {
        var dwrFunctionArgs = [];
        var loadArgs = this.options.dwrArgs || [];
        if (loadArgs instanceof Array) {
            // Note: can't do a foreach loop over arrays because Ext added the
            // "remove" method to Array's prototype.
            // This "remove" method gets added as an argument unless we
            // explictly use numeric indexes.
            for (var i = 0; i < loadArgs.length; i++) {
                dwrFunctionArgs.push(loadArgs[i]);
            }
        } else { // loadArgs should be an Object
            for (var loadArgName in loadArgs) {
                dwrFunctionArgs.push(loadArgs[loadArgName]);
            }
        }
        dwrFunctionArgs.push({
            callback : this.success.createDelegate(this, this.createCallback(),
                    1),
            exceptionHandler : this.failure.createDelegate(this, this
                    .createCallback(), 1)
        });
        this.options.dwrFunction.apply(Object, dwrFunctionArgs);
    },

    success : function(response) {
        var result = this.handleResponse(response);
        if (result === true || !result.success || !result.data) {
            this.failureType = Ext.form.Action.LOAD_FAILURE;
            this.form.afterAction(this, false);
            return;
        }
        this.form.clearInvalid();
        this.form.setValues(result.data);
        this.form.afterAction(this, true);
    },

    handleResponse : function(response) {
        if (this.form.reader) {
            var rs = this.form.reader.readRecords([response]);
            var data = rs.records && rs.records[0] ? rs.records[0].data : null;
            this.result = {
                success : rs.success,
                data : data
            };
            return this.result;
        }
        this.result = response;
        return this.result;
    }
});
Ext.form.Action.ACTION_TYPES.dwrload = Ext.form.Action.DWRLoad;

/**
 * @class Ext.form.Action.DWRLoad
 * @extends Ext.form.Action Submit data through DWR function options:
 *          dwrFunction
 * @constructor
 * @param {Object}
 *            form
 * @param {Object}
 *            options
 */
Ext.form.Action.DWRSubmit = function(form, options) {
    Ext.form.Action.Submit.superclass.constructor.call(this, form, options);
};

Ext.extend(Ext.form.Action.DWRSubmit, Ext.form.Action, {
    type : 'dwrsubmit',

    // private
    run : function() {
        var o = this.options;
        if (o.clientValidation === false || this.form.isValid()) {
            var dwrFunctionArgs = [];
            dwrFunctionArgs.push(this.form.getValues());
            dwrFunctionArgs.push({
                callback : this.success.createDelegate(this, this
                        .createCallback(), 1),
                errorHandler : this.failure.createDelegate(this, this
                        .createCallback(), 1),
                warningHandler : this.serverError.createDelegate(this, this
                        .createCallback(), 1),
                timeout : 8000
            });
            this.options.dwrFunction.apply(Object, dwrFunctionArgs);
        } else if (o.clientValidation !== false) { // client validation failed
            this.failureType = Ext.form.Action.CLIENT_INVALID;
            this.form.afterAction(this, false);
        }
    },

    // private
    success : function(response) {
        var result = this.handleResponse(response);
        if (result === true || result.success) {
            this.form.afterAction(this, true);
            return;
        }
        if (result.errors) {
            this.form.markInvalid(result.errors);
            this.failureType = Ext.form.Action.SERVER_INVALID;
        }
        this.form.afterAction(this, false);
    },

    failure : function(errorString, exception) {
        Ext.Msg.show({title:'Error', msg:errorString, icon:Ext.Msg.ERROR});
    },

    serverError : function(errorString) {
        var staticMessage = "Oops...something went wrong at the server side." +
                            "\\nIf you are seeing this message for the first time," +
                            "\\n please try again after some time,\\n " +
                            "else contact your administrator. Specific Error: ";

        Ext.Msg.show({title:'Server Error', button:Ext.Msg.OK ,msg: (staticMessage + errorString), icon: Ext.Msg.WARNING});
    },
    // private
    handleResponse : function(response) {
        this.result = response;
        return this.result;
    }
});
Ext.form.Action.ACTION_TYPES.dwrsubmit = Ext.form.Action.DWRSubmit;
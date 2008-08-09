Ext.namespace("Ext.ux.data");

Ext.ux.data.EntityReader = function(meta, recordType) {
	Ext.ux.data.EntityReader.superclass.constructor
			.call(this, meta, recordType);
};
Ext.extend(Ext.ux.data.EntityReader, Ext.data.DataReader, {
	readRecords : function(response) {
		var sid = this.meta ? this.meta.id : null;
		var recordType = this.recordType, fields = recordType.prototype.fields;
		var records = [];
		var root = response;
		// for(var i = 0; i < root.length; i++){
		// var obj = root[i];
		var obj = root;
		var values = {};
		var id = obj[sid];

		for ( var j = 0, jlen = fields.length; j < jlen; j++) {
			var f = fields.items[j];
			var k = f.mapping !== undefined && f.mapping !== null ? f.mapping
					: f.name;

			var v = obj[k] !== undefined ? obj[k] : f.defaultValue;
			v = f.convert(v);
			values[f.name] = v;

		}
		var record = new recordType(values, id);
		// records[records.length] = record;
		// }
		records[0] = record;
		return {
			records :records,
			totalRecords :records.length
		};
	}
});
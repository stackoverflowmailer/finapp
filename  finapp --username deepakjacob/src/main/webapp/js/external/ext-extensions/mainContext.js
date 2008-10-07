Ext.namespace("finapp");

finapp.ApplicationContext = function(initialConfig){
  Ext.apply(initialConfig);
  this.addEvents({});
  finapp.ApplicationContext.superclass.constructor.call(this);
};

Ext.extend(finapp.ApplicationContext, Ext.util.Observable,{
    properties:{},
    user:null,

    /**
     * determines the format of the date diaplayed.
     */
    getDateFormat:function(){
        return "d/m/Y";
    },
    /**
     * this will determine the style/ theme of the application.
     */
    getStyle:function(){
        return "default";
    },

    /**
     * return the permissions currently holded by this user.
     */
    getPermissions:function(){
        return [];
    }
});






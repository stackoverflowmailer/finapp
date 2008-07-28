
/*
 * Ext JS Library 2.1
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://extjs.com/license
 */

SamplePanel = Ext.extend(Ext.DataView, {
    autoHeight: true,
    frame:true,
    cls:'demos',
    itemSelector: 'dd',
    overClass: 'over'


});


Ext.EventManager.on(window, 'load', function() {



    new Ext.Panel({
        autoHeight: true,
        collapsible: true,
        frame: true,
        title: 'View Samples',
        items: new SamplePanel({
            //store: store
        })
    }).render('login-box');





    Ext.select('#sample-spacer').remove();

    setTimeout(function() {
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({remove:true});
    }, 2500);

    if (window.console && window.console.firebug) {
        Ext.Msg.alert('Warning', 'Firebug is known to cause performance issues with Ext JS.');
    }
});
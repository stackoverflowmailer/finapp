Ext.namespace("jx");
jx.ApplicationContext = function(_1) {
    Ext.apply(this, _1);
    this.addEvents({});
    jx.ApplicationContext.superclass.constructor.call(this);
};
Ext.extend(jx.ApplicationContext, Ext.util.Observable, {properties:{},user:null,roles:null,licenseType:null,licenseInfo:null,organization:null,currentProject:null,projectList:{},baseUrl:"",init:function() {
    admin.getContourAppContext({callback:this.populateContext.createDelegate(this),async:false});
},populateContext:function(_2) {
    if (_2.properties) {
        this.properties = _2.properties.properties;
    }
    this.ldapProperties = _2.ldapProperties;
    this.user = _2.user;
    this.licenseType = _2.licenseInfo.currentLicenseType;
    this.licenseInfo = _2.licenseInfo;
    this.roles = _2.roles;
    this.organization = _2.organization;
    this.baseUrl = _2.baseUrl;
},setLdapProperties:function(_3) {
    this.ldapProperties = _3;
    this.fireEvent("ldapPropertiesChange", _3);
},getDayMonthYearFormat:function() {
    return this.getPropertyValue("jama.system.format.dayMonthYear") || "m/d/Y";
},getDatetimeFormat:function() {
    return this.getPropertyValue("jama.system.format.datetime") || "m/d/Y h:i a";
},getUseLdap:function() {
    return this.ldapProperties ? this.ldapProperties.enableLdap : false;
},getPropertyValue:function(_4) {
    if (this.properties) {
        var _5 = this.properties[_4];
        if (_5) {
            return _5.propertyValue;
        }
    }
    return "";
},isOrgAdmin:function() {
    for (var i = 0,len = this.roles.length; i < len; i++) {
        if (this.roles[i].name == "ORGADMIN") {
            return true;
        }
    }
    return false;
},getMask:function() {
    return (this.licenseType != "R" && this.isOrgAdmin()) ? jx.AclPermission.ORGADMIN : 0;
},getOrganization:function() {
    return this.organization;
},getProject:function(id, _8) {
    if (_8 || !this.projectList[id]) {
        var _9 = this;
        project.getProjectDto(id, {callback:function(_a) {
            _9.tempProject = _a;
        },async:false});
        this.projectList[id] = new jx.Project(this.tempProject);
    }
    return this.projectList[id];
},showModalMessage:function() {
    Array.prototype.unshift.call(arguments, "showModalMessage");
    this.fireEvent.apply(this, arguments);
},showMessage:function() {
    Array.prototype.unshift.call(arguments, "showMessage");
    this.fireEvent.apply(this, arguments);
}});
jx.appContext = new jx.ApplicationContext();
Ext.namespace("jx");
Ext.namespace("jx.app");
Ext.namespace("jx.form");
Ext.namespace("jx.grid");
Ext.namespace("jx.data");
Ext.namespace("jx.view");
Ext.namespace("jx.tree");
Ext.namespace("jx.panel");
Ext.namespace("jx.window");
Ext.namespace("jx.util");
Ext.namespace("jx.layout");
jx.Scope = function() {
    return {SYSTEM:1,ORGANIZATION:2,PROJECT:3,DOCUMENT_GROUP:4,DOCUMENT:5,USER:6};
};
jx.AclPermission = function() {
    return {ADMINISTRATION:1,READ:2,WRITE:4,ORGADMIN:8,ALL:15,WRITEADMIN:5,READWRITE:6,canAdmin:function(_b) {
        return this.isPermitted(_b, this.ADMINISTRATION);
    },canWrite:function(_c) {
        return this.isPermitted(_c, this.WRITE);
    },canRead:function(_d) {
        return this.isPermitted(_d, this.READ);
    },isPermitted:function(_e, _f) {
        return ((_e & _f) == _f);
    }};
}();
jx.grid.ModeMap = {tag:1,search:2,filter:4,folder:8,group:16,release:32,selected:64,all:63,allButSearch:61};
jx.ItemData = function(_10) {
    this.addEvents("dataChanged");
    Ext.apply(this, _10);
    jx.ItemData.superclass.constructor.call(this, _10);
};
Ext.extend(jx.ItemData, Ext.util.Observable, {appContext:{},itemType:null,item:null,group:null,project:null,org:null,reconfig:function(_11) {
    Ext.apply(this, _11);
    this.fireEvent("dataChanged", this);
},getGroupId:function() {
    return this.group ? this.group.id : null;
},getProjectId:function() {
    return this.project ? this.project.id : null;
},getItemId:function() {
    return this.item ? this.item.id : null;
},getOrgId:function() {
    return this.org ? this.org.id : null;
}});
jx.Project = function(_12) {
    Ext.apply(this, _12);
};
jx.Project.prototype = {appContext:{},canAdmin:function(_13) {
    return (this.appContext.licenseType != "R") && jx.AclPermission.canAdmin(this.mask);
},canWrite:function(_14) {
    return (this.appContext.licenseType != "R") && jx.AclPermission.canWrite(this.mask);
},canRead:function(_15) {
    return jx.AclPermission.canRead(this.mask);
},getMask:function() {
    return this.appContext.licenseType == "R" ? jx.AclPermission.READ : this.mask;
},getShouldVersion:function() {
    var _16 = this.getProjectPropertyValue("jama.project.shouldVersion");
    return _16 != "false";
},getShowIdInTree:function() {
    var _17 = this.getProjectPropertyValue("jama.project.showIdInTree");
    return _17 != "false";
},getMaxPageSize:function() {
    var _18 = this.getProjectPropertyValue("jama.project.maxPageSize");
    return _18 ? _18 : 500;
},getProjectPropertyValue:function(_19) {
    return this.getPropertyValue(this.propertyList, _19);
},getPropertyValue:function(_1a, _1b) {
    if (_1a) {
        var _1c = _1a.properties[_1b];
        if (_1c) {
            return _1c.propertyValue;
        }
    }
    return "";
}};
jx.App = function(_1d) {
    jx.App.superclass.constructor.call(this, _1d);
};
jx.App = Ext.extend(jx.App, Ext.Viewport, {msgCt:null,initApp:function() {
    Ext.BLANK_IMAGE_URL = "js/ext/resources/images/default/s.gif";
    this.initDwr();
    Ext.QuickTips.init();
    var _1e = this.getAppContext();
    _1e.init();
    _1e.on("showMessage", this.displayMessage, this);
    _1e.on("showModalMessage", this.displayModalMessage, this);
},initDwr:function() {
    DWREngine.setTextHtmlHandler(this.dwrTextHtmlHandler.createDelegate(this));
},dwrTextHtmlHandler:function() {
    alert("Got an invalid reply from server that may be due to expired session. You will be forwarded to the login page");
    document.location.reload();
},onExit:function() {
    if (!this.getAppContext().fireEvent("checkForUnsaved", true)) {
        return "You haven't saved your current chagnes.";
    }
    return "You are leaving Contour.";
},logout:function() {
    window.location = "logout.req";
},showLoading:function() {
    var _1f = Ext.get("loading");
    var _20 = Ext.get("loading-mask");
    _1f.show();
    _20.show();
},hideLoading:function() {
    if (Ext.isSafari || Ext.isOpera) {
    }
    var _21 = Ext.get("loading");
    var _22 = Ext.get("loading-mask");
    _22.setOpacity(0.8);
    _22.shift({xy:_21.getXY(),width:_21.getWidth(),height:_21.getHeight(),remove:true,duration:1,opacity:0.3,easing:"bounceOut",callback:function() {
        _21.fadeOut({duration:0.2,remove:true});
    }});
    _21.hide();
    _22.hide();
},displayMessage:function(_23, _24) {
    if (!this.msgCt) {
        this.msgCt = Ext.DomHelper.insertFirst(document.body, {id:"msg-div"}, true);
    }
    this.msgCt.alignTo(document, "t-t");
    var s = String.format.apply(String, Array.prototype.slice.call(arguments, 1));
    var m = Ext.DomHelper.append(this.msgCt, {html:this.createBox(_23, s)}, true);
    m.slideIn("t").pause(1).ghost("t", {remove:true});
},displayModalMessage:function(_27, _28) {
    var _29 = this.modalMsgCt;
    if (!_29) {
        _29 = Ext.DomHelper.insertFirst(document.body, {id:"msg-div"}, true);
        _29.on("click", this.hideModalMessage, this);
        this.modalMsgCt = _29;
    }
    _29.alignTo(document, "t-t");
    var s = String.format.apply(String, Array.prototype.slice.call(arguments, 1));
    var m = Ext.DomHelper.append(_29, {html:this.createCloseBox(_27, s)}, true);
    m.slideIn("t");
},hideModalMessage:function() {
    this.modalMsgCt.slideOut("t", {remove:true});
},createBox:function(t, s) {
    return ["<div class=\"msg\">","<div class=\"x-box-tl\"><div class=\"x-box-tr\"><div class=\"x-box-tc\"></div></div></div>","<div class=\"x-box-ml\"><div class=\"x-box-mr\"><div class=\"x-box-mc\"><h3>",t,"</h3>",s,"</div></div></div>","<div class=\"x-box-bl\"><div class=\"x-box-br\"><div class=\"x-box-bc\"></div></div></div>","</div>"].join("");
},createCloseBox:function(t, s) {
    return ["<div class=\"msg\">","<div class=\"x-box-tl\"><div class=\"x-box-tr\"><div class=\"x-box-tc\"></div></div></div>","<div class=\"x-box-ml\"><div class=\"x-box-mr\"><div class=\"x-box-mc\"><h3>",t,"</h3>",s,"</br><a href=\"javascript:void(0);\">[close]</a></div></div></div>","<div class=\"x-box-bl\"><div class=\"x-box-br\"><div class=\"x-box-bc\"></div></div></div>","</div>"].join("");
},getOrganization:function() {
    return this.getAppContext().organization;
},setAppContext:function(_30) {
    this.appContext = _30;
}});
jx.MessageSource = function() {
    var _31 = {};
    return {getMessage:function(_32, _33) {
        if (_33 == undefined) {
            _33 = _32;
        }
        var _34 = _31[_32];
        return _34 ? _34 : _33;
    },setMessages:function(_35) {
        _31 = _35;
    },addMessages:function(_36) {
        for (var key in _36) {
            _31[key] = _36[key];
        }
    }};
}();
var i18n = jx.MessageSource;
i18n.g = i18n.getMessage;
Ext.override(Ext.Component, {getAppContext:function() {
    return jx.appContext;
},myId:function(id) {
    return this.id + "-" + id;
}});
Ext.override(Ext.form.BasicForm, {getObjectValues:function() {
    var _39 = {};
    this.items.each(function(f) {
        _39[f.getName()] = f.getValue();
    });
    return _39;
}});
Ext.override(Ext.DataView, {refresh:function() {
    this.clearSelections(false, true);
    this.el.update("");
    var _3b = [];
    var _3c = this.store.getRange();
    if (_3c.length < 1) {
        this.el.update(this.emptyText);
        this.all.clear();
        return;
    }
    this.tpl.overwrite(this.el, this.collectData(_3c, 0));
    this.all.fill(Ext.query(this.itemSelector, this.el.dom));
    this.updateIndexes(0);
    this.fireEvent("afterRefresh", this);
}});
Ext.override(Ext.Panel, {setTabTitleAndIcon:function(_3d, _3e) {
    var _3f = this.iconCls;
    this.setIconClass(_3e);
    var el = this.ownerCt.getTabEl(this);
    if (el) {
        var _41 = Ext.fly(el).child("span.x-tab-strip-text");
        _41.update(_3d);
        if (_3e) {
            _41.replaceClass(_3f, _3e);
        }
    }
},setTabTitleAndImage:function(_42, _43) {
    var _44 = this.iconCls;
    var el = this.ownerCt.getTabEl(this);
    if (el) {
        var _46 = Ext.fly(el).child("span.x-tab-strip-text");
        var _47 = String.format("background-image: url(img/tree/{0});", _43);
        _46.removeClass(_44);
        _46.applyStyles(_47);
        _46.update(_42);
    }
}});
Ext.override(Ext.Window, {cancelAction:"destroy",afterRender:function() {
    Ext.Window.superclass.afterRender.apply(this, arguments);
    if (Ext.isGecko) {
        this.on("show", function(d) {
            var div = Ext.get(d.el);
            div.setStyle("position", "fixed");
        });
    }
},onCancel:function() {
    this[this.cancelAction]();
}});
Ext.override(Ext.menu.Menu, {showButtons:function(_4a, _4b) {
    for (var i = 0,len = this.items.length; i < len; i++) {
        var _4d = this.items.itemAt(i);
        var _4e = _4d.mode;
        var _4f = _4d.mask;
        var _50 = !_4f || ((_4a & _4f) && (!_4b || (_4b & _4e)));
        _4d[_50 ? "show" : "hide"]();
    }
}});
Ext.override(Ext.Toolbar, {showButtons:function(_51, _52) {
    for (var i = 0,len = this.items.length; i < len; i++) {
        var _54 = this.items.itemAt(i);
        var _55 = _54.mode;
        var _56 = _54.mask;
        var _57 = !_56 || ((_51 & _56) && (!_52 || (_52 & _55)));
        _54[_57 ? "show" : "hide"]();
    }
},addField:function(_58) {
    var td = this.nextBlock();
    _58.render(td);
    this.items.add(_58);
    return _58;
}});
Ext.Toolbar.Item.prototype.constructor = function(el, _5b) {
    Ext.apply(this, _5b);
    this.el = Ext.getDom(el);
    this.id = Ext.id(this.el);
    this.hidden = false;
};
Ext.Toolbar.TextItem.prototype.constructor = function(t) {
    var s = document.createElement("span");
    s.className = "ytb-text";
    s.innerHTML = t.text ? t.text : t;
    Ext.Toolbar.TextItem.superclass.constructor.call(this, s, t);
};
(function() {
    var T = Ext.Toolbar;
    T.Item = function(el, _60) {
        Ext.apply(this, _60);
        this.el = Ext.getDom(el);
        this.id = Ext.id(this.el);
        this.hidden = false;
    };
    T.Item.prototype = {getEl:function() {
        return this.el;
    },render:function(td) {
        this.td = td;
        td.appendChild(this.el);
    },destroy:function() {
        if (this.td && this.td.parentNode) {
            this.td.parentNode.removeChild(this.td);
        }
    },show:function() {
        this.hidden = false;
        this.td.style.display = "";
    },hide:function() {
        this.hidden = true;
        this.td.style.display = "none";
    },setVisible:function(_62) {
        if (_62) {
            this.show();
        } else {
            this.hide();
        }
    },focus:function() {
        Ext.fly(this.el).focus();
    },disable:function() {
        Ext.fly(this.td).addClass("x-item-disabled");
        this.disabled = true;
        this.el.disabled = true;
    },enable:function() {
        Ext.fly(this.td).removeClass("x-item-disabled");
        this.disabled = false;
        this.el.disabled = false;
    }};
    Ext.reg("tbitem", T.Item);
    T.Separator = function(_63) {
        var s = document.createElement("span");
        s.className = "ytb-sep";
        T.Separator.superclass.constructor.call(this, s, _63);
    };
    Ext.extend(T.Separator, T.Item, {enable:Ext.emptyFn,disable:Ext.emptyFn,focus:Ext.emptyFn});
    Ext.reg("tbseparator", T.Separator);
    T.Spacer = function(_65) {
        var s = document.createElement("div");
        s.className = "ytb-spacer";
        T.Spacer.superclass.constructor.call(this, s, _65);
    };
    Ext.extend(T.Spacer, T.Item, {enable:Ext.emptyFn,disable:Ext.emptyFn,focus:Ext.emptyFn});
    Ext.reg("tbspacer", T.Spacer);
    T.Fill = Ext.extend(T.Spacer, {render:function(td) {
        td.style.width = "100%";
        T.Fill.superclass.render.call(this, td);
    }});
    Ext.reg("tbfill", T.Fill);
    T.TextItem = function(t) {
        var s = document.createElement("span");
        s.className = "ytb-text";
        s.innerHTML = t.text ? t.text : t;
        T.TextItem.superclass.constructor.call(this, s, t);
    };
    Ext.extend(T.TextItem, T.Item, {enable:Ext.emptyFn,disable:Ext.emptyFn,focus:Ext.emptyFn});
    Ext.reg("tbtext", T.TextItem);
    T.Button = Ext.extend(Ext.Button, {hideParent:true,onDestroy:function() {
        T.Button.superclass.onDestroy.call(this);
        if (this.container) {
            this.container.remove();
        }
    }});
    Ext.reg("tbbutton", T.Button);
    T.SplitButton = Ext.extend(Ext.SplitButton, {hideParent:true,onDestroy:function() {
        T.SplitButton.superclass.onDestroy.call(this);
        if (this.container) {
            this.container.remove();
        }
    }});
    Ext.reg("tbsplit", T.SplitButton);
    T.MenuButton = T.SplitButton;
})();
jx.PagingToolbar = function(_6a) {
    _6a = Ext.applyIf(_6a, {pageSize:20,displayInfo:true,displayMsg:"Displaying {0} - {1} of {2}",emptyMsg:"No topics to display"});
    jx.PagingToolbar.superclass.constructor.call(this, _6a);
    this.afterRender();
};
Ext.extend(jx.PagingToolbar, Ext.PagingToolbar, {showSize:true,autoHide:false,maxPageSize:null,pageSizeLabel:"Page Size:&nbsp;",render:function() {
    jx.PagingToolbar.superclass.render.apply(this, arguments);
    if (this.showSize) {
        var _6b = this.createCombo();
        this.addSeparator();
        this.addText(this.pageSizeLabel);
        this.addField(_6b);
        _6b.setRawValue(this.pageSize);
        _6b.on("select", this.changePageSize, this);
        _6b.on("specialkey", this.handleReturn, this);
    }
},changePageSize:function(_6c) {
    if (_6c.isValid()) {
        var _6d = parseInt(_6c.getRawValue());
        if (_6d && this.maxPageSize && _6d > this.maxPageSize) {
            Ext.MessageBox.alert("Warning", "Page size exceeds maximum allowed size: " + this.maxPageSize);
            _6c.setValue(this.pageSize);
        } else {
            if (_6d && this.pageSize != _6d) {
                this.pageSize = _6d;
                this.store.load({params:{start:0,limit:this.pageSize}});
            }
        }
    }
},handleReturn:function(_6e, _6f) {
    if (_6f.getKey() == Ext.EventObject.RETURN) {
        this.changePageSize(_6e);
    }
},createCombo:function() {
    var _70 = new Ext.data.SimpleStore({fields:["value"],data:[[5],[10],[15],[20],[25],[50],[75],[100]]});
    var _71 = new Ext.form.ComboBox({store:_70,displayField:"value",valueField:"value",mode:"local",triggerAction:"all",emptyText:"Select a size...",selectOnFocus:true,width:100,regex:/^\d+$/});
    return _71;
},checkResults:function(ds, r, o) {
    var _75 = this.ds.getTotalCount();
    if (_75 <= this.pageSize) {
        this.getEl().hide();
    } else {
        this.getEl().show();
    }
},mybind:function(ds) {
    ds.on("beforeload", this.beforeLoad, this);
    ds.on("load", this.onLoad, this);
    ds.on("loadexception", this.onLoadError, this);
    this.ds = ds;
},myunbind:function(ds) {
    ds.un("beforeload", this.beforeLoad, this);
    ds.un("load", this.onLoad, this);
    ds.un("loadexception", this.onLoadError, this);
    this.ds = undefined;
}});
Ext.ux.TabCloseMenu = function() {
    var _78,menu,ctxItem;
    this.init = function(tp) {
        _78 = tp;
        _78.on("contextmenu", onContextMenu);
    };
    function onContextMenu(ts, _7b, e) {
        if (!menu) {
            menu = new Ext.menu.Menu([{id:_78.id + "-close",text:"Close Tab",handler:function() {
                _78.remove(ctxItem);
            }},{id:_78.id + "-close-others",text:"Close Other Tabs",handler:function() {
                _78.items.each(function(_7d) {
                    if (_7d.closable && _7d != ctxItem) {
                        _78.remove(_7d);
                    }
                });
            }}]);
        }
        ctxItem = _7b;
        var _7e = menu.items;
        _7e.get(_78.id + "-close").setDisabled(!_7b.closable);
        var _7f = true;
        _78.items.each(function() {
            if (this != _7b && this.closable) {
                _7f = false;
                return false;
            }
        });
        _7e.get(_78.id + "-close-others").setDisabled(_7f);
        menu.showAt(e.getPoint());
    }
};
Ext.namespace("Ext.ux");
Ext.ux.RadioGroup = Ext.extend(Ext.form.Field, {focusClass:undefined,fieldClass:"x-form-field",checked:false,defaultAutoCreate:{tag:"input",type:"radio",autocomplete:"off"},getId:function() {
    if (this.radios && this.radios instanceof Array) {
        if (this.radios.length) {
            var r = this.radios[0];
            this.value = r.value;
            this.boxLabel = r.boxLabel;
            this.checked = r.checked || false;
            this.readOnly = r.readOnly || false;
            this.disabled = r.disabled || false;
            this.tabIndex = r.tabIndex;
            this.cls = r.cls;
            this.listeners = r.listeners;
            this.style = r.style;
            this.bodyStyle = r.bodyStyle;
            this.hideParent = r.hideParent;
            this.hidden = r.hidden;
        }
    }
    Ext.ux.RadioGroup.superclass.getId.call(this);
},initComponent:function() {
    Ext.ux.RadioGroup.superclass.initComponent.call(this);
    this.addEvents("check");
},onResize:function() {
    Ext.ux.RadioGroup.superclass.onResize.apply(this, arguments);
    if (!this.boxLabel) {
        this.el.alignTo(this.wrap, "c-c");
    }
},initEvents:function() {
    Ext.ux.RadioGroup.superclass.initEvents.call(this);
    this.el.on("click", this.onClick, this);
    this.el.on("change", this.onClick, this);
},getResizeEl:function() {
    return this.wrap;
},getPositionEl:function() {
    return this.wrap;
},markInvalid:Ext.emptyFn,clearInvalid:Ext.emptyFn,onRender:function(ct, _82) {
    Ext.ux.RadioGroup.superclass.onRender.call(this, ct, _82);
    this.wrap = this.el.wrap({cls:"x-form-check-wrap"});
    if (this.boxLabel) {
        this.wrap.createChild({tag:"label",htmlFor:this.el.id,cls:"x-form-cb-label",html:this.boxLabel});
    }
    if (!this.isInGroup) {
        this.wrap.applyStyles({"padding-top":"2px"});
    }
    if (this.checked) {
        this.setChecked(true);
    } else {
        this.checked = this.el.dom.checked;
    }
    if (this.radios && this.radios instanceof Array) {
        this.els = new Array();
        this.els[0] = this.el;
        for (var i = 1; i < this.radios.length; i++) {
            var r = this.radios[i];
            this.els[i] = new Ext.ux.RadioGroup({renderTo:this.wrap,hideLabel:true,boxLabel:r.boxLabel,checked:r.checked || false,value:r.value,name:this.name || this.id,readOnly:r.readOnly || false,disabled:r.disabled || false,tabIndex:r.tabIndex,cls:r.cls,listeners:r.listeners,style:r.style,bodyStyle:r.bodyStyle,hideParent:r.hideParent,hidden:r.hidden,isInGroup:true});
            if (this.horizontal) {
                this.els[i].el.up("div.x-form-check-wrap").applyStyles({"display":"inline","padding-left":"5px"});
            }
        }
        if (this.hidden) {
            this.hide();
        }
    }
},initValue:function() {
    if (this.value !== undefined) {
        this.el.dom.value = this.value;
    } else {
        if (this.el.dom.value.length > 0) {
            this.value = this.el.dom.value;
        }
    }
},onDestroy:function() {
    if (this.radios && this.radios instanceof Array) {
        var cnt = this.radios.length;
        for (var x = 1; x < cnt; x++) {
            this.els[x].destroy();
        }
    }
    if (this.wrap) {
        this.wrap.remove();
    }
    Ext.ux.RadioGroup.superclass.onDestroy.call(this);
},setChecked:function(v) {
    if (this.el && this.el.dom) {
        var _88 = false;
        if (v != this.checked) {
            _88 = true;
        }
        this.checked = v;
        this.el.dom.checked = this.checked;
        this.el.dom.defaultChecked = this.checked;
        if (_88) {
            this.fireEvent("check", this, this.checked);
        }
    }
},getValue:function() {
    if (!this.rendered) {
        return this.value;
    }
    var p = this.el.up("form");
    if (!p) {
        p = Ext.getBody();
    }
    var c = p.child("input[name=" + this.el.dom.name + "]:checked", true);
    return (c) ? c.value : this.value;
},onClick:function() {
    if (this.el.dom.checked != this.checked) {
        var p = this.el.up("form");
        if (!p) {
            p = Ext.getBody();
        }
        var els = p.select("input[name=" + this.el.dom.name + "]");
        els.each(function(el) {
            if (el.dom.id == this.id) {
                this.setChecked(true);
            } else {
                var e = Ext.getCmp(el.dom.id);
                e.setChecked.apply(e, [false]);
            }
        }, this);
    }
},setValue:function(v) {
    if (!this.rendered) {
        this.value = v;
        return;
    }
    var p = this.el.up("form");
    if (!p) {
        p = Ext.getBody();
    }
    var els = p.select("input[name=" + this.el.dom.name + "]");
    els.each(function(el) {
        if (el.dom.value == v) {
            var e = Ext.getCmp(el.dom.id);
            e.setChecked.apply(e, [true]);
        } else {
            var e = Ext.getCmp(el.dom.id);
            e.setChecked.apply(e, [false]);
        }
    }, this);
}});
Ext.reg("ux-radiogroup", Ext.ux.RadioGroup);
var DIFF_TIMEOUT = 1;
var DIFF_EDIT_COST = 4;
var MATCH_BALANCE = 0.5;
var MATCH_THRESHOLD = 0.5;
var MATCH_MINLENGTH = 100;
var MATCH_MAXLENGTH = 1000;
var PATCH_MARGIN = 4;
var DIFF_DELETE = -1;
var DIFF_INSERT = 1;
var DIFF_EQUAL = 0;
function diff_main(_94, _95, _96) {
    if (_94 == _95) {
        return [[DIFF_EQUAL,_94]];
    }
    if (typeof _96 == "undefined") {
        _96 = true;
    }
    var a;
    a = diff_prefix(_94, _95);
    _94 = a[0];
    _95 = a[1];
    var _98 = a[2];
    a = diff_suffix(_94, _95);
    _94 = a[0];
    _95 = a[1];
    var _99 = a[2];
    var _9a,i;
    var _9b = _94.length > _95.length ? _94 : _95;
    var _9c = _94.length > _95.length ? _95 : _94;
    if (!_94) {
        _9a = [[DIFF_INSERT,_95]];
    } else {
        if (!_95) {
            _9a = [[DIFF_DELETE,_94]];
        } else {
            if ((i = _9b.indexOf(_9c)) != -1) {
                _9a = [[DIFF_INSERT,_9b.substring(0, i)],[DIFF_EQUAL,_9c],[DIFF_INSERT,_9b.substring(i + _9c.length)]];
                if (_94.length > _95.length) {
                    _9a[0][0] = _9a[2][0] = DIFF_DELETE;
                }
            } else {
                _9b = _9c = null;
                var hm = diff_halfmatch(_94, _95);
                if (hm) {
                    var _9e = hm[0];
                    var _9f = hm[1];
                    var _a0 = hm[2];
                    var _a1 = hm[3];
                    var _a2 = hm[4];
                    var _a3 = diff_main(_9e, _a0, _96);
                    var _a4 = diff_main(_9f, _a1, _96);
                    _9a = _a3.concat([[DIFF_EQUAL,_a2]], _a4);
                } else {
                    if (_96 && _94.length + _95.length < 250) {
                        _96 = false;
                    }
                    if (_96) {
                        a = diff_lines2chars(_94, _95);
                        _94 = a[0];
                        _95 = a[1];
                        var _a5 = a[2];
                    }
                    _9a = diff_map(_94, _95);
                    if (!_9a) {
                        _9a = [[DIFF_DELETE,_94],[DIFF_INSERT,_95]];
                    }
                    if (_96) {
                        diff_chars2lines(_9a, _a5);
                        diff_cleanup_semantic(_9a);
                        _9a.push([DIFF_EQUAL,""]);
                        var _a6 = 0;
                        var _a7 = 0;
                        var _a8 = 0;
                        var _a9 = "";
                        var _aa = "";
                        while (_a6 < _9a.length) {
                            if (_9a[_a6][0] == DIFF_INSERT) {
                                _a8++;
                                _aa += _9a[_a6][1];
                            } else {
                                if (_9a[_a6][0] == DIFF_DELETE) {
                                    _a7++;
                                    _a9 += _9a[_a6][1];
                                } else {
                                    if (_a7 >= 1 && _a8 >= 1) {
                                        a = diff_main(_a9, _aa, false);
                                        _9a.splice(_a6 - _a7 - _a8, _a7 + _a8);
                                        _a6 = _a6 - _a7 - _a8;
                                        for (i = a.length - 1; i >= 0; i--) {
                                            _9a.splice(_a6, 0, a[i]);
                                        }
                                        _a6 = _a6 + a.length;
                                    }
                                    _a8 = 0;
                                    _a7 = 0;
                                    _a9 = "";
                                    _aa = "";
                                }
                            }
                            _a6++;
                        }
                        _9a.pop();
                    }
                }
            }
        }
    }
    if (_98) {
        _9a.unshift([DIFF_EQUAL,_98]);
    }
    if (_99) {
        _9a.push([DIFF_EQUAL,_99]);
    }
    diff_cleanup_merge(_9a);
    return _9a;
}
function diff_lines2chars(_ab, _ac) {
    var _ad = new Array();
    var _ae = new Object();
    _ad.push("");
    function diff_lines2chars_munge(_af) {
        var i,line;
        var _b1 = "";
        while (_af) {
            i = _af.indexOf("\n");
            if (i == -1) {
                i = _af.length;
            }
            line = _af.substring(0, i + 1);
            _af = _af.substring(i + 1);
            if (_ae.hasOwnProperty ? _ae.hasOwnProperty(line) : (_ae[line] !== undefined)) {
                _b1 += String.fromCharCode(_ae[line]);
            } else {
                _ad.push(line);
                _ae[line] = _ad.length - 1;
                _b1 += String.fromCharCode(_ad.length - 1);
            }
        }
        return _b1;
    }
    var _b2 = diff_lines2chars_munge(_ab);
    var _b3 = diff_lines2chars_munge(_ac);
    return [_b2,_b3,_ad];
}
function diff_chars2lines(_b4, _b5) {
    var _b6,text;
    for (var x = 0; x < _b4.length; x++) {
        _b6 = _b4[x][1];
        text = "";
        for (var y = 0; y < _b6.length; y++) {
            text += _b5[_b6.charCodeAt(y)];
        }
        _b4[x][1] = text;
    }
}
function diff_map(_b9, _ba) {
    var now = new Date();
    var _bc = now.getTime() + DIFF_TIMEOUT * 1000;
    var max = (_b9.length + _ba.length) / 2;
    var _be = new Array();
    var _bf = new Array();
    var v1 = new Object();
    var v2 = new Object();
    v1[1] = 0;
    v2[1] = 0;
    var x,y;
    var _c3;
    var _c4 = new Object();
    var _c5 = false;
    var _c6 = !!(_c4.hasOwnProperty);
    var _c7 = (_b9.length + _ba.length) % 2;
    for (var d = 0; d < max; d++) {
        now = new Date();
        if (DIFF_TIMEOUT > 0 && now.getTime() > _bc) {
            return null;
        }
        _be[d] = new Object();
        for (var k = -d; k <= d; k += 2) {
            if (k == -d || k != d && v1[k - 1] < v1[k + 1]) {
                x = v1[k + 1];
            } else {
                x = v1[k - 1] + 1;
            }
            y = x - k;
            _c3 = x + "," + y;
            if (_c7 && (_c6 ? _c4.hasOwnProperty(_c3) : (_c4[_c3] !== undefined))) {
                _c5 = true;
            }
            if (!_c7) {
                _c4[_c3] = d;
            }
            while (!_c5 && x < _b9.length && y < _ba.length && _b9.charAt(x) == _ba.charAt(y)) {
                x++;
                y++;
                _c3 = x + "," + y;
                if (_c7 && (_c6 ? _c4.hasOwnProperty(_c3) : (_c4[_c3] !== undefined))) {
                    _c5 = true;
                }
                if (!_c7) {
                    _c4[_c3] = d;
                }
            }
            v1[k] = x;
            _be[d][x + "," + y] = true;
            if (_c5) {
                _bf = _bf.slice(0, _c4[_c3] + 1);
                var a = diff_path1(_be, _b9.substring(0, x), _ba.substring(0, y));
                return a.concat(diff_path2(_bf, _b9.substring(x), _ba.substring(y)));
            }
        }
        _bf[d] = new Object();
        for (var k = -d; k <= d; k += 2) {
            if (k == -d || k != d && v2[k - 1] < v2[k + 1]) {
                x = v2[k + 1];
            } else {
                x = v2[k - 1] + 1;
            }
            y = x - k;
            _c3 = (_b9.length - x) + "," + (_ba.length - y);
            if (!_c7 && (_c6 ? _c4.hasOwnProperty(_c3) : (_c4[_c3] !== undefined))) {
                _c5 = true;
            }
            if (_c7) {
                _c4[_c3] = d;
            }
            while (!_c5 && x < _b9.length && y < _ba.length && _b9.charAt(_b9.length - x - 1) == _ba.charAt(_ba.length - y - 1)) {
                x++;
                y++;
                _c3 = (_b9.length - x) + "," + (_ba.length - y);
                if (!_c7 && (_c6 ? _c4.hasOwnProperty(_c3) : (_c4[_c3] !== undefined))) {
                    _c5 = true;
                }
                if (_c7) {
                    _c4[_c3] = d;
                }
            }
            v2[k] = x;
            _bf[d][x + "," + y] = true;
            if (_c5) {
                _be = _be.slice(0, _c4[_c3] + 1);
                var a = diff_path1(_be, _b9.substring(0, _b9.length - x), _ba.substring(0, _ba.length - y));
                return a.concat(diff_path2(_bf, _b9.substring(_b9.length - x), _ba.substring(_ba.length - y)));
            }
        }
    }
    return null;
}
function diff_path1(_cb, _cc, _cd) {
    var _ce = [];
    var x = _cc.length;
    var y = _cd.length;
    var _d1 = null;
    for (var d = _cb.length - 2; d >= 0; d--) {
        while (1) {
            if (_cb[d].hasOwnProperty ? _cb[d].hasOwnProperty((x - 1) + "," + y) : (_cb[d][(x - 1) + "," + y] !== undefined)) {
                x--;
                if (_d1 === DIFF_DELETE) {
                    _ce[0][1] = _cc.charAt(x) + _ce[0][1];
                } else {
                    _ce.unshift([DIFF_DELETE,_cc.charAt(x)]);
                }
                _d1 = DIFF_DELETE;
                break;
            } else {
                if (_cb[d].hasOwnProperty ? _cb[d].hasOwnProperty(x + "," + (y - 1)) : (_cb[d][x + "," + (y - 1)] !== undefined)) {
                    y--;
                    if (_d1 === DIFF_INSERT) {
                        _ce[0][1] = _cd.charAt(y) + _ce[0][1];
                    } else {
                        _ce.unshift([DIFF_INSERT,_cd.charAt(y)]);
                    }
                    _d1 = DIFF_INSERT;
                    break;
                } else {
                    x--;
                    y--;
                    if (_d1 === DIFF_EQUAL) {
                        _ce[0][1] = _cc.charAt(x) + _ce[0][1];
                    } else {
                        _ce.unshift([DIFF_EQUAL,_cc.charAt(x)]);
                    }
                    _d1 = DIFF_EQUAL;
                }
            }
        }
    }
    return _ce;
}
function diff_path2(_d3, _d4, _d5) {
    var _d6 = [];
    var x = _d4.length;
    var y = _d5.length;
    var _d9 = null;
    for (var d = _d3.length - 2; d >= 0; d--) {
        while (1) {
            if (_d3[d].hasOwnProperty ? _d3[d].hasOwnProperty((x - 1) + "," + y) : (_d3[d][(x - 1) + "," + y] !== undefined)) {
                x--;
                if (_d9 === DIFF_DELETE) {
                    _d6[_d6.length - 1][1] += _d4.charAt(_d4.length - x - 1);
                } else {
                    _d6.push([DIFF_DELETE,_d4.charAt(_d4.length - x - 1)]);
                }
                _d9 = DIFF_DELETE;
                break;
            } else {
                if (_d3[d].hasOwnProperty ? _d3[d].hasOwnProperty(x + "," + (y - 1)) : (_d3[d][x + "," + (y - 1)] !== undefined)) {
                    y--;
                    if (_d9 === DIFF_INSERT) {
                        _d6[_d6.length - 1][1] += _d5.charAt(_d5.length - y - 1);
                    } else {
                        _d6.push([DIFF_INSERT,_d5.charAt(_d5.length - y - 1)]);
                    }
                    _d9 = DIFF_INSERT;
                    break;
                } else {
                    x--;
                    y--;
                    if (_d9 === DIFF_EQUAL) {
                        _d6[_d6.length - 1][1] += _d4.charAt(_d4.length - x - 1);
                    } else {
                        _d6.push([DIFF_EQUAL,_d4.charAt(_d4.length - x - 1)]);
                    }
                    _d9 = DIFF_EQUAL;
                }
            }
        }
    }
    return _d6;
}
function diff_prefix(_db, _dc) {
    var _dd = 0;
    var _de = Math.min(_db.length, _dc.length);
    var _df = _de;
    while (_dd < _df) {
        if (_db.substring(0, _df) == _dc.substring(0, _df)) {
            _dd = _df;
        } else {
            _de = _df;
        }
        _df = Math.floor((_de - _dd) / 2 + _dd);
    }
    var _e0 = _db.substring(0, _df);
    _db = _db.substring(_df);
    _dc = _dc.substring(_df);
    return [_db,_dc,_e0];
}
function diff_suffix(_e1, _e2) {
    var _e3 = 0;
    var _e4 = Math.min(_e1.length, _e2.length);
    var _e5 = _e4;
    while (_e3 < _e5) {
        if (_e1.substring(_e1.length - _e5) == _e2.substring(_e2.length - _e5)) {
            _e3 = _e5;
        } else {
            _e4 = _e5;
        }
        _e5 = Math.floor((_e4 - _e3) / 2 + _e3);
    }
    var _e6 = _e1.substring(_e1.length - _e5);
    _e1 = _e1.substring(0, _e1.length - _e5);
    _e2 = _e2.substring(0, _e2.length - _e5);
    return [_e1,_e2,_e6];
}
function diff_halfmatch(_e7, _e8) {
    var _e9 = _e7.length > _e8.length ? _e7 : _e8;
    var _ea = _e7.length > _e8.length ? _e8 : _e7;
    if (_e9.length < 10 || _ea.length < 1) {
        return null;
    }
    function diff_halfmatch_i(_eb, _ec, i) {
        var _ee = _eb.substring(i, i + Math.floor(_eb.length / 4));
        var j = -1;
        var _f0 = "";
        var _f1,best_longtext_b,best_shorttext_a,best_shorttext_b;
        while ((j = _ec.indexOf(_ee, j + 1)) != -1) {
            var _f2 = diff_prefix(_eb.substring(i), _ec.substring(j));
            var _f3 = diff_suffix(_eb.substring(0, i), _ec.substring(0, j));
            if (_f0.length < (_f3[2] + _f2[2]).length) {
                _f0 = _f3[2] + _f2[2];
                _f1 = _f3[0];
                best_longtext_b = _f2[0];
                best_shorttext_a = _f3[1];
                best_shorttext_b = _f2[1];
            }
        }
        if (_f0.length >= _eb.length / 2) {
            return [_f1,best_longtext_b,best_shorttext_a,best_shorttext_b,_f0];
        } else {
            return null;
        }
    }
    var hm1 = diff_halfmatch_i(_e9, _ea, Math.ceil(_e9.length / 4));
    var hm2 = diff_halfmatch_i(_e9, _ea, Math.ceil(_e9.length / 2));
    var hm;
    if (!hm1 && !hm2) {
        return null;
    } else {
        if (!hm2) {
            hm = hm1;
        } else {
            if (!hm1) {
                hm = hm2;
            } else {
                hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
            }
        }
    }
    if (_e7.length > _e8.length) {
        var _f7 = hm[0];
        var _f8 = hm[1];
        var _f9 = hm[2];
        var _fa = hm[3];
    } else {
        var _f9 = hm[0];
        var _fa = hm[1];
        var _f7 = hm[2];
        var _f8 = hm[3];
    }
    var _fb = hm[4];
    return [_f7,_f8,_f9,_fa,_fb];
}
function diff_cleanup_semantic(_fc) {
    var _fd = false;
    var _fe = [];
    var _ff = null;
    var _100 = 0;
    var _101 = 0;
    var _102 = 0;
    while (_100 < _fc.length) {
        if (_fc[_100][0] == DIFF_EQUAL) {
            _fe.push(_100);
            _101 = _102;
            _102 = 0;
            _ff = _fc[_100][1];
        } else {
            _102 += _fc[_100][1].length;
            if (_ff != null && (_ff.length <= _101) && (_ff.length <= _102)) {
                _fc.splice(_fe[_fe.length - 1], 0, [DIFF_DELETE,_ff]);
                _fc[_fe[_fe.length - 1] + 1][0] = DIFF_INSERT;
                _fe.pop();
                _fe.pop();
                _100 = _fe.length ? _fe[_fe.length - 1] : -1;
                _101 = 0;
                _102 = 0;
                _ff = null;
                _fd = true;
            }
        }
        _100++;
    }
    if (_fd) {
        diff_cleanup_merge(_fc);
    }
}
function diff_cleanup_efficiency(diff) {
    var _104 = false;
    var _105 = [];
    var _106 = "";
    var _107 = 0;
    var _108 = false;
    var _109 = false;
    var _10a = false;
    var _10b = false;
    while (_107 < diff.length) {
        if (diff[_107][0] == DIFF_EQUAL) {
            if (diff[_107][1].length < DIFF_EDIT_COST && (_10a || _10b)) {
                _105.push(_107);
                _108 = _10a;
                _109 = _10b;
                _106 = diff[_107][1];
            } else {
                _105 = [];
                _106 = "";
            }
            _10a = _10b = false;
        } else {
            if (diff[_107][0] == DIFF_DELETE) {
                _10b = true;
            } else {
                _10a = true;
            }
            if (_106 && ((_108 && _109 && _10a && _10b) || ((_106.length < DIFF_EDIT_COST / 2) && (_108 + _109 + _10a + _10b) == 3))) {
                diff.splice(_105[_105.length - 1], 0, [DIFF_DELETE,_106]);
                diff[_105[_105.length - 1] + 1][0] = DIFF_INSERT;
                _105.pop();
                _106 = "";
                if (_108 && _109) {
                    _10a = _10b = true;
                    _105 = [];
                } else {
                    _105.pop();
                    _107 = _105.length ? _105[_105.length - 1] : -1;
                    _10a = _10b = false;
                }
                _104 = true;
            }
        }
        _107++;
    }
    if (_104) {
        diff_cleanup_merge(diff);
    }
}
function diff_cleanup_merge(diff) {
    diff.push([DIFF_EQUAL,""]);
    var _10d = 0;
    var _10e = 0;
    var _10f = 0;
    var _110 = "";
    var _111 = "";
    var _112,record_delete;
    var _113;
    while (_10d < diff.length) {
        if (diff[_10d][0] == DIFF_INSERT) {
            _10f++;
            _111 += diff[_10d][1];
            _10d++;
        } else {
            if (diff[_10d][0] == DIFF_DELETE) {
                _10e++;
                _110 += diff[_10d][1];
                _10d++;
            } else {
                if (_10e != 0 || _10f != 0) {
                    if (_10e != 0 && _10f != 0) {
                        _113 = diff_prefix(_111, _110);
                        if (_113[2] != "") {
                            if ((_10d - _10e - _10f) > 0 && diff[_10d - _10e - _10f - 1][0] == DIFF_EQUAL) {
                                diff[_10d - _10e - _10f - 1][1] += _113[2];
                            } else {
                                diff.splice(0, 0, [DIFF_EQUAL,_113[2]]);
                                _10d++;
                            }
                            _111 = _113[0];
                            _110 = _113[1];
                        }
                        _113 = diff_suffix(_111, _110);
                        if (_113[2] != "") {
                            _111 = _113[0];
                            _110 = _113[1];
                            diff[_10d][1] = _113[2] + diff[_10d][1];
                        }
                    }
                    if (_10e == 0) {
                        diff.splice(_10d - _10e - _10f, _10e + _10f, [DIFF_INSERT,_111]);
                    } else {
                        if (_10f == 0) {
                            diff.splice(_10d - _10e - _10f, _10e + _10f, [DIFF_DELETE,_110]);
                        } else {
                            diff.splice(_10d - _10e - _10f, _10e + _10f, [DIFF_DELETE,_110], [DIFF_INSERT,_111]);
                        }
                    }
                    _10d = _10d - _10e - _10f + (_10e ? 1 : 0) + (_10f ? 1 : 0) + 1;
                } else {
                    if (_10d != 0 && diff[_10d - 1][0] == DIFF_EQUAL) {
                        diff[_10d - 1][1] += diff[_10d][1];
                        diff.splice(_10d, 1);
                    } else {
                        _10d++;
                    }
                }
                _10f = 0;
                _10e = 0;
                _110 = "";
                _111 = "";
            }
        }
    }
    if (diff[diff.length - 1][1] == "") {
        diff.pop();
    }
}
function diff_addindex(diff) {
    var i = 0;
    for (var x = 0; x < diff.length; x++) {
        diff[x].push(i);
        if (diff[x][0] != DIFF_DELETE) {
            i += diff[x][1].length;
        }
    }
}
function diff_xindex(diff, loc) {
    var _119 = 0;
    var _11a = 0;
    var _11b = 0;
    var _11c = 0;
    for (var x = 0; x < diff.length; x++) {
        if (diff[x][0] != DIFF_INSERT) {
            _119 += diff[x][1].length;
        }
        if (diff[x][0] != DIFF_DELETE) {
            _11a += diff[x][1].length;
        }
        if (_119 > loc) {
            break;
        }
        _11b = _119;
        _11c = _11a;
    }
    if (diff.length != x && diff[x][0] == DIFF_DELETE) {
        return _11c;
    }
    return _11c + (loc - _11b);
}
function diff_prettyhtml(diff) {
    diff_addindex(diff);
    var html = "";
    for (var x = 0; x < diff.length; x++) {
        var m = diff[x][0];
        var t = diff[x][1];
        var i = diff[x][2];
        t = t.replace(/\n/g, "<BR>");
        if (m == DIFF_DELETE) {
            html += "<DEL STYLE='background:#FFE6E6;' TITLE='i=" + i + "'>" + t + "</DEL>";
        } else {
            if (m == DIFF_INSERT) {
                html += "<INS STYLE='background:#E6FFE6;' TITLE='i=" + i + "'>" + t + "</INS>";
            } else {
                html += "<SPAN TITLE='i=" + i + "'>" + t + "</SPAN>";
            }
        }
    }
    return html;
}
function diff_prettyhtml_1(diff) {
    diff_addindex(diff);
    var html = "";
    for (var x = 0; x < diff.length; x++) {
        var m = diff[x][0];
        var t = diff[x][1];
        var i = diff[x][2];
        t = t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        t = t.replace(/\n/g, "<BR>");
        if (m == DIFF_DELETE) {
            html += "<DEL STYLE='background:#FFE6E6;' TITLE='i=" + i + "'>" + t + "</DEL>";
        } else {
            if (m == DIFF_INSERT) {
                html += "<INS STYLE='background:#E6FFE6;' TITLE='i=" + i + "'>" + t + "</INS>";
            } else {
                html += "<SPAN TITLE='i=" + i + "'>" + t + "</SPAN>";
            }
        }
    }
    return html;
}
function match_getmaxbits() {
    var _12a = 0;
    var oldi = 1;
    var newi = 2;
    while (oldi != newi) {
        _12a++;
        oldi = newi;
        newi = newi << 1;
    }
    return _12a;
}
var MATCH_MAXBITS = match_getmaxbits();
function match_main(text, _12e, loc) {
    loc = Math.max(0, Math.min(loc, text.length - _12e.length));
    if (text == _12e) {
        return 0;
    } else {
        if (text.length == 0) {
            return null;
        } else {
            if (text.substring(loc, loc + _12e.length) == _12e) {
                return loc;
            } else {
                var _130 = match_bitap(text, _12e, loc);
                return _130;
            }
        }
    }
}
function match_bitap(text, _132, loc) {
    if (_132.length > MATCH_MAXBITS) {
        return alert("Pattern too long for this browser.");
    }
    var s = match_alphabet(_132);
    var _135 = text.length;
    _135 = Math.max(_135, MATCH_MINLENGTH);
    _135 = Math.min(_135, MATCH_MAXLENGTH);
    function match_bitap_score(e, x) {
        var d = Math.abs(loc - x);
        return (e / _132.length / MATCH_BALANCE) + (d / _135 / (1 - MATCH_BALANCE));
    }
    var _139 = MATCH_THRESHOLD;
    var _13a = text.indexOf(_132, loc);
    if (_13a != -1) {
        _139 = Math.min(match_bitap_score(0, _13a), _139);
    }
    _13a = text.lastIndexOf(_132, loc + _132.length);
    if (_13a != -1) {
        _139 = Math.min(match_bitap_score(0, _13a), _139);
    }
    var r = Array();
    var d = -1;
    var _13d = Math.pow(2, _132.length - 1);
    _13a = null;
    var _13e,bin_mid;
    var _13f = Math.max(loc + loc, text.length);
    var _140;
    for (var d = 0; d < _132.length; d++) {
        var rd = Array(text.length);
        _13e = loc;
        bin_mid = _13f;
        while (_13e < bin_mid) {
            if (match_bitap_score(d, bin_mid) < _139) {
                _13e = bin_mid;
            } else {
                _13f = bin_mid;
            }
            bin_mid = Math.floor((_13f - _13e) / 2 + _13e);
        }
        _13f = bin_mid;
        var _142 = Math.max(0, loc - (bin_mid - loc) - 1);
        var _143 = Math.min(text.length - 1, _132.length + bin_mid);
        if (text.charAt(_143) == _132.charAt(_132.length - 1)) {
            rd[_143] = Math.pow(2, d + 1) - 1;
        } else {
            rd[_143] = Math.pow(2, d) - 1;
        }
        for (var j = _143 - 1; j >= _142; j--) {
            if (d == 0) {
                rd[j] = ((rd[j + 1] << 1) | 1) & s[text.charAt(j)];
            } else {
                rd[j] = ((rd[j + 1] << 1) | 1) & s[text.charAt(j)] | ((_140[j + 1] << 1) | 1) | ((_140[j] << 1) | 1) | _140[j + 1];
            }
            if (rd[j] & _13d) {
                var _145 = match_bitap_score(d, j);
                if (_145 <= _139) {
                    _139 = _145;
                    _13a = j;
                    if (j > loc) {
                        _142 = Math.max(0, loc - (j - loc));
                    } else {
                        break;
                    }
                }
            }
        }
        if (match_bitap_score(d + 1, loc) > _139) {
            break;
        }
        _140 = rd;
    }
    return _13a;
}
function match_alphabet(_146) {
    var s = Object();
    for (var i = 0; i < _146.length; i++) {
        s[_146.charAt(i)] = 0;
    }
    for (var i = 0; i < _146.length; i++) {
        s[_146.charAt(i)] |= Math.pow(2, _146.length - i - 1);
    }
    return s;
}
function patch_obj() {
    this.diffs = [];
    this.start1 = null;
    this.start2 = null;
    this.length1 = 0;
    this.length2 = 0;
    this.toString = function() {
        var _149,coords2;
        if (this.length1 == 0) {
            _149 = this.start1 + ",0";
        } else {
            if (this.length1 == 1) {
                _149 = this.start1 + 1;
            } else {
                _149 = (this.start1 + 1) + "," + this.length1;
            }
        }
        if (this.length2 == 0) {
            coords2 = this.start2 + ",0";
        } else {
            if (this.length2 == 1) {
                coords2 = this.start2 + 1;
            } else {
                coords2 = (this.start2 + 1) + "," + this.length2;
            }
        }
        var txt = "@@ -" + _149 + " +" + coords2 + " @@\n";
        for (var x = 0; x < this.diffs.length; x++) {
            switch (this.diffs[x][0]) {
                case DIFF_DELETE:
                    txt += "-";
                    break;
                case DIFF_EQUAL:
                    txt += " ";
                    break;
                case DIFF_INSERT:
                    txt += "+";
                    break;
                default:
                    alert("Invalid diff operation in patch_obj.toString()");
            }
            txt += encodeURI(this.diffs[x][1]) + "\n";
        }
        return txt.replace(/%20/g, " ");
    };
    this.text1 = function() {
        var txt = "";
        for (var x = 0; x < this.diffs.length; x++) {
            if (this.diffs[x][0] != DIFF_INSERT) {
                txt += this.diffs[x][1];
            }
        }
        return txt;
    };
    this.text2 = function() {
        var txt = "";
        for (var x = 0; x < this.diffs.length; x++) {
            if (this.diffs[x][0] != DIFF_DELETE) {
                txt += this.diffs[x][1];
            }
        }
        return txt;
    };
}
function patch_addcontext(_150, text) {
    var _152 = text.substring(_150.start2, _150.start2 + _150.length1);
    var _153 = 0;
    while (text.indexOf(_152) != text.lastIndexOf(_152) && _152.length < MATCH_MAXBITS - PATCH_MARGIN - PATCH_MARGIN) {
        _153 += PATCH_MARGIN;
        _152 = text.substring(_150.start2 - _153, _150.start2 + _150.length1 + _153);
    }
    _153 += PATCH_MARGIN;
    var _154 = text.substring(_150.start2 - _153, _150.start2);
    if (_154 != "") {
        _150.diffs.unshift([DIFF_EQUAL,_154]);
    }
    var _155 = text.substring(_150.start2 + _150.length1, _150.start2 + _150.length1 + _153);
    if (_155 != "") {
        _150.diffs.push([DIFF_EQUAL,_155]);
    }
    _150.start1 -= _154.length;
    _150.start2 -= _154.length;
    _150.length1 += _154.length + _155.length;
    _150.length2 += _154.length + _155.length;
}
function patch_make(_156, _157, diff) {
    if (typeof diff == "undefined") {
        diff = diff_main(_156, _157, true);
        if (diff.length > 2) {
            diff_cleanup_semantic(diff);
            diff_cleanup_efficiency(diff);
        }
    }
    if (diff.length == 0) {
        return [];
    }
    var _159 = [];
    var _15a = new patch_obj();
    var _15b = 0;
    var _15c = 0;
    var _15d = null;
    var _15e = _156;
    var _15f = _156;
    for (var x = 0; x < diff.length; x++) {
        var _161 = diff[x][0];
        var _162 = diff[x][1];
        if (_15a.diffs.length == 0 && _161 != DIFF_EQUAL) {
            _15a.start1 = _15b;
            _15a.start2 = _15c;
        }
        if (_161 == DIFF_INSERT) {
            _15a.diffs.push(diff[x]);
            _15a.length2 += _162.length;
            _15f = _15f.substring(0, _15c) + _162 + _15f.substring(_15c);
        } else {
            if (_161 == DIFF_DELETE) {
                _15a.length1 += _162.length;
                _15a.diffs.push(diff[x]);
                _15f = _15f.substring(0, _15c) + _15f.substring(_15c + _162.length);
            } else {
                if (_161 == DIFF_EQUAL && _162.length <= 2 * PATCH_MARGIN && _15a.diffs.length != 0 && diff.length != x + 1) {
                    _15a.diffs.push(diff[x]);
                    _15a.length1 += _162.length;
                    _15a.length2 += _162.length;
                }
            }
        }
        _15d = _161;
        if (_161 == DIFF_EQUAL && _162.length >= 2 * PATCH_MARGIN) {
            if (_15a.diffs.length != 0) {
                patch_addcontext(_15a, _15e);
                _159.push(_15a);
                var _15a = new patch_obj();
                _15d = null;
                _15e = _15f;
            }
        }
        if (_161 != DIFF_INSERT) {
            _15b += _162.length;
        }
        if (_161 != DIFF_DELETE) {
            _15c += _162.length;
        }
    }
    if (_15a.diffs.length != 0) {
        patch_addcontext(_15a, _15e);
        _159.push(_15a);
    }
    return _159;
}
function patch_apply(_163, text) {
    patch_splitmax(_163);
    var _165 = [];
    var _166 = 0;
    var _167,start_loc;
    var _168,text2;
    var diff,mod,index1,index2;
    for (var x = 0; x < _163.length; x++) {
        _167 = _163[x].start2 + _166;
        _168 = _163[x].text1();
        start_loc = match_main(text, _168, _167);
        if (start_loc == null) {
            _165.push(false);
        } else {
            _165.push(true);
            _166 = start_loc - _167;
            text2 = text.substring(start_loc, start_loc + _168.length);
            if (_168 == text2) {
                text = text.substring(0, start_loc) + _163[x].text2() + text.substring(start_loc + _168.length);
            } else {
                diff = diff_main(_168, text2, false);
                index1 = 0;
                for (var y = 0; y < _163[x].diffs.length; y++) {
                    mod = _163[x].diffs[y];
                    if (mod[0] != DIFF_EQUAL) {
                        index2 = diff_xindex(diff, index1);
                    }
                    if (mod[0] == DIFF_INSERT) {
                        text = text.substring(0, start_loc + index2) + mod[1] + text.substring(start_loc + index2);
                    } else {
                        if (mod[0] == DIFF_DELETE) {
                            text = text.substring(0, start_loc + index2) + text.substring(start_loc + diff_xindex(diff, index1 + mod[1].length));
                        }
                    }
                    if (mod[0] != DIFF_DELETE) {
                        index1 += mod[1].length;
                    }
                }
            }
        }
    }
    return [text,_165];
}
function patch_splitmax(_16c) {
    var _16d,patch,patch_size,start1,start2,diff_type,diff_text,precontext,postcontext,empty;
    for (var x = 0; x < _16c.length; x++) {
        if (_16c[x].length1 > MATCH_MAXBITS) {
            _16d = _16c[x];
            _16c.splice(x, 1);
            patch_size = MATCH_MAXBITS;
            start1 = _16d.start1;
            start2 = _16d.start2;
            precontext = "";
            while (_16d.diffs.length != 0) {
                patch = new patch_obj();
                empty = true;
                patch.start1 = start1 - precontext.length;
                patch.start2 = start2 - precontext.length;
                if (precontext != "") {
                    patch.length1 = patch.length2 = precontext.length;
                    patch.diffs.push([DIFF_EQUAL,precontext]);
                }
                while (_16d.diffs.length != 0 && patch.length1 < patch_size - PATCH_MARGIN) {
                    diff_type = _16d.diffs[0][0];
                    diff_text = _16d.diffs[0][1];
                    if (diff_type == DIFF_INSERT) {
                        patch.length2 += diff_text.length;
                        start2 += diff_text.length;
                        patch.diffs.push(_16d.diffs.shift());
                        empty = false;
                    } else {
                        diff_text = diff_text.substring(0, patch_size - patch.length1 - PATCH_MARGIN);
                        patch.length1 += diff_text.length;
                        start1 += diff_text.length;
                        if (diff_type == DIFF_EQUAL) {
                            patch.length2 += diff_text.length;
                            start2 += diff_text.length;
                        } else {
                            empty = false;
                        }
                        patch.diffs.push([diff_type,diff_text]);
                        if (diff_text == _16d.diffs[0][1]) {
                            _16d.diffs.shift();
                        } else {
                            _16d.diffs[0][1] = _16d.diffs[0][1].substring(diff_text.length);
                        }
                    }
                }
                precontext = patch.text2();
                precontext = precontext.substring(precontext.length - PATCH_MARGIN);
                postcontext = _16d.text1().substring(0, PATCH_MARGIN);
                if (postcontext != "") {
                    patch.length1 += postcontext.length;
                    patch.length2 += postcontext.length;
                    if (patch.diffs.length > 0 && patch.diffs[patch.diffs.length - 1][0] == DIFF_EQUAL) {
                        patch.diffs[patch.diffs.length - 1][1] += postcontext;
                    } else {
                        patch.diffs.push([DIFF_EQUAL,postcontext]);
                    }
                }
                if (!empty) {
                    _16c.splice(x++, 0, patch);
                }
            }
        }
    }
}
function patch_totext(_16f) {
    var text = "";
    for (var x = 0; x < _16f.length; x++) {
        text += _16f[x];
    }
    return text;
}
function patch_fromtext(text) {
    var _173 = [];
    text = text.split("\n");
    var _174,m,chars1,chars2,sign,line;
    while (text.length != 0) {
        m = text[0].match(/^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/);
        if (!m) {
            return alert("Invalid patch string:\n" + text[0]);
        }
        _174 = new patch_obj();
        _173.push(_174);
        _174.start1 = parseInt(m[1]);
        if (m[2] == "") {
            _174.start1--;
            _174.length1 = 1;
        } else {
            if (m[2] == "0") {
                _174.length1 = 0;
            } else {
                _174.start1--;
                _174.length1 = parseInt(m[2]);
            }
        }
        _174.start2 = parseInt(m[3]);
        if (m[4] == "") {
            _174.start2--;
            _174.length2 = 1;
        } else {
            if (m[4] == "0") {
                _174.length2 = 0;
            } else {
                _174.start2--;
                _174.length2 = parseInt(m[4]);
            }
        }
        text.shift();
        while (text.length != 0) {
            sign = text[0].charAt(0);
            line = decodeURIComponent(text[0].substring(1));
            if (sign == "-") {
                _174.diffs.push([DIFF_DELETE,line]);
            } else {
                if (sign == "+") {
                    _174.diffs.push([DIFF_INSERT,line]);
                } else {
                    if (sign == " ") {
                        _174.diffs.push([DIFF_EQUAL,line]);
                    } else {
                        if (sign == "@") {
                            break;
                        } else {
                            if (sign == "") {
                            } else {
                                return alert("Invalid patch mode: '" + sign + "'\n" + line);
                            }
                        }
                    }
                }
            }
            text.shift();
        }
    }
    return _173;
}
Ext.ux.Portal = Ext.extend(Ext.Panel, {layout:"column",autoScroll:true,cls:"x-portal",defaultType:"portalcolumn",initComponent:function() {
    Ext.ux.Portal.superclass.initComponent.call(this);
    this.addEvents({validatedrop:true,beforedragover:true,dragover:true,beforedrop:true,drop:true});
},initEvents:function() {
    Ext.ux.Portal.superclass.initEvents.call(this);
    this.dd = new Ext.ux.Portal.DropZone(this, this.dropConfig);
}});
Ext.reg("portal", Ext.ux.Portal);
Ext.ux.Portal.DropZone = function(_175, cfg) {
    this.portal = _175;
    Ext.dd.ScrollManager.register(_175.body);
    Ext.ux.Portal.DropZone.superclass.constructor.call(this, _175.bwrap.dom, cfg);
    _175.body.ddScrollConfig = this.ddScrollConfig;
};
Ext.extend(Ext.ux.Portal.DropZone, Ext.dd.DropTarget, {ddScrollConfig:{vthresh:50,hthresh:-1,animate:true,increment:200},createEvent:function(dd, e, data, col, c, pos) {
    return {portal:this.portal,panel:data.panel,columnIndex:col,column:c,position:pos,data:data,source:dd,rawEvent:e,status:this.dropAllowed};
},notifyOver:function(dd, e, data) {
    var xy = e.getXY(),portal = this.portal,px = dd.proxy;
    if (!this.grid) {
        this.grid = this.getGrid();
    }
    var cw = portal.body.dom.clientWidth;
    if (!this.lastCW) {
        this.lastCW = cw;
    } else {
        if (this.lastCW != cw) {
            this.lastCW = cw;
            portal.doLayout();
            this.grid = this.getGrid();
        }
    }
    var col = 0,xs = this.grid.columnX,cmatch = false;
    for (var len = xs.length; col < len; col++) {
        if (xy[0] < (xs[col].x + xs[col].w)) {
            cmatch = true;
            break;
        }
    }
    if (!cmatch) {
        col--;
    }
    var p,match = false,pos = 0,c = portal.items.itemAt(col),items = c.items.items;
    for (var len = items.length; pos < len; pos++) {
        p = items[pos];
        var h = p.el.getHeight();
        if (h !== 0 && (p.el.getY() + (h / 2)) > xy[1]) {
            match = true;
            break;
        }
    }
    var _186 = this.createEvent(dd, e, data, col, c, match && p ? pos : c.items.getCount());
    if (portal.fireEvent("validatedrop", _186) !== false && portal.fireEvent("beforedragover", _186) !== false) {
        px.getProxy().setWidth("auto");
        if (p) {
            px.moveProxy(p.el.dom.parentNode, match ? p.el.dom : null);
        } else {
            px.moveProxy(c.el.dom, null);
        }
        this.lastPos = {c:c,col:col,p:match && p ? pos : false};
        this.scrollPos = portal.body.getScroll();
        portal.fireEvent("dragover", _186);
        return _186.status;
    } else {
        return _186.status;
    }
},notifyOut:function() {
    delete this.grid;
},notifyDrop:function(dd, e, data) {
    delete this.grid;
    if (!this.lastPos) {
        return;
    }
    var c = this.lastPos.c,col = this.lastPos.col,pos = this.lastPos.p;
    var _18b = this.createEvent(dd, e, data, col, c, pos !== false ? pos : c.items.getCount());
    if (this.portal.fireEvent("validatedrop", _18b) !== false && this.portal.fireEvent("beforedrop", _18b) !== false) {
        dd.proxy.getProxy().remove();
        dd.panel.el.dom.parentNode.removeChild(dd.panel.el.dom);
        if (pos !== false) {
            c.insert(pos, dd.panel);
        } else {
            c.add(dd.panel);
        }
        c.doLayout();
        this.portal.fireEvent("drop", _18b);
        var st = this.scrollPos.top;
        if (st) {
            var d = this.portal.body.dom;
            setTimeout(function() {
                d.scrollTop = st;
            }, 10);
        }
    }
    delete this.lastPos;
},getGrid:function() {
    var box = this.portal.bwrap.getBox();
    box.columnX = [];
    this.portal.items.each(function(c) {
        box.columnX.push({x:c.el.getX(),w:c.el.getWidth()});
    });
    return box;
}});
Ext.ux.Portlet = Ext.extend(Ext.Panel, {anchor:"100%",frame:true,collapsible:true,draggable:true,cls:"x-portlet"});
Ext.reg("portlet", Ext.ux.Portlet);
Ext.ux.PortalColumn = Ext.extend(Ext.Container, {layout:"anchor",autoEl:"div",defaultType:"portlet",cls:"x-portal-column"});
Ext.reg("portalcolumn", Ext.ux.PortalColumn);
Ext.data.DWRProxy = function(_190, _191) {
    Ext.data.DWRProxy.superclass.constructor.call(this);
    this.dwrCall = _190;
    this.pagingAndSort = (_191 != undefined ? _191 : true);
};
Ext.extend(Ext.data.DWRProxy, Ext.data.DataProxy, {load:function(_192, _193, _194, _195, arg) {
    if (this.fireEvent("beforeload", this, _192) !== false) {
        var sort;
        if (_192.sort && _192.dir) {
            sort = _192.sort + " " + _192.dir;
        } else {
            sort = "";
        }
        var _198 = this.loadResponse.createDelegate(this, [_193,_194,_195,arg], 1);
        var _199 = new Array();
        if (arg.arg) {
            _199 = arg.arg.slice();
        } else {
            if (_192.dwrArgs) {
                _199 = _192.dwrArgs.slice();
            }
        }
        if (this.pagingAndSort) {
            _199.push(_192.start);
            _199.push(_192.limit);
            _199.push(sort);
        }
        _199.push(_198);
        this.dwrCall.apply(this, _199);
    } else {
        _194.call(_195 || this, null, arg, false);
    }
},loadResponse:function(_19a, _19b, _19c, _19d, arg) {
    var _19f;
    try {
        _19f = _19b.read(_19a);
    }
    catch(e) {
        this.fireEvent("loadexception", this, null, response, e);
        _19c.call(_19d, null, arg, false);
        return;
    }
    _19c.call(_19d, _19f, arg, true);
},update:function(_1a0) {
},updateResponse:function(_1a1) {
}});
Ext.data.ListRangeReader = function(meta, _1a3) {
    Ext.data.ListRangeReader.superclass.constructor.call(this, meta, _1a3);
    this.recordType = _1a3;
};
Ext.extend(Ext.data.ListRangeReader, Ext.data.DataReader, {getJsonAccessor:function() {
    var re = /[\[\.]/;
    return function(expr) {
        try {
            return (re.test(expr)) ? new Function("obj", "return obj." + expr) : function(obj) {
                return obj[expr];
            };
        }
        catch(e) {
        }
        return Ext.emptyFn;
    };
}(),read:function(o) {
    var _1a8 = this.recordType,fields = _1a8.prototype.fields;
    if (!this.ef) {
        if (this.meta.totalProperty) {
            this.getTotal = this.getJsonAccessor(this.meta.totalProperty);
        }
        if (this.meta.successProperty) {
            this.getSuccess = this.getJsonAccessor(this.meta.successProperty);
        }
        if (this.meta.id) {
            var g = this.getJsonAccessor(this.meta.id);
            this.getId = function(rec) {
                var r = g(rec);
                return (r === undefined || r === "") ? null : r;
            };
        } else {
            this.getId = function() {
                return null;
            };
        }
        this.ef = [];
        for (var i = 0; i < fields.length; i++) {
            f = fields.items[i];
            var map = (f.mapping !== undefined && f.mapping !== null) ? f.mapping : f.name;
            this.ef[i] = this.getJsonAccessor(map);
        }
    }
    var _1ae = [];
    var root = this.meta.root ? o[this.meta.root] : o;
    var c = root.length,totalRecords = c,success = true;
    if (this.meta.totalProperty) {
        var v = parseInt(this.getTotal(o), 10);
        if (!isNaN(v)) {
            totalRecords = v;
        }
    }
    if (this.meta.successProperty) {
        var v = this.getSuccess(o);
        if (v === false || v === "false") {
            success = false;
        }
    }
    for (var i = 0; i < c; i++) {
        var n = root[i];
        var _1b3 = {};
        var id = this.getId(n);
        for (var j = 0; j < fields.length; j++) {
            f = fields.items[j];
            var v = this.ef[j](n);
            _1b3[f.name] = f.convert((v !== undefined) ? v : f.defaultValue);
        }
        var _1b6 = new _1a8(_1b3, id);
        _1ae[i] = _1b6;
    }
    return {success:success,records:_1ae,totalRecords:totalRecords};
}});
jx.data.DwrStore = function(_1b7) {
    if (!_1b7.id) {
        _1b7.id = "id";
    }
    var _1b8 = null;
    var _1b9 = Ext.data.Record.create(_1b7.fields);
    if (_1b7.paging) {
        var _1ba = _1b7.totalProperty ? _1b7.totalProperty : "total";
        var _1bb = _1b7.rootProperty ? _1b7.rootProperty : "results";
        _1b8 = new Ext.data.ListRangeReader({id:_1b7.id,totalProperty:_1ba,root:_1bb}, _1b9);
    } else {
        var _1bb = _1b7.rootProperty ? _1b7.rootProperty : null;
        _1b8 = new Ext.data.ListRangeReader({id:_1b7.id,root:_1bb}, _1b9);
    }
    jx.data.DwrStore.superclass.constructor.call(this, {reader:_1b8,proxy:new Ext.data.DWRProxy(_1b7.dwrCall, _1b7.paging),baseParams:{dwrArgs:_1b7.dwrArgs ? _1b7.dwrArgs : []},remoteSort:_1b7.remoteSort,sortInfo:_1b7.sortInfo});
};
Ext.extend(jx.data.DwrStore, Ext.data.Store, {load:function(_1bc) {
    if (_1bc && _1bc.arg) {
        this.baseParams.dwrArgs = _1bc.arg;
    }
    return jx.data.DwrStore.superclass.load.call(this, _1bc);
}});
jx.data.DwrStoreWithContourFields = function(_1bd) {
    _1bd.fields = this.buildRecordType(_1bd.fields);
    jx.data.DwrStoreWithContourFields.superclass.constructor.call(this, _1bd);
};
Ext.extend(jx.data.DwrStoreWithContourFields, jx.data.DwrStore, {buildRecordType:function(meta) {
    var _1bf = [];
    for (var i = 0; i < meta.length; i++) {
        var _1c1 = meta[i];
        if (_1c1.columnOnly) {
            continue;
        }
        var _1c2 = {};
        _1c2.name = _1c1.field;
        if (_1c1.dataType) {
            var type = "string";
            switch (_1c1.dataType) {
                case "string":
                    type = "string";
                    break;
                case "text":
                    type = "string";
                    break;
                case "date":
                case "Date":
                    type = "date";
                    break;
                case "lookup":
                case "Lookup":
                    type = "auto";
                    break;
                case "boolean":
                case "Boolean":
                    type = "boolean";
                    break;
                default:
                    type = "auto";
                    break;
            }
            _1c2.type = type;
        }
        _1bf.push(_1c2);
    }
    return _1bf;
}});
jx.data.StoreFactory = function() {
    var _1c4 = null;
    return {buildOrganizationStore:function(_1c5) {
        if (_1c5 && _1c4) {
            return _1c4;
        }
        var _1c6 = [{name:"id",type:"int"},{name:"name",type:"string"},{name:"description",type:"string"}];
        var _1c7 = new jx.data.DwrStore({fields:_1c6,dwrCall:admin.getOrganizationList,remoteSort:false,paging:false});
        _1c4 = _1c7;
        _1c7.sort("name", "ASC");
        return _1c7;
    },buildReportStore:function(_1c8) {
        var _1c9 = [{name:"id",type:"int"},{name:"name",type:"string"},{name:"mainReportFile",type:"auto"},{name:"description",type:"string"}];
        var _1ca = new jx.data.DwrStore({fields:_1c9,dwrCall:report.getReportList,remoteSort:false,paging:false});
        return _1ca;
    },buildProjectReportStore:function(_1cb) {
        var _1cc = [{name:"id",type:"int"},{name:"name",type:"string"},{name:"description",type:"string"},{name:"criterions",type:"auto"}];
        var _1cd = new jx.data.DwrStore({fields:_1cc,dwrCall:report.getVisibleReportList,remoteSort:false,paging:false});
        return _1cd;
    },buildProjectStore:function() {
        var _1ce = [{name:"id",type:"int"},{name:"name",type:"string"},{name:"description",type:"string"}];
        var _1cf = new jx.data.DwrStore({id:"id",fields:_1ce,rootProperty:"results",dwrCall:project.getExtProjectResults,remoteSort:false,paging:false});
        return _1cf;
    },buildDocumentGroupStore:function() {
        var _1d0 = [{name:"id",type:"int"},{name:"displayPlural",type:"string"}];
        var _1d1 = new jx.data.DwrStore({fields:_1d0,dwrCall:documentManager.getDocumentGroupList,remoteSort:false,paging:false});
        return _1d1;
    },buildDocumentTypeStore:function() {
        var _1d2 = [{name:"name",type:"string"},{name:"description",type:"string"},{name:"components",type:"string"}];
        var _1d3 = new jx.data.DwrStore({fields:_1d2,dwrCall:documentTypeSvc.getDocumentTypeList,remoteSort:false,paging:false});
        return _1d3;
    },buildBaselineStore:function() {
        var _1d4 = [{name:"name",type:"string"},{name:"description",type:"string"}];
        var _1d5 = new jx.data.DwrStore({fields:_1d4,dwrCall:baseLine.getBaseLineListForProject,remoteSort:false,paging:false});
        return _1d5;
    },buildDocumentTypeFieldStore:function() {
        var _1d6 = [{name:"sortOrder",type:"string"},{name:"documentField",type:"auto"},{name:"label",type:"string"},{name:"controlTypeId",type:"int"},{name:"lookupTypeId",type:"int"},{name:"readOnly",type:"boolean"},{name:"showInFolder",type:"boolean"},{name:"showInList",type:"boolean"}];
        var _1d7 = new jx.data.DwrStore({fields:_1d6,dwrCall:documentTypeSvc.getDocumentTypeFieldList,remoteSort:false,paging:false});
        return _1d7;
    },buildProjectTagStore:function() {
        var _1d8 = [{name:"id",type:"int"},{name:"tagName",type:"string"},{name:"count",type:"int"}];
        var _1d9 = new jx.data.DwrStore({id:"id",fields:_1d8,dwrCall:tagSvc.getAllTagsByProjectId,remoteSort:false,paging:false});
        return _1d9;
    },buildDocumentTagStore:function() {
        var _1da = [{name:"id",type:"int"},{name:"tagName",type:"string"},{name:"count",type:"int"}];
        var _1db = new jx.data.DwrStore({id:"id",fields:_1da,dwrCall:tagSvc.getAllTagsByDocumentId,remoteSort:false,paging:false});
        return _1db;
    },buildEventStore:function(_1dc) {
        var _1dd = [{name:"id",type:"int"},{name:"itemId",type:"int"},{name:"itemName",type:"string"},{name:"documentKey",type:"string"},{name:"userName",type:"string"},{name:"action",type:"string"},{name:"whenAgo",type:"string"},{name:"projectId",type:"int"},{name:"projectName",type:"string"},{name:"projAndDocIds",type:"string"}];
        var _1de = new jx.data.DwrStore({fields:_1dd,dwrCall:eventLogSvc.getEventLogListPaging,dwrArgs:_1dc,remoteSort:false,paging:true});
        return _1de;
    },buildLookupStore:function() {
        var _1df = [{name:"name",type:"string"},{name:"description",type:"string"}];
        var _1e0 = new jx.data.DwrStore({fields:_1df,dwrCall:lookup.getLookupList,remoteSort:false,paging:false});
        return _1e0;
    },buildLookupByTypeCategoryStore:function() {
        var _1e1 = [{name:"id",type:"int"},{name:"name",type:"string"},{name:"description",type:"string"}];
        var _1e2 = new jx.data.DwrStore({id:"id",fields:_1e1,dwrCall:lookup.getLookupListByTypeCategory,remoteSort:false,paging:false});
        return _1e2;
    },buildLookupTypeStore:function() {
        var _1e3 = [{name:"id",type:"int"},{name:"name",type:"string"},{name:"description",type:"string"}];
        var _1e4 = new jx.data.DwrStore({fields:_1e3,dwrCall:lookup.getLookupTypeList,remoteSort:false,paging:false});
        return _1e4;
    },buildCommentStore:function() {
        var _1e5 = [{name:"id",type:"int"},{name:"commentText",type:"string"},{name:"createdDate",type:"date"},{name:"userName",type:"string"},{name:"createdBy",type:"int"}];
        var _1e6 = new jx.data.DwrStore({id:"id",fields:_1e5,dwrCall:comments.getComments,remoteSort:false,paging:false});
        return _1e6;
    },buildVersionStore:function() {
        var _1e7 = [{name:"versionId",type:"int"},{name:"versionNumber",type:"string"},{name:"comments",type:"string"},{name:"createdDate",type:"date"},{name:"userName",type:"string"},{name:"createdBy",type:"int"},{name:"baseLines",type:"auto"}];
        var _1e8 = new jx.data.DwrStore({id:"versionId",fields:_1e7,dwrCall:version.getVersions,remoteSort:false,paging:false,sortInfo:{field:"createdBy",direction:"DESC"}});
        return _1e8;
    },buildArtifactAttachmentStore:function() {
        var _1e9 = [{name:"url",type:"string"},{name:"attachment",type:"auto"},{name:"note",type:"string"}];
        var _1ea = new jx.data.DwrStore({id:"id",fields:_1e9,dwrCall:documentManager.getDocumentAttachmentList,remoteSort:false,paging:false});
        return _1ea;
    },buildProjectAttachmentStore:function() {
        var _1eb = [{name:"id",type:"int"},{name:"fileName",type:"string"},{name:"description",type:"string"},{name:"fileSize",type:"int"},{name:"mimetype",type:"string"}];
        var _1ec = new jx.data.DwrStore({id:"id",fields:_1eb,dwrCall:attachment.getFileAttachmentListForProject,remoteSort:false,paging:false});
        return _1ec;
    },buildLdapUserInfoStore:function() {
        var _1ed = [{name:"userName",type:"string"},{name:"fullName",type:"string"},{name:"firstName",type:"string"},{name:"lastName",type:"string"},{name:"email",type:"string"}];
        var _1ee = new jx.data.DwrStore({id:"userName",fields:_1ed,dwrCall:ldapSvc.getUserList,remoteSort:false,paging:false});
        return _1ee;
    },buildUserStore:function() {
        var _1ef = [{name:"userName",type:"string"},{name:"firstName",type:"string"},{name:"lastName",type:"string"},{name:"email",type:"string"},{name:"disabled",type:"boolean"},{name:"licenseType",type:"string"}];
        var _1f0 = new jx.data.DwrStore({id:"id",fields:_1ef,dwrCall:user.getUserListByOrgId,remoteSort:false,paging:false});
        _1f0.sort("userName", "ASC");
        return _1f0;
    },buildRoleStore:function() {
        var _1f1 = [{name:"id",type:"int"},{name:"name",type:"string"},{name:"display",type:"string"},{name:"description",type:"string"}];
        var _1f2 = new jx.data.DwrStore({id:"id",fields:_1f1,dwrCall:user.getRoleListByOrgId,remoteSort:false,paging:false});
        return _1f2;
    },buildSubscriptionNotificationStore:function() {
        var _1f3 = [{name:"projectName",type:"string"},{name:"notificationName",type:"string"},{name:"scope",type:"int"},{name:"notificationImage",type:"string"},{name:"lastNotification",type:"date"}];
        var _1f4 = new jx.data.DwrStore({id:"id",fields:_1f3,dwrCall:subscriptionSvc.getSubscriptionListForUser,remoteSort:false,paging:false});
        return _1f4;
    },buildRelationshipStore:function() {
        var _1f5 = [{name:"documentKey",type:"string"},{name:"documentName",type:"string"},{name:"forward",type:"boolean"},{name:"documentId",type:"int"},{name:"documentGroup",type:"string"},{name:"documenttype",type:"string"},{name:"assignedTo",type:"string"},{name:"suspect",type:"boolean"},{name:"traceType",type:"auto"},{name:"depth",type:"boolean"},{name:"projectId",type:"int"},{name:"projectName",type:"string"},{name:"projectAuthorized",type:"boolean"}];
        var _1f6 = new jx.data.DwrStore({id:"traceId",fields:_1f5,rootProperty:"results",dwrCall:relationshipSvc.getExtRelationshipsForDocument,remoteSort:false,paging:false});
        return _1f6;
    },buildOneDirectionRelationshipStore:function() {
        var _1f7 = [{name:"documentKey",type:"string"},{name:"documentName",type:"string"},{name:"forward",type:"boolean"},{name:"documentId",type:"int"},{name:"documentGroup",type:"string"},{name:"documenttype",type:"string"},{name:"assignedTo",type:"string"},{name:"suspect",type:"boolean"},{name:"traceType",type:"auto"},{name:"depth",type:"boolean"},{name:"projectId",type:"int"},{name:"projectName",type:"string"},{name:"projectAuthorized",type:"boolean"}];
        var _1f8 = new jx.data.DwrStore({id:"traceId",fields:_1f7,dwrCall:relationshipSvc.getDocumentTracesForDocumentByDirection,remoteSort:false,paging:false});
        return _1f8;
    },buildFilterStore:function() {
        var _1f9 = [{name:"name",type:"string"}];
        var _1fa = new jx.data.DwrStore({id:"id",fields:_1f9,dwrCall:filterSvc.getFilterListByScope,remoteSort:false,paging:false});
        return _1fa;
    },buildReleaseStore:function() {
        var _1fb = [{name:"id",type:"int"},{name:"name",type:"string"},{name:"description",type:"string"},{name:"releaseDate",type:"date"}];
        var _1fc = new jx.data.DwrStore({id:"id",fields:_1fb,dwrCall:releaseSvc.getProjectReleaseList,remoteSort:false,paging:false});
        return _1fc;
    },buildDistributionGroupStore:function() {
        var _1fd = [{name:"name",type:"string"},{name:"description",type:"string"}];
        var _1fe = new jx.data.DwrStore({id:"id",fields:_1fd,dwrCall:distributionGroup.getDistributionGroupListForProject,remoteSort:false,paging:false});
        return _1fe;
    },buildPermissionStore:function() {
        var _1ff = [{name:"role",type:"auto"},{name:"mask",type:"int"}];
        var _200 = new jx.data.DwrStore({id:"id",fields:_1ff,dwrCall:acl.getAclPermissionListByIdentity,remoteSort:false,paging:false});
        return _200;
    },buildItemTagStore:function() {
        var _201 = [{name:"tag",type:"auto"},{name:"document",type:"auto"}];
        var _202 = new jx.data.DwrStore({id:"id",fields:_201,dwrCall:tagSvc.getAllTagsByDocumentId,remoteSort:false,paging:false});
        return _202;
    },buildItemTestResultsStore:function() {
        var _203 = [{name:"testConfiguration",type:"auto"},{name:"passStatus",type:"boolean"},{name:"notes",type:"string"},{name:"testCaseDetails",type:"string"},{name:"createdBy",type:"auto"},{name:"createdDate",type:"date"}];
        var _204 = new jx.data.DwrStore({id:"id",fields:_203,dwrCall:documentManager.getTestResultsList,remoteSort:false,paging:false});
        return _204;
    },buildAuthProviderConfigStore:function() {
        var _205 = [{name:"id",type:"int"},{name:"name",type:"string"},{name:"description",type:"string"},{name:"url",type:"string"},{name:"baseDn",type:"string"}];
        var _206 = new jx.data.DwrStore({fields:_205,dwrCall:ldapSvc.getAuthProviderConfigList,remoteSort:false,paging:false});
        return _206;
    }};
}();
jx.data.SimpleListStore = function(_207) {
    jx.data.SimpleListStore.superclass.constructor.call(this, {reader:new Ext.data.JsonReader({id:_207.id}, Ext.data.Record.create(_207.fields)),proxy:new Ext.data.MemoryProxy(_207.data)});
    this.load();
};
Ext.extend(jx.data.SimpleListStore, Ext.data.Store);
Ext.namespace("jx");
Ext.namespace("jx.grid");
jx.grid.ContourGrid = function(_208) {
    _208 = Ext.applyIf(_208, {defaultDateFormat:this.getAppContext().getDayMonthYearFormat()});
    Ext.apply(this, _208);
    if (!_208.ds) {
        if (_208.fieldDefinitions) {
            _208.ds = this.buildDataStore(_208.fieldDefinitions);
        } else {
            _208.ds = new Ext.data.Store({});
        }
    }
    if (!_208.cm) {
        if (_208.fieldDefinitions) {
            _208.cm = this.buildColumnModel(_208.fieldDefinitions);
        } else {
            _208.cm = new Ext.grid.ColumnModel([{header:""}]);
        }
    }
    if (!_208.bbar) {
        _208.bbar = this.createPagingToolbar(this.pageSize, _208);
    }
    jx.grid.ContourGrid.superclass.constructor.call(this, _208);
};
Ext.extend(jx.grid.ContourGrid, Ext.grid.GridPanel, {fieldDefinitions:null,dwrCall:null,paging:true,dwrArgs:null,remoteSort:true,pagingTb:null,comboStore:null,pagingDisplayMsg:"Displaying topics {0} - {1} of {2}",displayInfo:true,showSize:true,autoHide:true,defaultDateFormat:"m/d/Y",pageSize:20,setFieldDefinitions:function(meta) {
    var _20a = this.getStore();
    var _20b = this.buildDataStore(meta);
    var _20c = this.buildColumnModel(meta);
    this.reconfigure(_20b, _20c);
    this.getView().userResized = false;
    if (this.pagingTb) {
        this.pagingTb.unbind(_20a);
        this.pagingTb.bind(_20b);
    }
},buildDataStore:function(meta) {
    return new jx.data.DwrStoreWithContourFields({fields:meta,dwrCall:this.dwrCall,dwrArgs:this.dwrArgs,remoteSort:this.remoteSort,paging:this.paging});
},createPagingToolbar:function(_20e, _20f) {
    this.pagingTb = new jx.PagingToolbar({store:_20f.ds,pageSize:_20e,displayInfo:this.displayInfo,displayMsg:this.pagingDisplayMsg,emptyMsg:"No topics to display"});
    return this.pagingTb;
},buildColumnModel:function(meta) {
    this.autoExpandColumn = null;
    var _211 = [];
    for (var i = 0; i < meta.length; i++) {
        var _213 = meta[i];
        if (_213.dataOnly) {
            continue;
        }
        var _214 = {};
        _214.dataIndex = _213.field;
        if (_213.sortable == undefined) {
            _214.sortable = true;
        } else {
            _214.sortable = _213.sortable;
        }
        _214.header = _213.label;
        if (_213.width) {
            _214.width = _213.width;
        }
        if (_213.tooltip) {
            _214.tooltip = _213.tooltip;
        }
        var _215 = _213.renderer;
        if (!_215 && _213.dataType) {
            switch (_213.dataType) {
                case "date":
                case "Date":
                    var _216 = this.defaultDateFormat;
                    _215 = Ext.util.Format.dateRenderer(_216);
                    break;
                case "lookup":
                case "Lookup":
                    _215 = function(_217, p, _219) {
                        return _217 ? _217.name : "";
                    };
                    break;
                case "user":
                case "User":
                    _215 = function(_21a, p, _21c) {
                        return _21a ? (_21a.firstName + " " + _21a.lastName) : "";
                    };
                    break;
                case "action":
                    _215 = this.createActionRenderer(_213.actions);
                    break;
            }
        }
        if (_215) {
            _214.renderer = _215;
        }
        if (_213.hidden) {
            _214.hidden = true;
        }
        if (_213.field == "name") {
            _214.width = 200;
            _214.id = _213.field;
        }
        _211.push(_214);
    }
    return new Ext.grid.ColumnModel(_211);
},createActionRenderer:function(_21d) {
    return function(_21e, p, _220) {
        var html = "";
        for (var j = 0; j < _21d.length; j++) {
            var _223 = _21d[j];
            var link = String.format("<a href=\"javascript:void(0);\" action=\"{0}\">{1}</a>&nbsp;&nbsp;", _223.name, _223.display);
            html += link;
        }
        return html;
    };
},refresh:function() {
    this.loadData();
},loadData:function(_225) {
    if (this.pagingTb) {
        var _226 = (this.pagingTb.cursor) ? this.pagingTb.cursor : 0;
        this.getStore().load({arg:_225,params:{start:_226,limit:this.pagingTb.pageSize}});
    } else {
        this.getStore().load({arg:_225,params:{start:0,limit:0}});
    }
}});
jx.grid.ItemGrid = function(_227) {
    this.dwrCall = filterSvc.getExtFilterResults;
    this.selModel = new Ext.grid.RowSelectionModel({singleSelect:false});
    this.enableColLock = false;
    this.loadMask = true;
    this.fitContainer = true;
    this.ddGroup = "artifactDD";
    this.enableDrag = true;
    jx.grid.ItemGrid.superclass.constructor.call(this, _227);
};
Ext.extend(jx.grid.ItemGrid, jx.grid.ContourGrid, {fieldDefinitions:null,dwrCall:null,gridHeader:null,meta:null,tagMeta:null,searchMeta:null,createHeader:function() {
},loadFolderGrid:function(_228, _229, _22a) {
    var _22b = this.getFolderFilter(_228, _229, _22a, null);
    this.loadFilterGrid(_22b, _22a, {documentId:_229});
},loadGroupGrid:function(_22c, _22d, _22e, _22f) {
    var _230 = this.getGroupFilter(_22c, _22d, _22e, _22f);
    this.loadFilterGrid(_230, _22e, {groupId:_22d});
},loadFilterGrid:function(_231, _232, _233) {
    this.filter = _231;
    this.dwrCall = this.getDwrDocumentCall();
    this.dwrArgs = [_231];
    if (_233.meta) {
        this.setMeta(_233.meta);
    } else {
        if (_233.filterMeta) {
            this.setTypeMeta(_233.meta);
        } else {
            if (_233.typeId) {
                documentTypeSvc.getDocumentTypeMetaData(_233.typeId, _232, true, {callback:this.setTypeMeta.createDelegate(this),async:false});
            } else {
                if (_233.groupId) {
                    documentTypeSvc.getListMetaDataByGroupId(_233.groupId, {callback:this.setTypeMeta.createDelegate(this),async:false});
                } else {
                    if (_233.documentId) {
                        documentTypeSvc.getListMetaDataByDocumentId(_233.documentId, {callback:this.setTypeMeta.createDelegate(this),async:false});
                    }
                }
            }
        }
    }
    this.loadData();
},loadTagGrid:function(_234, meta) {
    this.dwrCall = this.getDwrTagCall();
    this.dwrArgs = [_234];
    this.setMeta(meta || this.getTagMeta());
    this.loadData();
},loadSearchGrid:function(_236, _237, meta) {
    this.dwrCall = this.getDwrSearchCall();
    this.dwrArgs = [_236,_237];
    this.setMeta(meta || this.getSearchMeta());
    this.loadData();
},loadReleaseGrid:function(_239, _23a, meta) {
    var _23c = this.getReleaseFilter(_239, _23a);
    this.dwrCall = this.getDwrDocumentCall();
    this.dwrArgs = [_23c];
    this.setMeta(meta || this.getTagMeta());
    this.loadData();
},getReleaseFilter:function(_23d, _23e) {
    var _23f = [{type:"boolean",field:"active",paramValues:["T"]},{type:"boolean",field:"isFolder",paramValues:["F"]},{type:"Lookup",field:"release",paramValues:[_23d]},{type:"Lookup",field:"project",paramValues:["currentProject"]},{type:"boolean",field:"documentGroup.displayInReleaseTree",paramValues:["T"]}];
    var _240 = {name:"defaultFilter",typeId:null,parameters:_23f,currentProjectId:_23e};
    return _240;
},setMeta:function(meta) {
    this.meta = meta;
    this.setFieldDefinitions(meta.fieldList);
},setTypeMeta:function(meta) {
    meta.fieldList = this.getDefaultColumns().concat(meta.fieldList);
    this.setMeta(meta);
},getDwrDocumentCall:function() {
    return filterSvc.getExtFilterResults;
},getDwrTagCall:function() {
    return tagSvc.getExtDocumentsByTagId;
},getDwrReleaseCall:function() {
    return releaseSvc.getDocumentsByReleaseID;
},getDwrSearchCall:function() {
    return documentManager.search;
},getDefaultColumns:function() {
    if (!this.defaultColumns) {
        this.defaultColumns = [{field:"typeId",tooltip:"Document Type Field",width:100,label:"Type",dataOnly:true},{field:"id",tooltip:"Internal Database Id",width:50,label:"API ID",hidden:true},{field:"isFolder",tooltip:"Folder",width:32,label:"<img src=\"img/silk/folder_page_white.png\"/>",dataType:"boolean",renderer:function(_243, p, _245) {
            return _243 ? "<img src=\"img/tree/folderClosed.gif\" title=\"Folder\"/>" : "<img src=\"img/silk/page_white_text.png\" title=\"Artifact\"/>";
        }}];
    }
    return this.defaultColumns;
},getSearchMeta:function() {
    if (!this.searchMeta) {
        this.searchMeta = {fieldList:[{field:"typeId",tooltip:"Type",width:100,label:"Type",dataOnly:true},{field:"id",tooltip:"Internal Database Id",width:50,label:"DB ID",hidden:true},{field:"documentGroupImage",tooltip:"Item set",label:"<img src=\"img/silk/package.png\" title=\"Folder\"/>",width:32,renderer:function(_246, p, _248) {
            return "<img src=\"" + "img/tree/" + _246 + "\"" + " title=\"" + _248.get("documentGroupDisplay") + "\"" + "/>";
        }},{field:"isFolder",tooltip:"Folder",width:32,label:"<img src=\"img/silk/folder_page_white.png\"/>",dataType:"boolean",renderer:function(_249, p, _24b) {
            return _249 ? "<img src=\"img/tree/folderClosed.gif\" title=\"Folder\"/>" : "<img src=\"img/silk/page_white_text.png\" title=\"Artifact\"/>";
        }},{field:"documentKey",label:"ID",tooltip:"Artifact ID"},{field:"name",tooltip:"Item Name",width:200,label:"Name"},{field:"documentGroupDisplay",label:"Display",dataOnly:true}]};
    }
    return this.searchMeta;
},getTagMeta:function() {
    if (!this.tagMeta) {
        this.tagMeta = {fieldList:[{field:"typeId",tooltip:"Document Type Field",width:100,label:"Type",dataOnly:true},{field:"id",tooltip:"Internal Database Id",width:50,label:"DB ID",hidden:true},{field:"isFolder",tooltip:"Folder",width:32,label:"<img src=\"img/silk/folder_page_white.png\"/>",dataType:"boolean",renderer:function(_24c, p, _24e) {
            return _24c ? "<img src=\"img/tree/folderClosed.gif\" title=\"Folder\"/>" : "<img src=\"img/silk/page_white_text.png\" title=\"Artifact\"/>";
        },hidden:true},{field:"name",label:"Name"},{field:"documentKey",label:"ID"},{field:"status",label:"Status",dataType:"lookup"},{field:"priority",label:"Priority",dataType:"lookup"}]};
    }
    return this.tagMeta;
},getGroupFilter:function(_24f, _250, _251, _252) {
    var _253 = (_24f) ? "FullFolderSearch::documentGroup::" + _250 : "";
    var _254 = [{type:"parent",field:"parent",custom:_253,paramValues:["null"]},{type:"boolean",field:"active",paramValues:["T"]},{type:"boolean",field:"isFolder",paramValues:["F"]},{type:"Lookup",field:"project",paramValues:["currentProject"]},{type:"Lookup",field:"documentGroup",paramValues:[_250]}];
    var _255 = {name:"defaultFilter",typeId:_252 ? _252 : null,parameters:_254,currentProjectId:_251};
    return _255;
},getFolderFilter:function(_256, _257, _258, _259) {
    var _25a = (_256) ? "FullFolderSearch::parent::" + _257 : "";
    var _25b = [{type:"parent",field:"parent",custom:_25a,paramValues:[_257]},{type:"boolean",field:"active",paramValues:["T"]},{type:"boolean",field:"isFolder",paramValues:["F"]},{type:"Lookup",field:"project",paramValues:["currentProject"]}];
    var _25c = {name:"defaultFilter",typeId:_259 ? _259 : null,parameters:_25b,currentProjectId:_258};
    return _25c;
}});
jx.grid.SimpleGrid = function(_25d) {
    _25d = Ext.applyIf(_25d, {emptyText:"No Data",defaultDateFormat:this.getAppContext().getDayMonthYearFormat()});
    jx.grid.SimpleGrid.superclass.constructor.call(this, _25d);
    if (this.fieldDefinitions) {
        this.setFieldDefinitions(this.fieldDefinitions);
    }
};
Ext.extend(jx.grid.SimpleGrid, Ext.Panel, {item:null,editable:true,defaultDateFormat:"m/d/Y",alternateRows:false,fields:[],rowAlternateClass:"alt",selectedClass:"selected",hoveredClass:"hovered",singleSelect:true,muliSelect:false,headerClass:"",headerUpClass:"selectedUp",headerDownClass:"selectedDown",tableClass:"j-grid-table",fieldDefinitions:null,getFieldFunc:null,setFieldFunc:null,selectRecord:null,sortable:true,sortInfo:{index:-1,direction:0},loadingMessage:"Loading...",_meta:{field:null,format:null,filterer:null,sortable:true,sortType:"String",dataType:String,sortFunction:null,filterFunction:null,label:"",align:"left",valign:"top",getField:function() {
    return this.field || this.label;
},getType:function() {
    return this.dataType;
}},afterRefresh:function() {
    var _25e = this.sortInfo;
    if (this.sortInfo && this.sortInfo.index != -1) {
        var head = this.view.getEl().child("thead");
        if (head) {
            var tr = head.child("tr", true);
        }
        if (tr && _25e.index < tr.cells.length) {
            var cell = tr.cells[_25e.index];
            cell.className = (_25e.direction == 0) ? this.headerDownClass : this.headerUpClass;
        }
    }
},setFieldDefinitions:function(_262) {
    this.sortInfo = {index:-1,direction:0};
    this.fields = [];
    for (var i = 0; i < _262.length; i++) {
        var _264 = Ext.applyIf(_262[i], this._meta);
        this.fields.push(_264);
    }
    this.createTemplate(this.fields);
},createTemplate:function(_265) {
    var buf = "<table class=\"" + this.tableClass + "\">";
    buf += this.createHeader();
    buf += "<tbody><tpl for=\".\">";
    buf += "<tr class=\"j-grid-row {alt}\">";
    for (var i = 0; i < _265.length; i++) {
        var _268 = _265[i];
        buf += "<td class=\"j-grid-col\">" + "{" + _268.field + "}" + "</td>";
    }
    buf += "</tr>";
    buf += "</tpl></tbody></table>";
    this.template = new Ext.XTemplate(buf);
},createHeader:function() {
    var _269 = new Ext.XTemplate("<thead><tr><tpl for=\".\">", "<td width=\"{width}\">{label}</td>", "</tpl></tr></thead>");
    return _269.apply(this.fields);
},prepareData:function(data, _26b, _26c) {
    var obj = {};
    var _26e = this.fields;
    for (var i = 0; i < _26e.length; i++) {
        var _270 = _26e[i];
        var _271 = _270.field;
        var _272 = data[_271];
        obj[_271] = this.getFieldValue(_270, _272, _26c);
    }
    if (_26b % 2 == 1) {
        obj["alt"] = (_26b % 2 == 1) ? "j-grid-row-alt" : "";
    }
    return obj;
},getFieldValue:function(_273, _274, _275) {
    var _276 = _274;
    if (_273.renderer) {
        _276 = _273.renderer(_274, null, _275);
    } else {
        switch (_273.dataType) {
            case "lookup":
                if (!_274) {
                    _276 = _274;
                } else {
                    if (typeof (_274) == "object") {
                        _276 = _274 ? _274.name : "";
                    } else {
                        if (_273.options) {
                            var _277 = this.getLookup(_273.options, _274);
                            _276 = _277 ? _277.name : "";
                        }
                    }
                }
                break;
            case "date":
                _276 = _274 ? _274.format(_273.format || this.defaultDateFormat) : "";
                break;
            case "action":
                _276 = this.createActionHtml(_273.actions);
                break;
            default:
                break;
        }
    }
    return _276;
},getLookup:function(_278, val) {
    var _27a = null;
    if (val) {
        for (var i = 0; i < _278.length; i++) {
            var _27c = _278[i];
            if (_27c.id == val) {
                _27a = _27c;
                break;
            }
        }
    }
    return _27a;
},createActionHtml:function(_27d) {
    var html = "";
    if (this.editable) {
        for (var j = 0; j < _27d.length; j++) {
            var _280 = _27d[j];
            if (j > 0) {
                html += "&nbsp;|&nbsp;";
            }
            var link = String.format("<a href=\"javascript:void(0);\" class=\"{0}\">{1}</a>", "j-action-" + _280.name, _280.display);
            html += link;
        }
    }
    return html;
},sortDataStore:function() {
    var _282 = this.sortInfo.index;
    if (_282 >= 0) {
        var _283 = this.fields[_282];
        this.dataStore.sort(_283.field, this.sortInfo.direction == 0 ? "ASC" : "DESC");
    }
},onSelectRow:function(view, _285, item, e) {
    var _288 = this.body;
    var _289 = this.dataStore.getAt(_285);
    var _28a = null;
    var row = e.getTarget("tr", _288);
    var cell = e.getTarget("td", _288);
    var link = e.getTarget("a", _288);
    if (link != null) {
        var _28e = link.className;
        if (_28e.indexOf("j-action-") != -1) {
            _28a = _28e.substr(9);
        }
    }
    var _28f = cell.cellIndex;
    this.onSelectItem(view, _285, _289, e, _28a, _28f);
},onSort:function(view, e) {
    var _292;
    if (!this.sortable || !(_292 = e.getTarget("thead"))) {
        return false;
    }
    var cell = e.getTarget("td", _292);
    var _294 = cell.cellIndex;
    var _295 = this.fields[_294];
    if (!_295.sortable) {
        return false;
    }
    var row = e.getTarget("tr", _292);
    var _297 = row.getElementsByTagName("td");
    for (var i = 0; i < _297.length; i++) {
        _297[i].className = this.headerClass;
    }
    var _299 = this.sortInfo;
    if (_294 == _299.index) {
        _299.direction = (_299.direction + 1) % 2;
    } else {
        _299 = {index:_294,direction:0};
    }
    cell.className = (_299.direction == 0) ? this.headerDownClass : this.headerUpClass;
    this.sortInfo = _299;
    this.sortDataStore();
    return true;
},onSelectItem:function(view, _29b, _29c, e, _29e, _29f) {
},loadData:function(_2a0) {
    this.mask();
    if (this.pagingTb) {
        this.dataStore.load({arg:_2a0,params:{start:0,limit:this.pagingTb.pageSize}});
    } else {
        this.dataStore.load({arg:_2a0});
    }
},mask:function() {
    this.el.mask(this.loadingMessage);
},unmask:function() {
    this.el.unmask();
},onRenderOther:Ext.emptyFn,onRender:function(ct, _2a2) {
    jx.grid.SimpleGrid.superclass.onRender.call(this, ct, _2a2);
    if (this.fields) {
        this.view = new Ext.DataView({emptyText:this.emptyText,tpl:this.template,store:this.dataStore,itemSelector:"tr.j-grid-row",selectedClass:this.selectedClass,prepareData:this.prepareData.createDelegate(this),listeners:{click:{fn:this.onSelectRow,scope:this},containerclick:{fn:this.onSort,scope:this},afterRefresh:{fn:this.afterRefresh,scope:this}}});
        this.add(this.view);
        this.doLayout();
        this.view.store.on("datachanged", this.unmask, this);
        this.onRenderOther();
    }
},onBeforeDestroy:function() {
    jx.grid.SimpleGrid.superclass.onBeforeDestroy.call(this);
}});
jx.grid.SimpleGridDetail = function(_2a3) {
    jx.grid.SimpleGridDetail.superclass.constructor.call(this, _2a3);
};
Ext.extend(jx.grid.SimpleGridDetail, jx.grid.SimpleGrid, {form:null,dialog:null,dialogWidth:500,dialogHeight:300,dialogTitle:"Dialog Title",listTitle:"List Title",addItemLabel:"Add Item",editItemLabel:"Edit Item",deleteItemLabel:"Delete Item",selectedItems:new Array(),showToolbar:true,buttonList:[],initComponent:function() {
    if (this.showToolbar) {
        this.tbar = new Ext.Toolbar();
    }
    jx.grid.SimpleGridDetail.superclass.initComponent.call(this);
},loadList:function() {
    this.onLoadList();
},fillForm:function(data) {
    this.showDialog();
    this.form.setItem(data);
    this.form.setFocus();
},fillSelectedArray:function(_2a5) {
    var _2a6 = true;
    if (this.selectedItems == null) {
        this.selectedItems = new Array();
    }
    if (this.selectedItems.length == 0) {
        this.selectedItems.push(_2a5);
    } else {
        for (var _2a7 = 0; _2a7 < this.selectedItems.length; _2a7++) {
            if (this.selectedItems[_2a7] == _2a5) {
                this.selectedItems.splice(_2a7, 1);
                _2a6 = false;
            }
        }
        if (_2a6) {
            this.selectedItems.push(_2a5);
        }
    }
},addItem:function() {
    this.fillForm({});
},checkBoxItem:function(_2a8) {
    this.fillSelectedArray(_2a8.id);
},editItem:function(_2a9) {
    this.onLoadItem(_2a9.id, this.fillForm.createDelegate(this));
},deleteItem:function(_2aa) {
    var _2ab = "Are you sure you want to delete this item?";
    if (_2aa) {
        Ext.MessageBox.confirm("Confirm", _2ab, this.deleteItemConfirm.createDelegate(this, [_2aa], 0));
    }
},deleteSelectedItems:function() {
    var _2ac = "Are you sure you want to delete selected items?";
    if (this.selectedItems.length != 0) {
        Ext.MessageBox.confirm("Confirm", _2ac, this.deleteSelectedItemsConfirm.createDelegate(this, [], 0));
    } else {
        this.warnNoSelection();
    }
},deleteItemConfirm:function(_2ad, _2ae) {
    if (_2ae == "yes") {
        this.onDeleteItem(_2ad.id, {callback:this.deleteItemCallback.createDelegate(this),exceptionHandler:this.handleDeleteException.createDelegate(this)});
    }
},deleteItemCallback:function() {
    this.loadList();
},deleteSelectedItemsConfirm:function(_2af) {
    if (_2af == "yes") {
        this.onDeleteSelectedItems(this.selectedItems, {callback:this.updateItemCallback.createDelegate(this),exceptionHandler:this.handleDeleteException.createDelegate(this)});
    }
},cancelEdit:function() {
    this.hideDialog();
},saveItem:function() {
    var item = this.form.getUpdatedItem();
    this.onSaveItem(item, {callback:this.updateItemCallback.createDelegate(this),exceptionHandler:this.handleSaveException.createDelegate(this)});
},handleDeleteException:function(msg, ex) {
    Ext.MessageBox.alert("Warning", "This item can't be deleted. Other items may link to it.");
},handleSaveException:function(msg, ex) {
    var _2b5 = ex.errors;
    if (_2b5) {
        this.form.displayErrorMessages(_2b5);
    } else {
        Ext.MessageBox.alert("Error", "This item can not be saved");
    }
},warnNoSelection:function() {
    Ext.MessageBox.alert("Warning", "No item is selected");
},updateItemCallback:function() {
    this.cancelEdit();
    this.loadList();
    this.fireEvent("aftersave", this);
},onLoadItem:function(id, _2b7) {
    _2b7({});
},onSaveItem:function(item, _2b9) {
    _2b9.callback();
},onDeleteItem:function(id, _2bb) {
    _2bb.callback();
},onDeleteSelectedItems:function(ids, _2bd) {
    _2bd.callback();
},onLoadList:function() {
    this.loadData();
},onSelectItem:function(view, _2bf, _2c0, e, _2c2) {
    switch (_2c2) {
        case "edit":
            this.editItem(_2c0);
            break;
        case "delete":
            this.deleteItem(_2c0);
            break;
        case "checkbox":
            this.checkBoxItem(_2c0);
            break;
        default:
            break;
    }
},showDialog:function() {
    this.dialog.show();
},hideDialog:function() {
    this.dialog.hide();
},onRenderOther:function() {
    var tb = this.getTopToolbar();
    this.titleItem = tb.addText(this.listTitle);
    tb.addFill();
    this.buttonList.push(tb.addButton({tooltip:"Add Item",text:this.addItemLabel,icon:"img/silk/add.png",cls:"x-btn-text-icon",handler:this.addItem.createDelegate(this)}));
    this.createDialog();
},setEditable:function(flag) {
    this.editable = flag;
    for (var i = 0,len = this.buttonList.length; i < len; i++) {
        this.buttonList[i][flag ? "show" : "hide"]();
    }
},setListTitle:function(_2c6) {
    this.listTitle = _2c6;
    if (this.titleItem) {
        this.titleItem.getEl().innerHTML = _2c6;
    }
},createDialog:function() {
    this.dialog = new Ext.Window({title:this.dialogTitle,modal:true,closable:true,closeAction:"hide",width:this.dialogWidth,height:this.dialogHeight,plain:true,layout:"fit",items:{margins:"3 3 3 0",autoScroll:true,items:this.form ? this.form : {}},buttons:[{text:"Save",handler:this.saveItem,scope:this},{text:"Close",handler:this.cancelEdit,scope:this}]});
    this.dialog.render(Ext.getBody());
    if (this.form) {
        this.form.setItem({});
    }
    this.dialog.hide();
},hideDialog:function() {
    this.dialog.hide();
},toggleButtons:function(_2c7) {
    if (this.rendered) {
        this.getTopToolbar().showButtons(_2c7);
    }
},onRender:function(ct, _2c9) {
    jx.grid.SimpleGridDetail.superclass.onRender.call(this, ct, _2c9);
},beforeDestroy:function() {
    if (this.dialog) {
        Ext.destroy(this.dialog);
    }
    jx.grid.SimpleGridDetail.superclass.beforeDestroy.apply(this, arguments);
}});
Ext.namespace("jx");
Ext.namespace("jx.grid");
jx.grid.OrganizationGrid = function(_2ca) {
    Ext.applyIf(_2ca, {listTitle:"Organization List",dialogTitle:"Add/Edit Organization",addItemLabel:"Add Organization",formClass:"jamaForm",dialogWidth:600,dialogHeight:270,fieldDefinitions:this.getListDefinitions()});
    this.dataStore = jx.data.StoreFactory.buildOrganizationStore(true);
    this.form = this.createForm();
    jx.grid.OrganizationGrid.superclass.constructor.call(this, _2ca);
};
Ext.extend(jx.grid.OrganizationGrid, jx.grid.SimpleGridDetail, {filter:null,createForm:function() {
    return new jx.form.OrganizationForm({formType:"editOnly",showButtons:false});
},getListDefinitions:function() {
    return ([{field:"name",label:"Name",width:"30%"},{field:"description",label:"Description",width:"50%"},{field:"action",columnOnly:true,dataType:"action",label:"Action",sortable:false,actions:[{name:"edit",display:"Edit"},{name:"delete",display:"Delete"}]}]);
},onLoadItem:function(id, _2cc) {
    admin.getOrganization(id, _2cc);
},onSaveItem:function(item, _2ce) {
    var form = this.form;
    if (form.validate(item)) {
        admin.saveOrganization(item, _2ce);
    }
},onDeleteItem:function(id, _2d1) {
    admin.deleteOrganization({id:id}, _2d1);
},onLoadList:function() {
    this.loadData([]);
}});
Ext.reg("jx.grid.OrganizationGrid", jx.grid.OrganizationGrid);
jx.grid.LookupGrid = function(_2d2) {
    Ext.applyIf(_2d2, {listTitle:"Pick List Items",dialogTitle:"Add/Edit Item",addItemLabel:"Add Item",formClass:"jamaForm",dialogWidth:400,dialogHeight:150,fieldDefinitions:this.getListDefinitions()});
    this.dataStore = jx.data.StoreFactory.buildLookupStore();
    this.form = this.createForm();
    jx.grid.LookupGrid.superclass.constructor.call(this, _2d2);
};
Ext.extend(jx.grid.LookupGrid, jx.grid.SimpleGridDetail, {scope:null,refId:null,loadType:false,createForm:function() {
    return new jx.form.JamaForm({formType:"editOnly",showButtons:false,showTitle:false,title:"Test Jama Form",alternateRows:false,labelClass:"label",fieldDefinitions:this.getFormDefinitions()});
},getFormDefinitions:function() {
    return ([{field:"name",convertFunction:function(item) {
    },label:"Name"},{field:"description",label:"Description"}]);
},getListDefinitions:function() {
    return ([{field:"name",label:"Name",width:"30%"},{field:"description",label:"Description",width:"50%"},{field:"action",columnOnly:true,dataType:"action",label:"Action",sortable:false,actions:[{name:"edit",display:"Edit"},{name:"delete",display:"Delete"}]}]);
},onLoadItem:function(id, _2d5) {
    lookup.getLookup(id, _2d5);
},onSaveItem:function(item, _2d7) {
    if (!item.id) {
        item.lookupType = {id:this.filter};
    }
    lookup.saveLookup(item, _2d7);
},onDeleteItem:function(id, _2d9) {
    lookup.deleteLookup({id:id}, _2d9);
},onLoadList:function() {
    this.loadData([this.filter]);
    this.addButton.show();
},onRenderOther:function() {
    var tb = this.getTopToolbar();
    if (this.loadType) {
        this.titleItem = tb.addText(this.listTitle);
        tb.addText("&nbsp;&nbsp;&nbsp");
        tb.add(this.createCombo());
    } else {
        this.titleItem = tb.addText(this.listTitle);
    }
    tb.addFill();
    this.addButton = tb.addButton({tooltip:"Add Item",text:this.addItemLabel,icon:"img/silk/add.png",cls:"x-btn-text-icon",handler:this.addItem.createDelegate(this)});
    this.addButton.hide();
    this.createDialog();
},onChangeLookupType:function(_2db) {
    this.filter = _2db.getValue();
    this.loadList();
},loadTypeList:function() {
    this.lookupTypeStore.load({arg:[this.scope,this.refId]});
},createCombo:function() {
    this.lookupTypeStore = jx.data.StoreFactory.buildLookupTypeStore();
    var _2dc = new Ext.form.ComboBox({store:this.lookupTypeStore,displayField:"name",valueField:"id",mode:"local",triggerAction:"all",emptyText:"Select a type...",selectOnFocus:true,editable:false});
    _2dc.on("select", this.onChangeLookupType, this);
    return _2dc;
}});
Ext.reg("jx.grid.LookupGrid", jx.grid.LookupGrid);
jx.grid.LookupTypeGrid = function(_2dd) {
    Ext.applyIf(_2dd, {listTitle:"Pick Lists",dialogTitle:"Add/Edit Pick List",addItemLabel:"Add Pick List",dialogWidth:400,dialogHeight:150,fieldDefinitions:this.getListDefinitions()});
    this.dataStore = jx.data.StoreFactory.buildLookupTypeStore();
    this.form = this.createForm();
    jx.grid.LookupTypeGrid.superclass.constructor.call(this, _2dd);
};
Ext.extend(jx.grid.LookupTypeGrid, jx.grid.SimpleGridDetail, {createForm:function() {
    return new jx.form.JamaForm({formType:"editOnly",showButtons:false,showTitle:false,title:"Test Jama Form",alternateRows:false,labelClass:"label",fieldDefinitions:this.getFormDefinitions()});
},getFormDefinitions:function() {
    return ([{field:"name",convertFunction:function(item) {
    },label:"Name"},{field:"description",label:"Description"}]);
},getListDefinitions:function() {
    return ([{field:"name",label:"Name",width:"30%"},{field:"description",label:"Description",width:"50%"},{field:"action",columnOnly:true,dataType:"action",label:"Action",sortable:false,actions:[{name:"edit",display:"Edit"},{name:"config",display:"Config"},{name:"delete",display:"Delete"}]}]);
},onSelectItem:function(view, _2e0, _2e1, e, _2e3) {
    if (_2e3 == "edit") {
        this.editItem(_2e1);
    } else {
        if (_2e3 == "delete") {
            this.deleteItem(_2e1);
        } else {
            if (_2e3 == "config") {
                this.onConfigItem(_2e1);
            }
        }
    }
},onConfigItem:function(_2e4) {
    this.fireEvent("configItem", _2e4);
},onLoadItem:function(id, _2e6) {
    lookup.getLookupType(id, _2e6);
},onSaveItem:function(item, _2e8) {
    if (!item.id) {
        item.scope = 2;
        item.refId = this.filter;
    }
    lookup.saveLookupType(item, _2e8);
},onDeleteItem:function(id, _2ea) {
    lookup.deleteLookupType(id, _2ea);
},onLoadList:function() {
    this.loadData([this.scope,this.filter]);
}});
Ext.reg("jx.grid.LookupTypeGrid", jx.grid.LookupTypeGrid);
jx.grid.PermissionGrid = function(_2eb) {
    Ext.applyIf(_2eb, {listTitle:i18n.g("j.l.permTableTitle"),dialogTitle:i18n.g("j.l.permAddGroupTitle"),addItemLabel:i18n.g("j.b.permAddGroup"),formClass:"jamaForm",dialogWidth:400,dialogHeight:200,sortable:false,autoScroll:true,fieldDefinitions:this.getListDefinitions()});
    this.dataStore = jx.data.StoreFactory.buildPermissionStore();
    this.form = this.createForm();
    jx.grid.PermissionGrid.superclass.constructor.call(this, _2eb);
};
Ext.extend(jx.grid.PermissionGrid, jx.grid.SimpleGridDetail, {loadProject:false,projectStore:null,data:null,checkImg:"<img src=\"img/mini/check.gif\" align=\"absmiddle\" />",NOTHING:0,ADMINISTRATION:1,READ:2,WRITE:4,CREATE:8,DELETE:16,createForm:function() {
    return new jx.form.JamaForm({formType:"editOnly",showButtons:false,showTitle:false,title:"Test Jama Form",alternateRows:false,labelClass:"label",fieldDefinitions:this.getFormDefinitions()});
},fillForm:function(data) {
    this.showDialog();
    this.loadRoleOptions();
    this.form.setItem(data);
    this.form.setFocus();
},getFormDefinitions:function() {
    return ([{field:"role",label:i18n.g("j.l.permGroup"),dataType:"lookup",idField:"id",displayField:"display",options:[]},{field:"mask",label:i18n.g("j.l.permPermissions"),dataType:"multiCheckboxes",returnIds:true,options:this.getPermissionOptions(),mapping:this.covertMaskIntoArray.createDelegate(this)}]);
},loadRoleOptions:function() {
    var self = this;
    var org = this.getAppContext().getOrganization();
    user.getRoleListByOrgId(org.id, {callback:function(list) {
        self.roleList = list;
    },async:false});
    var meta = this.form.getFieldMeta("role");
    meta.options = this.roleList;
},getPermissionOptions:function() {
    return [{id:this.ADMINISTRATION,name:"Administration"},{id:this.WRITE,name:"Write"},{id:this.READ,name:"Read"}];
},getListDefinitions:function() {
    return ([{field:"role",label:i18n.g("j.l.permGroup"),width:"20%",renderer:function(_2f1, _2f2, _2f3) {
        return _2f1.display;
    }},{field:"admin",label:i18n.g("j.l.permAdmin"),width:"20%",renderer:this.getAdmin.createDelegate(this)},{field:"write",label:i18n.g("j.l.permWrite"),width:"20%",renderer:this.getWrite.createDelegate(this)},{field:"read",label:i18n.g("j.l.permRead"),width:"20%",renderer:this.getRead.createDelegate(this)},{field:"action",columnOnly:true,dataType:"action",label:i18n.g("j.l.permAction"),actions:[{name:"edit",display:i18n.g("j.l.permEdit")},{name:"delete",display:i18n.g("j.l.permDelete")}]}]);
},covertMaskIntoArray:function(item) {
    var mask = item.mask;
    var _2f6 = [];
    var v = 1;
    while (mask > 0) {
        if (mask % 2 == 1) {
            _2f6.push(v);
        }
        v = 2 * v;
        mask = Math.floor(mask / 2);
    }
    return _2f6;
},getAdmin:function(_2f8, _2f9, item) {
    return this.getPermIndicator(item.data.mask, this.ADMINISTRATION);
},getRead:function(_2fb, _2fc, item) {
    return this.getPermIndicator(item.data.mask, this.READ);
},getWrite:function(_2fe, _2ff, item) {
    return this.getPermIndicator(item.data.mask, this.WRITE);
},getPermIndicator:function(mask, _302) {
    if (this.isPermitted(mask, _302)) {
        return this.checkImg;
    } else {
        return "";
    }
},isPermitted:function(_303, _304) {
    return ((_303 & _304) == _304);
},getProjectIdentity:function() {
    return "com.jamasoftware.contour.domain.Project:" + this.filter;
},onLoadItem:function(id, _306) {
    acl.getAclPermission(id, _306);
},onSaveItem:function(item, _308) {
    if (!item.id) {
        item.aclObject = {identity:this.getProjectIdentity()};
    }
    var v = 0;
    var mask = item.mask;
    for (var i = 0; i < mask.length; i++) {
        v += parseInt(mask[i], 10);
    }
    item.mask = v;
    if (this.validate(item, this.form)) {
        this.form.clearErrorMessages();
        acl.saveAclPermission(item, _308);
    }
},validate:function(item, form) {
    var _30e = [];
    if (!item.role) {
        _30e.push(i18n.g("j.m.permGroupRequired"));
    }
    if (!item.mask) {
        _30e.push(i18n.g("j.m.permPermissionRequired"));
    }
    if (_30e && _30e.length > 0) {
        form.displayErrorMessages(_30e);
        return false;
    }
    return true;
},onDeleteItem:function(id, _310) {
    acl.deleteAclPermissionById(id, _310);
},onLoadList:function() {
    this.loadData([this.getProjectIdentity()]);
    this.addButton.show();
},onRenderOther:function() {
    var tb = this.getTopToolbar();
    if (this.loadProject) {
        this.titleItem = tb.addText(this.listTitle);
        tb.addText("&nbsp;&nbsp;&nbsp");
        tb.add(this.createCombo());
    } else {
        this.titleItem = tb.addText(this.listTitle);
    }
    tb.addFill();
    this.addButton = tb.addButton({tooltip:i18n.g("j.tt.permAddGroup"),text:this.addItemLabel,icon:"img/silk/add.png",cls:"x-btn-text-icon",handler:this.addItem.createDelegate(this)});
    this.addButton.hide();
    this.createDialog();
},onChangeProject:function(_312) {
    this.filter = _312.getValue();
    this.loadList();
},loadProjectList:function() {
    this.projectStore.load({arg:[0,0,0,""]});
},createCombo:function() {
    this.projectStore = jx.data.StoreFactory.buildProjectStore();
    var _313 = new Ext.form.ComboBox({store:this.projectStore,displayField:"name",valueField:"id",mode:"local",triggerAction:"all",emptyText:i18n.g("j.l.permSelectProject"),selectOnFocus:true,width:200,editable:false});
    _313.on("select", this.onChangeProject, this);
    return _313;
},render:function() {
    jx.grid.PermissionGrid.superclass.render.apply(this, arguments);
    if (!this.loadProject) {
        this.filter = this.data.project.id;
        this.loadList();
    } else {
        this.loadProjectList();
    }
    this.loadRoleOptions();
}});
Ext.reg("jx.grid.PermissionGrid", jx.grid.PermissionGrid);
jx.grid.UserGroupGrid = function(_314) {
    Ext.applyIf(_314, {listTitle:"User Groups",dialogTitle:"Add/Edit Group",addItemLabel:"Add Group",formClass:"jamaForm",dialogWidth:400,dialogHeight:200,autoScroll:true,fieldDefinitions:this.getListDefinitions()});
    this.dataStore = jx.data.StoreFactory.buildRoleStore();
    this.form = this.createForm();
    jx.grid.UserGroupGrid.superclass.constructor.call(this, _314);
};
Ext.extend(jx.grid.UserGroupGrid, jx.grid.SimpleGridDetail, {filter:null,createForm:function() {
    return new jx.form.JamaForm({formType:"editOnly",showButtons:false,showTitle:false,title:"Test Jama Form",alternateRows:false,labelClass:"label",fieldDefinitions:this.getFormDefinitions()});
},getFormDefinitions:function() {
    return ([{field:"name",convertFunction:function(item) {
    },label:"Name",required:true},{field:"display",label:"Display",required:true},{field:"description",label:"Description"}]);
},getListDefinitions:function() {
    return ([{field:"name",label:"Name",width:"20%",required:true},{field:"display",label:"Display",width:"20%",required:true},{field:"description",label:"Description",width:"40%"},{field:"action",columnOnly:true,dataType:"action",label:"Action",sortable:false,actions:[{name:"edit",display:"Edit"},{name:"delete",display:"Delete"}]}]);
},onLoadItem:function(id, _317) {
    user.getRole(id, _317);
},onSaveItem:function(item, _319) {
    if (!item.id) {
        item.organizationId = this.filter;
    }
    if (this.validate(item, this.form)) {
        this.form.clearErrorMessages();
        user.saveRole(item, _319);
    }
},onDeleteItem:function(id, _31b) {
    user.deleteRole({roleId:id}, _31b);
},validate:function(item, form) {
    var self = this;
    validation.validateRole(item, {callback:function(_31f) {
        self.errors = _31f;
    },async:false});
    if (this.errors && this.errors.length > 0) {
        form.displayErrorMessages(this.errors);
        return false;
    }
    return true;
},onLoadList:function() {
    this.loadData([this.filter]);
}});
Ext.reg("jx.grid.UserGroupGrid", jx.grid.UserGroupGrid);
jx.grid.UserGrid = function(_320) {
    Ext.applyIf(_320, {listTitle:"User List",dialogTitle:"Add/Edit User",addItemLabel:"Add User",editItemLabel:"Edit User",deleteItemLabel:"Delete User",formClass:"jamaForm",autoScroll:true,dialogWidth:600,dialogHeight:550,fieldDefinitions:this.getListDefinitions()});
    this.dataStore = jx.data.StoreFactory.buildUserStore();
    this.form = this.createForm();
    jx.grid.UserGrid.superclass.constructor.call(this, _320);
};
Ext.extend(jx.grid.UserGrid, jx.grid.SimpleGridDetail, {orgId:null,loadOrg:false,useLdap:false,createForm:function() {
    return new jx.form.UserForm({orgId:this.orgId});
},getListDefinitions:function() {
    var _321 = [{id:"N",name:"Named User"},{id:"C",name:"Concurrent User"},{id:"R",name:"Read Only"}];
    return ([{field:"userName",label:"User Name",width:"15%"},{field:"firstName",label:"First Name",width:"15%"},{field:"lastName",label:"Last Name",width:"15%"},{field:"email",label:"Email",width:"20%"},{field:"disabled",label:"Active",width:"5%",renderer:function(_322, _323, _324) {
        return !_324.data.disabled;
    }},{field:"licenseType",label:"License Type",dataType:"lookup",width:"5%",options:_321},{field:"action",columnOnly:true,dataType:"action",label:"Action",sortable:false,renderer:this.actionRenderer.createDelegate(this)}]);
},actionRenderer:function(_325, _326, _327) {
    var _328 = [];
    _328.push({name:"edit",display:"Edit"});
    if (!this.useLdap) {
        _328.push({name:"password",display:"Edit Password"});
    }
    if (_327.data.disabled) {
        _328.push({name:"activate",display:"Activate"});
    } else {
        _328.push({name:"deactivate",display:"Deactivate"});
    }
    return this.createActionHtml(_328);
},fillForm:function(data) {
    this.form.clearErrorMessages();
    this.showDialog();
    if (data.id) {
        this.form.refreshForm("profile");
    } else {
        this.form.refreshForm("new");
        data.licenseType = {id:"R",name:"Read Only"};
        data.theme = "Contour_Default_Theme";
    }
    this.form.setItem(data);
    this.form.setFocus();
},onSelectItem:function(view, _32b, _32c, e, _32e) {
    if (_32e == "edit") {
        this.editItem(_32c);
    } else {
        if (_32e == "deactivate") {
            this.deactivateItem(_32c);
        } else {
            if (_32e == "activate") {
                this.activateItem(_32c);
            } else {
                if (_32e == "password") {
                    this.editPassword(_32c);
                }
            }
        }
    }
},deactivateItem:function(_32f) {
    user.deactivateUser({id:_32f.id}, {callback:this.loadList.createDelegate(this),errorHandler:this.handleDeactivateException.createDelegate(this)});
},activateItem:function(_330) {
    user.activateUser({id:_330.id}, {callback:this.loadList.createDelegate(this),errorHandler:this.handleDeactivateException.createDelegate(this)});
},handleDeactivateException:function(msg, ex) {
    Ext.MessageBox.alert("Warning", "This item can't be deleted. Cause: " + msg);
},editPassword:function(_333) {
    this.passwordDialog.show();
    this.passwordForm.setItem({});
    this.passwordForm.record = _333;
},updatePassword:function() {
    var item = this.passwordForm.getUpdatedItem();
    var _335 = this.passwordForm.record;
    item.id = _335.id;
    item.userName = _335.data.userName;
    if (this.validatePassword(item, this.passwordForm)) {
        this.passwordForm.clearErrorMessages();
        user.updateUserPassword(item, this.updatePasswordCallback.createDelegate(this));
    }
},updatePasswordCallback:function() {
    this.passwordDialog.hide();
    this.loadList();
},validatePassword:function(item, form) {
    var _338 = [];
    if (!item.password) {
        _338.push("Password is required.");
    }
    if (!item.repeatedPassword) {
        _338.push("Repeated Password is required.");
    }
    if (item.password != item.repeatedPassword) {
        _338.push("Repeated password does not agree with password");
    }
    if (_338 && _338.length > 0) {
        form.displayErrorMessages(_338);
        return false;
    }
    return true;
},validate:function(item, form) {
    var self = this;
    validation.validateUser(item, {callback:function(_33c) {
        self.errors = _33c;
    },async:false});
    if (this.errors && this.errors.length > 0) {
        form.displayErrorMessages(this.errors);
        return false;
    }
    return true;
},onLoadItem:function(id, _33e) {
    user.getUserWithRoles(id, _33e);
},onSaveItem:function(item, _340) {
    if (!item.id) {
        item.organization = {id:this.orgId};
        item.theme = item.theme ? item.theme.name : "";
        item.locale = item.locale ? item.locale.name : "";
        item.visible = true;
        item.system = false;
    } else {
        item.theme = item.theme ? item.theme.name : "";
        item.locale = item.locale ? item.locale.name : "";
        item.repeatedPassword = item.password;
    }
    if (this.validate(item, this.form)) {
        this.form.clearErrorMessages();
        if (!item.id) {
            user.saveUser(item, _340);
        } else {
            user.updateUserProfile(item, _340);
        }
    }
},onDeleteItem:function(id, _342) {
},onLoadList:function() {
    this.loadData([this.orgId]);
    this.addButton.show();
},closePasswordDialog:function() {
    this.passwordDialog.hide();
},addPasswordForm:function() {
    this.passwordDialog.add(this.passwordForm);
},createPasswordDialog:function() {
    this.passwordDialog = new Ext.Window({title:"Edit Password",modal:true,closable:true,closeAction:"hide",width:400,height:160,plain:true,layout:"fit",items:{margins:"3 3 3 0",autoScroll:true,items:this.createPasswordForm()},buttons:[{text:"Cancel",handler:this.closePasswordDialog,scope:this},{text:"Update",handler:this.updatePassword,scope:this}]});
    this.passwordDialog.render(Ext.getBody());
},createPasswordForm:function() {
    var _343 = [{field:"password",label:"Password",inputType:"password"},{field:"repeatedPassword",label:"Retype Password",inputType:"password"}];
    this.passwordForm = new jx.form.JamaForm({formType:"editOnly",showButtons:false,showTitle:false,title:"Test Jama Form",alternateRows:false,labelClass:"label",fieldDefinitions:_343});
    return this.passwordForm;
},onRenderOther:function() {
    var tb = this.getTopToolbar();
    if (this.loadOrg) {
        this.titleItem = tb.addText(this.listTitle);
        tb.addText("&nbsp;&nbsp;&nbsp");
        tb.add(this.createCombo());
    } else {
        this.titleItem = tb.addText(this.listTitle);
    }
    tb.addFill();
    this.addButton = tb.addButton({tooltip:"Add User",text:this.addItemLabel,icon:"img/silk/add.png",cls:"x-btn-text-icon",handler:this.addUser.createDelegate(this)});
    this.addButton.hide();
    this.createDialog();
    this.createPasswordDialog();
    this.setUseLdap(this.useLdap);
},addUser:function() {
    if (this.useLdap) {
        this.fireEvent("addLdapUser", this.orgId);
    } else {
        this.addItem();
    }
},createCombo:function() {
    this.orgStore = jx.data.StoreFactory.buildOrganizationStore(true);
    var _345 = new Ext.form.ComboBox({store:this.orgStore,displayField:"name",valueField:"id",mode:"local",triggerAction:"all",emptyText:"Select an organization...",selectOnFocus:true,editable:false});
    _345.on("select", this.onChangeOrganization, this);
    return _345;
},onChangeOrganization:function(_346) {
    this.setOrgId(_346.getValue());
    this.loadList();
},setOrgId:function(_347) {
    this.orgId = _347;
    this.form.orgId = _347;
},setUseLdap:function(_348) {
    this.useLdap = _348;
    this.addButton.setText(_348 ? "Add User from LDAP" : "Add User");
},loadOrgList:function() {
    this.orgStore.load();
},render:function() {
    jx.grid.UserGrid.superclass.render.apply(this, arguments);
    if (this.orgId) {
        this.setOrgId(this.orgId);
        this.loadList();
    }
},beforeDestroy:function() {
    if (this.passwordDialog) {
        Ext.destroy(this.passwordDialog);
    }
    jx.grid.UserGrid.superclass.beforeDestroy.apply(this, arguments);
}});
Ext.reg("jx.grid.UserGrid", jx.grid.UserGrid);
jx.grid.ItemTypeGrid = function(_349) {
    Ext.applyIf(_349, {listTitle:"Item Types",dialogTitle:"Add/Edit Type",addItemLabel:"Add Type",dialogWidth:400,dialogHeight:350,fieldDefinitions:this.getListDefinitions()});
    this.dataStore = jx.data.StoreFactory.buildDocumentTypeStore();
    this.form = this.createForm();
    jx.grid.ItemTypeGrid.superclass.constructor.call(this, _349);
};
Ext.extend(jx.grid.ItemTypeGrid, jx.grid.SimpleGridDetail, {createForm:function() {
    return new jx.form.JamaForm({formType:"editOnly",showButtons:false,showTitle:false,title:"Test Jama Form",alternateRows:false,labelClass:"label",fieldDefinitions:this.getFormDefinitions()});
},getFormDefinitions:function() {
    var _34a = [{id:"history",name:"History"},{id:"comment",name:"Comments"},{id:"relationship",name:"Relationship"},{id:"attachment",name:"Attachment"},{id:"tag",name:"Tag"},{id:"testHistory",name:"Test History"},{id:"selenium",name:"Selenium Test"}];
    var _34b = [{field:"name",convertFunction:function(item) {
    },label:"Name"},{field:"description",label:"Description"},{field:"components",label:"Components",dataType:"multiCheckboxes",returnString:true,options:_34a}];
    return _34b;
},getListDefinitions:function() {
    return ([{field:"name",label:"Name",width:"30%"},{field:"description",label:"Description",width:"50%"},{field:"action",columnOnly:true,sortable:false,dataType:"action",label:"Action",actions:[{name:"edit",display:"Edit"},{name:"config",display:"Config"},{name:"delete",display:"Delete"}]}]);
},handleDeleteException:function(msg, ex) {
    Ext.MessageBox.alert("Warning", "This item can't be deleted. Possible reason is that a project is using this type. Remove the project or the groups in the project. More details regarding this error have been appended to the server logs.");
},onSelectItem:function(view, _350, _351, e, _353) {
    if (_353 == "edit") {
        this.editItem(_351);
    } else {
        if (_353 == "delete") {
            this.deleteItem(_351);
        } else {
            if (_353 == "config") {
                this.onConfigItem(_351);
            }
        }
    }
},onConfigItem:function(_354) {
    this.fireEvent("configItem", _354);
},onLoadItem:function(id, _356) {
    documentTypeSvc.getDocumentType(id, _356);
},onSaveItem:function(item, _358) {
    if (!item.id) {
        item.scope = 2;
        item.refId = this.filter;
    }
    documentTypeSvc.saveDocumentType(item, _358);
},onDeleteItem:function(id, _35a) {
    documentTypeSvc.deleteDocumentType(id, _35a);
},onLoadList:function() {
    this.loadData([2,this.filter]);
}});
Ext.reg("jx.grid.ItemTypeGrid", jx.grid.ItemTypeGrid);
jx.grid.ItemTypeFieldGrid = function(_35b) {
    Ext.applyIf(_35b, {listTitle:"Item Type Fields",dialogTitle:"Add/Edit Field",addItemLabel:"Add Field",formClass:"jamaForm",dialogWidth:400,dialogHeight:350});
    this.dataStore = jx.data.StoreFactory.buildDocumentTypeFieldStore();
    this.sortable = false;
    jx.grid.ItemTypeFieldGrid.superclass.constructor.call(this, _35b);
    this.form = this.createForm();
    this.on("beforerender", this.beforeRender, this);
};
Ext.extend(jx.grid.ItemTypeFieldGrid, jx.grid.SimpleGridDetail, {orgId:null,createForm:function() {
    return new jx.form.JamaForm({formType:"editOnly",showButtons:false,showTitle:false,title:"Test Jama Form",alternateRows:false,labelClass:"label",fieldDefinitions:this.getFormDefinitions()});
},getFormDefinitions:function(item) {
    var self = this;
    lookup.getLookupTypeList(2, this.orgId, {callback:function(_35e) {
        self.lookupTypeOptions = _35e;
    },async:false});
    var _35f = [{field:"sortOrder",label:"Order",readOnly:true},{field:"documentField",label:"Datbase Field",dataType:"Lookup",readOnly:true},{field:"label",label:"Label"},{field:"documentField.dataTypeId",label:"Field Type",readOnly:true,dataType:"Integer",options:this.fieldDataTypeOptions},{field:"description",label:"Description"},{field:"readOnly",label:"Read Only",dataType:"boolean"},{field:"showInFolder",label:"Display in Folder",dataType:"boolean"},{field:"showInList",label:"Display in Grid",dataType:"boolean"}];
    if (item && item.documentField.dataTypeId == 3) {
        _35f.push({field:"controlTypeId",label:"Control",dataType:"Integer",options:this.fieldControlOptions});
    }
    if (item && item.documentField.dataTypeId == 4) {
        _35f.push({field:"lookupTypeId",label:"Pick List",dataType:"lookup",options:this.lookupTypeOptions});
    }
    return _35f;
},getListDefinitions:function() {
    var self = this;
    return ([{field:"sortOrder",label:"Order"},{field:"documentField1",label:"Field",renderer:function(_361, _362, _363) {
        return _363.data.documentField ? _363.data.documentField.name : "";
    }},{field:"label",label:"Label"},{field:"documentField",label:"Field Type",dataType:"lookup",renderer:this.fieldTypeRenderer.createDelegate(this)},{field:"controlTypeId",label:"Control",dataType:"lookup",renderer:this.lookupTypeRenderer.createDelegate(this)},{field:"lookupTypeId",label:"Pick List",dataType:"lookup",options:this.lookupTypeOptions},{field:"readOnly",label:"Read Only",dataType:"boolean"},{field:"showInFolder",label:"Show in Folder",dataType:"boolean"},{field:"showInList",label:"Show in List",dataType:"boolean"},{field:"action",renderer:this.actionRenderer.createDelegate(this),label:"Action"}]);
},fieldTypeRenderer:function(_364, _365, _366) {
    var id = _364 ? _364.dataTypeId : "";
    var _368 = this.getLookup(this.fieldDataTypeOptions, id);
    return _368 ? _368.name : "";
},lookupTypeRenderer:function(_369, _36a, _36b) {
    var id = _369 ? _369.dataTypeId : "";
    var _36d = this.getLookup(this.lookupTypeOptions, id);
    return _36d ? _36d.name : "";
},actionRenderer:function(_36e, _36f, _370) {
    var item = _370.data;
    var _372 = this.getFieldCount();
    return "<a href=\"javascript:void(0)\" class=\"j-action-edit\">Edit</a>&nbsp;" + (item.sortOrder > 1 ? "|&nbsp;<a href=\"javascript:void(0)\" class=\"j-action-moveUp\">Up</a>&nbsp;" : "") + (item.sortOrder < _372 ? "|&nbsp;<a href=\"javascript:void(0)\" class=\"j-action-moveDown\">Down</a>&nbsp;" : "") + "|&nbsp;<a href=\"javascript:void(0)\" class=\"j-action-delete\">Remove</a>";
},getFieldCount:function() {
    return this.dataStore.getCount();
},onRenderOther:function() {
    var tb = this.getTopToolbar();
    this.titleItem = tb.addText(this.listTitle);
    tb.addFill();
    this.fieldOptionsNode = document.createElement("select");
    var _374 = tb.addElement(this.fieldOptionsNode);
    tb.addButton({tooltip:"Add Item",text:this.addItemLabel,icon:"img/silk/add.png",cls:"x-btn-text-icon",handler:this.addItem.createDelegate(this)});
    this.createDialog();
    this.dataStore.on("load", this.fillFieldOptions, this);
},beforeRender:function() {
    var self = this;
    documentTypeSvc.getDocumentFieldList({callback:function(_376) {
        self.fieldOptions = _376;
    },async:false});
    documentTypeSvc.getFieldControlList({callback:function(_377) {
        self.fieldControlOptions = _377;
    },async:false});
    lookup.getLookupTypeList(2, this.orgId, {callback:function(_378) {
        self.lookupTypeOptions = _378;
    },async:false});
    documentTypeSvc.getFieldDataTypeList({callback:function(_379) {
        self.fieldDataTypeOptions = _379;
    },async:false});
    this.setFieldDefinitions(this.getListDefinitions());
},onSelectItem:function(view, _37b, _37c, e, _37e) {
    if (_37e == "edit") {
        this.editItem(_37c);
    } else {
        if (_37e == "delete") {
            this.deleteItem(_37c);
        } else {
            if (_37e == "moveDown" || _37e == "moveUp") {
                var _37f = this.dataStore;
                var _380 = _37c.id;
                var _381 = (_37e == "moveDown") ? _37b + 1 : _37b - 1;
                if (_381 >= 0 && _37f.getAt(_381)) {
                    var _382 = _37f.getAt(_381).id;
                    this.targetIndex = _381;
                    this.onSwitchSortOrders(_380, _382);
                }
            }
        }
    }
},onSwitchSortOrders:function(_383, _384) {
    documentTypeSvc.switchSortOrders(_383, _384, this.loadList.createDelegate(this));
},fillForm:function(data) {
    if (!data.id) {
        var _386 = this.getLookup(this.fieldOptions, this.fieldOptionsNode.value);
        data = {sortOrder:this.getFieldCount() + 1,label:_386 ? _386.name : "",documentField:_386};
    }
    this.form.setFieldDefinitions(this.getFormDefinitions(data));
    this.form.setItem(data);
    this.showDialog();
},fillFieldOptions:function(view, _388) {
    var _389 = this.getAvalaibleFields(_388, this.fieldOptions);
    dwr.util.removeAllOptions(this.fieldOptionsNode);
    dwr.util.addOptions(this.fieldOptionsNode, _389, "id", "name");
    if (this.targetIndex != null && this.targetIndex != undefined) {
        this.view.select(parseInt(this.targetIndex, 10));
        this.targetIndex = null;
    }
},getAvalaibleFields:function(_38a, _38b) {
    var ids = {};
    for (var i = 0; i < _38a.length; i++) {
        var _38e = _38a[i];
        ids[_38e.data.documentField.id] = true;
    }
    var _38f = [];
    for (var j = 0; j < _38b.length; j++) {
        var _391 = _38b[j];
        if (!ids[_391.id]) {
            _38f.push(_391);
        }
    }
    return _38f;
},onSaveItem:function(item, _393) {
    if (!item.id) {
        item.documentType = {id:this.filter};
    }
    if (item.lookupTypeId) {
        item.lookupTypeId = item.lookupTypeId.id;
    }
    documentTypeSvc.saveDocumentTypeField(item, _393);
},onDeleteItem:function(id, _395) {
    documentTypeSvc.deleteDocumentTypeField(id, _395);
},onLoadItem:function(id, _397) {
    documentTypeSvc.getDocumentTypeField(id, _397);
},onLoadList:function() {
    this.loadData([this.filter]);
}});
Ext.reg("jx.grid.ItemTypeFieldGrid", jx.grid.ItemTypeFieldGrid);
jx.grid.ReleaseGrid = function(_398) {
    Ext.applyIf(_398, {listTitle:"Release List",dialogTitle:"Add/Edit Release",addItemLabel:"Add Release",formClass:"jamaForm",dialogWidth:400,dialogHeight:200,fieldDefinitions:this.getListDefinitions()});
    this.dataStore = jx.data.StoreFactory.buildReleaseStore();
    jx.grid.ReleaseGrid.superclass.constructor.call(this, _398);
    this.form = this.createForm();
};
Ext.extend(jx.grid.ReleaseGrid, jx.grid.SimpleGridDetail, {data:null,createForm:function() {
    return new jx.form.JamaForm({formType:"editOnly",showButtons:false,showTitle:false,title:"",alternateRows:false,labelClass:"label",defaultDateFormat:this.defaultDateFormat,fieldDefinitions:this.getFormDefinitions()});
},getFormDefinitions:function() {
    return ([{field:"name",label:"Name",required:true},{field:"description",label:"Description"},{field:"releaseDate",label:"Release Date",dataType:"date",required:true,format:this.getAppContext().getDayMonthYearFormat()}]);
},getListDefinitions:function() {
    return ([{field:"name",label:"Name",width:"20%"},{field:"description",label:"Description",width:"40%"},{field:"releaseDate",label:"Release Date",dataType:"date",width:"20%"},{field:"action",columnOnly:true,dataType:"action",label:"Action",sortable:false,actions:[{name:"edit",display:"Edit"},{name:"delete",display:"Delete"}]}]);
},onLoadItem:function(id, _39a) {
    releaseSvc.getRelease(id, _39a);
},onSaveItem:function(item, _39c) {
    if (this.validate(item, this.form)) {
        this.form.clearErrorMessages();
        releaseSvc.saveProjectRelease(this.getProjectId(), item, _39c);
    }
},validate:function(item, form) {
    var self = this;
    validation.validateRelease(item, {callback:function(_3a0) {
        self.errors = _3a0;
    },async:false});
    if (this.errors && this.errors.length > 0) {
        form.displayErrorMessages(this.errors);
        return false;
    }
    return true;
},onDeleteItem:function(id, _3a2) {
    releaseSvc.deleteRelease(id, this.getProjectId(), _3a2);
},onLoadList:function() {
    this.loadData([this.getProjectId()]);
},getProjectId:function() {
    return this.data ? this.data.project.id : null;
},handleDeleteException:function(msg, ex) {
    Ext.MessageBox.alert("Warning", "This release can't be deleted. Other items may link to it.");
}});
Ext.reg("jx.grid.ReleaseGrid", jx.grid.ReleaseGrid);
jx.grid.EmailGroupGrid = function(_3a5) {
    Ext.applyIf(_3a5, {listTitle:"Email Groups",dialogTitle:"Add/Edit Email Group",addItemLabel:"Add Email Group",formClass:"jamaForm",dialogWidth:400,dialogHeight:300,fieldDefinitions:this.getListDefinitions()});
    this.dataStore = jx.data.StoreFactory.buildDistributionGroupStore();
    this.form = this.createForm();
    jx.grid.EmailGroupGrid.superclass.constructor.call(this, _3a5);
};
Ext.extend(jx.grid.EmailGroupGrid, jx.grid.SimpleGridDetail, {loadType:false,data:null,createForm:function() {
    return new jx.form.JamaForm({formType:"editOnly",showButtons:false,showTitle:false,title:"Test Jama Form",alternateRows:false,labelClass:"label",fieldDefinitions:this.getFormDefinitions()});
},getFormDefinitions:function() {
    return ([{field:"name",convertFunction:function(item) {
    },label:"Name"},{field:"description",label:"Description"},{field:"users",label:"Users",options:[],dataType:"multiCheckboxes"}]);
},getListDefinitions:function() {
    return ([{field:"name",label:"Name",width:"30%"},{field:"description",label:"Description",width:"50%"},{field:"action",sortable:false,columnOnly:true,dataType:"action",label:"Action",actions:[{name:"edit",display:"Edit"},{name:"delete",display:"Delete"}]}]);
},loadUserOptions:function() {
    var self = this;
    user.getVisibleUserInfoDtoList({callback:function(list) {
        self.userList = list;
    },async:false});
    var meta = this.form.getFieldMeta("users");
    meta.options = this.userList;
},onLoadItem:function(id, _3ab) {
    distributionGroup.getDistributionGroup(id, _3ab);
},onSaveItem:function(item, _3ad) {
    if (!item.id) {
        item.project = {id:this.getProjectId()};
    }
    distributionGroup.saveDistributionGroup(item, _3ad);
},onDeleteItem:function(id, _3af) {
    distributionGroup.deleteDistributionGroup(id, _3af);
},onLoadList:function() {
    if (this.getProjectId()) {
        this.loadData([this.getProjectId()]);
    }
},getProjectId:function() {
    return this.data ? this.data.project.id : null;
}});
Ext.reg("jx.grid.EmailGroupGrid", jx.grid.EmailGroupGrid);
jx.grid.BaselineGrid = function(_3b0) {
    Ext.applyIf(_3b0, {listTitle:"Baseline Lists",dialogTitle:"Add/Edit Baseline",addItemLabel:"Add Baseline",dialogWidth:400,dialogHeight:150,fieldDefinitions:this.getListDefinitions()});
    this.dataStore = jx.data.StoreFactory.buildBaselineStore();
    this.form = this.createForm();
    jx.grid.BaselineGrid.superclass.constructor.call(this, _3b0);
};
Ext.extend(jx.grid.BaselineGrid, jx.grid.SimpleGridDetail, {data:null,project:null,createForm:function() {
    return new jx.form.JamaForm({formType:"editOnly",showButtons:false,showTitle:false,title:"Test Jama Form",alternateRows:false,labelClass:"label",fieldDefinitions:this.getFormDefinitions()});
},getFormDefinitions:function() {
    return ([{field:"name",convertFunction:function(item) {
    },label:"Name"},{field:"description",label:"Description"}]);
},getListDefinitions:function() {
    return ([{field:"name",label:"Name",width:"30%"},{field:"description",label:"Description",width:"50%"},{field:"action",columnOnly:true,dataType:"action",label:"Action",sortable:false,actions:[{name:"edit",display:"Edit"},{name:"delete",display:"Delete"}]}]);
},onLoadItem:function(id, _3b3) {
    baseLine.getBaseLine(id, _3b3);
},onSaveItem:function(item, _3b5) {
    if (!item.id) {
        item.project = {id:this.project.id};
    }
    baseLine.saveBaseLine(item, _3b5);
},onDeleteItem:function(id, _3b7) {
    baseLine.deleteBaseLine(id, _3b7);
},onLoadList:function() {
    this.loadData([this.project.id]);
},loadProject:function(_3b8) {
    this.project = _3b8;
    this.loadList();
},render:function() {
    jx.grid.BaselineGrid.superclass.render.apply(this, arguments);
    if (this.data) {
        this.loadProject(this.data.project);
    }
}});
Ext.reg("jx.grid.BaselineGrid", jx.grid.BaselineGrid);
jx.grid.ProjectAttachmentGrid = function(_3b9) {
    Ext.applyIf(_3b9, {loadMask:true,fieldDefinitions:this.getListDefinitions()});
    this.dataStore = jx.data.StoreFactory.buildProjectAttachmentStore();
    jx.grid.ProjectAttachmentGrid.superclass.constructor.call(this, _3b9);
};
Ext.extend(jx.grid.ProjectAttachmentGrid, jx.grid.SimpleGridDetail, {baseUrl:"",uploadUrl:"fileUpload.req",dlg:null,loadedId:null,data:null,refresh:function(_3ba) {
    var _3bb = this.data.project.id;
    if ((!_3ba || _3bb != this.loadedId) && this.rendered) {
        this.loadedId = _3bb;
        this.loadList();
        this.toggleButtons(this.data.project.getMask());
    }
},fillForm:function(data) {
    if (!this.dlg) {
        this.dlg = new jx.window.ProjectAttachmentWindow({data:this.data});
        this.dlg.getForm().on({afterUpload:this.afterSaveAttachment,afterUpdateDescription:this.afterSaveAttachment,scope:this});
    }
    this.dlg.show(this.getEl());
    if (data.id) {
        this.dlg.loadAttachment({fileName:"",attachment_description:data.description,attachment_id:data.id,existingFileName:data.fileName}, this.project);
    } else {
        this.dlg.loadAttachment({}, this.project);
        this.dlg.resetForm();
    }
},afterSaveAttachment:function() {
    this.dlg.onCancel();
    this.loadList();
    this.getAppContext().showMessage("Success", "The attachment is saved");
},onLoadItem:function(id, _3be) {
    attachment.getAttachment(id, _3be);
},onDeleteItem:function(id, _3c0) {
    attachment.deleteFileAttachment({id:id}, _3c0);
},onLoadList:function() {
    if (this.data.getProjectId()) {
        this.loadData([this.data.getProjectId()]);
    }
},getListDefinitions:function() {
    return ([{field:"fileName",label:"Name",width:300,renderer:this.fileNameRenderer.createDelegate(this)},{field:"description",label:"Description",width:300},{field:"mimetype",label:"Type",width:100},{field:"fileSize",label:"Size",width:50,renderer:function(_3c1, p, _3c3) {
        return _3c1 < 1024 ? _3c1 : (Math.ceil(_3c1 / 1024) + "K");
    }},{field:"action",columnOnly:true,dataType:"action",label:"Action",sortable:false,actions:[{name:"edit",display:"Edit"},{name:"delete",display:"Delete"}]}]);
},fileNameRenderer:function(_3c4, p, _3c6) {
    return "<a href=\"" + this.baseUrl + "attachment/" + _3c6.id + "/" + _3c4 + "\" target=\"_blank\">" + _3c4 + "</a>";
},onRenderOther:function() {
},render:function() {
    jx.grid.ProjectAttachmentGrid.superclass.render.apply(this, arguments);
    var tb = this.getTopToolbar();
    tb.addFill();
    this.buttonList.push(tb.addButton({tooltip:"Add Attachment",text:"Add Attachment",iconCls:"j-attachment-add-icon",handler:this.addItem.createDelegate(this),mask:jx.AclPermission.WRITEADMIN}));
},changeLabel:function(_3c8, _3c9) {
    var _3ca = Ext.DomQuery.select(String.format("label[for=\"{0}\"]", _3c8));
    if (_3ca) {
        _3ca[0].childNodes[0].nodeValue = _3c9;
    }
},beforeDestroy:function() {
    this.dlg && Ext.destroy(this.dlg);
    jx.grid.ProjectAttachmentGrid.superclass.beforeDestroy.apply(this, arguments);
}});
Ext.reg("jx.grid.ProjectAttachmentGrid", jx.grid.ProjectAttachmentGrid);
jx.grid.VersionGrid = function(_3cb) {
    Ext.applyIf(_3cb, {title:i18n.g("j-l-history"),fieldDefinitions:this.getListDefinitions(),dataStore:jx.data.StoreFactory.buildVersionStore(),tbar:["->",{text:i18n.g("j-b-compare"),tooltip:i18n.g("j-tt-compare"),iconCls:"j-item-compare-icon",handler:this.showCompare,scope:this}]});
    jx.grid.VersionGrid.superclass.constructor.call(this, _3cb);
};
Ext.extend(jx.grid.VersionGrid, jx.grid.SimpleGrid, {data:null,loadedId:null,refresh:function(_3cc) {
    var _3cd = this.data.getItemId();
    if ((!_3cc || _3cd != this.loadedId) && this.rendered) {
        this.loadedId = _3cd;
        this.loadData([_3cd]);
    }
},resetLoadedId:function() {
    this.loadedId = null;
},render:function() {
    jx.grid.VersionGrid.superclass.render.apply(this, arguments);
    if (this.data) {
    }
    this.refresh();
},getListDefinitions:function() {
    return ([{field:"versionId1",label:"From",width:"0%",renderer:this.renderFromVersion.createDelegate(this)},{field:"versionId2",label:"To",width:"0%",renderer:this.renderToVersion.createDelegate(this)},{field:"versionNumber",label:"Version",width:"10%"},{field:"baseLines",label:"Baselines",width:"10%",renderer:this.renderBaseLines.createDelegate(this)},{field:"comments",label:"Comments",width:"20%"},{field:"createdDate",label:"Created",width:"20%",dataType:"date",format:this.getAppContext().getDatetimeFormat()},{field:"userName",label:"By",width:"15%"}]);
},renderFromVersion:function(_3ce, p, _3d0) {
    return String.format("<input type=\"radio\" name=\"{0}\" class=\"{1}\" value=\"{2}\"/>", this.getId() + "-version-from", "j-version-from", _3d0.data.versionId);
},renderToVersion:function(_3d1, p, _3d3) {
    return String.format("<input type=\"radio\" name=\"{0}\" class=\"{1}\" value=\"{2}\"/>", this.getId() + "-version-to", "j-version-to", _3d3.data.versionId);
},renderBaseLines:function(_3d4, p, _3d6) {
    var list = _3d4;
    var _3d8 = "";
    for (var base = 0,len = list.length; base < len; base++) {
        if (base != 0) {
            _3d8 += ", ";
        }
        _3d8 += list[base].name;
    }
    return _3d8;
},showCompare:function() {
    var _3da = this.getRadioValue("j-version-from");
    var _3db = this.getRadioValue("j-version-to");
    if (_3da == null || _3db == null) {
        Ext.Msg.alert("Validation", "Please select a compare 'to' and a compare 'from'.");
    } else {
        version.getDocumentVersionDTOPair(_3da, _3db, this.showCompareDialog.createDelegate(this));
    }
},showCompareDialog:function(pair) {
    if (!this.formDialog) {
        this.formDialog = new jx.window.VersionCompareFormWindow({closeAction:"hide",cancelAction:"hide"});
    }
    this.formDialog.show();
    this.formDialog.compareItems(pair[0], pair[1]);
},getRadioValue:function(_3dd) {
    var _3de = this.body.query("input." + _3dd);
    if (_3de == null) {
        return null;
    }
    for (i = 0; i < _3de.length; i++) {
        node = _3de[i];
        if (node.type == "radio") {
            if (node.checked) {
                return node.value;
            }
        }
    }
    return null;
},beforeDestroy:function() {
    if (this.formDialog) {
        Ext.destroy(this.formDialog);
    }
    jx.grid.VersionGrid.superclass.beforeDestroy.apply(this, arguments);
}});
Ext.reg("jx.grid.VersionGrid", jx.grid.VersionGrid);
jx.grid.ProjectAttachmentGrid = function(_3df) {
    Ext.applyIf(_3df, {loadMask:true,fieldDefinitions:this.getListDefinitions()});
    this.dataStore = jx.data.StoreFactory.buildProjectAttachmentStore();
    jx.grid.ProjectAttachmentGrid.superclass.constructor.call(this, _3df);
};
Ext.extend(jx.grid.ProjectAttachmentGrid, jx.grid.SimpleGridDetail, {baseUrl:"",uploadUrl:"fileUpload.req",dlg:null,loadedId:null,data:null,refresh:function(_3e0) {
    var _3e1 = this.data.project.id;
    if ((!_3e0 || _3e1 != this.loadedId) && this.rendered) {
        this.loadedId = _3e1;
        this.loadList();
        this.toggleButtons(this.data.project.getMask());
    }
},fillForm:function(data) {
    if (!this.dlg) {
        this.dlg = new jx.window.ProjectAttachmentWindow({data:this.data});
        this.dlg.getForm().on({afterUpload:this.afterSaveAttachment,afterUpdateDescription:this.afterSaveAttachment,scope:this});
    }
    this.dlg.show(this.getEl());
    if (data.id) {
        this.dlg.loadAttachment({fileName:"",attachment_description:data.description,attachment_id:data.id,existingFileName:data.fileName}, this.project);
    } else {
        this.dlg.loadAttachment({}, this.project);
        this.dlg.resetForm();
    }
},afterSaveAttachment:function() {
    this.dlg.onCancel();
    this.loadList();
    this.getAppContext().showMessage("Success", "The attachment is saved");
},onLoadItem:function(id, _3e4) {
    attachment.getAttachment(id, _3e4);
},onDeleteItem:function(id, _3e6) {
    attachment.deleteFileAttachment({id:id}, _3e6);
},onLoadList:function() {
    if (this.data.getProjectId()) {
        this.loadData([this.data.getProjectId()]);
    }
},getListDefinitions:function() {
    return ([{field:"fileName",label:"Name",width:300,renderer:this.fileNameRenderer.createDelegate(this)},{field:"description",label:"Description",width:300},{field:"mimetype",label:"Type",width:100},{field:"fileSize",label:"Size",width:50,renderer:function(_3e7, p, _3e9) {
        return _3e7 < 1024 ? _3e7 : (Math.ceil(_3e7 / 1024) + "K");
    }},{field:"action",columnOnly:true,dataType:"action",label:"Action",sortable:false,actions:[{name:"edit",display:"Edit"},{name:"delete",display:"Delete"}]}]);
},fileNameRenderer:function(_3ea, p, _3ec) {
    return "<a href=\"" + this.baseUrl + "attachment/" + _3ec.id + "/" + _3ea + "\" target=\"_blank\">" + _3ea + "</a>";
},onRenderOther:function() {
},render:function() {
    jx.grid.ProjectAttachmentGrid.superclass.render.apply(this, arguments);
    var tb = this.getTopToolbar();
    tb.addFill();
    this.buttonList.push(tb.addButton({tooltip:"Add Attachment",text:"Add Attachment",iconCls:"j-attachment-add-icon",handler:this.addItem.createDelegate(this),mask:jx.AclPermission.WRITEADMIN}));
},changeLabel:function(_3ee, _3ef) {
    var _3f0 = Ext.DomQuery.select(String.format("label[for=\"{0}\"]", _3ee));
    if (_3f0) {
        _3f0[0].childNodes[0].nodeValue = _3ef;
    }
},beforeDestroy:function() {
    this.dlg && Ext.destroy(this.dlg);
    jx.grid.ProjectAttachmentGrid.superclass.beforeDestroy.apply(this, arguments);
}});
Ext.reg("jx.grid.ProjectAttachmentGrid", jx.grid.ProjectAttachmentGrid);
jx.grid.ItemRelationshipGrid = function(_3f1) {
    Ext.applyIf(_3f1, {listTitle:"",singleSelect:false,dialogWidth:400,dialogHeight:200,showToolbar:false,fieldDefinitions:this.getListDefinitions()});
    this.dataStore = jx.data.StoreFactory.buildRelationshipStore();
    this.form = this.createForm();
    jx.grid.ItemRelationshipGrid.superclass.constructor.call(this, _3f1);
};
Ext.extend(jx.grid.ItemRelationshipGrid, jx.grid.SimpleGridDetail, {data:null,fromDocId:null,impactDialog:null,impactWidget:null,initComponent:function() {
    jx.grid.ItemRelationshipGrid.superclass.initComponent.call(this);
},createForm:function() {
    return new jx.form.JamaForm({formType:"editOnly",showButtons:false,showTitle:false,title:"Edit Relationship",alternateRows:false,labelClass:"label",fieldDefinitions:this.getFormDefinitions()});
},getListDefinitions:function() {
    return ([{field:"documentKey",label:"Item ID",width:"10%",renderer:function(_3f2, _3f3, _3f4) {
        if (_3f4.data.projectAuthorized) {
            return "<a href=\"javascript:void(0)\">" + _3f2 + "</a>";
        } else {
            return _3f2;
        }
    }},{field:"documentName",label:"Name",width:"40"},{field:"forward",label:"Direction",width:"5%",renderer:function(_3f5, _3f6, _3f7) {
        return _3f7.data.forward ? "<img src='img/silk/arrow_right.png'></img>" : "<img src='img/silk/arrow_left.png'></img>";
    }},{field:"projectName",label:"Project",width:"20%"},{field:"documentGroup",label:"Group",width:"15%"},{field:"traceType",label:"Relationship",renderer:function(_3f8, _3f9, _3fa) {
        return _3fa.data.traceType ? _3fa.data.traceType.name : "";
    },width:"15%"},{field:"action",columnOnly:true,dataType:"action",label:"",sortable:false,renderer:this.actionRenderer.createDelegate(this)}]);
},getFormDefinitions:function() {
    var that = this;
    lookup.getLookupListByTypeCategory(1024, 2, this.getAppContext().organization.id, {callback:function(list) {
        that.relationshipType = list;
    },async:false});
    var _3fd = [{id:true,name:"<img src='img/silk/arrow_right.png'></img>"},{id:false,name:"<img src='img/silk/arrow_left.png'></img>"}];
    return ([{field:"forward",label:"Direction",dataType:"multiRadioBox",options:_3fd,cls:" "},{field:"traceType",label:"Relationship Type",dataType:"lookup",options:this.relationshipType}]);
},actionRenderer:function(_3fe, _3ff, _400) {
    var _401 = [];
    if (_400.data.projectAuthorized && (this.data.project.getMask() & jx.AclPermission.WRITEADMIN)) {
        _401.push({name:"edit",display:"Edit"});
        _401.push({name:"delete",display:"Delete"});
        if (_400.data.suspect) {
            _401.push({name:"clear",display:"Clear"});
        }
    }
    return this.createActionHtml(_401);
},onSelectItem:function(view, _403, _404, e, _406, _407) {
    if (_407 == 0) {
        if (_404.data.projectAuthorized) {
            var _408 = this.getAppContext().getProject(_404.data.projectId, false);
            var data = new jx.ItemData({item:{id:_404.data.documentId,name:_404.data.documentName},project:_408});
            this.getAppContext().fireEvent("showItem", {data:data,newTab:true,source:this,sourceType:"grid"});
        }
    }
    switch (_406) {
        case "edit":
            this.editItem(_404);
            break;
        case "delete":
            this.onDeleteItem(_404);
            break;
        case "clear":
            this.onClearSuspectLink(_404);
            break;
        default:
            break;
    }
},docLinkRenderer:function(_40a, p, _40c) {
    if (_40c.data.projectAuthorized) {
        return "<a href=\"javascript:void(0)\">" + _40a + "</a>";
    } else {
        return _40a;
    }
},onRenderOther:function() {
    this.createDialog();
},onDeleteItem:function(_40d) {
    var _40e = "Are you sure you want to delete this relationship";
    Ext.MessageBox.confirm("Confirm", _40e, this.onDeleteConfirm.createDelegate(this, [_40d], 0));
},onDeleteConfirm:function(_40f, _410) {
    if (_410 == "yes") {
        relationshipSvc.deleteRelationship({id:_40f.id}, this.onSuccessDelete.createDelegate(this));
    }
},onLoadItem:function(id, _412) {
    relationshipSvc.getDocumentTrace(id, this.data.getItemId(), _412);
},onSaveItem:function(item, _414) {
    var _415 = item.documentId;
    var _416 = this.data.getItemId();
    if (item.forward == "true") {
        relationshipSvc.deleteRelationship({id:item.traceId});
        relationshipSvc.saveTrace({fromDocumentId:_416,toDocumentId:_415,associationType:{id:item.traceType.id}}, {async:false});
    } else {
        relationshipSvc.deleteRelationship({id:item.traceId});
        relationshipSvc.saveTrace({fromDocumentId:_415,toDocumentId:_416,associationType:{id:item.traceType.id}}, {async:false});
    }
    this.loadList();
    this.hideDialog();
    this.fireEvent("refresh");
},onClearSuspectLink:function(_417) {
    var dtod = {id:_417.id};
    relationshipSvc.clearSuspectRelationship(dtod, this.onSuccessClear.createDelegate(this));
},onSuccessClear:function() {
    this.loadList();
    this.fireEvent("showSuccessMessage", "Success", "Suspect link has been cleared");
},onSuccessDelete:function() {
    this.loadList();
    this.fireEvent("showSuccessMessage", "Success", "Relationship removed");
},loadDocument:function(_419, _41a) {
}});
Ext.reg("jx.grid.ItemRelationshipGrid", jx.grid.ItemRelationshipGrid);
jx.grid.ItemAttachmentGrid = function(_41b) {
    Ext.applyIf(_41b, {title:i18n.g("j.l.itemAttachmentTabTitle"),listTitle:"",addItemLabel:i18n.g("j.b.itemAttachmentAdd"),fieldDefinitions:this.getListDefinitions()});
    this.dataStore = jx.data.StoreFactory.buildArtifactAttachmentStore();
    jx.grid.ItemAttachmentGrid.superclass.constructor.call(this, _41b);
};
Ext.extend(jx.grid.ItemAttachmentGrid, jx.grid.SimpleGridDetail, {baseUrl:"",data:null,urlWindow:null,uploadWindow:null,loadedId:null,refresh:function(_41c) {
    var _41d = this.data.getItemId();
    if (!this.checkLoaded || _41d != this.loadedId) {
        this.loadedItemId = _41d;
        this.loadList();
        this.toggleButtons(this.data.project.getMask());
    }
},render:function() {
    jx.grid.ItemAttachmentGrid.superclass.render.apply(this, arguments);
    if (this.data) {
        this.refresh();
    }
},beforeDestroy:function() {
    this.urlWindow && Ext.destroy(this.urlWindow);
    this.uploadWindow && Ext.destroy(this.uploadWindow);
    jx.grid.ItemAttachmentGrid.superclass.beforeDestroy.apply(this, arguments);
},fillForm:function(att) {
    if (att.id) {
        if (att.url) {
            this.getUrlWindow().loadUrl(att);
        } else {
            att = {document_attachment_id:att.id,fileName:"",existingFileName:att.attachment.fileName,attachment_description:att.attachment.description,attachment_id:att.attachment.id,attachment_note:att.note};
            this.getUploadWindow().loadAttachment(att);
        }
    }
},getListDefinitions:function() {
    return ([{field:"name",label:"Name",width:"50%",sortable:false,renderer:this.fileNameRenderer.createDelegate(this)},{field:"note",label:"Note",width:"30%"},{field:"action",columnOnly:true,dataType:"action",label:"Action",sortable:false,renderer:this.actionRenderer.createDelegate(this)}]);
},actionRenderer:function(_41f, _420, _421) {
    var _422 = [];
    if (this.data.project.getMask() & jx.AclPermission.WRITEADMIN) {
        _422.push({name:"edit",display:"Edit"});
        _422.push({name:"delete",display:"Delete"});
    }
    return this.createActionHtml(_422);
},fileNameRenderer:function(_423, p, _425) {
    if (_425.data.url) {
        return String.format("<a href=\"{0}\" target=\"_blank\">{0}</a>", _425.data.url);
    } else {
        if (_425.data.attachment) {
            var _426 = _425.data.attachment;
            return "<a href=\"" + this.baseUrl + "attachment/" + _426.id + "/" + _426.fileName + "\" target=\"_blank\">" + _426.fileName + "</a>";
        }
    }
},getUrlWindow:function() {
    if (!this.urlWindow) {
        this.urlWindow = new jx.window.ItemUrlWindow({data:this.data,listeners:{afterSaveUrl:{fn:this.refresh,scope:this}}});
    }
    this.urlWindow.show(this.getEl());
    return this.urlWindow;
},getUploadWindow:function() {
    if (!this.uploadWindow) {
        this.uploadWindow = new jx.window.ItemAttachmentWindow({data:this.data,listeners:{afterSaveItemAttachment:{fn:this.refresh,scope:this}}});
    }
    this.uploadWindow.show(this.getEl());
    return this.uploadWindow;
},onLoadItem:function(id, _428) {
    documentManager.getDocumentAttachment(id, _428);
},onDeleteItem:function(id, _42a) {
    documentManager.deleteDocumentAttachment({id:id}, _42a);
},onLoadList:function() {
    var id = this.data.getItemId();
    if (id) {
        this.loadData([id]);
    }
},addItem:function() {
    this.getUploadWindow().loadAttachment({});
},addUrl:function() {
    this.getUrlWindow().loadUrl({});
},onRenderOther:function() {
    var wa = jx.AclPermission.WRITEADMIN;
    var tb = this.getTopToolbar();
    this.titleItem = tb.addText(this.listTitle);
    tb.addFill();
    tb.addButton({tooltip:i18n.g("j.tt.itemAttachmentAdd"),text:this.addItemLabel,iconCls:"j-attachment-add-icon",cls:"x-btn-text-icon",handler:this.addItem,scope:this,mask:wa});
    tb.addButton({tooltip:i18n.g("j.tt.itemAttachmentURL"),text:i18n.g("j.b.itemAttachmentURL"),iconCls:"j-attachment-add-icon",cls:"x-btn-text-icon",handler:this.addUrl,scope:this,mask:wa});
}});
Ext.reg("jx.grid.ItemAttachmentGrid", jx.grid.ItemAttachmentGrid);
jx.grid.ServerAttachmentGrid = function(_42e) {
    Ext.applyIf(_42e, {fieldDefinitions:this.getListDefinitions(),singleSelect:false,dataStore:jx.data.StoreFactory.buildProjectAttachmentStore()});
    jx.grid.ServerAttachmentGrid.superclass.constructor.call(this, _42e);
};
Ext.extend(jx.grid.ServerAttachmentGrid, jx.grid.SimpleGrid, {data:null,baseUrl:null,refresh:function() {
    if (this.rendered) {
        this.loadList();
    }
},getSelection:function() {
    var _42f = this.body.query("input");
    var _430 = [];
    for (var i = 0; i < _42f.length; i++) {
        var _432 = _42f[i];
        if (_432.checked) {
            _430.push(_432.value);
        }
    }
    return _430;
},clearSelection:function() {
    var _433 = this.body.query("input");
    for (var i = 0; i < _433.length; i++) {
        var _435 = _433[i];
        _435.checked = false;
    }
},loadList:function() {
    if (this.data.project) {
        this.loadData([this.data.getProjectId()]);
    }
},getListDefinitions:function() {
    return ([{field:"radio",label:"",width:"5%",sortable:false,renderer:this.checkboxRenderer.createDelegate(this)},{field:"fileName",label:"Name",width:"30%",renderer:this.fileNameRenderer.createDelegate(this)},{field:"description",label:"Description",width:"20%"},{field:"mimetype",label:"Type",width:"20%"},{field:"fileSize",label:"Size",width:"25%",renderer:function(_436, p, _438) {
        return _436 < 1024 ? _436 : (Math.ceil(_436 / 1024) + "K");
    }}]);
},radioRenderer:function(_439, p, _43b) {
    return String.format("<input type=\"radio\" name=\"{0}\">", [this.getEl().id + "-" + "-radio"]);
},checkboxRenderer:function(_43c, p, _43e) {
    return String.format("<input type=\"checkbox\" value=\"{0}\">", _43e.id);
},fileNameRenderer:function(_43f, p, _441) {
    return "<a href=\"" + this.baseUrl + "attachment/" + _441.id + "/" + _43f + "\" target=\"_blank\">" + _43f + "</a>";
},onSelectItem:function(view, _443, _444, e, _446, _447) {
},render:function() {
    jx.grid.ServerAttachmentGrid.superclass.render.apply(this, arguments);
    this.refresh();
}});
jx.grid.ProjectGrid = function(_448) {
    this.dwrCall = project.getExtProjectResults;
    this.selModel = new Ext.grid.RowSelectionModel({singleSelect:false});
    this.enableColLock = false;
    this.fitContainer = true;
    this.ddGroup = "projectDD";
    this.enableDrag = true;
    jx.grid.ProjectGrid.superclass.constructor.call(this, _448);
};
Ext.extend(jx.grid.ProjectGrid, jx.grid.ContourGrid, {orgId:null,fieldDefinitions:null,dwrCall:null,gridHeader:null,meta:null,createHeader:function() {
},loadProjectGrid:function(_449) {
    this.setMetaByOrg();
    this.loadData(_449.data);
},setMeta:function(meta) {
    this.meta = meta;
    this.setFieldDefinitions(meta.fieldList);
},setMetaByOrg:function() {
    this.orgId = this.getAppContext().organization.id;
    projectTypeSvc.getProjectTypeMetaDataByOrg(this.orgId, {callback:this.setTypeMeta.createDelegate(this),async:false});
},setTypeMeta:function(meta) {
    meta.fieldList = this.getDefaultColumns().concat(meta.fieldList);
    this.setMeta(meta);
},getDefaultColumns:function() {
    if (!this.defaultColumns) {
        this.defaultColumns = [{field:"typeId",tooltip:"Document Type Field",width:100,label:"Type",dataOnly:true},{field:"id",tooltip:"Internal Database Id",width:50,label:"API ID",hidden:true},{field:"isFolder",tooltip:"Folder",width:32,label:"<img src=\"img/silk/folder_page_white.png\"/>",dataType:"boolean",renderer:function(_44c, p, _44e) {
            return _44c ? "<img src=\"img/tree/folderClosed.gif\" title=\"Folder\"/>" : "<img src=\"img/silk/page_white_text.png\" title=\"Artifact\"/>";
        }}];
    }
    return this.defaultColumns;
}});
jx.grid.ItemTestResultsGrid = function(_44f) {
    Ext.applyIf(_44f, {listTitle:"",singleSelect:false,executeTestLabel:i18n.g("j.l.executeItemTest"),dialogWidth:700,dialogHeight:500,showToolbar:true,maximizable:true,minimizable:false,dialogTitle:i18n.g("j.l.executeTestWindow"),fieldDefinitions:this.getListDefinitions()});
    this.dataStore = jx.data.StoreFactory.buildItemTestResultsStore();
    jx.grid.ItemTestResultsGrid.superclass.constructor.call(this, _44f);
};
Ext.extend(jx.grid.ItemTestResultsGrid, jx.grid.SimpleGridDetail, {data:null,fromDocId:null,configurationList:null,initComponent:function() {
    jx.grid.ItemTestResultsGrid.superclass.initComponent.call(this);
},refresh:function() {
    if (this.form) {
        this.form.getFieldMeta("testConfiguration").options = this.configurationList;
    }
    this.loadData([this.data.getItemId()]);
    this.toggleButtons(this.data.project.getMask());
},getListDefinitions:function() {
    return ([{field:"testConfiguration",label:"Configuration",width:"20%",dataType:"lookup"},{field:"passStatus",label:"Pass/Fail",width:"10",renderer:this.statusRenderer.createDelegate(this)},{field:"notes",label:"Notes",width:"30%"},{field:"createdDate",label:"Tested",width:"25%",dataType:"date",format:this.getAppContext().getDatetimeFormat()},{field:"createdBy",label:"Tester",width:"10%",dataType:"lookup"},{field:"action",columnOnly:true,width:"5%",dataType:"action",label:"",sortable:false,renderer:this.actionRenderer.createDelegate(this)}]);
},actionRenderer:function(_450, _451, _452) {
    var _453 = [];
    _453.push({name:"view",display:"View"});
    return this.createActionHtml(_453);
},statusRenderer:function(_454, _455, _456) {
    var _454 = (_456.data.passStatus) ? i18n.g("j.l.testPass") : i18n.g("j.l.testFail");
    return _454;
},onSelectItem:function(view, _458, _459, e, _45b, _45c) {
    switch (_45b) {
        case "view":
            this.viewTest(_459.data);
            break;
        default:
            break;
    }
},render:function() {
    jx.grid.ItemTestResultsGrid.superclass.render.apply(this, arguments);
    this.form = this.createForm();
    this.createDialog();
    this.refresh();
},onRenderOther:function() {
    var wa = jx.AclPermission.WRITEADMIN;
    var tb = this.getTopToolbar();
    this.titleItem = tb.addText(this.listTitle);
    tb.addFill();
    this.buttonList.push(tb.addButton({tooltip:i18n.g("j.tt.itemTestExecute"),text:this.executeTestLabel,iconCls:"j-item-execute-test-icon",cls:"x-btn-text-icon",handler:this.executeTest,scope:this,mask:wa}));
},viewTest:function(item) {
    this.form.readOnly = true;
    this.dialog.buttons[0].hide();
    this.fillForm(item);
},executeTest:function() {
    var self = this;
    documentManager.getDocumentDto(this.data.getItemId(), {callback:function(item) {
        self.testScript = item.description;
    },async:false});
    this.form.readOnly = false;
    this.dialog.buttons[0].show();
    this.fillForm({testCaseDetails:self.testScript});
},onSaveItem:function(item, _463) {
    item.testConfiguration = {id:item.testConfiguration.id};
    item.passStatus = (item.passStatus == "Pass") ? true : false;
    item.testCase = {id:this.data.getItemId()};
    documentManager.saveTestResult(item, this.afterSaveTest.createDelegate(this));
},afterSaveTest:function() {
    this.refresh();
    this.cancelEdit();
},createForm:function() {
    return new jx.form.JamaForm({formType:"editOnly",showButtons:false,showTitle:false,title:"Edit Relationship",alternateRows:false,labelClass:"label",fieldDefinitions:this.getFormDefinitions()});
},getFormDefinitions:function() {
    this.loadConfigurationList();
    var _464 = [{id:"Pass",name:"Pass"},{id:"Fail",name:"Fail"}];
    return ([{field:"testConfiguration",label:"Configuration",dataType:"lookup",labelAlign:"left",width:"100%",options:this.configurationList},{field:"passStatus",label:"Pass/Fail",dataType:"multiRadioBox",mapping:function(item) {
        return item.passStatus ? "Pass" : "Fail";
    },labelAlign:"left",width:"100%",options:_464,required:true,cls:"j-form-boolean-box"},{field:"notes",label:"Notes",dataType:"text",controlTypeId:2,labelAlign:"top",width:"100%"},{field:"testCaseDetails",label:"Test Case Details",dataType:"text",controlTypeId:3,labelAlign:"top",width:"100%",height:200}]);
},loadConfigurationList:function() {
    var self = this;
    lookup.getLookupListByTypeCategory(1023, 3, this.data.getProjectId(), {callback:function(list) {
        self.configurationList = list;
    },async:false});
}});
Ext.reg("jx.grid.ItemTestResultsGrid", jx.grid.ItemTestResultsGrid);
jx.grid.LdapConfigGrid = function(_468) {
    Ext.applyIf(_468, {listTitle:"Ldap Provider Lists",dialogTitle:"Add/Edit Provider",dialogWidth:500,dialogHeight:500,fieldDefinitions:this.getListDefinitions()});
    this.dataStore = jx.data.StoreFactory.buildAuthProviderConfigStore();
    this.form = this.createForm();
    jx.grid.LdapConfigGrid.superclass.constructor.call(this, _468);
};
Ext.extend(jx.grid.LdapConfigGrid, jx.grid.SimpleGridDetail, {createForm:function() {
    return new jx.form.JamaForm({formType:"editOnly",showButtons:false,showTitle:false,title:"Test Jama Form",alternateRows:false,labelClass:"label",fieldDefinitions:this.getFormDefinitions()});
},getFormDefinitions:function() {
    return ([{field:"name",label:"Name",required:true},{field:"description",label:"Description",required:true},{field:"url",label:"URL",required:true},{field:"baseDn",label:"Base Dn",required:true},{field:"bindDn",label:"Bind Dn",required:true},{field:"bindPassword",label:"Bind Password",required:true,inputType:"password"},{field:"userNameAttribute",label:"Login Name Attribute",required:true},{field:"emailAttribute",label:"Email Attribute",required:true},{field:"nameAttribute",label:"User Name Attribute",required:true},{field:"sampleUser",label:"Sample User",required:false},{field:"sampleUserPassword",label:"Sample User Password",required:false,inputType:"password"}]);
},getListDefinitions:function() {
    return ([{field:"name",label:"Name",width:"20%"},{field:"description",label:"Description",width:"20%"},{field:"url",label:"URL",width:"20%"},{field:"baseDn",label:"Base DN",width:"30%"},{field:"action",columnOnly:true,dataType:"action",label:"Action",sortable:false,actions:[{name:"edit",display:"Edit"},{name:"delete",display:"Delete"}]}]);
},createDialog:function() {
    this.dialog = new Ext.Window({title:this.dialogTitle,modal:true,closable:true,closeAction:"hide",width:this.dialogWidth,height:this.dialogHeight,plain:true,layout:"fit",items:{margins:"3 3 3 0",autoScroll:true,items:this.form ? this.form : {}},buttons:[{text:"Test",handler:this.testItem,scope:this},{text:"Save",handler:this.saveItem,scope:this},{text:"Close",handler:this.cancelEdit,scope:this}]});
    this.dialog.render(Ext.getBody());
    if (this.form) {
        this.form.setItem({});
    }
    this.dialog.hide();
},onRenderOther:function() {
    var tb = this.getTopToolbar();
    this.titleItem = tb.addText(this.listTitle);
    tb.addFill();
    tb.add({tooltip:"Add Active Directory Provider",text:"Add AD Provider",icon:"img/silk/add.png",cls:"x-btn-text-icon",handler:this.addADItem,scope:this});
    tb.add("-");
    tb.add({tooltip:"Add LDAP Provider",text:"Add LDAP Provider",icon:"img/silk/add.png",cls:"x-btn-text-icon",handler:this.addItem,scope:this});
    this.createDialog();
},onLoadItem:function(id, _46b) {
    ldapSvc.getAuthProviderConfig(id, _46b);
},testItem:function() {
    var item = this.form.getUpdatedItem();
    ldapSvc.testLdapConfig(item, item.sampleUser, item.sampleUserPassword, {callback:function(_46d) {
        Ext.MessageBox.alert(_46d ? "Success" : "Test Failed", _46d ? "Test is successful" : "Can't Authenticate User");
    },exceptionHandler:function(msg, e) {
        Ext.MessageBox.alert("Test Failed", msg);
    }});
},addItem:function() {
    this.fillForm({name:"Name",description:"Description",url:"ldap://localhost:389",baseDn:"dc=jamasoftware,dc=com",bindDn:"cn=Admin,ou=users,dc=jamasoftware,dc=com",bindPassword:"password",userNameAttribute:"uid",emailAttribute:"email",nameAttribute:"cn",sampleUser:"admin",sampleUserPassword:"password"});
},addADItem:function() {
    this.fillForm({name:"Name",description:"Description",url:"ldap://localhost:389",baseDn:"dc=jamasoftware,dc=com",bindDn:"cn=Admin,ou=users,dc=jamasoftware,dc=com",bindPassword:"password",userNameAttribute:"sAmAccountName",emailAttribute:"email",nameAttribute:"displayName",sampleUser:"admin",sampleUserPassword:"password"});
},onSaveItem:function(item, _471) {
    ldapSvc.saveAuthProviderConfig(item, _471);
},onDeleteItem:function(id, _473) {
    ldapSvc.deleteAuthProviderConfig({id:id}, _473);
},onLoadList:function() {
    this.loadData([]);
},render:function() {
    jx.grid.LdapConfigGrid.superclass.render.apply(this, arguments);
    this.loadList();
}});
Ext.reg("jx.grid.LdapConfigGrid", jx.grid.LdapConfigGrid);
jx.grid.LdapUserGrid = function(_474) {
    Ext.applyIf(_474, {listTitle:"Ldap User List",dialogTitle:"Add User",addItemLabel:"Add Drop Down",loadingMessage:"Searching...",formClass:"jamaForm",dialogWidth:500,dialogHeight:400,fieldDefinitions:this.getListDefinitions()});
    this.dataStore = jx.data.StoreFactory.buildLdapUserInfoStore();
    this.form = this.createForm();
    jx.grid.LdapUserGrid.superclass.constructor.call(this, _474);
};
Ext.extend(jx.grid.LdapUserGrid, jx.grid.SimpleGridDetail, {orgId:null,searchString:null,providerId:null,createForm:function() {
    return new jx.form.UserForm({orgId:this.orgId});
},getListDefinitions:function() {
    return ([{field:"userName",label:"Login Id",width:"15%",dataType:"string"},{field:"fullName",label:"Full Name",width:"20%",dataType:"string"},{field:"email",label:"Email",dataType:"string",width:"20%"},{field:"action",columnOnly:true,sortable:false,dataType:"action",label:"Action",actions:[{name:"edit",display:"Add"}]}]);
},onLoadItem:function(id, _476) {
    var _477 = this.dataStore.getById(id);
    var user = {userName:_477.data.userName,firstName:_477.data.firstName,lastName:_477.data.lastName,email:_477.data.email,theme:"contour",licenseType:"R"};
    _476(user);
},onSaveItem:function(item, _47a) {
    item.password = "password";
    item.repeatedPassword = "password";
    item.organization = {id:this.orgId};
    item.theme = item.theme ? item.theme.name : "";
    item.locale = item.locale ? item.locale.name : "";
    item.visible = true;
    item.system = false;
    if (this.validate(item)) {
        this.form.clearErrorMessages();
        user.saveUser(item, _47a);
    }
},validate:function(item) {
    var self = this;
    validation.validateUser(item, {callback:function(_47d) {
        self.errors = _47d;
    },async:false});
    if (this.errors && this.errors.length > 0) {
        this.form.displayErrorMessages(this.errors);
        return false;
    }
    return true;
},onDeleteItem:function(id, _47f) {
},onLoadList:function() {
    if (this.searchString && this.providerId) {
        this.loadData([this.searchString,this.providerId]);
    }
},onRenderOther:function() {
    var tb = this.getTopToolbar();
    tb.add({text:"Back to User List",tooktip:"Go back to user list",handler:this.backToUserList,scope:this});
    tb.add("-");
    tb.add("Select a provider:&nbsp;");
    tb.add(this.createCombo());
    tb.addFill();
    this.searchField = new Ext.form.Field({align:"right",diabled:true,listeners:{specialkey:this.handleReturn,scope:this}});
    tb.add(this.searchField);
    this.searchButton = tb.addButton({text:"Search",iconCls:"j-header-search-icon",tooltip:"LDAP Search",disabled:true,handler:this.search,scope:this});
    this.createDialog();
},createCombo:function() {
    this.configStore = jx.data.StoreFactory.buildAuthProviderConfigStore();
    var _481 = new Ext.form.ComboBox({store:this.configStore,displayField:"name",valueField:"id",mode:"local",triggerAction:"all",emptyText:"Select a provider...",selectOnFocus:true,editable:false});
    _481.on("select", this.onChangeProvider, this);
    return _481;
},onChangeProvider:function(_482) {
    this.providerId = _482.getValue();
    this.searchField.enable();
    this.searchButton.enable();
},backToUserList:function() {
    this.fireEvent("backToUserList");
},handleReturn:function(_483, _484) {
    if (_484.getKey() == Ext.EventObject.RETURN) {
        this.search();
    }
},search:function() {
    this.searchString = this.searchField.getValue();
    this.loadList();
},setOrgId:function(_485) {
    this.orgId = _485;
    this.form.orgId = _485;
    this.form.refreshForm();
},render:function() {
    jx.grid.LdapUserGrid.superclass.render.apply(this, arguments);
    this.configStore.load();
}});
Ext.reg("jx.grid.LdapUserGrid", jx.grid.LdapUserGrid);
jx.grid.ReportGrid = function(_486) {
    Ext.applyIf(_486, {listTitle:i18n.g("j.l.reportTitle"),addItemLabel:i18n.g("j.l.reportAdd"),fieldDefinitions:this.getListDefinitions(),autoScroll:true});
    this.dataStore = jx.data.StoreFactory.buildReportStore();
    jx.grid.ReportGrid.superclass.constructor.call(this, _486);
};
Ext.extend(jx.grid.ReportGrid, jx.grid.SimpleGridDetail, {baseUrl:"",uploadWindow:null,refresh:function() {
    this.loadList();
},render:function() {
    jx.grid.ReportGrid.superclass.render.apply(this, arguments);
    this.refresh();
},destroy:function() {
    this.uploadWindow && this.uploadWindow.destroy();
    jx.grid.ReportGrid.superclass.destroy.apply(this, arguments);
},fillForm:function(_487) {
    this.getReportWindow().setItem(_487);
},getListDefinitions:function() {
    return ([{field:"name",label:i18n.g("j.l.reportName"),width:"25%",sortable:true},{field:"fileName",label:i18n.g("j.l.reportFileName"),width:"25%",sortable:false,renderer:this.reportNameRenderer.createDelegate(this)},{field:"description",label:i18n.g("j.l.reportDescription"),width:"30%",sortable:true},{field:"action",columnOnly:true,dataType:"action",label:i18n.g("j.l.reportAction"),sortable:false,actions:[{name:"edit",display:"Edit"},{name:"delete",display:"Delete"}]}]);
},reportNameRenderer:function(_488, p, _48a) {
    var item = _48a.data;
    return item.mainReportFile != null ? item.mainReportFile.fileName : "";
},getReportWindow:function() {
    if (!this.reportWindow) {
        this.reportWindow = new jx.window.ReportWindow({data:this.data,listeners:{afterSaveReport:{fn:this.refresh,scope:this}}});
    }
    this.reportWindow.show(this.getEl());
    return this.reportWindow;
},onLoadItem:function(id, _48d) {
    report.getReport(id, _48d);
},onDeleteItem:function(id, _48f) {
    report.deleteReport({id:id}, _48f);
},onLoadList:function() {
    this.loadData();
},addItem:function() {
    this.getReportWindow().setItem({});
},onRenderOther:function() {
    var tb = this.getTopToolbar();
    this.titleItem = tb.addText(this.listTitle);
    tb.addFill();
    tb.addButton({tooltip:"Add Report",text:this.addItemLabel,icon:"img/silk/add.png",cls:"x-btn-text-icon",handler:this.addItem,scope:this});
}});
Ext.reg("jx.grid.ReportGrid", jx.grid.ReportGrid);
Ext.namespace("Ext.ux");
Ext.ux.TagCloud = function(_491) {
    Ext.ux.TagCloud.superclass.constructor.call(this, _491);
    if (this.store) {
        this.setStore(this.store);
    }
    this.displayField = this.displayField || "tag";
    this.weightField = this.weightField || "count";
    this.addEvents({"tagselect":true});
    this.nodes = [];
};
Ext.extend(Ext.ux.TagCloud, Ext.Component, {showAsList:false,defaultAutoCreate:{tag:"div",cls:"x-cloud"},getDataSource:function() {
    return this.store;
},setStore:function(_492) {
    _492.on("load", this.refresh, this);
    this.store = _492;
    this.store.remoteSort = false;
    this.store.sort(this.displayField, "ASC");
},onRender:function(ct, _494) {
    this.container = ct;
    if (this.el) {
        this.el = Ext.get(this.el);
        if (!this.target) {
            ct.dom.appendChild(this.el.dom);
        }
    } else {
        var cfg = this.getAutoCreate();
        if (!cfg.name) {
            cfg.name = this.name || this.id;
        }
        this.el = ct.createChild(cfg, _494);
    }
    this.list = this.el.createChild({tag:"ol",cls:"x-cloud-ordered-list"});
},refresh:function() {
    this.clearNodes();
    this.getWeightDistribution();
    var _496 = this.store.getRange();
    for (var i = 0; i < _496.length; i++) {
        var _498 = _496[i].data[this.weightField];
        var _499 = this.list.createChild({tag:"li",cls:this.showAsList ? "x-cloud-list-item" : "x-cloud-item " + this.getWeightClassification(_498),html:"<a href=\"#\">" + _496[i].data[this.displayField] + (this.displayWeight ? " (" + _498 + ")" : "") + "</a>"});
        _499.on("click", this.onSelect, this);
    }
    this.list.fadeIn({duration:0.5,block:true});
    this.nodes = this.list.dom.childNodes;
},clearNodes:function() {
    while (this.list.dom.firstChild) {
        this.list.dom.removeChild(this.list.dom.firstChild);
    }
},onSelect:function(e, t) {
    var item = t.parentNode;
    var _49d = this.indexOf(item);
    var _49e = this.list.query(".x-cloud-item-selected");
    if (_49e.length > 0) {
        Ext.get(_49e[0]).removeClass("x-cloud-item-selected");
    }
    this.fireEvent("tagselect", this, this.getDataSource().getAt(_49d), _49d);
    Ext.EventObject.stopEvent(e);
},indexOf:function(node) {
    var ns = this.nodes;
    for (var i = 0,len = ns.length; i < len; i++) {
        if (ns[i] == node) {
            return i;
        }
    }
    return -1;
},getWeightClassification:function(_4a2) {
    if (_4a2 == this.max) {
        return "largest";
    }
    if (_4a2 == this.min) {
        return "smallest";
    }
    if (_4a2 > (this.min + (this.distribution * 2))) {
        return "large";
    }
    if (_4a2 > (this.min + this.distribution)) {
        return "medium";
    }
    return "small";
},getWeightDistribution:function() {
    var _4a3 = this.store.getRange();
    if (_4a3.length == 0) {
        this.max = this.min = 0;
        return;
    }
    this.max = _4a3[0].data.count;
    this.min = _4a3[0].data.count;
    for (var i = 0; i < _4a3.length; i++) {
        var _4a5 = _4a3[i].data[this.weightField];
        if (_4a5 > this.max) {
            this.max = _4a5;
        }
        if (_4a5 < this.min) {
            this.min = _4a5;
        }
    }
    if (!this.distribution) {
        this.distribution = (this.max - this.min) / 5;
    }
}});
jx.view.TableView = function(_4a6) {
    this.emptyText = "No data";
    this.itemSelector = "tr";
    jx.view.TableView.superclass.constructor.call(this, _4a6);
};
Ext.extend(jx.view.TableView, Ext.DataView, {feilds:null,refresh:function() {
    var t = this.tpl;
    this.clearSelections();
    var body = this.el.dom;
    while (body.childNodes.length > 0) {
        body.removeChild(body.childNodes[0]);
    }
    var html = [];
    var _4aa = this.store.getRange();
    if (_4aa.length < 1) {
        if (this.emptyText) {
            var html = String.format("<tr><td colspan=\"{0}\">{1}</td></tr>", this.fields ? this.fields.length : 1, this.emptyText);
            Ext.DomHelper.insertHtml("beforeEnd", this.el.dom, html);
        }
        this.fireEvent("refresh", this);
        return;
    }
    for (var i = 0,len = _4aa.length; i < len; i++) {
        var data = this.prepareData(_4aa[i].data, i, _4aa[i]);
        t.append(this.el, data);
    }
    this.all.fill(Ext.query(this.itemSelector, this.el.dom));
    this.updateIndexes(0);
    this.fireEvent("refresh", this);
},createRow:function(body, data) {
    var row = document.createElement("tr");
    body.appendChild(row);
    for (var i = 0; i < this.fields.length; i++) {
        var _4b1 = this.fields[i];
        var _4b2 = data[_4b1.field];
        this.createCell(row, _4b1, _4b2);
    }
},createCell:function(row, _4b4, _4b5) {
    var cell = document.createElement("td");
    row.appendChild(cell);
    cell.innerHTML = _4b5;
}});
jx.view.WhatsNewView = function(_4b7) {
    var _4b8 = jx.data.StoreFactory.buildEventStore(_4b7.params);
    _4b7 = Ext.applyIf(_4b7, {store:_4b8,tpl:this.getTemplate(),overClass:"j-whatsnew-over",autoWidth:true,emptyText:i18n.g("j.m.noEvents"),itemSelector:"div.whatsNewBox"});
    jx.view.WhatsNewView.superclass.constructor.call(this, _4b7);
};
Ext.extend(jx.view.WhatsNewView, Ext.DataView, {loadMask:true,data:null,userId:null,render:function() {
    jx.view.WhatsNewView.superclass.render.apply(this, arguments);
},getTemplate:function() {
    var _4b9 = new Ext.XTemplate("<tpl for=\".\">", "<div class=\"whatsNewBox\">", "<table width=\"100%\"><tr><td width=\"5%\" style=\"vertical-align: middle\">", "<div class=\"j-icon {action:this.actionIcon}\"></div>", "</td>", "<td width=\"70%\">", "<span class=\"j-text-label j-whatsnew-text\">{documentKey} - {itemName}</span>", "<br/>{action} {whenAgo} in {projectName}", "</td>", "<td width=\"25%\">by {userName}</td>", "</tr></table>", "</div>", "</tpl>");
    _4b9.actionIcon = function(_4ba) {
        var _4bb;
        switch (_4ba) {
            case "Comment added":
                _4bb = "j-comment-add-icon";
                break;
            case "Modified":
                _4bb = "j-item-modified-icon";
                break;
            case "Added":
                _4bb = "j-item-add-icon";
                break;
            case "Deleted":
                _4bb = "j-item-deleted-icon";
                break;
            case "Batch Modified":
                _4bb = "img/mini/pages.gif'";
                break;
            default:
                _4bb = "img/mini/file.gif";
                break;
        }
        return _4bb;
    };
    return _4b9;
},destroy:function() {
    if (this.loadMask && this.loadMask.destroy) {
        this.loadMask.destroy();
    }
    jx.view.WhatsNewView.superclass.destroy.call(this);
}});
jx.view.FilterListView = function(_4bc) {
    jx.view.FilterListView.superclass.constructor.call(this, _4bc);
    this.myFilterStore = jx.data.StoreFactory.buildFilterStore();
    this.myFilterStore.sort("name", "ASC");
    this.sharedFilterStore = jx.data.StoreFactory.buildFilterStore();
    this.sharedFilterStore.sort("name", "ASC");
    this.template = this.getTemplate();
    this.actions = this.getActions();
};
Ext.extend(jx.view.FilterListView, Ext.Component, {project:null,sharedFilterView:null,myFilterView:null,editable:true,template:null,actions:null,getTemplate:function() {
    return new Ext.XTemplate("<tpl for=\".\">", "<div class=\"j-filter-view\"><a class=\"j-action-view\" href=\"javascript:void(0)\">{name}</a><br/>", "{actions}", "</div>", "</tpl>");
},getActions:function() {
    return "";
},setProject:function(_4bd) {
    this.project = _4bd;
},load:function(_4be) {
    if (_4be) {
        this.setProject(_4be);
    }
    if (this.project && this.project.id) {
        this.myFilterStore.load({arg:[this.project.id,6]});
        this.sharedFilterStore.load({arg:[this.project.id,2]});
    }
},selectItem:function(view, _4c0, node, e) {
    if (view == this.myFilterView) {
        this.sharedFilterView.clearSelections();
    } else {
        this.myFilterView.clearSelections();
    }
    var _4c3 = view.store.getAt(_4c0);
    var _4c4 = null;
    var _4c5 = e.target;
    var link = this.getParentByType(_4c5, "a", node);
    if (link != null) {
        var _4c7 = link.className;
        if (_4c7.indexOf("j-action-") != -1) {
            _4c4 = _4c7.substr(9);
        }
    }
    var _4c8 = {id:_4c3.id,name:_4c3.data.name};
    if (_4c4 == "delete") {
        this.deleteFilter(this, _4c8, e);
    } else {
        if (_4c4 == "edit") {
            this.fireEvent("editFilter", this, _4c8, e);
        } else {
            this.fireEvent("viewFilterResults", this, _4c8, e);
        }
    }
},deleteFilter:function(view, _4ca, e) {
    var _4cc = String.format("This will permanently remove \"{0}\" filter." + "<br>If this filter is shared it will be removed for everyone." + "<br>" + "<br>Are you sure you want to delete?", [_4ca.name]);
    Ext.MessageBox.confirm("Confirm", _4cc, this.deleteFilterConfirm.createDelegate(this, [_4ca], 0));
},deleteFilterConfirm:function(_4cd, _4ce) {
    if (_4ce == "yes") {
        filterSvc.deleteFilter(_4cd.id, this.load.createDelegate(this));
    }
},getParentByType:function(node, type, _4d1) {
    var _4d2 = node;
    type = type.toLowerCase();
    while ((_4d2) && (_4d2.nodeName.toLowerCase() != type)) {
        if (_4d2 == _4d1) {
            return null;
        }
        _4d2 = _4d2.parentNode;
    }
    return _4d2;
},prepareData:function(data) {
    return {name:data.name,actions:this.actions};
},onRender:function(ct, _4d5) {
    ct = Ext.get(ct);
    var o = {tag:"div",id:this.id || Ext.id()};
    this.el = ct.createChild(o);
    this.myFilterTitleNode = this.el.createChild({tag:"div",cls:"j-filter-header",style:"margin-bottom:5px;"});
    this.myFilterTitleNode.dom.innerHTML = "My Filters";
    var _4d7 = this.el.createChild({tag:"div",id:Ext.id()});
    this.sharedFilterTitleNode = this.el.createChild({tag:"div",cls:"j-filter-header",style:"margin-bottom:5px;"});
    this.sharedFilterTitleNode.dom.innerHTML = "Shared Filters";
    var _4d8 = this.el.createChild({tag:"div",id:Ext.id()});
    this.myFilterView = new Ext.DataView({el:_4d7,tpl:this.template,multiSelect:true,selectedClass:"j-tag-selected",store:this.myFilterStore,itemSelector:"div",prepareData:this.prepareData.createDelegate(this),emptyText:"no data",listeners:{click:{fn:this.selectItem,scope:this}}});
    this.myFilterView.render();
    this.sharedFilterView = new Ext.DataView({el:_4d8,tpl:this.template,multiSelect:true,itemSelector:"div",selectedClass:"j-tag-selected",store:this.sharedFilterStore,prepareData:this.prepareData.createDelegate(this),listeners:{click:{fn:this.selectItem,scope:this}}});
    this.sharedFilterView.render();
    this.load();
}});
jx.view.CommentView = function(_4d9) {
    var _4da = jx.data.StoreFactory.buildCommentStore();
    _4d9 = Ext.applyIf(_4d9, {store:_4da,emptyText:"There are no comments for this item",tpl:this.getTemplate(),selectedClass:"j-comment-selected",store:_4da,itemSelector:"div.j-comment-box",dateTimeFormat:this.getAppContext().getDatetimeFormat()});
    jx.view.CommentView.superclass.constructor.call(this, _4d9);
};
Ext.extend(jx.view.CommentView, Ext.DataView, {dateTimeFormat:"m/d/Y",loadMask:true,data:null,userId:null,afterRender:function() {
    jx.view.CommentView.superclass.afterRender.call(this);
    if (this.loadMask) {
        this.loadMask = new Ext.LoadMask(this.getEl().dom.parentNode, {store:this.store});
    }
},getTemplate:function() {
    return new Ext.XTemplate("<tpl for=\".\">", "<div class=\"j-comment-box\"><div class=\"j-comment-author-text\">", "<img border=\"0\" src=\"img/silk/comment.png\" align=\"absmiddle\">", "{createdDate} by {userName} </div>", "<div class=\"j-text-box j-comment-text\">{commentText}</div>", "<div class=\"j-comment-action-bar\" style=\"{display}\">", "<img border=\"0\" src=\"img/silk/comment_edit.png\" align=\"absmiddle\">&nbsp;", "<a href=\"javascript:void(0)\" class=\"j-action-edit\">Edit</a>&nbsp;&nbsp;", "<img border=\"0\" src=\"img/silk/comment_delete.png\" align=\"absmiddle\">&nbsp;", "<a href=\"javascript:void(0)\" class=\"j-action-delete\">Delete</a></div>", "</div>", "</tpl>");
},prepareData:function(data) {
    var _4dc = this.data.project;
    return {commentText:data.commentText,userName:data.userName,createdDate:data.createdDate ? data.createdDate.format(this.dateTimeFormat) : "",display:_4dc.canAdmin() || _4dc.canWrite() || this.userId == data.createdBy ? "" : "display:none"};
},destroy:function() {
    if (this.loadMask && this.loadMask.destroy) {
        this.loadMask.destroy();
    }
    jx.view.CommentView.superclass.destroy.call(this);
}});
jx.view.ItemRelationshipView = function(_4dd) {
    var _4de = jx.data.StoreFactory.buildOneDirectionRelationshipStore();
    _4dd = Ext.applyIf(_4dd, {store:_4de,tpl:this.getTemplate(_4dd.direction),overClass:"j-view-over",emptyText:_4dd.direction ? i18n.g("j.m.noRelationshipsForw") : i18n.g("j.m.noRelationshipsBack"),selectedClass:"j-comment-selected",itemSelector:"div.relationshipBox"});
    jx.view.ItemRelationshipView.superclass.constructor.call(this, _4dd);
};
Ext.extend(jx.view.ItemRelationshipView, Ext.DataView, {project:null,removable:true,data:null,direction:true,render:function() {
    jx.view.ItemRelationshipView.superclass.render.apply(this, arguments);
    this.on("click", this.onClickRelate, this);
    this.store.on("load", this.afterLoadRelationships, this);
},afterLoadRelationships:function(_4df, _4e0, _4e1) {
    this.fireEvent("afterLoadRelationships");
},refreshView:function() {
    this.store.load({arg:[this.data.getItemId(),this.direction]});
},getTemplate:function(_4e2) {
    var _4e3 = "";
    if (this.removable) {
        _4e3 = "" + "<div class=\"j-comment-action-bar\" style=\"margin-top: 10px; text-align:right;{display}\">" + "<img border=\"0\" src=\"img/silk/{directionImage}\" align=\"absmiddle\">&nbsp;" + "<a href=\"javascript:void(0)\" class=\"j-action-switch\">Switch Direction</a>&nbsp;&nbsp;" + "<img border=\"0\" src=\"img/silk/link_edit.png\" align=\"absmiddle\">&nbsp;" + "<a href=\"javascript:void(0)\" class=\"j-action-edit\">Edit</a>&nbsp;&nbsp;" + "<img border=\"0\" src=\"img/silk/link_break.png\" align=\"absmiddle\">&nbsp;" + "<a href=\"javascript:void(0)\" class=\"j-action-delete\">Remove</a>" + "</div>";
    }
    var _4e4 = new Ext.XTemplate("<div class=\"j-relate-visual-title\">{[this.textDirection(" + _4e2 + ")]}</div>", "<tpl for=\".\">", "<div class=\"relationshipBox\">", "<div class=\"j-relate-visual-container\">", "<div class=\"j-relate-visual-box\" id=\"{itemId}\">", "<span class=\"j-text-label\">Item:</span> ", "<span class=\"j-relate-visual-item\">{documentKey} - {name}</span>", "<br/><span class=\"j-text-label\">Project:</span> ", "{projectName}", _4e3, "</div>", "</div>", "</div>", "</tpl>", {textDirection:function(_4e5) {
        var text = (_4e5) ? "<img align=\"top\" style=\"padding-right: 10px;\" src=\"img/silk/arrow_right.png\"/>" + i18n.g("j.l.relateforward") : i18n.g("j.l.relateback") + "<img align=\"top\" style=\"padding-left: 10px;\" src=\"img/silk/arrow_right.png\"/>";
        return text;
    }});
    return _4e4;
},prepareData:function(data) {
    return {projectName:data.projectName,documentKey:data.documentKey,name:data.documentName,traceTypeName:(data.traceType) ? data.traceType.name : "",directionImage:data.forward ? "arrow_redo.png" : "arrow_undo.png",display:""};
},onClickRelate:function(view, _4e9, item, e) {
    var _4ec = view.el.dom;
    var _4ed = this.store.getAt(_4e9);
    var _4ee = null;
    var link = e.getTarget("a", _4ec);
    if (link != null) {
        var _4f0 = link.className;
        if (_4f0.indexOf("j-action-") != -1) {
            _4ee = _4f0.substr(9);
        }
    }
    this.onSelectItem(view, _4e9, _4ed, e, _4ee);
},onSelectItem:function(view, _4f2, _4f3, e, _4f5) {
    switch (_4f5) {
        case "switch":
            relationshipSvc.switchTraceDirection(_4f3.id, this.onSuccessAction.createDelegate(this));
            break;
        case "edit":
            this.editItem(_4f3);
            break;
        case "delete":
            var _4f6 = (_4f3.data.forward) ? {fromDocumentId:this.data.getItemId(),toDocumentId:_4f3.data.documentId} : {toDocumentId:this.data.getItemId(),fromDocumentId:_4f3.data.documentId};
            relationshipSvc.deleteTrace(_4f6, this.onSuccessAction.createDelegate(this));
            break;
    }
},editItem:function(_4f7) {
    this.fireEvent("editRelationship", _4f7);
},onSuccessAction:function() {
    this.fireEvent("refreshRelationshipViews");
},destroy:function() {
    if (this.loadMask && this.loadMask.destroy) {
        this.loadMask.destroy();
    }
    jx.view.ItemRelationshipView.superclass.destroy.call(this);
}});
Ext.reg("jx.view.ItemRelationshipView", jx.view.ItemRelationshipView);
jx.form.JamaBasicForm = function(_4f8) {
    _4f8 = Ext.applyIf(_4f8, {baseUrl:this.getAppContext().baseUrl,defaultDateFormat:this.getAppContext().getDayMonthYearFormat()});
    jx.form.JamaBasicForm.superclass.constructor.call(this, _4f8);
};
Ext.extend(jx.form.JamaBasicForm, Ext.Component, {project:"",item:null,baseUrl:"",fckOn:false,defaultDateFormat:"m/d/Y",alternateRows:false,separator:":",fields:[],tableClass:"j-form-table",headClass:"",tbodyClass:"",labelHeaderClass:"labelHeader",valueHeaderClass:"valueHeader",labelClass:"label",valueClass:"",labelAlign:"right",labelWidth:"20%",rowClass:"",rowAlternateClass:"alt",fieldDefinitions:null,getFieldFunc:null,setFieldFunc:null,readOnly:false,iconRequired:null,active:true,clickable:false,defaultTextHeight:"300px",defaultTextWidth:"100%",listenToFck:function() {
    if (!this.fckOn) {
        this.fckOn = true;
        jx.appContext.on("fckComplete", this.onFckComplete, this);
    }
},getTypeFromString:function(s) {
    var _4fa = s.split("."),i = 0,obj = dj_global;
    do{
        obj = obj[_4fa[i++]];
    } while (i < _4fa.length && obj);
    return (obj != dj_global) ? obj : null;
},_meta:{field:null,format:null,dataType:String,label:null,align:"left",valign:"top",getField:function() {
    return this.field || this.label;
},getType:function() {
    return this.dataType;
},idField:"id",displayField:"name",cls:null},setFieldDefinitions:function(_4fb) {
    delete this.fields;
    this.fields = [];
    for (var i = 0; i < _4fb.length; i++) {
        var _4fd = Ext.apply({}, _4fb[i]);
        this.fields.push(this.createMetaData(_4fd));
    }
    this.reconfig = true;
},createMetaData:function(obj) {
    for (var p in this._meta) {
        if (!obj[p]) {
            obj[p] = this._meta[p];
        }
    }
    if (!obj.label) {
        obj.label = obj.field;
    }
    return obj;
},createHeader:function(_500) {
    var head = this.domNode.getElementsByTagName("thead")[0];
    while (head.childNodes.length > 0) {
        head.removeChild(head.childNodes[0]);
    }
    DomHelper.append(head, {tag:"tr",children:[{tag:"td",cls:this.labelHeaderClass,html:"&nbsp;"},{tag:"td",cls:this.valueHeaderClass,html:"&nbsp;"}]});
},createRow:function(meta, item) {
    var tpls = this.templates;
    var _505 = tpls.rowTpl1;
    var _506 = tpls.rowTpl2;
    var _507 = tpls.rowTpl3;
    var _508;
    var _509 = this.tbody;
    var _50a = meta.separator || this.separator;
    var val = this.getFieldFunc(item, meta);
    var _50c = meta.required && !this.readOnly ? "*" + meta.label : meta.label;
    if (meta.labelAlign != "top") {
        var row1 = _505.append(_509, {labelCls:this.labelClass,labelValue:_50c,separator:_50a,align:meta.labelAlign || this.labelAlign,style:"width:" + (meta.labelWidth || this.labelWidth) + ";"});
        _508 = row1.childNodes[1];
    } else {
        _506.append(_509, {labelCls:this.labelClass,separator:_50a,labelValue:_50c});
        var row2 = _507.append(_509, {});
        _508 = row2.firstChild;
    }
    this.fillCell(_508, meta, val);
    return row1;
},fillCell:function(cell, meta, val) {
    if (this.readOnly || meta.readOnly) {
        this.fillCellReadOnly(cell, meta, val);
    } else {
        this.fillCellWithControl(cell, meta, val);
    }
},fillCellReadOnly:function(cell, meta, val) {
    if (meta.sortType == "__markup__") {
        cell.innerHTML = val;
    } else {
        if (meta.getType() == Date || meta.getType() == "date") {
            if (val) {
                val = new Date(val);
            }
            if (!isNaN(val) && val) {
                var _515 = meta.format || this.defaultDateFormat;
                cell.innerHTML = val.format(_515);
            } else {
                cell.innerHTML = "";
            }
        } else {
            if (meta.getType() == "Lookup" || meta.dataType == "lookup" || meta.dataType == "multiRadioBox" || (meta.getType() == "Integer" && meta.options)) {
                if (val) {
                    if (!val[meta.idField]) {
                        var val = this.getLookup(meta, val);
                    }
                    val = val ? val[meta.displayField] : "";
                    cell.appendChild(document.createTextNode(val));
                } else {
                    cell.innerHTML = "";
                }
            } else {
                if ("Number number int Integer float Float".indexOf(meta.getType()) > -1) {
                    if (val.length == 0) {
                        val = "0";
                    }
                    var n = parseFloat(val, 10) + "";
                    if (n.indexOf(".") > -1) {
                        n = Math.round(parseFloat(val, 10), 2);
                    }
                    cell.innerHTML = n;
                } else {
                    if (meta.getType() == "boolean") {
                        cell.appendChild(document.createTextNode(val ? "Yes" : "No"));
                    } else {
                        if (meta.getType() == "text") {
                            if (meta.controlTypeId == 2) {
                                cell.innerHTML = this.encodeTextForDisplay(val);
                            } else {
                                val = "<div class=\"j-text-box\">" + val + "</div>";
                                cell.innerHTML = val;
                            }
                        } else {
                            if (this.clickable && meta.label == "ID") {
                                cell.appendChild(this.makeValueHyperlink(val));
                            } else {
                                if (meta.inputType == "password") {
                                    val = this.createMask(val);
                                    cell.innerHTML = val;
                                } else {
                                    cell.innerHTML = val;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
},createMask:function(val) {
    var mask = "";
    if (val) {
        for (var i = 0,len = val.length; i < len; i++) {
            mask += "*";
        }
    }
    return mask;
},makeValueHyperlink:function(val) {
    return val;
},fillCellWithControl:function(cell, meta, val) {
    if (meta.sortType == "__markup__") {
        cell.innerHTML = val;
    } else {
        if (meta.getType() == Date || meta.getType() == "date") {
            if (!isNaN(val)) {
                var _51e = meta.format || this.defaultDateFormat;
                this.createDatePicker(cell, meta, _51e, val);
            } else {
                cell.innerHTML = "";
            }
        } else {
            if (meta.getType() == "Lookup" || meta.dataType == "lookup" || (meta.getType() == "Integer" && meta.options)) {
                this.createDropDown(cell, meta, val);
            } else {
                if ("Number number int Integer float Float".indexOf(meta.getType()) > -1) {
                    if (val.length == 0) {
                        val = "0";
                    }
                    var n = parseFloat(val, 10) + "";
                    if (n.indexOf(".") > -1) {
                        n = Math.round(parseFloat(val, 10), 2);
                    }
                    cell.innerHTML = n;
                } else {
                    if (meta.getType() == "boolean") {
                        this.createCheckBox(cell, meta, val);
                    } else {
                        if (meta.getType() == "multiCheckboxes") {
                            this.createMultiCheckboxes(cell, meta, val);
                        } else {
                            if (meta.getType() == "multiRadioBox") {
                                this.createMultiRadioBox(cell, meta, val);
                            } else {
                                if (meta.getType() == "text") {
                                    val = val ? val : "";
                                    if (meta.controlTypeId == 2) {
                                        this.createTextarea(cell, meta, val);
                                    } else {
                                        if (meta.controlTypeId == 3) {
                                            this.createFckRichText(cell, meta, val);
                                        } else {
                                            this.createFckRichText(cell, meta, val);
                                        }
                                    }
                                } else {
                                    this.createInputBox(cell, meta, val);
                                }
                            }
                        }
                    }
                }
            }
        }
        if (meta.required && this.iconRequired) {
            cell.appendChild(this.createImage(this.iconRequired));
        }
    }
},createDropDown:function(cell, meta, val) {
    var _523 = document.createElement("select");
    var _524 = meta.idField;
    var _525 = meta.displayField;
    for (var i = 0; i < meta.options.length; i++) {
        var _527 = meta.options[i];
        var ele = document.createElement("option");
        ele.value = _527[_524];
        ele.innerHTML = _527[_525];
        _523.appendChild(ele);
    }
    if (val) {
        _523.value = val ? (val[_524] ? val[_524] : val) : "";
    } else {
        var _529 = this.getLookupByDisplay(meta, "Select One");
        _523.value = _529 ? _529[meta.idField] : "";
    }
    cell.appendChild(_523);
    meta.control = _523;
},createMultiCheckboxes:function(cell, meta, val) {
    var _52d = meta.idField;
    var _52e = meta.displayField;
    var _52f = [];
    if (typeof (val) == "string") {
        _52f = val.split(" ");
    } else {
        if (meta.returnIds) {
            _52f = val;
        } else {
            for (var i = 0; i < val.length; i++) {
                _52f.push(val[i][_52d]);
            }
        }
    }
    var div = Ext.DomHelper.append(cell, {tag:"div",cls:"j-form-scroll-box",id:this.getEl().id + "_" + meta.field}, true);
    if (!this.checkboxTpl) {
        this.checkTpl = new Ext.Template("<input type=\"checkbox\" name=\"{fieldName}\" value=\"{id}\"" + "{checked}/>&nbsp;&nbsp;{name}<br/>");
    }
    var i,tpl = this.checkTpl;
    for (i = 0; i < meta.options.length; i++) {
        var _532 = meta.options[i];
        var _533 = (this.hasValue(_532[_52d], _52f)) ? "checked=\"checked\"" : "";
        tpl.append(div, {filedName:meta.field,id:_532[_52d],name:_532[_52e],checked:_533});
    }
    if (i < 7) {
        div.dom.style.height = i * 20 + "px";
    }
    meta.control = div.dom;
},hasValue:function(_534, _535) {
    for (var i in _535) {
        if (_535[i] == _534) {
            return true;
        }
    }
    return false;
},encodeTextForDisplay:function(text, _538) {
    if (text == undefined || text == null) {
        return text;
    }
    if (_538 == undefined) {
        _538 = "</br>";
    }
    text = text.replace(/\r\n/g, _538);
    text = text.replace(/\n/g, _538);
    text = text.replace(/\r/g, _538);
    return text;
},createInputBox:function(cell, meta, val) {
    var _53c = document.createElement("input");
    if (meta.inputType) {
        _53c.type = meta.inputType;
    } else {
        _53c.type = "text";
    }
    _53c.value = val;
    _53c.id = this.widgetId + "_" + meta.field;
    _53c.name = _53c.id;
    if (meta.size) {
        _53c.size = meta.size;
    } else {
        if (meta.style) {
            _53c.setAttribute("style", meta.style);
        } else {
            _53c.style.width = "99%";
        }
    }
    _53c.maxLength = meta.maxLength ? meta.maxLength : 255;
    cell.appendChild(_53c);
    meta.control = _53c;
},createTextarea:function(cell, meta, val) {
    var _540 = document.createElement("textarea");
    cell.appendChild(_540);
    _540.value = val;
    _540.id = this.widgetId + "_" + meta.field;
    _540.name = _540.id;
    _540.style.height = meta.height ? meta.height : 120;
    _540.style.width = meta.width ? meta.width : "99%";
    meta.control = _540;
},createHtmlEditor:function(cell, meta, val) {
    var _544 = document.createElement("div");
    cell.appendChild(_544);
    var _545 = new Ext.form.HtmlEditor({name:meta.field,width:meta.width ? meta.width : "100%",height:meta.height ? meta.height : 200});
    _545.render(_544);
    _545.setValue(val);
    meta.control = _545;
    meta.control.controlType = "htmleditor";
},createFckRichText:function(cell, meta, val) {
    this.listenToFck();
    var _549 = meta.height ? meta.height : this.defaultTextHeight;
    var id = this.getEl().id + "_" + meta.field;
    var div = Ext.DomHelper.append(cell, {tag:"div",style:"height:" + _549});
    var _54c = Ext.DomHelper.append(div, {tag:"textarea",id:id,name:id});
    var _54d = new Ext.Resizable(div, {handles:"s e",minWidth:100,minHeight:100,maxWidth:1024,maxHeight:1024,pinned:true,wrap:false});
    _54c.appendChild(document.createTextNode(val));
    var _54e = new FCKeditor(_54c.id);
    _54e.Config["CustomConfigurationsPath"] = this.baseUrl + "js/FCKconfigs/contourFCKEditor.js";
    _54e.BasePath = this.baseUrl + "js/FCKeditor/";
    if (meta.controlTypeId == 6) {
        _54e.ToolbarSet = "BasicJama";
    } else {
        _54e.ToolbarSet = "Jama";
    }
    _54e.Height = "100%";
    _54e.Width = "100%";
    _54e.top = "50px";
    _54e.ReplaceTextarea();
    meta.control = {controlType:"fck",instanceName:_54c.id,widget:_54d};
},createCheckBox:function(cell, meta, val) {
    var _552 = document.createElement("input");
    _552.type = "checkbox";
    cell.appendChild(_552);
    _552.value = "on";
    if (val) {
        _552.checked = val;
    }
    _552.id = this.widgetId + "_" + meta.field;
    _552.name = _552.id;
    meta.control = _552;
},createDatePicker:function(cell, meta, _555, val) {
    var _557 = document.createElement("div");
    cell.appendChild(_557);
    var _558 = new Ext.form.DateField({format:_555,allowBlank:true});
    _558.render(_557);
    _558.setValue(val);
    meta.control = _558;
    meta.widgetType = "ext";
},createMultiRadioBox:function(cell, meta, val) {
    var id = this.getEl().id;
    if (typeof (val) == "object") {
        val = val[meta.idField];
    }
    var div = Ext.DomHelper.append(cell, {tag:"div",cls:(meta.cls != null) ? meta.cls : "j-form-scroll-box",id:id + "_" + meta.field}, true);
    if (!this.radioTpl) {
        this.radioTpl = new Ext.Template("<input type=\"radio\" name=\"{fieldName}\" value=\"{value}\"" + "{checked}{disabled}/>&nbsp;&nbsp;{name}<br/>");
    }
    var i,tpl = this.radioTpl;
    var _55f = id + "_r_" + meta.field;
    for (i = 0; i < meta.options.length; i++) {
        var _560 = meta.options[i];
        var _561 = (val == _560[meta.idField]) ? "checked=\"checked\"" : "";
        var _562 = (_560.disable ? " disabled" : "");
        tpl.append(div, {fieldName:_55f,value:_560[meta.idField],name:_560[meta.displayField],checked:_561,disabled:_562});
    }
    meta.control = div.dom;
},createImage:function(_563) {
    var _564 = document.createElement("img");
    _564.src = _563;
    _564.alt = "required";
    return _564;
},getLookup:function(meta, val) {
    var _567 = null;
    if (val) {
        for (var i in meta.options) {
            var _569 = meta.options[i];
            if (_569[meta.idField] == val) {
                _567 = _569;
                break;
            }
        }
    }
    return _567;
},getLookupByDisplay:function(meta, val) {
    var _56c = null;
    if (val) {
        for (var i in meta.options) {
            var _56e = meta.options[i];
            if (_56e[meta.displayField] == val) {
                _56c = _56e;
                break;
            }
        }
    }
    return _56c;
},getMultiCheckboxesValues:function(meta, val) {
    var _571 = meta.control.getElementsByTagName("input");
    var _572 = [];
    var _573 = meta.idField;
    for (var i = 0; i < _571.length; i++) {
        var _575 = _571[i];
        if (_575.checked) {
            if (meta.returnIds || meta.returnString) {
                _572.push(_575.value);
            } else {
                var obj = {};
                obj[_573] = _575.value;
                _572.push(obj);
            }
        }
    }
    if (meta.returnString) {
        return _572.join(" ");
    } else {
        return _572;
    }
},getMultiRadioBoxValue:function(meta, val) {
    var _579 = meta.control.getElementsByTagName("input");
    var _57a = null;
    for (var i = 0; i < _579.length; i++) {
        var _57c = _579[i];
        if (_57c.checked) {
            _57a = _57c.value;
            break;
        }
    }
    return _57a;
},getFieldMeta:function(name) {
    for (var i = 0; i < this.fields.length; i++) {
        var meta = this.fields[i];
        if (meta.field == name) {
            return meta;
        }
    }
    return null;
},getField:function(obj, meta) {
    var name = meta.field;
    var _583 = meta.mapping;
    var _584 = null;
    if (_583) {
        _584 = _583(obj);
    } else {
        _584 = obj[name];
    }
    if (typeof _584 == "boolean") {
        return _584;
    }
    return _584 ? _584 : "";
},setField:function(obj, meta, _587) {
    obj[meta.field] = _587;
},encodeTextForTextarea:function(text, _589) {
    if (text == undefined || text == null) {
        return text;
    }
    if (_589 == undefined) {
        _589 = "</br>";
    }
    text = text.replace(/\r\n/g, _589);
    text = text.replace(/\n/g, _589);
    text = text.replace(/\r/g, _589);
    return text;
},getUpdatedItem:function() {
    var item = this.cloneItem(this.item);
    for (var i = 0; i < this.fields.length; i++) {
        var meta = this.fields[i];
        if (meta.control) {
            var _58d;
            if (meta.dataType == Date || meta.dataType == "date") {
                if (meta.control.getValue()) {
                    _58d = meta.control.getValue();
                } else {
                    _58d = null;
                }
            } else {
                if (meta.dataType == "lookup" || meta.dataType == "Lookup") {
                    _58d = this.getLookup(meta, meta.control.value);
                    if (_58d) {
                        _58d = {id:_58d.id,name:_58d.name,firstName:_58d.firstName,lastName:_58d.lastName};
                    }
                } else {
                    if (meta.dataType == "multiCheckboxes") {
                        _58d = this.getMultiCheckboxesValues(meta);
                    } else {
                        if (meta.dataType == "multiRadioBox") {
                            _58d = this.getMultiRadioBoxValue(meta);
                        } else {
                            if (meta.dataType == "boolean") {
                                _58d = meta.control.checked;
                            } else {
                                if (meta.dataType == "text") {
                                    if (meta.control.controlType == "fck") {
                                        var _58e = FCKeditorAPI.GetInstance(meta.control.instanceName);
                                        if (_58e.IsDirty()) {
                                            _58d = _58e.GetXHTML();
                                        } else {
                                            _58d = this.getFieldFunc(item, meta);
                                        }
                                    } else {
                                        if (meta.control.controlType == "htmleditor") {
                                            _58d = meta.control.getValue();
                                        } else {
                                            _58d = meta.control.value;
                                        }
                                    }
                                } else {
                                    _58d = meta.control.value;
                                }
                            }
                        }
                    }
                }
            }
            this.setFieldFunc(item, meta, _58d);
        }
    }
    return item;
},setFocus:function() {
    if (this.readOnly) {
        return;
    }
    for (var i = 0; i < this.fields.length; i++) {
        var meta = this.fields[i];
        if (meta.control) {
            var _591 = meta.control.tagName;
            if (_591 == "INPUT" || _591 == "SELECT" || _591 == "TEXTAREA") {
                meta.control.focus();
                break;
            }
        }
    }
},onFckComplete:function(_592) {
    var _593 = 0;
    for (var i in this.fields) {
        var meta = this.fields[i];
        if (meta.control && meta.control.controlType == "fck") {
            _593++;
        }
        if (meta.control && meta.control.controlType == "fck" && meta.control.instanceName == _592) {
            var _596 = FCKeditorAPI.GetInstance(_592);
            var _597 = this.project ? this.project.id : "";
            _596.Config.ImageBrowserURL = _596.Config.BasePath + "filemanager/browser/default/browser.html?" + "Type=Image&Connector=" + escape("../../../../../../fck.req?projectId=" + _597);
            _596.Config.LinkBrowserURL = _596.Config.BasePath + "filemanager/browser/default/browser.html?" + "Type=Link&Connector=" + escape("../../../../../../fck.req?projectId=" + _597);
            _596.Config.ImageUploadURL = "../../../../fck.req?Type=Image&Command=FileUpload&projectId=" + _597;
            _596.Config.LinkUploadURL = "../../../../fck.req?Type=Link&Command=FileUpload&projectId=" + _597;
            meta.control.ready = true;
            if (Ext.isIE && _593 == 1) {
                var _596 = FCKeditorAPI.GetInstance(_592);
                _596.InsertHtml("");
            }
        }
    }
},checkFckComplete:function() {
    var _598 = true;
    for (var i in this.fields) {
        var meta = this.fields[i];
        if (meta.control && meta.control.controlType == "fck" && !meta.control.ready) {
            _598 = false;
            break;
        }
    }
    return _598;
},isReady:function() {
    return this.checkFckComplete();
},getItemChanges:function() {
    if (this.readOnly) {
        return null;
    }
    var _59b = "";
    if (!this.active) {
        return false;
    }
    var _59c = this.getUpdatedItem();
    for (var i in this.fields) {
        var meta = this.fields[i];
        var _59f = this.item[meta.field];
        var _5a0 = _59c[meta.field];
        var _5a1 = false;
        if (meta.dataType == "Lookup") {
            if (_59f == null) {
                _5a1 = (_5a0 != null);
            } else {
                if (_5a0 == null) {
                    _5a1 = (_59f != null);
                } else {
                    _5a1 = (_59f.id != _5a0.id);
                }
            }
        } else {
            if (!_59f && !_5a0) {
                _5a1 = false;
            } else {
                _5a1 = (_59f != _5a0);
            }
        }
        if (_5a1) {
            if (_59b) {
                _59b += ", ";
            }
            _59b += meta.label;
        }
    }
    return _59b;
},cloneItem:function(item) {
    return Ext.apply({}, item);
},destroyWidgetControls:function() {
    if (!this.checkFckComplete()) {
        return false;
    }
    for (var j = 0; j < this.fields.length; j++) {
        var meta = this.fields[j];
        if (meta.control && meta.control.widgetType == "ext") {
            Ext.destroy(meta.control);
        } else {
            if (meta.control && meta.control.controlType == "fck") {
                if (meta.control.widget && meta.ready) {
                    meta.control.widget.destroy();
                }
            }
        }
    }
    return true;
},setItem:function(item) {
    this.removeFields();
    this.item = item;
    this.renderRows(this.tbody, item);
    this.reconfig = false;
},removeFields:function() {
    var body = Ext.getDom(this.tbody);
    while (body.childNodes.length > 0) {
        body.removeChild(body.childNodes[0]);
    }
    this.destroyWidgetControls();
},setValues:function(item) {
    if (this.reconfig) {
        this.setValues(item);
    } else {
        for (var i = 0; i < this.fields.length; i++) {
            var meta = this.fields[i];
            if (meta.control) {
                val = this.getFieldFunc(item, meta);
                if (meta.dataType == Date || meta.dataType == "date") {
                    meta.control.setValue(value);
                } else {
                    if (meta.dataType == "lookup" || meta.dataType == "Lookup") {
                        meta.contorl.setValue(value ? value.id : null);
                    } else {
                        if (meta.dataType == "multiCheckboxes") {
                            value = this.getMultiCheckboxesValues(meta);
                        } else {
                            if (meta.dataType == "multiRadioBox") {
                                value = this.getMultiRadioBoxValue(meta);
                            } else {
                                if (meta.dataType == "boolean") {
                                    meta.control.checked = value;
                                } else {
                                    if (meta.dataType == "text") {
                                        if (meta.control.controlType == "fck") {
                                            var _5aa = FCKeditorAPI.GetInstance(meta.control.instanceName);
                                            value = _5aa.setXHTML(value);
                                        } else {
                                            if (meta.control.controlType == "htmleditor") {
                                                meta.control.setValue(value);
                                            } else {
                                                meta.control.value = value;
                                            }
                                        }
                                    } else {
                                        meta.control.value = value;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
},renderRows:function(body, item) {
    for (var j = 0; j < this.fields.length; j++) {
        var meta = this.fields[j];
        if (!meta.hidden && !(this.readOnly && meta.hideReadOnly)) {
            this.createRow(meta, item);
        }
    }
},initTemplates:function() {
    if (!this.templates) {
        if (!jx.form.JamaBasicForm.tpls) {
            jx.form.JamaBasicForm.tpls = {};
            var tpls = jx.form.JamaBasicForm.tpls;
            tpls.rowTpl1 = new Ext.Template("<tr><td class=\"{labelCls}\" align=\"{align}\" style=\"{style}\">{labelValue}{separator}</td><td></td></tr>");
            tpls.rowTpl2 = new Ext.Template("<tr><td class=\"{labelCls}\" colspan=\"2\">{labelValue}{separator}</td></tr>");
            tpls.rowTpl3 = new Ext.Template("<tr><td colspan=\"2\"></td></tr>");
        }
        this.templates = jx.form.JamaBasicForm.tpls;
    }
},getHeaderPanel:function(_5b0) {
    if (_5b0) {
        this.headerPanel.show();
    }
    return this.headerPanel;
},onRender:function(ct, _5b2) {
    ct = Ext.get(ct);
    this.headerPanel = Ext.DomHelper.append(ct, "<div class=\"x-grid-topbar contourComponentTop\"></div>", true);
    this.headerPanel.enableDisplayMode("block");
    this.el = ct.createChild({tag:"table",cls:this.tableClass,id:this.id || Ext.id()});
    this.table = this.el;
    this.domNode = this.el.dom;
    this.tbody = Ext.DomHelper.append(this.table, {tag:"tbody"});
    if (this.fieldDefinitions) {
        this.setFieldDefinitions(this.fieldDefinitions);
    }
    if (this.getFieldFunc == null) {
        this.getFieldFunc = this.getField;
    }
    if (this.setFieldFunc == null) {
        this.setFieldFunc = this.setField;
    }
    this.initTemplates();
},beforeDestroy:function() {
    this.destroyWidgetControls();
    jx.form.JamaBasicForm.superclass.beforeDestroy.apply(this, arguments);
}});
function FCKeditor_OnComplete(_5b3) {
    jx.appContext.fireEvent("fckComplete", _5b3.Name);
}
jx.form.JamaForm = function(_5b4) {
    jx.form.JamaForm.superclass.constructor.call(this, _5b4);
};
Ext.extend(jx.form.JamaForm, jx.form.JamaBasicForm, {title:"",titlePanel:null,buttonPanel:null,editButton:null,cancelButton:null,saveButton:null,buttonList:new Array(),errorRow:null,errorPanel:null,editButtonLabel:"Edit",cancelButtonLabel:"Cancel",saveButtonLabel:"Save",formType:"both",showButtons:true,showTitle:true,buttonPanelAlign:"left",errorPanelAlign:"left",titlePanelAlign:"left",buttonPanelLocation:"bottom",buttonClass:"button",buttonPanelClass:"buttonPanel",errorPanelClass:"errorPanel",titlePanelClass:"titlePanel",createButtonPanel:function() {
    var _5b5 = document.createElement("td");
    _5b5.setAttribute("align", this.buttonPanelAlign);
    this.editButton = this.createButton(_5b5, "edit", this.editButtonLabel);
    this.saveButton = this.createButton(_5b5, "save", this.saveButtonLabel);
    this.cancelButton = this.createButton(_5b5, "cancel", this.cancelButtonLabel);
    this.editButton.on("click", this.onEdit, this);
    this.cancelButton.on("click", this.onCancel, this);
    this.saveButton.on("click", this.onSave, this);
    if (this.readOnly) {
        this.cancelButton.hide();
        this.saveButton.hide();
    } else {
        this.editButton.hide();
    }
    if (this.buttonPanelClass) {
        _5b5.className = this.buttonPanelClass;
    }
    return _5b5;
},createErrorPanel:function() {
    var _5b6 = document.createElement("td");
    _5b6.setAttribute("align", this.errorPanelAlign);
    if (this.errorPanelClass) {
        _5b6.className = this.errorPanelClass;
    }
    return _5b6;
},createTitlePanel:function() {
    var _5b7 = document.createElement("td");
    _5b7.setAttribute("align", this.titlePanelAlign);
    if (this.titlePanelClass) {
        _5b7.className = this.titlePanelClass;
    }
    _5b7.innerHTML = this.title;
    return _5b7;
},createErrorRow:function() {
    var row = document.createElement("tr");
    this.errorPanel.setAttribute("colSpan", 2);
    row.appendChild(this.errorPanel);
    return new Ext.Element(row);
},createTitleRow:function() {
    var row = null;
    if (this.showTitle || (this.showButtons && this.buttonPanelLocation == "top")) {
        row = document.createElement("tr");
        td = document.createElement("td");
        td.setAttribute("colSpan", 2);
        row.appendChild(td);
        var _5ba = document.createElement("table");
        _5ba.setAttribute("width", "100%");
        var _5bb = document.createElement("tbody");
        var _5bc = document.createElement("tr");
        if (this.showTitle) {
            _5bc.appendChild(this.titlePanel);
        }
        if (this.showButtons && this.buttonPanelLocation == "top") {
            _5bc.appendChild(this.buttonPanel);
        }
        _5ba.appendChild(_5bb);
        _5bb.appendChild(_5bc);
        td.appendChild(_5ba);
    }
    return row;
},createFooterRow:function() {
    var row = null;
    if (this.showButtons && this.buttonPanelLocation == "bottom") {
        row = document.createElement("tr");
        this.buttonPanel.setAttribute("colspan", 2);
        row.appendChild(this.buttonPanel);
    }
    return row;
},createButton:function(_5be, _5bf, _5c0) {
    var _5c1 = Ext.DomHelper.append(_5be, {tag:"input",type:"button",value:_5c0,name:this.widgetId + "_" + _5bf,cls:this.buttonClass}, true);
    return _5c1;
},onEdit:function(e) {
    if (this.formType == "both") {
        this.readOnly = false;
        this.setItem(this.item);
        this.editButton.hide();
        this.saveButton.show();
        this.cancelButton.show();
    }
},onCancel:function(e) {
    if (this.formType == "both") {
        this.readOnly = true;
        this.setItem(this.item);
        this.editButton.show();
        this.saveButton.hide();
        this.cancelButton.hide();
    }
},displayErrorMessages:function(_5c4) {
    if (this.errorRow) {
        this.errorRow.show();
        var _5c5 = "";
        for (var i = 0; i < _5c4.length; i++) {
            _5c5 += "Note: " + _5c4[i] + "<br/>";
        }
        this.errorPanel.innerHTML = _5c5;
    }
},clearErrorMessages:function() {
    if (this.errorRow) {
        this.errorRow.hide();
        this.errorPanel.innerHTML = "";
    }
},onSave:function(e) {
    this.doOnSave(this.getUpdatedItem());
},doOnSave:function(item) {
    this.fireEvent("save", this, item);
},dwrSave:function(_5c9, item) {
    _5c9(item, {callback:this.saveCallback.createDelegate(this),errorHandler:this.handleException.createDelegate(this)});
},saveCallback:function(item) {
    if (item) {
        this.item = item;
    } else {
        this.item = this.getUpdatedItem();
    }
    this.onCancel();
    this.fireEvent("afterSave", this, item ? item : this.item);
},handleException:function(msg, ex) {
    var _5ce = ex.errors;
    if (_5ce != null && _5ce.length > 0) {
        this.displayErrorMessages(_5ce);
    }
},setItem:function(item) {
    var body = this.tbody;
    if (!this.isReady()) {
        return;
    }
    this.removeFields();
    this.item = item;
    this.errorRow = this.createErrorRow();
    var _5d1 = this.createTitleRow();
    var _5d2 = this.createFooterRow();
    if (!this.readOnly) {
        body.appendChild(this.errorRow.dom);
        this.errorRow.hide();
    }
    if (this.showButtons) {
        this.editButton[this.readOnly ? "show" : "hide"]();
        this.saveButton[!this.readOnly ? "show" : "hide"]();
        this.cancelButton[!this.readOnly ? "show" : "hide"]();
    }
    this.renderRows(body, item);
    if (_5d1) {
        if (body.firstChild) {
            body.insertBefore(_5d1, body.firstChild);
        } else {
            body.appendChild(_5d1);
        }
    }
    if (_5d2) {
        body.appendChild(_5d2);
    }
},onRender:function(ct, _5d4) {
    jx.form.JamaForm.superclass.onRender.call(this, ct, _5d4);
    this.readOnly = (this.formType != "editOnly");
    this.buttonPanel = this.createButtonPanel();
    this.errorPanel = this.createErrorPanel();
    this.titlePanel = this.createTitlePanel();
},setMask:function() {
    if (this.container) {
        this.container.mask("Loading...");
    }
},unmask:function() {
    if (this.container) {
        this.container.unmask();
    }
}});
jx.form.DwrJamaForm = function(_5d5) {
    jx.form.DwrJamaForm.superclass.constructor.call(this, _5d5);
};
Ext.extend(jx.form.DwrJamaForm, jx.form.JamaForm, {dwrArgs:null,dwrLoadCall:null,dwrSaveCall:null,load:function() {
    var _5d6 = new Array();
    if (this.dwrArgs) {
        _5d6 = this.dwrArgs.slice();
    }
    var _5d7 = this.setItem.createDelegate(this);
    _5d6.push(_5d7);
    this.dwrLoadCall.apply(this, _5d6);
},onSave:function(e) {
    var item = this.getUpdatedItem();
    this.dwrSaveCall(item, {callback:this.saveCallback.createDelegate(this),errorHandler:this.handleException.createDelegate(this)});
},saveCallback:function(item) {
    if (item) {
        this.item = item;
    } else {
        this.item = this.getUpdatedItem();
    }
    this.onCancel();
},handleException:function(msg, ex) {
    var _5dd = ex.errors;
    if (_5dd != null && _5dd.length > 0) {
        this.displayErrorMessages(_5dd);
    }
}});
jx.form.UserForm = function(_5de) {
    Ext.applyIf(_5de, {formType:"editOnly",showButtons:false,showTitle:false,title:"User Form",alternateRows:false,labelClass:"label"});
    jx.form.UserForm.superclass.constructor.call(this, _5de);
    this.fieldDefinitions = this.getFormDefinitions();
};
Ext.extend(jx.form.UserForm, jx.form.JamaForm, {mode:"ldap",orgId:null,refreshForm:function(mode) {
    if (mode) {
        this.mode = mode;
    }
    this.setFieldDefinitions(this.getFormDefinitions());
},getFormDefinitions:function() {
    var that = this;
    lookup.getLookupListByTypeCategory(1, 1, 0, {callback:function(list) {
        that.themeList = list;
    },async:false});
    lookup.getLookupListByTypeCategory(2, 1, 0, {callback:function(list) {
        that.languageList = list;
    },async:false});
    user.getAllRoleListByOrgId(this.orgId, {callback:function(list) {
        that.roleList = list;
    },async:false});
    var _5e4 = this.getLicenseList();
    var list = [];
    if (this.mode == "new") {
        list.push({field:"userName",label:"User ID",readOnly:false,required:true});
        list.push({field:"password",label:"Password",inputType:"password",required:true});
        list.push({field:"repeatedPassword",label:"Repeated Password",inputType:"password",required:true});
    } else {
        list.push({field:"userName",label:"User ID",readOnly:true,required:true});
    }
    list.push({field:"firstName",label:"First Name",required:true});
    list.push({field:"lastName",label:"Last Name",required:true});
    list.push({field:"locale",label:"Language",dataType:"lookup",idField:"name",options:this.languageList});
    list.push({field:"theme",label:"Theme",dataType:"lookup",idField:"name",options:this.themeList});
    list.push({field:"email",label:"Email Address",required:true});
    if (this.mode != "myProfile") {
        list.push({field:"licenseType",label:"License Type",dataType:"multiRadioBox",options:_5e4,required:true});
        list.push({field:"roles",label:"User Groups",dataType:"multiCheckboxes",options:this.roleList,idField:"id",displayField:"display",required:true});
    }
    if (this.mode == "new") {
        list.push({field:"sendEmail",label:"Send Email to New User",dataType:"boolean"});
    }
    return list;
},getLicenseList:function() {
    if (this.orgId) {
        var self = this;
        licenseSvc.getSystemLicenseDto(this.orgId, {callback:function(info) {
            self.licenseInfo = info;
        },async:false});
    } else {
        this.licenseInfo = {};
    }
    var _5e8 = this.licenseInfo;
    var _5e9 = (_5e8.numberNamed >= 0) && (_5e8.numberNamed <= _5e8.numberUsersNamed);
    var _5ea = (_5e8.numberConcurrent == 0);
    return [{id:"N",name:"Named User",disable:_5e9},{id:"C",name:"Concurrent User",disable:_5ea},{id:"R",name:"Read Only"}];
},render:function() {
    jx.form.UserForm.superclass.render.apply(this, arguments);
    this.on("save", this.updateUser, this);
    user.getUserWithRoles(this.getAppContext().user.id, this.getUserCallback.createDelegate(this));
},getUserCallback:function(user) {
    this.setItem(user);
},updateUser:function() {
    var item = this.getUpdatedItem();
    item.repeatedPassword = item.password;
    item.theme = item.theme ? item.theme.name : "";
    item.locale = item.locale ? item.locale.name : "";
    if (this.validate(item, this)) {
        this.clearErrorMessages();
        this.dwrSave(user.updateUserProfile, item);
    }
},validate:function(item, form) {
    var self = this;
    validation.validateUser(item, {callback:function(_5f0) {
        self.errors = _5f0;
    },async:false});
    if (this.errors && this.errors.length > 0) {
        form.displayErrorMessages(this.errors);
        return false;
    }
    return true;
}});
Ext.reg("jx.form.UserForm", jx.form.UserForm);
jx.form.OrganizationForm = function(_5f1) {
    Ext.applyIf(_5f1, {formType:"both",showButtons:true,showTitle:false,title:"Organization Form",alternateRows:false,labelClass:"label",fieldDefinitions:this.getFormDefinitions()});
    jx.form.OrganizationForm.superclass.constructor.call(this, _5f1);
};
Ext.extend(jx.form.OrganizationForm, jx.form.JamaForm, {org:null,getFormDefinitions:function() {
    return ([{field:"name",label:"Organization Name",required:true},{field:"description",label:"Description"},{field:"returnEmail",label:"Return Email"},{field:"baseUrl",label:"Base Url"}]);
},validate:function(item) {
    var self = this;
    validation.validateOrganization(item, {callback:function(_5f4) {
        self.errors = _5f4;
    },async:false});
    if (this.errors && this.errors.length > 0) {
        this.displayErrorMessages(this.errors);
        return false;
    }
    this.clearErrorMessages();
    return true;
},doOnSave:function(item) {
    if (this.validate(item)) {
        admin.saveOrganization(item, {callback:this.saveCallback.createDelegate(this),errorHandler:this.handleException.createDelegate(this)});
    }
},render:function() {
    jx.form.OrganizationForm.superclass.render.apply(this, arguments);
    if (this.org) {
        this.setItem(this.org);
    }
}});
Ext.reg("jx.form.OrganizationForm", jx.form.OrganizationForm);
jx.window.ProjectFormWindow = function(_5f6) {
    _5f6 = Ext.applyIf(_5f6, {title:_5f6.project.isFolder ? "Add Project Folder" : i18n.g("j.l.projectFormTitle"),width:"90%",height:500,modal:true,closable:true,closeAction:"destroy",cancelAction:"destroy",constrain:true,maximizable:true,minimizable:false,buttons:[{text:i18n.g("j.b.projectSave"),handler:this.saveProject,scope:this},{text:i18n.g("j.b.projectCancel"),handler:this.onCancel,scope:this}],layout:"fit",items:[this.createProjectForm()]});
    jx.window.ProjectFormWindow.superclass.constructor.call(this, _5f6);
};
Ext.extend(jx.window.ProjectFormWindow, Ext.Window, {project:null,event:null,initComponent:function() {
    jx.window.ProjectFormWindow.superclass.initComponent.call(this);
    this.getAppContext().on("afterSaveProject", this.onAfterSaveProject, this);
},onEvent:function(e) {
    this.onEditProject(e);
},createProjectForm:function() {
    var _5f8 = new jx.form.ProjectForm({formType:"editOnly"});
    var _5f9 = new Ext.Panel({items:[_5f8],autoScroll:true});
    this.projectForm = _5f8;
    return _5f9;
},onAfterSaveProject:function(_5fa) {
    if (this.event && this.event.source) {
        if (this.event.sourceType == "grid") {
            this.event.source.refresh(false);
        }
    }
    this.close();
},onEditProject:function(e) {
    this.event = e;
    this.show();
    var _5fc = null;
    this.project = e.data.project;
    this.projectForm.isFolder = e.data.project.isFolder;
    this.editProject(this.project);
},editProject:function(_5fd) {
    this.projectForm.loadProject(_5fd);
},saveProject:function() {
    if (!this.projectForm.validateForm()) {
        return;
    }
    this.projectForm.saveProject();
},getParentId:function() {
    var node = this.groupTree.getSelectionModel().getSelectedNode();
    var _5ff = null;
    if (node) {
        _5ff = node.id;
        if (_5ff && _5ff.charAt(0) == "a") {
            _5ff = _5ff.substring(2);
        }
    }
    return _5ff;
},parseNode:function(node) {
    if (node) {
        var _601 = node.attributes.groupId;
        var _602 = node.isLeaf() ? node.parentNode : node;
        var id = _602.id;
        var _604 = id.charAt(0) == "g" ? null : id.substring(2);
        var path = _602.getPath();
        var _606 = path.indexOf("/g");
        if (_606 > 0) {
            path = path.substring(_606);
        }
        return {groupId:_601,parentId:_604,parentPath:path};
    }
    return null;
},destroy:function() {
    if (this.projectForm) {
        this.projectForm.destroy();
    }
    jx.window.ProjectFormWindow.superclass.destroy.apply(this, arguments);
}});
Ext.reg("jx.window.ProjectFormWindow", jx.window.ProjectFormWindow);
jx.window.ProjectCopyWindow = function(_607) {
    _607 = Ext.applyIf(_607, {title:i18n.g("j.l.projectCopyTitle"),height:300,width:700,modal:true,closable:true,closeAction:"destroy",cancelAction:"destroy",maximizable:true,minimizable:false,layout:"fit",items:[this.createCopyForm()],buttons:[{text:i18n.g("j.b.projectCopySave"),handler:this.copyProject,id:"p-copy-save-button",scope:this},{text:i18n.g("j.b.projectCopyCancel"),handler:this.onCancel,id:"p-copy-cancel-button",scope:this}]});
    jx.window.ProjectCopyWindow.superclass.constructor.call(this, _607);
};
Ext.extend(jx.window.ProjectCopyWindow, Ext.Window, {project:null,form:null,copyRelateFieldList:[],initComponent:function() {
    jx.window.ProjectCopyWindow.superclass.initComponent.call(this);
},createCopyForm:function() {
    var that = this;
    lookup.getLookupListByTypeCategory(1024, 2, this.getAppContext().organization.id, {callback:function(list) {
        that.relationshipType = list;
    },async:false});
    var _60a = new jx.data.SimpleListStore({fields:[{name:"id",type:"int"},{name:"name",type:"string"}],data:this.relationshipType});
    var _60b = new Ext.form.Checkbox({name:"cppCreateRelationships",style:"align: left",fieldLabel:i18n.g("j.l.projectCopyCreateRelationships"),id:"p-copy-form-chkbox-createrelate"});
    var _60c = new Ext.form.ComboBox({fieldLabel:i18n.g("j.l.projectCopyRelationshipType"),store:_60a,displayField:"name",valueField:"id",mode:"local",id:"p-copy-form-combo-relatetype",triggerAction:"all",selectOnFocus:true,disabled:true,editable:false,forceSelection:true});
    this.copyRelateFieldList.push(_60c);
    var _60d = new Ext.form.Radio({fieldLabel:i18n.g("j.l.projectCopyTraceToOriginal"),checked:true,disabled:true,name:"relationshipDirection",inputType:"radio",id:"p-copy-form-radio-forward",inputValue:"forward"});
    this.copyRelateFieldList.push(_60d);
    var _60e = new Ext.form.Radio({fieldLabel:i18n.g("j.l.projectCopyTraceToCopy"),checked:false,disabled:true,name:"relationshipDirection",inputType:"radio",id:"p-copy-form-radio-backward",inputValue:"backward"});
    this.copyRelateFieldList.push(_60e);
    this.form = new Ext.form.FormPanel({labelAlign:"right",bodyBorder:false,border:false,bodyStyle:"padding:5px 5px 0",id:"p-copy-form",labelWidth:200,items:[{xtype:"textfield",fieldLabel:i18n.g("j.l.projectCopyNewProjectName"),id:"p-copy-form-txtfield-projectname",name:"cppProjectName",width:300},{layout:"column",bodyBorder:false,border:false,items:[{columnWidth:0.4,xtype:"fieldset",title:i18n.g("j.l.projectCopyIncludedItems"),layout:"form",items:[{xtype:"checkbox",fieldLabel:i18n.g("j.l.projectCopyProjectSettings"),id:"p-copy-form-chkbox-projectsettings",name:"cppProjectSettings"},{xtype:"checkbox",fieldLabel:i18n.g("j.l.projectCopyEmailGroups"),name:"cppEmailGroups",id:"p-copy-form-chkbox-emailgroups"},{xtype:"checkbox",fieldLabel:i18n.g("j.l.projectCopyProjectPermissions"),name:"cppProjectPermissions",id:"p-copy-form-chkbox-projectpermissions"},{xtype:"checkbox",fieldLabel:i18n.g("j.l.projectCopyExistingRelationships"),name:"cppExistingRelationships",id:"p-copy-form-chkbox-existingrelate"},{xtype:"checkbox",fieldLabel:i18n.g("j.l.projectCopySharedFilters"),name:"cppSharedFilters",id:"p-copy-form-chkbox-filters"},{xtype:"checkbox",fieldLabel:i18n.g("j.l.projectCopyTags"),name:"cppTags",id:"p-copy-form-chkbox-tags"},{xtype:"checkbox",fieldLabel:i18n.g("j.l.projectCopyReleases"),name:"cppReleases",id:"p-copy-form-chkbox-releases"}]},{columnWidth:0.6,xtype:"fieldset",style:"margin-left:5px",title:i18n.g("j.l.projectCopyCreateRelationshipsSection"),layout:"form",items:[_60b,_60d,_60e,_60c]}]}]});
    _60c.setValue(this.relationshipType[0].id);
    _60b.on("check", this.onRelationshipCheckbox, this);
    return this.form;
},onRelationshipCheckbox:function(_60f, _610) {
    for (var _611 = 0; _611 < this.copyRelateFieldList.length; _611++) {
        if (_610) {
            this.copyRelateFieldList[_611].enable();
        } else {
            this.copyRelateFieldList[_611].disable();
        }
    }
},copyProject:function() {
    this.createLoadingMessageBox("Copying the project");
    var map = this.form.getForm().getValues();
    project.copyProject(this.project.id, map["cppProjectName"], map, {callback:this.onSuccessCopyProject.createDelegate(this),exceptionHandler:this.onExceptionCopyProject.createDelegate(this)});
},createLoadingMessageBox:function(_613) {
    this.messageBox = Ext.MessageBox.show({title:"Please wait...",msg:_613,width:300,closable:false,animEl:"home-tab"});
    var f = function(_615, text, obj) {
        return function() {
            if (obj.loadingMessage) {
                if (text.length > 200) {
                    text = "";
                } else {
                    text = text + ". ";
                }
                setTimeout(f(_615, text, obj), 1 * 1000);
                obj.messageBox.updateText(_615 + text);
            }
        };
    };
    var text = "";
    var that = this;
    that.loadingMessage = true;
    setTimeout(f(_613, text, that), 1 * 1000);
},onSuccessCopyProject:function(_61a) {
    this.loadingMessage = false;
    this.messageBox.hide();
    this.onCancel();
    this.getAppContext().fireEvent("showMessage", "Success", "The project has been copied");
    this.getAppContext().fireEvent("refreshProjectList");
},onExceptionCopyProject:function(_61b, _61c) {
    this.loadingMessage = false;
    Ext.MessageBox.alert("Error", "The copy project did not complete successfully. Nothing has been changed.");
}});
jx.form.ProjectForm = function(_61d) {
    _61d = Ext.applyIf(_61d, {formType:"readOnly",showButtons:false});
    jx.form.ProjectForm.superclass.constructor.call(this, _61d);
};
Ext.extend(jx.form.ProjectForm, jx.form.JamaForm, {orgId:null,projectId:null,parentId:null,isFolder:false,loadProject:function(_61e) {
    if (_61e != null && _61e.id != null) {
        this.loadProjectCallback(_61e);
    } else {
        var _61f = this.loadNewProjectCallback.createDelegate(this);
        projectTypeSvc.getProjectTypeMetaDataByOrg(this.getAppContext().organization.id, {callback:_61f});
    }
},loadProjectCallback:function(item) {
    this.fieldDefinitions = item.fieldList;
    this.isFolder = item.isFolder;
    this.parentId = item.parent;
    this.load(item, item.projectTypeDto);
    this.fireEvent("afterLoadProject", item);
},loadNewProjectCallback:function(meta) {
    this.fieldDefinitions = meta.fieldList;
    var item = {isFolder:this.isFolder};
    this.load(item, meta);
    this.onEdit();
},load:function(item, meta) {
    if (item.isFolder) {
        meta.fieldList = this.filterFieldsForFolder(meta.fieldList);
    }
    this.setFieldDefinitions(meta.fieldList);
    this.setItem(item);
},onSave:function() {
    var item = this.getUpdatedItem();
    var _626 = this.validateProject(item);
    if (_626.length > 0) {
        this.displayErrorMessages(_626);
    } else {
        this.clearErrorMessages();
        this.saveProject();
    }
},validateProject:function(item) {
    var _628 = [];
    for (var _629 = 0; _629 < this.fields.length; _629++) {
        var _62a = this.fields[_629];
        if (_62a.required) {
            if (item[_62a.field] == "") {
                _628.push(_62a.label + " is required");
            }
        }
    }
    return _628;
},saveProject:function() {
    var item = this.getUpdatedItem();
    item.parent = this.parentId;
    item.isFolder = this.isFolder;
    var _62c = this.saveProjectCallback.createDelegate(this);
    var that = this;
    project.saveProjectDTO(item, {callback:_62c});
},maskDialog:function() {
    this.dialog.getEl().mask("Saving...");
},unmaskDialog:function() {
    this.dialog.getEl().unmask();
},saveProjectCallback:function(item) {
    var _62f = new jx.Project(item);
    this.getAppContext().fireEvent("refreshProjectList", _62f);
    this.getAppContext().fireEvent("afterSaveProject", _62f);
},getParentId:function() {
    var node = this.groupTree.getSelectionModel().getSelectedNode();
    var _631 = null;
    if (node) {
        _631 = node.id;
        if (_631 && _631.charAt(0) == "a") {
            _631 = _631.substring(2);
        }
    }
    return _631;
},filterFieldsForFolder:function(_632) {
    var _633 = [];
    for (var i in _632) {
        var _635 = _632[i];
        if (_635.showInFolder) {
            _633.push(_635);
        }
    }
    return _633;
},validateForm:function() {
    var item = this.getUpdatedItem();
    var _637 = [];
    if (!item.name) {
        _637.push("Name is required");
    }
    if (_637.length > 0) {
        this.displayErrorMessages(_637);
        return false;
    } else {
        this.clearErrorMessages();
        return true;
    }
}});
jx.form.LicenseForm = function(_638) {
    Ext.applyIf(_638, {formType:"readOnly",tableClass:"j-grid-table",readOnly:true,alternateRows:false,labelClass:"label",labelWidth:"30%",fieldDefinitions:this.getFormDefinitions()});
    jx.form.LicenseForm.superclass.constructor.call(this, _638);
};
Ext.extend(jx.form.LicenseForm, jx.form.JamaBasicForm, {org:{},loadOrg:function(org) {
    admin.getOrganization(org.orgId, this.populateLicense.createDelegate(this));
},populateLicense:function(_63a) {
    this.setItem(_63a);
},getFormDefinitions:function() {
    return ([{field:"clientName",label:i18n.g("j.l.licenseClientName"),dataType:"string"},{field:"clientOrganization",label:i18n.g("j.l.licenseClientOrg"),dataType:"string"},{field:"productName",label:i18n.g("j.l.licenseProductName"),dataType:"string"},{field:"productEdition",label:i18n.g("j.l.licenseProductEdition"),dataType:"string"},{field:"licenseType",label:i18n.g("j.l.licenseType"),dataType:"string"},{field:"userNumber",mapping:function(item) {
        return item.numberNamed && item.numberNamed < 0 ? "unlimited" : item.numberNamed;
    },label:i18n.g("j.l.licenseNamedUsers"),dataType:"string"},{field:"curUserNumber",mapping:function(item) {
        return item.numberConcurrent && item.numberConcurrent < 0 ? "unlimited" : item.numberConcurrent;
    },label:i18n.g("j.l.licenseFloatingUsers"),dataType:"integer"},{field:"readOnlyUserNumber",mapping:function(item) {
        return item.numberReadOnly && item.numberReadOnly < 0 ? "unlimited" : item.numberReadOnly;
    },label:i18n.g("j.l.licenseReadOnlyUsers"),dataType:"integer"},{field:"creationDate",label:i18n.g("j.l.licenseCreationDate"),dataType:"date"},{field:"expirationDate",label:i18n.g("j.l.licenseExpirationDate"),dataType:"date"}]);
},validate:function(item) {
    var self = this;
    validation.validateOrganization(item, {callback:function(_640) {
        self.errors = _640;
    },async:false});
    if (this.errors && this.errors.length > 0) {
        this.displayErrorMessages(this.errors);
        return false;
    }
    this.clearErrorMessages();
    return true;
},render:function() {
    jx.form.LicenseForm.superclass.render.apply(this, arguments);
    this.setItem(this.org);
}});
Ext.reg("jx.form.LicenseForm", jx.form.LicenseForm);
jx.form.ProjectPropertyForm = function(_641) {
    this.labelWidth = "40%";
    this.fieldDefinitions = [{field:"jama.project.shouldVersion",label:"Version Items?",dataType:"boolean"},{field:"jama.project.showIdInTree",label:"Display IDs in Project Explorer?",dataType:"boolean"},{field:"jama.project.keyEditable",label:"Item ID Editable?",dataType:"boolean"},{field:"jama.project.maxTreeNodes",label:"Max items displayed in explorer tree",dataType:"integer"},{field:"jama.project.maxPageSize",label:"Max items displayed in grid views",dataType:"integer"}];
    this.title = "Project Setup";
    this.buttonPanelLocation = "bottom";
    this.buttonPanelAlign = "left";
    this.labelClass = "propertyLabel";
    this.titlePanelClass = "textLabel";
    this.dwrLoadCall = propertySvc.getProjectPropertyList;
    this.dwrSaveCall = propertySvc.saveProjectPropertyList;
    jx.form.ProjectPropertyForm.superclass.constructor.call(this, _641);
};
Ext.extend(jx.form.ProjectPropertyForm, jx.form.DwrJamaForm, {data:null,getField:function(obj, meta) {
    var o = obj.properties;
    if (o) {
        o = obj.properties[meta.field];
    }
    var val = "";
    if (o) {
        if (o.propertyType == 1) {
            val = o.propertyValue == "true" ? true : false;
        } else {
            val = o.propertyValue;
        }
    }
    return val;
},setField:function(obj, meta, _648) {
    var o = obj.properties;
    if (o) {
        o = o[meta.field];
    }
    if (o) {
        if (o.propertyType == 1) {
            o.propertyValue = (_648 ? "true" : "false");
        } else {
            o.propertyValue = _648;
        }
    }
},saveCallback:function(item) {
    if (item) {
        this.item = item;
    } else {
        this.item = this.getUpdatedItem();
    }
    this.onCancel();
    this.data.project.propertyList = item;
},afterRender:function() {
    jx.form.SystemPropertyForm.superclass.afterRender.call(this);
    if (this.data) {
        this.dwrArgs = [this.data.project.id];
        this.load();
    }
}});
Ext.reg("jx.form.ProjectPropertyForm", jx.form.ProjectPropertyForm);
jx.form.SimpleItemForm = function(_64b) {
    jx.form.SimpleItemForm.superclass.constructor.call(this, _64b);
};
Ext.extend(jx.form.SimpleItemForm, jx.form.JamaForm, {project:null,groupList:null,loadArtifact:function(_64c, _64d) {
    this.setMask();
    var _64e = this.loadArtifactCallback.createDelegate(this);
    documentManager.getDocumentDto(_64c, {callback:_64e,errorHandler:this.handleException.createDelegate(this)});
},loadArtifactCallback:function(item) {
    this.load(item, item.documentTypeDto);
    this.fireEvent("afterLoadArtifact", item);
    this.unmask();
},handleException:function(msg, ex) {
    var _652 = ex ? ex.errors : null;
    if (_652 && _652.length > 0) {
        this.displayErrorMessages(_652);
    } else {
        alert(msg);
    }
    this.unmask();
},load:function(item, meta) {
    if (item.isFolder) {
        meta.fieldList = this.filterFieldsForFolder(meta.fieldList);
    }
    this.setFieldDefinitions(meta.fieldList);
    this.setItem(item);
},filterFieldsForFolder:function(_655) {
    var _656 = [];
    for (var i in _655) {
        var _658 = _655[i];
        if (_658.showInFolder) {
            _656.push(_658);
        }
    }
    return _656;
}});
jx.form.ItemForm = function(_659) {
    _659 = Ext.applyIf(_659, {formType:"editOnly",showButtons:false});
    jx.form.ItemForm.superclass.constructor.call(this, _659);
};
Ext.extend(jx.form.ItemForm, jx.form.JamaForm, {shouldVersion:true,project:null,item:null,selected:null,editItem:function(item, _65b, _65c) {
    this.item = item;
    this.selected = _65c;
    this.setProject(_65b);
    if (item.id) {
        this.loadItem(item, _65b);
    } else {
        this.newItem(item, _65b);
    }
},loadItem:function(item, _65e) {
    this.setMask();
    this.setProject(_65e);
    documentManager.getDocumentDto(item.id, {callback:this.loadItemCallback.createDelegate(this),errorHandler:this.handleException.createDelegate(this)});
},loadItemCallback:function(item) {
    this.loadItemWithMeta(item, item.documentTypeDto);
    this.unmask();
    this.setFocus();
},handleException:function(msg, ex) {
    var _662 = ex ? ex.errors : null;
    if (_662 && _662.length > 0) {
        this.displayErrorMessages(_662);
    } else {
    }
    this.unmask();
},newItem:function(item, _664) {
    var _665 = item.documentGroup ? item.documentGroup.id : null;
    var meta;
    if (_665) {
        meta = {fieldList:this.getFieldsForGroup(_665)};
    } else {
        meta = {fieldList:this.getFieldsForNewItem()};
    }
    this.newFolder = false;
    this.loadItemWithMeta({documentGroup:{id:_665},isFolder:item.isFolder}, meta);
    this.setFocus();
},setProject:function(_667) {
    this.project = _667;
    this.shouldVersion = _667.getShouldVersion();
},loadItemWithMeta:function(item, meta) {
    this.item = item;
    if (item.isFolder) {
        meta.fieldList = this.filterFieldsForFolder(meta.fieldList);
    }
    this.setFieldDefinitions(meta.fieldList);
    this.setItem(item);
    this.setGroupHandler();
},setGroupHandler:function() {
    if (this.groupMetaControl) {
        this.groupMetaControl.removeAllListeners();
    }
    var _66a = this.getFieldMeta("documentGroup");
    if (_66a && _66a.control) {
        this.groupMetaControl = Ext.get(_66a.control);
        this.groupMetaControl.addListener("change", this.handleGroupChange, this);
    }
},handleGroupChange:function() {
    if (this.groupMetaControl) {
        if (!this.isReady()) {
            Ext.MessageBox.alert("Warning", "The edtor is not ready");
            return;
        }
        var _66b = this.groupMetaControl.getValue();
        if (_66b) {
            var _66c = this.getFieldsForGroup(_66b);
            this.selected = null;
            this.loadItemWithMeta({documentGroup:{id:_66b},isFolder:this.item.isFolder}, {fieldList:_66c});
        }
    }
},checkForUnsaved:function(_66d) {
    if (this.readOnly) {
        return true;
    }
    var _66e = this.getItemChanges();
    var item = this.getUpdatedItem();
    if (!this.readOnly && item.documentGroup && _66e) {
        if (_66d) {
            return false;
        } else {
            if (confirm("You haven't saved your changes. Click OK to save, Cancel to not save.")) {
                this.onSave();
                return false;
            } else {
                this.readOnly = true;
            }
        }
    }
    return true;
},validateForm:function() {
    var item = this.getUpdatedItem();
    var _671 = [];
    if (!item.documentGroup) {
        _671.push("Item type is required");
    }
    if (!item.name) {
        _671.push("Name is required");
    }
    if (item.id && !item.documentKey) {
        _671.push("ID/Key is required");
    }
    if (_671.length > 0) {
        this.displayErrorMessages(_671);
        return false;
    } else {
        this.clearErrorMessages();
        return true;
    }
},getChangeComment:function() {
    var _672 = this.getItemChanges();
    if (this.item.id) {
        _672 = _672 ? "Changes made: (\"" + _672 + "\")" : "";
    } else {
        _672 = "Initial creation";
    }
    return _672;
},getNewItem:function() {
    var item = this.getUpdatedItem();
    if (!item.project) {
        item.project = {id:this.project.id};
    } else {
        item.project = {id:item.project.id};
    }
    item.modifiedBy = null;
    item.modifiedDate = null;
    item.createdBy = null;
    item.createdDate = null;
    item.documentTypeDto = null;
    if (!item.id && item.documentGroup) {
        var g = this.findGroupById(item.documentGroup.id);
        item.documentGroup = g || item.documentGroup;
    }
    if (item.documentGroup) {
        item.documentGroup = {id:item.documentGroup.id,displayPlural:item.documentGroup.displayPlural};
    }
    return item;
},findGroupById:function(id) {
    var list = this.groupList;
    if (list) {
        var l = list.length;
        for (var i = 0; i < l; i++) {
            if (list[i].id == id) {
                return list[i];
            }
        }
    }
    return null;
},filterFieldsForFolder:function(_679) {
    var _67a = [];
    for (var i in _679) {
        var _67c = _679[i];
        if (_67c.showInFolder) {
            _67a.push(_67c);
        }
    }
    return _67a;
},getFieldsForGroup:function(_67d) {
    if (!_67d || !this.project || !this.project.id) {
        return null;
    }
    var _67e = this.project.id;
    var self = this;
    documentTypeSvc.getDocumentTypeMetaDataByDocumentGroupId(_67d, _67e, {callback:function(list) {
        self.dynFields = list;
    },async:false});
    return this.getFieldsForNewItem(true).concat(this.dynFields.fieldList);
},getFieldsForNewItem:function(_681) {
    if (!this.project || !this.project.id) {
        return null;
    }
    var _682 = this.project.id;
    var self = this;
    documentManager.getDocumentGroupList(_682, {callback:function(list) {
        self.groupList = list;
    },async:false});
    this.groupList = [{id:"",display:"Select One"}].concat(this.groupList);
    return [{dataType:"lookup",field:"documentGroup",label:"Select Set",showInFolder:true,options:this.groupList,displayField:"display",valueFile:"id"}];
}});
Ext.reg("jx.form.ItemForm", jx.form.ItemForm);
jx.form.ItemSaveForm = function(_685) {
    this.formType = "editOnly";
    this.showTitle = false;
    this.showButtons = false;
    jx.form.ItemSaveForm.superclass.constructor.call(this, _685);
};
Ext.extend(jx.form.ItemSaveForm, jx.form.JamaForm, {groupList:null,load:function(_686, _687) {
    this.setFieldDefinitions(this.getFields(_686));
    this.setItem({comment:_687});
},getFields:function(_688) {
    if (!_688) {
        return null;
    }
    var self = this;
    distributionGroup.getDistributionGroupListForProject(_688, {callback:function(list) {
        self.groupList = list;
    },async:false});
    var _68b = [];
    _68b.push({dataType:"text",controlTypeId:2,field:"comment",label:i18n.g("j.l.itemSaveVersionNotes"),labelAlign:"top"});
    _68b.push({dataType:"multiCheckboxes",field:"distGroups",label:i18n.g("j.l.itemSaveSendNotification"),options:this.groupList,returnIds:true,labelAlign:"top"});
    return _68b;
}});
jx.form.AttachmentUploadForm = function(_68c) {
    _68c = Ext.applyIf(_68c, {baseCls:"x-plain",ctCls:"j-upload-panel",labelWidth:100,defaultType:"textfield",labelAlign:"right",autoScroll:true,bodyStyle:"padding:10px",fileUpload:true,fitToFrame:true,autoScroll:true,baseUrl:this.getAppContext().baseUrl,items:[{fieldLabel:i18n.g("j.l.uploadFileDescription"),allowBlank:false,name:"attachment_description",anchor:"100%"},{fieldLabel:i18n.g("j.l.uploadFileName"),name:"fileName",allowBlank:true,inputType:"file",anchor:"100%",autoCreate:{tag:"input",type:"file",size:"50",autocomplete:"off"}},{fieldLabel:i18n.g("j.l.uploadFileNote"),name:"attachment_note",anchor:"100%",hidden:_68c.showNote ? false : true,hideLabel:_68c.showNote ? false : true},{xtype:"checkbox",name:"attachment_replace",hidden:true,checked:true,readOnly:false,hideLabel:true},{name:"document_attachment_id",type:"hidden",allowBlank:true,hidden:true,hideLabel:true},{name:"attachment_id",type:"hidden",allowBlank:true,hideLabel:true,hidden:true}],tbar:[]});
    jx.form.AttachmentUploadForm.superclass.constructor.call(this, _68c);
};
Ext.extend(jx.form.AttachmentUploadForm, Ext.form.FormPanel, {artifact:null,data:null,uploadUrl:"fileUpload.req",baseUrl:"",textBox:null,showNote:false,loadAttachment:function(att) {
    if (att.attachment_id) {
        this.textBox.getEl().innerHTML = (this.getTpl().apply({fileName:att.existingFileName}));
    } else {
        this.textBox.getEl().innerHTML = "";
    }
    this.getForm().setValues(att);
},render:function() {
    jx.form.AttachmentUploadForm.superclass.render.apply(this, arguments);
    this.textBox = this.getTopToolbar().addText("test");
},getUpdatedItem:function() {
    return this.getForm().getValues();
},upload:function() {
    var item = this.getUpdatedItem();
    this.uploadField = this.getForm().findField(0);
    if (item.attachment_id && !this.uploadField.getRawValue()) {
        this.updateDescription();
        if (this.data.item) {
            this.saveDocumentAttachment();
        }
        return;
    }
    var att = this.getAttachmentByName(this.uploadField.getRawValue());
    if (att != null && !item.attachment_id) {
        var _690 = i18n.g("j.l.uploadFileOverwriteWarning");
        Ext.MessageBox.show({msg:_690,buttons:Ext.Msg.OKCANCEL,fn:this.uploadConfirm.createDelegate(this)});
    } else {
        if (att != null && (item.attachment_id != att.id)) {
            Ext.MessageBox.alert("Warning", "The file with the same name exists for another attachment. Please update that attachment.");
        } else {
            this.uploadConfirm("ok");
        }
    }
},updateDescription:function() {
    var item = this.getUpdatedItem();
    attachment.updateFileAttachment(item.attachment_id, item.attachment_description, {callback:this.updateItemCallback.createDelegate(this),exceptionHandler:function() {
        Ext.MessageBox.alert("Error", "The description can't be updated.");
    }});
},uploadConfirm:function(_692) {
    if (_692 == "ok") {
        this.getForm().submit({waitMsg:i18n.g("j.l.uploadingWaitMessge"),url:this.baseUrl + this.uploadUrl,reset:false,success:this.uploadCallback.createDelegate(this),failure:function(form, _694) {
        },params:{attachment_projectId:this.data.getProjectId()}});
    } else {
        this.onCancel();
    }
},uploadCallback:function(form, _696) {
    var _697 = null;
    if (_696) {
        _697 = _696.result.data.attachmentId;
    }
    if (this.data.item) {
        this.saveDocumentAttachment(_697);
    }
    this.fireEvent("afterUpload", _697);
    this.getForm().reset();
},saveDocumentAttachment:function(_698) {
    var item = this.getForm().getValues();
    var att = {id:item.document_attachment_id,attachment:{id:_698 || item.attachment_id},note:item.attachment_note};
    documentManager.saveDocumentAttachment(att, {id:this.data.getItemId()}, {callback:this.saveDocAttachmentCallback.createDelegate(this),exceptionHandler:function() {
        Ext.MessageBox.alert("Error", "Item can't be updated.");
    }});
},updateItemCallback:function(item) {
    this.fireEvent("afterUpdateDescription");
},saveDocAttachmentCallback:function() {
    this.fireEvent("afterSaveItemAttachment");
},getAttachmentByName:function(_69c) {
    var pos = _69c.lastIndexOf("/");
    if (pos < 0) {
        pos = _69c.lastIndexOf("\\");
    }
    if (pos < 0) {
        return null;
    }
    var _69e = _69c.substring(pos + 1);
    var self = this;
    attachment.getAttachmentByFileName(this.data.getProjectId(), _69e, {callback:function(att) {
        self.existingAttachment = att;
    },async:false});
    return this.existingAttachment;
},getTpl:function() {
    if (this.tpl) {
        return this.tpl;
    }
    var mw = jx.form.AttachmentUploadForm;
    if (!mw.tplCache) {
        mw.tplCache = new Ext.XTemplate("<div class=\"j-section-header\">" + i18n.g("j.l.uploadFileUpdateAttachmentMessage") + " {fileName}</div>");
    }
    return mw.tplCache;
}});
jx.form.VersionCompareForm = function(_6a2) {
    _6a2 = Ext.applyIf(_6a2, {tableClass:"j-grid-table",readOnly:true});
    jx.form.VersionCompareForm.superclass.constructor.call(this, _6a2);
};
Ext.extend(jx.form.VersionCompareForm, jx.form.JamaBasicForm, {changedClass:"changed",rowClass:"",rowAlternateClass:"alt",labelHeaderClass:"versionLabelHeader",compareHeaderClass:"versionValueHeader",alternateRows:false,showDetails:false,fromDoc:null,toDoc:null,updateHeader:function(_6a3, _6a4, _6a5) {
    var head = this.domNode.getElementsByTagName("thead")[0];
    var row = head.getElementsByTagName("tr")[0];
    var _6a8 = row.getElementsByTagName("td");
    if (_6a8.length == 0) {
        _6a8 = row.getElementsByTagName("th");
    }
    if (typeof (_6a3) != "function") {
        var meta = {field:_6a3};
        var _6aa = this.getField(_6a4, meta);
        var _6ab = this.getField(_6a5, meta);
    } else {
        var _6aa = _6a3(_6a4);
        var _6ab = _6a3(_6a5, meta);
    }
    _6a8[1].innerHTML = _6aa;
    _6a8[2].innerHTML = _6ab;
},headerField:function(obj) {
    return "Version #" + obj.versionNumber;
},createHeader:function(_6ad) {
    var _6ae = Ext.DomHelper.insertFirst(this.table, {tag:"thead"});
    var row = document.createElement("tr");
    _6ae.appendChild(row);
    var cell = document.createElement("td");
    row.appendChild(cell);
    cell.className = this.labelHeaderClass;
    cell = document.createElement("td");
    row.appendChild(cell);
    cell.className = this.compareHeaderClass;
    cell = document.createElement("td");
    row.appendChild(cell);
    cell.className = this.compareHeaderClass;
},createRow:function(body, _6b2, _6b3, _6b4) {
    var _6b5 = (this.alternateRows && _6b2 % 2 == 1) ? this.rowAlternateClass : null;
    var _6b6 = this.fields[_6b2];
    var _6b7 = this.getField(_6b3, _6b6);
    var _6b8 = this.getField(_6b4, _6b6);
    _6b7 = (_6b7 == null ? "" : _6b7);
    _6b8 = (_6b8 == null ? "" : _6b8);
    var row = Ext.DomHelper.append(body, {tag:"tr",cls:_6b5,children:[{tag:"td",html:_6b6.label,cls:this.labelClass},{tag:"td"},{tag:"td"}]}, true);
    var _6ba = row.query("td");
    var _6bb = _6ba[1];
    this.fillCell(_6bb, _6b6, _6b7);
    var _6bc = _6ba[2];
    this.fillCell(_6bc, _6b6, _6b8);
    var _6bd = _6bb.innerHTML;
    var _6be = _6bc.innerHTML;
    if (_6b6.control == "textarea") {
        _6bb.innerHTML = this.encodeTextForTextarea(_6b7);
        _6bc.innerHTML = this.encodeTextForTextarea(_6b8);
    }
    var _6bf = (_6bd == _6be);
    if (this.showDetails && !_6bf && !_6b6.ignoreChange) {
        var d = diff_main(_6bd, _6be, false);
        diff_cleanup_semantic(d);
        var ds = diff_prettyhtml(d);
        _6bc.innerHTML = ds;
    }
    if (!_6bf && !this.showDetails && !_6b6.ignoreChange && this.changedClass) {
        Ext.get(_6bb).addClass(this.changedClass);
        Ext.get(_6bc).addClass(this.changedClass);
    }
    return row;
},encodeTextForTextarea:function(text, _6c3) {
    if (text == undefined || text == null) {
        return text;
    }
    if (_6c3 == undefined) {
        _6c3 = "</br>";
    }
    text = text.replace(/\r\n/g, _6c3);
    text = text.replace(/\n/g, _6c3);
    text = text.replace(/\r/g, _6c3);
    return text;
},toggleDetails:function() {
    this.showDetails = !this.showDetails;
    this.compareItems(this.fromDoc, this.toDoc);
},getFormDefinition:function(dto) {
    return this.getVersionFormDefinition().concat(dto.documentTypeDto.fieldList);
},getVersionFormDefinition:function() {
    if (!this.versionFormDefinition) {
        this.versionFormDefinition = [{field:"versionNumber",label:"Version Number",ignoreChange:true},{field:"versionComments",label:"Version Comment",ignoreChange:true,control:"textarea"},{field:"versionCreatedDate",dataType:Date,label:"Version Date",format:this.getAppContext().getDatetimeFormat(),ignoreChange:true},{field:"versionCreatedBy",label:i18n.g("versionBy"),ignoreChange:true}];
    }
    return this.versionFormDefinition;
},compareItems:function(_6c5, _6c6) {
    this.setFieldDefinitions(this.getFormDefinition(_6c5));
    this.updateHeader(this.headerField, _6c5, _6c6);
    var body = this.domNode.tBodies[0];
    while (body.childNodes.length > 0) {
        body.removeChild(body.childNodes[0]);
    }
    this.fromDoc = _6c5;
    this.toDoc = _6c6;
    for (var j = 0; j < this.fields.length; j++) {
        var row = this.createRow(body, j, _6c5, _6c6);
    }
},afterRender:function() {
    this.createHeader();
},render:function() {
    jx.form.VersionCompareForm.superclass.render.apply(this, arguments);
    if (this.fromDoc && this.fromDoc.documentTypeDto && this.toDoc) {
        this.compareItems(this.fromDoc, this.toDoc);
    }
}});
jx.form.SimpleGroupForm = function(_6ca) {
    _6ca = Ext.applyIf(_6ca, {formType:"readOnly",showButtons:false,dwrLoadCall:documentManager.getDocumentGroup,readOnly:true});
    jx.form.SimpleGroupForm.superclass.constructor.call(this, _6ca);
};
Ext.extend(jx.form.SimpleGroupForm, jx.form.JamaForm, {data:null,documentTypeList:null,refresh:function() {
    this.load(this.data.group);
},render:function() {
    jx.form.SimpleGroupForm.superclass.render.apply(this, arguments);
    this.setFieldDefinitions(this.getFields());
    this.refresh();
},load:function(_6cb) {
    this.dwrLoadCall(_6cb.id, this.fillForm.createDelegate(this));
},fillForm:function(item) {
    this.setItem(item);
    this.fireEvent("onLoadGroup", item);
},getFields:function() {
    var _6cd = [{actualDataType:"lookup",dataType:"lookup",field:"documentType",label:"Type of Set",required:true},{dataType:"integer",field:"id",label:"API ID",required:false,readOnly:true},{actualDataType:"string",dataType:"string",dataFormat:null,defaultValue:null,field:"display",label:"Label (Singular)",options:null,readOnly:false,required:true,showInFolder:true,showInList:true},{actualDataType:"string",dataType:"string",dataFormat:null,defaultValue:null,field:"displayPlural",id:40,label:"Label (Plural)",options:null,readOnly:false,required:true,showInFolder:true,showInList:true},{actualDataType:"string",dataType:"string",dataFormat:null,defaultValue:null,field:"prefix",label:"Unique ID Prefix",options:null,readOnly:false,required:true,showInFolder:true,showInList:true},{actualDataType:"string",dataType:"string",dataFormat:null,defaultValue:null,field:"sequenceNumber",id:40,label:"Unique ID Starting Number",options:null,readOnly:false,required:null,showInFolder:true,showInList:true,required:true},{actualDataType:"string",dataType:"string",dataFormat:null,defaultValue:null,field:"description",id:40,label:"Set Description",options:null,readOnly:false,required:false,showInFolder:true,showInList:true},{actualDataType:"string",dataType:"boolean",dataFormat:null,defaultValue:null,field:"displayInReleaseTree",id:40,label:"Visible in Releases",options:null,readOnly:false,required:false,showInFolder:true,showInList:true}];
    return _6cd;
}});
jx.form.GroupForm = function(_6ce) {
    _6ce = Ext.applyIf(_6ce, {dwrLoadCall:documentManager.getDocumentGroup,dwrSaveCall:documentManager.saveDocumentGroup,dwrDocumentTypeCall:documentTypeSvc.getDocumentTypeList,formType:"editOnly",showButtons:false});
    jx.form.GroupForm.superclass.constructor.call(this, _6ce);
};
Ext.extend(jx.form.GroupForm, jx.form.JamaForm, {treeImgPath:"img/tree",dwrLoadCall:null,dwrSaveCall:null,org:null,project:null,documentTypeList:null,group:null,loadGroup:function(_6cf, _6d0, org) {
    this.group = _6cf;
    this.project = _6d0;
    this.org = org;
    this.setFieldDefinitions(this.getFields());
    if (_6cf && _6cf.id) {
        this.load(_6cf);
    } else {
        this.loadNewGroup();
    }
},refresh:function() {
    this.load(this.group);
},render:function() {
    jx.form.GroupForm.superclass.render.apply(this, arguments);
    if (this.project && this.org) {
        this.loadGroup(this.group, this.project, this.org);
    }
},loadNewGroup:function() {
    this.setFieldDefinitions(this.getFields());
    this.fillForm({});
},load:function(_6d2) {
    this.dwrLoadCall(_6d2.id, this.fillForm.createDelegate(this));
},fillForm:function(item) {
    this.setItem(item);
    this.setFocus();
},onSave:function(e) {
    if (!this.project || !this.project.id) {
        return;
    }
    var item = this.getUpdatedItem();
    if (!item.project) {
        item.project = {id:this.project.id};
    } else {
        item.project = {id:this.project.id};
    }
    if (this.validate(item, this)) {
        this.clearErrorMessages();
        this.dwrSaveCall(item, {callback:this.saveCallback.createDelegate(this),errorHandler:this.handleException.createDelegate(this)});
    }
},validate:function(item, form) {
    var self = this;
    validation.validateDocumentGroup(item, {callback:function(_6d9) {
        self.errors = _6d9;
    },async:false});
    if (this.errors && this.errors.length > 0) {
        form.displayErrorMessages(this.errors);
        return false;
    }
    return true;
},setItem:function(item) {
    var _6db = this.getFieldMeta("documentType");
    if (_6db && item.id) {
        _6db.readOnly = true;
    } else {
        if (_6db) {
            _6db.readOnly = false;
        }
    }
    jx.form.GroupForm.superclass.setItem.call(this, item);
},onCancel:function(e) {
    this.fireEvent("afterCancelGroup", this.getUpdatedItem());
},saveCallback:function(item) {
    if (item) {
        this.item = item;
    } else {
        this.item = this.getUpdatedItem();
    }
    this.onCancel();
    this.setItem({});
    this.fireEvent("afterSaveGroup", item);
},setProject:function(_6de) {
    this.projectId = _6de;
},setOrg:function(org) {
    this.org = org;
},handleException:function(msg, ex) {
    var _6e2 = ex.errors;
    if (_6e2 != null && _6e2.length > 0) {
        this.displayErrorMessages(_6e2);
    } else {
        Ext.MessageBox.alert("Can't save set", String.format("Details: {0}", msg));
    }
},getFields:function() {
    if (!this.org || !this.org.id) {
        return {};
    }
    var _6e3 = this.treeImgPath;
    var self = this;
    documentTypeSvc.getDocumentTypeList(2, this.org.id, {callback:function(list) {
        list.sort(function(a, b) {
            var ad = a.name;
            var bd = b.name;
            if (ad === bd) {
                return 0;
            } else {
                return ad < bd ? -1 : 1;
            }
        });
        self.documentTypeList = list;
    },async:false});
    var _6ea = [{actualDataType:"lookup",dataType:"lookup",field:"documentType",label:"Type of Set",options:this.documentTypeList,required:true},{dataType:"integer",field:"id",label:"API ID",required:false,readOnly:true},{actualDataType:"string",dataType:"string",dataFormat:null,defaultValue:null,field:"display",label:"Label (Singular)",options:null,readOnly:false,required:true,showInFolder:true,showInList:true},{actualDataType:"string",dataType:"string",dataFormat:null,defaultValue:null,field:"displayPlural",id:40,label:"Label (Plural)",options:null,readOnly:false,required:true,showInFolder:true,showInList:true},{actualDataType:"string",dataType:"string",dataFormat:null,defaultValue:null,field:"prefix",label:"Unique ID Prefix",options:null,readOnly:false,required:true,showInFolder:true,showInList:true},{actualDataType:"string",dataType:"string",dataFormat:null,defaultValue:null,field:"sequenceNumber",id:40,label:"Unique ID Starting Number",options:null,readOnly:false,required:null,showInFolder:true,showInList:true,required:true},{actualDataType:"string",dataType:"string",dataFormat:null,defaultValue:null,field:"description",id:40,label:"Set Description",options:null,readOnly:false,required:false,showInFolder:true,showInList:true},{actualDataType:"string",dataType:"boolean",dataFormat:null,defaultValue:null,field:"displayInReleaseTree",id:40,label:"Visible in Releases",options:null,readOnly:false,required:false,showInFolder:true,showInList:true},{actualDataType:"string",dataType:"multiRadioBox",dataFormat:null,defaultValue:null,field:"image",label:"Image",options:[{id:"website_blue.gif",name:"<img border=\"0\" src=\"" + _6e3 + "/website_blue.gif\"/>"},{id:"website.gif",name:"<img border=\"0\" src=\"" + _6e3 + "/website.gif\"/>"},{id:"clipboard_plain.gif",name:"<img border=\"0\" src=\"" + _6e3 + "/clipboard_plain.gif\"/>"},{id:"book.gif",name:"<img border=\"0\" src=\"" + _6e3 + "/book.gif\"/>"},{id:"folder_box.gif",name:"<img border=\"0\" src=\"" + _6e3 + "/folder_box.gif\"/>"},{id:"edit.gif",name:"<img border=\"0\" src=\"" + _6e3 + "/edit.gif\"/>"},{id:"info.gif",name:"<img border=\"0\" src=\"" + _6e3 + "/info.gif\"/>"},{id:"but_cut.gif",name:"<img border=\"0\" src=\"" + _6e3 + "/but_cut.gif\"/>"},{id:"check.gif",name:"<img border=\"0\" src=\"" + _6e3 + "/check.gif\"/>"},{id:"file.gif",name:"<img border=\"0\" src=\"" + _6e3 + "/file.gif\"/>"},{id:"leaf.gif",name:"<img border=\"0\" src=\"" + _6e3 + "/leaf.gif\"/>"},{id:"users.gif",name:"<img border=\"0\" src=\"" + _6e3 + "/users.gif\"/>"},{id:"config.gif",name:"<img border=\"0\" src=\"" + _6e3 + "/config.gif\"/>"},{id:"application_view_list.png",name:"<img border=\"0\" src=\"" + _6e3 + "/application_view_list.png\"/>"},{id:"book.png",name:"<img border=\"0\" src=\"" + _6e3 + "/book.png\"/>"},{id:"brick.png",name:"<img border=\"0\" src=\"" + _6e3 + "/brick.png\"/>"},{id:"bug.png",name:"<img border=\"0\" src=\"" + _6e3 + "/bug.png\"/>"},{id:"chart_bar.png",name:"<img border=\"0\" src=\"" + _6e3 + "/chart_bar.png\"/>"},{id:"database.png",name:"<img border=\"0\" src=\"" + _6e3 + "/database.png\"/>"},{id:"email.png",name:"<img border=\"0\" src=\"" + _6e3 + "/email.png\"/>"},{id:"flag_blue.png",name:"<img border=\"0\" src=\"" + _6e3 + "/flag_blue.png\"/>"},{id:"folder.png",name:"<img border=\"0\" src=\"" + _6e3 + "/folder.png\"/>"},{id:"folder_page.png",name:"<img border=\"0\" src=\"" + _6e3 + "/folder_page.png\"/>"},{id:"folder_page_white.png",name:"<img border=\"0\" src=\"" + _6e3 + "/folder_page_white.png\"/>"},{id:"folder_picture.png",name:"<img border=\"0\" src=\"" + _6e3 + "/folder_picture.png\"/>"},{id:"folder_table.png",name:"<img border=\"0\" src=\"" + _6e3 + "/folder_table.png\"/>"},{id:"image.png",name:"<img border=\"0\" src=\"" + _6e3 + "/image.png\"/>"},{id:"package.png",name:"<img border=\"0\" src=\"" + _6e3 + "/package.png\"/>"},{id:"page.png",name:"<img border=\"0\" src=\"" + _6e3 + "/page.png\"/>"},{id:"page_red.png",name:"<img border=\"0\" src=\"" + _6e3 + "/page_red.png\"/>"},{id:"page_white_stack.png",name:"<img border=\"0\" src=\"" + _6e3 + "/page_white_stack.png\"/>"},{id:"plugin.png",name:"<img border=\"0\" src=\"" + _6e3 + "/plugin.png\"/>"},{id:"script.png",name:"<img border=\"0\" src=\"" + _6e3 + "/script.png\"/>"},{id:"server.png",name:"<img border=\"0\" src=\"" + _6e3 + "/server.png\"/>"}],readOnly:false,required:true,showInFolder:true,showInList:true}];
    return _6ea;
},validateForm:function(_6eb) {
    var _6ec = new Array();
    if (_6eb.display == "" || _6eb.display == null) {
        _6ec.push("Display is required.");
    }
    if (_6eb.displayPlural == "" || _6eb.displayPlural == null) {
        _6ec.push("Display Plural is required.");
    }
    if (_6eb.image == "" || _6eb.image == null) {
        _6ec.push("An image must be selected.");
    }
    if (_6eb.prefix == "" || _6eb.prefix == null) {
        _6ec.push("A prefix is required.");
    }
    if (_6eb.sequenceNumber == "" || _6eb.sequenceNumber == null) {
        _6ec.push("Sequence Number is required.");
    }
    return _6ec;
}});
jx.form.FilterForm = function(_6ed) {
    jx.form.FilterForm.superclass.constructor.call(this, _6ed);
};
Ext.extend(jx.form.FilterForm, jx.form.JamaBasicForm, {project:null,loadFilter:function(_6ee, _6ef) {
    if (_6ef) {
        this.project = _6ef;
    }
    if (_6ee && _6ee.id) {
        var that = this;
        filterSvc.getFilter(_6ee.id, {callback:function(f) {
            that.filter = f;
        },async:false});
        documentTypeSvc.getDocumentTypeMetaDataForFilter(this.filter.typeId, this.getProjectId(), {callback:this.load.createDelegate(this),async:false});
        var _6f2 = {name:this.filter.name,documentType:this.filter.typeId,shared:this.filter.scope == 2};
        this.setDocumentType(_6f2);
    } else {
        this.filter = null;
        var _6f2 = {name:"",documentType:"",shared:false};
        this.setDocumentType(_6f2);
        this.clearForm();
    }
},onSaveForm:function(_6f3) {
    var _6f4 = this.validateForm();
    if (_6f4.length == 0) {
        var _6f5 = this.buildFilter();
        if (!_6f3 && this.filter) {
            _6f5.id = this.filter.id;
        }
        filterSvc.saveFilter(_6f5, this.onFilterSaved.createDelegate(this));
        this.filterMessagesDiv.style.display = "none";
    } else {
        this.filterMessagesDiv.style.display = "block";
        this.filterMessagesDiv.innerHTML = "";
        var _6f6 = "";
        for (var _6f7 = 0; _6f7 < _6f4.length; _6f7++) {
            _6f6 += _6f4[_6f7];
            _6f6 += "\n";
        }
        this.filterMessagesDiv.innerHTML = this.encodeTextForDisplay(_6f6);
    }
},fillCellWithControl:function(cell, meta, val) {
    if (meta.getType() == Date || meta.getType() == "date") {
        if (!isNaN(val)) {
            var _6fb = this.defaultDateFormat;
            if (meta.format) {
                _6fb = meta.format;
            }
            var _6fc = meta.field;
            var _6fd = document.createElement("text");
            _6fd.innerHTML = "From Date: ";
            cell.appendChild(_6fd);
            meta.field = _6fc + "_From";
            var _6fe = this.getDateFromFilter(_6fc, "fromdate");
            this.createDatePicker(cell, meta, _6fb, _6fe);
            meta.control1 = meta.control;
            var _6ff = document.createElement("text");
            _6ff.innerHTML = "To Date: ";
            cell.appendChild(_6ff);
            meta.field = _6fc + "_To";
            var _700 = this.getDateFromFilter(_6fc, "todate");
            this.createDatePicker(cell, meta, _6fb, _700);
            meta.control2 = meta.control;
            meta.field = _6fc;
        } else {
            cell.innerHTML = "";
        }
    } else {
        if (meta.getType() == "boolean") {
            var _701 = this.getBooleanFromFilter(meta.field);
            this.createCheckBox(cell, meta, _701);
        } else {
            if (meta.getType() == "Lookup") {
                this.createScrollableCheckBox(cell, meta, val);
            }
        }
    }
    if (meta.required && this.iconRequired) {
        cell.appendChild(this.createImage(this.iconRequired));
    }
},createCheckBox:function(cell, meta, val) {
    var _705 = document.createElement("text");
    _705.innerHTML = "True/False:";
    cell.appendChild(_705);
    var _706 = document.createElement("input");
    _706.type = "checkbox";
    cell.appendChild(_706);
    _706.value = "T";
    if (val) {
        _706.checked = true;
    }
    _706.id = this.getEl().id + "_" + meta.field;
    _706.name = _706.id;
    var _707 = document.createElement("text");
    _707.innerHTML = " Ignore:";
    cell.appendChild(_707);
    var _708 = document.createElement("input");
    _708.type = "checkbox";
    cell.appendChild(_708);
    _708.value = "F";
    var te = this.isValueInFilter(meta.field, "T");
    var fe = this.isValueInFilter(meta.field, "F");
    _708.checked = (te || fe) ? false : true;
    _708.id = this.getEl().id + "_" + meta.field + "_ignore";
    _708.name = _708.id;
},createScrollableCheckBox:function(cell, meta, val) {
    var div = document.createElement("div");
    if (meta.options.length > 0 || meta.actualDataType == "User") {
        div.className = "j-form-scroll-box";
    }
    div.style.width = "300px";
    div.id = this.getEl().id + "_" + meta.field;
    var hPix = 0;
    if (meta.actualDataType == "User") {
        var _710 = document.createElement("input");
        _710.type = "checkbox";
        _710.value = "currentUser";
        _710.name = "filter_formElement_" + meta.field;
        div.appendChild(_710);
        _710.checked = this.isValueInFilter(meta.field, "currentUser");
        var text = document.createElement("text");
        text.innerHTML = "Current user";
        div.appendChild(text);
        div.appendChild(document.createElement("BR"));
        hPix++;
    }
    for (var i = 0; i < meta.options.length; i++) {
        var _713 = meta.options[i];
        var _710 = document.createElement("input");
        _710.type = "checkbox";
        _710.value = _713.id;
        _710.name = "filter_formElement_" + meta.field;
        div.appendChild(_710);
        _710.checked = this.isValueInFilter(meta.field, _713.id);
        var text = document.createElement("text");
        if (_713.name == "Select One") {
            text.innerHTML = "none selected";
        } else {
            text.innerHTML = _713.name;
        }
        div.appendChild(text);
        div.appendChild(document.createElement("BR"));
        hPix++;
    }
    if (hPix < 7) {
        div.style.height = hPix * 20 + "px";
    }
    cell.appendChild(div);
    meta.control = div;
},fillCell:function(cell, meta, val) {
    this.fillCellWithControl(cell, meta, val);
},isValueInFilter:function(_717, _718) {
    if (!this.filter || this.filter == null) {
        return false;
    }
    var _719 = this.filter.parameters;
    for (var i = 0; i < _719.length; i++) {
        if (_719[i].field == _717) {
            for (var k = 0; k < _719[i].paramValues.length; k++) {
                if (_719[i].paramValues[k] == _718) {
                    return true;
                }
            }
        }
    }
    return false;
},getDateFromFilter:function(_71c, type) {
    if (!this.filter || this.filter == null) {
        return "";
    }
    var _71e = this.filter.parameters;
    for (var i = 0; i < _71e.length; i++) {
        if (_71e[i].field == _71c) {
            if (_71e[i].paramValues.length == 2) {
                if (type == "fromdate") {
                    if (_71e[i].paramValues[0] != "") {
                        return _71e[i].paramValues[0];
                    }
                }
                if (type == "todate") {
                    if (_71e[i].paramValues[1] != "") {
                        return _71e[i].paramValues[1];
                    }
                }
            }
        }
    }
    return "";
},getBooleanFromFilter:function(_720) {
    if (!this.filter || this.filter == null) {
        return "";
    }
    var _721 = this.filter.parameters;
    for (var i = 0; i < _721.length; i++) {
        if (_721[i].field == _720 && _721[i].paramValues.length > 0) {
            return _721[i].paramValues[0];
        }
    }
    return "";
},getMetaForTypeId:function(_723) {
    var self = this;
    documentTypeSvc.getDocumentTypeMetaDataForFilter(_723, this.getProjectId(), {callback:function(meta) {
        self.documentTypeMeta = meta;
    },async:false});
    return this.documentTypeMeta;
},load:function(meta) {
    this.setFieldDefinitions(meta.fieldList);
    this.setItem({});
},onLoadForm:function() {
    var _727 = this.typeControl.dom.value;
    if (_727 == "") {
        this.clearForm();
    } else {
        var meta = this.getMetaForTypeId(_727);
        this.load(meta);
    }
},onSaveAsForm:function() {
    var _729 = this.validateForm();
    if (_729.length == 0) {
        var _72a = this.buildFilter();
        filterSvc.saveFilter(_72a, this.onFilterSaved.createDelegate(this));
        this.filterMessagesDiv.style.display = "none";
    } else {
        this.filterMessagesDiv.style.display = "block";
        this.filterMessagesDiv.innerHTML = "";
        var _72b = "";
        for (var _72c = 0; _72c < _729.length; _72c++) {
            _72b += _729[_72c];
            _72b += "\n";
        }
        this.filterMessagesDiv.innerHTML = this.encodeTextForDisplay(_72b);
    }
},onViewForm:function() {
    var _72d = this.buildFilter();
    filterSvc.viewFilterResults(_72d, this.onFilterSaved.createDelegate(this));
},onFilterSaved:function(_72e) {
    this.fireEvent("afterSaveFilter", this, _72e);
},buildFilter:function() {
    var _72f = 6;
    var _730 = null;
    var _731 = this.documentTypeForm.getUpdatedItem();
    if (_731.shared) {
        _72f = 2;
    }
    var sEle = this.selectDocumentType;
    var _733 = {name:_731.name,scope:_72f,refId:_730,typeId:_731.documentType ? _731.documentType.id : null,parameters:new Array()};
    for (var j = 0; j < this.fields.length; j++) {
        if (this.fields[j].dataType != "text" && this.fields[j].dataType != "string") {
            var meta = this.fields[j];
            var _736 = {type:meta.getType(),field:meta.field,paramValues:new Array()};
            if (meta.getType() == "Lookup") {
                meta.returnIds = true;
                _736.paramValues = this.getMultiCheckboxesValues(meta);
            } else {
                if (meta.getType() == "date") {
                    var _737 = meta.control1.getValue();
                    if (_737 != "") {
                        _736.paramValues.push(_737.format("m/d/Y"));
                    }
                    var _738 = meta.control2.getValue();
                    if (_738 != "") {
                        _736.paramValues.push(_738.format("m/d/Y"));
                    }
                } else {
                    if (meta.getType() == "boolean") {
                        var _739 = Ext.getDom(this.getEl().id + "_" + meta.field + "_ignore");
                        if (!_739.checked) {
                            var _73a = Ext.getDom(this.getEl().id + "_" + meta.field);
                            _736.paramValues.push(_73a.checked ? "T" : "F");
                        }
                    }
                }
            }
            if (_736.paramValues.length > 0) {
                _733.parameters.push(_736);
            }
        }
    }
    var _73b = {type:"boolean",field:"active",paramValues:["T"]};
    _733.parameters.push(_73b);
    var _73c = {type:"Lookup",field:"project",paramValues:["currentProject"]};
    _733.parameters.push(_73c);
    return _733;
},validateForm:function() {
    var _73d = new Array();
    var _73e = this.documentTypeForm.getUpdatedItem();
    if (!_73e.name) {
        _73d.push("Name is Required");
    }
    if (!_73e.documentType) {
        _73d.push("A type must be selected");
    }
    return _73d;
},clearForm:function() {
    this.setFieldDefinitions([{field:"&nbsp;",label:"&nbsp;",separator:"&nbsp;"}]);
    this.setItem({});
},afterRender:function() {
    var self = this;
    documentTypeSvc.getDocumentTypeList(2, this.getOrgId(), {callback:function(list) {
        self.documentTypeList = list;
    },async:false});
    this.documentTypeList = [{id:"",name:"Select a Type"}].concat(this.documentTypeList);
    var meta = [{field:"name",label:"Filter Name",dataType:"string"},{field:"documentType",label:"Select a Type",dataType:"lookup",options:this.documentTypeList},{field:"shared",label:"Shared Filter?",dataType:"boolean"}];
    var _742 = this.getHeaderPanel(true);
    this.filterMessagesDiv = _742.createChild({tag:"div"}, null, true);
    this.documentTypeForm = new jx.form.JamaBasicForm({labelClass:"label",fieldDefinitions:meta,labelWidth:this.labelWidth});
    this.documentTypeForm.render(_742);
    this.setDocumentType({}, true);
    this.setFieldDefinitions([{field:"&nbsp;",label:"&nbsp;",separator:"&nbsp;"}]);
    this.setItem({});
},setDocumentType:function(item, _744) {
    var form = this.documentTypeForm;
    if (this.typeControl) {
        this.typeControl.un("change", this.onLoadForm, this);
    }
    form.setItem(item);
    var meta = form.getFieldMeta("documentType");
    if (meta && meta.control) {
        this.typeControl = Ext.get(meta.control);
        this.typeControl.addListener("change", this.onLoadForm, this);
    }
    if (!_744) {
        form.setFocus();
    }
},renderRows:function(body, item) {
    for (var j = 0; j < this.fields.length; j++) {
        var meta = this.fields[j];
        if (meta.dataType != "text" && meta.dataType != "string") {
            this.createRow(meta, item);
        }
    }
},getProjectId:function() {
    return this.project ? this.project.id : null;
},getOrgId:function() {
    return this.org ? this.org.id : null;
},onRender:function(ct, _74c) {
    jx.form.FilterForm.superclass.onRender.call(this, ct, _74c);
},render:function() {
    jx.form.FilterForm.superclass.render.apply(this, arguments);
    if (this.org && this.project && this.filter) {
        this.loadFilter(this.filter, this.project);
    }
},setMask:function() {
    this.container.mask("Saving...");
},unmask:function() {
    this.container.unmask();
}});
jx.form.BatchUpdateForm = function(_74d) {
    _74d = Ext.applyIf(_74d, {alternateRows:true});
    jx.form.BatchUpdateForm.superclass.constructor.call(this, _74d);
};
Ext.extend(jx.form.BatchUpdateForm, jx.form.JamaForm, {filter:null,project:null,typeId:null,messagesDiv:null,checkboxNode:null,labelClass:"label",loadFilter:function(_74e, _74f) {
    this.project = _74f;
    this.typeId = _74e.typeId;
    this.filter = _74e;
    this.checkboxNode.dom.checked = false;
    this.versionFormNode.hide();
    this.versionForm.load(this.getProjectId(), false, {});
    documentTypeSvc.getDocumentTypeMetaData(this.typeId, this.getProjectId(), false, this.loadCallback.createDelegate(this));
},createTable:function(div) {
    var _751 = {tag:"tr",children:[{tag:"th",width:"5%",cls:this.valueHeaderClass},{tag:"th",width:"40%",cls:this.labelHeaderClass,html:"Field"},{tag:"th",width:"55%",cls:this.valueHeaderClass,html:"Set New Value"}]};
    var _752 = Ext.DomHelper.append(div, {cls:this.tableClass,tag:"table",width:"100%",children:[{tag:"thead",children:[_751]},{tag:"tbody"}]});
    return _752;
},createRow:function(row, _754, obj) {
    var _756 = this.fields[_754];
    var val = this.getFieldFunc(obj, _756.getField());
    cell = document.createElement("td");
    row.appendChild(cell);
    this.createBatchCheckBox(cell, _756, false);
    var cell = document.createElement("td");
    cell.innerHTML = _756.label;
    if (this.labelClass) {
        cell.className = this.labelClass;
    }
    row.appendChild(cell);
    cell = document.createElement("td");
    row.appendChild(cell);
    this.fillCell(cell, _756, val);
    _756.control.disabled = true;
    if (this.valueClass) {
        cell.className = this.valueClass;
    }
    return row;
},createBatchCheckBox:function(cell, meta, val) {
    var _75c = document.createElement("input");
    _75c.type = "checkbox";
    cell.appendChild(_75c);
    _75c.value = "on";
    if (val) {
        _75c.checked = val;
    }
    _75c.id = this.id + "_" + meta.field;
    _75c.name = _75c.id;
    Ext.get(_75c).on("click", this.onCheckBoxClicked.createDelegate(this, [meta], 0));
    meta.styleControl = _75c;
},fillCell:function(cell, meta, val) {
    this.fillCellWithControl(cell, meta, val);
},setItem:function(item) {
    var body = this.domNode.tBodies[0];
    while (body.childNodes.length > 0) {
        body.removeChild(body.childNodes[0]);
    }
    this.item = item;
    this.destroyWidgetControls();
    for (var j = 0; j < this.fields.length; j++) {
        var meta = this.fields[j];
        if (!meta.readOnly && meta.dataType != "text" && meta.dataType != "string") {
            var _764 = meta.field;
            if (_764 != "modifiedDate" && _764 != "createdDate" && _764 != "createdBy" && _764 != "modifiedBy") {
                var row = document.createElement("tr");
                body.appendChild(row);
                this.createRow(row, j, item);
            }
        }
    }
},loadCallback:function(meta) {
    this.setFieldDefinitions(meta.fieldList);
    this.setItem({});
},loadForm:function(_767, _768, meta) {
    this.getProjectId() = _767;
    this.typeId = _768.typeId;
    this.filter = _768;
    this.checkboxNode.dom.checked = false;
    this.versionFormNode.hide();
    this.versionForm.load(this.getProjectId(), false, {});
    documentTypeSvc.getDocumentTypeMetaData(this.typeId, this.getProjectId(), false, this.loadCallback.createDelegate(this));
},batchUpdate:function() {
    var _76a = this.validateForm();
    if (_76a.length == 0) {
        var _76b = this.buildItemsToChangeFilter();
        var _76c = this.batchUpdateCallback.createDelegate(this);
        var _76d = this.checkboxNode.dom.checked;
        var _76e = null;
        var _76f = "";
        if (_76d) {
            var _770 = this.versionForm.getUpdatedItem();
            _76e = _770.distGroups;
            _76f = _770.comment;
        }
        documentManager.updateBatchDocument(_76b, this.filter, _76d, _76f, _76e, _76c);
        this.messagesDiv.style.display = "none";
    } else {
        this.messagesDiv.style.display = "block";
        this.messagesDiv.innerHTML = "";
        var _771 = "";
        for (var _772 = 0; _772 < _76a.length; _772++) {
            _771 += _76a[_772];
            _771 += "\n";
        }
        this.messagesDiv.innerHTML = this.encodeTextForDisplay(_771);
    }
},batchUpdateCallback:function(_773) {
    this.fireEvent("afterBatchUpdate", _773);
},batchDelete:function() {
    var _774 = "Are you sure you want to delete the items?";
    Ext.MessageBox.confirm("Confirm", _774, this.batchDeleteConfirm.createDelegate(this));
},batchDeleteConfirm:function(_775) {
    if (_775 == "yes") {
        documentManager.deactivateDocumentBatch(this.filter, this.batchDeleteCallback.createDelegate(this));
    }
},batchDeleteCallback:function() {
    this.fireEvent("afterBatchDelete");
},buildItemsToChangeFilter:function() {
    var _776 = {name:"batchupdate",typeId:this.typeId,parameters:new Array(),currentProjectId:this.getProjectId()};
    for (var i in this.fields) {
        var meta = this.fields[i];
        if (meta.styleControl && meta.styleControl.checked) {
            var _779 = "";
            var _77a = "";
            if (meta.control) {
                if (meta.dataType == Date || meta.dataType == "date") {
                    _779 = meta.control.getValue();
                    if (_779) {
                        _779 = _779.format(this.defaultDateFormat);
                    }
                } else {
                    if (meta.dataType == "Lookup") {
                        _779 = meta.control.value;
                    } else {
                        if (meta.dataType == "boolean") {
                            _779 = meta.control.checked ? "true" : "false";
                        } else {
                            _779 = meta.control.value;
                        }
                    }
                }
            }
            var _77b = {type:meta.dataType,field:meta.field,paramValues:[_779]};
            _776.parameters.push(_77b);
        }
    }
    return _776;
},toggleVersionForm:function() {
    if (this.checkboxNode.dom.checked) {
        this.versionFormNode.hide().show();
    } else {
        this.versionFormNode.hide().hide();
    }
},onCheckBoxClicked:function(meta, e) {
    if (meta.control.disabled) {
        meta.control.disabled = false;
    } else {
        meta.control.disabled = true;
    }
},validateForm:function() {
    var _77e = new Array();
    var _77f = false;
    for (var i in this.fields) {
        var meta = this.fields[i];
        if (meta.styleControl && meta.styleControl.checked) {
            _77f = true;
        }
    }
    if (!_77f) {
        var _782 = "At least one field must be checked";
        _77e.push(_782);
    }
    return _77e;
},onRender:function(ct, _784) {
    ct = Ext.get(ct);
    this.el = ct.createChild(this.autoCreate | {tag:"div",id:this.id || Ext.id()});
    var buf = ["<div style=\"display:none;\">","</div>","<span class=\"j-batch-update-section-header\">Select fields to update:</span>","<div></div>","<div class=\"formErrorMessage\" style=\"display:none;\"></div>","<div style=\"padding-bottom: 5px;\">","<input type=\"checkbox\" style=\"padding-left: 5px;\"/>","<span class=\"j-batch-update-section-header\">Version items in this update?</span>","</div>","<div></div>","<div></div>"];
    Ext.DomHelper.append(this.el, buf.join(""));
    var _786 = this.el.dom.childNodes[2];
    this.messagesDiv = this.el.dom.childNodes[3];
    this.checkboxNode = Ext.get(this.el.dom.childNodes[4].firstChild);
    this.versionFormNode = Ext.get(this.el.dom.childNodes[5]);
    this.versionFormNode.setVisibilityMode(Ext.Element.DISPLAY);
    this.versionFormNode.hide();
    this.checkboxNode.on("click", this.toggleVersionForm, this);
    this.versionForm = new jx.form.ItemSaveForm();
    this.versionForm.render(this.versionFormNode);
    this.domNode = this.createTable(_786);
    if (this.fieldDefinitions) {
        this.setFieldDefinitions(this.fieldDefinitions);
    }
    if (this.getFieldFunc == null) {
        this.getFieldFunc = this.getField;
    }
    if (this.setFieldFunc == null) {
        this.setFieldFunc = this.setField;
    }
},render:function() {
    jx.form.BatchUpdateForm.superclass.render.apply(this, arguments);
    if (this.filter && this.project) {
        this.loadFilter(this.filter, this.project);
    }
},getProjectId:function() {
    return this.project ? this.project.id : null;
},destroy:function() {
    if (this.rendered) {
        this.checkboxNode.removeAllListeners();
    }
    jx.form.BatchUpdateForm.superclass.destroy.apply(this, arguments);
}});
jx.form.CsvImportFieldForm = function(_787) {
    jx.form.CsvImportFieldForm.superclass.constructor.call(this, _787);
    this.readOnly = false;
    this.tableClass = "j-import-table";
};
Ext.extend(jx.form.CsvImportFieldForm, jx.form.JamaBasicForm, {changedClass:"changed",rowClass:"",rowAlternateClass:"alt",alternateRows:false,showDetails:false,createHeader:function() {
    var _788 = Ext.DomHelper.insertFirst(this.table, {tag:"thead"});
    var row = document.createElement("tr");
    _788.appendChild(row);
    var cell = document.createElement("td");
    row.appendChild(cell);
    cell.className = this.labelHeaderClass;
    cell.innerHTML = "Field";
    cell = document.createElement("td");
    row.appendChild(cell);
    cell.className = this.valueHeaderClass;
    cell.innerHTML = "Default Value";
    cell = document.createElement("td");
    row.appendChild(cell);
    cell.innerHTML = "Column#";
},createRow:function(meta, item) {
    var _78d = this.tbody;
    var val = this.getFieldFunc(item, meta);
    var row = Ext.DomHelper.append(_78d, {tag:"tr"});
    if (meta.dataType == "text") {
        meta.dataType = String;
    }
    var cell = document.createElement("td");
    cell.innerHTML = meta.label;
    if (this.labelClass) {
        cell.className = this.labelClass;
    }
    row.appendChild(cell);
    cell = document.createElement("td");
    row.appendChild(cell);
    this.fillCell(cell, meta, val);
    if (this.valueClass) {
        cell.className = this.valueClass;
    }
    cell = document.createElement("td");
    this.fillCellWithInput(cell, meta, "");
    row.appendChild(cell);
    return row;
},fillCellWithInput:function(cell, meta, val) {
    var _794 = document.createElement("input");
    _794.type = "text";
    _794.value = val;
    _794.id = this.getEl().id + "_" + meta.field;
    _794.name = _794.id;
    _794.size = "2";
    _794.maxLength = meta.maxLength ? meta.maxLength : 255;
    cell.appendChild(_794);
    meta.styleControl = _794;
},normalizeXML:function(s) {
    var str = "";
    var len = (s != null) ? s.length : 0;
    for (var i = 0; i < len; i++) {
        var ch = s.charAt(i);
        switch (ch) {
            case "<":
                str += "&lt;";
                break;
            case ">":
                str += "&gt;";
                break;
            case "&":
                str += "&amp;";
                break;
            case "\"":
                str += "&quot;";
                break;
            case "'":
                str += "&apos;";
                break;
            case "\n":
                str = +"&#10;";
                break;
            case "\r":
                str = +"&#12;";
                break;
            default:
                str += ch;
        }
    }
    return str;
},getUpdatedItem:function() {
    var item = "";
    item += "<fieldMapping>";
    for (var i = 0; i < this.fields.length; i++) {
        var meta = this.fields[i];
        var _79d = "";
        var _79e = "";
        if (meta.control) {
            if (meta.dataType == Date || meta.dataType == "date") {
                _79d = meta.control.getValue();
                if (_79d) {
                    _79d = _79d.format("m/d/Y");
                }
            } else {
                if (meta.dataType == "Lookup") {
                    _79d = meta.control.value;
                } else {
                    if (meta.dataType == "boolean") {
                        _79d = meta.control.checked ? "true" : "false";
                    } else {
                        if (meta.dataType == "text") {
                            if (meta.control.controlType == "fck") {
                                var _79f = FCKeditorAPI.GetInstance(meta.control.instanceName);
                                _79d = _79f.GetXHTML();
                            } else {
                                if (meta.control.widgetType == "Editor2") {
                                    _79d = meta.control.getEditorContent();
                                } else {
                                    _79d = meta.control.value;
                                }
                            }
                        } else {
                            _79d = meta.control.value;
                        }
                    }
                }
            }
        }
        if (meta.styleControl) {
            _79e = meta.styleControl.value;
        }
        if (_79e && !_79e.match(/^\d+$/)) {
            return "Invalid column # " + _79e;
        }
        item += "<field>";
        item += "<name>" + this.normalizeXML(meta.field) + "</name>";
        item += "<default>" + this.normalizeXML(_79d) + "</default>";
        item += "<style>" + this.normalizeXML(_79e) + "</style>";
        item += "</field>\n";
    }
    item += "</fieldMapping>";
    return item;
},load:function(meta) {
    this.setFieldDefinitions(meta.fieldList);
    this.setItem({});
},afterRender:function() {
    this.createHeader();
}});
jx.form.NotificationScheduleForm = function(_7a1) {
    jx.form.NotificationScheduleForm.superclass.constructor.call(this, _7a1);
};
Ext.extend(jx.form.NotificationScheduleForm, Ext.form.FormPanel, {currentScheduleId:null,initComponent:function() {
    Ext.apply(this, {labelAlign:"left",bodyBorder:false,border:false,bodyStyle:"padding: 5px 5px 0",labelWidth:100});
    jx.form.NotificationScheduleForm.superclass.initComponent.apply(this, arguments);
},render:function() {
    var that = this;
    notificationSvc.getJobScheduleByGroup("generate", {callback:function(list) {
        that.scheduleList = list;
    },async:false});
    notificationSvc.getUsersJobSchedule({callback:function(job) {
        that.jobValue = (job) ? job : {id:"0"};
    },async:false});
    this.currentScheduleId = that.jobValue.id;
    var _7a5 = (that.jobValue.id == 0) ? true : false;
    this.add({xtype:"radio",fieldLabel:i18n.g("j.l.off"),name:"schedNotifyRadio",inputValue:"0",checked:_7a5,listeners:{check:{fn:this.onCheck,scope:this}}});
    for (var i = 0; i < that.scheduleList.length; i++) {
        var _7a7 = (that.jobValue.id == that.scheduleList[i].id) ? true : false;
        this.add({xtype:"radio",fieldLabel:that.scheduleList[i].jobName,name:"schedNotifyRadio",inputValue:that.scheduleList[i].id,checked:_7a7});
    }
    jx.form.NotificationScheduleForm.superclass.render.apply(this, arguments);
},onCheck:function(_7a8, _7a9) {
    if (this.currentScheduleId != _7a8.getGroupValue()) {
        notificationSvc.saveUsersJobSchedule(_7a8.getGroupValue(), {callback:this.doOnSaveSuccess.createDelegate(this),async:false});
        this.currentScheduleId = _7a8.getGroupValue();
    }
},doOnSaveSuccess:function() {
    this.getAppContext().showMessage("Success", i18n.g("j.l.emailScheduleChange"));
}});
Ext.reg("jx.form.NotificationScheduleForm", jx.form.NotificationScheduleForm);
jx.form.ChangePasswordForm = function(_7aa) {
    Ext.applyIf(_7aa, {baseCls:"x-plain",labelWidth:100,defaultType:"textfield",labelAlign:"right",autoScroll:true,bodyStyle:"padding:10px",items:[{fieldLabel:i18n.g("j.l.password"),name:"password",inputType:"password",anchor:"100%"},{fieldLabel:i18n.g("j.l.confirmPassword"),inputType:"password",name:"repeatedPassword",anchor:"100%"}]});
    jx.form.ChangePasswordForm.superclass.constructor.call(this, _7aa);
};
Ext.extend(jx.form.ChangePasswordForm, Ext.form.FormPanel, {render:function() {
    jx.form.ChangePasswordForm.superclass.render.apply(this, arguments);
},updatePassword:function() {
    var _7ab = this.getForm().getValues();
    if (this.validatePassword(_7ab)) {
        _7ab.id = this.getAppContext().user.id;
        _7ab.userName = this.getAppContext().user.userName;
        user.updateUserPassword(_7ab, this.onSuccessSavePassword.createDelegate(this));
    } else {
        this.getAppContext().showMessage("Failure", i18n.g("j.m.passwordFailed"), this);
    }
},onSuccessSavePassword:function() {
    this.fireEvent("afterSave");
},validatePassword:function(_7ac) {
    var _7ad = [];
    if (!_7ac.password) {
        _7ad.push(i18n.g("j.l.passwordRequired"));
    }
    if (!_7ac.repeatedPassword) {
        _7ad.push(i18n.g("j.l.passwordRepeatedRequired"));
    }
    if (_7ac.password != _7ac.repeatedPassword) {
        _7ad.push(i18n.g("j.l.passwordNoMatch"));
    }
    if (_7ad && _7ad.length > 0) {
        return false;
    }
    return true;
}});
Ext.reg("jx.form.ChangePasswordForm", jx.form.ChangePasswordForm);
jx.form.LdapPropertyForm = function(_7ae) {
    this.orgStore = jx.data.StoreFactory.buildOrganizationStore(true);
    this.roleStore = jx.data.StoreFactory.buildRoleStore();
    _7ae = Ext.applyIf(_7ae, {labelWidth:300,defaultType:"textfield",labelAlign:"right",autoScroll:true,bodyStyle:"padding:10px",fileUpload:true,items:[{xtype:"checkbox",fieldLabel:"Enable LDAP",name:"enableLdap"},{xtype:"checkbox",fieldLabel:"Enable Self Registration",name:"enableSelfReg"},{xtype:"combo",hiddenName:"defaultOrgId",fieldLabel:"Default Organization for Self-registered User",store:this.orgStore,displayField:"name",valueField:"id",mode:"local",triggerAction:"all",emptyText:"Select an organization...",selectOnFocus:true,editable:false,anchor:"100%",listeners:{select:this.onChangeOrganization,scope:this}},{xtype:"combo",hiddenName:"defaultRoleId",fieldLabel:"Default User Group for Self-registered User",store:this.roleStore,displayField:"name",valueField:"id",mode:"local",triggerAction:"all",emptyText:"Select an user group...",selectOnFocus:true,editable:false,anchor:"100%",allowBlank:true,anchor:"100%"}],buttons:[{text:"Save",handler:this.onSave,scope:this}]});
    jx.form.LdapPropertyForm.superclass.constructor.call(this, _7ae);
};
Ext.extend(jx.form.LdapPropertyForm, Ext.form.FormPanel, {render:function() {
    jx.form.LdapPropertyForm.superclass.render.apply(this, arguments);
    this.doLayout();
    this.orgStore.on("load", this.setOrgValue, this);
    this.roleStore.on("load", this.setRoleValue, this);
    var self = this;
    propertySvc.getLdapProperties({callback:function(item) {
        self.props = item;
    },async:false});
    var _7b1 = this.props;
    this.getForm().setValues(_7b1);
    this.orgStore.load();
    if (_7b1.defaultOrgId) {
        this.roleStore.load({arg:[_7b1.defaultOrgId]});
    }
},setOrgValue:function() {
    this.getForm().findField("defaultOrgId").setValue(this.props.defaultOrgId);
},setRoleValue:function() {
    this.getForm().findField("defaultRoleId").setValue(this.props.defaultRoleId);
},onSave:function() {
    var _7b2 = this.getForm().getObjectValues();
    propertySvc.saveLdapProperties(_7b2, this.onSaveCallback.createDelegate(this));
},onSaveCallback:function(item) {
    this.getAppContext().showMessage("Success", "LDAP propeties are saved.");
    this.getForm().setValues(item);
    this.getAppContext().setLdapProperties(item);
},onChangeOrganization:function(_7b4) {
    var _7b5 = _7b4.getValue();
    this.roleStore.load({arg:[_7b5]});
    this.getForm().findField("defaultRoleId").reset();
}});
Ext.reg("jx.form.LdapPropertyForm", jx.form.LdapPropertyForm);
jx.tree.DWRTreeLoader = function(_7b6) {
    jx.tree.DWRTreeLoader.superclass.constructor.call(this, _7b6);
};
Ext.extend(jx.tree.DWRTreeLoader, Ext.tree.TreeLoader, {load:function(node, _7b8) {
    if (this.clearOnLoad) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }
    if (node.attributes.children) {
        var cs = node.attributes.children;
        for (var i = 0,len = cs.length; i < len; i++) {
            node.appendChild(this.createNode(cs[i]));
        }
        if (typeof _7b8 == "function") {
            _7b8();
        }
    } else {
        if (this.dwrCall) {
            this.requestData(node, _7b8);
        }
    }
},requestData:function(node, _7bc) {
    if (this.fireEvent("beforeload", this, node, _7bc) !== false) {
        var _7bd = new Array();
        var _7be = this.handleResponse.createDelegate(this, [node,_7bc], 1);
        var _7bf = this.handleFailure.createDelegate(this, [node,_7bc], 1);
        _7bd.push(node.id);
        if (this.dwrArgs) {
            _7bd = _7bd.concat(this.dwrArgs.slice());
        }
        _7bd.push({callback:_7be,errorHandler:_7bf});
        this.transId = true;
        this.dwrCall.apply(this, _7bd);
    } else {
        if (typeof _7bc == "function") {
            _7bc();
        }
    }
},processResponse:function(_7c0, node, _7c2) {
    try {
        for (var i = 0; i < _7c0.length; i++) {
            var n = this.createNode(_7c0[i]);
            if (n) {
                node.appendChild(n);
            }
        }
        if (typeof _7c2 == "function") {
            _7c2(this, node);
        }
    }
    catch(e) {
        this.handleFailure(_7c0);
    }
},handleResponse:function(_7c5, node, _7c7) {
    this.transId = false;
    this.processResponse(_7c5, node, _7c7);
    this.fireEvent("load", this, node, _7c5);
},handleFailure:function(_7c8, node, _7ca) {
    this.transId = false;
    this.fireEvent("loadexception", this, node, _7c8);
    if (typeof _7ca == "function") {
        _7ca(this, node);
    }
}});
jx.tree.ItemTree = function(_7cb) {
    _7cb = Ext.applyIf(_7cb, {folderOnly:true,animate:true,enableDD:true,autoScroll:true,containerScroll:true,rootVisible:true,ddGroup:"artifactDD",root:new Ext.tree.AsyncTreeNode({iconCls:"j-project-icon",text:"No project selected",id:"p-0"})});
    Ext.apply(this, _7cb);
    this.loader = new jx.tree.DWRTreeLoader({dwrCall:documentManager.getExtTreeNodes,dwrArgs:[this.folderOnly,this.projectId]});
    jx.tree.ItemTree.superclass.constructor.call(this, _7cb);
};
Ext.extend(jx.tree.ItemTree, Ext.tree.TreePanel, {folderOnly:false,projectId:null,loadProject:function(_7cc) {
    this.project = _7cc;
    if (this.enableDD) {
        this.enableDD = _7cc.canAdmin() || _7cc.canWrite();
    }
    this.loader.dwrArgs = [this.folderOnly,_7cc.id];
    var _7cd = "p-" + _7cc.id;
    var name = _7cc.name;
    if (!this.rendered) {
        this.root = new Ext.tree.AsyncTreeNode({text:name,draggable:false,iconCls:"j-project-icon",id:_7cd});
    } else {
        this.getSelectionModel().clearSelections();
        var root = this.root;
        root.attributes.id = _7cd;
        root.id = _7cd;
        root.setText(name);
        root.loaded = false;
        root.reload();
        root.expand();
    }
    this.fireEvent("afterLoadItemTree");
},loadRelease:function(_7d0) {
    this.enableDD = _7d0.canAdmin() || _7d0.canWrite();
    this.loader.dwrArgs = [this.folderOnly,_7d0.id];
    this.getSelectionModel().clearSelections();
    var _7d1 = "m-" + _7d0.id;
    var name = _7d0.name;
    var root = this.root;
    if (!root) {
        root = new Ext.tree.AsyncTreeNode({text:name,draggable:false,id:_7d1});
        this.setRootNode(root);
        this.render();
    } else {
        root.attributes.id = _7d1;
        root.id = _7d1;
        root.setText(name);
        root.reload();
    }
    root.expand();
},loadDocumentGroup:function(_7d4) {
    this.getSelectionModel().clearSelections();
    var _7d5 = "g-" + _7d4.id;
    var name = _7d4.displayPlural;
    var root = this.root;
    if (!root) {
        root = new Ext.tree.AsyncTreeNode({text:name,draggable:false,id:_7d5});
        this.setRootNode(root);
        this.render();
    } else {
        root.id = _7d5;
        root.attributes.id = _7d5;
        root.setText(name);
        root.reload();
    }
    root.expand();
},loadProjectType:function(_7d8, _7d9) {
    this.getSelectionModel().clearSelections();
    this.loader.dwrArgs = [true,_7d9.id];
    var _7da = "t-" + _7d8;
    var name = "";
    var root = this.root;
    if (!root) {
        root = new Ext.tree.AsyncTreeNode({text:name,draggable:false,id:_7da});
        this.setRootNode(root);
        this.render();
    } else {
        root.id = _7da;
        root.attributes.id = _7da;
        root.setText("");
        root.reload();
    }
    root.expand();
}});
jx.tree.ProjectTree = function(_7dd) {
    _7dd = Ext.applyIf(_7dd, {folderOnly:true,animate:true,enableDD:this.getAppContext().getMask() != 0,containerScroll:true,rootVisible:true,ddGroup:"projectDD",root:new Ext.tree.AsyncTreeNode({text:this.getAppContext().organization.name,draggable:false,expanded:true,iconCls:"j-organization-icon",id:"o-" + this.getAppContext().organization.id})});
    Ext.apply(this, _7dd);
    this.loader = new jx.tree.DWRTreeLoader({dwrCall:project.getProjectsTree,dwrArgs:[]}),jx.tree.ProjectTree.superclass.constructor.call(this, _7dd);
};
Ext.extend(jx.tree.ProjectTree, Ext.tree.TreePanel, {loadOrganization:function() {
    var root = this.root;
    if (!this.root || !this.rendered) {
        root = new Ext.tree.AsyncTreeNode({text:this.getAppContext().organization.name,draggable:false,expanded:true,iconCls:"j-organization-icon",id:"o-" + this.getAppContext().organization.id});
        this.root = root;
    } else {
        root.attributes.id = "o-" + this.getAppContext().organization.id;
        root.id = "o-" + this.getAppContext().organization.id;
        root.setText(this.getAppContext().organization.name);
        root.reload();
        root.expand();
    }
    this.getAppContext().fireEvent("afterLoadOrganization");
}});
Ext.reg("jx.tree.ProjectTree", jx.tree.ProjectTree);
jx.panel.AdminPanel = function(_7df) {
    jx.panel.AdminPanel.superclass.constructor.call(this, _7df);
};
Ext.extend(jx.panel.AdminPanel, Ext.TabPanel, {initComponent:function() {
    Ext.apply(this, {defaults:{bodyStyle:"padding:10px"},activeTab:0,items:[{xtype:"jx.panel.OrgListPanel",id:this.getId() + "-orgList",title:i18n.g("j.t.rootOrganizationList")},{xtype:"jx.panel.SystemPropertyPanel",id:this.getId() + "-property",title:i18n.g("j.t.rootSystemProperties")},{xtype:"jx.panel.AdminUserListPanel",id:this.getId() + "-user",title:i18n.g("j.t.rootUsers")},{xtype:"jx.panel.AdminLookupListPanel",id:this.getId() + "-lookupList",title:i18n.g("j.t.rootPickLists")},{xtype:"jx.panel.AdminReportPanel",id:this.getId() + "-tab-lookupList",title:i18n.g("j.t.rootReports")},{xtype:"jx.panel.AdminLicensePanel",id:this.getId() + "-license",title:i18n.g("j.t.rootLicenseManagement")},{xtype:"jx.panel.DataBackupPanel",id:this.getId() + "-backup",title:i18n.g("j.t.rootBackup")}]});
    jx.panel.AdminPanel.superclass.initComponent.call(this);
}});
Ext.reg("jx.panel.AdminPanel", jx.panel.AdminPanel);
jx.panel.AdminHeader = function(_7e0) {
    jx.panel.AdminHeader.superclass.constructor.call(this, _7e0);
};
Ext.extend(jx.panel.AdminHeader, Ext.Panel, {data:null,initComponent:function() {
    this.data = new jx.ItemData({project:new jx.Project({id:0}),org:this.getAppContext().getOrganization()});
    Ext.apply(this, {autoScroll:true,id:"o-admin-header-panel",layoutConfig:{columns:2},defaults:{bodyStyle:"padding: 0px; border: 0px"},items:[{id:"logoContainer",html:String.format("<img src=\"{0}\" id=\"o-logo\"/>", i18n.g("jama.headerLogo", "img/jama_contour_reflection.jpg"))},{xtype:"jx.panel.AdminLogoutPanel",data:this.data,border:false,height:20,width:350}]});
    jx.panel.AdminHeader.superclass.initComponent.call(this);
},render:function() {
    jx.panel.AdminHeader.superclass.render.apply(this, arguments);
}});
Ext.reg("jx.panel.AdminHeader", jx.panel.AdminHeader);
jx.panel.OrgListPanel = function(_7e1) {
    jx.panel.OrgListPanel.superclass.constructor.call(this, _7e1);
};
Ext.extend(jx.panel.OrgListPanel, Ext.Panel, {initComponent:function() {
    Ext.apply(this, {autoScroll:false,layout:"fit",items:[{id:this.getId() + "-orgGrid",xtype:"jx.grid.OrganizationGrid",autoScroll:true,listeners:{render:this.onGridRender.createDelegate(this)}}]});
    jx.panel.OrgListPanel.superclass.initComponent.call(this);
},onGridRender:function(grid) {
    grid.loadList();
},loadList:function() {
    this.grid.loadList();
}});
Ext.reg("jx.panel.OrgListPanel", jx.panel.OrgListPanel);
jx.panel.AdminLookupListPanel = function(_7e3) {
    jx.panel.AdminLookupListPanel.superclass.constructor.call(this, _7e3);
};
Ext.extend(jx.panel.AdminLookupListPanel, Ext.Panel, {initComponent:function() {
    Ext.apply(this, {layout:"fit",items:[{xtype:"jx.grid.LookupGrid",scope:1,refId:0,loadType:true,listeners:{render:this.onGridRender.createDelegate(this)},autoScroll:true}],autoScroll:false});
    jx.panel.AdminLookupListPanel.superclass.initComponent.call(this);
},onGridRender:function(grid) {
    grid.loadTypeList();
}});
Ext.reg("jx.panel.AdminLookupListPanel", jx.panel.AdminLookupListPanel);
jx.panel.AdminLicensePanel = function(_7e5) {
    this.updateForm = this.createUpdateForm(_7e5);
    this.licenseForm = new jx.form.LicenseForm({});
    _7e5 = Ext.applyIf(_7e5, {listTitle:"License",autoScroll:true,tbar:[],items:[{items:this.licenseForm},this.updateForm]});
    jx.panel.AdminLicensePanel.superclass.constructor.call(this, _7e5);
};
Ext.extend(jx.panel.AdminLicensePanel, Ext.Panel, {loadOrg:true,orgId:null,loadLicense:function(_7e6) {
    licenseSvc.getSystemLicense(_7e6, {callback:this.loadLicenseCallback.createDelegate(this)});
},loadLicenseCallback:function(_7e7) {
    this.licenseForm.setItem(_7e7);
},saveLicense:function() {
    var data = this.updateForm.getForm().getValues().licenseData;
    if (data) {
        licenseSvc.saveSystemLicense(data, this.orgId, {callback:this.saveLicenseDataCallback.createDelegate(this)});
    }
},saveLicenseDataCallback:function(_7e9) {
    this.updateForm.getForm().reset();
    this.loadLicenseCallback(_7e9);
},createCombo:function() {
    this.orgStore = jx.data.StoreFactory.buildOrganizationStore(true);
    var _7ea = new Ext.form.ComboBox({store:this.orgStore,displayField:"name",valueField:"id",mode:"local",triggerAction:"all",emptyText:"Select an organization...",selectOnFocus:true,editable:false});
    _7ea.on("select", this.onChangeOrganization, this);
    return _7ea;
},onChangeOrganization:function(_7eb) {
    var _7ec = _7eb.getValue();
    this.orgId = _7ec;
    this.updateForm.buttons[0].enable();
    this.loadLicense(_7ec);
},createUpdateForm:function() {
    return new Ext.form.FormPanel({labelWidth:75,frame:true,title:"Update License",bodyStyle:"padding:5px 5px 0",labelAlign:"top",items:[{xtype:"textarea",fieldLabel:"Paste License Text Here",name:"licenseData",allowBlank:true,height:120,anchor:"100%"}],buttons:[{text:"Update",handler:this.saveLicense,scope:this}]});
},render:function() {
    jx.panel.AdminLicensePanel.superclass.render.apply(this, arguments);
    this.doLayout();
    var tb = this.getTopToolbar();
    if (this.loadOrg) {
        this.titleItem = tb.addText(this.listTitle);
        tb.addText("&nbsp;&nbsp;&nbsp");
        tb.add(this.createCombo());
        this.updateForm.buttons[0].disable();
    } else {
        this.titleItem = tb.addText(this.listTitle);
    }
    if (this.orgId) {
        this.loadLicense(this.orgId);
    }
    if (this.loadOrg) {
        this.orgStore.load();
    }
}});
Ext.reg("jx.panel.AdminLicensePanel", jx.panel.AdminLicensePanel);
jx.panel.AdminReportPanel = function(_7ee) {
    _7ee = Ext.applyIf(_7ee, {layout:"fit",items:[{xtype:"jx.grid.ReportGrid"}]});
    jx.panel.AdminReportPanel.superclass.constructor.call(this, _7ee);
};
Ext.extend(jx.panel.AdminReportPanel, Ext.Panel, {});
Ext.reg("jx.panel.AdminReportPanel", jx.panel.AdminReportPanel);
jx.panel.AdminUserListPanel = function(_7ef) {
    _7ef = Ext.applyIf(_7ef, {layout:"card",activeItem:0,items:[{xtype:"jx.grid.UserGrid",listeners:{title:"User List",render:this.onGridRender,addLdapUser:this.addLdapUser,scope:this},useLdap:this.getAppContext().getUseLdap(),loadOrg:true},{title:"LDAP User Lookup",xtype:"jx.grid.LdapUserGrid",listeners:{backToUserList:this.showUserList,afterSave:this.afterSaveUser,scope:this}}]});
    this.getAppContext().on("ldapPropertiesChange", this.changeLdapProperties, this);
    jx.panel.AdminUserListPanel.superclass.constructor.call(this, _7ef);
};
Ext.extend(jx.panel.AdminUserListPanel, Ext.Panel, {initComponent:function() {
    jx.panel.AdminUserListPanel.superclass.initComponent.call(this);
},changeLdapProperties:function(_7f0) {
    var _7f1 = this.items.itemAt(0);
    if (_7f1.rendered) {
        _7f1.setUseLdap(_7f0.enableLdap);
    } else {
        _7f1.useLdap = _7f0.enableLdap;
    }
},addLdapUser:function(_7f2) {
    this.layout.setActiveItem(1);
    this.items.itemAt(1).setOrgId(_7f2);
},showUserList:function() {
    this.layout.setActiveItem(0);
},afterSaveUser:function() {
    this.items.itemAt(0).loadList();
},afterRender:function() {
    jx.panel.AdminUserListPanel.superclass.afterRender.call(this);
},onGridRender:function(grid) {
    grid.loadOrgList();
}});
Ext.reg("jx.panel.AdminUserListPanel", jx.panel.AdminUserListPanel);
jx.panel.DataBackupPanel = function(_7f4) {
    _7f4 = Ext.applyIf(_7f4, {autoScroll:true,items:[{html:"<div style=\"padding: 10px;\"><span class=\"sectionHeader\">Data Backup" + "</span><br/><table class=noBorderTable\"><tr><td id=\"dbBackup_errorZone\" colspan=\"2\">" + "</td></tr><tr><td><span class=\"sectionHeader\">Option 1:</span> Download the Backup " + "XML File</td></tr><tr><td colspan=\"2\"><input type=\"button\" class=\"button\" id=\"dbBackup_download\" " + "value=\"Download\" /></td></tr><tr><td>&nbsp;</td></tr><tr><td><span class=\"sectionHeader\">Option 2:" + "</span> Save the Backup File to Server</td></tr><tr><td>Specify a server file name with full path:</td>" + "<tr><td><input type=\"text\" id=\"dbBackup_file\" name=\"dbBackup_file\" size=\"50\" /></td></tr><tr><td><input " + "type=\"button\" class=\"button\" id=\"dbBackup_saveFile\" value=\"Save to Server\" /></td></tr></table></div><div>" + "<br/><br/><span class=\"sectionHeader\">Download DTD</span><br/><a id=\"dbBackup_dtd\" href=\"javascript:void(0)\">" + "Download DTD for backup file</a></div>"}]});
    jx.panel.DataBackupPanel.superclass.constructor.call(this, _7f4);
};
Ext.extend(jx.panel.DataBackupPanel, Ext.Panel, {initComponent:function() {
    jx.panel.DataBackupPanel.superclass.initComponent.call(this);
},render:function() {
    jx.panel.DataBackupPanel.superclass.render.apply(this, arguments);
    this.doLayout();
    Ext.get("dbBackup_download").on("click", this.download, this);
    Ext.get("dbBackup_saveFile").on("click", this.saveFile, this);
    Ext.get("dbBackup_dtd").on("click", this.exportDtd, this);
},download:function() {
    if (confirm("Are you sure you want to backup the whole database?")) {
        var _7f5 = window.open("backup.req", "_blank", "height=800,width=1000,status=yes,toolbar=yes,menubar=yes,scrollbars=yes,location=yes,resizable=1");
        if (_7f5) {
            _7f5.focus();
        }
    }
},saveFile:function() {
    var _7f6 = $("dbBackup_file").value;
    if (!_7f6) {
        alert("File name is required");
        return;
    }
    if (confirm("Are you sure you want to backup the whole database?")) {
        var _7f7 = window.open("backup.req?fileName=" + escape(_7f6), "_blank", "height=800,width=1000,status=yes,toolbar=yes,menubar=yes,scrollbars=yes,location=yes,resizable=1");
        if (_7f7) {
            _7f7.focus();
        }
    }
},exportDtd:function() {
    if (confirm("Are you sure you want to download DTD for the backup file?")) {
        var _7f8 = window.open("backup.req?type=dtd", "_blank", "height=800,width=1000,status=yes,toolbar=yes,menubar=yes,scrollbars=yes,location=yes,resizable=1");
        if (_7f8) {
            _7f8.focus();
        }
    }
}});
Ext.reg("jx.panel.DataBackupPanel", jx.panel.DataBackupPanel);
jx.panel.SystemPropertyPanel = function(_7f9) {
    _7f9 = Ext.applyIf(_7f9, {autoScroll:true,layout:"fit",items:new Ext.TabPanel({activeItem:0,items:[{title:"General Properties",items:{xtype:"jx.form.SystemPropertyForm"}},{title:"LDAP Properties",items:[{title:"LDAP Properties",xtype:"jx.form.LdapPropertyForm"},{title:"LDAP Providers",xtype:"jx.grid.LdapConfigGrid"}],listeners:{activate:function(_7fa) {
        _7fa.doLayout();
    },scope:this}}]})});
    jx.panel.SystemPropertyPanel.superclass.constructor.call(this, _7f9);
};
Ext.extend(jx.panel.SystemPropertyPanel, Ext.Panel, {initComponent:function() {
    jx.panel.SystemPropertyPanel.superclass.initComponent.call(this);
},render:function() {
    jx.panel.SystemPropertyPanel.superclass.render.apply(this, arguments);
    this.doLayout();
}});
Ext.reg("jx.panel.SystemPropertyPanel", jx.panel.SystemPropertyPanel);
jx.form.SystemPropertyForm = function(_7fb) {
    Ext.applyIf(_7fb, {labelWidth:"40%",fieldDefinitions:[{field:"jama.system.smtp.host",label:"SMTP Host",dataType:"string"},{field:"jama.system.smtp.port",label:"SMTP Port",dataType:"string"},{field:"jama.system.smtp.user",label:"SMTP User",dataType:"string"},{field:"jama.system.smtp.password",label:"SMPT Password",dataType:"string",inputType:"password"},{field:"jama.system.smtp.auth",label:"Authorization Required",dataType:"boolean"},{field:"jama.system.format.datetime",label:"Javascript Date Time Format",dataType:"string"},{field:"jama.system.format.java.datetime",label:"Java Date Time Format",dataType:"string"},{field:"jama.system.format.dayMonthYear",label:"Javascript Day/Month/Year Format",dataType:"string"},{field:"jama.system.format.java.dayMonthYear",label:"Java Day/Month/Year Format",dataType:"string"}],title:"",buttonPanelLocation:"bottom",buttonPanelAlign:"left",labelClass:"propertyLabel",titlePanelClass:"textLabel",dwrLoadCall:propertySvc.getSystemPropertyList,dwrSaveCall:propertySvc.saveSystemPropertyList,dwrArgs:[0]});
    jx.form.SystemPropertyForm.superclass.constructor.call(this, _7fb);
};
Ext.extend(jx.form.SystemPropertyForm, jx.form.DwrJamaForm, {getField:function(obj, meta) {
    var o = obj.properties;
    if (o) {
        o = obj.properties[meta.field];
    }
    var val = "";
    if (o) {
        if (o.propertyType == 1) {
            val = o.propertyValue == "true" ? true : false;
        } else {
            val = o.propertyValue;
        }
    }
    return val;
},setField:function(obj, meta, _802) {
    var o = obj.properties;
    if (o) {
        o = o[meta.field];
    }
    if (o) {
        if (o.propertyType == 1) {
            o.propertyValue = (_802 ? "true" : "false");
        } else {
            o.propertyValue = _802;
        }
    }
},afterRender:function() {
    jx.form.SystemPropertyForm.superclass.afterRender.call(this);
    this.load();
}});
Ext.reg("jx.form.SystemPropertyForm", jx.form.SystemPropertyForm);
jx.panel.ProjectAdminPanel = function(_804) {
    jx.panel.ProjectAdminPanel.superclass.constructor.call(this, _804);
};
Ext.extend(jx.panel.ProjectAdminPanel, Ext.TabPanel, {initComponent:function() {
    Ext.apply(this, {defaults:{bodyStyle:"padding:10px",data:this.data},activeTab:0,minTabWidth:115,tabWidth:135,enableTabScroll:true,items:[{xtype:"jx.panel.ProjectPropertyPanel",id:this.getId() + "-property",title:"Settings"},{xtype:"jx.panel.ReleaseListPanel",id:this.getId() + "-release",title:"Release List",autoScroll:true},{xtype:"jx.panel.ProjectLookupListPanel",id:this.getId() + "-lookup",title:"Pick Lists"},{xtype:"jx.panel.EmailGroupListPanel",id:this.getId() + "-email-group",title:"Email Groups"},{xtype:"jx.panel.ProjectPermissionListPanel",id:this.getId() + "-permission",title:"Project Permissions"},{xtype:"jx.panel.BaselineListPanel",id:this.getId() + "-baseline",title:"Baselines"}]});
    jx.panel.ProjectAdminPanel.superclass.initComponent.call(this);
}});
Ext.reg("jx.panel.ProjectAdminPanel", jx.panel.ProjectAdminPanel);
jx.panel.BaselineListPanel = function(_805) {
    _805 = Ext.applyIf(_805, {layout:"fit",items:[{xtype:"jx.grid.BaselineGrid",autoScroll:true,data:_805.data}]});
    jx.panel.BaselineListPanel.superclass.constructor.call(this, _805);
};
Ext.extend(jx.panel.BaselineListPanel, Ext.Panel, {});
Ext.reg("jx.panel.BaselineListPanel", jx.panel.BaselineListPanel);
jx.panel.DataImportPanel = function(_806) {
    jx.panel.DataImportPanel.superclass.constructor.call(this, _806);
};
Ext.extend(jx.panel.DataImportPanel, Ext.Panel, {initComponent:function() {
    Ext.apply(this, {});
    jx.panel.DataImportPanel.superclass.initComponent.call(this);
},afterRender:function() {
    jx.panel.DataImportPanel.superclass.afterRender.call(this);
}});
Ext.reg("jx.panel.DataImportPanel", jx.panel.DataImportPanel);
jx.panel.EmailGroupListPanel = function(_807) {
    _807 = Ext.applyIf(_807, {layout:"fit",items:[{xtype:"jx.grid.EmailGroupGrid",autoScroll:true,data:_807.data,listeners:{render:this.onGridRender.createDelegate(this)}}]});
    jx.panel.EmailGroupListPanel.superclass.constructor.call(this, _807);
};
Ext.extend(jx.panel.EmailGroupListPanel, Ext.Panel, {onGridRender:function(grid) {
    grid.loadList();
    grid.loadUserOptions();
}});
Ext.reg("jx.panel.EmailGroupListPanel", jx.panel.EmailGroupListPanel);
jx.panel.ProjectDetailPanel = function(_809) {
    jx.panel.ProjectDetailPanel.superclass.constructor.call(this, _809);
};
Ext.extend(jx.panel.ProjectDetailPanel, Ext.Panel, {initComponent:function() {
    Ext.apply(this, {});
    jx.panel.ProjectDetailPanel.superclass.initComponent.call(this);
},afterRender:function() {
    jx.panel.ProjectDetailPanel.superclass.afterRender.call(this);
}});
Ext.reg("jx.panel.ProjectDetailPanel", jx.panel.ProjectDetailPanel);
jx.panel.ProjectLookupListPanel = function(_80a) {
    jx.panel.ProjectLookupListPanel.superclass.constructor.call(this, _80a);
};
Ext.extend(jx.panel.ProjectLookupListPanel, Ext.Panel, {initComponent:function() {
    Ext.apply(this, {layout:"fit",items:[{xtype:"jx.grid.LookupGrid",scope:3,autoScroll:true,refId:this.data.project.id,loadType:true,listeners:{render:this.onGridRender.createDelegate(this)},autoScroll:true}],autoScroll:false});
    jx.panel.ProjectLookupListPanel.superclass.initComponent.call(this);
},onGridRender:function(grid) {
    grid.loadTypeList();
}});
Ext.reg("jx.panel.ProjectLookupListPanel", jx.panel.ProjectLookupListPanel);
jx.panel.ProjectPermissionListPanel = function(_80c) {
    _80c = Ext.applyIf(_80c, {layout:"fit",items:[{xtype:"jx.grid.PermissionGrid",autoScroll:true,listeners:{render:this.onGridRender.createDelegate(this)},data:_80c.data,loadProject:false}]});
    jx.panel.ProjectPermissionListPanel.superclass.constructor.call(this, _80c);
};
Ext.extend(jx.panel.ProjectPermissionListPanel, Ext.Panel, {initComponent:function() {
    jx.panel.ProjectPermissionListPanel.superclass.initComponent.call(this);
},afterRender:function() {
    jx.panel.ProjectPermissionListPanel.superclass.afterRender.call(this);
},onGridRender:function(grid) {
}});
Ext.reg("jx.panel.ProjectPermissionListPanel", jx.panel.ProjectPermissionListPanel);
jx.panel.ProjectPropertyPanel = function(_80e) {
    _80e = Ext.applyIf(_80e, {labelWidth:75,autoScroll:true,bodyStyle:"padding:5px 5px 0",width:350,defaults:{width:230},items:[{xtype:"jx.form.ProjectPropertyForm",data:_80e.data}]});
    jx.panel.ProjectPropertyPanel.superclass.constructor.call(this, _80e);
};
Ext.extend(jx.panel.ProjectPropertyPanel, Ext.Panel, {});
Ext.reg("jx.panel.ProjectPropertyPanel", jx.panel.ProjectPropertyPanel);
jx.panel.ReleaseListPanel = function(_80f) {
    _80f = Ext.applyIf(_80f, {layout:"fit",items:[{xtype:"jx.grid.ReleaseGrid",autoScroll:true,data:_80f.data,listeners:{render:this.onGridRender.createDelegate(this)}}]});
    jx.panel.ReleaseListPanel.superclass.constructor.call(this, _80f);
};
Ext.extend(jx.panel.ReleaseListPanel, Ext.Panel, {initComponent:function() {
    Ext.apply(this, {});
    jx.panel.ReleaseListPanel.superclass.initComponent.call(this);
},afterRender:function() {
    jx.panel.ReleaseListPanel.superclass.afterRender.call(this);
},onGridRender:function(grid) {
    grid.loadList();
}});
Ext.reg("jx.panel.ReleaseListPanel", jx.panel.ReleaseListPanel);
jx.window.OrgAdminWindow = function(_811) {
    _811 = Ext.applyIf(_811, {title:"System Settings",width:850,height:600,modal:true,closable:true,closeAction:"hide",cancelAction:"hide",maximizable:true,minimizable:false,buttons:[{text:"Close",handler:this.onCancel,scope:this}],layout:"fit",items:{xtype:"jx.panel.OrgAdminPanel"}});
    jx.window.OrgAdminWindow.superclass.constructor.call(this, _811);
};
Ext.extend(jx.window.OrgAdminWindow, Ext.Window, {onEvent:function() {
},beforeDestroy:function() {
    jx.window.OrgAdminWindow.superclass.beforeDestroy.apply(this, arguments);
}});
Ext.reg("jx.window.OrgAdminWindow", jx.window.OrgAdminWindow);
jx.panel.OrgAdminPanel = function(_812) {
    jx.panel.OrgAdminPanel.superclass.constructor.call(this, _812);
};
Ext.extend(jx.panel.OrgAdminPanel, Ext.TabPanel, {initComponent:function() {
    var org = this.getAppContext().getOrganization();
    Ext.apply(this, {defaults:{bodyStyle:"padding:10px",orgId:org.id},activeTab:0,minTabWidth:115,tabWidth:135,enableTabScroll:true,items:[{xtype:"jx.panel.OrgDetailPanel",title:"Organizational Settings",id:this.getId() + "-detail"},{xtype:"jx.panel.AdminLicensePanel",title:"License",loadOrg:false,id:this.getId() + "-license"},{xtype:"jx.panel.OrgUserListPanel",title:"Users",orgId:org.id,id:this.getId() + "-user"},{xtype:"jx.panel.UserGroupListPanel",title:"User Groups",id:this.getId() + "-group"},{xtype:"jx.panel.OrgPermissionPanel",title:"Project Permissions",id:this.getId() + "-perm"},{xtype:"jx.panel.LookupTypePanel",title:"Pick Lists",id:this.getId() + "-pickup"},{xtype:"jx.panel.ItemTypePanel",title:"Item Types",id:this.getId() + "-item-type"}]});
    jx.panel.OrgAdminPanel.superclass.initComponent.call(this);
}});
Ext.reg("jx.panel.OrgAdminPanel", jx.panel.OrgAdminPanel);
jx.panel.LookupTypePanel = function(_814) {
    _814 = Ext.applyIf(_814, {layout:"border",items:[{xtype:"jx.grid.LookupTypeGrid",autoScroll:true,region:"center",filter:_814.orgId,scope:2,listeners:{render:this.onGridRender.createDelegate(this),configItem:this.onConfig.createDelegate(this)},columnWidth:1},{region:"east",width:400,split:true,hidden:"true",layout:"fit"}]});
    jx.panel.LookupTypePanel.superclass.constructor.call(this, _814);
};
Ext.extend(jx.panel.LookupTypePanel, Ext.Panel, {initComponent:function() {
    jx.panel.LookupTypePanel.superclass.initComponent.call(this);
},afterRender:function() {
    jx.panel.LookupTypePanel.superclass.afterRender.call(this);
},onConfig:function(item) {
    if (!this.eastGrid) {
        this.eastGrid = new jx.grid.LookupGrid({autoScroll:true});
        this.items.itemAt(1).add(this.eastGrid);
        this.items.itemAt(1).show();
        this.doLayout();
    }
    var w = this.eastGrid;
    w.setListTitle(item.data.name + " Items");
    w.filter = item.id;
    w.loadList();
    w.show();
},onGridRender:function(grid) {
    grid.loadList();
}});
Ext.reg("jx.panel.LookupTypePanel", jx.panel.LookupTypePanel);
jx.panel.OrgDetailPanel = function(_818) {
    _818 = Ext.applyIf(_818, {autoScroll:true,bodyStyle:"padding:5px 5px 0",items:[{xtype:"jx.form.OrganizationForm",org:this.getAppContext().getOrganization(),showButtons:true,listeners:{afterSave:this.onAfterSave,scope:this}}]});
    jx.panel.OrgDetailPanel.superclass.constructor.call(this, _818);
};
Ext.extend(jx.panel.OrgDetailPanel, Ext.Panel, {onAfterSave:function(form, item) {
    var ctx = this.getAppContext();
    ctx.getOrganization().name = item.name;
    this.getAppContext().fireEvent("refreshProjectList");
}});
Ext.reg("jx.panel.OrgDetailPanel", jx.panel.OrgDetailPanel);
jx.panel.OrgLicensePanel = function(_81c) {
    _81c = Ext.applyIf(_81c, {labelWidth:75,bodyStyle:"padding:5px 5px 0",width:350,defaults:{width:230},items:[{xtype:"jx.form.LicenseForm"}]});
    jx.panel.OrgLicensePanel.superclass.constructor.call(this, _81c);
};
Ext.extend(jx.panel.OrgLicensePanel, Ext.Panel, {initComponent:function() {
    Ext.apply(this, {});
    jx.panel.OrgLicensePanel.superclass.initComponent.call(this);
}});
Ext.reg("jx.panel.OrgLicensePanel", jx.panel.OrgLicensePanel);
jx.panel.OrgPermissionPanel = function(_81d) {
    _81d = Ext.applyIf(_81d, {layout:"fit",items:[{xtype:"jx.grid.PermissionGrid",listeners:{render:this.onGridRender.createDelegate(this)},loadProject:true}]});
    jx.panel.OrgPermissionPanel.superclass.constructor.call(this, _81d);
};
Ext.extend(jx.panel.OrgPermissionPanel, Ext.Panel, {initComponent:function() {
    jx.panel.OrgPermissionPanel.superclass.initComponent.call(this);
},afterRender:function() {
    jx.panel.OrgPermissionPanel.superclass.afterRender.call(this);
},onGridRender:function(grid) {
    grid.loadProjectList();
    grid.loadRoleOptions();
}});
Ext.reg("jx.panel.OrgPermissionPanel", jx.panel.OrgPermissionPanel);
jx.panel.OrgUserListPanel = function(_81f) {
    _81f = Ext.applyIf(_81f, {layout:"card",activeItem:0,items:[{xtype:"jx.grid.UserGrid",listeners:{title:"User List",addLdapUser:this.addLdapUser,scope:this},useLdap:this.getAppContext().getUseLdap(),loadOrg:false,orgId:_81f.orgId},{title:"LDAP User Lookup",xtype:"jx.grid.LdapUserGrid",listeners:{backToUserList:this.showUserList,afterSave:this.afterSaveUser,scope:this,orgId:_81f.orgId}}]});
    jx.panel.OrgUserListPanel.superclass.constructor.call(this, _81f);
};
Ext.extend(jx.panel.OrgUserListPanel, Ext.Panel, {initComponent:function() {
    jx.panel.OrgUserListPanel.superclass.initComponent.call(this);
},addLdapUser:function(_820) {
    this.layout.setActiveItem(1);
    this.items.itemAt(1).setOrgId(_820);
},showUserList:function() {
    this.layout.setActiveItem(0);
},afterSaveUser:function() {
    this.items.itemAt(0).loadList();
},afterRender:function() {
    jx.panel.AdminUserListPanel.superclass.afterRender.call(this);
}});
Ext.reg("jx.panel.OrgUserListPanel", jx.panel.OrgUserListPanel);
jx.panel.UserGroupListPanel = function(_821) {
    _821 = Ext.applyIf(_821, {layout:"fit",items:[{xtype:"jx.grid.UserGroupGrid",listeners:{render:this.onGridRender.createDelegate(this)},filter:_821.orgId}]});
    jx.panel.UserGroupListPanel.superclass.constructor.call(this, _821);
};
Ext.extend(jx.panel.UserGroupListPanel, Ext.Panel, {initComponent:function() {
    Ext.apply(this, {});
    jx.panel.UserGroupListPanel.superclass.initComponent.call(this);
},afterRender:function() {
    jx.panel.UserGroupListPanel.superclass.afterRender.call(this);
},onGridRender:function(grid) {
    grid.loadList();
}});
Ext.reg("jx.panel.UserGroupListPanel", jx.panel.UserGroupListPanel);
jx.panel.ItemTypePanel = function(_823) {
    _823 = Ext.applyIf(_823, {layout:"border",items:[{xtype:"jx.grid.ItemTypeGrid",region:"center",autoScroll:true,filter:_823.orgId,listeners:{render:this.onGridRender.createDelegate(this),configItem:this.onConfig.createDelegate(this)},columnWidth:1},{region:"east",width:600,split:true,hidden:"true",layout:"fit"}]});
    jx.panel.ItemTypePanel.superclass.constructor.call(this, _823);
};
Ext.extend(jx.panel.ItemTypePanel, Ext.Panel, {orgId:null,initComponent:function() {
    jx.panel.ItemTypePanel.superclass.initComponent.call(this);
},afterRender:function() {
    jx.panel.ItemTypePanel.superclass.afterRender.call(this);
},onConfig:function(item) {
    if (!this.eastGrid) {
        this.eastGrid = new jx.grid.ItemTypeFieldGrid({autoScroll:true,orgId:this.orgId});
        this.items.itemAt(1).add(this.eastGrid);
        this.items.itemAt(1).show();
        this.doLayout();
    }
    var w = this.eastGrid;
    w.setListTitle(item.data.name + " Items");
    w.filter = item.id;
    w.loadList();
},onGridRender:function(grid) {
    grid.loadList();
}});
Ext.reg("jx.panel.ItemTypePanel", jx.panel.ItemTypePanel);
jx.window.MyProfileWindow = function(_827) {
    _827 = Ext.applyIf(_827, {title:i18n.g("j.l.myProfileTitle"),width:800,height:600,modal:true,closable:true,closeAction:"destroy",cancelAction:"destroy",maximizable:true,minimizable:false,buttons:[{text:i18n.g("j.b.myProfileClose"),handler:this.onCancel,scope:this}],layout:"fit",items:{xtype:"jx.panel.MyProfilePanel"}});
    jx.window.MyProfileWindow.superclass.constructor.call(this, _827);
};
Ext.extend(jx.window.MyProfileWindow, Ext.Window, {});
jx.panel.MyProfilePanel = function(_828) {
    jx.panel.MyProfilePanel.superclass.constructor.call(this, _828);
};
Ext.extend(jx.panel.MyProfilePanel, Ext.TabPanel, {initComponent:function() {
    Ext.apply(this, {defaults:{bodyStyle:"padding:10px"},activeTab:0,minTabWidth:115,tabWidth:135,enableTabScroll:true,items:[{xtype:"jx.panel.ProfileDetailPanel",title:i18n.g("j.l.profileDetails"),id:this.getId() + "-detail"},{xtype:"jx.panel.NotificationPanel",title:i18n.g("j.l.profileNotification"),id:this.getId() + "-notify"}]});
    jx.panel.MyProfilePanel.superclass.initComponent.call(this);
}});
Ext.reg("jx.panel.MyProfilePanel", jx.panel.MyProfilePanel);
jx.panel.NotificationPanel = function(_829) {
    jx.panel.NotificationPanel.superclass.constructor.call(this, _829);
};
Ext.extend(jx.panel.NotificationPanel, Ext.Panel, {initComponent:function() {
    Ext.apply(this, {defaults:{bodyStyle:"padding:10px"},layout:"border",items:[{xtype:"jx.form.NotificationScheduleForm",region:"north",height:100},{xtype:"jx.grid.SubscriptionNotificationGrid",region:"center",autoScroll:true,listeners:{render:this.onGridRender.createDelegate(this)}}]});
    jx.panel.NotificationPanel.superclass.initComponent.call(this);
},afterRender:function() {
    jx.panel.NotificationPanel.superclass.afterRender.call(this);
},onGridRender:function(grid) {
    grid.loadList();
}});
Ext.reg("jx.panel.NotificationPanel", jx.panel.NotificationPanel);
jx.panel.ProfileDetailPanel = function(_82b) {
    jx.panel.ProfileDetailPanel.superclass.constructor.call(this, _82b);
};
Ext.extend(jx.panel.ProfileDetailPanel, Ext.Panel, {userForm:null,passwordForm:null,initComponent:function() {
    Ext.apply(this, {tbar:this.getTbar(),layout:"card",activeItem:0,items:[{autoScroll:true,xtype:"panel",items:this.createUserForm()},this.createPasswordForm()]});
    jx.panel.ProfileDetailPanel.superclass.initComponent.call(this);
},createUserForm:function() {
    this.userForm = new jx.form.UserForm({orgId:0,showButtons:false,formType:"both",showTitle:false,mode:"myProfile"});
    this.userForm.on("afterSave", this.resetForm.createDelegate(this));
    return this.userForm;
},createPasswordForm:function() {
    this.passwordForm = new jx.form.ChangePasswordForm({});
    this.passwordForm.on("afterSave", this.resetForm.createDelegate(this));
    return this.passwordForm;
},getTbar:function() {
    return ["->",{text:i18n.g("j.b.resetPassword"),iconCls:"j-profile-password-change-icon",handler:this.showChangePasswordTab,scope:this},"-",{text:i18n.g("j.b.editProfile"),iconCls:"j-profile-edit-icon",handler:this.editProfile,scope:this},"-",{text:i18n.g("j.b.editProfileSave"),iconCls:"j-save-icon",handler:this.saveProfile,scope:this},"-",{text:i18n.g("j.b.editPasswordSave"),iconCls:"j-save-icon",handler:this.savePassword,scope:this},"-",{text:i18n.g("j.b.editProfileCancel"),iconCls:"j-cancel-icon",handler:this.resetForm,scope:this}];
},resetForm:function() {
    this.getLayout().setActiveItem(0);
    this.userForm.onCancel();
    this.showButtons([0,1,2,3]);
},saveProfile:function() {
    this.userForm.onSave();
},savePassword:function() {
    this.passwordForm.updatePassword();
},showChangePasswordTab:function() {
    this.getLayout().setActiveItem(1);
    this.showButtons([0,7,8,9]);
},editProfile:function() {
    this.userForm.onEdit();
    this.showButtons([0,5,8,9]);
},showButtons:function(_82c) {
    var _82d = this.getTopToolbar().items;
    for (var i = 0; i < _82d.length; i++) {
        _82d.get(i).hide();
    }
    for (var i = 0; i < _82c.length; i++) {
        _82d.get(_82c[i]).show();
    }
},render:function() {
    jx.panel.ProfileDetailPanel.superclass.render.apply(this, arguments);
    this.showButtons([0,1,2,3]);
}});
Ext.reg("jx.panel.ProfileDetailPanel", jx.panel.ProfileDetailPanel);
jx.grid.SubscriptionNotificationGrid = function(_82f) {
    jx.grid.SubscriptionNotificationGrid.superclass.constructor.call(this, _82f);
};
Ext.extend(jx.grid.SubscriptionNotificationGrid, jx.grid.SimpleGridDetail, {initComponent:function() {
    Ext.apply(this, {addItemLabel:"",listTitle:"",deleteItemLabel:i18n.g("j.b.myProfileDeleteItems"),singleSelect:false,fieldDefinitions:this.getListDefinitions()});
    this.dataStore = jx.data.StoreFactory.buildSubscriptionNotificationStore();
    jx.grid.SubscriptionNotificationGrid.superclass.initComponent.call(this);
},getListDefinitions:function() {
    return ([{field:"projectName",label:i18n.g("j.l.myProfileProject"),width:"20%"},{field:"notificationName",label:i18n.g("j.l.myProfileNotifications"),width:"50%",renderer:function(_830, _831, _832) {
        switch (_832.data.scope) {
            case 3:
                return "<img src=\"img/silk/brick.png\"/>&nbsp; All items located in project: " + _830;
                break;
            case 4:
                return "<img src=\"img/tree/" + _832.data.notificationImage + "\"/>&nbsp; All items located in set: " + _830;
                break;
            case 5:
                return "<img src=\"img/silk/page_white_text.png\"/>&nbsp;" + _830 + " - (Item)";
                break;
            default:
                return _830;
                break;
        }
    }},{field:"action",columnOnly:true,dataType:"action",label:i18n.g("j.l.myProfileSelect"),sortable:false,actions:[{name:"checkbox",display:"<input type='checkbox'/>"}]}]);
},onRenderOther:function() {
    var tb = this.getTopToolbar();
    tb.addFill();
    tb.addButton({tooltip:this.deleteItemLabel,text:this.deleteItemLabel,iconCls:"j-profile-subscription-delete-icon",cls:"x-btn-text-icon",handler:this.deleteSelectedItems.createDelegate(this)});
},onLoadList:function() {
    this.loadData([]);
},onDeleteSelectedItems:function(ids, _835) {
    var _836 = new Array();
    for (var _837 = 0; _837 < ids.length; _837++) {
        _836.push(parseInt(ids[_837]));
    }
    subscriptionSvc.deleteMultipleSubscriptions(_836, _835);
},updateItemCallback:function() {
    this.loadList();
}});
Ext.reg("jx.grid.SubscriptionNotificationGrid", jx.grid.SubscriptionNotificationGrid);
jx.window.HelpWindow = function(_838) {
    _838 = Ext.applyIf(_838, {title:i18n.g("j.l.helpTitle"),height:600,width:800,modal:true,closable:true,closeAction:"hide",cancelAction:"hide",maximizable:true,minimizable:false,buttons:[{text:i18n.g("j.b.helpClose"),handler:this.onCancel,scope:this}],layout:"fit",items:{xtype:"jx.panel.HelpPanel"}});
    jx.window.HelpWindow.superclass.constructor.call(this, _838);
};
Ext.extend(jx.window.HelpWindow, Ext.Window, {});
jx.panel.HelpPanel = function(_839) {
    jx.panel.HelpPanel.superclass.constructor.call(this, _839);
};
Ext.extend(jx.panel.HelpPanel, Ext.TabPanel, {initComponent:function() {
    Ext.apply(this, {defaults:{bodyStyle:"padding:10px"},activeTab:0,minTabWidth:115,tabWidth:135,enableTabScroll:true,items:[{title:i18n.g("j.t.helpHome"),id:this.getId() + "-home",html:"<div class=\"j-login-welcome\">" + i18n.g("j.l.helpWelcomeText") + "</div><div>" + i18n.g("j.l.helpWelcomeTextDetail") + "<br><br>" + i18n.g("j.l.helpUserGuideLink") + "</div>"},{title:i18n.g("j.t.helpBackstage"),id:this.getId() + "-backstage",contentEl:this.createBackstageFrame()},{title:i18n.g("j.t.helpJamaSupportTicket"),id:this.getId() + "-ticket",contentEl:this.createTicketFrame()}]});
    jx.panel.HelpPanel.superclass.initComponent.call(this);
},createBackstageFrame:function() {
    var link = "http://www.jamabackstage.com/";
    return Ext.DomHelper.append(Ext.getBody(), {tag:"iframe",width:"100%",height:"100%",frameBorder:0,src:link});
},createTicketFrame:function() {
    var link = "http://www.jamasoftware.com/support_form.php";
    return Ext.DomHelper.append(Ext.getBody(), {tag:"iframe",width:"100%",height:"100%",frameBorder:0,src:link});
}});
Ext.reg("jx.panel.HelpPanel", jx.panel.HelpPanel);

jx.panel.OrganizationPanel = function(_1) {
    jx.panel.OrganizationPanel.superclass.constructor.call(this, _1);
};
Ext.extend(jx.panel.OrganizationPanel, Ext.Panel, {initComponent:function() {
    Ext.apply(this, {layout:"border",border:false,items:[{xtype:"jx.panel.ProjectWestPanel",region:"west",width:300,split:true,ctCls:"j-toolbar-dark",collapsible:true,id:"o-panel-west",margins:"0 0 0 0"},{xtype:"jx.panel.OrgCenterPanel",region:"center",id:"o-panel-center"},{xtype:"jx.panel.RelateTreePanel",region:"east",width:300,split:true,collapsed:true,id:"o-panel-east",hidden:true,margins:"0 0 0 0",listeners:{relateItemToItem:{fn:this.relateItemToItem,scope:this}}}]});
    this.getAppContext().on("showRelationshipTree", this.onShowRelationshipTree, this);
    jx.panel.OrganizationPanel.superclass.initComponent.call(this);
},onShowRelationshipTree:function(_2) {
    var _3 = this.findById("o-panel-east");
    _3.event = _2;
    _3.expand();
    this.doLayout();
    _3.show();
},relateItemToItem:function(_4, _5) {
    var _6 = this.findById("o-panel-center");
    var _7 = _6.findById("p-center-panel");
    var _8 = _7.getActiveTab();
    if (_8.getXType() == "jx.panel.ItemPanel") {
        _8.onRelateItemsToItem(_4, _5);
    } else {
        this.getAppContext().showMessage("Info", "Unable create a relationship because an Item is not active.");
    }
}});
Ext.reg("jx.panel.OrganizationPanel", jx.panel.OrganizationPanel);
jx.panel.ProjectHeaderPanel = function(_9) {
    jx.panel.ProjectHeaderPanel.superclass.constructor.call(this, _9);
};
Ext.extend(jx.panel.ProjectHeaderPanel, Ext.Panel, {data:null,initComponent:function() {
    this.data = new jx.ItemData({project:new jx.Project({id:0}),org:this.getAppContext().getOrganization()});
    Ext.apply(this, {autoScroll:true,id:"o-header-panel",layout:"column",layoutConfig:{columns:2},defaults:{bodyStyle:"padding: 0px; border: 0px"},items:[{id:"logoContainer",html:String.format("<img src=\"{0}\" style=\"\" id=\"o-logo\"/>", i18n.g("jama.headerLogo", "img/jama_contour_reflection.jpg"))},{xtype:"jx.panel.LogoutPanel",data:this.data,border:false,height:20,width:100}]});
    this.getAppContext().on("projectChanged", this.updateData, this);
    jx.panel.ProjectHeaderPanel.superclass.initComponent.call(this);
},afterUpdate:function() {
},updateData:function(e) {
    this.data.reconfig({project:e.data.project});
},search:function(_b, _c) {
    if (_c.getKey() == Ext.EventObject.RETURN) {
        var _d = _b.getValue();
        if (_d) {
            this.getAppContext().fireEvent("search", _d);
        }
    }
},showHelp:function() {
    var _e = new jx.window.HelpWindow({});
    _e.show();
}});
Ext.reg("jx.panel.ProjectHeaderPanel", jx.panel.ProjectHeaderPanel);
jx.panel.ProjectPanel = function(_f) {
    jx.panel.ProjectPanel.superclass.constructor.call(this, _f);
};
Ext.extend(jx.panel.ProjectPanel, Ext.Panel, {data:null,tabPanel:null,tabFolderPanel:null,iconCls:"j-project-icon",refresh:function() {
    this.toggleButtons();
    this.notifyButton.setChecked(this.data.project.notification, true);
    var _10 = this.findById(this.cardPanelId);
    if (this.data.project.isFolder) {
        _10.getLayout().setActiveItem(1);
        this.tabFolderPanel.getActiveTab().refresh(true);
    } else {
        _10.getLayout().setActiveItem(0);
        this.tabPanel.getActiveTab().refresh(true);
    }
    if (this.rendered) {
        this.toggleButtons();
    }
},render:function() {
    jx.panel.ProjectPanel.superclass.render.apply(this, arguments);
    this.toggleButtons();
},toggleButtons:function() {
    var _11 = this.data.project.getMask();
    this.getTopToolbar().showButtons(_11);
    var _12 = Ext.menu.MenuMgr.get(this.actionMenuId);
    _12.showButtons(_11);
},myId:function(id) {
    return this.id + "-" + id;
},refreshTab:function(tab) {
    tab.refresh(true);
},initComponent:function() {
    this.cardPanelId = this.myId("property-card");
    this.propertySouthId = this.myId("property-south");
    this.propertyEastId = this.myId("property-east");
    Ext.apply(this, {tbar:this.getTbar(),autoScroll:false,bodyStyle:{padding:"5px"},layout:"border",items:[{xtype:"jx.panel.ProjectFormPanel",data:this.data,collapsed:false,region:"center",autoScroll:true},{region:"south",split:true,height:250,layout:"fit",border:false,margins:"0 0 0 0",id:this.propertySouthId,items:{xtype:"panel",layout:"card",id:this.cardPanelId,activeItem:this.data.project.isFolder ? 1 : 0,items:[this.getTabPanel(),this.getFolderTabPanel()]}},{region:"east",id:this.propertyEastId,split:true,collapsible:true,width:300,layout:"fit",margins:"0 0 0 0",hidden:true}]});
    this.data.on("dataChanged", this.refresh, this);
    this.getAppContext().on("afterSaveProject", this.reconfigData, this);
    jx.panel.ProjectPanel.superclass.initComponent.call(this);
},reconfigData:function(_15) {
    _15.mask = this.data.project.mask;
    _15.propertyList = this.data.project.propertyList;
    this.data.reconfig({project:Ext.apply(this.data.project, _15)});
    this.setTitle(_15.name);
},getTbar:function() {
    this.propertyButtonId = this.myId("property-button");
    this.propertyMenuId = this.myId("property-menu");
    this.bottomMenuItemId = this.myId("bottom");
    this.rightMenuItemId = this.myId("right");
    this.hideMenuItemId = this.myId("hide");
    this.actionMenuId = this.myId("action-menu");
    var _16 = this.myId("pp-group");
    var _17 = jx.AclPermission.WRITEADMIN;
    this.notifyButton = new Ext.menu.CheckItem({text:i18n.g("j.b.projectSubscribe"),boxLabel:i18n.g("j.b.projectSubscribe"),checked:this.data.project.notification,listeners:{checkchange:{fn:this.subscribeToProject,scope:this}},id:"project-" + this.data.project.id + "-notification-button"});
    return ["->",{split:false,text:i18n.g("j.b.projectViewsMenu"),menu:{id:this.propertyMenuId,cls:"reading-menu",width:150,items:[{text:i18n.g("j.b.showMatrix"),iconCls:"j-project-matrix-icon",handler:this.showWindow.createDelegate(this, ["jx.window.TraceMatrixWindow",true], 0),id:"p-matrix-button",scope:this},{text:i18n.g("j.b.showSuspect"),iconCls:"j-project-suspect-icon",handler:this.showWindow.createDelegate(this, ["jx.window.SuspectWindow",true], 0),id:"p-suspect-button",scope:this},"-",{split:true,text:i18n.g("j.b.projectView"),tooltip:i18n.g("j.tt.projectView"),iconCls:"j-item-details-display-bottom",handler:this.moveProperty.createDelegate(this, []),id:this.propertyButtonId,menu:{cls:"reading-menu",width:100,items:[{id:this.bottomMenuItemId,text:i18n.g("j.l.projectViewBottom"),checked:true,group:_16,checkHandler:this.moveProperty,scope:this,iconCls:"preview-bottom"},{text:i18n.g("j.l.projectViewRight"),id:this.rightMenuItemId,checked:false,group:_16,checkHandler:this.moveProperty,scope:this,iconCls:"preview-right"},{text:i18n.g("j.l.projectViewHidden"),id:this.hideMenuItemId,checked:false,group:_16,checkHandler:this.moveProperty,scope:this,iconCls:"preview-hide"}]}}]}},{text:i18n.g("j.l.extraActions"),menu:new Ext.menu.Menu({id:this.actionMenuId,items:[this.notifyButton,"-",{text:i18n.g("j.b.projectFindMe"),iconCls:"j-find-me-icon",handler:this.onFindMe,id:"p-findme-button",scope:this},new Ext.menu.Separator({mask:_17}),{text:i18n.g("j.b.setImport"),iconCls:"j-project-import-icon",mask:_17,menu:new Ext.menu.Menu({items:[{text:i18n.g("j.b.setImportCSV"),tooltip:i18n.g("j.tt.setImportCSV"),iconCls:"j-project-import-csv-icon",handler:this.showWindow.createDelegate(this, ["jx.window.CsvImportWindow",true], 0),id:"p-cvsimport-button",scope:this},{text:i18n.g("j.b.setImportWord"),tooltip:i18n.g("j.tt.setImportWord"),iconCls:"j-project-import-word-icon",handler:this.showWindow.createDelegate(this, ["jx.window.WordImportWindow",true], 0),id:"p-wordimport-button",scope:this}]})}]})},{split:false,text:"Edit ",mask:_17,menu:{width:110,items:[{text:i18n.g("j.b.projectEdit"),iconCls:"j-project-edit-icon",handler:this.showWindow.createDelegate(this, ["jx.window.ProjectFormWindow",true], 0),id:"p-edit-button",scope:this,mask:_17},new Ext.menu.Separator({mask:jx.AclPermission.ADMINISTRATION}),{text:i18n.g("j.b.copyProject"),iconCls:"j-project-copy-icon",handler:this.onCopyProject,id:"p-copy-button",scope:this,mask:_17},{text:i18n.g("j.b.deleteProject"),iconCls:"j-project-delete-icon",handler:this.onDeleteProject,id:"p-delete-button",scope:this,mask:_17},"-",{text:i18n.g("j.b.projectSetup"),iconCls:"j-project-configure-icon",handler:this.showWindow.createDelegate(this, ["jx.window.ProjectAdminWindow",true], 0),id:"p-configure-button",scope:this,mask:jx.AclPermission.ADMINISTRATION}]}}];
},moveProperty:function(m, _19) {
    if (!m) {
        var _1a = Ext.menu.MenuMgr.get(this.propertyMenuId);
        _1a.render();
        var _1b = _1a.items.items;
        var b = _1b[0],r = _1b[1],h = _1b[2];
        if (b.checked) {
            r.setChecked(true);
        } else {
            if (r.checked) {
                h.setChecked(true);
            } else {
                if (h.checked) {
                    b.setChecked(true);
                }
            }
        }
        return;
    }
    if (_19) {
        var _1d = this.findById(this.cardPanelId);
        var _1e = Ext.getCmp(this.propertyEastId);
        var bot = Ext.getCmp(this.propertySouthId);
        var btn = Ext.getCmp(this.propertyButtonId);
        switch (m.id) {
            case this.bottomMenuItemId:
                _1e.hide();
                bot.add(_1d);
                bot.show();
                bot.ownerCt.doLayout();
                btn.setIconClass("j-item-details-display-bottom");
                this.tabPanel.getActiveTab().refresh(true);
                break;
            case this.rightMenuItemId:
                bot.hide();
                _1e.add(_1d);
                _1e.show();
                _1e.ownerCt.doLayout();
                btn.setIconClass("j-item-details-display-right");
                this.tabPanel.getActiveTab().refresh(true);
                break;
            case this.hideMenuItemId:
                _1d.ownerCt.hide();
                _1d.ownerCt.ownerCt.doLayout();
                btn.setIconClass("j-item-details-display-none");
                break;
        }
    }
},getTabPanel:function() {
    this.tabPanel = new Ext.TabPanel({activeItem:0,defaults:{data:this.data,autoScroll:true,bodyStyle:"padding:10px;",listeners:{activate:{fn:this.refreshTab,scope:this}}},items:[{xtype:"jx.panel.WhatsNewPanel",id:this.getId() + "-whatsnew-view"},{title:"Attachments",xtype:"jx.grid.ProjectAttachmentGrid"}]});
    return this.tabPanel;
},onDeleteProject:function() {
    var e = {data:this.data,source:this,sourceType:"tab"};
    this.getAppContext().fireEvent("deleteProject", e);
},showWindow:function(_22, _23, _24) {
    var e = {data:{project:this.data.project,org:this.getAppContext().getOrganization()},source:this,sourceEl:_24.getEl(),xtype:_22,newWindow:_23};
    this.getAppContext().fireEvent("showWindow", e);
},onCopyProject:function() {
    var w = new jx.window.ProjectCopyWindow({project:this.data.project});
    w.show();
},onFindMe:function() {
    var e = {data:this.data,source:this};
    this.getAppContext().fireEvent("findMe", e);
},subscribeToProject:function(_28, _29) {
    var sub = {scope:3,refId:this.data.project.id};
    if (_29) {
        subscriptionSvc.saveSubscription(sub, this.subCallback.createDelegate(this, ["on"]));
    } else {
        subscriptionSvc.deleteSubscription(sub, this.subCallback.createDelegate(this, ["off"]));
    }
},subCallback:function(_2b) {
    this.getAppContext().showMessage("Success", "Email notification has been turned " + _2b + ".", this);
},iconDisplayForNotification:function(_2c) {
},getFolderTabPanel:function() {
    this.tabFolderPanel = new Ext.TabPanel({activeItem:0,defaults:{data:this.data,autoScroll:true,bodyStyle:"padding:10px;",listeners:{}},items:[{title:"Sub Projects",bodyStyle:"padding:0px;",xtype:"jx.panel.ProjectGridPanel"}]});
    return this.tabFolderPanel;
}});
Ext.reg("jx.panel.ProjectPanel", jx.panel.ProjectPanel);
jx.panel.ProjectGridPanel = function(_2d) {
    _2d = Ext.applyIf(_2d, {});
    jx.panel.ProjectGridPanel.superclass.constructor.call(this, _2d);
};
Ext.extend(jx.panel.ProjectGridPanel, jx.grid.ProjectGrid, {data:null,initComponent:function() {
    Ext.apply(this, {tbar:["->",{text:i18n.g("j.b.openProject"),tooltip:i18n.g("j.tt.openProject"),iconCls:"j-project-open-icon",handler:this.onOpenButtonClick,scope:this}]});
    this.on({rowdblclick:this.onRowDblClick,rowclick:this.selectRow,rowcontextmenu:this.onRowContextMenu,scope:this});
    jx.panel.ProjectGridPanel.superclass.initComponent.call(this);
},refresh:function(_2e) {
    var _2f = {data:[0]};
    if (this.data.project && this.data.getProjectId() != null && this.data.getProjectId() != 0) {
        _2f = {data:[this.data.getProjectId()]};
    }
    this.loadProjectGrid(_2f);
},onRowContextMenu:function(_30, _31, e) {
    if (!this.actionMenu) {
        var _33 = jx.AclPermission.WRITEADMIN;
        this.actionMenu = new Ext.menu.Menu({items:[{text:i18n.g("j.b.openProject"),iconCls:"j-project-open-icon",handler:function() {
            this.rightClickShowProject(this.ctxRecord);
        },scope:this},{text:i18n.g("j.b.projectEdit"),iconCls:"j-project-edit-icon",handler:function() {
            this.rightClickEditProject(this.ctxRecord);
        },scope:this,mask:_33},{text:i18n.g("j.b.deleteProject"),iconCls:"j-project-delete-icon",handler:function() {
            this.rightClickDeleteProject(this.ctxRecord);
        },scope:this,mask:_33}]});
        this.actionMenu.on("hide", this.onContextHide, this);
    }
    e.stopEvent();
    if (this.ctxRow) {
        Ext.fly(this.ctxRow).removeClass("x-node-ctx");
        this.ctxRow = null;
    }
    this.ctxRow = this.view.getRow(_31);
    this.ctxRecord = this.store.getAt(_31);
    Ext.fly(this.ctxRow).addClass("x-node-ctx");
    this.actionMenu.showAt(e.getXY());
},onContextHide:function() {
    if (this.ctxRow) {
        Ext.fly(this.ctxRow).removeClass("x-node-ctx");
        this.ctxRow = null;
    }
},onOpenButtonClick:function() {
    var _34 = this.getSelectionModel().getSelected();
    this.showProject(_34);
},onRowDblClick:function() {
    var _35 = this.getSelectionModel().getSelected();
    this.showProject(_35);
},rightClickShowProject:function(_36) {
    this.showProject(_36);
},rightClickEditProject:function(_37) {
    var ctx = this.getAppContext();
    var _39 = ctx.getProject(_37.id, true);
    var e = {data:{project:_39},source:this,sourceEl:this,sourceType:"grid",xtype:"jx.window.ProjectFormWindow"};
    ctx.fireEvent("showWindow", e);
},rightClickDeleteProject:function(_3b) {
    var e = {data:{project:{id:_3b.id,name:_3b.data.name}},source:this,sourceType:"grid"};
    this.getAppContext().fireEvent("deleteProject", e);
},showProject:function(_3d) {
    if (_3d) {
        this.getAppContext().fireEvent("loadProject", {sourceType:"grid",source:this,data:{project:{id:_3d.id,name:_3d.data.name},item:{}},newTab:false});
    } else {
        Ext.MessageBox.alert("Warning", "No item is selected.");
    }
},selectRow:function(_3e, _3f, e) {
},render:function(_41) {
    jx.panel.ProjectGridPanel.superclass.render.call(this, _41);
    this.refresh();
}});
Ext.reg("jx.panel.ProjectGridPanel", jx.panel.ProjectGridPanel);
jx.panel.ProjectWestPanel = function(_42) {
    jx.panel.ProjectWestPanel.superclass.constructor.call(this, _42);
};
Ext.extend(jx.panel.ProjectWestPanel, Ext.Panel, {project:null,initComponent:function() {
    Ext.apply(this, {bodyStyle:"padding:5px",layout:"border",title:this.getAppContext().organization.name,items:[{region:"north",xtype:"jx.panel.ProjectTreePanel",listeners:{showItemTree:{fn:this.onShowItemTree,scope:this},findItem:{fn:this.findItem,scope:this}},collapsed:false,collapsible:true,ctCls:"j-toolbar-dark",split:true,height:150},{region:"center",xtype:"jx.panel.ItemTreePanel"}]});
    jx.panel.ProjectWestPanel.superclass.initComponent.call(this);
},findItem:function(_43) {
    var _44 = this.items.itemAt(1);
    _44.findMe(_43);
},onShowItemTree:function(_45) {
    var _46 = this.items.itemAt(1);
    _46.loadProjectWithCallback(_45);
    this.setTitle(i18n.g("j.l.currentProject"));
}});
Ext.reg("jx.panel.ProjectWestPanel", jx.panel.ProjectWestPanel);
jx.panel.ProjectFormPanel = function(_47) {
    jx.panel.ProjectFormPanel.superclass.constructor.call(this, _47);
};
Ext.extend(jx.panel.ProjectFormPanel, Ext.Panel, {projectForm:null,project:null,data:null,titleDiv:null,initComponent:function() {
    Ext.apply(this, {});
    jx.panel.ProjectFormPanel.superclass.initComponent.call(this);
    this.on("afterSaveProject", this.refresh, this);
},refresh:function() {
    if (!this.projectForm) {
        this.projectForm = this.createWidget();
    }
    this.projectForm.loadProject(this.data.project);
},afterLoadProject:function(_48) {
    var _49 = (_48.isFolder) ? i18n.g("j.l.projectFolder") : i18n.g("j.l.projectLabel");
    this.titleDiv.update("");
    this.getTpl().append(this.titleDiv, {leftText:_49,rightText:_48.name});
},createWidget:function() {
    var _4a = this.getAppContext().getDayMonthYearFormat();
    var w = new jx.form.ProjectForm({showButtons:false,showTitle:false,defaultDateFormat:_4a,listeners:{afterLoadProject:this.afterLoadProject,scope:this}});
    this.titleDiv = Ext.DomHelper.append(this.body, {tag:"div",html:""}, true);
    w.render(this.body);
    return w;
},render:function() {
    jx.panel.ProjectFormPanel.superclass.render.apply(this, arguments);
    this.data.on({"dataChanged":this.refresh,scope:this});
    if (this.data.project) {
        this.refresh();
    }
},getTpl:function() {
    if (this.tpl) {
        return this.tpl;
    }
    var w = jx.panel.ProjectFormPanel;
    if (!w.tplCache) {
        w.tplCache = new Ext.XTemplate("<table><tbody>", "<tr>", "<td nowrap align=\"right\" width=\"10%\"><div class=\"j-set-header-title-left\">{leftText}</div></td><td><div class=\"j-set-header-title-right\">{rightText}</div></td>", "</tr>", "</tbody></table>");
    }
    return w.tplCache;
}});
Ext.reg("jx.panel.ProjectFormPanel", jx.panel.ProjectFormPanel);
jx.panel.RelateTreePanel = function(_4d) {
    jx.panel.RelateTreePanel.superclass.constructor.call(this, _4d);
};
Ext.extend(jx.panel.RelateTreePanel, Ext.Panel, {project:null,projectTree:null,itemTree:null,searchGrid:null,event:null,dialog:null,defaultDialog:null,relateDefaults:{direction:"forward",type:null},relateTypeDataStore:null,initComponent:function() {
    this.relateButtonId = this.myId("relateButton");
    Ext.apply(this, {tbar:this.getTbar(),layout:"border",title:i18n.g("j-l-relateTitle"),items:[{region:"north",layout:"fit",id:"p-relate-project-tree-panel",split:true,height:150,autoScroll:true},{region:"center",xtype:"tabpanel",id:"p-relate-item-tab-panel",active:0,items:[{title:i18n.g("j.l.relateTreeTab"),layout:"fit",id:"p-relate-item-tree-panel"},{title:i18n.g("j.l.relateGridTab"),layout:"fit",id:"p-relate-item-grid-panel"}]}]});
    this.on("show", this.addProjectTree, this);
    this.relateTypeDataStore = jx.data.StoreFactory.buildLookupByTypeCategoryStore();
    this.relateTypeDataStore.load({arg:[1024,2,this.getAppContext().organization.id]});
    jx.panel.RelateTreePanel.superclass.initComponent.call(this);
},myId:function(id) {
    return this.id + "-" + id;
},render:function() {
    this.relateTypeDataStore.on("load", this.setInitDefaults, this);
    jx.panel.RelateTreePanel.superclass.render.apply(this, arguments);
},setInitDefaults:function() {
    this.changeRelateDefaults({direction:"forward",type:this.relateTypeDataStore.data.items[0].data.id});
},getTbar:function() {
    return [{text:i18n.g("j.b.relateDefaults"),iconCls:"j-relate-close-icon ",handler:this.showDefaultsDialog,scope:this},"->",{text:i18n.g("j-b-relateClose"),iconCls:"j-relate-close-icon ",handler:this.closePanel,scope:this}];
},getItemTreeTbar:function() {
    return [{id:this.relateButtonId,text:i18n.g("j-b-relateCreateRelationship"),tooltip:i18n.g("j-tt-relateCreateRelationship"),iconCls:"j-item-relate-create-icon",handler:this.onTreeRelateClick,disabled:true,scope:this},{text:i18n.g("j-b-relatePreview"),tooltip:i18n.g("j-tt-relatePreview"),iconCls:"j-relate-preview-icon",handler:this.onTreePreviewClick,scope:this}];
},getItemSearchTbar:function() {
    return [{text:i18n.g("j-b-relateCreateRelationship"),tooltip:i18n.g("j-tt-relateCreateRelationship"),iconCls:"j-item-relate-create-icon",handler:this.onGridRelateClick,scope:this},{id:"p-relate-search-field",xtype:"textfield",name:"searchString",anchor:"100%",emptyText:i18n.g("j.b.search"),listeners:{specialKey:this.onSpecialKey,scope:this}},{text:i18n.g("j-b-relatePreview"),tooltip:i18n.g("j-tt-relatePreview"),iconCls:"j-relate-preview-icon",handler:this.onGridPreviewClick,scope:this}];
},onSpecialKey:function(_4f, _50) {
    if (_50.getKey() == Ext.EventObject.RETURN) {
        var _51 = _4f.getValue();
        this.searchGrid.loadSearchGrid(this.project.id, _51);
    }
},closePanel:function() {
    this.hide();
    this.collapse();
    this.doLayout();
},setDefaults:function() {
},addProjectTree:function(e) {
    if (!this.projectTree) {
        var _53 = this.findById("p-relate-project-tree-panel");
        var _54 = this.event.project;
        this.projectTree = _53.add(new jx.tree.ProjectTree({enableDD:false,autoScroll:true,listeners:{"click":{fn:this.onProjectTreeClick,scope:this}}}));
        this.doLayout();
    }
    var _55 = this.event.project ? this.event.project : e.event.data.project;
    project.getPath(_55.id, this.reloadPath.createDelegate(this));
    this.onSuccessLoadProject(_55);
},reloadPath:function(_56) {
    if (!_56) {
        return;
    }
    var pos = _56.lastIndexOf("/");
    if (pos > 0) {
        this.projectTree.selectPath(_56);
    }
},onProjectTreeClick:function(_58, e) {
    var _5a = _58.id;
    var id = parseInt(_5a.substring(2));
    switch (_5a.charAt(0)) {
        case "p":
            if ((this.project == null) || (id != this.project.id)) {
                project.getProjectDto(id, {callback:this.onSuccessLoadProject.createDelegate(this)});
            }
            break;
        case "o":
            this.project = null;
            break;
        case "g":
            break;
        default:
            break;
    }
},onSuccessLoadProject:function(_5c) {
    this.project = new jx.Project(_5c);
    var _5d = this.findById("p-relate-item-tab-panel");
    var _5e = _5d.findById("p-relate-item-tree-panel");
    var _5f = _5d.findById("p-relate-item-grid-panel");
    _5d.setActiveTab(_5e);
    if (this.itemTree == null) {
        this.itemTree = _5e.add(new jx.tree.ItemTree({enableDD:false,enableDrag:true,folderOnly:false,autoScroll:true,selModel:new Ext.tree.MultiSelectionModel({}),listeners:{"dblclick":{fn:this.onTreeRelateClick,scope:this},"click":{fn:this.onTreeSingleClick,scope:this}},tbar:this.getItemTreeTbar()}));
        _5d.doLayout();
    }
    if (this.searchGrid == null) {
        this.searchGrid = _5f.add(new jx.grid.ItemGrid({tbar:this.getItemSearchTbar(),pagingDisplayMsg:"",displayInfo:false,listeners:{rowdblclick:{fn:this.onGridRelateClick,scope:this}}}));
        _5d.doLayout();
    }
    this.itemTree.loadProject(_5c);
    this.setTitle("<span style=\"color: #3F3F3F; font-size: 10pt; font-style: bold;\">" + _5c.name + "</span>");
},onGridRelateClick:function() {
    var _60 = this.getSelectedItemsFromGrid();
    this.fireEvent("relateItemToItem", _60, this.relateDefaults);
},onGridPreviewClick:function(_61) {
    var _62 = this.getSelectedItemsFromGrid();
    if (_62.length != 1) {
        this.getAppContext().showMessage("Info", i18n.g("j.m.relatePreviewOnlyOneAllowed"));
    } else {
        var e = {data:{project:this.project,item:{id:_62[0]}},source:this,sourceEl:_61.getEl(),xtype:"jx.window.ItemPreviewWindow",newWindow:false};
        this.getAppContext().fireEvent("showWindow", e);
    }
},getSelectedItemsFromGrid:function() {
    var _64 = this.searchGrid.getSelectionModel().getSelections();
    var _65 = [];
    for (var i = 0; i < _64.length; i++) {
        _65.push(_64[i].id);
    }
    return _65;
},onTreeRelateClick:function() {
    var _67 = this.getSelectedItemsFromTree();
    this.fireEvent("relateItemToItem", _67, this.relateDefaults);
},onTreeSingleClick:function(e) {
    var _69 = Ext.getCmp(this.relateButtonId);
    _69[e.leaf ? "enable" : "disable"]();
},onTreePreviewClick:function(_6a) {
    var _6b = this.getSelectedItemsFromTree();
    if (_6b.length != 1) {
        this.getAppContext().showMessage("Info", i18n.g("j.m.relatePreviewOnlyOneAllowed"));
    } else {
        var e = {data:{project:this.project,item:{id:_6b[0]}},source:this,sourceEl:_6a.getEl(),xtype:"jx.window.ItemPreviewWindow",newWindow:false};
        this.getAppContext().fireEvent("showWindow", e);
    }
},getSelectedItemsFromTree:function() {
    var _6d = this.itemTree.getSelectionModel().getSelectedNodes();
    var _6e = [];
    for (var _6f = 0; _6f < _6d.length; _6f++) {
        var _70 = _6d[_6f];
        if (_70.isLeaf && _70.id.charAt(0) == "a") {
            _6e.push(parseInt(_70.id.substring(2)));
        }
    }
    return _6e;
},showDefaultsDialog:function() {
    if (!this.defaultDialog) {
        this.defaultDialog = new jx.window.RelateDefaultsWindow({title:"Defaults",data:new jx.ItemData({org:{id:this.getAppContext().organization.id}}),listeners:{changeRelateDefaults:{fn:this.changeRelateDefaults,scope:this}}});
    }
    this.defaultDialog.show();
    this.defaultDialog.refresh();
    this.defaultDialog.alignTo(this.getTopToolbar().getEl(), "tl-bl", [0,0], true);
},changeRelateDefaults:function(_71) {
    this.relateDefaults = _71;
}});
Ext.reg("jx.panel.RelateTreePanel", jx.panel.RelateTreePanel);
jx.window.RelateDefaultsWindow = function(_72) {
    _72 = Ext.applyIf(_72, {width:300,height:275,modal:false,closable:true,closeAction:"hide",maximizable:true,minimizable:false,layout:"fit",items:{xtype:"panel",layout:"fit",items:this.createForm()},buttons:[{text:i18n.g("j.b.relateDefaultsSet"),handler:this.defaultsChanged,scope:this},{text:i18n.g("j-b-relateClose"),handler:this.onClose,scope:this}]});
    jx.window.RelateDefaultsWindow.superclass.constructor.call(this, _72);
};
Ext.extend(jx.window.RelateDefaultsWindow, Ext.Window, {data:null,relationshipTypeStore:null,relationshipTypeCombo:null,relationshipDirectionF:null,createForm:function() {
    this.relationshipTypeStore = jx.data.StoreFactory.buildLookupByTypeCategoryStore();
    this.relationshipTypeCombo = new Ext.form.ComboBox({fieldLabel:"Relationship Type",store:this.relationshipTypeStore,displayField:"name",valueField:"id",mode:"local",name:"relateDefaultType",triggerAction:"all",selectOnFocus:true,editable:false,forceSelection:true});
    this.relationshipDirectionF = new Ext.form.Radio({boxLabel:"Forward",labelSeparator:"",checked:true,name:"relationshipDirection",inputType:"radio",inputValue:"forward"});
    var _73 = new Ext.form.Radio({boxLabel:"Backward",checked:false,labelSeparator:"",name:"relationshipDirection",inputType:"radio",inputValue:"backward"});
    this.form = new Ext.form.FormPanel({labelAlign:"left",bodyBorder:false,labelWidth:100,items:[this.relationshipTypeCombo,{xtype:"fieldset",title:i18n.g("j.l.relateDirectionText"),labelWidth:10,layout:"form",items:[this.relationshipDirectionF,_73]}]});
    return this.form;
},defaultsChanged:function() {
    var _74 = this.form.getForm().getValues();
    var _75 = {direction:_74.relationshipDirection,type:this.relationshipTypeCombo.value};
    this.fireEvent("changeRelateDefaults", _75);
    this.onClose();
},refresh:function() {
    this.relationshipTypeStore.load({arg:[1024,2,this.data.getOrgId()]});
},setRelateTypeValue:function() {
    if (this.relationshipTypeStore.data.items.length > 0) {
        this.relationshipTypeCombo.setValue(this.relationshipTypeStore.data.items[0].data.name);
    }
},onClose:function() {
    this.hide();
},render:function() {
    this.relationshipTypeStore.on("load", this.setRelateTypeValue, this);
    jx.window.RelateDefaultsWindow.superclass.render.apply(this, arguments);
}});
jx.panel.ProjectCenterPanel = function(_76) {
    jx.panel.ProjectCenterPanel.superclass.constructor.call(this, _76);
};
Ext.extend(jx.panel.ProjectCenterPanel, Ext.TabPanel, {project:null,mainProjectGrid:null,initComponent:function() {
    Ext.apply(this, {region:"center",resizeTabs:true,tabWidth:150,border:false,minTabWidth:120,enableTabScroll:true,activeItem:0,plugins:new Ext.ux.TabCloseMenu()});
    jx.panel.ProjectCenterPanel.superclass.initComponent.call(this);
    this.getAppContext().on({showItem:this.showItemPanel,editItem:this.editItem,deleteItem:this.deleteItem,showGroup:this.showGroupPanel,editGroup:this.editGroup,deleteGroup:this.deleteGroup,editFilter:this.editFilter,deleteFilter:this.deleteFilter,editRelease:this.editRelease,deleteRelease:this.deleteRelease,editTag:this.editTag,deleteTag:this.deleteTag,showGrid:this.showGridPanel,batchUpdate:this.batchUpdate,batchDelete:this.batchDelete,showWindow:this.showWindow,loadProjectGridTab:this.loadNewTab,showProject:this.showProjectPanel,showProjectGrid:this.showProjectGridPanel,deleteProject:this.deleteProject,afterProjectDelete:this.removeTab,scope:this});
},loadNewTab:function(_77) {
    var _78 = _77.data.tab.id;
    var _79 = _77.data.officialId;
    var _7a = this.findById(_78);
    if ((_78 == _79) && _7a) {
        this.setActiveTab(_7a);
    } else {
        if (_7a) {
            this.remove(_7a, true);
        }
        var _7b = this.add(_77.data.tab);
        this.setActiveTab(_7b);
    }
    this.doLayout();
},removeTab:function() {
    this.remove(this.getActiveTab());
},showProjectPanel:function(e) {
    var _7d = e.data;
    var _7e = null;
    var id = null;
    if (e.newTab) {
        id = this.getId() + "-project-" + _7d.project.id;
    } else {
        id = this.getId() + "-project";
    }
    if (!(_7e = this.getItem(id))) {
        _7e = this.add(new jx.panel.ProjectPanel({closable:true,id:id,data:new jx.ItemData({project:_7d.project})}));
        this.add(_7e);
    } else {
        _7e.data.reconfig({project:_7d.project});
    }
    _7e.setTitle(_7d.project.name);
    this.setActiveTab(_7e);
},showItemPanel:function(e) {
    var _81 = e.data;
    var _82;
    var id = null;
    if (e.newTab) {
        id = this.getId() + "-item-" + _81.item.id;
    } else {
        id = this.getId() + "-item";
    }
    if (!(_82 = this.getItem(id))) {
        _82 = this.add(new jx.panel.ItemPanel({closable:true,id:id,data:new jx.ItemData({project:_81.project,item:_81.item,itemType:"doc"})}));
        this.add(_82);
    } else {
        _82.data.reconfig({project:_81.project,item:_81.item,itemType:"doc"});
    }
    _82.setTitle(_81.item.name);
    this.setActiveTab(_82);
    if (this.items.getCount() == 1) {
        this.doLayout();
    }
},showGroupPanel:function(e) {
    var _85 = e.data;
    var _86 = _85.group;
    var _87 = null;
    var id = null;
    if (e.newTab) {
        id = this.getId() + "-group-" + _86.id;
    } else {
        id = this.getId() + "-group";
    }
    if (!(_87 = this.getItem(id))) {
        _87 = this.add(new jx.panel.GroupPanel({closable:true,id:id,data:new jx.ItemData({project:_85.project,group:_85.group})}));
        this.add(_87);
    } else {
        _87.data.reconfig({project:_85.project,group:_85.group});
    }
    _87.setTitle(_86.name);
    this.setActiveTab(_87);
},showGridPanel:function(e) {
    var _8a = e.data;
    var _8b = null;
    var id = null;
    if (e.newTab) {
        id = this.getId() + "-grid-" + _8a.itemType;
    } else {
        id = this.getId() + "-grid";
    }
    _8a.item = jx.panel.ResultPanel.prototype.getDisplayAndIcon(_8a);
    if (!(_8b = this.getItem(id))) {
        _8b = this.add(new jx.panel.ResultPanel({closable:true,id:id,data:new jx.ItemData({project:_8a.project,item:_8a.item,itemType:_8a.itemType})}));
        this.add(_8b);
    } else {
        _8b.data.reconfig({project:_8a.project,item:_8a.item,itemType:_8a.itemType});
    }
    this.setActiveTab(_8b);
},showProjectGridPanel:function(e) {
    var _8e = e.data;
    var _8f = null;
    var id = null;
    id = this.getId() + "-p-main-grid";
    if (!(_8f = this.getItem(id))) {
        _8f = this.add(new jx.panel.ProjectGridPanel({title:i18n.g("j.l.projectGrid"),closable:true,id:id,data:new jx.ItemData({project:{},item:{}})}));
        this.add(_8f);
    } else {
        _8f.data.reconfig({project:{},item:{}});
    }
    this.setActiveTab(_8f);
    _8f.refresh();
},showWelcomePanel:function() {
    var _91 = null;
    var id = null;
    id = this.getId() + "-p-welcome";
    if (!(_91 = this.getItem(id))) {
        _91 = this.add({autoLoad:"welcome.pagelet",title:"Welcome",autoScroll:true,closable:true,id:id});
        this.add(_91);
    }
    this.setActiveTab(_91);
},editItem:function(e) {
    if (!this.itemWindow) {
        this.itemWindow = new jx.window.ItemFormWindow({});
    }
    this.itemWindow.onEditItem(e);
},editGroup:function(e) {
    var w = new jx.window.GroupFormWindow({listeners:{}});
    var _96 = e.data;
    w.show();
    w.loadGroup(_96.group, _96.project, this.getAppContext().getOrganization());
},editFilter:function(e) {
    var _98 = e.data;
    var w = new jx.window.FilterFormWindow({org:this.getAppContext().getOrganization()});
    w.show();
    w.loadFilter(_98.item, _98.project, this.getAppContext().getOrganization(), e);
},deleteFilter:function(e) {
    var _9b = e.data.item;
    if (!_9b) {
        return;
    }
    var _9c = String.format("This will permanently remove \"{0}\" filter." + "<br>If this filter is shared it will be removed for everyone." + "<br>" + "<br>Are you sure you want to delete?", _9b.name);
    Ext.MessageBox.confirm("Confirm", _9c, this.deleteFilterConfirm.createDelegate(this, [e], 0));
},deleteFilterConfirm:function(e, _9e) {
    var id = e.data.item.id;
    if (_9e == "yes") {
        filterSvc.deleteFilter(id, {callback:this.deleteFilterCallback.createDelegate(this, [e])});
    }
},deleteFilterCallback:function(e) {
    var _a1 = e.data.item;
    this.remove(e.source);
    this.getAppContext().fireEvent("afterDeleteFilter", e);
    this.getAppContext().fireEvent("refreshFilterList", e);
    this.getAppContext().fireEvent("showMessage", "Success", "The filter has been deleted.");
},editRelease:function(e) {
    var _a3 = e.data;
    var w = new jx.window.ReleaseFormWindow({data:_a3});
    w.show(e.sourceEl.getEl());
    w.editRelease(_a3.item);
},deleteRelease:function(e) {
    var _a6 = e.data.item;
    if (!_a6) {
        return;
    }
    var _a7 = String.format("Are you sure you want to delete release {0}?", _a6.name);
    Ext.MessageBox.confirm("Confirm", _a7, this.deleteReleaseConfirm.createDelegate(this, [e], 0));
},deleteReleaseConfirm:function(e, _a9) {
    var id = e.data.item.id;
    if (_a9 == "yes") {
        releaseSvc.deleteRelease(id, e.data.project.id, {callback:this.deleteReleaseCallback.createDelegate(this, [e])});
    }
},deleteReleaseCallback:function(e) {
    var _ac = e.data.item;
    this.remove(e.source);
    this.getAppContext().fireEvent("afterDeleteRelease", e);
    this.getAppContext().fireEvent("showMessage", "Success", "The release has been deleted.");
},editTag:function(e) {
    var _ae = e.data;
    var w = new jx.window.TagFormWindow({closeAction:"destroy",cancelAction:"destroy",listeners:{afterSaveTag:this.afterSaveTag.createDelegate(this, [e], 0)}});
    w.show(e.sourceEl ? e.sourceEl.getEl() : null);
    if (_ae.item.name) {
        _ae.item.tagName = _ae.item.name;
    }
    w.editTag(_ae.item, _ae.project);
},afterSaveTag:function(e, w, _b2) {
    var _b3 = Ext.apply(e.data.item, {name:_b2.tagName});
    if (e.sourceType == "grid") {
        e.source.data.reconfig({item:_b3});
    }
    this.getAppContext().fireEvent("refreshTagList", _b3);
},deleteTag:function(e) {
    var _b5 = e.data.item;
    if (!_b5) {
        return;
    }
    var _b6 = String.format("Are you sure you want to delete Tag {0}?", _b5.name);
    Ext.MessageBox.confirm("Confirm", _b6, this.deleteTagConfirm.createDelegate(this, [e], 0));
},deleteTagConfirm:function(e, _b8) {
    var id = e.data.item.id;
    if (_b8 == "yes") {
        tagSvc.removeTag(id, {callback:this.deleteTagCallback.createDelegate(this, [e])});
    }
},deleteTagCallback:function(e) {
    var _bb = e.data.item;
    this.remove(e.source);
    this.getAppContext().fireEvent("afterDeleteTag", e);
    this.getAppContext().fireEvent("refreshTagList");
    this.getAppContext().fireEvent("showMessage", i18n.g("j.l.success"), "The tag has been deleted.");
},batchUpdate:function(e) {
    var w = new jx.window.BatchUpdateFormWindow({});
    w.show();
    w.loadFilter(e.data.item, e.data.project, this.getAppContext().getOrganization(), e);
},batchDelete:function(e) {
    var _bf = e.data.itemType == "filter" ? "Are you sure you want to delete all the items?" : "Are you sure you want to delete the selected items?";
    Ext.MessageBox.confirm("Confirm", _bf, this.batchDeleteConfirm.createDelegate(this, [e], 0));
},batchDeleteConfirm:function(e, _c1) {
    if (_c1 == "yes") {
        documentManager.deactivateDocumentBatch(e.data.item, this.batchDeleteCallback.createDelegate(this, [e], 0));
    }
},batchDeleteCallback:function(e) {
    e.source.refresh();
    this.getAppContext().fireEvent("showMessage", "Success", "Items(s) are deleted.");
},deleteItem:function(e) {
    var doc = e.data.item;
    if (!doc) {
        return;
    }
    if (!doc.isFolder) {
        var _c5 = String.format(i18n.g("j.m.itemDelete"), doc.name);
        Ext.MessageBox.confirm("Confirm", _c5, this.deleteItemConfirm.createDelegate(this, [e], 0));
    } else {
        var _c5 = String.format(i18n.g("j.m.folderDelete"), doc.name);
        Ext.MessageBox.confirm("Confirm", _c5, this.deleteItemConfirm.createDelegate(this, [e], 0));
    }
},deleteItemConfirm:function(e, _c7) {
    var _c8 = e.data.item.id;
    if (_c7 == "yes") {
        documentManager.deactivateDocument(_c8, {callback:this.deleteItemCallback.createDelegate(this, [e])});
    }
},deleteItemCallback:function(e) {
    var doc = e.data.item;
    if (e.sourceType == "grid") {
        e.source.refresh(false);
    } else {
        if (e.sourceType == "tree") {
        } else {
            this.remove(e.source);
        }
    }
    this.getAppContext().fireEvent("afterDeleteItem", e);
    this.getAppContext().fireEvent("showMessage", "Success", "The item has been deleted.");
},deleteGroup:function(e) {
    var _cc = e.data.item ? e.data.item : e.data.group;
    if (!_cc) {
        return;
    }
    e.data.item = _cc;
    var _cd = String.format("Are you sure you want to delete Set {0} and items in the set?", _cc.name ? _cc.name : _cc.displayPlural);
    Ext.MessageBox.confirm("Confirm", _cd, this.deleteGroupConfirm.createDelegate(this, [e], 0));
},deleteGroupConfirm:function(e, _cf) {
    var id = e.data.item.id;
    if (_cf == "yes") {
        documentManager.deactivateDocumentGroup(id, {callback:this.deleteGroupCallback.createDelegate(this, [e])});
    }
},deleteGroupCallback:function(e) {
    var _d2 = e.data.item;
    this.remove(e.source);
    this.getAppContext().fireEvent("refreshItemTree", e);
    this.getAppContext().fireEvent("showMessage", "Success", "The Set has been deleted.");
},deleteProject:function(e) {
    var _d4 = e.data.project;
    if (!_d4.isFolder) {
        var _d5 = String.format("This will delete the project \"{0}\" " + "<br><br>By selecting \"Yes\" everything within this project will be permanently removed, " + "including all Sets, Items and Relationships." + "<br>" + "<br>Are you sure you want to delete \"{0}\"?", [_d4.name]);
        Ext.MessageBox.confirm("Warning!", _d5, this.deleteProjectConfirm.createDelegate(this, [e], 0));
    } else {
        var _d5 = String.format("This will delete the folder \"{0}\" and all sub projects." + "<br>" + "<br>Are you sure you want to delete?", [_d4.name]);
        Ext.MessageBox.confirm("Warning!", _d5, this.deleteProjectConfirm.createDelegate(this, [e], 0));
    }
},deleteProjectConfirm:function(e, _d7) {
    if (_d7 == "yes") {
        this.createLoadingMessageBox("Deleting the project");
        project.deleteProject({id:e.data.project.id}, {callback:this.deleteProjectSuccess.createDelegate(this, [e], 0),exceptionHandler:this.deleteProjectException.createDelegate(this, [e], 0)});
    }
},createLoadingMessageBox:function(_d8) {
    this.messageBox = Ext.MessageBox.show({title:"Please wait...",msg:_d8,width:300,closable:false,animEl:"home-tab"});
    var f = function(_da, _db, obj) {
        return function() {
            if (obj.loadingMessage) {
                if (_db.length > 200) {
                    _db = "";
                } else {
                    _db = _db + ". ";
                }
                setTimeout(f(_da, _db, obj), 1 * 1000);
                obj.messageBox.updateText(_da + _db);
            }
        };
    };
    var _dd = "";
    var _de = this;
    _de.loadingMessage = true;
    setTimeout(f(_d8, _dd, _de), 1 * 1000);
},deleteProjectSuccess:function(e) {
    this.loadingMessage = false;
    this.messageBox.hide();
    this.getAppContext().showMessage("Success", "The project has been deleted");
    this.getAppContext().fireEvent("refreshProjectList");
    if (e.sourceType == "grid" && e.source.refresh) {
        e.source.refresh(false);
    }
    if (e.sourctType == "tab") {
        this.getAppContext().fireEvent("afterProjectDelete");
    }
},deleteProjectException:function(e, _e1, _e2) {
    this.loadingMessage = false;
    Ext.MessageBox.alert("Error", "Delete project did not complete successfully. Nothing has been changed.");
},showWindow:function(e) {
    var w;
    var _e5;
    var _e6 = {xtype:e.xtype,data:e.data,project:e.data.project,org:this.getAppContext().getOrganization()};
    if (e.newWindow === false) {
        w = Ext.getCmp(e.xtype);
        if (!w) {
            _e5 = true;
            _e6.closeAction = "hide";
            _e6.cancelAction = "hide";
            _e6.id = e.xtype;
        }
    } else {
        _e5 = true;
        _e6.closeAction = "destroy";
        _e6.cancelAction = "destroy";
    }
    if (_e5) {
        w = Ext.ComponentMgr.create(_e6);
        this.orgAdmin = w;
    }
    w.show(e.sourceEl);
    w.onEvent(e);
},addProject:function(e) {
    var w = new jx.window.ProjectFormWindow({});
    w.onEditProject(e);
},refreshItemTree:function() {
    this.getAppContext().fireEvent("refreshItemTree");
},processUrl:function() {
    var _e9 = window.location.search;
    var _ea = _e9.lastIndexOf("projectId=");
    var idx = _e9.lastIndexOf("docId=");
    var _ec = (idx != -1) ? idx - 1 : _e9.length;
    var pId = parseInt(_e9.substring(_ea + 10, _ec));
    var e = {sourceType:"url",source:this,data:{item:{}},newTab:false};
    if (_ea != -1 && (pId.length > 0 || !isNaN(pId))) {
        this.accessDenied = false;
        var _ef = this;
        project.getProjectDto(pId, {callback:function(_f0) {
            _ef.urlProject = _f0;
        },async:false});
        e.data.project = new jx.Project(_ef.urlProject);
        if (e.data.project.getMask() == 0) {
            this.getAppContext().showMessage("Warning", "Access Denied");
            return;
        }
        if (idx != -1) {
            var dId = parseInt(_e9.substr(idx + 6));
            documentManager.getDocumentDto(dId, {callback:function(_f2) {
                _ef.urlItem = _f2;
            },async:false});
            e.data.item = _ef.urlItem;
            this.showItemPanel(e);
        } else {
            this.showProjectPanel(e);
        }
    }
},render:function() {
    jx.panel.ProjectCenterPanel.superclass.render.apply(this, arguments);
    var e = {sourceType:"onLoad",source:this,data:{project:{id:0},item:{}},newTab:false};
    this.showWelcomePanel();
    this.showProjectGridPanel(e);
    this.setActiveTab(0);
    this.processUrl();
}});
Ext.reg("jx.panel.ProjectCenterPanel", jx.panel.ProjectCenterPanel);
jx.panel.RelationshipPanel = function(_f4) {
    jx.panel.RelationshipPanel.superclass.constructor.call(this, _f4);
};
Ext.extend(jx.panel.RelationshipPanel, Ext.Panel, {initComponent:function() {
    Ext.apply(this, {title:"Relate"});
    jx.panel.RelationshipPanel.superclass.initComponent.call(this);
}});
Ext.reg("jx.panel.RelationshipPanel", jx.panel.RelationshipPanel);
jx.panel.ReportPanel = function(_f5) {
    _f5 = Ext.applyIf(_f5, {autoScroll:true});
    jx.panel.ReportPanel.superclass.constructor.call(this, _f5);
};
Ext.extend(jx.panel.ReportPanel, Ext.Panel, {initComponent:function() {
    Ext.apply(this, {title:"Report"});
    jx.panel.ReportPanel.superclass.initComponent.call(this);
}});
Ext.reg("jx.panel.ReportPanel", jx.panel.ReportPanel);
jx.panel.ItemTreePanel = function(_f6) {
    project:
            null,_f6 = Ext.applyIf(_f6, {title:i18n.g("j.l.itemTree"),folderOnly:false,border:false,tbar:this.getTbar(),data:new jx.ItemData({project:{}})});
    jx.panel.ItemTreePanel.superclass.constructor.call(this, _f6);
};
Ext.extend(jx.panel.ItemTreePanel, jx.tree.ItemTree, {buttonEnabled:false,tagDialog:null,filterDialog:null,releaseWindow:null,data:null,initComponent:function() {
    var ctx = this.getAppContext();
    jx.panel.ItemTreePanel.superclass.initComponent.call(this);
    ctx.on({refreshItemTree:this.refresh,afterDeleteItem:this.deleteItem,scope:this});
    this.on({nodedragover:this.nodeDragOver,beforenodedrop:this.beforeNodeDrop,nodedrop:this.nodeDrop,contextmenu:this.onContextMenu,scope:this,click:{fn:this.onTreeNodeClick,scope:this}});
    this.data.on("dataChanged", this.refresh, this);
    this.getAppContext().on("nullProject", this.disableButtons, this);
},loadProjectWithCallback:function(e) {
    this.data.reconfig({project:e.data.project});
    e.source.fireEvent("afterLoadItemTree", e);
},refresh:function() {
    this.loadProject(this.data.project);
},loadProject:function(_f9) {
    if (_f9.id && !this.buttonEnabled) {
        this.getTopToolbar().items.each(function(_fa) {
            _fa.enable();
        });
        this.buttonEnalbed = true;
    }
    if (this.rendered) {
        this.getTopToolbar().showButtons(_f9.getMask());
    }
    jx.panel.ItemTreePanel.superclass.loadProject.call(this, _f9);
},getTbar:function() {
    var wa = jx.AclPermission.WRITEADMIN;
    return [{text:i18n.g("j.b.itemAdd"),iconCls:"j-item-add-icon",disabled:true,mask:wa,menu:new Ext.menu.Menu({items:[{iconCls:"j-item-add-icon",text:i18n.g("j.b.addItem"),tooltip:i18n.g("j.tt.addItem"),handler:this.onAddItem,id:"p-itemtree-addItem-button",scope:this},{text:i18n.g("j.b.addSet"),tooltip:i18n.g("j.tt.addSet"),iconCls:"j-set-add-icon",handler:this.onAddGroup,id:"p-itemtree-addSet-button",scope:this},{iconCls:"j-item-folder-add-icon",text:i18n.g("j.b.itemAddFolder"),tooltip:i18n.g("j.tt.addFolder"),handler:this.onAddItemFolder,id:"p-itemtree-addFolder-button",scope:this}]})},{xtype:"tbseparator",mask:wa},{text:i18n.g("Views"),iconCls:"j-filter-add-icon",disabled:true,menu:new Ext.menu.Menu({items:[{id:"o-tags-button",text:i18n.g("j.b.tags"),tooltip:i18n.g("j.tt.tags"),iconCls:"j-tag-blue-icon",handler:this.showTags,scope:this},{id:"o-filters-button",text:i18n.g("j.b.filters"),tooltip:i18n.g("j.tt.filters"),iconCls:"j-filter-add-icon",handler:this.showFilters,scope:this},{id:"o-release-button",text:i18n.g("j.b.releaseTree"),tooltip:i18n.g("j.tt.releaseTree"),iconCls:"j-item-release-icon",handler:this.showRelease,scope:this}]})},"->",{text:"",tooltip:i18n.g("j.tt.itemTreeShowHideItems"),icon:"img/silk/page_white_text.png",cls:"x-btn-icon",enableToggle:true,pressed:true,toggleHandler:this.toggleItems.createDelegate(this)},{iconCls:"j-item-refresh-icon",tooltip:i18n.g("j.tt.refreshItemExplorer"),handler:this.refresh,id:"p-itemtree-refresh-button",scope:this,disabled:true}];
},toggleItems:function(_fc, _fd) {
    var _fe = this.data.project;
    this.folderOnly = !_fd;
    this.loadProject(_fe);
},getActionMenu:function() {
    if (!this.actionMenu) {
        var _ff = jx.AclPermission.WRITEADMIN;
        this.actionMenu = new Ext.menu.Menu({items:[{text:i18n.g("j.b.itemPreview"),iconCls:"j-item-preview-icon",handler:function() {
            this.onPreviewItem(this.ctxMenuNode);
        },scope:this},{text:i18n.g("j.b.itemEdit"),iconCls:"j-item-edit-icon",handler:function() {
            this.editSelectedItem(this.ctxMenuNode);
        },scope:this,mask:_ff},{text:i18n.g("j.b.itemDelete"),iconCls:"j-item-delete-icon",handler:function() {
            this.deleteSelectedItem(this.ctxMenuNode);
        },scope:this,mask:_ff},{text:i18n.g("j.b.openInNewTab"),tooltip:i18n.g("j.tt.openInNewTab"),iconCls:"j-item-grid-open-selected",handler:this.showItemInNewTab,scope:this}]});
    }
    this.actionMenu.showButtons(this.data.project.getMask());
    return this.actionMenu;
},beforeNodeDrop:function(e) {
    var _101 = e.source;
    var p = e.point;
    var _103 = null;
    var _104 = e.target;
    var _105 = (p == "append") ? e.target : e.target.parentNode;
    if (p != "append") {
        _103 = (p == "above") ? _104 : _104.nextSibling;
    }
    e.targetParent = _105;
    e.refNode = _103;
    if (_101.grid && !e.dropNode) {
        var node = this.generateDropNode(e);
        e.dropNode = node;
        e.cancel = node.length < 1;
        node.parentExpanded = _105.isExpanded();
    }
    if (!e.cancel && _101.grid) {
        for (var i = 0,len = e.dropNode.length; i < len; i++) {
            var node = e.tree.getNodeById(e.dropNode[i].id);
            if (node) {
                node.parentNode.removeChild(node);
            }
        }
    }
    return;
},moveItems:function(e) {
    var _109 = e.refNode;
    var _10a = e.targetParent;
    documentManager.moveItems(this.getNodeList(e.dropNode), null, _10a.id, _109 ? _109.id : null, {exceptionHandler:this.handleMoveException.createDelegate(this, [e], 0),async:false});
    if ((e.source.grid && !e.dropNode.parentExpanded) || this.folderOnly) {
        _10a.reload();
    }
},handleMoveException:function(e, msg, ex) {
    e.cancel = true;
    this.getAppContext().fireEvent("showMessage", "Error", msg);
},getNodeList:function(_10e) {
    var _10f = [];
    if (_10e instanceof Array) {
        for (var i = 0,len = _10e.length; i < len; i++) {
            _10f.push(_10e[i].id);
        }
    } else {
        _10f.push(_10e.id);
    }
    return _10f;
},nodeDrop:function(e) {
    if (e.source.tree) {
        this.moveItems(e);
        this.getAppContext().fireEvent("showMessage", "Success", "Item {0} moved", e.dropNode.text);
    } else {
        if (e.source.grid) {
            this.moveItems(e);
            this.getAppContext().fireEvent("showMessage", "Success", "{0} selected item(s) moved", e.dropNode.length);
            e.source.grid.fireEvent("itemsMoved", "artifact");
        }
    }
},nodeDragOver:function(e) {
    var _113 = e.source;
    var _114 = (e.point == "append") ? e.target : e.target.parentNode;
    if (_113.tree) {
        var _115 = e.dropNode;
        return ((_115.id.charAt(0) == "a" && (_115.attributes.typeId == _114.attributes.typeId)) || (_115.id.charAt(0) == "g" && _114.id.charAt(0) == "p"));
    } else {
        if (_113.grid) {
            if (_114.id.charAt(0) == "p") {
                return false;
            }
            var path = _114.getPath();
            var _117 = _114.attributes;
            var _118 = _117.typeId;
            var pid = _117.id;
            var s = e.data.selections;
            var _11b = e.target;
            for (var i = 0,len = s.length; i < len; i++) {
                var _11d = s[i];
                var rid = "a-" + _11d.id;
                if (_11d.data.typeId != _118 || rid == pid || rid == _11b.id || (_11d.data.isFolder && path.indexOf(rid + "/") >= 0)) {
                    return false;
                }
            }
            return true;
        }
    }
},generateDropNode:function(e) {
    var s = e.data.selections,r = [];
    var _121 = this.project.getShowIdInTree();
    for (var i = 0,len = s.length; i < len; i++) {
        var data = s[i].data;
        var text = data.name;
        var icon = data.isFolder ? "img/silk/folder.png" : "img/silk/page_white_text.png";
        var _126 = data.typeId;
        r.push(new Ext.tree.AsyncTreeNode({allowDrop:false,text:_121 ? data.documentKey + " " + text : text,leaf:data.isFolder ? false : true,id:"a-" + s[i].id,icon:icon,typeId:_126}));
    }
    return r;
},findMe:function(e) {
    var item = e.data.item;
    if (item) {
        documentManager.getPath(item.id, this.reloadPath.createDelegate(this));
    }
},reloadPath:function(path) {
    if (!path) {
        return;
    }
    var pos = path.lastIndexOf("/");
    if (pos > 0) {
        var _12b = path.substr(0, pos);
        this.selectPath(_12b, null, this.selectPathCallback.createDelegate(this, [path], true));
    }
},selectPathCallback:function(_12c, node, path) {
    if (_12c && node) {
        node.reload(this.selectPath.createDelegate(this, [path]));
    }
},addItem:function(_12f, _130) {
    var e = {data:new jx.ItemData({item:{isFolder:_130},project:this.project}),source:this,sourceType:"tree",sourceEl:_12f.getEl(),node:this.getSelectionModel().getSelectedNode()};
    this.getAppContext().fireEvent("editItem", e);
},onAddItem:function(_132) {
    this.addItem(_132, false);
},onAddItemFolder:function(_133) {
    this.addItem(_133, true);
},deleteItem:function(e) {
    var _135 = "a-" + e.data.item.id;
    var node = this.getNodeById(_135);
    if (node) {
        node.parentNode.removeChild(node);
    }
},onAddGroup:function(_137) {
    var e = {data:new jx.ItemData({group:{},project:this.project,org:this.getAppContext().getOrganization()}),source:this,sourceType:"tree",node:this.getSelectionModel().getSelectedNode()};
    this.getAppContext().fireEvent("editGroup", e);
},onTreeNodeDblClick:function(node) {
    this.dblClick = true;
    this.nodeClick(node, true);
},onTreeNodeClick:function(node) {
    if (this.dblClick) {
        this.dblClick = false;
    } else {
        this.nodeClick(node, false);
    }
},onContextMenu:function(node, e) {
    var _13d = e.getXY();
    if (node.id.charAt(0) == "a") {
        this.ctxMenuNode = node;
        this.getActionMenu().showAt([_13d[0],_13d[1]]);
    }
},nodeClick:function(node, _13f) {
    var ctx = this.getAppContext();
    var _141 = node.id;
    var id = parseInt(_141.substring(2));
    switch (_141.charAt(0)) {
        case "p":
            break;
        case "a":
            this.showItem(ctx, this.project, id, node, _13f);
            break;
        case "g":
            this.showGroup(ctx, this.project, id, node, _13f);
            break;
        case "r":
            break;
        default:
            break;
    }
},showItemInNewTab:function() {
    var node = this.ctxMenuNode;
    if (node) {
        var ctx = this.getAppContext();
        var _145 = node.id;
        var id = parseInt(_145.substring(2));
        this.showItem(ctx, this.project, id, node, true);
    }
},deleteSelectedItem:function(node) {
    if (node) {
        var _148 = node.id;
        var id = parseInt(_148.substring(2));
        this.getAppContext().fireEvent("deleteItem", {sourceType:"tree",source:this,data:{project:this.data.project,item:{id:id,name:node.text}}});
    } else {
        Ext.MessageBox.alert(i18n.g("j.m.warning"), i18n.g("j.m.noItemSelected"));
    }
},editSelectedItem:function(node) {
    if (node) {
        var _14b = node.id;
        var id = parseInt(_14b.substring(2));
        var e = {data:new jx.ItemData({item:{id:id,name:node.text},project:this.data.project}),source:this,sourceType:"tree",sourceEl:this.getEl()};
        this.getAppContext().fireEvent("editItem", e);
    }
},onPreviewItem:function(node) {
    if (node) {
        var _14f = node.id;
        var id = parseInt(_14f.substring(2));
        this.getAppContext().fireEvent("showWindow", {sourceType:"tree",source:this,sourceEl:this.getEl(),xtype:"jx.window.ItemPreviewWindow",newWindow:false,data:{project:this.data.project,item:{id:id,name:node.text}}});
    } else {
        Ext.MessageBox.alert("Warning", "No item is selected.");
    }
},showItem:function(ctx, _152, id, node, _155) {
    ctx.fireEvent("showItem", {sourceType:"tree",source:this,node:node,data:{project:_152,item:{id:id,isFolder:!node.leaf,name:node.text,typeId:node.attributes.typeId}},newTab:_155});
},showGroup:function(ctx, _157, id, node, _15a) {
    ctx.fireEvent("showGroup", {sourceType:"tree",source:this,node:node,data:{project:_157,group:{id:id,name:node.text,typeId:node.attributes.typeId}},newTab:_15a});
},showTags:function() {
    if (!this.tagDialog) {
        this.tagDialog = new jx.window.TagListWindow({data:this.data});
    }
    this.tagDialog.show();
    this.tagDialog.refresh();
    this.tagDialog.alignTo(this.getTopToolbar().getEl(), "tl-bl", [0,0], true);
},showFilters:function() {
    if (!this.filterDialog) {
        this.filterDialog = new jx.window.FilterListWindow({data:this.data});
    }
    this.filterDialog.show();
    this.filterDialog.refresh();
    this.filterDialog.alignTo(this.getTopToolbar().getEl(), "tl-bl", [0,0], true);
},showRelease:function() {
    if (!this.releaseWindow) {
        this.releaseWindow = new jx.window.ReleaseTreeWindow({data:this.data});
    }
    this.releaseWindow.show();
    this.releaseWindow.refresh();
    this.releaseWindow.alignTo(this.getTopToolbar().getEl(), "tl-bl", [0,0], true);
},beforeDestroy:function() {
    if (this.filterDialog) {
        Ext.destroy(this.filterDialog);
    }
    if (this.tagDialog) {
        Ext.destroy(this.tagDialog);
    }
    if (this.releaseWindow) {
        Ext.destroy(this.releaseWindow);
    }
    jx.panel.ItemTreePanel.superclass.beforeDestroy.apply(this, arguments);
},disableButtons:function() {
    this.getTopToolbar().items.each(function(item) {
        item.disable();
    });
    this.buttonEnalbed = false;
}});
Ext.reg("jx.panel.ItemTreePanel", jx.panel.ItemTreePanel);
jx.panel.ProjectTreePanel = function(_15c) {
    _15c = Ext.applyIf(_15c, {tbar:this.getTbar(),border:false,autoScroll:true});
    jx.panel.ProjectTreePanel.superclass.constructor.call(this, _15c);
};
Ext.extend(jx.panel.ProjectTreePanel, jx.tree.ProjectTree, {project:null,inNewTab:false,initComponent:function() {
    var ctx = this.getAppContext();
    jx.panel.ProjectTreePanel.superclass.initComponent.call(this);
    this.on({nodedragover:this.nodeDragOver,beforenodedrop:this.beforeNodeDrop,nodedrop:this.nodeDrop,contextmenu:this.onContextMenu,click:this.onTreeNodeClick,afterLoadItemTree:this.onAfterLoadItemTree});
    ctx.on({refreshProjectList:this.refresh,findMe:this.findMe,loadProject:this.loadProject,scope:this});
},getTbar:function() {
    var _15e = jx.AclPermission.ORGADMIN;
    return [{iconCls:"j-project-add-icon",text:i18n.g("j.b.addProject"),tooltip:i18n.g("j.tt.addProject"),handler:this.onAddProject.createDelegate(this, [false], 0),id:"p-add-button",scope:this,mask:_15e},{xtype:"tbseparator",mask:_15e},{iconCls:"j-project-folder-add-icon",text:i18n.g("j.b.addFolder"),tooltip:i18n.g("j.tt.addFolder"),handler:this.onAddProject.createDelegate(this, [true], 0),id:"g-add-button",scope:this,mask:_15e},"->",{iconCls:"j-project-refresh-icon",handler:this.refreshTree,tooltip:i18n.g("j.tt.refreshProjectExplorer"),id:"p-tree-refresh-button",scope:this},{tooltip:i18n.g("j.tt.minimizeProjectExplorer"),iconCls:"j-minimize-panel-up",handler:this.collapse,scope:this}];
},onAddProject:function(_15f, _160) {
    var e = {data:{project:{isFolder:_15f}},source:this,sourceEl:_160,xtype:"jx.window.ProjectFormWindow",sourceType:"tree",node:this.getSelectionModel().getSelectedNode()};
    this.getAppContext().fireEvent("showWindow", e);
},loadProject:function(e) {
    if ((this.project == null) || (e.data.project.id != this.project.id)) {
        project.getProjectDto(e.data.project.id, {callback:this.onSuccessLoadProject.createDelegate(this, [e], 0)});
    } else {
        this.onSuccessLoadProject(e, this.project);
    }
},onSuccessLoadProject:function(e, _164) {
    this.project = new jx.Project(_164);
    this.fireEvent("showItemTree", {sourceType:"tree",source:this,data:{project:this.project}});
    this.inNewTab = false;
    e.data.project = this.project;
    this.getAppContext().fireEvent("showProject", e);
    this.getAppContext().fireEvent("projectChanged", e);
    if (this.project.isFolder) {
        this.getAppContext().fireEvent("nullProject");
    }
},toggleButtons:function() {
    if (this.rendered) {
        this.getTopToolbar().showButtons(this.getAppContext().getMask());
    }
},refresh:function(_165) {
    this.loadOrganization();
    if (_165) {
        var e = {data:{project:_165}};
        this.findMe(e);
    }
},refreshTree:function(_167) {
    this.refresh();
},onContextMenu:function(node, e) {
    var _16a = e.getXY();
    if (node.id.charAt(0) == "p") {
        this.ctxMenuNode = node;
        this.getProjectActionMenu(parseInt(node.id.substring(2))).showAt([_16a[0],_16a[1]]);
    }
    if (node.id.charAt(0) == "o") {
        this.ctxMenuNode = node;
        this.getOrgActionMenu().showAt([_16a[0],_16a[1]]);
    }
},getProjectActionMenu:function(pId) {
    if (!this.actionMenu) {
        this.actionMenu = new Ext.menu.Menu({items:[{text:i18n.g("j.b.projectEdit"),iconCls:"j-project-edit-icon",handler:function() {
            this.rightClickEditProject(this.ctxMenuNode);
        },scope:this,mask:jx.AclPermission.WRITEADMIN},{text:i18n.g("j.b.deleteProject"),iconCls:"j-project-delete-icon",handler:function() {
            this.rightClickDeleteProject(this.ctxMenuNode);
        },scope:this,mask:jx.AclPermission.WRITEADMIN}]});
    }
    var _16c = this.getAppContext().getProject(pId, true);
    this.actionMenu.showButtons(_16c.getMask());
    return this.actionMenu;
},getOrgActionMenu:function() {
    if (!this.orgActionMenu) {
        this.orgActionMenu = new Ext.menu.Menu({items:[{text:i18n.g("j.b.admin"),iconCls:"j-header-admin-icon",handler:function() {
            this.rightClickShowOrgAdmin(this.ctxMenuNode);
        },scope:this,mask:jx.AclPermission.ORGADMIN}]});
    }
    this.orgActionMenu.showButtons(this.getAppContext().getMask());
    return this.orgActionMenu;
},rightClickEditProject:function(node) {
    var ctx = this.getAppContext();
    if (node) {
        var id = parseInt(node.id.substring(2));
        var _170 = ctx.getProject(id, true);
        var e = {data:{project:_170},source:this,sourceEl:this.getEl(),sourceType:"tree",xtype:"jx.window.ProjectFormWindow"};
        ctx.fireEvent("showWindow", e);
    }
},rightClickDeleteProject:function(node) {
    if (node) {
        var ctx = this.getAppContext();
        var id = parseInt(node.id.substring(2));
        var e = {data:{project:{id:id,name:node.text}},source:this,sourceType:"tree"};
        ctx.fireEvent("deleteProject", e);
    }
},rightClickShowOrgAdmin:function(node) {
    if (node) {
        var ctx = this.getAppContext();
        var id = parseInt(node.id.substring(2));
        var e = {data:{project:{id:id,name:node.text}},source:this,sourceEl:node,sourceType:"tree",newWindow:false,xtype:"jx.window.OrgAdminWindow"};
        this.getAppContext().fireEvent("showWindow", e);
    }
},beforeNodeDrop:function(e) {
    var _17b = e.source;
    var p = e.point;
    var _17d = null;
    var _17e = e.target;
    var _17f = (p == "append") ? e.target : e.target.parentNode;
    if (p != "append") {
        _17d = (p == "above") ? _17e : _17e.nextSibling;
    }
    e.targetParent = _17f;
    e.refNode = _17d;
    if (_17b.grid && !e.dropNode) {
        var node = this.generateDropNode(e);
        e.dropNode = node;
        e.cancel = node.length < 1;
        node.parentExpanded = _17f.isExpanded();
    }
    if (!e.cancel && _17b.grid) {
        for (var i = 0,len = e.dropNode.length; i < len; i++) {
            var node = e.tree.getNodeById(e.dropNode[i].id);
            if (node) {
                node.parentNode.removeChild(node);
            }
        }
    }
    return;
},moveItems:function(e) {
    var _183 = e.refNode;
    var _184 = e.targetParent;
    var _185;
    if (_184.id.substring(0).charAt(0) == "o") {
        _185 = null;
    } else {
        _185 = parseInt(_184.id.substring(2));
    }
    var proj = {id:parseInt(e.dropNode.id.substring(2)),parent:_185};
    project.moveProject(proj, {exceptionHandler:this.handleMoveException.createDelegate(this, [e], 0),async:false});
    if ((e.source.grid && !e.dropNode.parentExpanded) || this.folderOnly) {
        _184.reload();
    }
},handleMoveException:function(e, msg, ex) {
    e.cancel = true;
    this.getAppContext().fireEvent("showMessage", "Error", msg);
},getNodeList:function(_18a) {
    var _18b = [];
    if (_18a instanceof Array) {
        for (var i = 0,len = _18a.length; i < len; i++) {
            _18b.push(_18a[i].id);
        }
    } else {
        _18b.push(_18a.id);
    }
    return _18b;
},nodeDrop:function(e) {
    if (e.source.tree) {
        this.moveItems(e);
        this.getAppContext().fireEvent("showMessage", "Success", "Item {0} moved", e.dropNode.text);
    } else {
        if (e.source.grid) {
            this.moveItems(e);
            this.getAppContext().fireEvent("showMessage", "Success", "{0} selected item(s) moved", e.dropNode.length);
            e.source.grid.fireEvent("itemsMoved", "artifact");
        }
    }
},nodeDragOver:function(e) {
    var _18f = e.source;
    var _190 = (e.point == "append") ? e.target : e.target.parentNode;
    if (_18f.tree) {
        var _191 = e.dropNode;
        return true;
    } else {
        if (_18f.grid) {
            return true;
        }
    }
},generateDropNode:function(e) {
    var s = e.data.selections,r = [];
    var _194 = this.project.getShowIdInTree();
    for (var i = 0,len = s.length; i < len; i++) {
        var data = s[i].data;
        var icon = data.isFolder ? "img/silk/folder.png" : "img/silk/page_white_text.png";
        var _198 = data.typeId;
        r.push(new Ext.tree.AsyncTreeNode({allowDrop:false,text:data.name,leaf:data.isFolder ? false : true,id:"p-" + s[i].id,icon:icon,typeId:_198}));
    }
    return r;
},findMe:function(e) {
    project.getPath(e.data.project.id, this.reloadPath.createDelegate(this));
    e.source = this;
    this.fireEvent("showItemTree", e);
    this.fireEvent("projectChanged", e);
},reloadPath:function(path) {
    if (!path) {
        return;
    }
    var pos = path.lastIndexOf("/");
    if (pos > 0) {
        var _19c = path.substr(0, pos);
        this.selectPath(_19c, null, this.selectPathCallback.createDelegate(this, [path], true));
    }
},selectPathCallback:function(_19d, node, path) {
    if (_19d && node) {
        node.reload(this.selectPath.createDelegate(this, [path]));
    }
},onAfterLoadItemTree:function(e) {
    if (e.data.item && e.data.item.id) {
        this.fireEvent("findItem", e);
    }
},onTreeNodeClick:function(node) {
    var ctx = this.getAppContext();
    var _1a3 = node.id;
    var id = parseInt(_1a3.substring(2));
    var e = {sourceType:"tree",source:this,data:{project:{id:id},item:{}},newTab:false};
    switch (_1a3.charAt(0)) {
        case "p":
            this.loadProject(e);
            break;
        case "o":
            this.project = null;
            this.fireEvent("showItemTree", {sourceType:"tree",source:this,data:{project:new jx.Project({id:0,name:"Select a project"})}});
            this.getAppContext().fireEvent("showProjectGrid", e);
            this.getAppContext().fireEvent("nullProject");
            break;
        case "g":
            break;
        default:
            break;
    }
},onTreeNodeDblClick:function() {
    this.inNewTab = true;
},render:function() {
    jx.panel.ProjectTreePanel.superclass.render.apply(this, arguments);
    this.toggleButtons();
}});
Ext.reg("jx.panel.ProjectTreePanel", jx.panel.ProjectTreePanel);
jx.panel.FilterListPanel = function(_1a6) {
    _1a6 = Ext.applyIf(_1a6, {autoScroll:true});
    jx.panel.FilterListPanel.superclass.constructor.call(this, _1a6);
};
Ext.extend(jx.panel.FilterListPanel, Ext.Panel, {filterListView:null,data:null,dialog:null,refresh:function() {
    if (this.data && this.data.getProjectId() && this.rendered) {
        this.filterListView.load(this.data.project);
        this.toggleButtons();
    }
},toggleButtons:function() {
    this.getTopToolbar().showButtons(this.data.project.getMask());
},loadFilterResults:function(view, _1a8, e) {
    if (_1a8) {
        var data = {item:_1a8,itemType:"filter",project:this.data.project};
        this.getAppContext().fireEvent("showGrid", {data:data,source:this});
    }
},initComponent:function() {
    Ext.apply(this, {autoScroll:true,tbar:this.getTbar()});
    jx.panel.FilterListPanel.superclass.initComponent.call(this);
},getTbar:function() {
    var wa = jx.AclPermission.WRITEADMIN;
    return [{text:i18n.g("j.b.addFilter"),iconCls:"j-filter-add-icon",tooltip:i18n.g("j.tt.addFilter"),handler:this.addItem,scope:this,mask:wa},"->",{iconCls:"j-refresh-icon",tooltip:i18n.g("j.tt.refresh"),handler:this.refresh,scope:this}];
},render:function() {
    jx.panel.FilterListPanel.superclass.render.apply(this, arguments);
    this.filterListView = new jx.view.FilterListView({data:this.data,listeners:{viewFilterResults:this.loadFilterResults,editFilter:this.editFilter,scope:this}});
    this.filterListView.render(this.body);
    this.refresh();
},editFilter:function(view, _1ad) {
    var e = {data:{project:this.data.project,item:_1ad,itemType:"filter"},source:this,sourceType:"panel",sourceEl:this.getEl()};
    this.getAppContext().fireEvent("editFilter", e);
},addItem:function(_1af) {
    this.editFilter(null, {});
}});
Ext.reg("jx.panel.FilterListPanel", jx.panel.FilterListPanel);
jx.panel.ItemPanel = function(_1b0) {
    jx.panel.ItemPanel.superclass.constructor.call(this, _1b0);
};
Ext.extend(jx.panel.ItemPanel, Ext.Panel, {data:null,notifyButton:null,refresh:function() {
    if (!this.tabPanel.ownerCt.hidden) {
        if (this.tabPanel.getActiveTab()) {
            this.tabPanel.getActiveTab().refresh(true);
        }
    }
    if (this.rendered) {
        this.toggleButtons();
    }
},render:function() {
    jx.panel.ProjectPanel.superclass.render.apply(this, arguments);
    this.toggleButtons();
},toggleButtons:function() {
    var _1b1 = this.data.project.getMask();
    this.getTopToolbar().showButtons(_1b1);
    var menu = Ext.menu.MenuMgr.get(this.actionMenuId);
    menu.showButtons(_1b1);
    menu = Ext.menu.MenuMgr.get(this.editMenuId);
    menu.showButtons(_1b1);
},onDataChanged:function() {
    this.tabPanel.items.each(function(item) {
        item.loadedId = null;
    });
    this.refresh();
},onEditItem:function() {
    var e = {data:this.data,source:this};
    this.getAppContext().fireEvent("editItem", e);
},onDeleteItem:function() {
    var e = {data:this.data,source:this};
    this.getAppContext().fireEvent("deleteItem", e);
},onAddRelItem:function() {
    var e = {data:new jx.ItemData({item:{isFolder:false},project:this.data.project}),source:this,related:this.data};
    this.getAppContext().fireEvent("editItem", e);
},onOpenRelate:function() {
    var e = {data:new jx.ItemData({item:{},project:this.data.project}),source:this,related:this.data};
    this.getAppContext().fireEvent("showRelationshipTree", e);
},onFindMe:function() {
    var e = {data:this.data,source:this};
    this.getAppContext().fireEvent("findMe", e);
},refreshTab:function(tab) {
    tab.refresh(true);
},initComponent:function() {
    this.propertySouthId = this.myId("property-south");
    this.propertyEastId = this.myId("property-east");
    Ext.apply(this, {autoScroll:false,tbar:this.getTbar(),iconCls:"j-item-folder-icon",border:false,layout:"border",items:[{xtype:"jx.panel.ItemFormPanel",defaults:{bodyStyle:"padding: 5px;"},data:this.data,collapsed:false,region:"center",border:false,autoScroll:true,listeners:{afterLoadArtifact:this.afterLoadItem,scope:this}},{region:"south",id:this.propertySouthId,split:true,collapsible:true,height:300,border:false,layout:"fit",margins:"0 0 0 0",items:this.getTabPanel()},{region:"east",id:this.propertyEastId,split:true,collapsible:true,width:300,layout:"fit",margins:"0 0 0 0",hidden:true}]});
    this.data.on("dataChanged", this.onDataChanged, this);
    jx.panel.ItemPanel.superclass.initComponent.call(this);
},afterLoadItem:function(item) {
    var _1bb = (item.isFolder) ? "j-item-folder-icon" : "j-page-text-icon";
    this.data.item = Ext.apply(this.data.item, item);
    this.setTabTitleAndIcon(this.title, _1bb);
    this.notifyButton.setChecked(this.data.item.notification, true);
    this.processComponents(item);
},processComponents:function(item) {
    var _1bd = [];
    var _1be = item.documentTypeDto.components;
    if (_1be && !item.isFolder) {
        _1bd = _1be.split(" ");
    } else {
        _1bd = ["folderList","comment","history"];
    }
    this.resetTab = false;
    this.firstActiveTab = null;
    var func = this.toggleTab.createDelegate(this, [_1bd], 0);
    this.tabPanel.items.each(func);
    if (this.resetTab) {
        this.tabPanel.setActiveTab(this.firstActiveTab);
    }
},toggleTab:function(_1c0, tab) {
    var tp = this.tabPanel;
    var isIn = this.hasItemCmp(tab.itemCmpName, _1c0);
    if (isIn) {
        if (!this.firstActiveTab) {
            this.firstActiveTab = tab;
        }
        tp.unhideTabStripItem(tab);
    }
    if (!isIn) {
        if (tab == tp.activeTab) {
            this.resetTab = true;
        }
        tp.hideTabStripItem(tab);
    }
},hasItemCmp:function(_1c4, _1c5) {
    for (var i in _1c5) {
        var _1c7 = _1c5[i];
        if (_1c4 == _1c7) {
            return true;
        }
    }
    return false;
},getTabPanel:function() {
    this.tabPanel = new Ext.TabPanel({activeItem:0,enableTabScroll:true,defaults:{data:this.data,autoScroll:true,border:false,bodyStyle:"padding:0px;",listeners:{activate:{fn:this.refreshTab,scope:this}}},items:[{itemCmpName:"folderList",title:"Sub-items",xtype:"jx.panel.ItemGridPanel",refreshOnDataChange:false},{itemCmpName:"comment",title:"Discussions",xtype:"jx.panel.ItemCommentPanel"},{itemCmpName:"relationship",title:"Relationships",xtype:"jx.panel.ItemRelationshipPanel",bodyStyle:"padding: 5px;",id:this.myId("i-relationship-panel")},{itemCmpName:"attachment",title:"Attachments",bodyStyle:"padding: 5px;",xtype:"jx.grid.ItemAttachmentGrid"},{itemCmpName:"tag",title:"Tags",bodyStyle:"padding: 5px;",xtype:"jx.panel.ItemTagPanel"},{itemCmpName:"history",title:"History",bodyStyle:"padding: 5px;",xtype:"jx.grid.VersionGrid"},{itemCmpName:"testHistory",title:"Test Results",bodyStyle:"padding: 5px;",xtype:"jx.grid.ItemTestResultsGrid"},{itemCmpName:"selenium",title:"Selenium",bodyStyle:"padding: 5px;",xtype:"jx.panel.ItemSeleniumPanel"}]});
    return this.tabPanel;
},getTbar:function() {
    this.propertyButtonId = this.myId("property-button");
    this.propertyMenuId = this.myId("property-menu");
    this.bottomMenuItemId = this.myId("bottom");
    this.rightMenuItemId = this.myId("right");
    this.hideMenuItemId = this.myId("hide");
    this.actionMenuId = this.myId("actionMenu");
    this.editMenuId = this.myId("editMenu");
    var _1c8 = this.myId("pp-group");
    var _1c9 = jx.AclPermission.WRITEADMIN;
    this.notifyButton = new Ext.menu.CheckItem({text:i18n.g("j.b.itemSubscribe"),boxLabel:i18n.g("j.b.itemSubscribe"),checked:this.data.item.notification,listeners:{checkchange:{fn:this.subscribeToItem,scope:this}},id:"i-" + this.data.item.id + "-notification-button"});
    return ["->",{split:false,text:i18n.g("j.l.itemMenuViews"),menu:{id:this.propertyMenuId,cls:"reading-menu",width:150,items:[{text:i18n.g("j.b.itemOpenRelate"),iconCls:"j-relationship-open-tree-icon",handler:this.onOpenRelate,scope:this,mask:_1c9},"-",{text:i18n.g("j.b.itemQuickReports"),iconCls:"j-quick-report-icon",handler:this.openQuickReport,scope:this},"-",{split:true,text:"Layout",tooltip:i18n.g("j.tt.projectView"),iconCls:"j-item-details-display-bottom",handler:this.moveProperty.createDelegate(this, []),id:this.propertyButtonId,menu:{cls:"reading-menu",width:100,items:[{id:this.bottomMenuItemId,text:i18n.g("j.l.projectViewBottom"),checked:true,group:_1c8,checkHandler:this.moveProperty,scope:this,iconCls:"preview-bottom"},{text:i18n.g("j.l.projectViewRight"),id:this.rightMenuItemId,checked:false,group:_1c8,checkHandler:this.moveProperty,scope:this,iconCls:"preview-right"},{text:i18n.g("j.l.projectViewHidden"),id:this.hideMenuItemId,checked:false,group:_1c8,checkHandler:this.moveProperty,scope:this,iconCls:"preview-hide"}]}}]}},{text:i18n.g("j.l.itemMenuActions"),menu:new Ext.menu.Menu({id:this.actionMenuId,items:[this.notifyButton,"-",{text:i18n.g("j.b.itemAddRelated"),iconCls:"j-add-related-icon",handler:this.onAddRelItem,scope:this,mask:_1c9},"-",{text:i18n.g("j.b.itemFindMe"),handler:this.onFindMe,scope:this,iconCls:"j-find-me-icon"},new Ext.menu.Separator({mask:_1c9}),{text:i18n.g("j.b.itemEmailLink"),handler:this.emailItem,scope:this,iconCls:"j-email-icon"}]})},{text:i18n.g("j.l.itemMenuEdit"),mask:_1c9,menu:new Ext.menu.Menu({id:this.editMenuId,items:[{text:i18n.g("j.b.itemEdit"),tooltip:i18n.g("j.tt.itemEdit"),iconCls:"j-item-edit-icon",handler:this.onEditItem,scope:this,mask:_1c9},new Ext.menu.Separator({mask:_1c9}),{text:i18n.g("j.b.itemCopy"),iconCls:"j-item-copy-icon",handler:this.showWindow.createDelegate(this, ["jx.window.ItemCopyWindow"], 0),mask:_1c9},{text:i18n.g("j.b.itemDelete"),iconCls:"j-item-delete-icon",handler:this.onDeleteItem,scope:this,mask:_1c9}]})}];
},moveProperty:function(m, _1cb) {
    if (!m) {
        var _1cc = Ext.menu.MenuMgr.get(this.propertyMenuId);
        _1cc.render();
        var _1cd = _1cc.items.items;
        var b = _1cd[0],r = _1cd[1],h = _1cd[2];
        if (b.checked) {
            r.setChecked(true);
        } else {
            if (r.checked) {
                h.setChecked(true);
            } else {
                if (h.checked) {
                    b.setChecked(true);
                }
            }
        }
        return;
    }
    if (_1cb) {
        var _1cf = this.tabPanel;
        var _1d0 = Ext.getCmp(this.propertyEastId);
        var bot = Ext.getCmp(this.propertySouthId);
        var btn = Ext.getCmp(this.propertyButtonId);
        switch (m.id) {
            case this.bottomMenuItemId:
                _1d0.hide();
                bot.add(_1cf);
                bot.show();
                bot.ownerCt.doLayout();
                btn.setIconClass("j-item-details-display-bottom");
                this.tabPanel.getActiveTab().refresh(true);
                break;
            case this.rightMenuItemId:
                bot.hide();
                _1d0.add(_1cf);
                _1d0.show();
                _1d0.ownerCt.doLayout();
                btn.setIconClass("j-item-details-display-right");
                this.tabPanel.getActiveTab().refresh(true);
                break;
            case this.hideMenuItemId:
                _1cf.ownerCt.hide();
                _1cf.ownerCt.ownerCt.doLayout();
                btn.setIconClass("j-item-details-display-none");
                break;
        }
    }
},onRelateItemsToItem:function(_1d3, _1d4) {
    var _1d5 = [];
    var _1d6 = (_1d4.direction == "forward") ? true : false;
    for (var _1d7 = 0; _1d7 < _1d3.length; _1d7++) {
        var _1d8 = _1d3[_1d7];
        var _1d9 = null;
        if (_1d8 != this.data.getItemId()) {
            if (_1d6) {
                _1d9 = {toDocument:{id:_1d8},fromDocument:{id:this.data.getItemId()},associationType:(_1d4.type != null) ? {id:_1d4.type} : null};
            } else {
                _1d9 = {fromDocument:{id:_1d8},toDocument:{id:this.data.getItemId()},associationType:(_1d4.type != null) ? {id:_1d4.type} : null};
            }
            _1d5.push(_1d9);
        }
    }
    if (_1d5.length > 0) {
        relationshipSvc.saveRelationships({associations:_1d5}, this.onSuccessSaveRelationship.createDelegate(this));
    }
},onSuccessSaveRelationship:function() {
    var _1da = this.tabPanel.findById(this.myId("i-relationship-panel"));
    if (_1da.getXType() == "jx.panel.ItemRelationshipPanel") {
        _1da.refresh(false);
    }
},subscribeToItem:function(_1db, _1dc) {
    var sub = {scope:5,refId:this.data.item.id};
    if (_1dc) {
        subscriptionSvc.saveSubscription(sub, this.subCallback.createDelegate(this, ["on"]));
    } else {
        subscriptionSvc.deleteSubscription(sub, this.subCallback.createDelegate(this, ["off"]));
    }
},showWindow:function(_1de, _1df) {
    var e = {data:{project:this.data.project,item:this.data.item,itemType:"doc"},source:this,sourceEl:_1df.getEl(),xtype:_1de};
    this.getAppContext().fireEvent("showWindow", e);
},subCallback:function(_1e1) {
    this.getAppContext().showMessage("Success", "Email notification has been turned " + _1e1 + ".", this);
},emailItem:function() {
    var url = window.location.toString();
    var _1e3 = url.indexOf("?");
    if (_1e3 >= 0) {
        url = url.substr(0, _1e3);
    }
    var _1e4 = url.indexOf("#");
    if (_1e4 >= 0) {
        var re = /#/;
        url = url.replace(re, "");
    }
    var _1e6 = String.format("{0}?projectId={1}&docId={2}", url, this.data.getProjectId(), this.data.getItemId());
    var link = "mailto:?" + "subject=" + escape("Link to Contour item") + "&body=" + escape(_1e6);
    window.location.href = link;
},myId:function(id) {
    return this.id + "-" + id;
},openQuickReport:function() {
    jx.QuickReportData = this.data;
    window.open("velocityReport.req", null, "height=600,width=800,status=yes,toolbar=no,menubar=yes,location=yes,resizable=1,scrollbars=yes");
}});
Ext.reg("jx.panel.ItemPanel", jx.panel.ItemPanel);
jx.panel.ItemGridPanel = function(_1e9) {
    _1e9 = Ext.applyIf(_1e9, {});
    jx.panel.ItemGridPanel.superclass.constructor.call(this, _1e9);
};
Ext.extend(jx.panel.ItemGridPanel, jx.grid.ItemGrid, {data:null,showSubFolders:false,loadedId:null,refreshOnDataChange:true,singleRowChangeRefresh:function() {
    this.refresh(false);
},refresh:function(_1ea) {
    var data = this.data;
    var item = this.data.item;
    var _1ed = item.id;
    if ((this.refreshOnDataChange || !_1ea || !_1ed || _1ed != this.loadedId) && this.rendered) {
        this.loadedId = _1ed;
        if (data.itemType == "doc" && item.isFolder) {
            data.itemType = "folder";
        }
        switch (data.itemType) {
            case "tag":
                this.loadTagGrid(item.id);
                break;
            case "search":
                this.loadSearchGrid(data.project.id, item.name);
                break;
            case "filter":
                var self = this;
                filterSvc.getFilter(item.id, {callback:function(_1ef) {
                    self.tmpFilter = _1ef;
                },async:false});
                var _1f0 = data.project.id;
                var _1f1 = this.tmpFilter;
                _1f1.currentProjectId = _1f0;
                this.loadFilterGrid(this.tmpFilter, _1f0, {typeId:this.tmpFilter.typeId});
                break;
            case "folder":
                this.loadFolderGrid(this.showSubFolders, data.item.id, data.project.id);
                break;
            case "group":
                this.loadGroupGrid(this.showSubFolders, data.item.id, data.project.id, data.item.typeId);
                break;
            case "release":
                this.loadReleaseGrid(data.item.id, data.project.id);
                break;
        }
    }
    if (data.itemType && this.rendered) {
        this.mode = jx.grid.ModeMap[data.itemType];
        this.showButtons(this.mode);
    }
},initComponent:function() {
    var mm = jx.grid.ModeMap;
    var wa = jx.AclPermission.WRITEADMIN;
    var all = jx.AclPermission.ALL;
    this.actionMenuId = this.myId("actionMenu");
    Ext.apply(this, {tbar:[{xtype:"checkbox",listeners:{check:this.onToggleSubFolders,scope:this},mask:all,mode:mm.group + mm.folder},{xtype:"tbtext",text:"&nbsp;Include items in subfolders",mask:all,mode:mm.group + mm.folder},"->",{text:i18n.g("j.b.gridMenuOpen"),handler:this.showItem,scope:this,mask:all,mode:mm.all},{xtype:"tbseparator",mask:all,mode:mm.group + mm.folder},{split:false,text:i18n.g("j.b.gridMenuViews"),iconCls:"j-item-details-display-bottom",mode:mm.group + mm.folder,mask:all,menu:{width:150,items:[{text:i18n.g("j.b.gridMenuQuickReports"),iconCls:"j-quick-report-icon",handler:this.openQuickReport,scope:this}]}},{split:false,text:i18n.g("j.b.gridMenuEdit"),mask:wa,mode:mm.selected + mm.filter,menu:{id:this.actionMenuId,width:150,items:[{text:i18n.g("j.b.gridMenuCopy"),iconCls:"j-item-grid-copy-icon",handler:this.onCopySelected,scope:this,mask:wa,mode:mm.selected},{text:i18n.g("j.b.gridMenuUpdate"),iconCls:"j-item-grid-update-selected",handler:this.onUpdateSelected,scope:this,mask:wa,mode:mm.selected},{text:i18n.g("j.b.gridMenuDelete"),iconCls:"j-item-grid-delete-selected",handler:this.onDeleteSelected,scope:this,mask:wa,mode:mm.selected},{text:i18n.g("j.b.gridMenuUpdateAll"),iconCls:"j-item-grid-update-selected",handler:this.onUpdateAll,scope:this,mask:wa,mode:mm.filter},{text:i18n.g("j.b.gridMenuDeleteAll"),iconCls:"j-item-grid-delete-selected",handler:this.onDeleteAll,scope:this,mask:wa,mode:mm.filter}]}}]});
    this.on({dblclick:{fn:this.showItem,scope:this},rowclick:{fn:this.selectRow,scope:this},rowcontextmenu:{fn:this.onRowContextMenu,scope:this}});
    jx.panel.ItemGridPanel.superclass.initComponent.call(this);
    if (this.refreshOnDataChange) {
        this.data.on("dataChanged", this.refresh, this);
    }
},onRowContextMenu:function(grid, _1f6, e) {
    if (!this.actionMenu) {
        var _1f8 = jx.AclPermission.WRITEADMIN;
        this.actionMenu = new Ext.menu.Menu({items:[{text:i18n.g("j.b.itemPreview"),iconCls:"j-item-preview-icon",handler:function() {
            this.onPreviewItem(this.ctxRecord);
        },scope:this},{text:i18n.g("j.b.itemEdit"),iconCls:"j-item-edit-icon",handler:function() {
            this.editSelectedItem(this.ctxRecord);
        },scope:this,mask:_1f8},{text:i18n.g("j.b.itemDelete"),iconCls:"j-item-delete-icon",handler:function() {
            this.deleteSelectedItem(this.ctxRecord);
        },scope:this,mask:_1f8},{text:i18n.g("j.b.openInNewTab"),tooltip:i18n.g("j.tt.openInNewTab"),iconCls:"j-item-grid-open-selected",handler:function() {
            this.showItemInNewTab(this.ctxRecord, true);
        },scope:this}]});
        this.actionMenu.on("hide", this.onContextHide, this);
    }
    e.stopEvent();
    if (this.ctxRow) {
        Ext.fly(this.ctxRow).removeClass("x-node-ctx");
        this.ctxRow = null;
    }
    this.ctxRow = this.view.getRow(_1f6);
    this.ctxRecord = this.store.getAt(_1f6);
    Ext.fly(this.ctxRow).addClass("x-node-ctx");
    this.actionMenu.showButtons(this.data.project.getMask());
    this.actionMenu.showAt(e.getXY());
},onContextHide:function() {
    if (this.ctxRow) {
        Ext.fly(this.ctxRow).removeClass("x-node-ctx");
        this.ctxRow = null;
    }
},selectRow:function(grid, _1fa, e) {
    var _1fc = grid.getSelectionModel().getSelections();
    if (_1fc.length > 0) {
        this.showButtons(this.mode + jx.grid.ModeMap.selected);
    } else {
        this.showButtons(this.mode);
    }
},showButtons:function(mode) {
    var _1fe = this.data.project.getMask();
    var tb = this.getTopToolbar();
    tb.showButtons(_1fe, mode);
    var menu = Ext.menu.MenuMgr.get(this.actionMenuId);
    menu.showButtons(_1fe, mode);
},onToggleSubFolders:function(f) {
    this.showSubFolders = f.getValue();
    this.refresh();
},onDeleteAll:function(_202) {
    this.getAppContext().fireEvent("batchDelete", this.createUpdateEvent(this.filter, false));
},onDeleteSelected:function(_203) {
    this.updateSelected(_203, false);
},onUpdateAll:function(_204) {
    this.getAppContext().fireEvent("batchUpdate", this.createUpdateEvent(this.filter, false));
},onUpdateSelected:function(_205) {
    this.updateSelected(_205, true);
},onCopySelected:function(_206) {
    var _207 = this.getSelectionModel().getSelections();
    if (_207.length > 0) {
        var _208;
        var ids = [];
        var _20a = null;
        if (_207.length == 1) {
            _208 = _207[0];
            _20a = {documentType:{id:_208.data.typeId}};
            var e = {data:{project:this.data.project,item:{id:_208.id,name:_208.data.name,documentGroup:_20a,typeId:_208.data.typeId},itemType:"doc"},source:this,sourceEl:_206.getEl(),xtype:"jx.window.ItemCopyWindow"};
        } else {
            for (var i = 0,len = _207.length; i < len; i++) {
                _208 = _207[i];
                ids.push(_208.id);
            }
            _20a = {documentType:{id:_208.data.typeId}};
            this.data.item.documentGroup = _20a;
            var e = {data:{project:this.data.project,item:this.data.item,itemArr:ids,itemType:"multipledoc"},source:this,sourceEl:_206.getEl(),xtype:"jx.window.ItemCopyWindow"};
        }
        this.getAppContext().fireEvent("showWindow", e);
    } else {
        Ext.MessageBox.alert(i18n.g("j.m.warning"), i18n.g("j.m.noItemSelected"));
    }
},updateSelected:function(_20d, _20e) {
    var _20f = this.getSelectionModel().getSelections();
    if (_20f.length > 0) {
        var _210 = this.getUpdateFilter(_20f, _20e);
        if (_210) {
            this.getAppContext().fireEvent(_20e ? "batchUpdate" : "batchDelete", this.createUpdateEvent(_210, true));
        } else {
            Ext.MessageBox.alert(i18n.g("j.m.warning"), i18n.g("j.m.selectedMustHaveSameType"));
        }
    } else {
        Ext.MessageBox.alert(i18n.g("j.m.warning"), i18n.g("j.m.noItemSelected"));
    }
},showItem:function(grid, _212, e) {
    var _214 = this.getSelectionModel().getSelected();
    this.showItemInNewTab(_214, false);
},deleteSelectedItem:function(_215) {
    if (_215) {
        this.getAppContext().fireEvent("deleteItem", {sourceType:"grid",source:this,data:{project:this.data.project,item:{id:_215.id,name:_215.data.name}}});
    } else {
        Ext.MessageBox.alert(i18n.g("j.m.warning"), i18n.g("j.m.noItemSelected"));
    }
},showItemInNewTab:function(_216, _217) {
    if (_216) {
        this.getAppContext().fireEvent("showItem", {sourceType:"grid",source:this,data:{project:this.data.project,item:{id:_216.id,name:_216.data.name}},newTab:_217});
    } else {
        Ext.MessageBox.alert(i18n.g("j.m.warning"), i18n.g("j.m.noItemSelected"));
    }
},editSelectedItem:function(_218) {
    var e = {data:new jx.ItemData({item:_218.data,project:this.data.project}),source:this,sourceType:"grid",sourceEl:this.getEl()};
    this.getAppContext().fireEvent("editItem", e);
},onPreviewItem:function(_21a) {
    if (_21a) {
        this.getAppContext().fireEvent("showWindow", {sourceType:"grid",source:this,sourceEl:this.getEl(),xtype:"jx.window.ItemPreviewWindow",newWindow:false,data:{project:this.data.project,item:{id:_21a.id,name:_21a.data.name}}});
    } else {
        Ext.MessageBox.alert("Warning", "No item is selected.");
    }
},getUpdateFilter:function(_21b, _21c) {
    var _21d;
    var ids = [];
    var _21f = null;
    for (var i = 0,len = _21b.length; i < len; i++) {
        _21d = _21b[i];
        if (i == 0) {
            _21f = _21d.data.typeId;
        } else {
            if (_21c && _21d.data.typeId != _21f) {
                return null;
            }
        }
        ids.push(_21d.id);
    }
    var _221 = [{type:"integer",field:"id",paramValues:ids},{type:"boolean",field:"active",paramValues:["T"]}];
    var _222 = {name:"defaultFilter",typeId:_21c ? _21f : null,parameters:_221,currentProjectId:this.data.project.id};
    return _222;
},createUpdateEvent:function(_223, _224) {
    return {source:this,sourceType:"grid",data:{project:this.data.project,item:_223,itemType:_224 ? "selectedFilter" : "filter"}};
},render:function() {
    jx.panel.ItemGridPanel.superclass.render.apply(this, arguments);
    this.refresh();
},openQuickReport:function() {
    jx.QuickReportData = this.data;
    window.open("velocityReport.req", null, "height=600,width=800,status=yes,toolbar=no,menubar=yes,location=yes,resizable=1,scrollbars=yes");
},showGrid:function() {
    var data = {item:{id:this.data.item.id,name:this.data.item.name,typeId:this.data.item.typeId},itemType:"folder",project:this.data.project};
    this.getAppContext().fireEvent("showGrid", {data:data,source:this});
},myId:function(id) {
    return this.id + "-" + id;
}});
Ext.reg("jx.panel.ItemGridPanel", jx.panel.ItemGridPanel);
jx.panel.ItemFormPanel = function(_227) {
    jx.panel.ItemFormPanel.superclass.constructor.call(this, _227);
};
Ext.extend(jx.panel.ItemFormPanel, Ext.Panel, {itemForm:null,data:null,titleDiv:null,refresh:function() {
    if (!this.itemForm) {
        this.itemForm = this.createWidget();
    }
    this.itemForm.loadArtifact(this.data.getItemId());
},createWidget:function() {
    var _228 = this.getAppContext().getDayMonthYearFormat();
    var w = new jx.form.SimpleItemForm({showButtons:false,showTitle:false,defaultDateFormat:_228,listeners:{afterLoadArtifact:this.afterLoadArtifact,scope:this}});
    this.titleDiv = Ext.DomHelper.append(this.body, {tag:"div",html:""}, true);
    w.render(this.body);
    return w;
},afterLoadArtifact:function(item) {
    this.titleDiv.update("");
    this.getTpl().append(this.titleDiv, {display:item.documentGroup.display,description:"description",id:item.id,image:item.isFolder ? "class=\"j-folder-icon\"" : "class=\"j-item-icon\""});
    this.fireEvent("afterLoadArtifact", item);
},render:function(_22b) {
    jx.panel.ItemFormPanel.superclass.render.call(this, _22b);
    this.data.on({"dataChanged":this.refresh,scope:this});
    if (this.data.getItemId()) {
        this.refresh();
    }
},getTpl:function() {
    if (this.tpl) {
        return this.tpl;
    }
    var w = jx.panel.ItemFormPanel;
    if (!w.tplCache) {
        w.tplCache = new Ext.XTemplate("<table><tbody>", "<tr>", "<td nowrap align=\"left\" {image} width=\"10%\"><div class=\"j-set-header-title-left-item\">{display}</div></td>", "</tr>", "</tbody></table>");
    }
    return w.tplCache;
}});
Ext.reg("jx.panel.ItemFormPanel", jx.panel.ItemFormPanel);
jx.panel.ItemRelationshipPanel = function(_22d) {
    _22d = Ext.applyIf(_22d, {title:i18n.g("j-t-relationships")});
    jx.panel.ItemRelationshipPanel.superclass.constructor.call(this, _22d);
};
Ext.extend(jx.panel.ItemRelationshipPanel, Ext.Panel, {view:null,viewEast:null,viewWest:null,grid:null,data:null,loadedId:null,refresh:function(_22e) {
    var _22f = this.data.getItemId();
    if ((!_22e || _22f != this.loadedId) && this.rendered) {
        this.loadedId = _22f;
        this.viewEast.refreshView();
        this.viewWest.refreshView();
        this.grid.loadData([_22f,0,0,null]);
        this.toggleButtons(this.data.project.getMask());
    }
},toggleButtons:function(_230) {
    if (this.rendered) {
        this.getTopToolbar().showButtons(_230);
    }
},initComponent:function() {
    Ext.apply(this, {layout:"card",tbar:this.getTbar(),deferredRender:true,activeItem:0});
    jx.panel.ItemRelationshipPanel.superclass.initComponent.call(this);
},getTbar:function() {
    var wa = jx.AclPermission.WRITEADMIN;
    return ["->",{text:i18n.g("j-b-relationships-table-view"),tooltip:i18n.g("j-tt-relationships-table-view"),iconCls:"j-relationship-grid-icon",handler:this.showGrid,scope:this},"-",{text:i18n.g("j-b-relationships-visual-view"),tooltip:i18n.g("j-tt-relationships-visual-view"),iconCls:"j-relationship-view-icon",handler:this.showVisual,scope:this},"-",{text:i18n.g("j-b-relationships-impact"),tooltip:i18n.g("j-tt-relationships-impact"),iconCls:"j-relationship-impact-icon",handler:this.showImpact,scope:this},"-",{text:i18n.g("j.b.showMatrix"),iconCls:"j-project-matrix-icon",handler:this.showWindow.createDelegate(this, ["jx.window.TraceMatrixWindow"], 0),id:"p-matrix-button",scope:this},{xtype:"tbseparator",mask:wa},{text:i18n.g("j-b-relationships-open-relate"),tooltip:i18n.g("j-tt-relationships-open-relate"),iconCls:"j-relationship-open-tree-icon",handler:this.showRelationshipTree,scope:this,mask:wa}];
},showGrid:function() {
    this.layout.setActiveItem(this.grid.id);
},showWindow:function(_232, _233) {
    var e = {data:{project:this.data.project},source:this,sourceEl:_233.getEl(),xtype:_232};
    this.getAppContext().fireEvent("showWindow", e);
},showVisual:function() {
    this.layout.setActiveItem(this.view.id);
    this.view.doLayout();
},showImpact:function(_235) {
    var e = {data:{project:this.data.project,item:this.data.item},source:this,sourceEl:_235.getEl(),xtype:"jx.window.ImpactWindow"};
    this.getAppContext().fireEvent("showWindow", e);
},showRelationshipTree:function() {
    var e = {source:this,project:this.data.project};
    this.getAppContext().fireEvent("showRelationshipTree", e);
},render:function() {
    jx.panel.ItemRelationshipPanel.superclass.render.apply(this, arguments);
    var grid = new jx.grid.ItemRelationshipGrid({data:this.data,autoScroll:true,listeners:{refresh:{fn:this.refreshRelationshipViews,scope:this}}});
    this.add(grid);
    this.grid = grid;
    this.viewEast = new jx.view.ItemRelationshipView({data:this.data,direction:false,id:"p-relationship-view-left",columnWidth:0.45,listeners:{refreshRelationshipViews:{fn:this.refreshRelationshipViews,scope:this},afterLoadRelationships:{fn:this.doLayoutViews,scope:this},editRelationship:{fn:this.grid.editItem,scope:this.grid}}});
    this.viewWest = new jx.view.ItemRelationshipView({data:this.data,direction:true,id:"p-relationship-view-right",columnWidth:0.45,listeners:{refreshRelationshipViews:{fn:this.refreshRelationshipViews,scope:this},afterLoadRelationships:{fn:this.doLayoutViews,scope:this},editRelationship:{fn:this.grid.editItem,scope:this.grid}}});
    var view = new Ext.Panel({layout:"column",border:false,autoScroll:true,items:[this.viewEast,{html:"<div class=\"j-relate-center-text\"><div>Item</div><br><img src=\"img/32x32/file_32.gif\"/></div>",border:false,columnWidth:0.1},this.viewWest]});
    this.add(view);
    this.view = view;
    this.layout.setActiveItem(0);
    this.view.doLayout();
    this.doLayout();
    this.refresh(true);
},doLayoutViews:function() {
    this.view.doLayout();
},refreshRelationshipViews:function() {
    this.refresh(false);
}});
Ext.reg("jx.panel.ItemRelationshipPanel", jx.panel.ItemRelationshipPanel);
jx.panel.ItemCommentPanel = function(_23a) {
    _23a = Ext.applyIf(_23a, {title:i18n.g("j-t-comment")});
    jx.panel.ItemCommentPanel.superclass.constructor.call(this, _23a);
};
Ext.extend(jx.panel.ItemCommentPanel, Ext.Panel, {dialog:null,view:null,data:null,loadedId:null,refresh:function(_23b) {
    var _23c = this.data.getItemId();
    if ((!_23b || _23c != this.loadedId) && this.rendered) {
        this.loadedId = _23c;
        this.view.store.load({arg:[_23c]});
    }
},initComponent:function() {
    this.view = this.createView();
    Ext.apply(this, {tbar:this.getTbar(),autoScroll:true,items:this.view});
    jx.panel.ItemCommentPanel.superclass.initComponent.call(this);
},afterRender:function() {
    jx.panel.ItemCommentPanel.superclass.afterRender.call(this);
    this.doLayout();
    this.refresh(true);
},createView:function() {
    return new jx.view.CommentView({data:this.data,userId:this.getAppContext().user.id,listeners:{click:{fn:this.onClickItem,scope:this}}});
},getTbar:function() {
    return ["->",{text:i18n.g("j-b-comment-add"),iconCls:"j-comment-add-icon",tooltip:i18n.g("j-tt-comment-add"),handler:this.addItem,scope:this}];
},addItem:function() {
    var dlg = this.getDialog();
    dlg.show();
    dlg.setItem({});
},getDialog:function() {
    if (!this.dialog) {
        this.dialog = new jx.window.CommentWindow({title:"Add/Edit Comment",data:this.data,listeners:{afterSaveComment:{fn:this.refresh.createDelegate(this, [false], 0),scope:this}}});
        return this.dialog;
    }
    return this.dialog;
},onClickItem:function(view, _23f, item, e) {
    var _242 = view.el.dom;
    var _243 = this.view.store.getAt(_23f);
    var _244 = null;
    var link = e.getTarget("a", _242);
    if (link != null) {
        var _246 = link.className;
        if (_246.indexOf("j-action-") != -1) {
            _244 = _246.substr(9);
        }
    }
    this.onSelectItem(view, _23f, _243, e, _244);
},onSelectItem:function(view, _248, _249, e, _24b) {
    switch (_24b) {
        case "edit":
            this.editItem(_249);
            break;
        case "delete":
            this.deleteItem(_249);
            break;
    }
},editItem:function(_24c) {
    var dlg = this.getDialog();
    dlg.show();
    comments.getComment(_24c.id, dlg.setItem.createDelegate(dlg));
},deleteItem:function(_24e) {
    var _24f = "Are you sure you want to delete the comment?";
    Ext.MessageBox.confirm("Confirm", _24f, this.deleteItemConfirm.createDelegate(this, [_24e], 0));
},deleteItemConfirm:function(_250, _251) {
    if (_251 == "yes") {
        comments.deleteComment(_250.id, this.refresh.createDelegate(this));
    }
}});
Ext.reg("jx.panel.ItemCommentPanel", jx.panel.ItemCommentPanel);
jx.window.CommentWindow = function(_252) {
    this.panel = new Ext.Panel({margins:"3 3 3 0",autoScroll:true});
    _252 = Ext.applyIf(_252, {form:this.createForm(),modal:true,closable:true,closeAction:"hide",width:400,height:300,plain:true,layout:"fit",items:this.panel,buttons:[{text:"Save",handler:this.saveItem,scope:this},{text:"Close",handler:this.cancelEdit,scope:this}]});
    jx.window.CommentWindow.superclass.constructor.call(this, _252);
};
Ext.extend(jx.window.CommentWindow, Ext.Window, {data:null,render:function(_253) {
    jx.window.CommentWindow.superclass.render.call(this, _253);
    if (this.form) {
        this.form.render(this.panel.body);
    }
},createForm:function() {
    return new jx.form.JamaForm({formType:"editOnly",showButtons:false,showTitle:false,fieldDefinitions:this.getFormDefinitions()});
},getFormDefinitions:function() {
    return ([{field:"commentText",label:"Comment",dataType:"text",controlTypeId:6,labelAlign:"top",width:"100%",height:180}]);
},setItem:function(item) {
    this.form.setItem(item);
    this.form.project = this.data.project;
},saveItem:function() {
    var item = this.form.getUpdatedItem();
    item.documentId = this.data.getItemId();
    comments.saveComment(item, this.saveItemCallback.createDelegate(this));
},saveItemCallback:function(c) {
    this.fireEvent("afterSaveComment", this, c);
    this.cancelEdit();
},cancelEdit:function() {
    this.hide();
}});
jx.panel.ItemGridPanel = function(_257) {
    _257 = Ext.applyIf(_257, {});
    jx.panel.ItemGridPanel.superclass.constructor.call(this, _257);
};
Ext.extend(jx.panel.ItemGridPanel, jx.grid.ItemGrid, {data:null,showSubFolders:false,loadedId:null,refreshOnDataChange:true,singleRowChangeRefresh:function() {
    this.refresh(false);
},refresh:function(_258) {
    var data = this.data;
    var item = this.data.item;
    var _25b = item.id;
    if ((this.refreshOnDataChange || !_258 || !_25b || _25b != this.loadedId) && this.rendered) {
        this.loadedId = _25b;
        if (data.itemType == "doc" && item.isFolder) {
            data.itemType = "folder";
        }
        switch (data.itemType) {
            case "tag":
                this.loadTagGrid(item.id);
                break;
            case "search":
                this.loadSearchGrid(data.project.id, item.name);
                break;
            case "filter":
                var self = this;
                filterSvc.getFilter(item.id, {callback:function(_25d) {
                    self.tmpFilter = _25d;
                },async:false});
                var _25e = data.project.id;
                var _25f = this.tmpFilter;
                _25f.currentProjectId = _25e;
                this.loadFilterGrid(this.tmpFilter, _25e, {typeId:this.tmpFilter.typeId});
                break;
            case "folder":
                this.loadFolderGrid(this.showSubFolders, data.item.id, data.project.id);
                break;
            case "group":
                this.loadGroupGrid(this.showSubFolders, data.item.id, data.project.id, data.item.typeId);
                break;
            case "release":
                this.loadReleaseGrid(data.item.id, data.project.id);
                break;
        }
    }
    if (data.itemType && this.rendered) {
        this.mode = jx.grid.ModeMap[data.itemType];
        this.showButtons(this.mode);
    }
},initComponent:function() {
    var mm = jx.grid.ModeMap;
    var wa = jx.AclPermission.WRITEADMIN;
    var all = jx.AclPermission.ALL;
    this.actionMenuId = this.myId("actionMenu");
    Ext.apply(this, {tbar:[{xtype:"checkbox",listeners:{check:this.onToggleSubFolders,scope:this},mask:all,mode:mm.group + mm.folder},{xtype:"tbtext",text:"&nbsp;Include items in subfolders",mask:all,mode:mm.group + mm.folder},"->",{text:i18n.g("j.b.gridMenuOpen"),handler:this.showItem,scope:this,mask:all,mode:mm.all},{xtype:"tbseparator",mask:all,mode:mm.group + mm.folder},{split:false,text:i18n.g("j.b.gridMenuViews"),iconCls:"j-item-details-display-bottom",mode:mm.group + mm.folder,mask:all,menu:{width:150,items:[{text:i18n.g("j.b.gridMenuQuickReports"),iconCls:"j-quick-report-icon",handler:this.openQuickReport,scope:this}]}},{split:false,text:i18n.g("j.b.gridMenuEdit"),mask:wa,mode:mm.selected + mm.filter,menu:{id:this.actionMenuId,width:150,items:[{text:i18n.g("j.b.gridMenuCopy"),iconCls:"j-item-grid-copy-icon",handler:this.onCopySelected,scope:this,mask:wa,mode:mm.selected},{text:i18n.g("j.b.gridMenuUpdate"),iconCls:"j-item-grid-update-selected",handler:this.onUpdateSelected,scope:this,mask:wa,mode:mm.selected},{text:i18n.g("j.b.gridMenuDelete"),iconCls:"j-item-grid-delete-selected",handler:this.onDeleteSelected,scope:this,mask:wa,mode:mm.selected},{text:i18n.g("j.b.gridMenuUpdateAll"),iconCls:"j-item-grid-update-selected",handler:this.onUpdateAll,scope:this,mask:wa,mode:mm.filter},{text:i18n.g("j.b.gridMenuDeleteAll"),iconCls:"j-item-grid-delete-selected",handler:this.onDeleteAll,scope:this,mask:wa,mode:mm.filter}]}}]});
    this.on({dblclick:{fn:this.showItem,scope:this},rowclick:{fn:this.selectRow,scope:this},rowcontextmenu:{fn:this.onRowContextMenu,scope:this}});
    jx.panel.ItemGridPanel.superclass.initComponent.call(this);
    if (this.refreshOnDataChange) {
        this.data.on("dataChanged", this.refresh, this);
    }
},onRowContextMenu:function(grid, _264, e) {
    if (!this.actionMenu) {
        var _266 = jx.AclPermission.WRITEADMIN;
        this.actionMenu = new Ext.menu.Menu({items:[{text:i18n.g("j.b.itemPreview"),iconCls:"j-item-preview-icon",handler:function() {
            this.onPreviewItem(this.ctxRecord);
        },scope:this},{text:i18n.g("j.b.itemEdit"),iconCls:"j-item-edit-icon",handler:function() {
            this.editSelectedItem(this.ctxRecord);
        },scope:this,mask:_266},{text:i18n.g("j.b.itemDelete"),iconCls:"j-item-delete-icon",handler:function() {
            this.deleteSelectedItem(this.ctxRecord);
        },scope:this,mask:_266},{text:i18n.g("j.b.openInNewTab"),tooltip:i18n.g("j.tt.openInNewTab"),iconCls:"j-item-grid-open-selected",handler:function() {
            this.showItemInNewTab(this.ctxRecord, true);
        },scope:this}]});
        this.actionMenu.on("hide", this.onContextHide, this);
    }
    e.stopEvent();
    if (this.ctxRow) {
        Ext.fly(this.ctxRow).removeClass("x-node-ctx");
        this.ctxRow = null;
    }
    this.ctxRow = this.view.getRow(_264);
    this.ctxRecord = this.store.getAt(_264);
    Ext.fly(this.ctxRow).addClass("x-node-ctx");
    this.actionMenu.showButtons(this.data.project.getMask());
    this.actionMenu.showAt(e.getXY());
},onContextHide:function() {
    if (this.ctxRow) {
        Ext.fly(this.ctxRow).removeClass("x-node-ctx");
        this.ctxRow = null;
    }
},selectRow:function(grid, _268, e) {
    var _26a = grid.getSelectionModel().getSelections();
    if (_26a.length > 0) {
        this.showButtons(this.mode + jx.grid.ModeMap.selected);
    } else {
        this.showButtons(this.mode);
    }
},showButtons:function(mode) {
    var _26c = this.data.project.getMask();
    var tb = this.getTopToolbar();
    tb.showButtons(_26c, mode);
    var menu = Ext.menu.MenuMgr.get(this.actionMenuId);
    menu.showButtons(_26c, mode);
},onToggleSubFolders:function(f) {
    this.showSubFolders = f.getValue();
    this.refresh();
},onDeleteAll:function(_270) {
    this.getAppContext().fireEvent("batchDelete", this.createUpdateEvent(this.filter, false));
},onDeleteSelected:function(_271) {
    this.updateSelected(_271, false);
},onUpdateAll:function(_272) {
    this.getAppContext().fireEvent("batchUpdate", this.createUpdateEvent(this.filter, false));
},onUpdateSelected:function(_273) {
    this.updateSelected(_273, true);
},onCopySelected:function(_274) {
    var _275 = this.getSelectionModel().getSelections();
    if (_275.length > 0) {
        var _276;
        var ids = [];
        var _278 = null;
        if (_275.length == 1) {
            _276 = _275[0];
            _278 = {documentType:{id:_276.data.typeId}};
            var e = {data:{project:this.data.project,item:{id:_276.id,name:_276.data.name,documentGroup:_278,typeId:_276.data.typeId},itemType:"doc"},source:this,sourceEl:_274.getEl(),xtype:"jx.window.ItemCopyWindow"};
        } else {
            for (var i = 0,len = _275.length; i < len; i++) {
                _276 = _275[i];
                ids.push(_276.id);
            }
            _278 = {documentType:{id:_276.data.typeId}};
            this.data.item.documentGroup = _278;
            var e = {data:{project:this.data.project,item:this.data.item,itemArr:ids,itemType:"multipledoc"},source:this,sourceEl:_274.getEl(),xtype:"jx.window.ItemCopyWindow"};
        }
        this.getAppContext().fireEvent("showWindow", e);
    } else {
        Ext.MessageBox.alert(i18n.g("j.m.warning"), i18n.g("j.m.noItemSelected"));
    }
},updateSelected:function(_27b, _27c) {
    var _27d = this.getSelectionModel().getSelections();
    if (_27d.length > 0) {
        var _27e = this.getUpdateFilter(_27d, _27c);
        if (_27e) {
            this.getAppContext().fireEvent(_27c ? "batchUpdate" : "batchDelete", this.createUpdateEvent(_27e, true));
        } else {
            Ext.MessageBox.alert(i18n.g("j.m.warning"), i18n.g("j.m.selectedMustHaveSameType"));
        }
    } else {
        Ext.MessageBox.alert(i18n.g("j.m.warning"), i18n.g("j.m.noItemSelected"));
    }
},showItem:function(grid, _280, e) {
    var _282 = this.getSelectionModel().getSelected();
    this.showItemInNewTab(_282, false);
},deleteSelectedItem:function(_283) {
    if (_283) {
        this.getAppContext().fireEvent("deleteItem", {sourceType:"grid",source:this,data:{project:this.data.project,item:{id:_283.id,name:_283.data.name}}});
    } else {
        Ext.MessageBox.alert(i18n.g("j.m.warning"), i18n.g("j.m.noItemSelected"));
    }
},showItemInNewTab:function(_284, _285) {
    if (_284) {
        this.getAppContext().fireEvent("showItem", {sourceType:"grid",source:this,data:{project:this.data.project,item:{id:_284.id,name:_284.data.name}},newTab:_285});
    } else {
        Ext.MessageBox.alert(i18n.g("j.m.warning"), i18n.g("j.m.noItemSelected"));
    }
},editSelectedItem:function(_286) {
    var e = {data:new jx.ItemData({item:_286.data,project:this.data.project}),source:this,sourceType:"grid",sourceEl:this.getEl()};
    this.getAppContext().fireEvent("editItem", e);
},onPreviewItem:function(_288) {
    if (_288) {
        this.getAppContext().fireEvent("showWindow", {sourceType:"grid",source:this,sourceEl:this.getEl(),xtype:"jx.window.ItemPreviewWindow",newWindow:false,data:{project:this.data.project,item:{id:_288.id,name:_288.data.name}}});
    } else {
        Ext.MessageBox.alert("Warning", "No item is selected.");
    }
},getUpdateFilter:function(_289, _28a) {
    var _28b;
    var ids = [];
    var _28d = null;
    for (var i = 0,len = _289.length; i < len; i++) {
        _28b = _289[i];
        if (i == 0) {
            _28d = _28b.data.typeId;
        } else {
            if (_28a && _28b.data.typeId != _28d) {
                return null;
            }
        }
        ids.push(_28b.id);
    }
    var _28f = [{type:"integer",field:"id",paramValues:ids},{type:"boolean",field:"active",paramValues:["T"]}];
    var _290 = {name:"defaultFilter",typeId:_28a ? _28d : null,parameters:_28f,currentProjectId:this.data.project.id};
    return _290;
},createUpdateEvent:function(_291, _292) {
    return {source:this,sourceType:"grid",data:{project:this.data.project,item:_291,itemType:_292 ? "selectedFilter" : "filter"}};
},render:function() {
    jx.panel.ItemGridPanel.superclass.render.apply(this, arguments);
    this.refresh();
},openQuickReport:function() {
    jx.QuickReportData = this.data;
    window.open("velocityReport.req", null, "height=600,width=800,status=yes,toolbar=no,menubar=yes,location=yes,resizable=1,scrollbars=yes");
},showGrid:function() {
    var data = {item:{id:this.data.item.id,name:this.data.item.name,typeId:this.data.item.typeId},itemType:"folder",project:this.data.project};
    this.getAppContext().fireEvent("showGrid", {data:data,source:this});
},myId:function(id) {
    return this.id + "-" + id;
}});
Ext.reg("jx.panel.ItemGridPanel", jx.panel.ItemGridPanel);
jx.panel.WhatsNewPanel = function(_295) {
    _295 = Ext.applyIf(_295, {title:i18n.g("j.l.whatsNew"),tbar:this.getTbar()});
    jx.panel.WhatsNewPanel.superclass.constructor.call(this, _295);
};
Ext.extend(jx.panel.WhatsNewPanel, Ext.Panel, {data:null,view:null,loadedId:null,initComponent:function() {
    jx.panel.WhatsNewPanel.superclass.initComponent.call(this);
},refresh:function(_296) {
    var _297 = this.data.getProjectId();
    if ((!_296 || _297 != this.loadedId) && this.rendered) {
        this.loadedId = _297;
        this.view.store.load({arg:[{projectId:this.data.getProjectId()}],params:{start:0,limit:50}});
    }
},getTbar:function() {
    return [{iconCls:"j-project-refresh-icon",handler:this.refresh.createDelegate(this, [false]),tooltip:i18n.g("j.tt.refreshWhatsNew"),id:"p-tree-refresh-button",scope:this}];
},onEventClick:function(view, _299, node, e) {
    var _29c = this.data.project;
    var item = view.store.data.items[_299].data;
    this.showItem(_29c, item, node, false);
},showItem:function(_29e, item, node, _2a1) {
    var ctx = this.getAppContext();
    ctx.fireEvent("showItem", {sourceType:"grid",source:this,data:{project:_29e,item:{id:item.itemId,name:item.itemName}},newTab:_2a1});
},render:function() {
    jx.panel.WhatsNewPanel.superclass.render.apply(this, arguments);
    var view = new jx.view.WhatsNewView({data:this.data,listeners:{click:{fn:this.onEventClick,scope:this}}});
    view.render(this.body);
    this.view = view;
    this.refresh(true);
}});
Ext.reg("jx.panel.WhatsNewPanel", jx.panel.WhatsNewPanel);
jx.panel.ProjectDashboardPanel = function(_2a4) {
    _2a4 = Ext.applyIf(_2a4, {title:i18n.g("j.l.dashboardTab")});
    jx.panel.ProjectDashboardPanel.superclass.constructor.call(this, _2a4);
};
Ext.extend(jx.panel.ProjectDashboardPanel, Ext.Panel, {data:null,view:null,loadedId:null,initComponent:function() {
    jx.panel.ProjectDashboardPanel.superclass.initComponent.call(this);
},refresh:function(_2a5) {
    var _2a6 = this.data.getProjectId();
    if ((!_2a5 || _2a6 != this.loadedId) && this.rendered) {
        this.loadedId = _2a6;
    }
},render:function() {
    jx.panel.ProjectDashboardPanel.superclass.render.apply(this, arguments);
}});
Ext.reg("jx.panel.ProjectDashboardPanel", jx.panel.ProjectDashboardPanel);
jx.panel.SearchPanel = function(_2a7) {
    jx.panel.SearchPanel.superclass.constructor.call(this, _2a7);
};
Ext.extend(jx.panel.SearchPanel, Ext.Panel, {filterListView:null,data:null,dialog:null,disabled:false,id:"o-search-panel",initComponent:function() {
    Ext.apply(this, {autoScroll:true,width:400,tbar:this.getTbar()});
    this.data.on("dataChanged", this.onDataChanged, this, {single:true});
    jx.panel.SearchPanel.superclass.initComponent.call(this);
},getTbar:function() {
    return ["->",{id:"o-search-field",xtype:"textfield",name:"searchString",anchor:"100%",emptyText:i18n.g("j.b.search"),listeners:{specialKey:this.onSpecialKey,scope:this},disabled:true},{id:"o-search-button",iconCls:"j-header-search-icon",tooltip:i18n.g("j.tt.search"),handler:this.onSearch,scope:this,disabled:true}];
},showSearch:function() {
    if (!this.searchDialog) {
        this.searchDialog = new jx.window.SearchWindow({data:this.data});
    }
    this.searchDialog.show();
    this.searchDialog.alignTo(this.getEl(), "tl-bl", [0,0], true);
},showWindow:function(_2a8, _2a9) {
    var e = {data:{project:this.data.project},source:this,sourceEl:_2a9.getEl(),xtype:_2a8};
    this.getAppContext().fireEvent("showWindow", e);
},showAdvanced:function() {
    alert("showAdvanced");
},afterRender:function() {
    jx.panel.SearchPanel.superclass.afterRender.call(this);
},onSpecialKey:function(_2ab, _2ac) {
    if (_2ac.getKey() == Ext.EventObject.RETURN) {
        var _2ad = _2ab.getValue();
        this.search(_2ad);
    }
},onSearch:function() {
    var _2ae = Ext.getCmp("o-search-field").getValue();
    this.search(_2ae);
},search:function(_2af) {
    if (_2af) {
        var data = {item:{name:_2af},itemType:"search",project:this.data.project};
        this.getAppContext().fireEvent("showGrid", {data:data,source:this});
    }
},onDataChanged:function() {
    this.getTopToolbar().items.each(function(item) {
        item.enable();
    });
    var c = Ext.getCmp("o-search-field").enable();
}});
Ext.reg("jx.panel.SearchPanel", jx.panel.SearchPanel);
jx.panel.LogoutPanel = function(_2b3) {
    jx.panel.LogoutPanel.superclass.constructor.call(this, _2b3);
};
Ext.extend(jx.panel.LogoutPanel, Ext.Panel, {filterListView:null,data:null,dialog:null,id:"o-logout-panel",initComponent:function() {
    Ext.apply(this, {autoScroll:true,width:525,border:false,tbar:this.getTbar()});
    this.data.on("dataChanged", this.onDataChanged, this, {single:true});
    jx.panel.LogoutPanel.superclass.initComponent.call(this);
},getTbar:function() {
    return [{id:"o-myprofile-button",text:"Welcome " + this.getAppContext().user.firstName.toString() + " (Edit Profile)",tooltip:i18n.g("j.tt.myProfile"),handler:this.showMyProfileWindow,scope:this,mask:jx.AclPermission.ALL},{id:"o-help-button",text:i18n.g("j.b.help"),tooltip:i18n.g("j.tt.help"),iconCls:"j-header-help-icon",handler:this.showHelp,scope:this,mask:jx.AclPermission.ALL},{id:"o-orgadmin-button",text:i18n.g("j.b.admin"),tooltip:i18n.g("j.tt.admin"),iconCls:"j-header-admin-icon",handler:this.showWindow.createDelegate(this, ["jx.window.OrgAdminWindow",false], 0),scope:this,mask:jx.AclPermission.ORGADMIN},{id:"o-report-button",text:i18n.g("j.b.report"),tooltip:i18n.g("j.tt.report"),iconCls:"j-header-report-icon",handler:this.showWindow.createDelegate(this, ["jx.window.ProjectReportWindow",true], 0),scope:this,disabled:true,mask:jx.AclPermission.ALL},"->",{id:"o-logout-button",text:i18n.g("j.b.logout"),tooltip:i18n.g("j.tt.logout"),iconCls:"j-header-logout-icon",handler:this.logout,scope:this,mask:jx.AclPermission.ALL}];
},showMyProfileWindow:function(_2b4) {
    if (!this.profileDialog) {
        this.profileDialog = new jx.window.MyProfileWindow({data:this.data,cancelAction:"hide",closeAction:"hide"});
    }
    this.profileDialog.show(_2b4.getEl());
},showOrgAdmin:function(_2b5) {
    var org = new jx.window.OrgAdminWindow({});
    org.show(_2b5.getEl());
},afterRender:function() {
    jx.panel.LogoutPanel.superclass.afterRender.call(this);
    this.getTopToolbar().showButtons(this.getAppContext().isOrgAdmin() ? jx.AclPermission.ORGADMIN : jx.AclPermission.READ);
},logout:function() {
    window.location = "logout.req";
},showHelp:function(_2b7) {
    if (!this.helpDlg) {
        this.helpDlg = new jx.window.HelpWindow({closeAction:"hide",cancelAction:"hide"});
    }
    this.helpDlg.show(_2b7.getEl());
},showWindow:function(_2b8, _2b9, _2ba) {
    var e = {data:{project:this.data.project},source:this,sourceEl:_2ba.getEl(),xtype:_2b8,newWindow:_2b9};
    this.getAppContext().fireEvent("showWindow", e);
},onDataChanged:function() {
    this.getTopToolbar().items.each(function(item) {
        item.enable();
    });
}});
Ext.reg("jx.panel.LogoutPanel", jx.panel.LogoutPanel);
jx.panel.AdminLogoutPanel = function(_2bd) {
    jx.panel.AdminLogoutPanel.superclass.constructor.call(this, _2bd);
};
Ext.extend(jx.panel.AdminLogoutPanel, Ext.Panel, {filterListView:null,data:null,dialog:null,id:"o-logout-panel",initComponent:function() {
    Ext.apply(this, {autoScroll:true,border:false,tbar:this.getTbar()});
    this.data.on("dataChanged", this.onDataChanged, this, {single:true});
    jx.panel.AdminLogoutPanel.superclass.initComponent.call(this);
},getTbar:function() {
    return [{id:"o-myprofile-button",text:"Welcome " + this.getAppContext().user.firstName.toString() + " (Edit Profile)",tooltip:i18n.g("j.tt.myProfile"),handler:this.showMyProfileWindow,scope:this,mask:jx.AclPermission.ALL},"->",{id:"o-logout-button",text:i18n.g("j.b.logout"),tooltip:i18n.g("j.tt.logout"),iconCls:"j-header-logout-icon",handler:this.logout,scope:this,mask:jx.AclPermission.ALL}];
},showMyProfileWindow:function(_2be) {
    if (!this.profileDialog) {
        this.profileDialog = new jx.window.MyProfileWindow({data:this.data,cancelAction:"hide",closeAction:"hide"});
    }
    this.profileDialog.show(_2be.getEl());
},afterRender:function() {
    jx.panel.AdminLogoutPanel.superclass.afterRender.call(this);
    this.getTopToolbar().showButtons(this.getAppContext().isOrgAdmin() ? jx.AclPermission.ORGADMIN : jx.AclPermission.READ);
},logout:function() {
    window.location = "logout.req";
},showHelp:function(_2bf) {
    var dlg = new jx.window.HelpWindow({});
    dlg.show(_2bf.getEl());
},onDataChanged:function() {
    this.getTopToolbar().items.each(function(item) {
        item.enable();
    });
}});
Ext.reg("jx.panel.AdminLogoutPanel", jx.panel.AdminLogoutPanel);
jx.panel.ReleaseTreePanel = function(_2c2) {
    project:
            null,_2c2 = Ext.applyIf(_2c2, {folderOnly:false,tbar:this.getTbar()});
    jx.panel.ReleaseTreePanel.superclass.constructor.call(this, _2c2);
};
Ext.extend(jx.panel.ReleaseTreePanel, jx.tree.ItemTree, {buttonEnabled:false,data:null,initComponent:function() {
    var ctx = this.getAppContext();
    jx.panel.ReleaseTreePanel.superclass.initComponent.call(this);
    ctx.on({afterSaveRelease:this.afterSaveRelease,afterDeleteRelease:this.afterDeleteRelease,scope:this});
    this.on({nodedragover:this.nodeDragOver,beforenodedrop:this.beforeNodeDrop,nodedrop:this.nodeDrop,contextmenu:this.onContextMenu,scope:this,click:{fn:this.onTreeNodeClick,scope:this}});
    this.data.on("dataChanged", this.refresh, this);
},afterSaveRelease:function(_2c4) {
    this.refresh();
    this.getAppContext().fireEvent("loadRelease", _2c4.id, _2c4.name);
},afterDeleteRelease:function() {
    this.refresh();
    this.getAppContext().fireEvent("showWhatsnew");
},refresh:function() {
    this.loadRelease(this.data.project);
    if (this.rendered) {
        this.toggleButtons();
    }
},toggleButtons:function() {
    this.getTopToolbar().showButtons(this.data.project.getMask());
},getTbar:function() {
    var wa = jx.AclPermission.WRITEADMIN;
    return [{text:i18n.g("j.b.addRelease"),tooltip:i18n.g("j.tt.addRelease"),iconCls:"j-item-add-icon",handler:this.addRelease,scope:this,mask:wa}];
},addRelease:function() {
    this.releaseFormWindow = new jx.window.ReleaseFormWindow({data:this.data});
    this.releaseFormWindow.show();
},getActionMenu:function() {
    if (!this.actionMenu) {
        this.actionMenu = new Ext.menu.Menu({items:[{text:i18n.g("j.b.openInNewTab"),tooltip:i18n.g("j.tt.openInNewTab"),iconCls:"j-set-add-icon",handler:this.showItemInNewTab,id:"p-itemtree-showItemInNewTab-menu",scope:this}]});
    }
    return this.actionMenu;
},beforeNodeDrop:function(e) {
    var _2c7 = e.source;
    var p = e.point;
    var _2c9 = null;
    var _2ca = e.target;
    var _2cb = (p == "append") ? e.target : e.target.parentNode;
    if (p != "append") {
        _2c9 = (p == "above") ? _2ca : _2ca.nextSibling;
    }
    e.targetParent = _2cb;
    e.refNode = _2c9;
    if (_2c7.grid && !e.dropNode) {
        var node = this.generateDropNode(e);
        e.dropNode = node;
        e.cancel = node.length < 1;
        node.parentExpanded = _2cb.isExpanded();
    }
    if (!e.cancel && _2c7.grid) {
        for (var i = 0,len = e.dropNode.length; i < len; i++) {
            var node = e.tree.getNodeById(e.dropNode[i].id);
            if (node) {
                node.parentNode.removeChild(node);
            }
        }
    }
    return;
},moveItems:function(e) {
    var _2cf = e.refNode;
    var _2d0 = e.targetParent;
    documentManager.moveItems(this.getNodeList(e.dropNode), null, _2d0.id, _2cf ? _2cf.id : null, {exceptionHandler:this.handleMoveException.createDelegate(this, [e], 0),async:false});
    if (e.source.grid && !e.dropNode.parentExpanded) {
        _2d0.reload();
    }
},handleMoveException:function(e, msg, ex) {
    e.cancel = true;
    this.getAppContext().fireEvent("showMessage", "Error", msg);
},getNodeList:function(_2d4) {
    var _2d5 = [];
    if (_2d4 instanceof Array) {
        for (var i = 0,len = _2d4.length; i < len; i++) {
            _2d5.push(_2d4[i].id);
        }
    } else {
        _2d5.push(_2d4.id);
    }
    return _2d5;
},nodeDrop:function(e) {
    if (e.source.tree) {
        this.moveItems(e);
        this.getAppContext().fireEvent("showMessage", "Success", "Item {0} moved", e.dropNode.text);
    } else {
        if (e.source.grid) {
            this.moveItems(e);
            this.getAppContext().fireEvent("showMessage", "Success", "{0} selected item(s) moved", e.dropNode.length);
            e.source.grid.fireEvent("itemsMoved", "artifact");
        }
    }
},nodeDragOver:function(e) {
    var _2d9 = e.source;
    var _2da = (e.point == "append") ? e.target : e.target.parentNode;
    if (_2d9.tree) {
        var _2db = e.dropNode;
        return (_2db.id.charAt(0) == "a" && _2da.id.charAt(0) == "r");
    } else {
        if (_2d9.grid) {
            return (_2da.id.charAt(0) == "r");
        }
    }
},generateDropNode:function(e) {
    var s = e.data.selections,r = [];
    var _2de = this.data.project.getShowIdInTree();
    for (var i = 0,len = s.length; i < len; i++) {
        var data = s[i].data;
        var text = data.name;
        var icon = data.isFolder ? "img/silk/folder.png" : "img/silk/page_white_text.png";
        var _2e3 = data.typeId;
        r.push(new Ext.tree.AsyncTreeNode({allowDrop:false,text:_2de ? data.documentKey + " " + text : text,leaf:data.isFolder ? false : true,id:"a-" + s[i].id,icon:icon,typeId:_2e3}));
    }
    return r;
},findMe:function(e) {
    var item = e.data.item;
    if (item) {
        documentManager.getPath(item.id, this.reloadPath.createDelegate(this));
    }
},reloadPath:function(path) {
    if (!path) {
        return;
    }
    var pos = path.lastIndexOf("/");
    if (pos > 0) {
        var _2e8 = path.substr(0, pos);
        this.selectPath(_2e8, null, this.selectPathCallback.createDelegate(this, [path], true));
    }
},selectPathCallback:function(_2e9, node, path) {
    if (_2e9 && node) {
        node.reload(this.selectPath.createDelegate(this, [path]));
    }
},onTreeNodeDblClick:function(node) {
    this.dblClick = true;
    this.nodeClick(node, true);
},onTreeNodeClick:function(node) {
    if (this.dblClick) {
        this.dblClick = false;
    } else {
        this.nodeClick(node, false);
    }
},onContextMenu:function(node, e) {
    var _2f0 = e.getXY();
    if (node.id.charAt(0) == "a") {
        this.ctxMenuNode = node;
        this.getActionMenu().showAt([_2f0[0],_2f0[1]]);
    }
},nodeClick:function(node, _2f2) {
    var ctx = this.getAppContext();
    var _2f4 = node.id;
    var id = parseInt(_2f4.substring(2));
    switch (_2f4.charAt(0)) {
        case "p":
            break;
        case "a":
            this.showItem(ctx, this.data.project, id, node, _2f2);
            break;
        case "g":
            break;
        case "r":
            this.showRelease(ctx, this.data.project, id, node, _2f2);
            break;
        default:
            break;
    }
},showItemInNewTab:function() {
    var node = this.ctxMenuNode;
    if (node) {
        var ctx = this.getAppContext();
        var _2f8 = node.id;
        var id = parseInt(_2f8.substring(2));
        this.showItem(ctx, this.data.project, id, node, true);
    }
},showItem:function(ctx, _2fb, id, node, _2fe) {
    ctx.fireEvent("showItem", {sourceType:"tree",source:this,node:node,data:{project:_2fb,item:{id:id,name:node.text}},newTab:_2fe});
},showRelease:function(ctx, _300, id, node, _303) {
    var data = {item:{id:id,name:node.text},itemType:"release",project:this.data.project};
    this.getAppContext().fireEvent("showGrid", {data:data,source:this});
}});
Ext.reg("jx.panel.ReleaseTreePanel", jx.panel.ReleaseTreePanel);
jx.panel.TagListPanel = function(_305) {
    _305 = Ext.applyIf(_305, {autoScroll:true});
    jx.panel.TagListPanel.superclass.constructor.call(this, _305);
};
Ext.extend(jx.panel.TagListPanel, Ext.Panel, {data:null,tagStore:null,tagCloud:null,refresh:function() {
    if (this.data && this.data.getProjectId() && this.rendered) {
        this.tagStore.load({arg:[this.data.getProjectId(),true]});
        this.toggleButtons();
    }
},toggleButtons:function() {
    this.getTopToolbar().showButtons(this.data.project.getMask());
},initComponent:function() {
    Ext.apply(this, {tbar:this.getTbar()});
    jx.panel.TagListPanel.superclass.initComponent.call(this);
},afterRender:function() {
    jx.panel.TagListPanel.superclass.afterRender.call(this);
    this.tagStore = jx.data.StoreFactory.buildProjectTagStore();
    this.tagCloud = this.createTagCloud(this.tagStore);
    this.tagCloud.render(this.body);
    this.refresh();
},createTagCloud:function(_306) {
    var _307 = new Ext.ux.TagCloud({store:_306,displayField:"tagName",weightField:"count",loadMask:false,displayWeight:true});
    _307.on("tagselect", this.loadTagResults, this);
    return _307;
},getTbar:function() {
    var wa = jx.AclPermission.WRITEADMIN;
    return [{text:i18n.g("j.b.addTag"),tooltip:i18n.g("j.tt.addTag"),iconCls:"j-tag-add-icon",handler:this.addTag,scope:this,mask:wa},"->",{text:i18n.g("j.b.viewTagCloud"),tooltip:i18n.g("j.tt.viewTagCloud"),iconCls:"j-tag-cloud-icon",handler:this.showAsCloud,scope:this},"-",{text:i18n.g("j.b.viewTagList"),tooltip:i18n.g("j.tt.viewTagList"),iconCls:"j-tag-list-icon",handler:this.showAsList,scope:this},"-",{iconCls:"j-refresh-icon",tooltip:i18n.g("j.tt.refresh"),handler:this.refresh,scope:this}];
},loadTagResults:function(_309, _30a, _30b) {
    if (_30a) {
        selectedRecord = _30a;
        var data = {item:{id:_30a.data.id,name:_30a.data.tagName},itemType:"tag",project:this.data.project};
        this.getAppContext().fireEvent("showGrid", {data:data,source:this});
    }
},showAsCloud:function() {
    this.tagCloud.showAsList = false;
    this.refresh();
},showAsList:function() {
    this.tagCloud.showAsList = true;
    this.refresh();
},addTag:function() {
    this.editRecord = null;
    var d = this.getDialog();
    d.editTag({}, this.data.project);
},editTag:function() {
    var d = this.getDialog();
    if (this.selectedRecord) {
        this.editRecord = this.selectedRecord;
        d.editTag({id:this.editRecord.id,tagName:this.editRecord.data.tagName}, this.data.project);
    } else {
        Ext.MessageBox.alert("Warning", "No tag is selected");
    }
},afterSaveTag:function(form, tag) {
    this.refresh();
    this.getDialog().onCancel();
},getDialog:function() {
    if (!this.dialog) {
        this.dialog = new jx.window.TagFormWindow({listeners:{afterSaveTag:this.afterSaveTag,scope:this}});
    }
    this.dialog.show();
    this.dialog.alignTo(this.getEl(), "tl-tl", [5,30], true);
    return this.dialog;
},beforeDestroy:function() {
    this.dialog && Ext.destroy(this.dialog);
    jx.panel.TagListPanel.superclass.beforeDestroy.apply(this, arguments);
}});
Ext.reg("jx.panel.TagListPanel", jx.panel.TagListPanel);
jx.panel.ItemTagPanel = function(_311) {
    _311 = Ext.applyIf(_311, {title:"Tags"});
    jx.panel.ItemTagPanel.superclass.constructor.call(this, _311);
};
Ext.extend(jx.panel.ItemTagPanel, Ext.Panel, {data:null,loadedId:null,dialog:null,refresh:function(_312) {
    var _313 = this.data.getItemId();
    if ((!_312 || _313 != this.loadedId) && this.rendered) {
        this.loadedId = _313;
        this.tagView.store.load({arg:[this.data.item.id]});
        if (this.dialog) {
            this.dialog.refreshTagView();
        }
        this.toggleButtons(this.data.project.getMask());
    }
},toggleButtons:function(_314) {
    if (this.rendered) {
        this.getTopToolbar().showButtons(_314);
    }
},simpleRefresh:function() {
    this.tagView.store.load({arg:[this.data.item.id]});
},initComponent:function() {
    var wa = jx.AclPermission.WRITEADMIN;
    Ext.apply(this, {layout:"fit",items:this.createView(),tbar:["->",{text:i18n.g("j.b.itemTagAddEdit"),iconCls:"j-tag-add-icon",handler:this.addItem,scope:this,mask:wa}]});
    jx.panel.ItemTagPanel.superclass.initComponent.call(this);
},addItem:function() {
    var dlg = this.getDialog();
    dlg.show();
},getDialog:function() {
    if (!this.dialog) {
        this.dialog = new jx.window.ItemTagFormWindow({title:i18n.g("j.l.itemTagWindowTitle"),data:this.data,listeners:{afterSaveTag:{fn:this.refresh.createDelegate(this, [false], 0),scope:this},refreshItemTagTab:{fn:this.simpleRefresh.createDelegate(this),scope:this}}});
        return this.dialog;
    }
    return this.dialog;
},clickTag:function(view, _318) {
    var _319 = view.store.getAt(_318);
    if (_319) {
        var data = {item:{id:_319.data.tag.id,name:_319.data.tag.tagName},itemType:"tag",project:this.data.project};
        this.getAppContext().fireEvent("showGrid", {data:data,source:this});
    }
},createView:function() {
    var _31b = jx.data.StoreFactory.buildItemTagStore();
    this.tagView = new Ext.DataView({emptyText:i18n.g("j.l.itemTagNoTagText"),tpl:this.getTemplate(),selectedClass:"j-tag-selected",store:_31b,itemSelector:"span.j-item-tag-span",listeners:{"click":this.clickTag,scope:this}});
    return this.tagView;
},getTemplate:function() {
    return new Ext.XTemplate("<div><div class=\"j-tag-tab-panel\"><tpl for=\".\">", "{[xindex > 1 ? \"&nbsp;|&nbsp;\" : \"\"]}", "<span class=\"j-item-tag-span\">", "<a href=\"javascript:void(0);\">{[values.tag.tagName]}</a>", "</span>", "</tpl></div></div>");
}});
Ext.reg("jx.panel.ItemTagPanel", jx.panel.ItemTagPanel);
jx.window.ItemTagFormWindow = function(_31c) {
    _31c = Ext.applyIf(_31c, {width:600,height:400,modal:false,closable:true,closeAction:"hide",cancelAction:"hide",maximizable:true,minimizable:false,layout:"fit",items:{xtype:"panel",id:"i-tag-panel-window",layout:"border",items:[{region:"center",id:"i-tag-list-window",xtype:"jx.panel.ItemTagListPanel",listeners:{afterSaveNewTag:{fn:this.refreshTagView,scope:this}},data:_31c.data},{region:"east",width:300,split:true,xtype:"panel",layout:"fit",items:[{xtype:"jx.view.ItemTagView",data:_31c.data,id:"i-tag-view-window",listeners:{afterRemoveTag:{fn:this.afterRemoveTag,scope:this}}}]}]},buttons:[{text:i18n.g("j.b.itemTagWindowClose"),handler:this.onCancel,scope:this}]});
    jx.window.ItemTagFormWindow.superclass.constructor.call(this, _31c);
};
Ext.extend(jx.window.ItemTagFormWindow, Ext.Window, {data:null,refreshTagView:function() {
    var view = this.findById("i-tag-view-window");
    view.refreshTagView();
    var _31e = this.findById("i-tag-list-window");
    _31e.refresh();
    this.fireEvent("refreshItemTagTab");
},afterRemoveTag:function() {
    var _31f = this.findById("i-tag-list-window");
    _31f.refresh();
    this.fireEvent("refreshItemTagTab");
},onSave:function(_320) {
    this.fireEvent("saveTag", this);
}});
jx.view.ItemTagView = function(_321) {
    var _322 = jx.data.StoreFactory.buildItemTagStore();
    _321 = Ext.applyIf(_321, {store:_322,tpl:this.getTemplate(),title:"Click to remove",overClass:"j-item-tag-view-overr",emptyText:i18n.g("j.m.noTags"),itemSelector:"div.itemTagBox"});
    jx.view.ItemTagView.superclass.constructor.call(this, _321);
};
Ext.extend(jx.view.ItemTagView, Ext.DataView, {getTemplate:function() {
    return new Ext.XTemplate("<tpl for=\".\">", "<div class=\"itemTagBox x-cloud-list-item\" ><a href=\"javascript:void(0)\">{[values.tag.tagName]}</a></div>", "</tpl>");
},refreshTagView:function() {
    this.store.load({arg:[this.data.getItemId()]});
},render:function() {
    jx.view.ItemTagView.superclass.render.apply(this, arguments);
    this.store.load({arg:[this.data.getItemId()]});
    this.on("click", this.removeTag, this);
},removeTag:function(view, _324, item, e) {
    var _327 = this.store.getAt(_324);
    tagSvc.removeDocumentTag({id:_327.id}, this.onSuccessRemoveTag.createDelegate(this));
},onSuccessRemoveTag:function() {
    this.store.load({arg:[this.data.getItemId()]});
    this.fireEvent("afterRemoveTag");
}});
Ext.reg("jx.view.ItemTagView", jx.view.ItemTagView);
jx.panel.ItemTagListPanel = function(_328) {
    _328 = Ext.applyIf(_328, {autoScroll:true});
    jx.panel.ItemTagListPanel.superclass.constructor.call(this, _328);
};
Ext.extend(jx.panel.ItemTagListPanel, jx.panel.TagListPanel, {data:null,loadTagResults:function(_329, _32a, _32b) {
    var _32c = {tag:{id:_32a.id},document:{id:this.data.getItemId()}};
    tagSvc.saveDocumentTagProjectScope(_32c, this.afterSaveTag.createDelegate(this));
},afterSaveDocumentTag:function() {
    this.fireEvent("afterSaveNewTag");
},afterSaveTag:function() {
    this.fireEvent("afterSaveNewTag");
},saveTagCallback:function(tag) {
    var _32e = {tag:tag,document:{id:this.data.getItemId()}};
    tagSvc.saveDocumentTagProjectScope(_32e, this.afterSaveTag.createDelegate(this));
    jx.panel.ItemTagListPanel.superclass.saveTagCallback.apply(this, arguments);
}});
Ext.reg("jx.panel.ItemTagListPanel", jx.panel.ItemTagListPanel);
jx.panel.GroupPanel = function(_32f) {
    _32f = Ext.applyIf(_32f, {});
    jx.panel.GroupPanel.superclass.constructor.call(this, _32f);
};
Ext.extend(jx.panel.GroupPanel, Ext.Panel, {groupForm:null,data:null,iconCls:"j-header-report-icon",notifyButton:null,getNotifyButton:function() {
    this.notifyButton = new Ext.menu.CheckItem({text:i18n.g("j.b.setSubscribe"),boxLabel:i18n.g("j.b.setSubscribe"),checked:this.data.group.notification,listeners:{checkchange:{fn:this.subscribeToItem,scope:this}}});
    return this.notifyButton;
},subscribeToItem:function(_330, _331) {
    var sub = {scope:4,refId:this.data.group.id};
    if (_331) {
        subscriptionSvc.saveSubscription(sub, this.subCallback.createDelegate(this, ["on"]));
    } else {
        subscriptionSvc.deleteSubscription(sub, this.subCallback.createDelegate(this, ["off"]));
    }
},defaultNotifyButton:function() {
    this.notifyButton.setChecked(this.data.group.notification, true);
},subCallback:function(_333) {
    this.getAppContext().showMessage("Success", "Email notification has been turned " + _333 + ".", this);
},refresh:function() {
    if (this.data.group.id) {
        documentManager.getDocumentGroup(this.data.group.id, this.afterLoadGroup.createDelegate(this));
        this.tagList.refresh();
        this.filterList.refresh();
        this.toggleButtons();
    }
},toggleButtons:function() {
    if (this.rendered) {
        var _334 = this.data.project.getMask();
        var _335 = this.items.itemAt(0);
        this.doLayout();
        if (_335.rendered) {
            _335.getTopToolbar().showButtons(_334);
            var menu = Ext.menu.MenuMgr.get(this.actionMenuId);
            menu.showButtons(_334);
        }
    }
},initComponent:function() {
    Ext.apply(this, {layout:"border",items:[{margins:"0 0 0 0",ctCls:"j-set-header-panel",border:false,region:"north",tbar:this.createGroupTb(),height:130},this.createPortal()]});
    jx.panel.GroupPanel.superclass.initComponent.call(this);
},createGroupTb:function() {
    this.actionMenuId = this.getId() + "-action-menu";
    var wa = jx.AclPermission.WRITEADMIN;
    return ["->",{split:false,text:i18n.g("j.l.setMenuViews"),menu:{id:this.propertyMenuId,cls:"reading-menu",width:150,items:[{text:i18n.g("j.b.setDisplayInGrid"),tooltip:i18n.g("j.tt.setDisplayInGrid"),iconCls:"j-set-show-grid-icon",handler:this.showGrid,scope:this}]}},{text:i18n.g("j.l.setMenuActions"),menu:new Ext.menu.Menu({id:this.actionMenuId,items:[this.getNotifyButton(),new Ext.menu.Separator({mask:wa}),{text:i18n.g("j.b.setImport"),iconCls:"j-project-import-icon",mask:wa,menu:new Ext.menu.Menu({items:[{text:i18n.g("j.b.setImportCSV"),tooltip:i18n.g("j.tt.setImportCSV"),iconCls:"j-project-import-csv-icon",handler:this.showWindow.createDelegate(this, ["jx.window.CsvImportWindow"], 0),id:"p-cvsimport-button",scope:this},{text:i18n.g("j.b.setImportWord"),tooltip:i18n.g("j.tt.setImportWord"),iconCls:"j-project-import-word-icon",handler:this.showWindow.createDelegate(this, ["jx.window.WordImportWindow"], 0),id:"p-wordimport-button",scope:this}]})}]})},{text:i18n.g("j.l.setMenuEdit"),tooltip:i18n.g("j.tt.editSet"),mask:wa,menu:{items:[{text:i18n.g("j.b.editSet"),tooltip:i18n.g("j.tt.editSet"),iconCls:"j-set-edit-icon",handler:this.onEditGroup,scope:this},"-",{text:i18n.g("j.b.deleteSet"),tooltip:i18n.g("j.tt.deleteSet"),iconCls:"j-set-delete-icon",handler:this.onDeleteGroup,scope:this}]}}];
},onEditGroup:function(_338) {
    var e = {data:this.data,source:this,sourceEl:_338};
    this.getAppContext().fireEvent("editGroup", e);
},onDeleteGroup:function(_33a) {
    var e = {data:this.data,source:this,sourceEl:_33a};
    this.getAppContext().fireEvent("deleteGroup", e);
},createWidget:function() {
    var _33c = this.getAppContext().getDayMonthYearFormat();
    var w = new jx.form.SimpleGroupForm({data:this.data,showButtons:false,showTitle:false,listeners:{onLoadGroup:this.afterLoadGroup,scope:this},defaultDateFormat:_33c});
    this.groupForm = w;
    return w;
},afterLoadGroup:function(_33e) {
    var body = this.items.itemAt(0).body;
    body.update("");
    this.getTpl().append(body, _33e);
    this.data.group = Ext.apply(this.data.group, _33e);
    this.setTabTitleAndImage(_33e.displayPlural, _33e.image);
    this.defaultNotifyButton();
},setGroupPanelIcon:function(_340) {
    var _341 = this.ownerCt.getTabEl(this);
    var span = Ext.fly(_341).child("span.x-tab-strip-text");
    span.applyStyles(String.format("background-image: url(img/tree/{0}) !important; background-repeat:no-repeat;", _340.image));
},createPortal:function() {
    var _343 = [{id:"gear",handler:function() {
        Ext.Msg.alert("Message", "The Settings tool was clicked.");
    }},{id:"close",handler:function(e, _345, _346) {
        _346.ownerCt.remove(_346, true);
    }}];
    this.gridLink = new Ext.ux.Portlet({title:"Link to Items",tools:_343,height:200,html:"<div class=\"j-section-header\"><a href=\"javascript:void(0)\">" + i18n.g("j.l.setViewItemsLink") + "</a></div>"});
    return {xtype:"portal",region:"center",border:false,margins:"0 0 0 0",items:[{columnWidth:0.5,style:"padding:30px 5px 10px 10px",items:[{title:i18n.g("j.l.setFiltersTitle"),autoScroll:true,height:400,items:{id:this.id + "-filterList",xtype:"jx.panel.FilterListPanel",data:this.data}}]},{columnWidth:0.5,style:"padding:30px 10px 10px 5px",items:[{title:"View Items",layout:"fit",height:90,listeners:{render:this.setLink,scope:this}},{title:i18n.g("j.l.setTagsTitle"),layout:"fit",height:300,items:{id:this.id + "-tagList",xtype:"jx.panel.TagListPanel",data:this.data}}]}]};
},setLink:function(_347) {
    _347.body.update("<div class=\"j-set-portal-link\"><a href=\"javascript:void(0)\">Open Items in List View</a></div>");
    var link = _347.body.child("div.j-set-portal-link");
    link.on("click", this.showGrid, this);
},setAddLink:function(_349) {
    _349.body.update("<div class=\"j-set-portal-link\"><a href=\"javascript:void(0)\">Add New Item</a></div>");
    var link = _349.body.child("div.j-set-portal-link");
    link.on("click", this.showGrid, this);
},showWindow:function(_34b, _34c) {
    var e = {data:this.data,source:this,sourceEl:_34c.getEl(),xtype:_34b};
    this.getAppContext().fireEvent("showWindow", e);
},showGrid:function() {
    var data = {item:{id:this.data.group.id,name:this.data.group.name,typeId:this.data.group.typeId},itemType:"group",project:this.data.project};
    this.getAppContext().fireEvent("showGrid", {data:data,source:this});
},render:function(_34f) {
    jx.panel.GroupPanel.superclass.render.call(this, _34f);
    this.data.on({"dataChanged":this.refresh,scope:this});
    this.filterList = Ext.getCmp(this.id + "-filterList");
    this.tagList = Ext.getCmp(this.id + "-tagList");
    this.refresh();
},getTpl:function() {
    if (this.tpl) {
        return this.tpl;
    }
    var w = jx.panel.GroupPanel;
    if (!w.tplCache) {
        w.tplCache = new Ext.XTemplate("<table><tbody>", "<tr>", "<td nowrap align=\"right\" width=\"10%\"><div class=\"j-set-header-title-left\">Set</div></td><td><div class=\"j-set-header-title-right\">{displayPlural}</div></td>", "</tr>", "</tbody></table>", "<div><table class=\"j-set-header-table\"><tbody>", "<tr>", "<td nowrap align=\"right\" width=\"10%\"><span class=\"j-text-bold\">Description:&nbsp;</span></td><td>{description}</td>", "</tr>", "<tr>", "<td nowrap align=\"right\"><span class=\"j-text-bold\">API ID:&nbsp;</span></td><td>{id}</td>", "</tr>", "</tbody></table></div>");
    }
    return w.tplCache;
}});
Ext.reg("jx.panel.GroupPanel", jx.panel.GroupPanel);
jx.panel.SuspectPanel = function(_351) {
    Ext.applyIf(_351, {bodyStyle:"padding:10px",autoScroll:true});
    jx.panel.SuspectPanel.superclass.constructor.call(this, _351);
};
Ext.extend(jx.panel.SuspectPanel, Ext.Panel, {data:null,all:null,project:null,itemSelector:"div.j-supect-head",emptyText:"<p>There are no supect links for this project</p>",gridList:[],refresh:function() {
    this.loadSuspects(this.project);
},loadSuspects:function(_352) {
    if (_352) {
        this.project = _352;
    }
    documentManager.getDocumentListWithSuspectLinks(this.project.id, this.fillTable.createDelegate(this));
},initComponent:function() {
    jx.panel.SuspectPanel.superclass.initComponent.call(this);
},fillTable:function(data) {
    this.data = data;
    this.body.update("");
    if (this.data.length == 0) {
        this.body.update(this.emptyText);
        return;
    }
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        this.createDocumentLink(item);
        this.createSuspectGrid(item);
    }
    this.all = this.body.query(this.itemSelector);
},createDocumentLink:function(item, cell) {
    var html = String.format("<div class=\"j-supect-head\"> <a href=\"javascript:void(0)\">{0}</a>" + "\"{1}\" was modified by {2} on {3}. The following may be affected:</div>", item.documentKey, item.name, item.modifiedBy, item.modifiedDate);
    Ext.DomHelper.append(this.body, html);
},createSuspectGrid:function(item) {
    if (item.documentTraceList != null) {
        var _35a = new jx.grid.SuspectGrid({data:item.documentTraceList,project:this.project,listeners:{showItem:this.showItem,afterClear:this.refresh,scope:this}});
        _35a.render(this.body);
        this.gridList.push(_35a);
    }
},afterRender:function() {
    jx.panel.SuspectPanel.superclass.afterRender.call(this);
    this.body.on({"click":this.onClick,scope:this});
},onClick:function(e) {
    var item = e.getTarget(this.itemSelector, this.el);
    if (item) {
        if (this.all) {
            var _35d = this.all.indexOf(item);
            var doc = this.data[_35d];
            this.showItem(doc.id, doc.name);
        }
    }
},showItem:function(_35f, _360, _361) {
    var _362 = this.project;
    if (_361 && _361 != this.project.id) {
        _362 = this.getAppContext().getProject(_361);
    }
    if (_362.getMask() == 0) {
        Ext.MessageBox.alert("Warning", "Sorry. You don't have access to this item");
    } else {
        this.fireEvent("showItem", {id:_35f,name:_360}, _362);
    }
},beforeDestroy:function() {
    jx.panel.SuspectPanel.superclass.beforeDestroy.apply(this, arguments);
    for (var i = 0,len = this.gridList.length; i < len; i++) {
        Ext.destroy(this.gridList[i]);
    }
}});
Ext.reg("jx.panel.SuspectPanel", jx.panel.SuspectPanel);
jx.grid.SuspectGrid = function(_364) {
    Ext.applyIf(_364, {fieldDefinitions:this.getListDefinitions(),data:[]});
    this.dataStore = this.buildImpactStore(_364.data);
    jx.grid.SuspectGrid.superclass.constructor.call(this, _364);
};
Ext.extend(jx.grid.SuspectGrid, jx.grid.SimpleGrid, {getListDefinitions:function() {
    return ([{field:"documentKey",renderer:this.documentKeyRenderer.createDelegate(this),label:"ID",width:"20%"},{field:"documentName",label:"Name",width:"20%"},{field:"documentGroup",label:"Group",width:"20%"},{field:"projectName",label:"Project",width:"20%"},{field:"action",renderer:this.actionRenderer.createDelegate(this),label:"Action",width:"20%"}]);
},documentKeyRenderer:function(_365, node, item) {
    return "<a href=\"javascript:void(0);\" class=\"j-action-show\">" + item.data.documentKey + "</a>";
    return item.data.documentKey;
},actionRenderer:function(_368, node, _36a) {
    return (this.project.getMask() & jx.AclPermission.WRITEADMIN) ? "<a href=\"javascript:void(0)\" class=\"j-action-clear\">Clear</a>" : "";
},buildImpactStore:function(data) {
    var _36c = [{name:"documentId",type:"int"},{name:"projectName",type:"string"},{name:"documentKey",type:"string"},{name:"documentName",type:"string"},{name:"documentGroup",type:"string"},{name:"traceId",type:"int"},{name:"projectAuthorized",type:"boolean"},{name:"projectId",type:"int"}];
    var _36d = new jx.data.SimpleListStore({id:"documentId",fields:_36c,data:data});
    return _36d;
},onSelectItem:function(view, _36f, _370, e, _372) {
    switch (_372) {
        case "clear":
            this.clearSuspect(_370.data.traceId, view);
            break;
        case "show":
            this.fireEvent("showItem", _370.data.documentId, _370.data.documentName, _370.data.projectId);
            break;
        default:
            break;
    }
},clearSuspect:function(_373, _374) {
    if (_373 != null) {
        var dtod = {id:_373};
        relationshipSvc.clearSuspectRelationship(dtod, this.clearSuspectCallback.createDelegate(this));
    }
},clearSuspectCallback:function() {
    this.fireEvent("afterClear");
},render:function() {
    jx.grid.SuspectGrid.superclass.render.apply(this, arguments);
    this.loadList();
},destroy:function() {
    jx.grid.SuspectGrid.superclass.destroy.apply(this, arguments);
},loadList:function() {
    this.dataStore.load();
}});
jx.panel.TraceMatrix = function(_376) {
    _376 = Ext.applyIf(_376, {valueMap:this.getValueMap(),tbar:this.createToolbar(),bodyStyle:"padding:10px",autoScroll:true});
    jx.panel.TraceMatrix.superclass.constructor.call(this, _376);
};
Ext.extend(jx.panel.TraceMatrix, Ext.Panel, {valueMap:null,project:null,leftGroup:null,leftNumber:null,rightGroup:null,rightNumber:null,traceWindow:null,itemWindow:null,documentGroupStore:null,selectedClass:"selected",selectedRow:null,load:function(_377) {
    this.project = _377;
    this.documentGroupStore.load({arg:[this.project.id]});
},onViewMatrix:function() {
    var that = this;
    var _379 = this.project ? this.project.id : null;
    var _37a = this.leftGroup.getValue();
    var _37b = this.leftNumber.getRawValue();
    var _37c = this.rightGroup.getValue();
    var _37d = this.rightNumber.getRawValue();
    if (_37a && _37c && _37b && _37d) {
        relationshipSvc.getMatrixBetweenGroups(_379, _37a, _37b, _37c, _37d, {callback:this.loadMatrix.createDelegate(this),async:true});
    }
},loadMatrix:function(_37e) {
    this.matrixData = this.parseMatrixData(_37e);
    this.selectedRow = null;
    this.body.update("");
    this.getTpl().append(this.body, this.matrixData);
},createToolbar:function() {
    this.documentGroupStore = jx.data.StoreFactory.buildDocumentGroupStore();
    this.leftGroup = this.createCombo();
    this.leftNumber = this.createNumberCombo();
    this.rightGroup = this.createCombo();
    this.rightNumber = this.createNumberCombo();
    return ["Left:&nbsp;",this.leftGroup,"&nbsp;Limit:&nbsp;",this.leftNumber,"->","Top:&nbsp;",this.rightGroup,"&nbsp;Limit:&nbsp;",this.rightNumber,{text:"View Matrix",cls:"x-btn-text",handler:this.onViewMatrix,scope:this}];
},createCombo:function() {
    var _37f = new Ext.form.ComboBox({store:this.documentGroupStore,displayField:"displayPlural",valueField:"id",mode:"local",triggerAction:"all",emptyText:"Select a set...",selectOnFocus:true,editable:false});
    return _37f;
},createNumberCombo:function() {
    var _380 = new Ext.data.SimpleStore({fields:["value"],data:[[5],[10],[15],[20],[25],[50],[75],[100],[150]]});
    var _381 = new Ext.form.ComboBox({store:_380,displayField:"value",valueField:"value",mode:"local",triggerAction:"all",emptyText:"Select a limit...",selectOnFocus:true,value:20,width:60,regex:/^\d+$/});
    return _381;
},onDblClick:function(e) {
    var _383 = e.getTarget("thead", this.el);
    if (_383) {
        var cell = e.getTarget("th");
        if (cell) {
            var item = this.matrixData.columns[cell.cellIndex];
            if (cell.cellIndex != 0) {
                this.showItem(item, cell);
            }
        }
    } else {
        var row = e.getTarget("tr");
        var cell = e.getTarget("td");
        if (row && cell) {
            var _387 = cell.cellIndex;
            var _388 = row.rowIndex;
            if (_387 == 0) {
                var item = this.matrixData.columns[_388];
                this.showItem(item, cell);
            } else {
                var _389 = this.matrixData.columns[_388];
                var _38a = this.matrixData.columns[_387];
                var _38b = this.matrixData.data[_388 - 1][_387];
                this.showTrace(_388, _387, _389, _38a, _38b, cell);
            }
        }
    }
},onClick:function(e) {
    var _38d = e.getTarget("tbody", this.el);
    if (_38d) {
        var row = e.getTarget("tr");
        if (row) {
            if (this.selectedRow) {
                Ext.get(this.selectedRow).removeClass(this.selectedClass);
            }
            this.selectedRow = row;
            Ext.get(row).addClass(this.selectedClass);
        }
    }
},showItem:function(_38f, cell) {
    if (!this.itemWindow) {
        this.itemWindow = new jx.window.MatrixItemWindow({});
    }
    this.itemWindow.show(cell);
    this.itemWindow.loadItem(_38f);
},showTrace:function(_391, _392, _393, _394, _395, cell) {
    if (this.project.getMask() & jx.AclPermission.WRITEADMIN) {
        if (!this.traceWindow) {
            this.traceWindow = new jx.window.MatrixTraceWindow({listeners:{afterUpdateTrace:{fn:this.updateCell,scope:this}}});
        }
        this.traceWindow.show(cell);
        var item = {rowIndex:_391,colIndex:_392,fromDoc:_393,toDoc:_394,traceDir:_395};
        this.traceWindow.loadTrace(item);
    }
},updateCell:function(_398, _399, _39a) {
    this.matrixData.data[_398 - 1][_399] = _39a;
    var body = this.body.child("table", true);
    var cell = body.rows[_398].cells[_399];
    Ext.get(cell).update(this.getCellValue(_39a));
},parseMatrixData:function(_39d) {
    return {columns:this.parseColumns(_39d.topList),data:this.parseData(_39d)};
},parseColumns:function(data) {
    var _39f = [{name:"Matrix Table",id:0}];
    for (var i = 0; i < data.length; i++) {
        _39f.push(data[i]);
    }
    return _39f;
},parseData:function(_3a1) {
    var data = [];
    var len = _3a1.topList.length;
    for (var i = 0; i < _3a1.data.length; i++) {
        var row = [];
        row.push(_3a1.leftList[i]);
        for (var j = 0; j < len; j++) {
            var _3a7 = _3a1.data[i][j];
            row.push(_3a7);
        }
        data.push(row);
    }
    return data;
},getCellValue:function(_3a8) {
    var _3a9 = null;
    if (!_3a8) {
        _3a9 = "\xa0";
    } else {
        _3a9 = this.valueMap[_3a8];
    }
    if (!_3a9) {
        _3a9 = _3a8.name;
    }
    return _3a9;
},getValueMap:function(_3aa, _3ab) {
    return {"1":"<img src=\"img/trace_to.png\" />","2":"<img src=\"img/trace_from.png\" />","3":"<img src=\"img/trace.png\" />"};
},getTpl:function() {
    var mw = jx.panel.TraceMatrix;
    if (!mw.tplCache) {
        mw.tplCache = new Ext.XTemplate("<table class=\"j-grid-table\">", "<thead>", "<tr>", "<tpl for=\"columns\">", "<th>{name}</th>", "</tpl>", "</tr>", "</thead>", "<tbody>", "<tpl for=\"data\">", "<tr>", "<tpl for=\".\">", "<td align=\"{[xindex==0?\"left\":\"center\"]}\">{[this.getCellValue(values)]}</td>", "</tpl>", "</tr>", "</tpl>", "</tbody>", "</table>", {getCellValue:this.getCellValue.createDelegate(this)});
    }
    return mw.tplCache;
},afterRender:function() {
    jx.panel.TraceMatrix.superclass.afterRender.call(this);
    this.body.on({"dblclick":this.onDblClick,"click":this.onClick,scope:this});
}});
jx.window.MatrixItemWindow = function(_3ad) {
    this.panel = new Ext.Panel({autoScroll:true,bodyStyle:{padding:"10px"}});
    _3ad = Ext.applyIf(_3ad, {title:"Item Details",height:300,width:400,modal:true,closable:true,closeAction:"hide",maximizable:true,minimizable:false,buttons:[{text:"Close",handler:this.onCancel,scope:this}],layout:"fit",items:this.panel});
    jx.window.MatrixItemWindow.superclass.constructor.call(this, _3ad);
};
Ext.extend(jx.window.MatrixItemWindow, Ext.Window, {loadItem:function(item) {
    this.panel.body.update("");
    documentManager.getDocumentDto(item.id, this.loadItemCallback.createDelegate(this));
},loadItemCallback:function(item) {
    item.type = item.documentGroup.documentType.name;
    this.getTpl().append(this.panel.body, item);
},onCancel:function() {
    this.hide();
},getTpl:function() {
    var mw = jx.window.MatrixItemWindow;
    if (!mw.tplCache) {
        mw.tplCache = new Ext.XTemplate("<table><tbody>", "<tr><td valign=\"top\">Name:</td><td>{name}</td></tr>", "<tr><td valign=\"top\">Type:</td><td>{type}</td></tr>", "<tr><td valign=\"top\" class=\"j-text-box\">Description:</td><td>{description}</td></tr>", "</tbody></table>");
    }
    return mw.tplCache;
}});
jx.window.MatrixTraceWindow = function(_3b1) {
    this.panel = new Ext.Panel({bodyStyle:"padding:10px",autoScroll:true});
    _3b1 = Ext.applyIf(_3b1, {title:"Add/Edit Relationship",height:300,width:400,modal:true,closable:true,closeAction:"hide",maximizable:true,minimizable:false,buttons:[{text:"Update",handler:this.saveTrace,scope:this},{text:"Cancel",handler:this.onCancel,scope:this}],layout:"fit",items:this.panel});
    jx.window.MatrixTraceWindow.superclass.constructor.call(this, _3b1);
};
Ext.extend(jx.window.MatrixTraceWindow, Ext.Window, {trace:null,loadTrace:function(_3b2) {
    if (!this.form) {
        this.renderForm();
    }
    this.trace = _3b2;
    var tpl = this.getTpl();
    this.textBox.update("");
    this.getTpl().append(this.textBox, {toDoc:_3b2.toDoc.name,fromDoc:_3b2.fromDoc.name});
    this.form.getForm().setValues({traceDir:_3b2.traceDir});
},saveTrace:function() {
    var _3b4 = this.form.getForm().getValues();
    var _3b5 = _3b4.traceDir;
    var item = this.trace;
    var _3b7 = item.rowIndex;
    var _3b8 = item.colIndex;
    var _3b9 = item.fromDoc.id;
    var _3ba = item.toDoc.id;
    if (_3b5 == "") {
        relationshipSvc.deleteTrace({fromDocumentId:_3b9,toDocumentId:_3ba}, {async:false});
        relationshipSvc.deleteTrace({fromDocumentId:_3ba,toDocumentId:_3b9}, {async:false});
    } else {
        if (_3b5 == 1) {
            relationshipSvc.deleteTrace({fromDocumentId:_3ba,toDocumentId:_3b9}, {async:false});
            relationshipSvc.saveTrace({fromDocumentId:_3b9,toDocumentId:_3ba}, {async:false});
        } else {
            if (_3b5 == 2) {
                relationshipSvc.deleteTrace({fromDocumentId:_3b9,toDocumentId:_3ba}, {async:false});
                relationshipSvc.saveTrace({fromDocumentId:_3ba,toDocumentId:_3b9}, {async:false});
            } else {
                if (_3b5 == 3) {
                    relationshipSvc.saveTrace({fromDocumentId:_3b9,toDocumentId:_3ba}, {async:false});
                    relationshipSvc.saveTrace({fromDocumentId:_3ba,toDocumentId:_3b9}, {async:false});
                }
            }
        }
    }
    this.fireEvent("afterUpdateTrace", _3b7, _3b8, _3b5);
    this.onCancel();
},createForm:function(_3bb) {
    var form = new Ext.form.FormPanel({baseCls:"x-plain",labelWidth:80,defaultType:"textfield",labelAlign:"left",items:[{xtype:"ux-radiogroup",fieldLabel:"Trace",name:"traceDir",anchor:"100%",horizontal:false,radios:[{value:"",boxLabel:"No Trace",checked:true},{value:"1",boxLabel:"Trace forward <img src=\"img/trace_to.png\"/>"},{value:"2",boxLabel:"Trace backward <img src=\"img/trace_from.png\"/>"},{value:"3",boxLabel:"Trace forward and backward <img src=\"img/trace.png\"/>"}]}]});
    return form;
},getTpl:function() {
    var mw = jx.window.MatrixTraceWindow;
    if (!mw.tplCache) {
        mw.tplCache = new Ext.XTemplate("<div>Relationship from \"{fromDoc}\" to \"{toDoc}\":</div><div>&nbsp;</div>");
    }
    return mw.tplCache;
},render:function() {
    jx.window.MatrixTraceWindow.superclass.render.apply(this, arguments);
},renderForm:function() {
    this.form = this.createForm({});
    this.textBox = Ext.DomHelper.append(this.panel.body, {tag:"div"}, true);
    this.form.render(this.panel.body);
},onCancel:function() {
    this.hide();
}});
jx.panel.WordImportPanel = function(_3be) {
    _3be = Ext.applyIf(_3be, {items:[{xtype:"jx.form.WordImportForm",project:_3be.project,baseUrl:this.getAppContext().baseUrl,listeners:{afterImport:this.afterImport,scope:this}}]});
    jx.panel.WordImportPanel.superclass.constructor.call(this, _3be);
};
Ext.extend(jx.panel.WordImportPanel, Ext.Panel, {importData:function() {
    this.items.itemAt(0).importData();
},afterImport:function(_3bf) {
    this.fireEvent("afterImport", _3bf);
}});
Ext.reg("jx.panel.WordImportPanel", jx.panel.WordImportPanel);
jx.form.WordImportForm = function(_3c0) {
    _3c0 = Ext.applyIf(_3c0, {baseCls:"x-plain",labelWidth:100,defaultType:"textfield",labelAlign:"right",autoScroll:true,bodyStyle:"padding:10px",fileUpload:true,items:[{xtype:"combo",fieldLabel:"Select Set to Import Data Into",name:"import_doc_group_display",hiddenName:"import_doc_group",anchor:"100%",store:this.creatdDocumentGroupStore(),displayField:"displayPlural",valueField:"id",mode:"local",triggerAction:"all",emptyText:"Select a set...",selectOnFocus:true,editable:false},{fieldLabel:"Enter Requirement Name Styles",name:"field_nameStyles",anchor:"100%",listeners:{render:function(c) {
        Ext.QuickTips.register({target:c.getId(),text:"Enter one or more Word style names separated by a comma. Style names are not case sensitive and you may use wildcards. Example: reqname, heading*, name?"});
    }}},{fieldLabel:"Enter Requirement Description Styles (Optional)",name:"field_descriptionStyles",anchor:"100%",listeners:{render:function(c) {
        Ext.QuickTips.register({target:c.getId(),text:"Enter one or more Word style names separated by a comma.  Style names are not case sensitive and you may use wildcards. Example: normal, desc*"});
    }}},{fieldLabel:"Select file to import",name:"import_file",type:"file",allowBlank:true,anchor:"100%",autoCreate:{tag:"input",type:"file",size:"50",autocomplete:"off"}}]});
    jx.form.WordImportForm.superclass.constructor.call(this, _3c0);
};
Ext.extend(jx.form.WordImportForm, Ext.form.FormPanel, {project:null,baseUrl:"",uploadUrl:"dataImport.req",creatdDocumentGroupStore:function() {
    this.groupStore = jx.data.StoreFactory.buildDocumentGroupStore();
    return this.groupStore;
},loadForm:function(_3c3) {
    this.project = _3c3;
    this.groupStore.load({arg:[_3c3.id]});
},importData:function() {
    this.getForm().submit({waitMsg:"Importing...",url:this.baseUrl + this.uploadUrl,reset:false,success:this.uploadCallback.createDelegate(this),failure:function(form, _3c5) {
        alert(_3c5.result.data.cause);
    },params:{import_projectId:this.project.id,field_docType:"wordxml"}});
},uploadCallback:function(form, _3c7) {
    this.fireEvent("afterImport", _3c7.result.data.count);
},afterRender:function() {
    jx.form.WordImportForm.superclass.afterRender.call(this);
    if (this.project) {
        this.loadForm(this.project);
    }
}});
Ext.reg("jx.form.WordImportForm", jx.form.WordImportForm);
jx.panel.CsvImportPanel = function(_3c8) {
    _3c8 = Ext.applyIf(_3c8, {items:[{xtype:"jx.form.CsvImportForm",project:_3c8.project,baseUrl:this.getAppContext().baseUrl,listeners:{afterImport:this.afterImport,scope:this}}]});
    jx.panel.CsvImportPanel.superclass.constructor.call(this, _3c8);
};
Ext.extend(jx.panel.CsvImportPanel, Ext.Panel, {importData:function() {
    this.items.itemAt(0).importData();
},afterImport:function(_3c9) {
    this.fireEvent("afterImport", _3c9);
}});
Ext.reg("jx.panel.CsvImportPanel", jx.panel.CsvImportPanel);
jx.form.CsvImportForm = function(_3ca) {
    _3ca = Ext.applyIf(_3ca, {baseCls:"x-plain",labelWidth:100,defaultType:"textfield",labelAlign:"right",autoScroll:true,bodyStyle:"padding:10px",fileUpload:true,items:[{xtype:"combo",fieldLabel:"Select Set to Import Data Into",name:"import_doc_group_display",hiddenName:"import_doc_group",store:this.creatdDocumentGroupStore(),displayField:"displayPlural",valueField:"id",mode:"local",triggerAction:"all",emptyText:"Select a set...",selectOnFocus:true,editable:false,listeners:{"select":{fn:this.onChangeGroup,scope:this}}},{xtype:"ux-radiogroup",fieldLabel:"Field delimiter",name:"field_delimiter",anchor:"100%",horizontal:true,radios:[{value:",",boxLabel:"Comma",checked:true},{value:"tab",boxLabel:"Tab"}]},{xtype:"ux-radiogroup",fieldLabel:"Text delimiter",name:"text_delimiter",anchor:"100%",horizontal:true,radios:[{value:"\"",boxLabel:"Double quote",checked:true},{value:"'",boxLabel:"Single quote"}]},{fieldLabel:"Select file to import",name:"import_file",type:"file",allowBlank:true,anchor:"100%",autoCreate:{tag:"input",type:"file",size:"50",autocomplete:"off"}},this.createFieldForm()]});
    jx.form.CsvImportForm.superclass.constructor.call(this, _3ca);
};
Ext.extend(jx.form.CsvImportForm, Ext.form.FormPanel, {project:null,baseUrl:"",uploadUrl:"dataImport.req",fieldForm:null,createFieldForm:function() {
    this.fieldForm = new jx.form.CsvImportFieldForm({});
    this.fieldForm.hide();
    return this.fieldForm;
},creatdDocumentGroupStore:function() {
    this.groupStore = jx.data.StoreFactory.buildDocumentGroupStore();
    return this.groupStore;
},onChangeGroup:function(_3cb) {
    var _3cc = _3cb.getValue();
    documentTypeSvc.getDocumentTypeMetaDataByDocumentGroupId(_3cc, this.project.id, this.changeGroupCallback.createDelegate(this));
},changeGroupCallback:function(_3cd) {
    this.fieldForm.load(_3cd);
    this.fieldForm.show();
    this.doLayout();
},loadForm:function(_3ce) {
    this.project = _3ce;
    this.groupStore.load({arg:[_3ce.id]});
},importData:function() {
    var _3cf = this.fieldForm.getUpdatedItem();
    if (!_3cf) {
        Ext.MessageBox.alert("Error", "Please specify column mapping");
        return;
    }
    this.getForm().submit({waitMsg:"Importing...",url:this.baseUrl + this.uploadUrl,reset:false,success:this.uploadCallback.createDelegate(this),failure:function(form, _3d1) {
        alert(_3d1.result.data.cause);
    },params:{import_projectId:this.project.id,field_docType:"csv",import_fieldMapping:_3cf}});
},uploadCallback:function(form, _3d3) {
    this.fireEvent("afterImport", _3d3.result.data.count);
},afterRender:function() {
    jx.form.CsvImportForm.superclass.afterRender.call(this);
    if (this.project) {
        this.loadForm(this.project);
    }
}});
Ext.reg("jx.form.CsvImportForm", jx.form.CsvImportForm);
jx.panel.ImpactPanel = function(_3d4) {
    Ext.applyIf(_3d4, {autoScroll:true,bodyStyle:"padding: 5px;"});
    jx.panel.ImpactPanel.superclass.constructor.call(this, _3d4);
};
Ext.extend(jx.panel.ImpactPanel, Ext.Panel, {project:null,initComponent:function() {
    jx.panel.ImpactPanel.superclass.initComponent.call(this);
},fillTable:function(data) {
    var _3d6 = [];
    var _3d7 = [];
    var _3d8 = [];
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        switch (item.depth) {
            case 0:
                _3d6.push(item);
                break;
            case 1:
                _3d7.push(item);
                break;
            default:
                _3d8.push(item);
                break;
        }
    }
    this.impactSourceWidget = new jx.grid.ImpactGrid({data:_3d6,listeners:{showItem:this.showItem,scope:this}});
    this.directImpactWidget = new jx.grid.ImpactGrid({data:_3d7,listeners:{showItem:this.showItem,scope:this}});
    this.indirectImpactWidget = new jx.grid.ImpactGrid({data:_3d8,listeners:{showItem:this.showItem,scope:this}});
    Ext.DomHelper.append(this.body, {html:"<div class=\"j-impact-group-text-header\">Source Item(s)</div>"});
    this.impactSourceWidget.render(this.body);
    Ext.DomHelper.append(this.body, {html:"<div class=\"j-impact-group-text\">Direct Impact</div>"});
    this.directImpactWidget.render(this.body);
    Ext.DomHelper.append(this.body, {html:"<div class=\"j-impact-group-text\">Indirect Impact</div>"});
    this.indirectImpactWidget.render(this.body);
},showItem:function(_3db, _3dc, _3dd) {
    var _3de = this.project;
    if (_3dd && _3dd != this.project.id) {
        _3de = this.getAppContext().getProject(_3dd);
    }
    this.fireEvent("showItem", {id:_3db,name:_3dc}, _3de);
},loadImpacts:function(_3df) {
    relationshipSvc.getImpactedDocuments(_3df, this.fillTable.createDelegate(this));
},beforeDestroy:function() {
    jx.panel.ImpactPanel.superclass.beforeDestroy.apply(this, arguments);
    Ext.destroy(this.impactSourceWidget);
    Ext.destroy(this.directImpactWidge);
    Ext.destroy(this.indirectImpactWidget);
}});
Ext.reg("jx.panel.ImpactPanel", jx.panel.ImpactPanel);
jx.grid.ImpactGrid = function(_3e0) {
    Ext.applyIf(_3e0, {fieldDefinitions:this.getListDefinitions(),data:[]});
    this.dataStore = this.buildImpactStore(_3e0.data);
    jx.grid.ImpactGrid.superclass.constructor.call(this, _3e0);
};
Ext.extend(jx.grid.ImpactGrid, jx.grid.SimpleGrid, {getListDefinitions:function() {
    return ([{field:"projectName",label:"Project Name",width:"20%"},{field:"documentKey",renderer:function(_3e1, node, item) {
        if (item.data.projectAuthorized) {
            return "<a href=\"javascript:void(0);\" class=\"j-action-show\">" + item.data.documentKey + "</a>";
        } else {
            return item.data.documentKey;
        }
    },label:"ID",width:"10%"},{field:"documentName",convertFunction:function(item) {
        return item.documentName;
    },label:"Name",width:"40%"},{field:"documentGroup",convertFunction:function(item) {
        return item.documentGroup;
    },label:"Group",width:"15%"},{field:"assignedTo",convertFunction:function(item) {
        return item.assignedTo;
    },label:"Who",width:"15%"}]);
},buildImpactStore:function(data) {
    var _3e8 = [{name:"documentId",type:"int"},{name:"projectName",type:"string"},{name:"documentKey",type:"string"},{name:"documentName",type:"string"},{name:"documentGroup",type:"string"},{name:"assignedTo",type:"string"},{name:"projectAuthorized",type:"boolean"},{name:"projectId",type:"int"}];
    var _3e9 = new jx.data.SimpleListStore({id:"documentId",fields:_3e8,data:data});
    return _3e9;
},onSelectItem:function(view, _3eb, _3ec, e, _3ee) {
    switch (_3ee) {
        case "show":
            this.fireEvent("showItem", _3ec.data.documentId, _3ec.data.documentName, _3ec.data.projectId);
            break;
        default:
            break;
    }
},render:function() {
    jx.grid.ImpactGrid.superclass.render.apply(this, arguments);
    this.loadList();
},destroy:function() {
    jx.grid.ImpactGrid.superclass.destroy.apply(this, arguments);
},loadList:function() {
    this.dataStore.load();
}});
jx.panel.ProjectReportPanel = function(_3ef) {
    _3ef = Ext.applyIf(_3ef, {autoScroll:false,bodyStyle:"padding:5px;"});
    jx.panel.ProjectReportPanel.superclass.constructor.call(this, _3ef);
};
Ext.extend(jx.panel.ProjectReportPanel, Ext.Panel, {data:null,refresh:function() {
    this.form.refresh();
},submitReport:function() {
    this.form.submitReport();
},onSelectItem:function(_3f0) {
    this.form.loadReport(_3f0.data);
},initComponent:function() {
    Ext.apply(this, {layout:"border",items:[this.createGrid(),this.createForm()]});
    jx.panel.ProjectReportPanel.superclass.initComponent.call(this);
},createGrid:function() {
    this.grid = new jx.grid.ProjectReportGrid({data:this.data,region:"center",autoScroll:true,bodyStyle:"padding:5px;",listeners:{onSelectItem:this.onSelectItem,scope:this}});
    return this.grid;
},createForm:function() {
    this.form = new jx.form.ProjectReportForm({data:this.data,region:"south",split:true,autoScroll:true,height:150,bodyStyle:"padding:5px;"});
    return this.form;
},render:function() {
    jx.panel.ProjectReportPanel.superclass.render.apply(this, arguments);
    this.refresh();
}});
Ext.reg("jx.panel.ProjectReportPanel", jx.panel.ProjectReportPanel);
jx.grid.ProjectReportGrid = function(_3f1) {
    Ext.applyIf(_3f1, {fieldDefinitions:this.getListDefinitions(),dataStore:jx.data.StoreFactory.buildProjectReportStore()});
    jx.grid.ProjectReportGrid.superclass.constructor.call(this, _3f1);
};
Ext.extend(jx.grid.ProjectReportGrid, jx.grid.SimpleGrid, {data:null,refresh:function() {
    if (this.data) {
        this.loadData([this.data.org.id]);
    }
},submitReport:function() {
    $("reportForm").action = "report/" + reportName + "." + reportDto.format;
},render:function() {
    jx.grid.ProjectReportGrid.superclass.render.apply(this, arguments);
    this.refresh();
},onSelectItem:function(view, _3f3, _3f4, e, _3f6, _3f7) {
    this.fireEvent("onSelectItem", _3f4);
},getListDefinitions:function() {
    return ([{field:"id",label:"",width:"0%",renderer:this.renderRadio.createDelegate(this)},{field:"name",label:i18n.g("j.l.reportSelect"),dataType:"string",width:"30%"},{field:"description",label:i18n.g("j.l.reportDescription"),dataType:"string"}]);
},renderRadio:function(_3f8, p, _3fa) {
    return String.format("<input type=\"radio\" name=\"{0}\" class=\"{1}\" value=\"{2}\"/>", this.getId() + "-report-id", "j-report-id", _3fa.data.id);
},getRadioValue:function(_3fb) {
    var _3fc = this.body.query("input." + _3fb);
    if (_3fc == null) {
        return null;
    }
    for (i = 0; i < _3fc.length; i++) {
        node = _3fc[i];
        if (node.type == "radio") {
            if (node.checked) {
                return node.value;
            }
        }
    }
    return null;
}});
jx.form.ProjectReportForm = function(_3fd) {
    this.groupStore = jx.data.StoreFactory.buildDocumentGroupStore();
    this.releaseStore = jx.data.StoreFactory.buildReleaseStore();
    this.allFields = [{xtype:"combo",fieldLabel:i18n.g("j.l.reportRelease"),hiddenName:"report_release",store:this.releaseStore,valueField:"id",displayField:"name",typeAhead:false,mode:"local",triggerAction:"all",emptyText:i18n.g("j.l.reportReleaseEmptyText"),selectOnFocus:true,anchor:"100%",hidden:false,hideLabel:false,editable:false},{xtype:"combo",fieldLabel:i18n.g("j.l.reportSet"),hiddenName:"report_artifactGroup",store:this.groupStore,valueField:"id",displayField:"displayPlural",typeAhead:false,mode:"local",triggerAction:"all",emptyText:i18n.g("j.l.reportSetEmptyText"),selectOnFocus:true,anchor:"100%",hidden:false,hideLabel:false,editable:false},{fieldLabel:i18n.g("j.l.reportStringParam1"),name:"report_string1",allowBlank:true,hidden:false,hideLabel:false},{fieldLabel:i18n.g("j.l.reportStringParam2"),name:"report_string2",allowBlank:true,hidden:false,hideLabel:false},{fieldLabel:i18n.g("j.l.reportStringParam3"),name:"report_string3",allowBlank:true,hidden:false,hideLabel:false},{xtype:"datefield",fieldLabel:i18n.g("j.l.reportDateParam1"),name:"report_date1",allowBlank:true,hidden:true,hideLabel:true,format:this.getAppContext().getDayMonthYearFormat()},{xtype:"datefield",fieldLabel:i18n.g("j.l.reportDateParam2"),name:"report_date2",allowBlank:true,hidden:false,hideLabel:false,format:this.getAppContext().getDayMonthYearFormat()},{name:"reportId",allowBlank:true,hidden:true,hideLabel:true},{name:"report_project_id",allowBlank:true,hidden:true,hideLabel:true}];
    var _3fe = new jx.data.SimpleListStore({id:"value",fields:[{name:"value"},{name:"display"}],data:[{value:"html",display:"HTML"},{value:"pdf",display:"PDF"},{value:"doc",display:"WORD"},{value:"ppt",display:"PPT"},{value:"xls",display:"XLS"}]});
    _3fe.load();
    this.defaultsFields = [{xtype:"combo",fieldLabel:"Select Format",hiddenName:"report_format",store:_3fe,valueField:"value",displayField:"display",typeAhead:false,mode:"local",triggerAction:"all",emptyText:"Select a format",selectOnFocus:true,anchor:"100%",hidden:false,hideLabel:false,editable:false}];
    _3fd = Ext.applyIf(_3fd, {labelWidth:150,defaultType:"textfield",labelAlign:"left",hidden:false,items:this.defaultsFields});
    jx.form.ProjectReportForm.superclass.constructor.call(this, _3fd);
};
Ext.extend(jx.form.ProjectReportForm, Ext.form.FormPanel, {data:null,refresh:function() {
    this.releaseStore.load({arg:[this.data.project.id]});
    this.groupStore.load({arg:[this.data.project.id]});
},onSubmit:Ext.emptyFn,submitReport:function() {
    var _3ff = this.getForm().getValues();
    if (!this.validate()) {
        return;
    }
    var form = this.getForm().getEl().dom;
    form.target = "_blank";
    form.action = "report/" + this.report.name + "." + _3ff["report_format"];
    form.submit();
},validate:function() {
    var _401 = this.getForm().getValues();
    if (!_401.reportId) {
        Ext.MessageBox.alert(i18n.g("j.m.reportSelectReport"));
        return false;
    }
    var _402 = this.report.criterions;
    if (_402 != null) {
        for (var i = 0; i < _402.length; i++) {
            var f = this.getForm().findField("report_" + _402[i]);
            if (f && !f.getValue()) {
                Ext.MessageBox.alert("Warning", String.format("{0} is required", f.fieldLabel));
                return false;
            }
        }
    }
    return true;
},loadReport:function(_405) {
    var _406 = this.getForm().getValues().report_format;
    if (!_406) {
        _406 = "html";
    }
    this.getForm().reset();
    this.report = _405;
    this.items.each(this.removeItem, this);
    var _407 = _405.criterions;
    if (_407 != null) {
        for (var i = 0; i < _407.length; i++) {
            var f = this.getMyField("report_" + _407[i]);
            if (f) {
                this.add(f);
            }
        }
    }
    this.add(this.getMyField("reportId"));
    this.add(this.getMyField("report_project_id"));
    this.doLayout();
    this.getForm().setValues({report_format:_406,reportId:_405.id,report_project_id:this.data.project.id});
},getMyField:function(name) {
    var l = this.allFields.length;
    for (var i = 0; i < l; i++) {
        var f = this.allFields[i];
        if (f.name == name || f.hiddenName == name) {
            return f;
        }
    }
    return null;
},hideItem:function(_40e, _40f, size) {
    var el = _40e.getEl().up("div.x-form-item");
    el.setVisibilityMode(Ext.Element.DISPLAY);
    el.hide();
},removeItem:function(_412, _413, size) {
    if (_412.name != "report_format" && _412.hiddenName != "report_format") {
        this.remove(_412);
    }
},showItem:function(_415, _416, size) {
    var el = _415.getEl().up("div.x-form-item");
    el.setVisibilityMode(Ext.Element.DISPLAY);
    el.show();
},render:function() {
    jx.form.ProjectReportForm.superclass.render.apply(this, arguments);
    this.refresh();
}});
jx.panel.ResultPanel = function(_419) {
    _419 = Ext.applyIf(_419, {title:"Item Grid"});
    jx.panel.ResultPanel.superclass.constructor.call(this, _419);
};
Ext.extend(jx.panel.ResultPanel, Ext.Panel, {data:null,iconCls:"j-header-search-icon",refresh:function() {
    var item = this.data.item;
    this.setTabTitleAndIcon(String.format("{0}:&nbsp;{1}", item.titleDisplay, item.name), item.iconCls);
},getDisplayAndIcon:function(data) {
    var _41c = "";
    var _41d = "";
    var _41e = "";
    var _41f = "";
    var _420 = "";
    switch (data.itemType) {
        case "search":
            _41c = i18n.g("j.l.resultSearch");
            _41e = i18n.g("j.l.resultSearch");
            _41d = "j-header-search-icon";
            break;
        case "filter":
            _41c = i18n.g("j.l.resultFilter");
            _41e = i18n.g("j.l.resultFilter");
            _41e = i18n.g("j.l.resultFilter");
            _41f = i18n.g("j.b.resultFilterEdit");
            _420 = i18n.g("j.b.resultFilterDelete");
            _41d = "j-filter-add-icon";
            break;
        case "tag":
            _41c = i18n.g("j.l.resultTag");
            _41e = i18n.g("j.l.resultTag");
            _41f = i18n.g("j.b.resultTagEdit");
            _420 = i18n.g("j.b.resultTagDelete");
            _41d = "j-tag-blue-icon";
            break;
        case "group":
            _41c = i18n.g("j.l.resultSet");
            _41e = i18n.g("j.l.resultSet");
            _41f = i18n.g("j.b.resultSetEdit");
            _420 = i18n.g("j.b.resultSetDelete");
            _41d = "j-header-report-icon";
            break;
        case "folder":
            _41c = i18n.g("j.l.resultFolder");
            _41e = i18n.g("j.l.resultFolder");
            _41f = i18n.g("j.b.resultFolderEdit");
            _420 = i18n.g("j.b.resultFolderDelete");
            _41d = "j-item-folder-icon";
            break;
        case "release":
            _41c = i18n.g("j.l.resultRelease");
            _41e = i18n.g("j.l.resultRelease");
            _41f = i18n.g("j.b.resultReleaseEdit");
            _420 = i18n.g("j.b.resultReleaseDelete");
            _41d = "j-item-folder-icon";
            break;
        default:
            _41c = "";
            _41e = "";
            _41f = i18n.g("j.b.resultEdit");
            _420 = i18n.g("j.b.resultDelete");
            _41d = "";
            break;
    }
    return Ext.apply(data.item, {titleDisplay:_41c,labelDisplay:_41e,iconCls:_41d,editButton:_41f,deleteButton:_420});
},initComponent:function() {
    Ext.applyIf(this, {layout:"border",items:[{region:"north",height:90,border:false,xtype:"jx.panel.ResultHeaderPanel",resultPanel:this,data:this.data},{region:"center",xtype:"jx.panel.ItemGridPanel",resultPanel:this,data:this.data}]});
    jx.panel.ResultPanel.superclass.initComponent.call(this);
    this.data.on("dataChanged", this.refresh, this);
},render:function() {
    jx.panel.ResultPanel.superclass.render.apply(this, arguments);
    this.refresh();
}});
Ext.reg("jx.panel.ResultPanel", jx.panel.ResultPanel);
jx.panel.ResultHeaderPanel = function(_421) {
    _421 = Ext.applyIf(_421, {});
    jx.panel.ResultHeaderPanel.superclass.constructor.call(this, _421);
};
Ext.extend(jx.panel.ResultHeaderPanel, Ext.Panel, {data:null,refresh:function() {
    var data = this.data;
    var item = this.data.item;
    this.body.update("");
    this.getTpl().append(this.body, {name:item.name,gridHeader:item.labelDisplay});
    this.getTopToolbar().items.itemAt(0).getEl().innerHTML = String.format("{0}:&nbsp;{1}", item.titleDisplay, item.name);
    if (data.itemType && this.rendered) {
        this.editButton = Ext.getCmp(this.editButtonId);
        this.deleteButton = Ext.getCmp(this.deleteButtonId);
        this.editButton.setText(item.editButton);
        this.deleteButton.setText(item.deleteButton);
        this.getTopToolbar().showButtons(this.data.project.getMask(), jx.grid.ModeMap[data.itemType]);
    }
},initComponent:function() {
    var mm = jx.grid.ModeMap;
    var wa = jx.AclPermission.WRITEADMIN;
    this.editButtonId = this.myId("edit-button");
    this.deleteButtonId = this.myId("delete-button");
    Ext.apply(this, {tbar:["&nbsp;yyy","->",{text:i18n.g("j.b.resultEdit"),id:this.editButtonId,iconCls:"j-item-edit-icon",handler:this.onEdit,scope:this,mask:wa,mode:mm.allButSearch},{xtype:"tbseparator",mask:wa,mode:mm.allButSearch},{text:i18n.g("j.b.resultDelete"),iconCls:"j-item-delete-icon",id:this.deleteButtonId,handler:this.onDelete,scope:this,mask:wa,mode:mm.allButSearch}]});
    this.data.on("dataChanged", this.refresh, this);
    jx.panel.ResultHeaderPanel.superclass.initComponent.call(this);
},onEdit:function(_426) {
    var data = this.data;
    var e = {data:{project:data.project,item:data.item,itemType:data.itemType},source:this.resultPanel,sourceType:"grid",sourceEl:_426};
    var ctx = this.getAppContext();
    switch (data.itemType) {
        case "filter":
            ctx.fireEvent("editFilter", e);
            break;
        case "tag":
            ctx.fireEvent("editTag", e);
            break;
        case "release":
            ctx.fireEvent("editRelease", e);
            break;
        case "group":
            e.data.group = e.data.item;
            ctx.fireEvent("editGroup", e);
            break;
        case "folder":
            ctx.fireEvent("editItem", e);
            break;
        default:
            break;
    }
},onDelete:function(_42a) {
    var data = this.data;
    var e = {data:{project:data.project,item:data.item,itemType:data.itemType},source:this.resultPanel,sourceType:"grid",sourceEl:_42a};
    var ctx = this.getAppContext();
    switch (data.itemType) {
        case "filter":
            ctx.fireEvent("deleteFilter", e);
            break;
        case "tag":
            ctx.fireEvent("deleteTag", e);
            break;
        case "release":
            ctx.fireEvent("deleteRelease", e);
            break;
        case "group":
            e.data.group = e.data.item;
            ctx.fireEvent("deleteGroup", e);
            break;
        case "folder":
            ctx.fireEvent("deleteItem", e);
            break;
        default:
            break;
    }
},render:function() {
    jx.panel.ResultHeaderPanel.superclass.render.apply(this, arguments);
    this.refresh();
},getTpl:function() {
    if (this.tpl) {
        return this.tpl;
    }
    var w = jx.panel.ResultHeaderPanel;
    if (!w.tplCache) {
        w.tplCache = new Ext.XTemplate("<table><tbody>", "<tr>", "<td nowrap align=\"right\" width=\"10%\"><div class=\"j-set-header-title-left\">{gridHeader}</div></td><td><div class=\"j-set-header-title-right\">{name}</div></td>", "</tr>", "</tbody></table>");
    }
    return w.tplCache;
}});
Ext.reg("jx.panel.ResultHeaderPanel", jx.panel.ResultHeaderPanel);
jx.panel.OrgCenterPanel = function(_42f) {
    jx.panel.OrgCenterPanel.superclass.constructor.call(this, _42f);
};
Ext.extend(jx.panel.OrgCenterPanel, Ext.Panel, {filterListView:null,data:null,dialog:null,disabled:false,initComponent:function() {
    this.data = new jx.ItemData({project:new jx.Project({id:0}),org:this.getAppContext().getOrganization()});
    Ext.apply(this, {autoScroll:true,width:400,layout:"fit",items:{xtype:"jx.panel.ProjectCenterPanel",id:"p-center-panel"},tbar:this.getTbar()});
    this.data.on("dataChanged", this.onDataChanged, this, {single:true});
    this.getAppContext().on("projectChanged", this.updateData, this);
    this.getAppContext().on("nullProject", this.disableSearch, this);
    jx.panel.OrgCenterPanel.superclass.initComponent.call(this);
},updateData:function(e) {
    this.data.reconfig({project:e.data.project});
    this.getTopToolbar().items.itemAt(0).getEl().innerHTML = e.data.project.name;
    this.onDataChanged();
},getTbar:function() {
    return new Ext.Toolbar({id:"o-panel-center-tb",items:["&nbsp;","->",{id:"o-search-field",xtype:"textfield",name:"searchString",anchor:"100%",emptyText:i18n.g("j.b.search"),listeners:{specialKey:this.onSpecialKey,scope:this},disabled:true},{id:"o-search-button",iconCls:"j-header-search-icon",tooltip:i18n.g("j.tt.search"),handler:this.onSearch,scope:this,disabled:true}]});
},showSearch:function() {
    if (!this.searchDialog) {
        this.searchDialog = new jx.window.SearchWindow({data:this.data});
    }
    this.searchDialog.show();
    this.searchDialog.alignTo(this.getEl(), "tl-bl", [0,0], true);
},showWindow:function(_431, _432) {
    var e = {data:{project:this.data.project},source:this,sourceEl:_432.getEl(),xtype:_431};
    this.getAppContext().fireEvent("showWindow", e);
},afterRender:function() {
    jx.panel.OrgCenterPanel.superclass.afterRender.call(this);
},onSpecialKey:function(_434, _435) {
    if (_435.getKey() == Ext.EventObject.RETURN) {
        var _436 = _434.getValue();
        this.search(_436);
    }
},onSearch:function() {
    var _437 = Ext.getCmp("o-search-field").getValue();
    this.search(_437);
},search:function(_438) {
    if (_438) {
        var data = {item:{name:_438},itemType:"search",project:this.data.project};
        this.getAppContext().fireEvent("showGrid", {data:data,source:this});
    }
},onDataChanged:function() {
    this.getTopToolbar().items.each(function(item) {
        item.enable();
    });
    var c = Ext.getCmp("o-search-field").enable();
},disableSearch:function() {
    this.getTopToolbar().items.each(function(item) {
        item.disable();
    });
    var c = Ext.getCmp("o-search-field").disable();
}});
Ext.reg("jx.panel.OrgCenterPanel", jx.panel.OrgCenterPanel);
jx.panel.ItemSeleniumPanel = function(_43e) {
    _43e = Ext.applyIf(_43e, {});
    jx.panel.ItemSeleniumPanel.superclass.constructor.call(this, _43e);
};
Ext.extend(jx.panel.ItemSeleniumPanel, Ext.Panel, {data:null,testForm:null,org:null,refresh:function(_43f) {
    this.runnerStore.load({arg:[1022,3,this.data.getProjectId()]});
    this.targetStore.load({arg:[1021,3,this.data.getProjectId()]});
},initComponent:function() {
    Ext.apply(this, {items:this.createForm(),tbar:["->",{text:i18n.g("j.l.seStepTest"),iconCls:"j-tag-add-icon",handler:this.runStepTest,scope:this},{text:i18n.g("j.l.seAutoTest"),iconCls:"j-tag-add-icon",handler:this.runAutoTest,scope:this}]});
    jx.panel.ItemSeleniumPanel.superclass.initComponent.call(this);
},createForm:function() {
    this.runnerStore = jx.data.StoreFactory.buildLookupByTypeCategoryStore();
    this.targetStore = jx.data.StoreFactory.buildLookupByTypeCategoryStore();
    this.testForm = new Ext.form.FormPanel({labelWidth:200,items:[{html:"<p>" + i18n.g("j.m.seTitle") + "</p>",bodyStyle:"border-width: 0px 0px 0px"},{xtype:"combo",fieldLabel:i18n.g("j.l.seTargetApplicationBaseUrl"),store:this.targetStore,displayField:"name",name:"baseUrl",valueField:"id",mode:"local",triggerAction:"all",selectOnFocus:true,editable:false,forceSelection:true},{xtype:"combo",fieldLabel:i18n.g("j.l.seTestRunner"),store:this.runnerStore,displayField:"name",name:"runner",valueField:"id",mode:"local",triggerAction:"all",selectOnFocus:true,editable:false,forceSelection:true}]});
    return this.testForm;
},runStepTest:function() {
    this.launchSeleniumTest(false);
},runAutoTest:function() {
    this.launchSeleniumTest(true);
},launchSeleniumTest:function(auto) {
    var _441 = auto ? "true" : "false";
    var _442 = this.testForm.getForm().getValues();
    var _443 = this.data.getItemId();
    var _444 = "../proxy/";
    var _445 = _442.baseUrl;
    var _446 = _442.runner + "/core/TestRunner.html";
    if (!_445) {
        _445 = _444;
    }
    if (!_446) {
        _446 = _445 + "/selenium-core/core/TestRunner.html";
    }
    var _447 = _444 + "testSuite.req?documentId=" + _443 + "&scriptBaseURL=" + _444 + "&applicationBaseURL=" + _445;
    var _448 = _444 + "postResult.req";
    var _449 = _446 + "?" + "test=" + escape(_447) + "&resultsUrl=" + escape(_448) + "&auto=" + _441;
    var _44a = window.open(_449);
    if (_44a) {
        _44a.focus();
    }
}});
Ext.reg("jx.panel.ItemSeleniumPanel", jx.panel.ItemSeleniumPanel);
jx.window.TagFormWindow = function(_44b) {
    _44b = Ext.applyIf(_44b, {title:i18n.g("j.l.tagAddPanelTitle"),autoheight:true,width:275,modal:false,closable:true,closeAction:"hide",cancelAction:"hide",maximizable:false,minimizable:false,items:this.getForm(),buttons:[{text:i18n.g("j.b.tagSave"),handler:this.saveTag,scope:this},{text:i18n.g("j.b.tagCancel"),handler:this.onCancel,scope:this}],layout:"fit"});
    jx.window.TagFormWindow.superclass.constructor.call(this, _44b);
};
Ext.extend(jx.window.TagFormWindow, Ext.Window, {editTag:function(tag, _44d) {
    this.tag = tag;
    this.project = _44d;
    this.formPanel.getForm().setValues(tag);
},getForm:function() {
    this.formPanel = new Ext.FormPanel({labelWidth:100,autoHeight:true,defaultType:"textfield",bodyStyle:"padding:10px",items:{fieldLabel:i18n.g("j.l.tagNameField"),name:"tagName"}});
    return this.formPanel;
},saveTag:function(d) {
    var _44f = this.formPanel.getForm().getValues();
    var tag = Ext.apply(this.tag, _44f);
    var tag = Ext.apply(tag, {scope:3,refId:this.project.id});
    tagSvc.saveTag(tag, this.saveTagCallback.createDelegate(this, [tag], 0));
},saveTagCallback:function(tag) {
    this.fireEvent("afterSaveTag", this, tag);
    this.formPanel.getForm().reset();
    this.onCancel();
}});
jx.window.ProjectAdminWindow = function(_452) {
    _452 = Ext.applyIf(_452, {title:"Project Settings",width:850,height:600,modal:true,closable:true,closeAction:"destroy",cancelAction:"destroy",maximizable:true,minimizable:false,buttons:[{text:"Close",handler:this.onCancel,scope:this}],layout:"fit",items:{xtype:"jx.panel.ProjectAdminPanel",data:_452.data}});
    jx.window.ProjectAdminWindow.superclass.constructor.call(this, _452);
};
Ext.extend(jx.window.ProjectAdminWindow, Ext.Window, {onEvent:function(e) {
},beforeDestroy:function() {
    jx.window.ProjectAdminWindow.superclass.beforeDestroy.apply(this, arguments);
}});
Ext.reg("jx.window.ProjectAdminWindow", jx.window.ProjectAdminWindow);
jx.window.ItemFormWindow = function(_454) {
    _454 = Ext.applyIf(_454, {title:i18n.g("j.l.itemFormTitle"),width:"800",height:500,modal:true,closable:true,closeAction:"onCancel",cancelAction:"hide",maximizable:true,minimizable:false,autoScroll:true,constrain:true,closeAfterSave:true,buttons:[{text:i18n.g("j.b.itemSaveAndContinue"),handler:this.saveAndContinue,scope:this},{text:i18n.g("j.b.itemSave"),handler:this.saveAndClose,scope:this},{text:i18n.g("j.b.itemCommit"),handler:this.commitItem,scope:this,hidden:true},{text:i18n.g("j.b.itemCancel"),handler:this.onCancel,scope:this}],layout:"fit",items:{layout:"card",activeItem:0,deferredRender:false,items:[this.createItemForm(),{layout:"border",items:[this.createCommentForm(),this.createGroupTree()]}]}});
    jx.window.ItemFormWindow.superclass.constructor.call(this, _454);
};
Ext.extend(jx.window.ItemFormWindow, Ext.Window, {project:null,item:null,itemGroup:null,minorSave:false,itemForm:null,editItem:function(item, _456, _457) {
    this.project = _456;
    this.showItemPanel();
    this.project = _456;
    this.itemForm.editItem(item, _456, _457);
},initComponent:function() {
    jx.window.ItemFormWindow.superclass.initComponent.call(this);
},isFckReady:function() {
    var _458 = this.itemForm && this.itemForm.isReady();
    if (!_458) {
        Ext.MessageBox.alert("Warning", "The edtor is not ready");
    }
    return _458;
},createGroupTree:function(val) {
    var _45a = new jx.tree.ItemTree({region:"west",collapsible:true,split:true,width:300,title:i18n.g("j.l.itemSaveFolderText"),folderOnly:true,rootVisible:true});
    this.groupTree = _45a;
    return _45a;
},createCommentForm:function() {
    var form = new jx.form.ItemSaveForm();
    var _45c = new Ext.Panel({title:i18n.g("j.l.itemSaveComment"),region:"center",items:form,autoScroll:true});
    this.commentForm = form;
    return _45c;
},createItemForm:function() {
    var _45d = new jx.form.ItemForm({});
    var _45e = new Ext.Panel({items:_45d,autoScroll:true});
    this.itemForm = _45d;
    this.formPanel = _45e;
    return _45e;
},render:function(_45f) {
    jx.window.ItemFormWindow.superclass.render.call(this, _45f);
    if (this.project && this.item) {
        this.editItem(this.item, this.project);
    }
},onEditItem:function(e) {
    this.sourceEvent = e;
    this.show();
    var data = e.data;
    var item = data.item;
    var _463 = null;
    var _464 = data.project;
    if (!data.getItemId() && e.node) {
        _463 = this.parseNode(e.node);
        item.documentGroup = {id:_463.groupId};
    }
    this.editItem(item, _464, _463);
},saveAndContinue:function() {
    if (this.isFckReady()) {
        this.minorSave = true;
        this.saveItem();
    }
},saveAndClose:function() {
    if (this.isFckReady()) {
        this.minorSave = false;
        this.saveItem();
    }
},saveItem:function() {
    var form = this.itemForm;
    if (!form.validateForm()) {
        return;
    }
    var item = form.getNewItem();
    var _467 = item.documentGroup;
    var path = form.selected ? form.selected.parentPath : null;
    if (!item.id || this.project.getShouldVersion()) {
        var _469 = this.itemForm.getChangeComment();
        this.loadComment(this.itemForm.project, _469);
        if (!item.id) {
            this.loadTree(_467, path);
            this.groupTree.show();
            this.doLayout();
        } else {
            this.groupTree.hide();
            this.doLayout();
        }
    } else {
        this.commitItem();
    }
},commitItem:function() {
    this.container.mask();
    var item = this.itemForm.getNewItem();
    var _46b = this.itemForm.project;
    if (!item.parentId && !item.id) {
        item.parentId = this.getParentId();
    }
    if (!item.id || _46b.getShouldVersion()) {
        var _46c = this.commentForm.getUpdatedItem();
        item.versionComments = _46c.comment;
        item.distributionGroups = _46c.distGroups;
    }
    documentManager.saveDocumentDto(item, {callback:this.commitItemCallback.createDelegate(this)});
},commitItemCallback:function(item) {
    this.container.unmask();
    var _46e = true;
    this.findMe.defer(10, this, [item]);
    if (this.sourceEvent.related) {
        this.saveItemRelate(item, this.sourceEvent.related.item);
    }
    if (this.sourceEvent.sourceType == "grid") {
        _46e = false;
        if (this.sourceEvent.source.singleRowChangeRefresh) {
            this.sourceEvent.source.singleRowChangeRefresh(this.sourceEvent);
        }
    }
    if (_46e) {
        this.showItem(item);
    }
    if (!this.minorSave) {
        this.hide();
    } else {
        this.editItem(item, this.project);
        this.items.itemAt(0).getLayout().setActiveItem(0);
    }
},findMe:function(item) {
    var e = {data:{project:this.project,item:item,itemType:"doc"},source:this};
    this.getAppContext().fireEvent("findMe", e);
},showItem:function(item) {
    this.getAppContext().fireEvent("showItem", {sourceType:"form",source:this,data:{project:this.project,item:{id:item.id,name:item.name}},newTab:false});
},getParentId:function() {
    var node = this.groupTree.getSelectionModel().getSelectedNode();
    var _473 = null;
    if (node && node.id.charAt(0) == "a") {
        _473 = node.id.substring(2);
    }
    return _473;
},loadComment:function(_474, _475) {
    this.showCommentPanel();
    this.commentForm.load(_474.id, _475);
},loadTree:function(_476, path) {
    this.groupTree.loadDocumentGroup(_476);
    if (path) {
        this.groupTree.selectPath(path);
    }
},showButtons:function() {
    var _478 = this.items.itemAt(0).getLayout().activeItem == this.formPanel;
    this.buttons[0][!_478 ? "hide" : "show"]();
    this.buttons[1][!_478 ? "hide" : "show"]();
    this.buttons[2][_478 ? "hide" : "show"]();
},showItemPanel:function() {
    this.items.itemAt(0).getLayout().setActiveItem(0);
    this.showButtons();
},showCommentPanel:function() {
    this.items.itemAt(0).getLayout().setActiveItem(1);
    this.showButtons();
},parseNode:function(node) {
    if (node) {
        var _47a = node.attributes.groupId;
        var _47b = node.isLeaf() ? node.parentNode : node;
        var id = _47b.id;
        var _47d = id.charAt(0) == "g" ? null : id.substring(2);
        var path = _47b.getPath();
        var _47f = path.indexOf("/g");
        if (_47f > 0) {
            path = path.substring(_47f);
        }
        return {groupId:_47a,parentId:_47d,parentPath:path};
    }
    return null;
},saveItemRelate:function(item, _481) {
    var _482 = [];
    var _483 = {fromDocument:{id:_481.id},toDocument:{id:item.id},associationType:null};
    _482.push(_483);
    relationshipSvc.saveRelationships({associations:_482}, this.onSuccessSaveRelationships.createDelegate(this));
},onSuccessSaveRelationships:function() {
    this.sourceEvent.related = null;
}});
jx.window.ItemAttachmentWindow = function(_484) {
    _484 = Ext.applyIf(_484, {title:i18n.g("j.l.fileUploadDialogTitle"),width:600,height:400,modal:true,closable:true,closeAction:"hide",cancelAction:"hide",maximizable:true,minimizable:false,buttons:[{text:i18n.g("j.b.fileUploadSave"),handler:this.onUpload,scope:this},{text:i18n.g("j.b.fileUploadAttach"),handler:this.onAttach,scope:this},{text:i18n.g("j.b.fileUploadCancel"),handler:this.onCancel,scope:this}],layout:"fit",items:this.createTabPanel(_484)});
    jx.window.ItemAttachmentWindow.superclass.constructor.call(this, _484);
};
Ext.extend(jx.window.ItemAttachmentWindow, Ext.Window, {data:null,attachForm:null,attachGrid:null,noteForm:null,loadAttachment:function(att) {
    this.attachForm.loadAttachment(att);
    this.attachGrid.refresh();
},onAttach:function() {
    var ids = this.attachGrid.getSelection();
    var note = this.noteForm.getForm().getValues().note;
    if (ids.length > 0) {
        this.saveAttachmentList(ids, note);
    }
    this.attachGrid.clearSelection();
    this.noteForm.getForm().reset();
},saveAttachmentList:function(ids, note) {
    if (ids.length > 0) {
        documentManager.saveDocumentAttachmentList(ids, note, {id:this.data.getItemId()}, {callback:this.updateItemCallback.createDelegate(this),exceptionHandler:function() {
            Ext.MessageBox.alert("Error", "The item(s) can not be saved");
        }});
    }
},updateItemCallback:function() {
    this.onCancel();
    this.fireEvent("afterSaveItemAttachment");
},createTabPanel:function(_48a) {
    this.attachForm = this.createFormPanel(_48a);
    this.attachGrid = this.createGridPanel(_48a);
    this.noteForm = this.createNoteForm(_48a);
    return new Ext.TabPanel({activeItem:0,items:[this.attachForm,{title:i18n.g("j.l.fileUploadServerTabTitle"),layout:"border",defaults:{bodyStyle:"padding:10px"},items:[this.attachGrid,this.noteForm],listeners:{activate:{fn:this.clickGridTab,scope:this}}}]});
},clickFormTab:function(tab) {
    this.buttons[0].show();
    this.buttons[1].hide();
},clickGridTab:function(tab) {
    this.buttons[0].hide();
    this.buttons[1].show();
},createFormPanel:function(_48d) {
    return new jx.form.AttachmentUploadForm({title:i18n.g("j.l.fileUploadTabTitle"),data:_48d.data,showNote:true,listeners:{afterSaveItemAttachment:{fn:this.updateItemCallback,scope:this},activate:{fn:this.clickFormTab,scope:this}}});
},createGridPanel:function(_48e) {
    return new jx.grid.ServerAttachmentGrid({region:"center",autoScroll:true,data:_48e.data,listeners:{afterSaveItemAttachment:{fn:this.updateItemCallback,scope:this}}});
},createNoteForm:function(_48f) {
    return new Ext.form.FormPanel({region:"south",height:40,baseCls:"x-plain",labelWidth:100,defaultType:"textfield",labelAlign:"left",bodyStyle:"padding:10px",items:[{fieldLabel:"Note",name:"note",anchor:"100%"}]});
},onUpload:function() {
    this.attachForm.upload();
}});
jx.window.ItemUrlWindow = function(_490) {
    _490 = Ext.applyIf(_490, {title:i18n.g("j.l.itemUrlWindowTitle"),height:150,width:400,modal:true,closable:true,closeAction:"hide",cancelAction:"hide",maximizable:true,minimizable:false,autoScroll:true,buttons:[{text:i18n.g("j.b.itemUrlSave"),handler:this.saveItem,scope:this},{text:i18n.g("j.b.itemUrlCancel"),handler:this.onCancel,scope:this}],layout:"fit",items:this.createForm()});
    jx.window.ItemUrlWindow.superclass.constructor.call(this, _490);
};
Ext.extend(jx.window.ItemUrlWindow, Ext.Window, {data:null,form:null,urlItem:null,loadUrl:function(_491) {
    this.urlItem = _491;
    this.form.getForm().setValues(_491);
},onCancel:function() {
    this.form.getForm().reset();
    this[this.cancelAction]();
},saveItem:function() {
    var item = this.form.getForm().getValues();
    if (!item.url) {
        Ext.MessageBox.alert("Warining", "URL is required.");
    } else {
        item = Ext.apply(this.urlItem, item);
        documentManager.saveDocumentAttachment(item, {id:this.data.getItemId()}, {callback:this.updateItemCallback.createDelegate(this),exceptionHandler:function() {
            Ext.MessageBox.alert("Error", "This item can not be saved");
        }});
    }
    this.form.getForm().reset();
},updateItemCallback:function(item) {
    this.fireEvent("afterSaveUrl", item);
    this.onCancel();
},createForm:function(_494) {
    this.form = new Ext.form.FormPanel({baseCls:"x-plain",labelWidth:80,defaultType:"textfield",bodyStyle:"padding:10px",items:[{fieldLabel:"URL",name:"url",anchor:"100%"},{fieldLabel:"Note",name:"note",anchor:"100%"}]});
    return {layout:"fit",items:this.form};
},render:function(_495) {
    jx.window.ItemUrlWindow.superclass.render.call(this, _495);
    if (this.urlItem) {
        this.loadUrl(this.urlItem);
    }
}});
jx.window.VersionCompareFormWindow = function(_496) {
    _496 = Ext.applyIf(_496, {title:"Version Compare",width:600,height:400,modal:true,closable:true,closeAction:"hide",cancelAction:"hide",maximizable:true,minimizable:false,buttons:[{text:"Close",handler:this.onCancel,scope:this}],layout:"fit",items:this.createVersionCompareForm(_496)});
    jx.window.VersionCompareFormWindow.superclass.constructor.call(this, _496);
};
Ext.extend(jx.window.VersionCompareFormWindow, Ext.Window, {fromDoc:null,toDoc:null,compareItems:function(_497, _498) {
    this.versionForm.compareItems(_497, _498);
},createVersionCompareForm:function(_499) {
    this.versionForm = new jx.form.VersionCompareForm({fromDoc:_499.fromDoc,toDoc:_499.toDoc});
    return new Ext.Panel({autoScroll:true,items:this.versionForm,tbar:["->",{text:"Show Details",handler:this.toggleDetails,scope:this}]});
},toggleDetails:function(_49a) {
    this.versionForm.toggleDetails();
    _49a.setText(this.versionForm.showDetails ? "Hide Details" : "Show Details");
},onSave:function() {
    this.versionForm.onSave();
}});
jx.window.SearchWindow = function(_49b) {
    _49b = Ext.applyIf(_49b, {width:300,height:100,modal:false,closable:false,closeAction:"destroy",cancelAction:"destroy",maximizable:false,minimizable:false,buttons:[{text:"Search",handler:this.onSearch,scope:this},{text:"Close",handler:this.onCancel,scope:this}],layout:"fit",items:this.getFormPanel()});
    jx.window.SearchWindow.superclass.constructor.call(this, _49b);
};
Ext.extend(jx.window.SearchWindow, Ext.Window, {data:null,initComponent:function() {
    jx.window.SearchWindow.superclass.initComponent.call(this);
},getFormPanel:function() {
    this.form = new Ext.form.FormPanel({baseCls:"x-plain",labelWidth:50,defaultType:"textfield",labelAlign:"left",autoScroll:true,bodyStyle:"padding:10px",items:[{fieldLabel:"Search",name:"searchString",anchor:"100%",listeners:{specialKey:this.onSpecialKey,scope:this}}]});
    return this.form;
},onSpecialKey:function(_49c, _49d) {
    if (_49d.getKey() == Ext.EventObject.RETURN) {
        var _49e = _49c.getValue();
        this.search(_49e);
    }
},onSearch:function() {
    var _49f = this.form.getForm().getValues().searchString;
    this.search(_49f);
},search:function(_4a0) {
    if (_4a0) {
        var data = {item:{name:_4a0},itemType:"search",project:this.data.project};
        this.getAppContext().fireEvent("showGrid", {data:data,source:this});
    }
}});
jx.window.TagListWindow = function(_4a2) {
    _4a2 = Ext.applyIf(_4a2, {title:"Tags",width:300,height:275,modal:false,closable:true,closeAction:"hide",cancelAction:"hide",maximizable:false,minimizable:false,buttons:[{text:"Close",handler:this.onCancel,scope:this}],layout:"fit",items:{xtype:"jx.panel.TagListPanel",data:_4a2.data}});
    jx.window.TagListWindow.superclass.constructor.call(this, _4a2);
};
Ext.extend(jx.window.TagListWindow, Ext.Window, {data:null,refresh:function() {
    this.items.itemAt(0).refresh();
},initComponent:function() {
    jx.window.TagListWindow.superclass.initComponent.call(this);
    this.data.on("dataChanged", this.refresh, this);
    this.getAppContext().on("refreshTagList", this.refresh, this);
},onCancel:function() {
    this.minimized = true;
    this.hide();
}});
jx.window.ReleaseTreeWindow = function(_4a3) {
    _4a3 = Ext.applyIf(_4a3, {title:i18n.g("j.l.releaseTree"),width:300,height:275,modal:false,closable:true,closeAction:"hide",cancelAction:"hide",maximizable:false,minimizable:false,buttons:[{text:"Close",handler:this.onCancel,scope:this}],layout:"fit",items:{xtype:"jx.panel.ReleaseTreePanel",data:_4a3.data}});
    jx.window.ReleaseTreeWindow.superclass.constructor.call(this, _4a3);
};
Ext.extend(jx.window.ReleaseTreeWindow, Ext.Window, {data:null,refresh:function() {
    this.items.itemAt(0).refresh();
},initComponent:function() {
    jx.window.ReleaseTreeWindow.superclass.initComponent.call(this);
    this.data.on("dataChanged", this.refresh, this);
}});
jx.window.ReleaseFormWindow = function(_4a4) {
    _4a4 = Ext.applyIf(_4a4, {title:i18n.g("j.b.addRelease"),autoheight:true,width:400,height:200,modal:true,closable:true,closeAction:"destroy",cancelAction:"destroy",maximizable:true,minimizable:false,buttons:[{text:i18n.g("jama.b.save"),handler:this.onSave,scope:this},{text:i18n.g("jama.b.cancel"),handler:this.onCancel,scope:this}],layout:"fit",items:{layout:"fit",items:this.getForm()}});
    jx.window.ReleaseFormWindow.superclass.constructor.call(this, _4a4);
};
Ext.extend(jx.window.ReleaseFormWindow, Ext.Window, {data:null,release:null,editRelease:function(_4a5) {
    this.release = _4a5;
    if (_4a5.id) {
        var self = this;
        releaseSvc.getRelease(_4a5.id, {callback:function(r) {
            self.release = r;
        },async:false});
    }
    this.formPanel.getForm().setValues(this.release);
},getForm:function() {
    this.formPanel = new Ext.FormPanel({baseCls:"x-plain",labelWidth:100,autoHeight:true,defaultType:"textfield",bodyStyle:"padding:10px",items:[{fieldLabel:i18n.g("j.l.releaseName"),name:"name",allowBlank:false,anchor:"100%"},{fieldLabel:i18n.g("j.l.releaseDesc"),name:"description",anchor:"100%"},new Ext.form.DateField({fieldLabel:i18n.g("j.l.releaseDate"),name:"releaseDate",allowBlank:true,format:this.getAppContext().getDayMonthYearFormat()})]});
    return this.formPanel;
},onSave:function(_4a8) {
    var _4a9 = this.release;
    if (_4a9 == null) {
        _4a9 = {};
    }
    _4a9 = Ext.apply(_4a9, this.formPanel.getForm().getObjectValues());
    releaseSvc.saveProjectRelease(this.data.project.id, _4a9, this.afterSaveItem.createDelegate(this));
    this.close();
},afterSaveItem:function(item) {
    this.getAppContext().fireEvent("afterSaveRelease", item);
    this.onCancel();
}});
jx.window.FilterListWindow = function(_4ab) {
    _4ab = Ext.applyIf(_4ab, {width:300,height:275,title:i18n.g("j.l.filterPanelTitle"),modal:false,closable:true,closeAction:"hide",cancelAction:"hide",maximizable:false,minimizable:false,buttons:[{text:"Close",handler:this.onCancel,scope:this}],layout:"fit",items:{xtype:"jx.panel.FilterListPanel",bodyStyle:"padding: 3px;",data:_4ab.data}});
    jx.window.FilterListWindow.superclass.constructor.call(this, _4ab);
};
Ext.extend(jx.window.FilterListWindow, Ext.Window, {data:null,refresh:function() {
    this.items.itemAt(0).refresh();
},initComponent:function() {
    jx.window.FilterListWindow.superclass.initComponent.call(this);
    this.data.on("dataChanged", this.refresh, this);
    this.getAppContext().on("refreshFilterList", this.refresh, this);
}});
jx.window.TagFormWindow = function(_4ac) {
    _4ac = Ext.applyIf(_4ac, {title:i18n.g("j.l.tagAddPanelTitle"),autoheight:true,width:275,modal:false,closable:true,closeAction:"hide",cancelAction:"hide",maximizable:false,minimizable:false,items:this.getForm(),buttons:[{text:i18n.g("j.b.tagSave"),handler:this.saveTag,scope:this},{text:i18n.g("j.b.tagCancel"),handler:this.onCancel,scope:this}],layout:"fit"});
    jx.window.TagFormWindow.superclass.constructor.call(this, _4ac);
};
Ext.extend(jx.window.TagFormWindow, Ext.Window, {editTag:function(tag, _4ae) {
    this.tag = tag;
    this.project = _4ae;
    this.formPanel.getForm().setValues(tag);
},getForm:function() {
    this.formPanel = new Ext.FormPanel({labelWidth:100,autoHeight:true,defaultType:"textfield",bodyStyle:"padding:10px",items:{fieldLabel:i18n.g("j.l.tagNameField"),name:"tagName"}});
    return this.formPanel;
},saveTag:function(d) {
    var _4b0 = this.formPanel.getForm().getValues();
    var tag = Ext.apply(this.tag, _4b0);
    var tag = Ext.apply(tag, {scope:3,refId:this.project.id});
    tagSvc.saveTag(tag, this.saveTagCallback.createDelegate(this, [tag], 0));
},saveTagCallback:function(tag) {
    this.fireEvent("afterSaveTag", this, tag);
    this.formPanel.getForm().reset();
    this.onCancel();
}});
jx.window.GroupFormWindow = function(_4b3) {
    _4b3 = Ext.applyIf(_4b3, {title:"Add/Edit Set",width:600,height:400,modal:true,closable:true,closeAction:"hide",cancelAction:"hide",maximizable:true,minimizable:false,layout:"fit",buttons:[{text:"Save",handler:this.onSave,scope:this},{text:"Cancel",handler:this.onCancel,scope:this}],items:this.createGroupForm(_4b3)});
    jx.window.GroupFormWindow.superclass.constructor.call(this, _4b3);
};
Ext.extend(jx.window.GroupFormWindow, Ext.Window, {groupForm:null,loadGroup:function(_4b4, _4b5, org) {
    this.project = _4b5;
    this.groupForm.loadGroup(_4b4, _4b5, org);
},createGroupForm:function(_4b7) {
    this.groupForm = new jx.form.GroupForm({group:_4b7.group,org:_4b7.org,project:_4b7.project,listeners:{"afterSaveGroup":{fn:this.onAfterSaveGroup,scope:this}}});
    return new Ext.Panel({autoScroll:true,items:this.groupForm});
},onSave:function() {
    this.groupForm.onSave();
},onAfterSaveGroup:function(_4b8) {
    var ctx = this.getAppContext();
    ctx.fireEvent("refreshItemTree");
    ctx.fireEvent("showGroup", {sourceType:"window",source:this,data:{project:this.project,group:{id:_4b8.id,name:_4b8.displayPlural}},newTab:false});
    this.onCancel();
}});
jx.window.FilterFormWindow = function(_4ba) {
    _4ba = Ext.applyIf(_4ba, {title:"Create/Edit Filter",width:600,height:400,modal:true,closable:true,closeAction:"destroy",cancelAction:"destroy",maximizable:true,minimizable:false,buttons:[{text:"Save",handler:this.onSave,scope:this},{text:"Save As New",handler:this.onSaveAsNew,scope:this},{text:"Cancel",handler:this.onCancel,scope:this}],layout:"fit",items:this.createFilterForm(_4ba)});
    jx.window.FilterFormWindow.superclass.constructor.call(this, _4ba);
};
Ext.extend(jx.window.FilterFormWindow, Ext.Window, {project:null,org:null,filter:null,sourceEvent:null,loadFilter:function(_4bb, _4bc, org, e) {
    this.sourceEvent = e;
    this.filterForm.loadFilter(_4bb, _4bc, org);
},createFilterForm:function(_4bf) {
    this.filterForm = new jx.form.FilterForm({filter:_4bf.filter,org:_4bf.org,project:_4bf.project,listeners:{"afterSaveFilter":{fn:this.afterSaveFilter,scope:this}}});
    return new Ext.Panel({autoScroll:true,items:this.filterForm});
},onSave:function() {
    this.filterForm.onSaveForm(false);
},onSaveAsNew:function() {
    this.filterForm.onSaveForm(true);
},afterSaveFilter:function(form, _4c1) {
    if (this.sourceEvent && this.sourceEvent.source) {
        this.loadFilterResults(_4c1);
        this.getAppContext().fireEvent("refreshFilterList", _4c1);
    }
    this.getAppContext().showMessage("Success", "The Filter is saved.");
    this.onCancel();
},loadFilterResults:function(_4c2) {
    if (_4c2) {
        var data = {item:_4c2,itemType:"filter",project:this.sourceEvent.data.project};
        this.getAppContext().fireEvent("showGrid", {data:data,source:this});
    }
}});
jx.window.BatchUpdateFormWindow = function(_4c4) {
    _4c4 = Ext.applyIf(_4c4, {title:"Batch Update",width:600,height:400,modal:true,closable:true,closeAction:"destroy",cancelAction:"destroy",maximizable:true,minimizable:false,buttons:[{text:"Update",handler:this.onUpdate,scope:this},{text:"Cancel",handler:this.onCancel,scope:this}],layout:"fit",items:this.createBatchUpdateForm(_4c4)});
    jx.window.BatchUpdateFormWindow.superclass.constructor.call(this, _4c4);
};
Ext.extend(jx.window.BatchUpdateFormWindow, Ext.Window, {project:null,org:null,filter:null,sourceEvent:null,loadFilter:function(_4c5, _4c6, org, e) {
    this.sourceEvent = e;
    this.batchUpdateForm.loadFilter(_4c5, _4c6, org);
},createBatchUpdateForm:function(_4c9) {
    this.batchUpdateForm = new jx.form.BatchUpdateForm({filter:_4c9.filter,org:_4c9.org,project:_4c9.project,listeners:{"afterBatchUpdate":{fn:this.afterBatchUpdate,scope:this}}});
    return new Ext.Panel({autoScroll:true,items:this.batchUpdateForm});
},onUpdate:function() {
    this.batchUpdateForm.batchUpdate();
},afterBatchUpdate:function() {
    if (this.sourceEvent) {
        if (this.sourceEvent.sourceType == "grid") {
            this.sourceEvent.source.refresh();
        }
    }
    this.onCancel();
}});
jx.window.SuspectWindow = function(_4ca) {
    _4ca = Ext.applyIf(_4ca, {title:"Suspect Links",width:600,height:400,modal:false,closable:true,closeAction:"destroy",cancelAction:"destroy",maximizable:true,minimizable:false,buttons:[{text:"Close",handler:this.onCancel,scope:this}],layout:"fit",items:this.createSuspectPanel(_4ca)});
    jx.window.SuspectWindow.superclass.constructor.call(this, _4ca);
};
Ext.extend(jx.window.SuspectWindow, Ext.Window, {onEvent:function(e) {
    this.loadSuspects(e.data.project);
},loadSuspects:function(_4cc) {
    this.suspectPanel.loadSuspects(_4cc);
},createSuspectPanel:function(_4cd) {
    this.suspectPanel = new jx.panel.SuspectPanel({listeners:{showItem:this.showItem,scope:this}});
    return this.suspectPanel;
},showItem:function(item, _4cf) {
    var e = {data:{project:_4cf,item:item},source:this,sourceEl:this.el};
    this.getAppContext().fireEvent("showItem", e);
}});
Ext.reg("jx.window.SuspectWindow", jx.window.SuspectWindow);
jx.window.TraceMatrixWindow = function(_4d1) {
    _4d1 = Ext.applyIf(_4d1, {title:"Trace Matrix",width:800,height:600,modal:false,closable:true,closeAction:"destroy",cancelAction:"destroy",maximizable:true,minimizable:false,buttons:[{text:"Close",handler:this.onCancel,scope:this}],layout:"fit",items:this.createPanel(_4d1)});
    jx.window.TraceMatrixWindow.superclass.constructor.call(this, _4d1);
};
Ext.extend(jx.window.TraceMatrixWindow, Ext.Window, {onEvent:function(e) {
    this.loadMatrix(e.data.project);
},loadMatrix:function(_4d3) {
    this.panel.load(_4d3);
},createPanel:function(_4d4) {
    this.panel = new jx.panel.TraceMatrix({});
    return this.panel;
}});
Ext.reg("jx.window.TraceMatrixWindow", jx.window.TraceMatrixWindow);
jx.window.WordImportWindow = function(_4d5) {
    var _4d6 = this.createPanel(_4d5);
    _4d5 = Ext.applyIf(_4d5, {title:"Word Import",width:600,height:400,modal:false,closable:true,closeAction:"destroy",cancelAction:"destroy",maximizable:true,minimizable:false,buttons:[{text:"Import",handler:this.panel.importData,scope:this.panel},{text:"Close",handler:this.onCancel,scope:this}],layout:"fit",items:_4d6});
    jx.window.WordImportWindow.superclass.constructor.call(this, _4d5);
};
Ext.extend(jx.window.WordImportWindow, Ext.Window, {onEvent:function(e) {
},createPanel:function(_4d8) {
    this.panel = new jx.panel.WordImportPanel({project:_4d8.project,autoScroll:true,listeners:{afterImport:this.afterImport,scope:this}});
    return this.panel;
},afterImport:function(_4d9) {
    this.getAppContext().showMessage("Success", "{0} items imported", _4d9);
}});
Ext.reg("jx.window.WordImportWindow", jx.window.WordImportWindow);
jx.window.CsvImportWindow = function(_4da) {
    var _4db = this.createPanel(_4da);
    _4da = Ext.applyIf(_4da, {title:i18n.g("j.l.setImportCSV"),width:600,height:400,modal:false,closable:true,closeAction:"destroy",cancelAction:"destroy",maximizable:true,minimizable:false,buttons:[{text:"Import",handler:this.panel.importData,scope:this.panel},{text:"Close",handler:this.onCancel,scope:this}],layout:"fit",items:_4db});
    jx.window.CsvImportWindow.superclass.constructor.call(this, _4da);
};
Ext.extend(jx.window.CsvImportWindow, Ext.Window, {onEvent:function(e) {
},createPanel:function(_4dd) {
    this.panel = new jx.panel.CsvImportPanel({project:_4dd.project,autoScroll:true,listeners:{afterImport:this.afterImport,scope:this}});
    return this.panel;
},afterImport:function(_4de) {
    this.getAppContext().showMessage("Success", "{0} items imported", _4de);
}});
Ext.reg("jx.window.CsvImportWindow", jx.window.CsvImportWindow);
jx.window.ImpactWindow = function(_4df) {
    _4df = Ext.applyIf(_4df, {title:i18n.g("j-l-impact"),width:700,height:400,modal:false,closable:true,closeAction:"destroy",cancelAction:"destroy",maximizable:true,minimizable:false,buttons:[{text:i18n.g("j-b-closeImpact"),handler:this.onCancel,scope:this}],layout:"fit",items:this.createImpactPanel(_4df)});
    jx.window.ImpactWindow.superclass.constructor.call(this, _4df);
};
Ext.extend(jx.window.ImpactWindow, Ext.Window, {onEvent:function(e) {
    this.loadImpacts(e.data.item.id);
},loadImpacts:function(_4e1) {
    this.impactPanel.loadImpacts(_4e1);
},createImpactPanel:function(_4e2) {
    this.impactPanel = new jx.panel.ImpactPanel({project:_4e2.project,listeners:{showItem:this.showItem,scope:this}});
    return this.impactPanel;
},showItem:function(item, _4e4) {
    var e = {data:{project:_4e4,item:item},source:this,sourceEl:this.el};
    this.getAppContext().fireEvent("showItem", e);
}});
Ext.reg("jx.window.ImpactWindow", jx.window.ImpactWindow);
jx.window.ProjectReportWindow = function(_4e6) {
    this.data = new jx.ItemData({project:_4e6.project,org:_4e6.org});
    _4e6 = Ext.applyIf(_4e6, {title:i18n.g("j.l.reportTitle"),width:600,height:500,modal:false,closable:true,closeAction:"destroy",cancelAction:"destroy",maximizable:true,minimizable:false,layout:"fit",items:this.createReportPanel(_4e6),buttons:[{text:i18n.g("j.b.reportPreview"),handler:this.reportPanel.submitReport,scope:this.reportPanel},{text:i18n.g("j.b.reportClose"),handler:this.onCancel,scope:this}]});
    jx.window.ProjectReportWindow.superclass.constructor.call(this, _4e6);
};
Ext.extend(jx.window.ProjectReportWindow, Ext.Window, {data:this.data,onEvent:function(e) {
},createReportPanel:function(_4e8) {
    this.reportPanel = new jx.panel.ProjectReportPanel({data:this.data});
    return this.reportPanel;
}});
Ext.reg("jx.window.ProjectReportWindow", jx.window.ProjectReportWindow);
jx.window.ProjectAttachmentWindow = function(_4e9) {
    _4e9 = Ext.applyIf(_4e9, {title:i18n.g("j.b.projectFileUploadTitle"),width:500,height:200,modal:true,closable:true,closeAction:"hide",cancelAction:"hide",maximizable:true,minimizable:false,buttons:[{text:i18n.g("j.b.fileUploadSave"),handler:this.onUpload,scope:this},{text:i18n.g("j.b.fileUploadCancel"),handler:this.onCancel,scope:this}],layout:"fit",items:{items:this.createFormPanel(_4e9)}});
    jx.window.ProjectAttachmentWindow.superclass.constructor.call(this, _4e9);
};
Ext.extend(jx.window.ProjectAttachmentWindow, Ext.Window, {data:null,attachForm:null,createFormPanel:function(_4ea) {
    this.attachForm = new jx.form.AttachmentUploadForm({data:_4ea.data});
    return this.attachForm;
},loadAttachment:function(att) {
    this.attachForm.loadAttachment(att);
},getForm:function() {
    return this.attachForm;
},resetForm:function() {
    this.attachForm.getForm().reset();
},onUpload:function() {
    this.attachForm.upload();
}});
jx.window.ItemCopyWindow = function(_4ec) {
    _4ec = Ext.applyIf(_4ec, {title:i18n.g("j.b.itemCopyTitle"),width:600,height:400,modal:true,closable:true,closeAction:"hide",cancelAction:"hide",maximizable:true,minimizable:false,layout:"border",items:[this.createPanel(_4ec),this.createItemTree(_4ec),this.createProjectTree(_4ec)],buttons:[{text:i18n.g("j.b.itemCopy"),handler:this.onCopyItem,scope:this},{text:i18n.g("j.b.itemCopyCancel"),handler:this.onCancel,scope:this}]});
    jx.window.ItemCopyWindow.superclass.constructor.call(this, _4ec);
};
Ext.extend(jx.window.ItemCopyWindow, Ext.Window, {form:null,project:null,doc:null,docArr:null,refLink:false,tree:null,projectTree:null,isMultipleCopy:false,itemTypeId:null,onEvent:function(e) {
    if (e.data.itemType == "multipledoc") {
        this.isMultipleCopy = true;
        if (e.data.item && e.data.item.documentGroup && e.data.item.documentGroup.documentType) {
            this.itemTypeId = e.data.item.documentGroup.documentType.id;
        }
        this.multiload(e.data.itemArr, e.data.project);
    }
    if (e.data.itemType == "doc") {
        this.isMultipleCopy = false;
        if (e.data.item && e.data.item.documentGroup && e.data.item.documentGroup.documentType) {
            this.itemTypeId = e.data.item.documentGroup.documentType.id;
        }
        this.load(e.data.item, e.data.project);
    }
},load:function(doc, _4ef) {
    this.doc = doc;
    this.project = _4ef;
    this.panel.body.update("");
    this.getTpl().append(this.panel.body, {docName:doc.name,projectName:_4ef.name});
    this.projectTree.loadOrganization.defer(100, this.projectTree, []);
    if (doc.typeId) {
        this.tree.loadProjectType(doc.typeId, _4ef);
    } else {
        this.tree.loadProject(_4ef);
        this.getAppContext().showMessage("Info", "No type was found, tree will display all types.");
    }
},multiload:function(arr, _4f1) {
    this.docArr = arr;
    this.project = _4f1;
    this.panel.body.update("");
    this.getTpl().append(this.panel.body, {docName:"multiple items",projectName:_4f1.name});
    this.projectTree.loadOrganization.defer(100, this.projectTree, []);
    this.tree.loadProject.defer(100, this.tree, [new jx.Project({id:0,name:"Select a project"})]);
},createPanel:function(_4f2) {
    this.panel = new Ext.Panel({region:"north",height:80});
    return this.panel;
},createItemTree:function(_4f3) {
    var p = _4f3.project || {id:"0",name:"Select a project"};
    this.tree = new jx.tree.ItemTree({region:"east",title:i18n.g("j.l.itemCopySelectLocation"),width:300,tbar:[{xtype:"checkbox",listeners:{check:this.onToggleRefLink,scope:this}},i18n.g("j.l.itemCopyTraceLinkText")],folderOnly:true,root:new Ext.tree.AsyncTreeNode({text:p.name,draggable:false,iconCls:"j-project-icon",id:"p-" + p.id})});
    return this.tree;
},createProjectTree:function(_4f5) {
    var p = _4f5.org || {id:"0",name:"Select a project"};
    this.projectTree = new jx.tree.ProjectTree({region:"center",title:i18n.g("j.l.itemCopySelectProject"),root:new Ext.tree.AsyncTreeNode({text:p.name,draggable:false,iconCls:"j-organization-icon",id:"o-" + this.getAppContext().organization.id}),listeners:{click:{fn:this.loadItemTree,scope:this}}});
    this.projectTree.on("load", this.afterLoadOrganization, this);
    return this.projectTree;
},afterLoadOrganization:function() {
    project.getPath(this.project.id, this.reloadPath.createDelegate(this));
},reloadPath:function(path) {
    if (!path) {
        return;
    }
    var pos = path.lastIndexOf("/");
    if (pos > 0) {
        this.projectTree.selectPath(path);
    }
},onToggleRefLink:function(f) {
    this.refLink = f.getValue();
},loadItemTree:function(node) {
    var _4fb = node.id;
    var id = parseInt(_4fb.substring(2));
    switch (_4fb.charAt(0)) {
        case "p":
            var _4fd = this.getAppContext().getProject(id, false);
            if (this.itemTypeId) {
                this.tree.loadProjectType(this.itemTypeId, _4fd);
            } else {
                this.tree.loadProject(_4fd);
                this.getAppContext().showMessage("Info", "No type was found, tree will display all types.");
            }
            break;
        case "o":
            this.tree.loadProject(new jx.Project({id:0,name:"Select a project"}));
            break;
        default:
            this.tree.loadProject(new jx.Project({id:0,name:"Select a project"}));
            break;
    }
},onCopyItem:function() {
    var node = this.tree.getSelectionModel().getSelectedNode();
    if (node && !node.isRoot) {
        if (this.isMultipleCopy) {
            documentManager.copyMultipleDocuments(this.docArr, node.id, this.refLink, this.onSuccessMultipleCopy.createDelegate(this));
        } else {
            documentManager.copyDocument(this.doc.id, node.id, this.refLink, this.onSuccessCopy.createDelegate(this));
        }
    } else {
        this.getAppContext().showMessage("Info", "Please select a project and a set or folder to copy to");
    }
},onSuccessCopy:function(item) {
    this.showItem(item);
    this.findMe(item);
    this.getAppContext().showMessage("Success", "Copy Completed");
    this.onCancel();
},onSuccessMultipleCopy:function() {
    this.getAppContext().fireEvent("refreshItemTree");
    this.getAppContext().showMessage("Success", "Copy Completed");
    this.onCancel();
},findMe:function(item) {
    var e = {data:{project:this.project,item:item,itemType:"doc"},source:this};
    this.getAppContext().fireEvent("findMe", e);
},showItem:function(item) {
    this.getAppContext().fireEvent("showItem", {sourceType:"form",source:this,data:{project:this.project,item:{id:item.id,name:item.name}},newTab:false});
},getTpl:function() {
    if (this.tpl) {
        return this.tpl;
    }
    var w = jx.window.ItemCopyWindow;
    if (!w.tplCache) {
        w.tplCache = new Ext.XTemplate("<div class=\"j-item-copy-panel\">", "You have selected to copy {docName}.", "<br/><br/>", "Please select a destination project and indicate if you'd like a trace relationship to be created to the copied item", "</div>");
    }
    return w.tplCache;
}});
Ext.reg("jx.window.ItemCopyWindow", jx.window.ItemCopyWindow);
jx.window.ReportWindow = function(_504) {
    _504 = Ext.applyIf(_504, {title:i18n.g("j.l.reportAddTitle"),width:600,height:500,modal:true,closable:true,closeAction:"hide",cancelAction:"hide",maximizable:true,minimizable:false,buttons:[{text:i18n.g("j.b.reportSave"),handler:this.onSave,scope:this},{text:i18n.g("j.b.reportUpload"),handler:this.onUpload,scope:this},{text:i18n.g("j.b.reportFileDelete"),handler:this.onDeleteReportFile,scope:this},{text:i18n.g("j.b.reportCancel"),handler:this.onCancel,scope:this}],layout:"fit",items:this.createTabPanel(_504)});
    jx.window.ReportWindow.superclass.constructor.call(this, _504);
};
Ext.extend(jx.window.ReportWindow, Ext.Window, {data:null,reportForm:null,uploadForm:null,noteForm:null,baseUrl:"",uploadUrl:"reportUpload.req",setItem:function(item) {
    this.reportForm.setItem(item);
},createTabPanel:function(_506) {
    this.reportForm = this.createReportForm(_506);
    this.uploadForm = this.createUploadForm(_506);
    return new Ext.TabPanel({activeItem:0,items:[{title:i18n.g("j.l.reportTabTitle"),items:this.reportForm,listeners:{activate:this.clickReportFormTab,scope:this}},this.uploadForm]});
},clickReportFormTab:function(tab) {
    this.buttons[0].show();
    this.buttons[2].show();
    this.buttons[1].hide();
},clickUploadFormTab:function(tab) {
    this.buttons[0].hide();
    this.buttons[2].hide();
    this.buttons[1].show();
},createReportForm:function() {
    return new jx.form.JamaForm({formType:"editOnly",showButtons:false,showTitle:false,title:"Test Jama Form",alternateRows:false,labelClass:"label",defaultDateFormat:this.defaultDateFormat,fieldDefinitions:this.getFormDefinitions()});
},getFormDefinitions:function() {
    var self = this;
    this.loadAttachmentList();
    admin.getOrganizationList({callback:function(list) {
        self.orgList = list;
    },async:false});
    this.orgList.unshift({id:"",name:"Any Organization"});
    report.getReportCriterionList({callback:function(list) {
        self.criterionList = list;
    },async:false});
    return ([{field:"name",label:"Report Name",required:true},{field:"mainReportFile",label:"Report File Name",dataType:"lookup",idField:"id",displayField:"fileName",options:this.attachmentList},{field:"description",label:"Description"},{field:"refId",label:"Organization",dataType:"lookup",idField:"id",options:this.orgList},{field:"visible",label:"Visible to Users",dataType:"boolean"},{field:"criterions",label:"Report Criterions",dataType:"multiCheckboxes",returnIds:true,idField:"name",displayField:"description",options:this.criterionList}]);
},loadAttachmentList:function() {
    var self = this;
    report.getReportAttachmentList({callback:function(list) {
        self.attachmentList = list;
    },async:false});
    if (this.rendered) {
        this.reportForm.getFieldMeta("mainReportFile").options = this.attachmentList;
        this.reportForm.setItem(this.reportForm.item);
    }
},createUploadForm:function(_50e) {
    return new Ext.form.FormPanel({title:i18n.g("j.l.reportTabUpload"),baseCls:"x-plain",labelWidth:100,defaultType:"textfield",labelAlign:"left",bodyStyle:"padding:10px",fileUpload:true,baseUrl:this.getAppContext().baseUrl,listeners:{activate:this.clickUploadFormTab,scope:this},items:[{fieldLabel:i18n.g("j.l.uploadFileName"),name:"report_file",allowBlank:true,inputType:"file",anchor:"100%",autoCreate:{tag:"input",type:"file",size:"50",autocomplete:"off"}}]});
},onUpload:function() {
    var _50f = this.uploadForm.getForm().findField("report_file").getRawValue();
    if (_50f.lastIndexOf(".rptdesign") < 0 && _50f.lastIndexOf(".rptlibrary") < 0) {
        Ext.MessageBox.alert("Validation Error", "Only BIRT report files can be loaded");
        return;
    }
    this.uploadForm.getForm().submit({waitMsg:i18n.g("j.l.uploadingWaitMessge"),url:this.baseUrl + this.uploadUrl,reset:false,success:this.uploadCallback.createDelegate(this),failure:this.handleFailure.createDelegate(this)});
},onDeleteReportFile:function() {
    var file = this.reportForm.getUpdatedItem().mainReportFile;
    if (file != null) {
        Ext.MessageBox.confirm("Confirm", String.format("Are you sure you want to delete the report file {0}?", file.fileName), this.deleteReportFileCallback.createDelegate(this, [file], 0));
    }
},deleteReportFileCallback:function(file, _512) {
    if (_512 == "yes") {
        report.deleteReportAttachment(file, {callback:this.loadAttachmentList.createDelegate(this),errorHandler:function() {
            Ext.MessageBox.alert("Warning", "Can't delete the file. Delete the reports associated with the file first.");
        }});
    }
},uploadCallback:function() {
    this.loadAttachmentList();
    this.uploadForm.getForm().reset();
    this.getAppContext().showMessage("Success", "Report file is uploaded");
},handleFailure:function(form, _514) {
    Ext.MessageBox.alert("Failure", String.format("Report file can not be uploaded. Cause: {0}", _514.result.data.cause));
},onSave:function() {
    var item = this.reportForm.getUpdatedItem();
    item.refId = item.refId ? item.refId.id : null;
    if (item.refId) {
        item.scope = 2;
    }
    var self = this;
    validation.validateReport(item, {callback:function(_517) {
        self.errors = _517;
        self.isValid = !(_517 && _517.length > 0);
    },async:false});
    if (!self.isValid) {
        Ext.MessageBox.alert(i18n.g("j.m.reportErrorPrefix"), this.errors.join("<br/>"));
        return;
    }
    report.saveReport(item, this.onSaveCallback.createDelegate(this));
},onSaveCallback:function(item) {
    this.getAppContext().showMessage("Success", "Report is saved");
    this.fireEvent("afterSaveReport", item);
    this.hide();
}});
jx.window.ItemPreviewWindow = function(_519) {
    _519 = Ext.applyIf(_519, {width:600,height:400,modal:false,closable:true,closeAction:"hide",cancelAction:"hide",maximizable:true,minimizable:false,layout:"fit",items:{xtype:"panel",autoScroll:true,items:this.createWidget()},buttons:[{text:"Close",handler:this.onCancel,scope:this}]});
    jx.window.ItemPreviewWindow.superclass.constructor.call(this, _519);
};
Ext.extend(jx.window.ItemPreviewWindow, Ext.Window, {data:null,simpleForm:null,onEvent:function(e) {
    this.loadArtifact(e.data.item.id, e.data.project);
},loadArtifact:function(_51b, _51c) {
    if (!this.simpleForm) {
        this.simpleForm = this.createWidget();
    }
    this.simpleForm.loadArtifact(_51b);
},createWidget:function() {
    var _51d = this.getAppContext().getDayMonthYearFormat();
    var w = new jx.form.SimpleItemForm({showButtons:false,showTitle:false,defaultDateFormat:_51d});
    this.simpleForm = w;
    return w;
},render:function() {
    jx.window.ItemPreviewWindow.superclass.render.apply(this, arguments);
},beforeDestroy:function() {
    jx.window.ItemPreviewWindow.superclass.beforeDestroy.apply(this, arguments);
}});
Ext.reg("jx.window.ItemPreviewWindow", jx.window.ItemPreviewWindow);


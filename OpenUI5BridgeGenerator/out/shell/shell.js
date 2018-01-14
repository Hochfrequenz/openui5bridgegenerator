import { bindable, customElement, noView } from 'aurelia-templating';
import { inject } from 'aurelia-dependency-injection';
import { computedFrom } from 'aurelia-framework';
import { AttributeManager } from '../common/attributeManager';
import { getBooleanFromAttributeValue } from '../common/attributes';
import { Ui5Control} from '../control/control';
@customElement('ui5-shell')
@inject(Element)
export class Ui5Shell extends Ui5Control{
        _shell = null;
        _parent = null;
        _relation = null;
         @bindable ui5Id = null;
        @bindable() title = null;
@bindable() logo = null;
@bindable() showLogout = true;
@bindable() headerRightText = null;
@bindable() appWidthLimited = true;
@bindable() backgroundColor = null;
@bindable() backgroundImage = null;
@bindable() backgroundRepeat = false;
@bindable() backgroundOpacity = 1;
@bindable() homeIcon = null;
@bindable() titleLevel = 'H1';
@bindable() logout = this.defaultFunc;
/* inherited from sap.ui.core.Control*/
@bindable() busy = false;
@bindable() busyIndicatorDelay = 1000;
@bindable() visible = true;
@bindable() fieldGroupIds = '[]';
@bindable() validateFieldGroup = this.defaultFunc;

                constructor(element) {
                    super(element);                    
                this.element = element;
            this.attributeManager = new AttributeManager(this.element);
        }
        @computedFrom('_shell')
        get UIElement() {
            return this._shell;
          }
        fillProperties(params){
               params.title = this.title;
params.logo = this.logo;
params.showLogout = getBooleanFromAttributeValue(this.showLogout);
params.headerRightText = this.headerRightText;
params.appWidthLimited = getBooleanFromAttributeValue(this.appWidthLimited);
params.backgroundColor = this.backgroundColor;
params.backgroundImage = this.backgroundImage;
params.backgroundRepeat = getBooleanFromAttributeValue(this.backgroundRepeat);
params.backgroundOpacity = this.backgroundOpacity;
params.homeIcon = this.homeIcon;
params.titleLevel = this.titleLevel;
            
        }
        defaultFunc() {
                        }
                        attached() {
            var that = this;
            var params = {};
            this.fillProperties(params);
                                         super.fillProperties(params);   
         if (this.ui5Id)
          this._shell = new sap.m.Shell(this.ui5Id, params);
        else
          this._shell = new sap.m.Shell(params);
        if ($(this.element).closest("[ui5-container]").length > 0) {
                                            this._parent = $(this.element).closest("[ui5-container]")[0].au.controller.viewModel;
                                        if (!this._parent.UIElement || (this._parent.UIElement.sId != this._shell.sId)) {
        var prevSibling = null;
        if (this.element.previousElementSibling)
          prevSibling = this.element.previousElementSibling.au.controller.viewModel.UIElement;
        this._relation = this._parent.addChild(this._shell, this.element, prevSibling);
        this.attributeManager.addAttributes({"ui5-container": '' });
      }
      else {
                                                    this._parent = $(this.element.parentElement).closest("[ui5-container]")[0].au.controller.viewModel;
                                                var prevSibling = null;
        if (this.element.previousElementSibling) {
                                                    prevSibling = this.element.previousElementSibling.au.controller.viewModel.UIElement;
                                                this._relation = this._parent.addChild(this._shell, this.element, prevSibling);
        }
        else
          this._relation = this._parent.addChild(this._shell, this.element);
        this.attributeManager.addAttributes({"ui5-container": '' });
      }
    }
    else {
                                                            if(this._shell.placeAt)
                                                                this._shell.placeAt(this.element.parentElement);
                                                        this.attributeManager.addAttributes({"ui5-container": '' });
                                                        this.attributeManager.addClasses("ui5-hide");
    }
        
                                                        //<!container>
           
                                                        //</!container>
                                                        this.attributeManager.addAttributes({"ui5-id": this._shell.sId});
                                                                           
           
        }
    detached() {
        if (this._parent && this._relation) {
                                                                this._parent.removeChildByRelation(this._shell, this._relation);
                                                            }
         else{
                                                                this._shell.destroy();
                                                            }
         super.detached();
        }

    addChild(child, elem, afterElement) {
        var path = jQuery.makeArray($(elem).parentsUntil(this.element));
        for (elem of path) {
                                                                if (elem.localName == 'content') { this._shell.setApp(child); return elem.localName;}

                                                                    }
      }
      removeChildByRelation(child, relation) {
                                                                        
                                                                            }
    titleChanged(newValue){if(this._shell!==null){ this._shell.setTitle(newValue);}}
logoChanged(newValue){if(this._shell!==null){ this._shell.setLogo(newValue);}}
showLogoutChanged(newValue){if(this._shell!==null){ this._shell.setShowLogout(getBooleanFromAttributeValue(newValue));}}
headerRightTextChanged(newValue){if(this._shell!==null){ this._shell.setHeaderRightText(newValue);}}
appWidthLimitedChanged(newValue){if(this._shell!==null){ this._shell.setAppWidthLimited(getBooleanFromAttributeValue(newValue));}}
backgroundColorChanged(newValue){if(this._shell!==null){ this._shell.setBackgroundColor(newValue);}}
backgroundImageChanged(newValue){if(this._shell!==null){ this._shell.setBackgroundImage(newValue);}}
backgroundRepeatChanged(newValue){if(this._shell!==null){ this._shell.setBackgroundRepeat(getBooleanFromAttributeValue(newValue));}}
backgroundOpacityChanged(newValue){if(this._shell!==null){ this._shell.setBackgroundOpacity(newValue);}}
homeIconChanged(newValue){if(this._shell!==null){ this._shell.setHomeIcon(newValue);}}
titleLevelChanged(newValue){if(this._shell!==null){ this._shell.setTitleLevel(newValue);}}
logoutChanged(newValue){if(this._shell!==null){ this._shell.attachLogout(newValue);}}
busyChanged(newValue){if(this._shell!==null){ this._shell.setBusy(getBooleanFromAttributeValue(newValue));}}
busyIndicatorDelayChanged(newValue){if(this._shell!==null){ this._shell.setBusyIndicatorDelay(newValue);}}
visibleChanged(newValue){if(this._shell!==null){ this._shell.setVisible(getBooleanFromAttributeValue(newValue));}}
fieldGroupIdsChanged(newValue){if(this._shell!==null){ this._shell.setFieldGroupIds(newValue);}}
/* inherited from sap.ui.core.Control*/
validateFieldGroupChanged(newValue){if(this._shell!==null){ this._shell.attachValidateFieldGroup(newValue);}}


                                                                                }
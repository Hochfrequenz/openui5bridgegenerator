import { bindable, customElement, noView } from 'aurelia-templating';
import { inject } from 'aurelia-dependency-injection';
import { computedFrom } from 'aurelia-framework';
import { AttributeManager } from '../common/attributeManager';
import { getBooleanFromAttributeValue } from '../common/attributes';
import { Ui5Control} from '../control/control';
@customElement('ui5-page')
@inject(Element)
export class Ui5Page extends Ui5Control{
        _page = null;
        _parent = null;
        _relation = null;
         @bindable ui5Id = null;
        @bindable() title = null;
@bindable() titleLevel = 'Auto';
@bindable() showNavButton = false;
@bindable() showHeader = true;
@bindable() showSubHeader = true;
@bindable() navButtonTooltip = null;
@bindable() enableScrolling = true;
@bindable() backgroundDesign = 'Standard';
@bindable() showFooter = true;
@bindable() contentOnlyBusy = false;
@bindable() floatingFooter = false;
@bindable() navButtonPress = this.defaultFunc;
/* inherited from sap.ui.core.Control*/
@bindable() busy = false;
@bindable() busyIndicatorDelay = 1000;
@bindable() visible = true;
@bindable() fieldGroupIds = '[]';
@bindable() validateFieldGroup = this.defaultFunc;
/* inherited from sap.ui.core.Element*/
/* inherited from sap.ui.base.ManagedObject*/
@bindable() validationSuccess = this.defaultFunc;
@bindable() validationError = this.defaultFunc;
@bindable() parseError = this.defaultFunc;
@bindable() formatError = this.defaultFunc;
@bindable() modelContextChange = this.defaultFunc;
/* inherited from sap.ui.base.EventProvider*/
/* inherited from sap.ui.base.Object*/

                constructor(element) {
                    super(element);                    
                this.element = element;
            this.attributeManager = new AttributeManager(this.element);
        }
        @computedFrom('_page')
        get UIElement() {
            return this._page;
          }
        fillProperties(params){
               params.title = this.title;
params.titleLevel = this.titleLevel;
params.showNavButton = getBooleanFromAttributeValue(this.showNavButton);
params.showHeader = getBooleanFromAttributeValue(this.showHeader);
params.showSubHeader = getBooleanFromAttributeValue(this.showSubHeader);
params.navButtonTooltip = this.navButtonTooltip;
params.enableScrolling = getBooleanFromAttributeValue(this.enableScrolling);
params.backgroundDesign = this.backgroundDesign;
params.showFooter = getBooleanFromAttributeValue(this.showFooter);
params.contentOnlyBusy = getBooleanFromAttributeValue(this.contentOnlyBusy);
params.floatingFooter = getBooleanFromAttributeValue(this.floatingFooter);
params.navButtonPress = this.navButtonPress==null ? this.defaultFunc: this.navButtonPress;
            
        }
        defaultFunc() {
                        }
                        attached() {
            var that = this;
            var params = {};
            this.fillProperties(params);
                                         super.fillProperties(params);   
         if (this.ui5Id)
          this._page = new sap.m.Page(this.ui5Id, params);
        else
          this._page = new sap.m.Page(params);
        
        if ($(this.element).closest("[ui5-container]").length > 0) {
                                            this._parent = $(this.element).closest("[ui5-container]")[0].au.controller.viewModel;
                                        if (!this._parent.UIElement || (this._parent.UIElement.sId != this._page.sId)) {
        var prevSibling = null;
        if (this.element.previousElementSibling && this.element.previousElementSibling.au)
          prevSibling = this.element.previousElementSibling.au.controller.viewModel.UIElement;
        this._relation = this._parent.addChild(this._page, this.element, prevSibling);
        this.attributeManager.addAttributes({"ui5-container": '' });
      }
      else {
                                                    this._parent = $(this.element.parentElement).closest("[ui5-container]")[0].au.controller.viewModel;
                                                var prevSibling = null;
        if (this.element.previousElementSibling && this.element.previousElementSibling.au) {
                                                    prevSibling = this.element.previousElementSibling.au.controller.viewModel.UIElement;
                                                this._relation = this._parent.addChild(this._page, this.element, prevSibling);
        }
        else
          this._relation = this._parent.addChild(this._page, this.element);
        this.attributeManager.addAttributes({"ui5-container": '' });
      }
    }
    else {
                                                            if(this._page.placeAt)
                                                                this._page.placeAt(this.element.parentElement);
                                                        this.attributeManager.addAttributes({"ui5-container": '' });
                                                        this.attributeManager.addClasses("ui5-hide");
    }
        
                                                        //<!container>
           
                                                        //</!container>
                                                        this.attributeManager.addAttributes({"ui5-id": this._page.sId});
                                                                           
           
        }
    detached() {
        try{
          if ($(this.element).closest("[ui5-container]").length > 0) {
        if (this._parent && this._relation) {
                                                                this._parent.removeChildByRelation(this._page, this._relation);
                                                            }
                                                                                }
         else{
                                                                this._page.destroy();
                                                            }
         super.detached();
          }
         catch(err){}
        }

    addChild(child, elem, afterElement) {
        var path = jQuery.makeArray($(elem).parentsUntil(this.element));
        for (elem of path) {
        try{
                 if (elem.localName == 'content') { var _index = null; if (afterElement) _index = this._page.indexOfContent(afterElement); if (_index)this._page.insertContent(child, _index + 1); else this._page.addContent(child, 0);  return elem.localName; }
if (elem.localName == 'customheader') { this._page.setCustomHeader(child); return elem.localName;}
if (elem.localName == 'footer') { this._page.setFooter(child); return elem.localName;}
if (elem.localName == 'subheader') { this._page.setSubHeader(child); return elem.localName;}
if (elem.localName == 'headercontent') { var _index = null; if (afterElement) _index = this._page.indexOfHeaderContent(afterElement); if (_index)this._page.insertHeaderContent(child, _index + 1); else this._page.addHeaderContent(child, 0);  return elem.localName; }
if (elem.localName == 'landmarkinfo') { this._page.setLandmarkInfo(child); return elem.localName;}
if (elem.localName == 'tooltip') { this._page.setTooltip(child); return elem.localName;}
if (elem.localName == 'customdata') { var _index = null; if (afterElement) _index = this._page.indexOfCustomData(afterElement); if (_index)this._page.insertCustomData(child, _index + 1); else this._page.addCustomData(child, 0);  return elem.localName; }
if (elem.localName == 'layoutdata') { this._page.setLayoutData(child); return elem.localName;}
if (elem.localName == 'dependents') { var _index = null; if (afterElement) _index = this._page.indexOfDependent(afterElement); if (_index)this._page.insertDependent(child, _index + 1); else this._page.addDependent(child, 0);  return elem.localName; }

           }
           catch(err){}
                                                                    }
      }
      removeChildByRelation(child, relation) {
      try{
               if (relation == 'content') {  this._page.removeContent(child); }
if (relation == 'customHeader') {  this._page.destroyCustomHeader(child); }
if (relation == 'footer') {  this._page.destroyFooter(child); }
if (relation == 'subHeader') {  this._page.destroySubHeader(child); }
if (relation == 'headerContent') {  this._page.removeHeaderContent(child); }
if (relation == 'landmarkInfo') {  this._page.destroyLandmarkInfo(child); }
if (relation == 'tooltip') {  this._page.destroyTooltip(child); }
if (relation == 'customData') {  this._page.removeCustomData(child); }
if (relation == 'layoutData') {  this._page.destroyLayoutData(child); }
if (relation == 'dependents') {  this._page.removeDependent(child); }

      }
      catch(err){}
                                                                            }
    titleChanged(newValue){if(this._page!==null){ this._page.setTitle(newValue);}}
titleLevelChanged(newValue){if(this._page!==null){ this._page.setTitleLevel(newValue);}}
showNavButtonChanged(newValue){if(this._page!==null){ this._page.setShowNavButton(getBooleanFromAttributeValue(newValue));}}
showHeaderChanged(newValue){if(this._page!==null){ this._page.setShowHeader(getBooleanFromAttributeValue(newValue));}}
showSubHeaderChanged(newValue){if(this._page!==null){ this._page.setShowSubHeader(getBooleanFromAttributeValue(newValue));}}
navButtonTooltipChanged(newValue){if(this._page!==null){ this._page.setNavButtonTooltip(newValue);}}
enableScrollingChanged(newValue){if(this._page!==null){ this._page.setEnableScrolling(getBooleanFromAttributeValue(newValue));}}
backgroundDesignChanged(newValue){if(this._page!==null){ this._page.setBackgroundDesign(newValue);}}
showFooterChanged(newValue){if(this._page!==null){ this._page.setShowFooter(getBooleanFromAttributeValue(newValue));}}
contentOnlyBusyChanged(newValue){if(this._page!==null){ this._page.setContentOnlyBusy(getBooleanFromAttributeValue(newValue));}}
floatingFooterChanged(newValue){if(this._page!==null){ this._page.setFloatingFooter(getBooleanFromAttributeValue(newValue));}}
navButtonPressChanged(newValue){if(this._page!==null){ this._page.attachNavButtonPress(newValue);}}
busyChanged(newValue){if(this._page!==null){ this._page.setBusy(getBooleanFromAttributeValue(newValue));}}
busyIndicatorDelayChanged(newValue){if(this._page!==null){ this._page.setBusyIndicatorDelay(newValue);}}
visibleChanged(newValue){if(this._page!==null){ this._page.setVisible(getBooleanFromAttributeValue(newValue));}}
fieldGroupIdsChanged(newValue){if(this._page!==null){ this._page.setFieldGroupIds(newValue);}}
/* inherited from sap.ui.core.Control*/
validateFieldGroupChanged(newValue){if(this._page!==null){ this._page.attachValidateFieldGroup(newValue);}}
/* inherited from sap.ui.core.Element*/
/* inherited from sap.ui.base.ManagedObject*/
validationSuccessChanged(newValue){if(this._page!==null){ this._page.attachValidationSuccess(newValue);}}
validationErrorChanged(newValue){if(this._page!==null){ this._page.attachValidationError(newValue);}}
parseErrorChanged(newValue){if(this._page!==null){ this._page.attachParseError(newValue);}}
formatErrorChanged(newValue){if(this._page!==null){ this._page.attachFormatError(newValue);}}
modelContextChangeChanged(newValue){if(this._page!==null){ this._page.attachModelContextChange(newValue);}}
/* inherited from sap.ui.base.EventProvider*/
/* inherited from sap.ui.base.Object*/


                                                                                }
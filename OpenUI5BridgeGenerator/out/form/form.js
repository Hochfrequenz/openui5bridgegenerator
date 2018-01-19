import { bindable, customElement, noView } from 'aurelia-templating';
import { inject } from 'aurelia-dependency-injection';
import { computedFrom } from 'aurelia-framework';
import { AttributeManager } from '../common/attributeManager';
import { getBooleanFromAttributeValue } from '../common/attributes';
import { Ui5Control} from '../control/control';
@customElement('ui5-form')
@inject(Element)
export class Ui5Form extends Ui5Control{
        _form = null;
        _parent = null;
        _relation = null;
         @bindable ui5Id = null;
        @bindable() width = null;
@bindable() editable = false;
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
        @computedFrom('_form')
        get UIElement() {
            return this._form;
          }
        fillProperties(params){
               params.width = this.width;
params.editable = getBooleanFromAttributeValue(this.editable);
            
        }
        defaultFunc() {
                        }
                        attached() {
            var that = this;
            var params = {};
            this.fillProperties(params);
                                         super.fillProperties(params);   
         if (this.ui5Id)
          this._form = new sap.ui.layout.form.Form(this.ui5Id, params);
        else
          this._form = new sap.ui.layout.form.Form(params);
        
        if ($(this.element).closest("[ui5-container]").length > 0) {
                                            this._parent = $(this.element).closest("[ui5-container]")[0].au.controller.viewModel;
                                        if (!this._parent.UIElement || (this._parent.UIElement.sId != this._form.sId)) {
        var prevSibling = null;
        if (this.element.previousElementSibling && this.element.previousElementSibling.au)
          prevSibling = this.element.previousElementSibling.au.controller.viewModel.UIElement;
        this._relation = this._parent.addChild(this._form, this.element, prevSibling);
        this.attributeManager.addAttributes({"ui5-container": '' });
      }
      else {
                                                    this._parent = $(this.element.parentElement).closest("[ui5-container]")[0].au.controller.viewModel;
                                                var prevSibling = null;
        if (this.element.previousElementSibling && this.element.previousElementSibling.au) {
                                                    prevSibling = this.element.previousElementSibling.au.controller.viewModel.UIElement;
                                                this._relation = this._parent.addChild(this._form, this.element, prevSibling);
        }
        else
          this._relation = this._parent.addChild(this._form, this.element);
        this.attributeManager.addAttributes({"ui5-container": '' });
      }
    }
    else {
                                                            if(this._form.placeAt)
                                                                this._form.placeAt(this.element.parentElement);
                                                        this.attributeManager.addAttributes({"ui5-container": '' });
                                                        this.attributeManager.addClasses("ui5-hide");
    }
        
                                                        //<!container>
           
                                                        //</!container>
                                                        this.attributeManager.addAttributes({"ui5-id": this._form.sId});
                                                                           
           
        }
    detached() {
        try{
          if ($(this.element).closest("[ui5-container]").length > 0) {
        if (this._parent && this._relation) {
                                                                this._parent.removeChildByRelation(this._form, this._relation);
                                                            }
                                                                                }
         else{
                                                                this._form.destroy();
                                                            }
         super.detached();
          }
         catch(err){}
        }

    addChild(child, elem, afterElement) {
        var path = jQuery.makeArray($(elem).parentsUntil(this.element));
        for (elem of path) {
        try{
                 if (elem.localName == 'formcontainers') { var _index = null; if (afterElement) _index = this._form.indexOfFormContainer(afterElement); if (_index)this._form.insertFormContainer(child, _index + 1); else this._form.addFormContainer(child, 0);  return elem.localName; }
if (elem.localName == 'title') { this._form.setTitle(child); return elem.localName;}
if (elem.localName == 'toolbar') { this._form.setToolbar(child); return elem.localName;}
if (elem.localName == 'layout') { this._form.setLayout(child); return elem.localName;}
if (elem.localName == 'tooltip') { this._form.setTooltip(child); return elem.localName;}
if (elem.localName == 'customdata') { var _index = null; if (afterElement) _index = this._form.indexOfCustomData(afterElement); if (_index)this._form.insertCustomData(child, _index + 1); else this._form.addCustomData(child, 0);  return elem.localName; }
if (elem.localName == 'layoutdata') { this._form.setLayoutData(child); return elem.localName;}
if (elem.localName == 'dependents') { var _index = null; if (afterElement) _index = this._form.indexOfDependent(afterElement); if (_index)this._form.insertDependent(child, _index + 1); else this._form.addDependent(child, 0);  return elem.localName; }

           }
           catch(err){}
                                                                    }
      }
      removeChildByRelation(child, relation) {
      try{
               if (relation == 'formcontainers') {  this._form.removeFormContainer(child);}
if (relation == 'title') {  this._form.destroyTitle(child); }
if (relation == 'toolbar') {  this._form.destroyToolbar(child); }
if (relation == 'layout') {  this._form.destroyLayout(child); }
if (relation == 'tooltip') {  this._form.destroyTooltip(child); }
if (relation == 'customdata') {  this._form.removeCustomData(child);}
if (relation == 'layoutData') {  this._form.destroyLayoutData(child); }
if (relation == 'dependents') {  this._form.removeDependent(child);}

      }
      catch(err){}
                                                                            }
    widthChanged(newValue){if(this._form!==null){ this._form.setWidth(newValue);}}
editableChanged(newValue){if(this._form!==null){ this._form.setEditable(getBooleanFromAttributeValue(newValue));}}
busyChanged(newValue){if(this._form!==null){ this._form.setBusy(getBooleanFromAttributeValue(newValue));}}
busyIndicatorDelayChanged(newValue){if(this._form!==null){ this._form.setBusyIndicatorDelay(newValue);}}
visibleChanged(newValue){if(this._form!==null){ this._form.setVisible(getBooleanFromAttributeValue(newValue));}}
fieldGroupIdsChanged(newValue){if(this._form!==null){ this._form.setFieldGroupIds(newValue);}}
/* inherited from sap.ui.core.Control*/
validateFieldGroupChanged(newValue){if(this._form!==null){ this._form.attachValidateFieldGroup(newValue);}}
/* inherited from sap.ui.core.Element*/
/* inherited from sap.ui.base.ManagedObject*/
validationSuccessChanged(newValue){if(this._form!==null){ this._form.attachValidationSuccess(newValue);}}
validationErrorChanged(newValue){if(this._form!==null){ this._form.attachValidationError(newValue);}}
parseErrorChanged(newValue){if(this._form!==null){ this._form.attachParseError(newValue);}}
formatErrorChanged(newValue){if(this._form!==null){ this._form.attachFormatError(newValue);}}
modelContextChangeChanged(newValue){if(this._form!==null){ this._form.attachModelContextChange(newValue);}}
/* inherited from sap.ui.base.EventProvider*/
/* inherited from sap.ui.base.Object*/


                                                                                }
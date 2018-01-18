import { bindable, customElement, noView } from 'aurelia-templating';
import { inject } from 'aurelia-dependency-injection';
import { computedFrom } from 'aurelia-framework';
import { AttributeManager } from '../common/attributeManager';
import { getBooleanFromAttributeValue } from '../common/attributes';
import { Ui5Element} from '../element/element';
@customElement('ui5-form-container')
@inject(Element)
export class Ui5FormContainer extends Ui5Element{
        _formcontainer = null;
        _parent = null;
        _relation = null;
         @bindable ui5Id = null;
        @bindable() expanded = true;
@bindable() expandable = false;
@bindable() visible = true;
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
        @computedFrom('_formcontainer')
        get UIElement() {
            return this._formcontainer;
          }
        fillProperties(params){
               params.expanded = getBooleanFromAttributeValue(this.expanded);
params.expandable = getBooleanFromAttributeValue(this.expandable);
params.visible = getBooleanFromAttributeValue(this.visible);
            
        }
        defaultFunc() {
                        }
                        attached() {
            var that = this;
            var params = {};
            this.fillProperties(params);
                                         super.fillProperties(params);   
         if (this.ui5Id)
          this._formcontainer = new sap.ui.layout.form.FormContainer(this.ui5Id, params);
        else
          this._formcontainer = new sap.ui.layout.form.FormContainer(params);
        
        if ($(this.element).closest("[ui5-container]").length > 0) {
                                            this._parent = $(this.element).closest("[ui5-container]")[0].au.controller.viewModel;
                                        if (!this._parent.UIElement || (this._parent.UIElement.sId != this._formcontainer.sId)) {
        var prevSibling = null;
        if (this.element.previousElementSibling && this.element.previousElementSibling.au)
          prevSibling = this.element.previousElementSibling.au.controller.viewModel.UIElement;
        this._relation = this._parent.addChild(this._formcontainer, this.element, prevSibling);
        this.attributeManager.addAttributes({"ui5-container": '' });
      }
      else {
                                                    this._parent = $(this.element.parentElement).closest("[ui5-container]")[0].au.controller.viewModel;
                                                var prevSibling = null;
        if (this.element.previousElementSibling && this.element.previousElementSibling.au) {
                                                    prevSibling = this.element.previousElementSibling.au.controller.viewModel.UIElement;
                                                this._relation = this._parent.addChild(this._formcontainer, this.element, prevSibling);
        }
        else
          this._relation = this._parent.addChild(this._formcontainer, this.element);
        this.attributeManager.addAttributes({"ui5-container": '' });
      }
    }
    else {
                                                            if(this._formcontainer.placeAt)
                                                                this._formcontainer.placeAt(this.element.parentElement);
                                                        this.attributeManager.addAttributes({"ui5-container": '' });
                                                        this.attributeManager.addClasses("ui5-hide");
    }
        
                                                        //<!container>
           
                                                        //</!container>
                                                        this.attributeManager.addAttributes({"ui5-id": this._formcontainer.sId});
                                                                           
           
        }
    detached() {
        try{
          if ($(this.element).closest("[ui5-container]").length > 0) {
        if (this._parent && this._relation) {
                                                                this._parent.removeChildByRelation(this._formcontainer, this._relation);
                                                            }
                                                                                }
         else{
                                                                this._formcontainer.destroy();
                                                            }
         super.detached();
          }
         catch(err){}
        }

    addChild(child, elem, afterElement) {
        var path = jQuery.makeArray($(elem).parentsUntil(this.element));
        for (elem of path) {
        try{
                 if (elem.localName == 'formelements') { var _index = null; if (afterElement) _index = this._formcontainer.indexOfFormElement(afterElement); if (_index)this._formcontainer.insertFormElement(child, _index + 1); else this._formcontainer.addFormElement(child, 0);  return elem.localName; }
if (elem.localName == 'title') { this._formcontainer.setTitle(child); return elem.localName;}
if (elem.localName == 'toolbar') { this._formcontainer.setToolbar(child); return elem.localName;}
if (elem.localName == 'tooltip') { this._formcontainer.setTooltip(child); return elem.localName;}
if (elem.localName == 'customdata') { var _index = null; if (afterElement) _index = this._formcontainer.indexOfCustomData(afterElement); if (_index)this._formcontainer.insertCustomData(child, _index + 1); else this._formcontainer.addCustomData(child, 0);  return elem.localName; }
if (elem.localName == 'layoutdata') { this._formcontainer.setLayoutData(child); return elem.localName;}
if (elem.localName == 'dependents') { var _index = null; if (afterElement) _index = this._formcontainer.indexOfDependent(afterElement); if (_index)this._formcontainer.insertDependent(child, _index + 1); else this._formcontainer.addDependent(child, 0);  return elem.localName; }

           }
           catch(err){}
                                                                    }
      }
      removeChildByRelation(child, relation) {
      try{
               if (relation == 'formElements') {  this._formcontainer.removeFormElement(child); }
if (relation == 'title') {  this._formcontainer.destroyTitle(child); }
if (relation == 'toolbar') {  this._formcontainer.destroyToolbar(child); }
if (relation == 'tooltip') {  this._formcontainer.destroyTooltip(child); }
if (relation == 'customData') {  this._formcontainer.removeCustomData(child); }
if (relation == 'layoutData') {  this._formcontainer.destroyLayoutData(child); }
if (relation == 'dependents') {  this._formcontainer.removeDependent(child); }

      }
      catch(err){}
                                                                            }
    expandedChanged(newValue){if(this._formcontainer!==null){ this._formcontainer.setExpanded(getBooleanFromAttributeValue(newValue));}}
expandableChanged(newValue){if(this._formcontainer!==null){ this._formcontainer.setExpandable(getBooleanFromAttributeValue(newValue));}}
visibleChanged(newValue){if(this._formcontainer!==null){ this._formcontainer.setVisible(getBooleanFromAttributeValue(newValue));}}
/* inherited from sap.ui.core.Element*/
/* inherited from sap.ui.base.ManagedObject*/
validationSuccessChanged(newValue){if(this._formcontainer!==null){ this._formcontainer.attachValidationSuccess(newValue);}}
validationErrorChanged(newValue){if(this._formcontainer!==null){ this._formcontainer.attachValidationError(newValue);}}
parseErrorChanged(newValue){if(this._formcontainer!==null){ this._formcontainer.attachParseError(newValue);}}
formatErrorChanged(newValue){if(this._formcontainer!==null){ this._formcontainer.attachFormatError(newValue);}}
modelContextChangeChanged(newValue){if(this._formcontainer!==null){ this._formcontainer.attachModelContextChange(newValue);}}
/* inherited from sap.ui.base.EventProvider*/
/* inherited from sap.ui.base.Object*/


                                                                                }
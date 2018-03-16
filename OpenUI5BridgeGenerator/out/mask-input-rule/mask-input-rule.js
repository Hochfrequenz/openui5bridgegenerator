import { bindable, customElement, noView } from 'aurelia-templating';
import { inject } from 'aurelia-dependency-injection';
import { computedFrom } from 'aurelia-framework';
import { AttributeManager } from '../common/attributeManager';
import { getBooleanFromAttributeValue } from '../common/attributes';
import { Ui5Element} from '../element/element';
@customElement('ui5-mask-input-rule')
@inject(Element)
export class Ui5MaskInputRule extends Ui5Element{
        _maskinputrule = null;
        _parent = null;
        _relation = null;
         @bindable ui5Id = null;
        @bindable() maskFormatSymbol = '*';
@bindable() regex = '[a-zA-Z0-9]';
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
        @computedFrom('_maskinputrule')
        get UIElement() {
            return this._maskinputrule;
          }
        fillProperties(params){
                                        params.maskFormatSymbol = this.maskFormatSymbol;
params.regex = this.regex;
            
                                            super.fillProperties(params);   
        }
        defaultFunc() {
                        }
                        attached() {
            var that = this;
            var params = {};
            this.fillProperties(params);
         if (this.ui5Id)
          this._maskinputrule = new sap.m.MaskInputRule(this.ui5Id, params);
        else
          this._maskinputrule = new sap.m.MaskInputRule(params);
        
        if ($(this.element).closest("[ui5-container]").length > 0) {
                                            this._parent = $(this.element).closest("[ui5-container]")[0].au.controller.viewModel;
                                        if (!this._parent.UIElement || (this._parent.UIElement.sId != this._maskinputrule.sId)) {
        var prevSibling = null;
        if (this.element.previousElementSibling && this.element.previousElementSibling.au)
          prevSibling = this.element.previousElementSibling.au.controller.viewModel.UIElement;
        this._relation = this._parent.addChild(this._maskinputrule, this.element, prevSibling);
        this.attributeManager.addAttributes({"ui5-container": '' });
      }
      else {
                                                    this._parent = $(this.element.parentElement).closest("[ui5-container]")[0].au.controller.viewModel;
                                                var prevSibling = null;
        if (this.element.previousElementSibling && this.element.previousElementSibling.au) {
                                                    prevSibling = this.element.previousElementSibling.au.controller.viewModel.UIElement;
                                                this._relation = this._parent.addChild(this._maskinputrule, this.element, prevSibling);
        }
        else
          this._relation = this._parent.addChild(this._maskinputrule, this.element);
        this.attributeManager.addAttributes({"ui5-container": '' });
      }
    }
    else {
                                                            if(this._maskinputrule.placeAt)
                                                                this._maskinputrule.placeAt(this.element.parentElement);
                                                        this.attributeManager.addAttributes({"ui5-container": '' });
                                                        this.attributeManager.addClasses("ui5-hide");
    }
        
                                                        //<!container>
           
                                                        //</!container>
                                                        this.attributeManager.addAttributes({"ui5-id": this._maskinputrule.sId});
                                                                           
           
        }
    detached() {
        try{
          if ($(this.element).closest("[ui5-container]").length > 0) {
        if (this._parent && this._relation) {
                                                                this._parent.removeChildByRelation(this._maskinputrule, this._relation);
                                                            }
                                                                                }
         else{
                                                                this._maskinputrule.destroy();
                                                            }
         super.detached();
          }
         catch(err){}
        }

    addChild(child, elem, afterElement) {
        var path = jQuery.makeArray($(elem).parentsUntil(this.element));
        for (elem of path) {
        try{
                 if (elem.localName == 'tooltip') { this._maskinputrule.setTooltip(child); return elem.localName;}
if (elem.localName == 'customdata') { var _index = null; if (afterElement) _index = this._maskinputrule.indexOfCustomData(afterElement); if (_index)this._maskinputrule.insertCustomData(child, _index + 1); else this._maskinputrule.addCustomData(child, 0);  return elem.localName; }
if (elem.localName == 'layoutdata') { this._maskinputrule.setLayoutData(child); return elem.localName;}
if (elem.localName == 'dependents') { var _index = null; if (afterElement) _index = this._maskinputrule.indexOfDependent(afterElement); if (_index)this._maskinputrule.insertDependent(child, _index + 1); else this._maskinputrule.addDependent(child, 0);  return elem.localName; }

           }
           catch(err){}
                                                                    }
      }
      removeChildByRelation(child, relation) {
      try{
               if (relation == 'tooltip') {  this._maskinputrule.destroyTooltip(child); }
if (relation == 'customdata') {  this._maskinputrule.removeCustomData(child);}
if (relation == 'layoutdata') {  this._maskinputrule.destroyLayoutData(child); }
if (relation == 'dependents') {  this._maskinputrule.removeDependent(child);}

      }
      catch(err){}
                                                                            }
    maskFormatSymbolChanged(newValue){if(this._maskinputrule!==null){ this._maskinputrule.setMaskFormatSymbol(newValue);}}
regexChanged(newValue){if(this._maskinputrule!==null){ this._maskinputrule.setRegex(newValue);}}
/* inherited from sap.ui.core.Element*/
/* inherited from sap.ui.base.ManagedObject*/
validationSuccessChanged(newValue){if(this._maskinputrule!==null){ this._maskinputrule.attachValidationSuccess(newValue);}}
validationErrorChanged(newValue){if(this._maskinputrule!==null){ this._maskinputrule.attachValidationError(newValue);}}
parseErrorChanged(newValue){if(this._maskinputrule!==null){ this._maskinputrule.attachParseError(newValue);}}
formatErrorChanged(newValue){if(this._maskinputrule!==null){ this._maskinputrule.attachFormatError(newValue);}}
modelContextChangeChanged(newValue){if(this._maskinputrule!==null){ this._maskinputrule.attachModelContextChange(newValue);}}
/* inherited from sap.ui.base.EventProvider*/
/* inherited from sap.ui.base.Object*/


                                                                                }
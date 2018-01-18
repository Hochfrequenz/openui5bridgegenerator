import { bindable, customElement, noView } from 'aurelia-templating';
import { inject } from 'aurelia-dependency-injection';
import { computedFrom } from 'aurelia-framework';
import { AttributeManager } from '../common/attributeManager';
import { getBooleanFromAttributeValue } from '../common/attributes';
import { Ui5Control} from '../control/control';
@customElement('ui5-view-settings-dialog')
@inject(Element)
export class Ui5ViewSettingsDialog extends Ui5Control{
        _viewsettingsdialog = null;
        _parent = null;
        _relation = null;
         @bindable ui5Id = null;
        @bindable() title = null;
@bindable() sortDescending = false;
@bindable() groupDescending = false;
@bindable() filterSearchOperator = 'StartsWith';
@bindable() confirm = this.defaultFunc;
@bindable() cancel = this.defaultFunc;
@bindable() resetFilters = this.defaultFunc;
@bindable() filterDetailPageOpened = this.defaultFunc;
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
        @computedFrom('_viewsettingsdialog')
        get UIElement() {
            return this._viewsettingsdialog;
          }
        fillProperties(params){
               params.title = this.title;
params.sortDescending = getBooleanFromAttributeValue(this.sortDescending);
params.groupDescending = getBooleanFromAttributeValue(this.groupDescending);
params.filterSearchOperator = this.filterSearchOperator;
params.confirm = this.confirm==null ? this.defaultFunc: this.confirm;
params.cancel = this.cancel==null ? this.defaultFunc: this.cancel;
params.resetFilters = this.resetFilters==null ? this.defaultFunc: this.resetFilters;
params.filterDetailPageOpened = this.filterDetailPageOpened==null ? this.defaultFunc: this.filterDetailPageOpened;
            
        }
        defaultFunc() {
                        }
                        attached() {
            var that = this;
            var params = {};
            this.fillProperties(params);
                                         super.fillProperties(params);   
         if (this.ui5Id)
          this._viewsettingsdialog = new sap.m.ViewSettingsDialog(this.ui5Id, params);
        else
          this._viewsettingsdialog = new sap.m.ViewSettingsDialog(params);
        
        if ($(this.element).closest("[ui5-container]").length > 0) {
                                            this._parent = $(this.element).closest("[ui5-container]")[0].au.controller.viewModel;
                                        if (!this._parent.UIElement || (this._parent.UIElement.sId != this._viewsettingsdialog.sId)) {
        var prevSibling = null;
        if (this.element.previousElementSibling && this.element.previousElementSibling.au)
          prevSibling = this.element.previousElementSibling.au.controller.viewModel.UIElement;
        this._relation = this._parent.addChild(this._viewsettingsdialog, this.element, prevSibling);
        this.attributeManager.addAttributes({"ui5-container": '' });
      }
      else {
                                                    this._parent = $(this.element.parentElement).closest("[ui5-container]")[0].au.controller.viewModel;
                                                var prevSibling = null;
        if (this.element.previousElementSibling && this.element.previousElementSibling.au) {
                                                    prevSibling = this.element.previousElementSibling.au.controller.viewModel.UIElement;
                                                this._relation = this._parent.addChild(this._viewsettingsdialog, this.element, prevSibling);
        }
        else
          this._relation = this._parent.addChild(this._viewsettingsdialog, this.element);
        this.attributeManager.addAttributes({"ui5-container": '' });
      }
    }
    else {
                                                            if(this._viewsettingsdialog.placeAt)
                                                                this._viewsettingsdialog.placeAt(this.element.parentElement);
                                                        this.attributeManager.addAttributes({"ui5-container": '' });
                                                        this.attributeManager.addClasses("ui5-hide");
    }
        
                                                        //<!container>
           
                                                        //</!container>
                                                        this.attributeManager.addAttributes({"ui5-id": this._viewsettingsdialog.sId});
                                                                           
           
        }
    detached() {
        try{
          if ($(this.element).closest("[ui5-container]").length > 0) {
        if (this._parent && this._relation) {
                                                                this._parent.removeChildByRelation(this._viewsettingsdialog, this._relation);
                                                            }
                                                                                }
         else{
                                                                this._viewsettingsdialog.destroy();
                                                            }
         super.detached();
          }
         catch(err){}
        }

    addChild(child, elem, afterElement) {
        var path = jQuery.makeArray($(elem).parentsUntil(this.element));
        for (elem of path) {
        try{
                 if (elem.localName == 'sortitems') { var _index = null; if (afterElement) _index = this._viewsettingsdialog.indexOfSortItem(afterElement); if (_index)this._viewsettingsdialog.insertSortItem(child, _index + 1); else this._viewsettingsdialog.addSortItem(child, 0);  return elem.localName; }
if (elem.localName == 'groupitems') { var _index = null; if (afterElement) _index = this._viewsettingsdialog.indexOfGroupItem(afterElement); if (_index)this._viewsettingsdialog.insertGroupItem(child, _index + 1); else this._viewsettingsdialog.addGroupItem(child, 0);  return elem.localName; }
if (elem.localName == 'filteritems') { var _index = null; if (afterElement) _index = this._viewsettingsdialog.indexOfFilterItem(afterElement); if (_index)this._viewsettingsdialog.insertFilterItem(child, _index + 1); else this._viewsettingsdialog.addFilterItem(child, 0);  return elem.localName; }
if (elem.localName == 'presetfilteritems') { var _index = null; if (afterElement) _index = this._viewsettingsdialog.indexOfPresetFilterItem(afterElement); if (_index)this._viewsettingsdialog.insertPresetFilterItem(child, _index + 1); else this._viewsettingsdialog.addPresetFilterItem(child, 0);  return elem.localName; }
if (elem.localName == 'customtabs') { var _index = null; if (afterElement) _index = this._viewsettingsdialog.indexOfCustomTab(afterElement); if (_index)this._viewsettingsdialog.insertCustomTab(child, _index + 1); else this._viewsettingsdialog.addCustomTab(child, 0);  return elem.localName; }
if (elem.localName == 'tooltip') { this._viewsettingsdialog.setTooltip(child); return elem.localName;}
if (elem.localName == 'customdata') { var _index = null; if (afterElement) _index = this._viewsettingsdialog.indexOfCustomData(afterElement); if (_index)this._viewsettingsdialog.insertCustomData(child, _index + 1); else this._viewsettingsdialog.addCustomData(child, 0);  return elem.localName; }
if (elem.localName == 'layoutdata') { this._viewsettingsdialog.setLayoutData(child); return elem.localName;}
if (elem.localName == 'dependents') { var _index = null; if (afterElement) _index = this._viewsettingsdialog.indexOfDependent(afterElement); if (_index)this._viewsettingsdialog.insertDependent(child, _index + 1); else this._viewsettingsdialog.addDependent(child, 0);  return elem.localName; }

           }
           catch(err){}
                                                                    }
      }
      removeChildByRelation(child, relation) {
      try{
               if (relation == 'sortItems') {  this._viewsettingsdialog.removeSortItem(child); }
if (relation == 'groupItems') {  this._viewsettingsdialog.removeGroupItem(child); }
if (relation == 'filterItems') {  this._viewsettingsdialog.removeFilterItem(child); }
if (relation == 'presetFilterItems') {  this._viewsettingsdialog.removePresetFilterItem(child); }
if (relation == 'customTabs') {  this._viewsettingsdialog.removeCustomTab(child); }
if (relation == 'tooltip') {  this._viewsettingsdialog.destroyTooltip(child); }
if (relation == 'customData') {  this._viewsettingsdialog.removeCustomData(child); }
if (relation == 'layoutData') {  this._viewsettingsdialog.destroyLayoutData(child); }
if (relation == 'dependents') {  this._viewsettingsdialog.removeDependent(child); }

      }
      catch(err){}
                                                                            }
    titleChanged(newValue){if(this._viewsettingsdialog!==null){ this._viewsettingsdialog.setTitle(newValue);}}
sortDescendingChanged(newValue){if(this._viewsettingsdialog!==null){ this._viewsettingsdialog.setSortDescending(getBooleanFromAttributeValue(newValue));}}
groupDescendingChanged(newValue){if(this._viewsettingsdialog!==null){ this._viewsettingsdialog.setGroupDescending(getBooleanFromAttributeValue(newValue));}}
filterSearchOperatorChanged(newValue){if(this._viewsettingsdialog!==null){ this._viewsettingsdialog.setFilterSearchOperator(newValue);}}
confirmChanged(newValue){if(this._viewsettingsdialog!==null){ this._viewsettingsdialog.attachConfirm(newValue);}}
cancelChanged(newValue){if(this._viewsettingsdialog!==null){ this._viewsettingsdialog.attachCancel(newValue);}}
resetFiltersChanged(newValue){if(this._viewsettingsdialog!==null){ this._viewsettingsdialog.attachResetFilters(newValue);}}
filterDetailPageOpenedChanged(newValue){if(this._viewsettingsdialog!==null){ this._viewsettingsdialog.attachFilterDetailPageOpened(newValue);}}
busyChanged(newValue){if(this._viewsettingsdialog!==null){ this._viewsettingsdialog.setBusy(getBooleanFromAttributeValue(newValue));}}
busyIndicatorDelayChanged(newValue){if(this._viewsettingsdialog!==null){ this._viewsettingsdialog.setBusyIndicatorDelay(newValue);}}
visibleChanged(newValue){if(this._viewsettingsdialog!==null){ this._viewsettingsdialog.setVisible(getBooleanFromAttributeValue(newValue));}}
fieldGroupIdsChanged(newValue){if(this._viewsettingsdialog!==null){ this._viewsettingsdialog.setFieldGroupIds(newValue);}}
/* inherited from sap.ui.core.Control*/
validateFieldGroupChanged(newValue){if(this._viewsettingsdialog!==null){ this._viewsettingsdialog.attachValidateFieldGroup(newValue);}}
/* inherited from sap.ui.core.Element*/
/* inherited from sap.ui.base.ManagedObject*/
validationSuccessChanged(newValue){if(this._viewsettingsdialog!==null){ this._viewsettingsdialog.attachValidationSuccess(newValue);}}
validationErrorChanged(newValue){if(this._viewsettingsdialog!==null){ this._viewsettingsdialog.attachValidationError(newValue);}}
parseErrorChanged(newValue){if(this._viewsettingsdialog!==null){ this._viewsettingsdialog.attachParseError(newValue);}}
formatErrorChanged(newValue){if(this._viewsettingsdialog!==null){ this._viewsettingsdialog.attachFormatError(newValue);}}
modelContextChangeChanged(newValue){if(this._viewsettingsdialog!==null){ this._viewsettingsdialog.attachModelContextChange(newValue);}}
/* inherited from sap.ui.base.EventProvider*/
/* inherited from sap.ui.base.Object*/


                                                                                }
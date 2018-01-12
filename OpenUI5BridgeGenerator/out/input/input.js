import { bindable, customElement, noView } from 'aurelia-templating';
import { inject } from 'aurelia-dependency-injection';
import { AttributeManager } from '../common/attributeManager';
import { getBooleanFromAttributeValue } from '../common/attributes';

@customElement(ui5-input)
@inject(Element)
export class Ui5Input extends Ui5InputBase{
        _input = null;
        _parent = null;
        _relation = null;
         @bindable ui5Id = null;
        @bindable() type = 'Text';
@bindable() maxLength = '0';
@bindable() dateFormat = 'YYYY-MM-dd';
@bindable() showValueHelp = 'False';
@bindable() showSuggestion = 'False';
@bindable() valueHelpOnly = 'False';
@bindable() filterSuggests = 'True';
@bindable() maxSuggestionWidth = '';
@bindable() startSuggestion = '1';
@bindable() showTableSuggestionValueHelp = 'True';
@bindable() description = '';
@bindable() fieldWidth = '50%';
@bindable() valueLiveUpdate = 'False';
@bindable() selectedKey = '';
@bindable() textFormatMode = 'Value';
@bindable() textFormatter = '';
@bindable() suggestionRowValidator = '';
@bindable() liveChange = this.defaultFunc;
@bindable() valueHelpRequest = this.defaultFunc;
@bindable() suggest = this.defaultFunc;
@bindable() suggestionItemSelected = this.defaultFunc;
@bindable() submit = this.defaultFunc;

                constructor(element) {
            super(element);
            this.element = element;
            this.attributeManager = new AttributeManager(this.element);
        }
        @computedFrom('_input')
        get UIElement() {
            return this._input;
          }
        defaultFunc() {
        }
        attached() {
            var that = this;
            var params = {
                    type : this.type,
maxLength : this.maxLength,
dateFormat : this.dateFormat,
showValueHelp : getBooleanFromAttributeValue(this.showValueHelp),
showSuggestion : getBooleanFromAttributeValue(this.showSuggestion),
valueHelpOnly : getBooleanFromAttributeValue(this.valueHelpOnly),
filterSuggests : getBooleanFromAttributeValue(this.filterSuggests),
maxSuggestionWidth : this.maxSuggestionWidth,
startSuggestion : this.startSuggestion,
showTableSuggestionValueHelp : getBooleanFromAttributeValue(this.showTableSuggestionValueHelp),
description : this.description,
fieldWidth : this.fieldWidth,
valueLiveUpdate : getBooleanFromAttributeValue(this.valueLiveUpdate),
selectedKey : this.selectedKey,
textFormatMode : this.textFormatMode,
textFormatter : this.textFormatter,
suggestionRowValidator : this.suggestionRowValidator,

            }
        super.fillProperties(params);
         if (this.ui5Id)
          this._input = new sap.m.Input(this.ui5Id, params);
        else
          this._input = new sap.m.Input(params);
        if ($(this.element).closest("[ui5-container]").length > 0) {
            this._parent = $(this.element).closest("[ui5-container]")[0].au.controller.viewModel;
        if (!this._parent.UIElement || (this._parent.UIElement.sId != this._input.sId)) {
        var prevSibling = null;
        if (this.element.previousElementSibling)
          prevSibling = this.element.previousElementSibling.au.controller.viewModel.UIElement;
        this._relation = this._parent.addChild(this._input, this.element, prevSibling);
        this.attributeManager.addAttributes({"ui5-container": '' });
      }
      else {
             this._parent = $(this.element.parentElement).closest("[ui5-container]")[0].au.controller.viewModel;
             var prevSibling = null;
        if (this.element.previousElementSibling) {
                prevSibling = this.element.previousElementSibling.au.controller.viewModel.UIElement;
                this._relation = this._parent.addChild(this._input, this.element, prevSibling);
        }
        else
          this._relation = this._parent.addChild(this._input, this.element);
        this.attributeManager.addAttributes({"ui5-container": '' });
      }
    }
    else {
                                    this._form.placeAt(this.element.parentElement);
      attributeManager.addClasses("ui5-hide");
    }   
        
        //<!container>
           
        //</!container>
        this.attributeManager.addAttributes({"ui5-id": this._input.sId});
           super.attached();
        }
    detached() {
        if (this._parent && this._relation) {
           this._parent.removeChildByRelation(this._input, this._relation);
        }
         else{
            this._input.destroy();
    }
          super.detached();
        }
     }
    addChild(child, elem, afterElement) {
        var path = jQuery.makeArray($(elem).parentsUntil(this.element));
        for (elem of path) {
            if (elem.localName == 'suggestionItems') { var _index = null; if (afterElement) _index = this._input.indexOfSuggestionItem(afterElement); if (_index)this._input.insertSuggestionItem(child, _index + 1); else this._input.addSuggestionItem(child, 0);  return elem.localName; }
if (elem.localName == 'suggestionColumns') { var _index = null; if (afterElement) _index = this._input.indexOfSuggestionColumn(afterElement); if (_index)this._input.insertSuggestionColumn(child, _index + 1); else this._input.addSuggestionColumn(child, 0);  return elem.localName; }
if (elem.localName == 'suggestionRows') { var _index = null; if (afterElement) _index = this._input.indexOfSuggestionRow(afterElement); if (_index)this._input.insertSuggestionRow(child, _index + 1); else this._input.addSuggestionRow(child, 0);  return elem.localName; }

        }
      }
      removeChildByRelation(child, relation) {
        if (relation == 'suggestionItems') {  this._input.removeSuggestionItem(child); }
if (relation == 'suggestionColumns') {  this._input.removeSuggestionColumn(child); }
if (relation == 'suggestionRows') {  this._input.removeSuggestionRow(child); }

      }
    typeChanged(newValue){if(this._input!==null){ this._input.setType(newValue);}}
maxLengthChanged(newValue){if(this._input!==null){ this._input.setMaxLength(newValue);}}
dateFormatChanged(newValue){if(this._input!==null){ this._input.setDateFormat(newValue);}}
showValueHelpChanged(newValue){if(this._input!==null){ this._input.setShowValueHelp(getBooleanFromAttributeValue(newValue));}}
showSuggestionChanged(newValue){if(this._input!==null){ this._input.setShowSuggestion(getBooleanFromAttributeValue(newValue));}}
valueHelpOnlyChanged(newValue){if(this._input!==null){ this._input.setValueHelpOnly(getBooleanFromAttributeValue(newValue));}}
filterSuggestsChanged(newValue){if(this._input!==null){ this._input.setFilterSuggests(getBooleanFromAttributeValue(newValue));}}
maxSuggestionWidthChanged(newValue){if(this._input!==null){ this._input.setMaxSuggestionWidth(newValue);}}
startSuggestionChanged(newValue){if(this._input!==null){ this._input.setStartSuggestion(newValue);}}
showTableSuggestionValueHelpChanged(newValue){if(this._input!==null){ this._input.setShowTableSuggestionValueHelp(getBooleanFromAttributeValue(newValue));}}
descriptionChanged(newValue){if(this._input!==null){ this._input.setDescription(newValue);}}
fieldWidthChanged(newValue){if(this._input!==null){ this._input.setFieldWidth(newValue);}}
valueLiveUpdateChanged(newValue){if(this._input!==null){ this._input.setValueLiveUpdate(getBooleanFromAttributeValue(newValue));}}
selectedKeyChanged(newValue){if(this._input!==null){ this._input.setSelectedKey(newValue);}}
textFormatModeChanged(newValue){if(this._input!==null){ this._input.setTextFormatMode(newValue);}}
textFormatterChanged(newValue){if(this._input!==null){ this._input.setTextFormatter(newValue);}}
suggestionRowValidatorChanged(newValue){if(this._input!==null){ this._input.setSuggestionRowValidator(newValue);}}
liveChangeChanged(newValue){if(this._input!==null){ this._input.attachLiveChange(newValue);}}
valueHelpRequestChanged(newValue){if(this._input!==null){ this._input.attachValueHelpRequest(newValue);}}
suggestChanged(newValue){if(this._input!==null){ this._input.attachSuggest(newValue);}}
suggestionItemSelectedChanged(newValue){if(this._input!==null){ this._input.attachSuggestionItemSelected(newValue);}}
submitChanged(newValue){if(this._input!==null){ this._input.attachSubmit(newValue);}}

    
}
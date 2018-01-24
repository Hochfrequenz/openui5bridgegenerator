import { bindable, customElement, noView } from 'aurelia-templating';
import { inject } from 'aurelia-dependency-injection';
import { computedFrom } from 'aurelia-framework';
import { AttributeManager } from '../common/attributeManager';
import { getBooleanFromAttributeValue } from '../common/attributes';
<importparent>
@customElement(<uiname>)
@inject(Element)
export class <classname> <extendsparentClass>{
        <classvar> = null;
        _parent = null;
        _relation = null;
         @bindable ui5Id = null;
        <properties>
                constructor(element) {
                    <supercontructor>                    
                this.element = element;
            this.attributeManager = new AttributeManager(this.element);
        }
        @computedFrom('<classvar>')
        get UIElement() {
            return this.<classvar>;
          }
        fillProperties(params){
                                        <paramlist>            
                                            <superfill>   
        }
        defaultFunc() {
                        }
                        attached() {
            var that = this;
            var params = {};
            this.fillProperties(params);
         if (this.ui5Id)
          this.<classvar> = new <sapClass>(this.ui5Id, params);
        else
          this.<classvar> = new <sapClass>(params);
        <attachOverride>
        if ($(this.element).closest("[ui5-container]").length > 0) {
                                            this._parent = $(this.element).closest("[ui5-container]")[0].au.controller.viewModel;
                                        if (!this._parent.UIElement || (this._parent.UIElement.sId != this.<classvar>.sId)) {
        var prevSibling = null;
        if (this.element.previousElementSibling && this.element.previousElementSibling.au)
          prevSibling = this.element.previousElementSibling.au.controller.viewModel.UIElement;
        this._relation = this._parent.addChild(this.<classvar>, this.element, prevSibling);
        this.attributeManager.addAttributes({"ui5-container": '' });
      }
      else {
                                                    this._parent = $(this.element.parentElement).closest("[ui5-container]")[0].au.controller.viewModel;
                                                var prevSibling = null;
        if (this.element.previousElementSibling && this.element.previousElementSibling.au) {
                                                    prevSibling = this.element.previousElementSibling.au.controller.viewModel.UIElement;
                                                this._relation = this._parent.addChild(this.<classvar>, this.element, prevSibling);
        }
        else
          this._relation = this._parent.addChild(this.<classvar>, this.element);
        this.attributeManager.addAttributes({"ui5-container": '' });
      }
    }
    else {
                                                            if(this.<classvar>.placeAt)
                                                                this.<classvar>.placeAt(this.element.parentElement);
                                                        this.attributeManager.addAttributes({"ui5-container": '' });
                                                        this.attributeManager.addClasses("ui5-hide");
    }
        <specialevents>
                                                        //<!container>
           
                                                        //</!container>
                                                        this.attributeManager.addAttributes({"ui5-id": this.<classvar>.sId});
                                                                           
           
        }
    detached() {
        try{
          if ($(this.element).closest("[ui5-container]").length > 0) {
        if (this._parent && this._relation) {
                                                                this._parent.removeChildByRelation(this.<classvar>, this._relation);
                                                            }
                                                                                }
         else{
                                                                this.<classvar>.destroy();
                                                            }
         <superdetached>
          }
         catch(err){}
        }

    addChild(child, elem, afterElement) {
        var path = jQuery.makeArray($(elem).parentsUntil(this.element));
        for (elem of path) {
        try{
                 <addChilds>
           }
           catch(err){}
                                                                    }
      }
      removeChildByRelation(child, relation) {
      try{
               <removeChilds>
      }
      catch(err){}
                                                                            }
    <changeHandler>

                                                                                }
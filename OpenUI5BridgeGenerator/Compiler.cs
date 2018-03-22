using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Linq;
using OpenUI5BridgeGenerator.Helper;
using System.Xml.Linq;

namespace OpenUI5BridgeGenerator
{
    class Compiler
    {
        protected void AddAdditionalProperty(String property, JToken value, StringBuilder propertyBuilder)
        {
            if (value.Type == JTokenType.Boolean)
                propertyBuilder.AppendLine("@bindable() " + property + " = " + (value.Value<bool>() ? "true" : "false") + ";");
            else if (value.Type == JTokenType.String)
            {
                propertyBuilder.AppendLine("@bindable() " + property + " = \"" + value.Value<string>() + "\";");
            }

        }
        protected void AddAggregation(String objectName, JProperty prop, JToken uiObject, string defaultRoot, XElement root, JArray aggregations, StringBuilder addChildBuilder, StringBuilder removeChildBuilder)
        {
            foreach (var agg in aggregations)
            {
                if (agg["visibility"].Value<string>() == "public")
                {
                    var aggName = agg["name"].Value<string>();
                    if (prop.Value["overrideTags"] != null && prop.Value["overrideTags"].Value<JObject>()[aggName] != null)
                        aggName = prop.Value["overrideTags"].Value<JObject>()[aggName].Value<string>();
                    //special case for title aggregation (which aurelia doesn't like as a tag name)
                    var nonTitleAggName = aggName;
                    if (aggName == "title")
                        nonTitleAggName = "title-elem";
                    XElement newAggregationElement = new XElement(nonTitleAggName);
                    newAggregationElement.SetAttributeValue("ref", aggName);
                    XElement slotElement = new XElement("slot");
                    slotElement.Value = string.Empty;
                    if (prop.Value["defaultAggregation"] != null)
                        defaultRoot = prop.Value["defaultAggregation"].Value<string>();
                    if (defaultRoot == null || defaultRoot != agg["name"].Value<string>())
                    {
                        slotElement.SetAttributeValue("name", aggName);
                    }
                    newAggregationElement.Add(slotElement);
                    root.Add(newAggregationElement);
                    string lowerAggName = nonTitleAggName.ToLower();
                    if (prop.Value["addDefaultSlot"] != null && prop.Value["addDefaultSlot"].Value<bool>() == true)
                    {
                        XElement emptySlot = new XElement("slot");
                        emptySlot.Value = string.Empty;
                        root.Add(emptySlot);
                    }
                    if (agg["cardinality"].Value<string>() == "0..1")
                    {
                        addChildBuilder.AppendLine("if (elem.localName == '" + lowerAggName + "') { this." + "_" + objectName.ToLower() + "." + agg["methods"].Value<JArray>()[2].Value<string>() + "(child); return elem.localName;}");
                        removeChildBuilder.AppendLine("if (relation == '" +
                            lowerAggName + "') {  this." +
                            "_" + objectName.ToLower() +
                            "." + agg["methods"].Value<JArray>()[1].Value<string>() + "(child); }");
                    }
                    else if (agg["cardinality"].Value<string>() == "0..n")
                    {
                        string overrides = null;
                        if (prop.Value["addChild"] != null && prop.Value["addChild"].Value<JObject>()[aggName] != null)
                            overrides = prop.Value["addChild"].Value<JObject>()[aggName].Value<string>();
                        int insertFunction = 2;
                        if (prop.Value["useAddInsteadOfInsert"] != null && prop.Value["useAddInsteadOfInsert"].Value<bool>())
                            insertFunction = 3;
                        addChildBuilder.AppendLine("if (elem.localName == '" + lowerAggName + "') { var _index = null; if (afterElement) _index = this." +
                            "_" + objectName.ToLower() +
                            "." + agg["methods"].Value<JArray>()[5].Value<string>() + "(afterElement); if (_index)this." + "_" + objectName.ToLower() +
                            "." + agg["methods"].Value<JArray>()[insertFunction].Value<string>() + "(child, _index + 1); else this." +
                            "_" + objectName.ToLower() +
                            "." + agg["methods"].Value<JArray>()[3].Value<string>() + "(child, 0); " + (overrides != null ? overrides : "") + " return elem.localName; }");
                        overrides = null;
                        if (prop.Value["removeChild"] != null && prop.Value["removeChild"].Value<JObject>()[aggName] != null)
                            overrides = prop.Value["removeChild"].Value<JObject>()[aggName].Value<string>();
                        removeChildBuilder.AppendLine("if (relation == '" +
                            lowerAggName + "') {  this." +
                            "_" + objectName.ToLower() +
                            "." + agg["methods"].Value<JArray>()[4].Value<string>() + "(child);" + (overrides != null ? overrides : "") + "}");
                    }

                }
            }
        }
        protected void AddParentPropertiesAndEvents(string objectName, string parentName, JArray parentProperties, JArray parentEvents, StringBuilder propertyBuilder, StringBuilder changeHandlerBuilder, StringBuilder specialEventBuilder, JObject parentEventArgs)
        {
            propertyBuilder.AppendLine("/* inherited from " + parentName + "*/");
            foreach (var property in parentProperties)
            {
                if (property["visibility"].Value<string>() == "public" && property["deprecated"] == null)
                {
                    var isBoolean = property["type"].Value<string>() == "boolean";
                    var isNullDefault = property["defaultValue"].Value<string>() == null;
                    string defaultValue = "";
                    switch (property["type"].Value<string>())
                    {
                        case "boolean":
                            {
                                defaultValue = isNullDefault ? null : property["defaultValue"].Value<bool>() ? "true" : "false";
                            }
                            break;
                        case "float":
                            {
                                defaultValue = isNullDefault ? null : property["defaultValue"].Value<float>().ToString();
                            }
                            break;
                        case "int":
                            {
                                defaultValue = isNullDefault ? null : property["defaultValue"].Value<int>().ToString();
                            }
                            break;
                        default:
                            defaultValue = isNullDefault ? null : "'" + property["defaultValue"].Value<string>() + "'";
                            break;
                    }
                    if (defaultValue == null)
                        defaultValue = "null";
                    propertyBuilder.AppendLine("@bindable() " + property["name"].Value<string>() + " = " + defaultValue + ";");
                    var newValue = "(newValue);}}";
                    if (isBoolean)
                    {
                        newValue = "(getBooleanFromAttributeValue(newValue));}}";
                    }

                    changeHandlerBuilder.AppendLine(property["name"].Value<string>() +
                        "Changed(newValue){if(this." + "_" +
                        objectName.ToLower() +
                        "!==null){ this." +
                        "_" +
                        objectName.ToLower() +
                        "." +
                        property["methods"].Value<JArray>()[1].Value<string>() +
                        newValue);
                    
                }
               
            }
            changeHandlerBuilder.AppendLine("/* inherited from " + parentName + "*/");
            foreach (var ev in parentEvents)
            {
                if (ev["visibility"].Value<string>() == "public" && ev["deprecated"] == null)
                {
                    propertyBuilder.AppendLine("@bindable() " + ev["name"].Value<string>() + " = this.defaultFunc;");

                    changeHandlerBuilder.AppendLine(ev["name"].Value<string>() +
                    "Changed(newValue){if(this." + "_" +
                    objectName.ToLower() +
                    "!==null){ this." +
                    "_" +
                    objectName.ToLower() +
                    "." +
                    ev["methods"].Value<JArray>()[0].Value<string>() +
                    "(newValue);}}");
                }
            }
            if (parentEventArgs != null)
            {
                foreach (var evObj in parentEventArgs.Properties())
                {
                    specialEventBuilder.AppendLine("this." +
                        "_" + objectName.ToLower() +
                        ".attach" + evObj.Name + "((event) => { " + evObj.Value.Value<string>() + "; });");
                }
            }
        }
        public void Compile(string path, string outputPath)
        {
            if (String.IsNullOrEmpty(outputPath))
                throw new System.IO.FileNotFoundException("Output path must be specified");

            var configObject = (JObject)Newtonsoft.Json.Linq.JObject.ReadFrom(new JsonTextReader(System.IO.File.OpenText("./config.json")));
            Dictionary<string, JArray> parentProperties = new Dictionary<string, JArray>();
            Dictionary<string, JArray> parentEvents = new Dictionary<string, JArray>();
            Dictionary<string, JObject> parentEventArgs = new Dictionary<string, JObject>();
            Dictionary<string, JArray> parentAggregations = new Dictionary<string, JArray>();
            Dictionary<string, string> parentRelations = new Dictionary<string, string>();
            Dictionary<string, string> parentDefaultAggregation = new Dictionary<string, string>();
            foreach (var name in configObject.Properties())
            {


                //load SAP UI5 api json (given in path variable)
                var namespacePath = name.Name.Replace('.', System.IO.Path.DirectorySeparatorChar);
                var rootObject = (JObject)Newtonsoft.Json.Linq.JObject.ReadFrom(new JsonTextReader(System.IO.File.OpenText(System.IO.Path.Combine(path, namespacePath, "designtime", "api.json"))));

                // iterate over all properties to compile only specified objects
                foreach (var prop in name.Value.Value<JObject>().Properties())
                {
                    string objectName = prop.Name;
                    if (prop.Value.Value<JObject>()["overrideName"] != null)
                    {
                        objectName = prop.Value.Value<JObject>()["overrideName"].Value<string>();
                    }

                    //find the objecct in UI5 api definition
                    var uiObject = rootObject.Property("symbols").Value.Where(obj => ((JObject)obj)["basename"].Value<string>() == prop.Name).FirstOrDefault();
                    if (uiObject != null)
                    {
                        string kebabObjectName = objectName.PascalToKebabCase();
                        //create new directory
                        System.IO.Directory.CreateDirectory(System.IO.Path.Combine(outputPath, kebabObjectName));
                        System.IO.File.Copy("./templates/Basic.html", System.IO.Path.Combine(outputPath, kebabObjectName, kebabObjectName + ".html"), true);
                        System.IO.File.Copy("./templates/Basic.js", System.IO.Path.Combine(outputPath, kebabObjectName, kebabObjectName + ".js"), true);
                        //replace HTML template
                        XElement templateRoot = XElement.Parse(System.IO.File.ReadAllText("./templates/Basic.html"));
                        XElement newRoot = templateRoot;

                        var contentRoot = templateRoot.Element("CONTENT");
                        var aggregations = (uiObject["ui5-metadata"] as JObject)?.Property("aggregations");
                        StringBuilder addChildBuilder = new StringBuilder();
                        StringBuilder removeChildBuilder = new StringBuilder();
                        if (aggregations != null)
                        {
                            parentAggregations.Add(uiObject["name"].Value<string>(), aggregations.Value as JArray);
                            parentDefaultAggregation.Add(uiObject["name"].Value<string>(), (uiObject["ui5-metadata"] as JObject)?.Property("defaultAggregation")?.Value?.Value<string>());
                            AddAggregation(objectName, prop, uiObject, (uiObject["ui5-metadata"] as JObject)?.Property("defaultAggregation")?.Value?.Value<string>(), newRoot, (aggregations.Value as JArray), addChildBuilder, removeChildBuilder);
                        }

                        //replace js file
                        string jsString = System.IO.File.ReadAllText("./templates/Basic.js");
                        jsString = jsString.Replace("<classvar>", "_" + objectName.ToLower());
                        jsString = jsString.Replace("<classname>", "Ui5" + objectName);
                        if (uiObject["extends"] != null)
                        {
                            var superName = "Ui5" + uiObject["extends"].Value<string>().Split(".").Last();
                            var kebapSuper = uiObject["extends"].Value<string>().Split(".").Last().PascalToKebabCase();
                            jsString = jsString.Replace("<extendsparentClass>", "extends " + superName);
                            jsString = jsString.Replace("<supercontructor>", "super(element);");
                            jsString = jsString.Replace("<superfill>", "super.fillProperties(params);");
                            jsString = jsString.Replace("<superattached>", "super.attached();");
                            jsString = jsString.Replace("<superdetached>", "super.detached();");
                            jsString = jsString.Replace("<importparent>", "import { " + superName + "} from '../" + kebapSuper + "/" + kebapSuper + "';");
                        }
                        else
                        {
                            jsString = jsString.Replace("<extendsparentClass>", "");
                            jsString = jsString.Replace("<supercontructor>", "");
                            jsString = jsString.Replace("<superfill>", "");
                            jsString = jsString.Replace("<superattached>", "");
                            jsString = jsString.Replace("<superdetached>", "");
                            jsString = jsString.Replace("<importparent>", "");
                        }
                        jsString = jsString.Replace("<uiname>", "'ui5-" + kebabObjectName + "'");
                        jsString = jsString.Replace("<sapClass>", uiObject["name"].Value<string>());
                        StringBuilder propertyBuilder = new StringBuilder();
                        StringBuilder paramBuilder = new StringBuilder();
                        StringBuilder changeHandlerBuilder = new StringBuilder();
                        StringBuilder specialEventBuilder = new StringBuilder();
                        var properties = (uiObject["ui5-metadata"] as JObject)?.Property("properties");
                        if (properties != null)
                        {
                            parentProperties.Add(uiObject["name"].Value<string>(), properties.Value as JArray);
                            foreach (var property in (properties.Value as JArray))
                            {
                                //don't include deprecated properties
                                if (property["visibility"].Value<string>() == "public" && property["deprecated"] == null)
                                {
                                    var isBoolean = property["type"].Value<string>() == "boolean";
                                    var isNullDefault = property["defaultValue"].Value<string>() == null;
                                    string defaultValue = "";
                                    switch (property["type"].Value<string>())
                                    {
                                        case "boolean":
                                            {
                                                defaultValue = isNullDefault ? null : property["defaultValue"].Value<bool>() ? "true" : "false";
                                            }
                                            break;
                                        case "float":
                                            {
                                                defaultValue = isNullDefault ? null : property["defaultValue"].Value<float>().ToString();
                                            }
                                            break;
                                        case "int":
                                            {
                                                defaultValue = isNullDefault ? null : property["defaultValue"].Value<int>().ToString();
                                            }
                                            break;
                                        default:
                                            defaultValue = isNullDefault ? null : "'" + property["defaultValue"].Value<string>() + "'";
                                            break;
                                    }
                                    if (defaultValue == null)
                                        defaultValue = "null";
                                    propertyBuilder.AppendLine("@bindable() " + property["name"].Value<string>() + " = " + defaultValue.ToString() + ";");
                                    var newValue = "(newValue);}}";
                                    var paramValue = "this." + property["name"].Value<string>();
                                    if (isBoolean)
                                    {
                                        newValue = "(getBooleanFromAttributeValue(newValue));}}";
                                        paramValue = "getBooleanFromAttributeValue(" + paramValue + ")";
                                    }
                                    if (property["type"].Value<string>() == "int")
                                    {
                                        paramValue = paramValue + "?parseInt(" + paramValue + "):0";
                                    }
                                    if (prop.Value["paramOverrides"] != null && prop.Value["paramOverrides"].Value<JObject>()[property["name"].Value<string>()] != null)
                                        paramBuilder.AppendLine("params." + property["name"].Value<string>() + " = " + prop.Value["paramOverrides"].Value<JObject>()[property["name"].Value<string>()].Value<string>());
                                    else
                                        paramBuilder.AppendLine("params." + property["name"].Value<string>() + " = " + paramValue + ";");
                                    changeHandlerBuilder.AppendLine(property["name"].Value<string>() +
                                        "Changed(newValue){if(this." + "_" +
                                        objectName.ToLower() +
                                        "!==null){ this." +
                                        "_" +
                                        objectName.ToLower() +
                                        "." +
                                        property["methods"].Value<JArray>()[1].Value<string>() +
                                        newValue);
                                }
                            }
                        }
                        if (prop.Value["additionalProperties"] != null)
                        {
                            foreach (var objProperty in prop.Value["additionalProperties"].Value<JObject>().Properties())
                            {
                                AddAdditionalProperty(objProperty.Name, objProperty.Value, propertyBuilder);
                            }
                        }
                        var events = (uiObject["ui5-metadata"] as JObject)?.Property("events");
                        if (events != null)
                        {
                            parentEvents.Add(uiObject["name"].Value<string>(), events.Value as JArray);

                            foreach (var ev in (events.Value as JArray))
                            {
                                if (ev["visibility"].Value<string>() == "public" && ev["deprecated"] == null)
                                {
                                    propertyBuilder.AppendLine("@bindable() " + ev["name"].Value<string>() + " = this.defaultFunc;");
                                    var paramValue = "this." + ev["name"].Value<string>() +
                                        "==null ? this.defaultFunc: this." + ev["name"].Value<string>();
                                    paramBuilder.AppendLine("params." + ev["name"].Value<string>() + " = " + paramValue + ";");

                                    changeHandlerBuilder.AppendLine(ev["name"].Value<string>() +
                                    "Changed(newValue){if(this." + "_" +
                                    objectName.ToLower() +
                                    "!==null){ this." +
                                    "_" +
                                    objectName.ToLower() +
                                    "." +
                                    ev["methods"].Value<JArray>()[0].Value<string>() +
                                    "(newValue);}}");
                                }
                            }
                            if (prop.Value["events"] != null)
                            {
                                parentEventArgs.Add(uiObject["name"].Value<string>(), prop.Value["events"].Value<JObject>());
                                foreach (var evObj in prop.Value["events"].Value<JObject>().Properties())
                                {
                                    specialEventBuilder.AppendLine("this." +
                                        "_" + objectName.ToLower() +
                                        ".attach" + evObj.Name + "((event) => { " + evObj.Value.Value<string>() + "; });");
                                }
                            }

                        }
                        if (uiObject["extends"] != null)
                        {
                            string parentName = uiObject["extends"].Value<string>();
                            parentRelations.Add(uiObject["name"].Value<string>(), parentName);
                            var curParent = parentName;
                            while (curParent != null)
                            {
                                JArray parentPropertiesArray = new JArray();
                                JArray parentEventArray = new JArray();
                                JArray parentAggs = new JArray();
                                JObject parentEventArg = null;
                                string defaultAgg = null;
                                if (parentProperties.ContainsKey(curParent))
                                    parentPropertiesArray = parentProperties[curParent];
                                if (parentEvents.ContainsKey(curParent))
                                    parentEventArray = parentEvents[curParent];
                                if (parentAggregations.ContainsKey(curParent))
                                    parentAggs = parentAggregations[curParent];
                                if (parentDefaultAggregation.ContainsKey(curParent))
                                    defaultAgg = parentDefaultAggregation[curParent];
                                if (parentEventArgs.ContainsKey(curParent))
                                    parentEventArg = parentEventArgs[curParent];
                                AddParentPropertiesAndEvents(objectName, curParent, parentPropertiesArray, parentEventArray, propertyBuilder, changeHandlerBuilder, specialEventBuilder, parentEventArg);
                                AddAggregation(objectName, prop, uiObject, defaultAgg, newRoot, parentAggs, addChildBuilder, removeChildBuilder);
                                if (parentRelations.ContainsKey(curParent))
                                    curParent = parentRelations[curParent];
                                else
                                    curParent = null;
                            }
                        }

                        contentRoot.Remove();

                        System.IO.File.WriteAllText(System.IO.Path.Combine(outputPath, kebabObjectName, kebabObjectName + ".html"), templateRoot.ToString());

                        jsString = jsString.Replace("<properties>", propertyBuilder.ToString());
                        jsString = jsString.Replace("<paramlist>", paramBuilder.ToString());
                        jsString = jsString.Replace("<changeHandler>", changeHandlerBuilder.ToString());
                        jsString = jsString.Replace("<addChilds>", addChildBuilder.ToString());
                        jsString = jsString.Replace("<removeChilds>", removeChildBuilder.ToString());
                        jsString = jsString.Replace("<specialevents>", specialEventBuilder.ToString());
                        if (prop.Value.Value<JObject>()["attachOverride"] != null)
                        {
                            jsString = jsString.Replace("<attachOverride>", prop.Value.Value<JObject>()["attachOverride"].Value<string>());
                        }
                        else
                        {
                            jsString = jsString.Replace("<attachOverride>", "");
                        }
                        System.IO.File.WriteAllText(System.IO.Path.Combine(outputPath, kebabObjectName, kebabObjectName + ".js"), jsString);
                    }
                    else
                    {
                        Console.WriteLine(objectName + " could not be found in package " + name.Name);
                    }
                }
            }
        }
    }
}

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
        public void Compile(string path, string outputPath)
        {
            if (String.IsNullOrEmpty(outputPath))
                throw new System.IO.FileNotFoundException("Output path must be specified");

            //load SAP UI5 api json (given in path variable)
            var rootObject = (JObject)Newtonsoft.Json.Linq.JObject.ReadFrom(new JsonTextReader(System.IO.File.OpenText(path)));
            var configObject = (JObject)Newtonsoft.Json.Linq.JObject.ReadFrom(new JsonTextReader(System.IO.File.OpenText("./config.json")));
            // iterate over all properties to compile only specified objects
            foreach (var prop in configObject.Properties())
            {
                string objectName = prop.Name;

                //find the objecct in UI5 api definition
                var uiObject = rootObject.Property("symbols").Value.Where(obj => ((JObject)obj)["basename"].Value<string>() == objectName).FirstOrDefault();
                if (uiObject != null)
                {
                    string kebabObjectName = objectName.PascalToKebabCase();
                    //create new directory
                    System.IO.Directory.CreateDirectory(System.IO.Path.Combine(outputPath, kebabObjectName));
                    System.IO.File.Copy("./templates/Basic.html", System.IO.Path.Combine(outputPath, kebabObjectName, kebabObjectName + ".html"), true);
                    System.IO.File.Copy("./templates/Basic.js", System.IO.Path.Combine(outputPath, kebabObjectName, kebabObjectName + ".js"), true);
                    //replace HTML template
                    XElement templateRoot = XElement.Parse(System.IO.File.ReadAllText("./templates/Basic.html"));
                    var contentRoot = templateRoot.Element("CONTENT");
                    var aggregations = (uiObject["ui5-metadata"] as JObject)?.Property("aggregations");
                    StringBuilder addChildBuilder = new StringBuilder();
                    StringBuilder removeChildBuilder = new StringBuilder();
                    if (aggregations != null)
                    {
                        foreach (var agg in (aggregations.Value as JArray))
                        {
                            if (agg["visibility"].Value<string>() == "public")
                            {
                                var aggName = agg["name"].Value<string>();
                                XElement newAggregationElement = new XElement(aggName);
                                XElement slotElement = new XElement("slot");
                                slotElement.Value = string.Empty;
                                if (prop.Value["defaultSlot"] == null || prop.Value["defaultSlot"].Value<string>() != aggName)
                                {
                                    slotElement.SetAttributeValue("name", aggName);
                                }
                                newAggregationElement.Add(slotElement);
                                templateRoot.Add(newAggregationElement);
                                if (agg["cardinality"].Value<string>() == "0..1")
                                {
                                    addChildBuilder.AppendLine("if (elem.localName == '" + aggName + "') { this." + "_" + objectName.ToLower() + "." + agg["methods"].Value<JArray>()[2].Value<string>() + "(child); return elem.localName;}");
                                }
                                else if (agg["cardinality"].Value<string>() == "0..n")
                                {
                                    addChildBuilder.AppendLine("if (elem.localName == '" + aggName + "') { var _index = null; if (afterElement) _index = this." +
                                        "_" + objectName.ToLower() +
                                        "." + agg["methods"].Value<JArray>()[5].Value<string>() + "(afterElement); if (_index)this." + "_" + objectName.ToLower() +
                                        "." + agg["methods"].Value<JArray>()[2].Value<string>() + "(child, _index + 1); else this." +
                                        "_" + objectName.ToLower() +
                                        "." + agg["methods"].Value<JArray>()[3].Value<string>() + "(child, 0);  return elem.localName; }");

                                    removeChildBuilder.AppendLine("if (relation == '" +
                                        aggName + "') {  this." +
                                        "_" + objectName.ToLower() +
                                        "." + agg["methods"].Value<JArray>()[4].Value<string>() + "(child); }");
                                }

                            }
                        }
                    }
                    contentRoot.Remove();

                    System.IO.File.WriteAllText(System.IO.Path.Combine(outputPath, kebabObjectName, kebabObjectName + ".html"), templateRoot.ToString());

                    //replace js file
                    string jsString = System.IO.File.ReadAllText("./templates/Basic.js");
                    jsString = jsString.Replace("<classvar>", "_" + objectName.ToLower());
                    jsString = jsString.Replace("<classname>", "Ui5" + objectName);
                    jsString = jsString.Replace("<parentClass>", "Ui5" + uiObject["extends"].Value<string>().Split(".").Last());
                    jsString = jsString.Replace("<uiname>", "ui5-" + kebabObjectName);
                    jsString = jsString.Replace("<sapClass>", uiObject["name"].Value<string>());
                    StringBuilder propertyBuilder = new StringBuilder();
                    StringBuilder paramBuilder = new StringBuilder();
                    StringBuilder changeHandlerBuilder = new StringBuilder();
                    StringBuilder specialEventBuilder = new StringBuilder();
                    var properties = (uiObject["ui5-metadata"] as JObject)?.Property("properties");
                    if (properties != null)
                    {
                        foreach (var property in (properties.Value as JArray))
                        {
                            if (property["visibility"].Value<string>() == "public")
                            {
                                var isBoolean = property["type"].Value<string>() == "boolean";
                                var isNullDefault = property["defaultValue"].Value<string>() == "null";
                                var defaultValue = isNullDefault ? null : "'" + property["defaultValue"].Value<string>() + "'";
                                propertyBuilder.AppendLine("@bindable() " + property["name"].Value<string>() + " = " + defaultValue + ";");
                                var newValue = "(newValue);}}";
                                var paramValue = "this." + property["name"].Value<string>();
                                if (isBoolean)
                                {
                                    newValue = "(getBooleanFromAttributeValue(newValue));}}";
                                    paramValue = "getBooleanFromAttributeValue(" + paramValue + ")";
                                }

                                paramBuilder.AppendLine(property["name"].Value<string>() + " : " + paramValue + ",");
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
                        var events = (uiObject["ui5-metadata"] as JObject)?.Property("events");
                        if (events != null)
                        {
                            foreach (var ev in (events.Value as JArray))
                            {
                                if (ev["visibility"].Value<string>() == "public")
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
                            if (configObject["events"] != null)
                            {
                                foreach (var evObj in configObject["events"].Value<JObject>().Properties())
                                {
                                    specialEventBuilder.AppendLine("this." +
                                        "_" + objectName.ToLower() +
                                        ".attach" + evObj.Name + "((event) => { that." + evObj.Value<string>() + " = event.mParameters."+ evObj.Value<string>() + "; });");
                                }
                            }

                        }
                    }
                    jsString = jsString.Replace("<properties>", propertyBuilder.ToString());
                    jsString = jsString.Replace("<paramlist>", paramBuilder.ToString());
                    jsString = jsString.Replace("<changeHandler>", changeHandlerBuilder.ToString());
                    jsString = jsString.Replace("<addChilds>", addChildBuilder.ToString());
                    jsString = jsString.Replace("<removeChilds>", removeChildBuilder.ToString());
                    jsString = jsString.Replace("<specialevents>", specialEventBuilder.ToString());
                    System.IO.File.WriteAllText(System.IO.Path.Combine(outputPath, kebabObjectName, kebabObjectName + ".js"), jsString);
                }
            }
        }
    }
}

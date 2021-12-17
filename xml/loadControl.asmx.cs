using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;
using System.Xml;


namespace BAG.xml
{
    /// <summary>
    /// Сводное описание для loadControl
    /// </summary>
    [WebService(Namespace = "http://maxFreind.ru/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // Чтобы разрешить вызывать веб-службу из скрипта с помощью ASP.NET AJAX, раскомментируйте следующую строку. 
    // [System.Web.Script.Services.ScriptService]
    public class loadControl : System.Web.Services.WebService
    {
        [WebMethod(EnableSession = true)]
        public XmlDocument loadUserInfo()
        {
            bagClass b = new bagClass();
            StringBuilder sb = new StringBuilder();
            general g = new general();
            if (b.get_role() != "")
            {
                try
                {
                    string idUser = b.getUserId();
                    sb.Append("<fields>");
                    var lis = b.connect("getUserInfo", new string[] { idUser });
                    if (lis.Count > 0)
                    {
                        for (int i = 0; i < lis.Count; i++)
                        {
                            sb.Append("<field>");
                            sb.Append(g.createNode("nameField", lis[i].ElementAt(0).Value));
                            sb.Append(g.createNode("enNameField", lis[i].ElementAt(1).Value));                           
                            sb.Append(g.createNode("valueField", lis[i].ElementAt(2).Value));
                            sb.Append("</field>");
                        }
                    }
                    sb.Append("</fields>");

                }
                catch (Exception e)
                {
                    return g.returnFalse(e.Message);
                }
                XmlDocument xmlDocument = new XmlDocument();
                xmlDocument.LoadXml(sb.ToString());
                return xmlDocument;
            }
            else
                return g.returnFalse("Нет доступа!");
        }

        [WebMethod(EnableSession = true)]
        public XmlDocument saveInfoUser()
        {
            bagClass b = new bagClass();
            general g = new general();
            if (b.get_role() != "")
            {
                StringBuilder sb = new StringBuilder();
                string idUser = b.getUserId();
                string property = Context.Request.Form["arrayValue"] != null ? Context.Request.Form["arrayValue"] : "";
                JavaScriptSerializer ser = new JavaScriptSerializer();
                List<Dictionary<string, string>> json = ser.Deserialize<List<Dictionary<string, string>>>(property);
                int i = 0;                
                if (json.Count > 0)
                {
                    try
                    {
                        for (i = 0; i < json.Count; i++)
                        {
                            if (json[i].ElementAt(0).Value != "")
                                b.connect("update_info_user", new string[] { idUser, json[i].ElementAt(0).Value, json[i].ElementAt(1).Value });
                        }
                    }
                    catch (Exception e)
                    {
                        return g.returnFalse(e.Message);
                    }
                }
                else
                    return g.returnFalse("Входной параметр имел не верный формат!");
            }
            else
                return g.returnFalse("Нет доступа!");
            return null;
        }
   
        [WebMethod(EnableSession = true)]
        public XmlDocument loadUserField()
        {
            bagClass b = new bagClass();
            StringBuilder sb = new StringBuilder();
            general g = new general();
            if (b.get_role() != "")
            {
                try
                {
                    string idField = Context.Request.Form["idField"] != null ? Context.Request.Form["idField"] : "";
                    int id = 0;
                    id = Int32.TryParse(idField, out id) ? id : 0;
                    sb.Append("<fields>");                    
                    var lis = b.connect("selectField", new string[] {id.ToString() });                    
                    if (lis.Count > 0)
                    {
                        for (int i = 0; i < lis.Count; i++)
                        {
                            sb.Append("<field>");
                            sb.Append(g.createNode("idField", lis[i].ElementAt(0).Value));
                            sb.Append(g.createNode("enNameField", lis[i].ElementAt(1).Value));
                            sb.Append(g.createNode("nameField", lis[i].ElementAt(2).Value));
                            sb.Append(g.createNode("typeField", lis[i].ElementAt(3).Value));
                            sb.Append(g.createNode("valueField", lis[i].ElementAt(4).Value));
                            sb.Append(g.createNode("regexField", lis[i].ElementAt(5).Value));
                            sb.Append(g.createNode("messageRegex", lis[i].ElementAt(6).Value));
                            sb.Append(g.createNode("enabledField", lis[i].ElementAt(7).Value));
                            sb.Append("</field>");
                        }
                    }

                    string idProperty = Context.Request.Form["idProperty"] != null ? Context.Request.Form["idProperty"] : "";                    
                    id = Int32.TryParse(idProperty, out id) ? id : 0;
                    if (id != 0)
                    {
                        lis = b.connect("selectOptionsBlock", new string[] { id.ToString() });
                        sb.Append("<options>");
                        if (lis.Count > 0)
                        {

                            for (int i = 0; i < lis.Count; i++)
                            {
                                sb.Append(g.createNode("idOptions", lis[i].ElementAt(0).Value));
                                sb.Append(g.createNode(lis[i].ElementAt(2).Value, lis[i].ElementAt(3).Value));
                            }
                        }
                        sb.Append("</options>");
                    }
                    sb.Append("</fields>");

                }
                catch (Exception e)
                {
                    return g.returnFalse(e.Message);
                }
                XmlDocument xmlDocument = new XmlDocument();
                xmlDocument.LoadXml(sb.ToString());
                return xmlDocument;
            }
            else
                return null;
        }

        [WebMethod(EnableSession = true)]
        public XmlDocument newUserField()
        {
            bagClass b = new bagClass();
            general g = new general();
            if (b.get_role() == "admin" && b.get_edit_mode)
            {
                try
                {
                    string enNameField = Context.Request.Form["enNameField"] != null ? Context.Request.Form["enNameField"] : "";
                    string nameField = Context.Request.Form["nameField"] != null ? Context.Request.Form["nameField"] : "";
                    string typeField = Context.Request.Form["typeField"] != null ? Context.Request.Form["typeField"] : "";
                    string enabledField = Context.Request.Form["enabledField"] != null ? Context.Request.Form["enabledField"] : "";
                    string idField = Context.Request.Form["idField"] != null ? Context.Request.Form["idField"] : "";
                    string valueField = Context.Request.Form["valueField"] != null ? Context.Request.Form["valueField"] : "";
                    string regexField = Context.Request.Form["regexField"] != null ? Context.Request.Form["regexField"] : "";
                    string messageRegex = Context.Request.Form["messageRegex"] != null ? Context.Request.Form["messageRegex"] : "";
                    if (enNameField != "" && nameField != "" && typeField != "" && (enabledField == "true" || enabledField == "false"))
                    {
                        int id = 0;
                        if (!Int32.TryParse(idField, out id))
                            b.connect("newUserField", new string[] { enNameField.Replace(' ', '_'), nameField, typeField, valueField, regexField, messageRegex, enabledField });
                        else
                            b.connect("updateUserField", new string[] { idField, enNameField.Replace(' ', '_'), nameField, typeField, valueField, regexField, messageRegex, enabledField });
                    }
                    else
                        return g.returnFalse("Не допустимые значения!");

                }
                catch (Exception e)
                {
                    return g.returnFalse(e.Message);
                }
                return null;
            }
            else
                return g.returnFalse("Нет доступа!");
        }
               
        [WebMethod(EnableSession = true)]
        public XmlDocument deleteUserField()
        {
            bagClass b = new bagClass();
            general g = new general();
            if (b.get_role() == "admin" && b.get_edit_mode)
            {
                try
                {
                    string idField = Context.Request.Form["idField"] != null ? Context.Request.Form["idField"] : "";
                    int id = 0;
                    if (Int32.TryParse(idField, out id))
                    {
                        b.connect("deleteUserField", new string[] { idField });
                    }
                    else
                        return g.returnFalse("Не допустимые значения!");

                }
                catch (Exception e)
                {
                    return g.returnFalse(e.Message);
                }
                return null;
            }
            else
                return g.returnFalse("Нет доступа!");
        }

        [WebMethod(EnableSession = true)]
        public XmlDocument loadBox()
        {
            bagClass b = new bagClass();
            StringBuilder sb = new StringBuilder();
            general g = new general();
            string idProperty = Context.Request.Form["idProperty"] != null ? Context.Request.Form["idProperty"] : "";
            string idPage = Context.Request.Form["idPage"] != null ? Context.Request.Form["idPage"] : "";
            try
            {
                int id = 0;
                if (Int32.TryParse(idPage, out id) && Int32.TryParse(idProperty, out id))
                {
                    sb.Append("<controlBox>");                    
                    var lis = b.connect("selectBoxModule", new string[] { id.ToString(), idPage });
                    if (lis.Count > 0)
                    {
                        for (int i = 0; i < lis.Count; i++)
                        {
                            sb.Append("<control>");
                            sb.Append(g.createNode("idProperty", lis[i].ElementAt(1).Value));
                            sb.Append(g.createNode("class", lis[i].ElementAt(2).Value));
                            sb.Append(g.createNode("onLoad", lis[i].ElementAt(3).Value));
                            sb.Append("</control>");
                        }
                    }
                    sb.Append("</controlBox>");
                }
                else
                {
                    return g.returnFalse("Не допустимое значение! Исполняющий метод loadBox().");
                }
            }
            catch (Exception e)
            {
                return g.returnFalse(e.Message);
            }
            XmlDocument xmlDocument = new XmlDocument();
            xmlDocument.LoadXml(sb.ToString());
            return xmlDocument;
        }

        [WebMethod]        
        public XmlDocument htmlText()
        {            
            general g = new general();
            bagClass b = new bagClass();
            StringBuilder sb = new StringBuilder();
            string idProperty = Context.Request.Form["idProperty"] != null ? Context.Request.Form["idProperty"] : "";
            int i = 0;
            int id = Int32.TryParse(idProperty, out i) ? i : 0;
            if (id != 0)
            {
                try
                {
                    var lis = b.connect("select_module_box", new string[] { id.ToString() });
                    if (lis.Count > 0)
                    {
                        sb.Append("<moduleText>");
                        sb.Append(g.createNode("htmlText", lis[0].ElementAt(0).Value));
                        sb.Append("</moduleText>");
                    }
                }
                catch (Exception e)
                {
                    return g.returnFalse(e.Message);
                }
            }
            else
                return g.returnFalse("Не допустимое значение! Исполняющий метод htmlText().");
            XmlDocument xmlDocument = new XmlDocument();
            xmlDocument.LoadXml(sb.ToString());
            return xmlDocument;
        }
                
        [WebMethod]
        public XmlDocument navMenu()
        {            
            string parentMenu = Context.Request.Form["parentMenu"] != null ? Context.Request.Form["parentMenu"] : "";
            string idProperty = Context.Request.Form["idProperty"] != null ? Context.Request.Form["idProperty"] : "";
            if (idProperty != "")
                return getChildMenu(idProperty, parentMenu);
            else
                return null;
        }
        public XmlDocument getChildMenu(string idProperty, string parentMenu)
        {
            general g = new general();
            bagClass b = new bagClass();
            StringBuilder sb = new StringBuilder();            
            int i = -1;
            int id = Int32.TryParse(parentMenu, out i) ? i : -1;
            if (id != -1 && Int32.TryParse(idProperty, out i))
            {
                try
                {
                    var lis = b.connect("select_menu", new string[] {idProperty, parentMenu });
                    if (lis.Count > 0)
                    {
                        sb.Append("<Menu>");
                        for (i = 0; i < lis.Count; i++)
                        {
                            sb.Append("<Menu" + parentMenu + ">");
                            sb.Append(g.createNode("idMenu", lis[i].ElementAt(0).Value));
                            sb.Append(g.createNode("nameMenu", lis[i].ElementAt(1).Value));
                            sb.Append(g.createNode("urlMenu", lis[i].ElementAt(2).Value));
                            if (getChildMenu(idProperty, lis[i].ElementAt(0).Value) != null)
                                sb.Append(getChildMenu(idProperty, lis[i].ElementAt(0).Value));
                            sb.Append("</Menu" + parentMenu + ">");
                        }
                        sb.Append("</Menu>");
                    }
                    else
                        return null;
                }
                catch (Exception e)
                {
                    return g.returnFalse(e.Message);
                }
            }
            else
                return g.returnFalse("Не допустимое значение! Исполняющий метод getChildMenu().");
            XmlDocument xmlDocument = new XmlDocument();
            xmlDocument.LoadXml(sb.ToString());
            return xmlDocument;
        }

        [WebMethod(EnableSession = true)]
        public XmlDocument getModuleMenu()
        {
            bagClass b = new bagClass();
            StringBuilder sb = new StringBuilder();
            general g = new general();
            if (b.get_role() == "admin" && b.get_edit_mode)
            {
                try
                {
                    string idProperty = Context.Request.Form["idProperty"] != null ? Context.Request.Form["idProperty"] : "";
                    int id = 0;
                    if (Int32.TryParse(idProperty, out id))
                    {
                        sb.Append("<menuModule>");
                        var lis = b.connect("get_module_menu", new string[] { id.ToString() });
                        if (lis.Count > 0)
                        {
                            for (int i = 0; i < lis.Count; i++)
                            {
                                sb.Append("<menu>");
                                sb.Append(g.createNode("onclick", lis[i].ElementAt(1).Value + "(" + id + ")"));
                                sb.Append(g.createNode("InnerHtml", lis[i].ElementAt(0).Value));
                                sb.Append("</menu>");
                            }
                        }
                        sb.Append("<menu>");
                        sb.Append(g.createNode("onclick", "baggeneral.dialogCssEditorFast(" + id + ")"));
                        sb.Append(g.createNode("InnerHtml", "Оформление блока"));
                        sb.Append("</menu>");

                        sb.Append("<menu>");
                        sb.Append(g.createNode("onclick", "baggeneral.dialogCssEditor(" + id + ")"));
                        sb.Append(g.createNode("InnerHtml", "Редактор CSS"));
                        sb.Append("</menu>");

                        sb.Append("<menu>");
                        sb.Append(g.createNode("onclick", "bagmarker.saveMarker(" + id + ")"));
                        sb.Append(g.createNode("InnerHtml", "Создать метку"));
                        sb.Append("</menu>");

                        sb.Append("<menu>");
                        sb.Append(g.createNode("onclick", "bagmarker.getMarker(" + id + ")"));
                        sb.Append(g.createNode("InnerHtml", "Синхронизировать с меткой"));
                        sb.Append("</menu>");

                        sb.Append("<menu>");
                        sb.Append(g.createNode("onclick", "baggeneral.saveProperty(" + id + ")"));
                        sb.Append(g.createNode("InnerHtml", "Сохранить настройки"));
                        sb.Append("</menu>");

                        sb.Append("<menu>");
                        sb.Append(g.createNode("onclick", "bagrequest.getSaveProperty(" + id + ")"));
                        sb.Append(g.createNode("InnerHtml", "Загрузить настройки"));
                        sb.Append("</menu>");

                        sb.Append("<menu>");
                        sb.Append(g.createNode("onclick", "bagrequest.deleteModule(" + id + ")"));
                        sb.Append(g.createNode("InnerHtml", "Удалить"));
                        sb.Append("</menu>");

                        sb.Append("</menuModule>");
                    }
                    else
                    {
                        sb.Append(g.createNode("message", "Не допустимое значение! Исполняющий метод getModuleMenu()."));
                    }
                }
                catch (Exception e)
                {
                    sb.Append(g.createNode("message", e.Message));
                }
                XmlDocument xmlDocument = new XmlDocument();
                xmlDocument.LoadXml(sb.ToString());
                return xmlDocument;
            }
            else
                return null;            
        }
    }
}

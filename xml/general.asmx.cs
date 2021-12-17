using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Security;
using System.Web.Services;
using System.Web.UI.HtmlControls;
using System.Xml;
using System.Web.Script.Serialization;

namespace BAG.xml
{
    /// <summary>
    /// Сводное описание для general
    /// </summary>
    [WebService(Namespace = "http://maxFreind.ru/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // Чтобы разрешить вызывать веб-службу из скрипта с помощью ASP.NET AJAX, раскомментируйте следующую строку. 
    // [System.Web.Script.Services.ScriptService]
    public class general : System.Web.Services.WebService
    {  
        [WebMethod(EnableSession = true)]
        public XmlDocument saveNewUserFile()
        {
            bagClass b = new bagClass();
            if (b.get_role() == "admin")
            {                
                try
                {
                    string arrayFile = Context.Request.Form["arrayFile"] != null ? Context.Request.Form["arrayFile"] : "";
                    string[] file_name = arrayFile.Split(';');
                    if (file_name.Length > 0)
                    {
                        for (int i = 0; i < file_name.Length; i++)
                        {
                            if (File.Exists(Server.MapPath("/temp_file/" + file_name[i])) && File.Exists(Server.MapPath("/temp_file/s" + file_name[i])))
                            {
                                File.Move(Server.MapPath("/temp_file/" + file_name[i]), Server.MapPath("/user_images/" + file_name[i]));
                                File.Move(Server.MapPath("/temp_file/s" + file_name[i]), Server.MapPath("/user_images/s" + file_name[i]));
                            }
                        }
                    }
                }
                catch (Exception e)
                {
                    return returnFalse(e.Message);
                }
            }
            else
                return returnFalse("Нет доступа!");
            return null;
        }

        [WebMethod(EnableSession = true)]
        public XmlDocument saveTempImg()
        {
            bagClass b = new bagClass();
            if (b.get_role() == "admin")
            {
                StringBuilder sb = new StringBuilder();
                try
                {
                    HttpFileCollection f = this.Context.Request.Files;
                    string str_name = DateTime.Now.Ticks.ToString();                    
                    FileInfo fName = new FileInfo(f[0].FileName);
                    f[0].SaveAs(Server.MapPath("/temp_file/" + fName.Name));
                    string ext = fName.Name.Split('.')[fName.Name.Split('.').Length - 1];
                    FileInfo fil = new FileInfo("/temp_file/" + fName.Name);
                    replaceNewImg(fil, 2600, 1500, str_name + "." + ext);
                    replaceNewImg(fil, 500, 390, "s" + str_name + "." + ext);
                    File.Delete(Server.MapPath("/temp_file/" + fil.Name));                    
                    sb.Append(createNode("tempFile", "/temp_file/s" + str_name + "." + ext));
                    deleteTempImg();
                    XmlDocument xmlDocument = new XmlDocument();
                    xmlDocument.LoadXml(sb.ToString());
                    return xmlDocument;
                }
                catch (Exception e)
                {
                    return returnFalse(e.Message);
                }

            }
            else
                return returnFalse("Нет доступа!");            
        }

        [WebMethod(EnableSession = true)]
        public XmlDocument deleteOptionsBlock()
        {
            bagClass b = new bagClass();
            if (b.get_role() == "admin" && b.get_edit_mode)
            {
                StringBuilder sb = new StringBuilder();
                string idOptions = Context.Request.Form["idOptions"] != null ? Context.Request.Form["idOptions"] : "";
                int i = 0;
                int id = Int32.TryParse(idOptions, out i) ? i : 0;
                if (id != 0)
                {
                    try
                    {
                        b.connect("deleteOptionsBlock", new string[] { id.ToString() });
                    }
                    catch (Exception e)
                    {
                        return returnFalse(e.Message);
                    }
                }
                else
                    return returnFalse("Входной параметр имел не верный формат!");
            }
            else
                return returnFalse("Нет доступа!");
            return null;
        }

        [WebMethod(EnableSession = true)]
        public XmlDocument saveNewSlider()
        {
            bagClass b = new bagClass();
            if (b.get_role() == "admin" && b.get_edit_mode)
            {
                string imageSlider = Context.Request.Form["imageSlider"] != null ? Context.Request.Form["imageSlider"] : "";
                string idProperty = Context.Request.Form["idProperty"] != null ? Context.Request.Form["idProperty"] : "";
                string textSlider = Context.Request.Form["textSlider"] != null ? Context.Request.Form["textSlider"] : "";
                string idSlider = Context.Request.Form["idSlider"] != null ? Context.Request.Form["idSlider"] : "";
                string sliderValue = "";
                if (imageSlider != "")
                    sliderValue = "imgSlider:" + imageSlider + "&";
                if (textSlider != "")
                    sliderValue += "textSlider:" + textSlider + "&";
                StringBuilder sb = new StringBuilder();
                int i = 0;
                int id = Int32.TryParse(idSlider, out i) ? i : 0;
                int idM = Int32.TryParse(idProperty, out i) ? i : 0;
                try
                {
                    if (id == 0)
                    {
                        if (sliderValue != "" && idM != 0)
                            b.connect("insertSlider", new string[] { idM.ToString(), "slider", sliderValue });
                    }
                    else
                    {
                        if (sliderValue != "")
                            b.connect("updateOptionsBlock", new string[] { id.ToString(), "slider", sliderValue });
                    }
                }
                catch (Exception e)
                {
                    return returnFalse(e.Message);
                }
            }
            else
                return returnFalse("Нет доступа!");
            return null;
        }
        
        [WebMethod(EnableSession = true)]
        public XmlDocument updateMenuLevel()
        {
            bagClass b = new bagClass();
            if (b.get_role() == "admin")
            {
                StringBuilder sb = new StringBuilder();
                string idProperty = Context.Request.Form["idProperty"] != null ? Context.Request.Form["idProperty"] : "";
                string property = Context.Request.Form["property"] != null ? Context.Request.Form["property"] : "";
                JavaScriptSerializer ser = new JavaScriptSerializer();
                List<Dictionary<string, string>> json = ser.Deserialize<List<Dictionary<string, string>>>(property);
                int i = 0;
                int id = Int32.TryParse(idProperty, out i) ? i : 0;
                if (id != 0 && json.Count > 0)
                {
                    try
                    {
                        string name = "";
                        string value = "";
                        string dop = "";
                        for (i = 0; i < json.Count; i++)
                        {
                            name = json[i].ContainsKey("name") ? json[i]["name"] : "";
                            value = json[i].ContainsKey("value") ? json[i]["value"] : "";
                            dop = json[i].ContainsKey("dop") ? json[i]["dop"] : "";
                            b.connect("updateMenuLevel", new string[] { dop, name, value });
                        }
                    }
                    catch (Exception e)
                    {
                        return returnFalse(e.Message);
                    }
                }
                else
                    return returnFalse("Входной параметр имел не верный формат!");
            }
            else
                return returnFalse("Нет доступа!");
            return null;
        }

        [WebMethod(EnableSession = true)]
        public XmlDocument getPages()
        {
            bagClass b = new bagClass();
            if (b.get_role() == "admin" && b.get_edit_mode)
            {
                StringBuilder sb = new StringBuilder();
                try
                {
                    var lis = b.connect("get_pages");
                    sb.Append("<pages>");
                    if (lis.Count > 0)
                    {
                        for (int i = 0; i < lis.Count; i++)
                        {
                            sb.Append("<page>");
                            sb.Append(createNode("namePage", lis[i].ElementAt(1).Value));
                            sb.Append(createNode("urlPage", lis[i].ElementAt(2).Value));
                            sb.Append("</page>");
                        }
                    }
                    sb.Append("</pages>");
                }
                catch (Exception e)
                {
                    return returnFalse(e.Message);
                }
                XmlDocument xmlDocument = new XmlDocument();
                xmlDocument.LoadXml(sb.ToString());
                return xmlDocument;
            }
            else
                return returnFalse("Нет доступа!");
        }

        [WebMethod(EnableSession = true)]
        public XmlDocument saveTemplate()
        {
            bagClass b = new bagClass();
            if (b.get_role() == "admin")
            {
                StringBuilder sb = new StringBuilder();
                string idPage = Context.Request.Form["idPage"] != null ? Context.Request.Form["idPage"] : "";
                string nameTemplate = Context.Request.Form["nameTemplate"] != null ? Context.Request.Form["nameTemplate"] : "";
                int i = 0;
                string strStyle = "";
                int id = Int32.TryParse(idPage, out i) ? i : 0;
                if (id != 0 && nameTemplate != "")
                {
                    try
                    {
                        var lis = b.connect("insertTemplates", new string[] { id.ToString(), nameTemplate });
                        if (lis.Count > 0)
                        {
                            for (i = 0; i < lis.Count; i++)
                            {
                                strStyle = "";
                                if (File.Exists(Server.MapPath("/App_Themes/theme1/user_theme/" + lis[i].ElementAt(0).Value + ".css")))
                                {
                                    StreamReader read = new StreamReader(Server.MapPath("/App_Themes/theme1/user_theme/" + lis[i].ElementAt(0).Value + ".css"));
                                    strStyle = read.ReadToEnd();
                                    read.Close();

                                    strStyle = strStyle.Replace(lis[i].ElementAt(0).Value, "container_templates");
                                    strStyle = strStyle;                                    
                                }
                                b.connect("updateCssTemplates", new string[] { lis[i].ElementAt(1).Value, strStyle });
                            }
                        }
                    }
                    catch (Exception e)
                    {
                        return returnFalse(e.Message);
                    }
                }
                else
                    return returnFalse("Входной параметр имел не верный формат!");
            }
            else
                return returnFalse("Нет доступа!");
            return null;
        }

        [WebMethod(EnableSession = true)]
        public XmlDocument deletePage()
        {
            bagClass b = new bagClass();
            if (b.get_role() == "admin")
            {
                StringBuilder sb = new StringBuilder();
                string idPage = Context.Request.Form["idPage"] != null ? Context.Request.Form["idPage"] : "";
                int i = 0;
                int id = Int32.TryParse(idPage, out i) ? i : 0;
                if (id != 0)
                {
                    try
                    {
                        var lis = b.connect("delete_page", new string[] { id.ToString() });
                        if (lis.Count > 0)
                        {
                            File.Delete(Server.MapPath("../" + lis[0].ElementAt(0).Value));
                        }

                        lis = b.connect("delete_page_module", new string[] { id.ToString() });

                        if (lis.Count > 0)
                        {
                            for (i = 0; i < lis.Count; i++)
                            {                                
                               File.Delete(Server.MapPath("../App_Themes/theme1/user_theme/" + lis[i].ElementAt(0).Value + ".css"));
                            }
                        }
                    }
                    catch (Exception e)
                    {
                        return returnFalse(e.Message);
                    }
                }
                else
                    return returnFalse("Входной параметр имел не верный формат!");
            }
            else
                return returnFalse("Нет доступа!");
            return null;
        }

        [WebMethod(EnableSession = true)]
        public XmlDocument addMarker()
        {
            bagClass b = new bagClass();
            if (b.get_role() == "admin" && b.get_edit_mode)
            {
                StringBuilder sb = new StringBuilder();
                string nameMarker = Context.Request.Form["nameMarker"] != null ? Context.Request.Form["nameMarker"] : "";
                string idProperty = Context.Request.Form["idProperty"] != null ? Context.Request.Form["idProperty"] : "";
                int i = 0;
                int id = Int32.TryParse(idProperty, out i) ? i : 0;
                if (id != 0 && nameMarker != "")
                {
                    try
                    {
                        var lis = b.connect("addmarker", new string[] { id.ToString(), nameMarker });
                        if (lis.Count > 0)
                        {
                            return returnFalse(lis[0].ElementAt(0).Value);
                        }                            
                    }
                    catch (Exception e)
                    {
                        return returnFalse(e.Message);
                    }
                }
                else
                    return returnFalse("Входной параметр имел не верный формат!");
            }
            else
                return returnFalse("Нет доступа!");
            return null;
        }

        [WebMethod(EnableSession = true)]
        public XmlDocument getMarker()
        {
            bagClass b = new bagClass();
            if (b.get_role() == "admin" && b.get_edit_mode)
            {
                StringBuilder sb = new StringBuilder();
                string idProperty = Context.Request.Form["idProperty"] != null ? Context.Request.Form["idProperty"] : "";
                int i = 0;
                int id = Int32.TryParse(idProperty, out i) ? i : 0;
                if (id != 0)
                {
                    try
                    {
                        var lis = b.connect("selectMarker", new string[] { id.ToString() });
                        sb.Append("<markers>");
                        if (lis.Count > 0)
                        {

                            for (i = 0; i < lis.Count; i++)
                            {
                                sb.Append("<marker>");
                                sb.Append(createNode("idMarker", lis[i].ElementAt(0).Value));
                                sb.Append(createNode("nameMarker", lis[i].ElementAt(1).Value));
                                sb.Append(createNode("thisMarker", lis[i].ElementAt(2).Value == "" ? "0" : lis[i].ElementAt(2).Value));
                                sb.Append("</marker>");
                            }
                        }
                        sb.Append("</markers>");
                    }
                    catch (Exception e)
                    {
                        return returnFalse(e.Message);
                    }
                }
                else
                    return returnFalse("Входной параметр имел не верный формат!");
                XmlDocument xmlDocument = new XmlDocument();
                xmlDocument.LoadXml(sb.ToString());
                return xmlDocument;
            }
            else
                return returnFalse("Нет доступа!");
        }

        [WebMethod(EnableSession = true)]
        public XmlDocument appyMarker()
        {
            bagClass b = new bagClass();
            if (b.get_role() == "admin" && b.get_edit_mode)
            {
                StringBuilder sb = new StringBuilder();
                string idMarker = Context.Request.Form["idMarker"] != null ? Context.Request.Form["idMarker"] : "";
                string idProperty = Context.Request.Form["idProperty"] != null ? Context.Request.Form["idProperty"] : "";
                int i = 0;
                int id = Int32.TryParse(idProperty, out i) ? i : 0;
                int idM = Int32.TryParse(idMarker, out i) ? i : -1;
                if (id != 0 && idM != -1)
                {
                    try
                    {
                        if (idM == 0)
                            b.connect("deletemarker", new string[] { id.ToString() });
                        else
                            b.connect("appymarker", new string[] { id.ToString(), idM.ToString() });

                    }
                    catch (Exception e)
                    {
                        return returnFalse(e.Message);
                    }
                }
                else
                    return returnFalse("Входной параметр имел не верный формат!");
            }
            else
                return returnFalse("Нет доступа!");
            return null;
        }

        [WebMethod(EnableSession = true)]
        public XmlDocument appySaveProperty()
        {
            bagClass b = new bagClass();
            if (b.get_role() == "admin" && b.get_edit_mode)
            {
                StringBuilder sb = new StringBuilder();
                string idSaveProperty = Context.Request.Form["idSaveProperty"] != null ? Context.Request.Form["idSaveProperty"] : "";
                string idProperty = Context.Request.Form["idProperty"] != null ? Context.Request.Form["idProperty"] : "";
                int i = 0;
                int id = Int32.TryParse(idProperty, out i) ? i : 0;
                int idSave = Int32.TryParse(idSaveProperty, out i) ? i : 0;
                string newCss = "";
                string strStyle = "";
                if (id != 0 && idSave != 0)
                {
                    try
                    {
                        var lis = b.connect("infoSaveProperty", new string[] { idSave.ToString() });
                        if (lis.Count > 0)
                        {
                            newCss = "container_" + id;
                            strStyle = lis[0].ElementAt(4).Value.Replace("container_save", newCss);                            
                            StreamWriter write = new StreamWriter(Server.MapPath("/App_Themes/theme1/user_theme/" + newCss + ".css"), false, System.Text.Encoding.UTF8);
                            write.Write(strStyle);
                            write.Close();

                            lis = b.connect("appySaveProperty", new string[] { id.ToString(), idSave.ToString(), newCss });
                            if (lis.Count > 0)
                            {
                                File.Delete(Server.MapPath("/App_Themes/theme1/user_theme/" + lis[0].ElementAt(0).Value + ".css"));
                            }
                            
                        }
                    }
                    catch (Exception e)
                    {
                        return returnFalse(e.Message);
                    }
                }
                else
                    return returnFalse("Входной параметр имел не верный формат!");
            }
            else
                return returnFalse("Нет доступа!");
            return null;
        }

        [WebMethod(EnableSession = true)]
        public XmlDocument getProperty()
        {
            bagClass b = new bagClass();
            if (b.get_role() == "admin" && b.get_edit_mode)
            {
                StringBuilder sb = new StringBuilder();
                string idProperty = Context.Request.Form["idProperty"] != null ? Context.Request.Form["idProperty"] : "";
                int i = 0;
                int id = Int32.TryParse(idProperty, out i) ? i : 0;
                if (id != 0)
                {
                    try
                    {
                        var lis = b.connect("getSaveProperty", new string[] { id.ToString() });
                        sb.Append("<options>");
                        if (lis.Count > 0)
                        {

                            for (i = 0; i < lis.Count; i++)
                            {
                                sb.Append("<property>");
                                sb.Append(createNode("idProperty", lis[i].ElementAt(0).Value));
                                sb.Append(createNode("nameProperty", lis[i].ElementAt(1).Value));
                                sb.Append("</property>");
                            }
                        }
                        sb.Append("</options>");
                    }
                    catch (Exception e)
                    {
                        return returnFalse(e.Message);
                    }
                }
                else
                    return returnFalse("Входной параметр имел не верный формат!");
                XmlDocument xmlDocument = new XmlDocument();
                xmlDocument.LoadXml(sb.ToString());
                return xmlDocument;
            }
            else
                return returnFalse("Нет доступа!");
        }
        
        [WebMethod(EnableSession = true)]
        public XmlDocument saveProperty()
        {
            bagClass b = new bagClass();
            if (b.get_role() == "admin" && b.get_edit_mode)
            {
                StringBuilder sb = new StringBuilder();
                string nameSave = Context.Request.Form["nameSave"] != null ? Context.Request.Form["nameSave"] : "";
                string idProperty = Context.Request.Form["idProperty"] != null ? Context.Request.Form["idProperty"] : "";
                int i = 0;
                string strStyle = "";
                int id = Int32.TryParse(idProperty, out i) ? i : 0;
                if (id != 0 && nameSave != "")
                {
                    try
                    {
                        var lis = b.connect("select_module_box", new string[] { id.ToString() });
                        if (lis.Count > 0)
                        {
                            strStyle = "";
                            if (File.Exists(Server.MapPath("/App_Themes/theme1/user_theme/" + lis[0].ElementAt(1).Value + ".css")))
                            {
                                StreamReader read = new StreamReader(Server.MapPath("/App_Themes/theme1/user_theme/" + lis[0].ElementAt(1).Value + ".css"));
                                strStyle = read.ReadToEnd();
                                strStyle = strStyle;
                                read.Close();
                                strStyle = strStyle.Replace(lis[0].ElementAt(1).Value, "container_save");                                
                            }
                            b.connect("insertSaveProperty", new string[] { id.ToString(), nameSave, strStyle });
                        }
                        else
                            return returnFalse("Ошибка записи!");
                    }
                    catch (Exception e)
                    {
                        return returnFalse(e.Message);
                    }
                }
                else
                    return returnFalse("Входной параметр имел не верный формат!");
            }
            else
                return returnFalse("Нет доступа!");
            return null;
        }

        [WebMethod(EnableSession = true)]
        public XmlDocument addPageModule()
        {
            bagClass b = new bagClass();
            if (b.get_role() == "admin")
            {
                StringBuilder sb = new StringBuilder();
                string idExten = Context.Request.Form["idExten"] != null ? Context.Request.Form["idExten"] : "";
                string position = Context.Request.Form["position"] != null ? Context.Request.Form["position"] : "";
                string page = Context.Request.Form["page"] != null ? Context.Request.Form["page"] : "";
                int i = 0;
                int id = Int32.TryParse(idExten, out i) ? i : 0;
                int idPage = Int32.TryParse(page, out i) ? i : 0;
                if (id != 0 && idPage != 0 && (position == "form" || Int32.TryParse(position, out i)))
                {
                    try
                    {
                        var lis = b.connect("add_page_module", new string[] { id.ToString(), position, idPage.ToString() });
                        if (lis.Count > 0)
                            if (lis[0].Keys.Contains("error"))
                                return returnFalse(lis[0]["error"]);
                    }
                    catch (Exception e)
                    {
                        return returnFalse(e.Message);
                    }
                }
                else
                    return returnFalse("Входной параметр имел не верный формат!");
            }
            else
                return returnFalse("Нет доступа!");
            return null;
        }

        [WebMethod(EnableSession = true)]
        public XmlDocument getModule()
        {
            bagClass b = new bagClass();
            if (b.get_role() == "admin")
            {
                StringBuilder sb = new StringBuilder();
                try
                {
                    var lis = b.connect("get_module");
                    sb.Append("<modules>");
                    if (lis.Count > 0)
                    {
                        for (int i = 0; i < lis.Count; i++)
                        {
                            sb.Append("<exten>");
                            sb.Append(createNode("idExten", lis[i].ElementAt(0).Value));
                            sb.Append(createNode("nameExten", lis[i].ElementAt(1).Value));
                            sb.Append(createNode("textExten", lis[i].ElementAt(2).Value));
                            sb.Append("</exten>");
                        }
                    }
                    sb.Append("</modules>");
                }
                catch (Exception e)
                {
                    return returnFalse(e.Message);
                }
                XmlDocument xmlDocument = new XmlDocument();
                xmlDocument.LoadXml(sb.ToString());
                return xmlDocument;
            }
            else
                return returnFalse("Нет доступа!");
        }

        [WebMethod(EnableSession = true)]
        public XmlDocument updatePosition()
        {
            bagClass b = new bagClass();
            if (b.get_role() == "admin" && b.get_edit_mode)
            {
                StringBuilder sb = new StringBuilder();
                string arrayModule = Context.Request.Form["arrayModule"] != null ? Context.Request.Form["arrayModule"] : "";
                string[] id_module_s = arrayModule.Split(',');
                int id = 0;
                string id_module = "";
                try
                {
                    for (int i = 0; i < id_module_s.Length; i++)
                    {
                        if (Int32.TryParse(id_module_s[i].Split('_')[0], out id))
                        {
                            id_module += id.ToString() + ";";
                        }
                    }
                    if (id_module != "")
                    {
                        b.connect("update_position_module", new string[] { id_module });
                    }
                    else
                    {
                        return returnFalse("Не допустимое значение!");
                    }
                }
                catch (Exception e)
                {
                    return returnFalse(e.Message);
                }
            }
            else
                return returnFalse("Нет доступа!");
            return null;
        }

        [WebMethod(EnableSession = true)]
        public XmlDocument getImagesUser()
        {
            bagClass b = new bagClass();
            if (b.get_role() == "admin")
            {
                StringBuilder sb = new StringBuilder();
                string idPage = Context.Request.Form["idPage"] != null ? Context.Request.Form["idPage"] : "";
                int i = 0;
                int id = Int32.TryParse(idPage, out i) ? i : 0;
                try
                {
                    int viewImg = 20;
                    string[] pattern = { ".jpg", ".png", ".gif", ".bmp", ".jpeg" };
                    IEnumerable<FileInfo> fil = new DirectoryInfo(Server.MapPath("/user_images/")).GetFiles("s*.*").OrderByDescending(x => x.CreationTime);
                    sb.Append("<userImages>");
                    for (i = id * viewImg; i < fil.Count() && i < id * viewImg + viewImg; i++)
                    {
                        if (pattern.Contains(fil.ElementAt(i).Extension.ToLower()))
                            sb.Append(createNode("imgUser", "/user_images/" + fil.ElementAt(i).Name));
                    }
                    sb.Append("</userImages>");

                    XmlDocument xmlDocument = new XmlDocument();
                    xmlDocument.LoadXml(sb.ToString());
                    return xmlDocument;
                }
                catch (Exception e)
                {
                    return returnFalse(e.Message);
                }

            }
            else
                return returnFalse("Нет доступа!");
        }

        [WebMethod(EnableSession = true)]
        public XmlDocument saveNewPage()
        {
            bagClass b = new bagClass();
            if (b.get_role() == "admin")
            {
                StringBuilder sb = new StringBuilder();
                string template = Context.Request.Form["template"] != null ? Context.Request.Form["template"] : "";
                string nameNewPage = Context.Request.Form["nameNewPage"] != null ? Context.Request.Form["nameNewPage"] : "";
                string nameNewPageEn = Context.Request.Form["nameNewPageEn"] != null ? Context.Request.Form["nameNewPageEn"] : "";
                string newPageRoles = Context.Request.Form["newPageRoles"] != null ? Context.Request.Form["newPageRoles"] : "";
                nameNewPageEn = nameNewPageEn.Replace(" ", "-");
                int i = 0;
                int id = Int32.TryParse(template, out i) ? i : 0;
                if (nameNewPage != "" && nameNewPageEn != "" && (newPageRoles == "all" || newPageRoles == "register" || newPageRoles == "admin"))
                {
                    try
                    {
                        if (!File.Exists(Server.MapPath("~/" + nameNewPage + ".aspx")))
                        {
                            var lis = b.connect("insert_new_page", new string[] { id.ToString(), newPageRoles, nameNewPage, nameNewPageEn + ".aspx" });
                            if (lis.Count > 0)
                            {
                                StreamWriter write = new StreamWriter(Server.MapPath("~/" + nameNewPageEn + ".aspx"), false, System.Text.Encoding.UTF8);
                                write.WriteLine("<%@ Page Language=\"C#\" AutoEventWireup=\"true\" EnableViewState=\"false\" ValidateRequest=\"false\" CodeBehind=\"BAGclassPage.cs\" Inherits=\"BAG.BAGPage\" %>");
                                write.WriteLine("<!DOCTYPE html PUBLIC \" -//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">");
                                write.WriteLine("<html xmlns=\"http://www.w3.org/1999/xhtml\" >");
                                write.WriteLine("<head id=\"Head1\" runat=\"server\">");
                                write.WriteLine("<title></title>");
                                write.WriteLine("</head>");
                                write.WriteLine("<body id=\"body\" runat=\"server\">");
                                write.WriteLine("<form id=\"form_" + lis[0].ElementAt(0).Value + "\" runat=\"server\">");
                                write.WriteLine("</form>");
                                write.WriteLine("</body>");
                                write.WriteLine("</html>");
                                write.Close();

                                string strStyle = "";
                                string idCss = "";
                                if (lis[0].Keys.Count > 1)
                                {
                                    for (i = 0; i < lis.Count; i++)
                                    {
                                        idCss = "container_" + lis[i].ElementAt(1).Value;
                                        strStyle = lis[i].ElementAt(2).Value.Replace("container_templates", idCss);                                        
                                        if (strStyle == "")
                                            idCss = "";
                                        else
                                        {
                                            write = new StreamWriter(Server.MapPath("/App_Themes/theme1/user_theme/" + idCss + ".css"), false, System.Text.Encoding.UTF8);
                                            write.Write(strStyle);
                                            write.Close();
                                        }
                                        b.connect("updateCssNewPage", new string[] { lis[i].ElementAt(1).Value, idCss });
                                    }
                                }
                            }
                            else
                                return returnFalse("Ошибка записи!");
                        }
                        else
                        {
                            return returnFalse("Страница уже существует!");
                        }
                    }
                    catch (Exception e)
                    {
                        return returnFalse(e.Message);
                    }
                }
                else
                    return returnFalse("Входной параметр имел не верный формат!");
            }
            else
                return returnFalse("Нет доступа!");
            return null;
        }

        [WebMethod(EnableSession = true)]
        public XmlDocument getTemplates()
        {
            bagClass b = new bagClass();
            if (b.get_role() == "admin")
            {
                StringBuilder sb = new StringBuilder();
                try
                {
                    var lis = b.connect("get_templates");
                    sb.Append("<templates>");
                    if (lis.Count > 0)
                    {
                        for (int i = 0; i < lis.Count; i++)
                        {
                            sb.Append("<templatePage>");
                            sb.Append(createNode("idTemplate", lis[i].ElementAt(0).Value));
                            sb.Append(createNode("nameTemplate", lis[i].ElementAt(1).Value));
                            sb.Append("</templatePage>");
                        }
                    }
                    sb.Append("</templates>");
                }
                catch (Exception e)
                {
                    return returnFalse(e.Message);
                }
                XmlDocument xmlDocument = new XmlDocument();
                xmlDocument.LoadXml(sb.ToString());
                return xmlDocument;
            }
            else
                return returnFalse("Нет доступа!");
        }

        [WebMethod(EnableSession = true)]
        public XmlDocument saveChange()
        {
            bagClass b = new bagClass();
            if (b.get_role() == "admin" && b.get_edit_mode)
            {
                StringBuilder sb = new StringBuilder();
                string idProperty = Context.Request.Form["idProperty"] != null ? Context.Request.Form["idProperty"] : "";
                string newHtml = Context.Request.Form["newHtml"] != null ? Context.Request.Form["newHtml"] : "";
                int i = 0;
                int id = Int32.TryParse(idProperty, out i) ? i : 0;
                if (id != 0)
                {
                    try
                    {
                        b.connect("save_changes", new string[] { id.ToString(), newHtml });                        
                    }
                    catch (Exception e)
                    {
                        return returnFalse(e.Message);
                    }
                }
                else
                    return returnFalse("Входной параметр имел не верный формат!");
            }
            else
                return returnFalse("Нет доступа!");
            return null;
        }

        [WebMethod(EnableSession = true)]
        public XmlDocument saveStyle()
        {
            bagClass b = new bagClass();
            if (b.get_role() == "admin" && b.get_edit_mode)
            {
                StringBuilder sb = new StringBuilder();
                string idProperty = Context.Request.Form["idProperty"] != null ? Context.Request.Form["idProperty"] : "";
                string style = Context.Request.Form["style"] != null ? Context.Request.Form["style"] : "";
                string className = Context.Request.Form["className"] != null ? Context.Request.Form["className"].Replace(" ", "") : "";
                int i = 0;
                int id = Int32.TryParse(idProperty, out i) ? i : 0;
                if (id != 0 && className != "" && style != "")
                {
                    try
                    {                        
                        b.connect("update_style_module", new string[] { id.ToString(), className });
                        StreamWriter write = new StreamWriter(Server.MapPath("/App_Themes/theme1/user_theme/" + className+".css"), false, System.Text.Encoding.UTF8);
                        write.Write(style);
                        write.Close();
                    }
                    catch (Exception e)
                    {
                        return returnFalse(e.Message);
                    }
                }
                else
                    return returnFalse("Входной параметр имел не верный формат!");
            }
            else
                return returnFalse("Нет доступа!");
            return null;
        }

        [WebMethod(EnableSession = true)]
        public XmlDocument deleteModule()
        {
            bagClass b = new bagClass();
            if (b.get_role() == "admin" && b.get_edit_mode)
            {
                StringBuilder sb = new StringBuilder();
                string idProperty = Context.Request.Form["idProperty"] != null ? Context.Request.Form["idProperty"] : "";
                int i = 0;
                int id = Int32.TryParse(idProperty, out i) ? i : 0;
                if (id != 0)
                {
                    try
                    {
                        var lis = b.connect("delete_property_module", new string[] { id.ToString() });
                        if (lis.Count > 0)
                        {
                           File.Delete(Server.MapPath("/App_Themes/theme1/user_theme/" + lis[0].ElementAt(0).Value + ".css"));
                        }
                    }
                    catch (Exception e)
                    {
                        return returnFalse(e.Message);
                    }
                }
                else
                    return returnFalse("Входной параметр имел не верный формат!");                
            }
            else
                return returnFalse("Нет доступа!");
            return null;
        }

        [WebMethod(EnableSession = true)]
        public XmlDocument getStyle()
        {
            bagClass b = new bagClass();
            if (b.get_role() == "admin" && b.get_edit_mode)
            {
                StringBuilder sb = new StringBuilder();
                string idProperty = Context.Request.Form["idProperty"] != null ? Context.Request.Form["idProperty"] : "";
                string str_style = "";
                string className = "";
                string marker = "";
                int i = 0;
                int id = Int32.TryParse(idProperty, out i) ? i : 0;
                if (id != 0)
                {
                    try
                    {
                        //получаем имя класса css
                        var lis = b.connect("get_style_module", new string[] { id.ToString() });
                        if (lis.Count > 0)
                        {
                            className = lis[0].ElementAt(0).Value;
                            marker = lis[0].ElementAt(1).Value;                            
                            if (File.Exists(Server.MapPath("/App_Themes/theme1/user_theme/" + className + ".css")))
                            {
                                StreamReader read = new StreamReader(Server.MapPath("/App_Themes/theme1/user_theme/" + className + ".css"));
                                str_style = read.ReadToEnd();
                                read.Close();
                            }
                        }                        
                        if (str_style == "")
                        {
                            str_style = ".container_" + id.ToString() + "{ }";
                            className = "container_" + id.ToString();
                        }
                        if (marker == "" && className != "container_" + id.ToString())
                        {
                            str_style = str_style.Replace(className, "container_" + id.ToString());
                            className = "container_" + id.ToString();
                            StreamWriter write = new StreamWriter(Server.MapPath("/App_Themes/theme1/user_theme/" + className + ".css"), false, System.Text.Encoding.UTF8);
                            write.Write(str_style);
                            write.Close();
                        }
                        sb.Append("<css>");
                        sb.Append(createNode("valueStyle", str_style));
                        sb.Append(createNode("className", className));
                        sb.Append("</css>");
                    }
                    catch (Exception e)
                    {
                        return returnFalse(e.Message);
                    }
                }
                else
                    return returnFalse("Входной параметр имел не верный формат!");
                XmlDocument xmlDocument = new XmlDocument();
                xmlDocument.LoadXml(sb.ToString());
                return xmlDocument;
            }
            else
                return returnFalse("Нет доступа!");
        }

        [WebMethod(EnableSession = true)]
        public XmlDocument saveOptionsBlock()
        {
            bagClass b = new bagClass();
            if (b.get_role() == "admin")
            {
                StringBuilder sb = new StringBuilder();
                string idProperty = Context.Request.Form["idProperty"] != null ? Context.Request.Form["idProperty"] : "";
                string property = Context.Request.Form["property"] != null ? Context.Request.Form["property"] : "";                
                JavaScriptSerializer ser = new JavaScriptSerializer();
                List<Dictionary<string, string>> json = ser.Deserialize<List<Dictionary<string, string>>>(property);                
                int i = 0;
                int id = Int32.TryParse(idProperty, out i) ? i : 0;
                if (id != 0 && json.Count > 0)
                {
                    try
                    {
                        string name = "";
                        string value = "";
                        string dop = "";
                        for (i = 0; i < json.Count; i++)
                        {
                            name = json[i].ContainsKey("name") ? json[i]["name"] : "";
                            value = json[i].ContainsKey("value") ? json[i]["value"] : "";
                            dop = json[i].ContainsKey("dop") ? json[i]["dop"] : "";
                            b.connect("insertOptionsBlock", new string[] { id.ToString(), name, value, dop });
                        }
                    }
                    catch (Exception e)
                    {
                        return returnFalse(e.Message);
                    }
                }
                else
                    return returnFalse("Входной параметр имел не верный формат!");
            }
            else
                return returnFalse("Нет доступа!");
            return null;
        }

        [WebMethod]
        public XmlDocument optionsBlock()
        {
            bagClass b = new bagClass();
            StringBuilder sb = new StringBuilder();
            string optionsBlock = Context.Request.Form["optionsBlock"] != null ? Context.Request.Form["optionsBlock"] : "";
            int i = 0;
            int id = Int32.TryParse(optionsBlock, out i) ? i : 0;
            if (id != 0)
            {
                try
                {
                    var lis = b.connect("selectOptionsBlock", new string[] { id.ToString() });
                    sb.Append("<options>");
                    if (lis.Count > 0)
                    {
                        
                        for (i = 0; i < lis.Count; i++)
                        {
                            sb.Append(createNode("idOptions", lis[i].ElementAt(0).Value));
                            sb.Append(createNode(lis[i].ElementAt(2).Value, lis[i].ElementAt(3).Value));
                        }
                    } 
                    sb.Append("</options>");

                }
                catch (Exception e)
                {
                    return returnFalse(e.Message);
                }
            }
            else
                return returnFalse("Нет доступа!");
            XmlDocument xmlDocument = new XmlDocument();
            xmlDocument.LoadXml(sb.ToString());
            return xmlDocument;
        }

        [WebMethod]
        public XmlDocument getUserMenu()
        {
            bagClass b = new bagClass();
            StringBuilder sb = new StringBuilder();
            try
            {
                if (b.get_role() != "")
                {
                    var lis = b.connect("select_user_menu");
                    if (lis.Count > 0)
                    {
                        sb.Append("<userMenu>");
                        for (int i = 0; i < lis.Count; i++)
                        {
                            sb.Append("<levelMenu>");
                            sb.Append(createNode("nameMenu", lis[i].ElementAt(0).Value));
                            sb.Append(createNode("urlMenu", lis[i].ElementAt(1).Value));
                            sb.Append("</levelMenu>");
                        }
                        sb.Append("<userMenu>");
                    }
                }
                else
                    return null;
            }
            catch (Exception e)
            {
                return returnFalse(e.Message);
            }
            XmlDocument xmlDocument = new XmlDocument();
            xmlDocument.LoadXml(sb.ToString());
            return xmlDocument;
        }

        [WebMethod(EnableSession = true)]
        public void exitUser()
        {
            bagClass b = new bagClass();
            if (b.login_user())
            {
                FormsAuthentication.SignOut();
                Session.Remove("bagUsersPassword");
            }
        }

        [WebMethod(EnableSession = true)]
        public XmlDocument loginUser()
        {
            bagClass b = new bagClass();
            StringBuilder sb = new StringBuilder();
            try
            {
                string userName = Context.Request.Form["userName"] != null ? Context.Request.Form["userName"] : "";
                string userPassword = Context.Request.Form["userPassword"] != null ? Context.Request.Form["userPassword"] : "";
                if (userName != "" && userPassword != "")
                {
                    bool log = b.enter_user(userName, userPassword);
                    if (!log)
                    {
                        sb.Append(createNode("message", "Неверное имя пользователя или пароль!!!"));
                    }
                    else
                        return null;
                }
            }
            catch (Exception ex)
            {
                sb.Append(createNode("message", ex.Message));
            }
            XmlDocument xmlDocument = new XmlDocument();
            xmlDocument.LoadXml(sb.ToString());
            return xmlDocument;
        }

        [WebMethod(EnableSession = true)]
        public XmlDocument boolLogin()
        {
            bagClass b = new bagClass();
            StringBuilder sb = new StringBuilder();
            try
            {
                sb.Append(createNode("boolLogin", b.login_user().ToString()));
            }
            catch (Exception ex)
            {
                return returnFalse(ex.Message);
            }
            XmlDocument xmlDocument = new XmlDocument();
            xmlDocument.LoadXml(sb.ToString());
            return xmlDocument;
        }

        [WebMethod]
        public XmlDocument sendEmail()
        {
            bagClass b = new bagClass();
            StringBuilder sb = new StringBuilder();
            try
            {
                string sendEmail = Context.Request.Form["sendEmail"] != null ? Context.Request.Form["sendEmail"] : "";
                string emailUser = b.str_encrypt(sendEmail);
                var lis = b.connect("getuserpassword", new string[] { emailUser });
                if (lis.Count > 0)
                {
                    var infoCompany = b.connect("get_options_site");
                    string nameCompany = "";
                    string contactPersone = "";
                    if (infoCompany.Count > 0)
                    {
                        nameCompany = infoCompany[0].ElementAt(1).Value == "" ? infoCompany[0].ElementAt(5).Value : infoCompany[0].ElementAt(1).Value;
                        contactPersone = infoCompany[0].ElementAt(2).Value == "" ? "Администрация" : infoCompany[0].ElementAt(2).Value;
                    }

                    string strName = b.str_decrypt(lis[0].ElementAt(0).Value);
                    string strPassword = b.str_decrypt(lis[0].ElementAt(1).Value);
                    string str_theme = "Напоминание регистрационных данных";
                    string str_text = "<p>Ниже указан Ваш пароль для входа в " + nameCompany + ". Если Вы не запрашивали пароль, пожалуйста, проигнорируйте это сообщение.</p>";
                    str_text += "<p>Ваши регистрационные данные:<br/>Ваше имя в системе: <b>" + strName + "</b><br/>Ваш пароль: <b>" + strPassword + "</b></p>";
                    str_text += "<p>Если у Вас появятся вопросы, пожалуйста, свяжитесь с нами.<br/>С Уважением " + contactPersone + "</p>";

                    bool send = b.send_email(str_text, sendEmail, str_theme);
                    if (send)
                        sb.Append(createNode("message", "На указанный Вами почтовый адресс, отправлено письмо с Вашими регистрационными данными!"));
                    else
                        sb.Append(createNode("message", "Отправка Ваших регистрационных данных не возможна!!! Свяжитесь с Администрацией сайта!!!"));

                }
                else
                    sb.Append(createNode("message", "Пользователь с email: " + sendEmail + " не найден!!!"));

            }
            catch (Exception e)
            {
                return returnFalse(e.Message);
            }
            XmlDocument xmlDocument = new XmlDocument();
            xmlDocument.LoadXml(sb.ToString());
            return xmlDocument;
        }

        public XmlDocument returnFalse(string mes)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append(createNode("error", mes));
            XmlDocument xmlDocument = new XmlDocument();
            xmlDocument.LoadXml(sb.ToString());
            return xmlDocument;
        }

        public string createNode(string name, string value)
        {
            string str = "";
            str = "<" + name + ">" + HttpUtility.HtmlEncode(value) + "</" + name + ">";
            return str;
        }
                
        void deleteTempImg()
        {
            FileInfo[] fil = new DirectoryInfo(Server.MapPath("/temp_file/")).GetFiles();
            for (int i = 0; i < fil.Length; i++)
            {
                if ((DateTime.Now - fil[i].CreationTime).Hours > 2)
                {
                    File.Delete(fil[i].FullName);
                }
            }
        }

        void replaceNewImg(FileInfo fil, int NewWidth, int MaxHeight, string new_name)
        {
            System.Drawing.Image img = System.Drawing.Image.FromFile(Server.MapPath("/temp_file/" + fil.Name));
            int oldw = img.Width, oldh = img.Height;
            if (oldw <= NewWidth)
            {
                NewWidth = oldw;
            }

            int NewHeight = oldh * NewWidth / oldw;
            if (NewHeight > MaxHeight)
            {
                NewWidth = oldw * MaxHeight / oldh;
                NewHeight = MaxHeight;
            }
            System.Drawing.Image dest = new System.Drawing.Bitmap(NewWidth, NewHeight, img.PixelFormat);
            System.Drawing.Graphics g = System.Drawing.Graphics.FromImage(dest);
            g.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighQuality;
            g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
            g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
            g.DrawImage(img, 0, 0, NewWidth, NewHeight);
            dest.Save(Server.MapPath("/temp_file/" + new_name), img.RawFormat);
            dest.Dispose();
            img.Dispose();
            g.Dispose();
        }
    }
}

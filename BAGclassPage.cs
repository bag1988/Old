using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI.WebControls;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.IO;
using System.Text.RegularExpressions;
namespace BAG
{

    public partial class BAGPage : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {            
            load_page_style();
            load_control();
            if (Request.Params["userPassword"] != null && Request.Params["userName"] != null)
            {
                bagClass b = new bagClass();
                bool log = b.enter_user(Request.Params["userName"], Request.Params["userPassword"]);
                if (log)
                {
                    Response.Redirect(Request.RawUrl);
                }
            }
        }        

        void load_page_style()
        {            
            string error_message = "";
            try
            {
                
                bagClass b = new bagClass();
                int id_page = 0;
                if (Int32.TryParse(this.Page.Form.ID.Split('_')[1], out id_page)) //получаем индификитор страницы
                {
                    var lis = b.connect("load_page_info", new string[] { id_page.ToString() }); //загружаем информацию о странице
                    if (lis.Count > 0)
                    {   //проверяем на доступность
                        if ((lis[0]["roles"] == "register" && b.get_role() == "") || (lis[0]["roles"] == "admin" && b.get_role() != "admin"))
                        {
                            error_message = "Для просмотра данной страницы Вам необходимо выполнить вход на сайт!";
                        }
                        else
                        {   //отображаем информацию о странице
                            this.Title = lis[0]["title"];
                            HtmlMeta meta = new HtmlMeta();
                            meta.Name = "keywords";
                            meta.Content = lis[0]["keyword"];
                            this.Header.Controls.Add(meta);

                            meta = new HtmlMeta();
                            meta.Name = "description";
                            meta.Content = lis[0]["meta"];
                            this.Header.Controls.Add(meta);

                            HtmlGenericControl link = new HtmlGenericControl("link");
                            link.Attributes.Add("href", "/images/favicon.png");
                            link.Attributes.Add("type", "image/png");
                            link.Attributes.Add("rel", "shortcut icon");
                            this.Header.Controls.Add(link);

                            HtmlGenericControl body = (this.Page.FindControl("body") as HtmlGenericControl);
                            body.Attributes.Add("onload", "loadDocument()");
                            link = new HtmlGenericControl("script");                            
                            link.Attributes.Add("type", "text/javascript");
                            link.InnerHtml = "function loadDocument(){}";
                            this.Page.Header.Controls.Add(link);
                            if (new DirectoryInfo(Server.MapPath("/App_Themes/theme1/BAGTheme")).Exists)
                            {
                                FileInfo[] f = new DirectoryInfo(Server.MapPath("/App_Themes/theme1/BAGTheme")).GetFiles("*.css", SearchOption.AllDirectories);
                                DateTime d = DateTime.Now;
                                string v = d.Day.ToString() + d.Hour.ToString() + d.Minute.ToString() + d.Millisecond.ToString();
                                for (int i = 0; i < f.Length; i++)
                                {
                                    link = new HtmlGenericControl("link");
                                    link.Attributes.Add("href", "/App_Themes/theme1/" + f[i].Directory.Name + "/" + f[i].Name + "?v=" + v);
                                    link.Attributes.Add("type", "text/css");
                                    link.Attributes.Add("rel", "stylesheet");
                                    this.Header.Controls.Add(link);
                                }
                            }
                            FileInfo[] script = new DirectoryInfo(Server.MapPath("/script/")).GetFiles("*.js");
                            if (script.Length > 0)
                            {
                                for (int i = 0; i < script.Length; i++)
                                {
                                    link = new HtmlGenericControl("script");
                                    link.Attributes.Add("src", "/script/" + script[i].Name);
                                    link.Attributes.Add("type", "text/javascript");
                                    this.Page.Header.Controls.Add(link);
                                }
                            }
                        }
                    }
                }
                else
                {
                    error_message = "Ошибка выполнения данных!";
                }
            }
            catch (Exception er)
            {
                Response.Redirect("~/error_page.aspx?error_message=" + HttpUtility.UrlEncode(er.Message), true);
            }
            if (error_message != "")
            {
                Response.Redirect("~/error_page.aspx?error_message=" + HttpUtility.UrlEncode(error_message), true);
            }
        }
        //добавляем javascript функции при загрузке страницы
        public void addLoadDocument(string nameFunc)
        {
            foreach (Control c in this.Page.Header.Controls)
            {
                if (c.GetType() == typeof(HtmlGenericControl))
                {
                    string pattern = @"(loadDocument\(\){.*)(?=})";
                    string rstr = "$1" + nameFunc;
                    HtmlGenericControl script = (HtmlGenericControl)c;
                    Regex regex = new Regex(@"loadDocument\(\){.*");
                    if (regex.IsMatch(script.InnerHtml))
                    {
                        script.InnerHtml = Regex.Replace(script.InnerHtml, pattern, rstr);
                    }
                }
            }
        }
        //загружаем расширения для текущей страницы
        void load_control()
        {
            bagClass b = new bagClass();
            Control c;
            HtmlGenericControl container;
            HtmlGenericControl viewcontent;
            try
            {
                if (b.get_role() == "admin")
                {
                    c = LoadControl("admin/module/admin_controls.ascx");
                    c.ID = "admin_controls1";
                    this.Form.Controls.Add(c);
                    addLoadDocument("baggeneral.loadAdminPanel();");
                }
                int id_page = 0;
                if (Int32.TryParse(this.Page.Form.ID.Split('_')[1], out id_page))
                {
                    var lis = b.connect("select_module", new string[] { id_page.ToString()});
                    if (lis.Count > 0)
                    {                        
                        for (int i = 0; i < lis.Count; i++)
                        {
                            container = new HtmlGenericControl("div");
                            container.Attributes.Add("id", lis[i].ElementAt(1).Value + "_container");
                            container.Attributes.Add("class", lis[i].ElementAt(2).Value);                            
                            viewcontent = new HtmlGenericControl("div");
                            viewcontent.Attributes.Add("id", lis[i].ElementAt(1).Value + "_viewContent");
                            container.Controls.Add(viewcontent);

                            if (lis[i].ElementAt(3).Value != "")
                                addLoadDocument(lis[i].ElementAt(3).Value + "('" + lis[i].ElementAt(1).Value + "');");
                            this.Form.Controls.Add(container);
                        }
                    }

                    lis = b.connect("selectAllCssPage", new string[] { id_page.ToString() });
                    DateTime d = DateTime.Now;
                    string v = d.Day.ToString() + d.Hour.ToString() + d.Minute.ToString() + d.Millisecond.ToString();
                    HtmlGenericControl link;
                    for (int i = 0; i < lis.Count; i++)
                    {
                        link = new HtmlGenericControl("link");
                        link.Attributes.Add("href", "/App_Themes/theme1/user_theme/" + lis[i].ElementAt(0).Value + ".css?v=" + v);
                        link.Attributes.Add("type", "text/css");
                        link.Attributes.Add("rel", "stylesheet");
                        this.Header.Controls.Add(link);
                    }
                }
            }
            catch (Exception er)
            {
                Response.Redirect("~/error_page.aspx?error_message=" + HttpUtility.UrlEncode(er.Message), true);
            }
        }
    }

}
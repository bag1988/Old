using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace BAG.admin.module
{
    public partial class top : System.Web.UI.UserControl
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            bagClass b = new bagClass();
            if (b.get_role() == "admin")
            {                
                FileInfo[] script = new DirectoryInfo(Server.MapPath("/admin/script/")).GetFiles("bag*.js");
                if (script.Length > 0)
                {
                    for (int i = 0; i < script.Length; i++)
                    {
                        HtmlGenericControl link = new HtmlGenericControl("script");
                        link.Attributes.Add("src", "/admin/script/" + script[i].Name);
                        link.Attributes.Add("type", "text/javascript");
                        this.Page.Header.Controls.Add(link);
                    }
                }                

            }
            try
            {
                var lis = b.connect("get_options_site");
                if (lis.Count > 0)
                {
                    nameSite.InnerHtml = lis[0]["name_site"] != "" ? lis[0]["name_site"] : "BAG platform";                    
                }
                FileInfo[] script = new DirectoryInfo(Server.MapPath("/script/")).GetFiles("bag*.js");
                if (script.Length > 0)
                {
                    for (int i = 0; i < script.Length; i++)
                    {
                        HtmlGenericControl link = new HtmlGenericControl("script");
                        link.Attributes.Add("src", "/script/" + script[i].Name);
                        link.Attributes.Add("type", "text/javascript");
                        this.Page.Header.Controls.Add(link);
                    }
                }
                if (new DirectoryInfo(Server.MapPath("/App_Themes/theme1/BAGTheme")).Exists)
                {
                    FileInfo[] f = new DirectoryInfo(Server.MapPath("/App_Themes/theme1/BAGTheme")).GetFiles("*.css", SearchOption.AllDirectories);
                    DateTime d = DateTime.Now;
                    string v = d.Day.ToString() + d.Hour.ToString() + d.Minute.ToString() + d.Millisecond.ToString();
                    for (int i = 0; i < f.Length; i++)
                    {
                        HtmlGenericControl link = new HtmlGenericControl("link");
                        link.Attributes.Add("href", "/App_Themes/theme1/" + f[i].Directory.Name + "/" + f[i].Name + "?v=" + v);
                        link.Attributes.Add("type", "text/css");
                        link.Attributes.Add("rel", "stylesheet");
                        this.Page.Header.Controls.Add(link);
                    }
                }

            }
            catch (Exception er)
            {
                //Response.Redirect(Server.MapPath("/error_page.aspx?error_message=" + HttpUtility.UrlEncode(er.Message)), true);
            }
        }
    }
}
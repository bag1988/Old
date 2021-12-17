using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using System.IO;

namespace BAG.admin
{
    public partial class editNews : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            bagClass b = new bagClass();
            if (b.get_role() != "admin")
            {
                Response.Redirect("default.aspx");
            }
            if (Request.QueryString["news"] != null && !IsPostBack)
            {
                saveButton.Attributes.Add("onclick", "bagnews.saveNewNews('" + Request.QueryString["news"] + "')");
                viewBase();
            }
            if (Request.Params["nameNews"] != null && Request.Params["shortNews"] != null && Request.Params["textNews"] != null)
                saveNewNews();
        }

        void viewBase()
        {
            bagClass b = new bagClass();
            try
            {
                int idNews = 0;
                if (Int32.TryParse(Request.QueryString["news"], out idNews))
                {
                    var lis = b.connect("getNews", new string[] { idNews.ToString()});
                    if (lis.Count > 0)
                    {
                        name_txt.Text = lis[0].ElementAt(1).Value;                        
                        short_txt.Text = lis[0].ElementAt(4).Value;                        
                        text_html.InnerHtml = Server.HtmlDecode(lis[0].ElementAt(3).Value);
                        key_txt.Text = lis[0].ElementAt(5).Value;
                    }
                }
                
            }
            catch (Exception er)
            {
                Response.Redirect("../error_page.aspx?error_message=" + HttpUtility.UrlEncode(er.Message), true);
            }
        }

        protected void cancel_button_Click(object sender, EventArgs e)
        {
            Response.Redirect("news.aspx");
        }

        void saveNewNews()
        {
            bagClass b = new bagClass();
            try
            {                
                string name_s = Request.Params["nameNews"];
                string short_s = Request.Params["shortNews"];
                string key_s = Request.Params["keywordNews"];
                string full_s = Request.Params["textNews"];
                int idNews = -1;
                if (Request.Params["News"] != null)
                {
                    idNews = Int32.TryParse(Request.Params["News"], out idNews) ? idNews : -1;
                }
                if (name_s != "" && short_s != "" && full_s != "")
                {
                    b.connect("saveNews", new string[] { idNews.ToString(), name_s, short_s, full_s, DateTime.Now.ToString(), key_s });
                }
            }
            catch (Exception er)
            {
                Response.Redirect("../error_page.aspx?error_message=" + HttpUtility.UrlEncode(er.Message), true);
            }
            Response.Redirect("news.aspx", true);
        }        
    }
}

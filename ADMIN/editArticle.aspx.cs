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
    public partial class editArticle : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            bagClass b = new bagClass();
            if (b.get_role() != "admin")
            {
                Response.Redirect("default.aspx");
            }
            if (Request.QueryString["Article"] != null && !IsPostBack)
            {
                saveButton.Attributes.Add("onclick", "bagarticle.saveNewArticle('" + Request.QueryString["Article"] + "')");
                viewBase();
            }
            if (Request.Params["nameArticle"] != null && Request.Params["shortArticle"] != null && Request.Params["textArticle"] != null)
                saveNewArticle();
        }

        void viewBase()
        {
            bagClass b = new bagClass();
            try
            {
                int idArticle = 0;
                if (Int32.TryParse(Request.QueryString["Article"], out idArticle))
                {
                    var lis = b.connect("getArticle", new string[] { idArticle.ToString()});
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
            Response.Redirect("Article.aspx");
        }

        void saveNewArticle()
        {
            bagClass b = new bagClass();
            try
            {                
                string name_s = Request.Params["nameArticle"];
                string short_s = Request.Params["shortArticle"];
                string key_s = Request.Params["keywordArticle"];
                string full_s = Request.Params["textArticle"];
                int idArticle = -1;
                if (Request.Params["Article"] != null)
                {
                    idArticle = Int32.TryParse(Request.Params["Article"], out idArticle) ? idArticle : -1;
                }
                if (name_s != "" && short_s != "" && full_s != "")
                {
                    b.connect("saveArticle", new string[] { idArticle.ToString(), name_s, short_s, full_s, DateTime.Now.ToString(), key_s });
                }
            }
            catch (Exception er)
            {
                Response.Redirect("../error_page.aspx?error_message=" + HttpUtility.UrlEncode(er.Message), true);
            }
            Response.Redirect("Article.aspx", true);
        }        
    }
}

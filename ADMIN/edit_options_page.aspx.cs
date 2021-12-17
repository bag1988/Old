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
    public partial class edit_options_page : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            bagClass b = new bagClass();
            if (b.get_role() != "admin")
            {
                Response.Redirect("default.aspx");
            }
            if (Request.QueryString["page"] == null)
                Response.Redirect("view_page.aspx");
            if (!IsPostBack)
                viewBase();
        }

        void viewBase()
        {
            bagClass b = new bagClass();
            try
            {
                int id_page = 0;
                if (Int32.TryParse(Request.QueryString["page"], out id_page))
                {
                    var lis = b.connect("load_page_info", new string[] { id_page.ToString() });
                    if (lis.Count > 0)
                    {
                        name_txt.Text = lis[0]["name_page"];
                        page_roles.Value = lis[0]["roles"];
                        title_txt.Text = lis[0]["title"];
                        meta_txt.Text = lis[0]["meta"];
                        key_txt.Text = lis[0]["keyword"];
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
            Response.Redirect("view_page.aspx");
        }

        protected void save_button_Click(object sender, EventArgs e)
        {
            bagClass b = new bagClass();
            try
            {
                string name_s = name_txt.Text;
                string roles_s = page_roles.Value;
                string title_s = title_txt.Text;
                string meta_s = meta_txt.Text;
                string key_s = key_txt.Text;
                int id_page = 0;
                if (Int32.TryParse(Request.QueryString["page"], out id_page) && name_s != "")
                {
                    b.connect("update_options_page", new string[] { id_page.ToString(), name_s, roles_s ,title_s , key_s , meta_s });

                }
            }
            catch (Exception er)
            {
                Response.Redirect("../error_page.aspx?error_message=" + HttpUtility.UrlEncode(er.Message), true);
            }
            Response.Redirect("view_page.aspx", true);
        }        
    }
}

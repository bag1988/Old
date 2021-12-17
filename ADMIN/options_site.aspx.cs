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
    public partial class options_site : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            bagClass b = new bagClass();
            if (b.get_role() != "admin")
            {
                Response.Redirect("default.aspx");
            }
            if (!IsPostBack)
                viewBase();
        }

        void viewBase()
        {
            bagClass b = new bagClass();
            try
            {
                var lis = b.connect("get_options_site");
                if (lis.Count > 0)
                {
                    name_txt.Text = lis[0]["name_site"];
                    contact_txt.Text = lis[0]["contact_persone"];
                    description_txt.Text = lis[0]["description"];
                    adres_txt.Text = lis[0]["adres"];
                    url_txt.Text = lis[0]["url_site"];
                    phone1_txt.Text = lis[0]["phone1"];
                    phone2_txt.Text = lis[0]["phone2"];
                    fax_txt.Text = lis[0]["fax"];
                    email_txt.Text = lis[0]["email"];
                    skype_txt.Text = lis[0]["skype"];
                }
                
            }
            catch (Exception er)
            {
                Response.Redirect("../error_page.aspx?error_message=" + HttpUtility.UrlEncode(er.Message), true);
            }
        }

        protected void save_button_Click(object sender, EventArgs e)
        {
            bagClass b = new bagClass();
            try
            {
                string name_s = name_txt.Text;
                string contact_s = contact_txt.Text;
                string description_s = description_txt.Text;
                string adres_s = adres_txt.Text;
                string url_s = url_txt.Text;
                string phone1_s = phone1_txt.Text;
                string phone2_s = phone2_txt.Text;
                string fax_s = fax_txt.Text;
                string email_s = email_txt.Text;
                string skype_s = skype_txt.Text;

                b.connect("update_options_site", new string[] { name_s, contact_s, description_s, adres_s, url_s, phone1_s, phone2_s, fax_s, email_s, skype_s });
                
            }
            catch (Exception er)
            {
                Response.Redirect("../error_page.aspx?error_message=" + HttpUtility.UrlEncode(er.Message), true);
            }
        } 
    }
}

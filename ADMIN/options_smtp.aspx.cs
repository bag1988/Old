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
    public partial class options_smtp : System.Web.UI.Page
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
            try
            {
                bagClass b = new bagClass();
                var lis = b.connect("get_smtp_options");
                if (lis.Count > 0)
                {
                    server_txt.Text = b.str_decrypt(lis[0]["smtp_server"]);
                    port_txt.Text = b.str_decrypt(lis[0]["smtp_port"]);
                    login_txt.Text = b.str_decrypt(lis[0]["smtp_user"]);
                    password_txt.Text = b.str_decrypt(lis[0]["smtp_password"]);
                    email_txt.Text = b.str_decrypt(lis[0]["smtp_email"]);
                    ssl_text.Checked = b.str_decrypt(lis[0]["smtp_ssl"]) == "true" ? true : false;
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
                string server_s = b.str_encrypt(server_txt.Text);
                string port_s = b.str_encrypt(port_txt.Text);
                string login_s = b.str_encrypt(login_txt.Text);
                string password_s = b.str_encrypt(password_txt.Text);
                string email_s = b.str_encrypt(email_txt.Text);
                string ssl_s = b.str_encrypt(ssl_text.Checked == true ? "true" : "false");
                b.connect("update_options_smtp", new string[] { server_s, port_s, login_s, password_s, email_s, ssl_s });               
            }
            catch (Exception er)
            {
                Response.Redirect("../error_page.aspx?error_message=" + HttpUtility.UrlEncode(er.Message), true);
            }
        }

    }
}

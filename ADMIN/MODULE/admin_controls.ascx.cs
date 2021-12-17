using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using System.Web.UI.HtmlControls;
using System.Net;


namespace BAG.module
{
    public partial class admin_controls : System.Web.UI.UserControl
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            bagClass b = new bagClass();
            if (b.get_role() == "admin")
            {
                admin_div_controls.Visible = true;
                if ( b.get_edit_mode)
                {
                    editMode.Text = "Режим просмотра";
                    editModeBool.Value = "true";
                }
                else
                {
                    editMode.Text = "Режим редактирования";
                    editModeBool.Value = "false";
                }

                FileInfo[] script = new DirectoryInfo(Server.MapPath("/admin/script/")).GetFiles("*.js");
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
            else
                admin_div_controls.Visible = false;
        }

        protected void editMode_Click(object sender, EventArgs e)
        {            
            bagClass b = new bagClass();
            if (b.get_edit_mode)
            {
                b.get_edit_mode = false;                
            }
            else
            {
                b.get_edit_mode = true;
            }
            Response.Redirect(Request.RawUrl);
        }
    }
}
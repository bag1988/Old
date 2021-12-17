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
    public partial class edit_user : System.Web.UI.Page
    {
        int id_user = 0;
        protected void Page_Load(object sender, EventArgs e)
        {
            bagClass b = new bagClass();
            if (b.get_role() != "admin")
            {
                Response.Redirect("default.aspx");
            }
            if (Request.QueryString["user"] == null)
                Response.Redirect("users.aspx");
            viewBase();
        }

        void viewBase()
        {
            bagClass b = new bagClass();
            try
            {
                var lis = b.connect("get_registration_field");
                if (lis.Count > 0)
                {
                   /* for (int i = 0; i < lis.Count; i++)
                    {
                        switch (lis[i]["type_field"])
                        {
                            case "text": view_base.Controls.Add(b.b_textbox(lis[i]["id"] + "_" + lis[i]["name_column"], lis[i]["name_field"], lis[i]["valid_field"], lis[i]["error_message"], lis[i]["delete_field"])); break;
                            case "date": view_base.Controls.Add(b.b_date(lis[i]["id"] + "_" + lis[i]["name_column"], lis[i]["name_field"], lis[i]["delete_field"])); break;
                        }
                    }      */              
                }

                if (Int32.TryParse(Request.QueryString["user"], out id_user))
                {
                    lis = b.connect("getUser", new string[] { id_user.ToString() });
                    if (lis.Count > 0)
                    {
                        (view_base.FindControl("1_name_user") as TextBox).Text = b.str_decrypt(lis[0]["name_user"]);
                        (view_base.FindControl("4_email_user") as TextBox).Text = b.str_decrypt(lis[0]["email_user"]);
                        (view_base.FindControl("2_password_user") as TextBox).Text = b.str_decrypt(lis[0]["password_user"]);
                        (view_base.FindControl("3_re_password") as TextBox).Text = b.str_decrypt(lis[0]["password_user"]);
                        for (int i = 0; i < lis.Count; i++)
                        {
                            switch (lis[i]["type_field"])
                            {
                                case "text":
                                    if (lis[i]["name_column"] != "re_password")
                                    {
                                        if ((view_base.FindControl(lis[i]["id"] + "_" + lis[i]["name_column"]) as TextBox) != null)
                                            (view_base.FindControl(lis[i]["id"] + "_" + lis[i]["name_column"]) as TextBox).Text = lis[i]["value_registration_field"];
                                    } break;
                                case "date":
                                    if ((view_base.FindControl("yeardate") as DropDownList) != null)
                                    {
                                        DateTime dat = Convert.ToDateTime(lis[i]["value_registration_field"]);
                                        (view_base.FindControl("yeardate") as DropDownList).SelectedValue = dat.Year.ToString();
                                        (view_base.FindControl("monthdate") as DropDownList).SelectedValue = dat.Month.ToString();
                                        (view_base.FindControl("daydate") as DropDownList).SelectedValue = dat.Day.ToString();
                                    }
                                    break;
                            }
                        }
                    }
                }
                
            }
            catch (Exception er)
            {
                Response.Redirect("../error_page.aspx?error_message=" + HttpUtility.UrlEncode(er.Message), true);
            }
        }

        protected void registration_button_Click(object sender, EventArgs e)
        {
            if (this.Page.IsValid)
            {
                bagClass b = new bagClass();
                var lis = b.connect("get_registration_field");
                string r_field = "";
                if (lis.Count > 0)
                {
                    for (int i = 0; i < lis.Count; i++)
                    {
                        switch (lis[i]["type_field"])
                        {
                            case "text":
                                if (lis[i]["name_column"] != "re_password")
                                {
                                    TextBox txt = (TextBox)view_base.FindControl(lis[i]["id"] + "_" + lis[i]["name_column"]);
                                    r_field += lis[i]["id"] + "&" + ((lis[i]["name_column"] == "password_user" || lis[i]["name_column"] == "name_user" || lis[i]["name_column"] == "email_user") ? b.str_encrypt(txt.Text) : txt.Text) + ";";
                                } break;
                            case "date":
                                DateTime t = new DateTime(Convert.ToInt32((view_base.FindControl("yeardate") as DropDownList).SelectedValue),
                                    Convert.ToInt32((view_base.FindControl("monthdate") as DropDownList).SelectedValue),
                                    Convert.ToInt32((view_base.FindControl("daydate") as DropDownList).SelectedValue));
                                r_field += lis[i]["id"] + "&" + t.ToString() + ";";
                                break;
                        }
                    }
                    if (r_field != "")
                    {
                        var error_register = b.connect("update_info_user", new string[] { r_field ,id_user.ToString() });
                        if (error_register.Count > 0)
                        {
                            error_lb.Visible = true;
                            error_lb.Text = error_register[0]["error"];
                        }
                        else
                        {
                            Response.Redirect("~/admin/users.aspx");
                        }
                    }
                }
            }
        }

    }
}

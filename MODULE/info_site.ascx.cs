using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;

namespace BAG.module
{
    public partial class info_site : System.Web.UI.UserControl
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            bagClass b = new bagClass();
            var lis = b.connect("select_module_box", new string[] { this.ID});
            if (lis.Count > 0)
            {
                container.Attributes.Add("class", lis[0].ElementAt(1).Value);
            }
            else
            {
                lis = b.connect("get_module_info", new string[] { this.ID });
                if (lis.Count > 0)
                {
                    container.Attributes.Add("class", lis[0].ElementAt(4).Value);
                }
            }           
            viewBase();
        }
        

        void viewBase()
        {
            bagClass b = new bagClass();
            try
            {
                HtmlGenericControl lab = new HtmlGenericControl("label");
                HtmlGenericControl span = new HtmlGenericControl("span");
                HtmlGenericControl div = new HtmlGenericControl("div");
                var lis = b.connect("get_options_site");
                if (lis.Count > 0)
                {
                    if (lis[0]["name_site"] != "")
                    {
                        lab = new HtmlGenericControl("label");
                        span = new HtmlGenericControl("span");
                        div = new HtmlGenericControl("div");
                        lab.InnerText = "Наименование компании";
                        span.InnerText = lis[0]["name_site"];
                        div.Controls.Add(lab);
                        div.Controls.Add(span);
                        view_base.Controls.Add(div);
                    }

                    if (lis[0]["contact_persone"] != "")
                    {
                        lab = new HtmlGenericControl("label");
                        span = new HtmlGenericControl("span");
                        div = new HtmlGenericControl("div");
                        lab.InnerText = "Контактное лицо";
                        span.InnerText = lis[0]["contact_persone"];
                        div.Controls.Add(lab);
                        div.Controls.Add(span);
                        view_base.Controls.Add(div);
                    }

                    if (lis[0]["description"] != "")
                    {
                        lab = new HtmlGenericControl("label");
                        span = new HtmlGenericControl("span");
                        div = new HtmlGenericControl("div");
                        lab.InnerText = "Описание";
                        span.InnerText = lis[0]["description"];
                        div.Controls.Add(lab);
                        div.Controls.Add(span);
                        view_base.Controls.Add(div);
                    }

                    if (lis[0]["adres"] != "")
                    {
                        lab = new HtmlGenericControl("label");
                        span = new HtmlGenericControl("span");
                        div = new HtmlGenericControl("div");
                        lab.InnerText = "Адрес";
                        span.InnerText = lis[0]["adres"];
                        div.Controls.Add(lab);
                        div.Controls.Add(span);
                        view_base.Controls.Add(div);
                    }

                    if (lis[0]["url_site"] != "")
                    {
                        lab = new HtmlGenericControl("label");
                        span = new HtmlGenericControl("span");
                        div = new HtmlGenericControl("div");
                        lab.InnerText = "Сайт";
                        span.InnerText = lis[0]["url_site"];
                        div.Controls.Add(lab);
                        div.Controls.Add(span);
                        view_base.Controls.Add(div);
                    }

                    if (lis[0]["phone1"] != "")
                    {
                        lab = new HtmlGenericControl("label");
                        span = new HtmlGenericControl("span");
                        div = new HtmlGenericControl("div");
                        lab.InnerText = "Телефон";
                        span.InnerText = lis[0]["phone1"];
                        div.Controls.Add(lab);
                        div.Controls.Add(span);
                        view_base.Controls.Add(div);
                    }

                    if (lis[0]["phone2"] != "")
                    {
                        lab = new HtmlGenericControl("label");
                        span = new HtmlGenericControl("span");
                        div = new HtmlGenericControl("div");
                        lab.InnerText = "Телефон";
                        span.InnerText = lis[0]["phone2"];
                        div.Controls.Add(lab);
                        div.Controls.Add(span);
                        view_base.Controls.Add(div);
                    }

                    if (lis[0]["fax"] != "")
                    {
                        lab = new HtmlGenericControl("label");
                        span = new HtmlGenericControl("span");
                        div = new HtmlGenericControl("div");
                        lab.InnerText = "Факс";
                        span.InnerText = lis[0]["fax"];
                        div.Controls.Add(lab);
                        div.Controls.Add(span);
                        view_base.Controls.Add(div);
                    }

                    if (lis[0]["email"] != "")
                    {
                        lab = new HtmlGenericControl("label");
                        span = new HtmlGenericControl("span");
                        div = new HtmlGenericControl("div");
                        lab.InnerText = "Email";
                        span.InnerText = lis[0]["email"];
                        div.Controls.Add(lab);
                        div.Controls.Add(span);
                        view_base.Controls.Add(div);
                    }

                    if (lis[0]["skype"] != "")
                    {
                        lab = new HtmlGenericControl("label");
                        span = new HtmlGenericControl("span");
                        div = new HtmlGenericControl("div");
                        lab.InnerText = "Skype";
                        span.InnerText = lis[0]["skype"];
                        div.Controls.Add(lab);
                        div.Controls.Add(span);
                        view_base.Controls.Add(div);
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
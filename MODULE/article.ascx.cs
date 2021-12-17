using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;

namespace BAG.module
{
    public partial class article : System.Web.UI.UserControl
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Request.QueryString["article"] != null)
                viewBasearticle();
            else
                viewBase();
        }

        void viewBasearticle()
        {
            bagClass b = new bagClass();
            try
            {
                int idarticle = 0;
                if (Int32.TryParse(Request.QueryString["article"], out idarticle))
                {
                    var lis = b.connect("getarticle", new string[] { idarticle.ToString() });
                    if (lis.Count > 0)
                    {
                        HtmlGenericControl div = new HtmlGenericControl("div");
                        HtmlGenericControl strong = new HtmlGenericControl("strong");
                        strong.InnerText = lis[0].ElementAt(1).Value;
                        div.Controls.Add(strong);

                        HtmlGenericControl span = new HtmlGenericControl("span");
                        span.InnerText = lis[0].ElementAt(2).Value;
                        div.Controls.Add(span);

                        HtmlGenericControl p = new HtmlGenericControl("p");
                        p.InnerHtml = Server.HtmlDecode(lis[0].ElementAt(3).Value);
                        div.Controls.Add(p);
                        viewarticle.Controls.Add(div);


                        this.Page.Title = lis[0].ElementAt(1).Value;
                        foreach (Control c in this.Page.Header.Controls)
                            if (c.GetType() == typeof(HtmlMeta))
                            {
                                HtmlMeta meta = (HtmlMeta)c;
                                if (meta.Name == "keywords")
                                    meta.Content = lis[0].ElementAt(5).Value;
                                if (meta.Name == "description")
                                    meta.Content = lis[0].ElementAt(4).Value;
                            }
                    }
                }

            }
            catch (Exception er)
            {
                Response.Redirect("../error_page.aspx?error_message=" + HttpUtility.UrlEncode(er.Message), true);
            }
        }

        void viewBase()
        {
            string idPage = "0";
            string maxView = "20"; //максимальное число отображаемых элементов    
            if (Request.QueryString["page"] != null)
            {
                int id = 0;
                idPage = Int32.TryParse(Request.QueryString["page"], out id) ? id.ToString() : "0";
            }
            bagClass b = new bagClass();
            var lis = b.connect("selectarticle", new string[] { idPage, maxView });
            if (lis.Count > 0)
            {
                for (int i = 0; i < lis.Count; i++)
                {
                    HtmlGenericControl div = new HtmlGenericControl("div");
                    HtmlGenericControl a = new HtmlGenericControl("a");
                    a.Attributes.Add("href", this.Page.Request.FilePath+"?article="+lis[i].ElementAt(0).Value);
                    a.InnerText = lis[i].ElementAt(1).Value;
                    HtmlGenericControl strong = new HtmlGenericControl("strong");
                    strong.Controls.Add(a); 
                    div.Controls.Add(strong);

                    HtmlGenericControl span = new HtmlGenericControl("span");
                    span.InnerText = lis[i].ElementAt(2).Value;
                    div.Controls.Add(span);

                    HtmlGenericControl p = new HtmlGenericControl("p");                    
                    p.InnerHtml = Server.HtmlDecode(lis[i].ElementAt(4).Value);
                    div.Controls.Add(p);

                    viewarticle.Controls.Add(div);
                }
            }

            //страничная навигация
            lis = b.connect("selectarticleCount", new string[] { });
            if (lis.Count > 0)
            {
                viewarticle.Controls.Add(b.getNavigationView(lis[0].ElementAt(0).Value, idPage, Convert.ToInt32(maxView), this.Page.Request.FilePath));
            }

        }

    }
}
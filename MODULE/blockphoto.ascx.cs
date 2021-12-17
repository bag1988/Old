using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;

namespace BAG.module
{
    public partial class blockphoto : System.Web.UI.UserControl
    {
        protected void Page_Load(object sender, EventArgs e)
        {            
             viewBase();
        }

        void viewBase()
        {
            try
            {
                string idPage = "0";
                string maxView = ""; //максимальное число отображаемых элементов
                string pageView = "";
                string nameBlock = "";
                bagClass b = new bagClass();
                var lis = b.connect("selectOptionsBlock", new string[] { this.ID });
                if (lis.Count > 0)
                {
                    for (int i = 0; i < lis.Count; i++)
                    {
                        switch (lis[i].ElementAt(2).Value)
                        {
                            case "pageView": pageView = lis[i].ElementAt(3).Value; break;
                            case "nameBlock": nameBlock = lis[i].ElementAt(3).Value; break;
                            case "maxView": maxView = lis[i].ElementAt(3).Value; break;
                        }
                    }
                }
                if (maxView == "")
                    maxView = "3";
                lis = b.connect("selectLastImg", new string[] { idPage, maxView });
                HtmlGenericControl parentDiv = new HtmlGenericControl("div");
                if (lis.Count > 0)
                {
                    HtmlGenericControl a = new HtmlGenericControl("a");
                    if (nameBlock != "")
                    {
                        a = new HtmlGenericControl("a");
                        a.Attributes.Add("href", pageView);
                        a.InnerText = nameBlock;
                        viewContent.Controls.Add(a);
                    }
                    HtmlGenericControl div = new HtmlGenericControl("div");
                    HtmlGenericControl img = new HtmlGenericControl("img");

                    for (int i = 0; i < lis.Count; i++)
                    {
                        div = new HtmlGenericControl("div");

                        img = new HtmlGenericControl("img");
                        img.Attributes.Add("src", lis[i].ElementAt(3).Value);
                        img.Attributes.Add("alt", lis[i].ElementAt(4).Value);
                        img.Attributes.Add("onclick", "baggeneral.viewBigImg(this)");
                        div.Controls.Add(img);

                        parentDiv.Controls.Add(div);
                    }
                    viewContent.Controls.Add(parentDiv);
                }
            }
            catch (Exception er)
            {
                Response.Redirect("../error_page.aspx?error_message=" + HttpUtility.UrlEncode(er.Message), true);
            }
        }
    }
}
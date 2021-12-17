using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;

namespace BAG.module
{
    public partial class blockarticle : System.Web.UI.UserControl
    {
        protected void Page_Load(object sender, EventArgs e)
        {            
                viewBase();
        }

        void viewBase()
        {
            string idPage = "0";
            string maxView = ""; //максимальное число отображаемых элементов
            string pageView = "";
            string nameBlock = "";
            bagClass b = new bagClass();
            var lis = b.connect("selectOptionsBlock", new string[] {this.ID});
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

            lis = b.connect("selectarticle", new string[] { idPage, maxView });
            if (lis.Count > 0)
            {
                HtmlGenericControl a = new HtmlGenericControl("a");
                if (nameBlock != "")
                {
                    a = new HtmlGenericControl("a");
                    a.Attributes.Add("href", pageView);
                    a.InnerText = nameBlock;
                    viewarticle.Controls.Add(a);
                }
                for (int i = 0; i < lis.Count; i++)
                {
                    HtmlGenericControl div = new HtmlGenericControl("div");
                    a = new HtmlGenericControl("a");
                    a.Attributes.Add("href", pageView + "?article=" + lis[i].ElementAt(0).Value);
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

        }

    }
}
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
    public partial class templates : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            bagClass b = new bagClass();
            if (b.get_role() != "admin")
            {
                Response.Redirect("default.aspx");
            }
            else
            {                
                viewBase();
            }
        }

        void viewBase()
        {
            bagClass b = new bagClass();
            try
            {
                var lis = b.connect("get_templates");
                if (lis.Count > 0)
                {
                    Table tab = new Table();
                    tab.CssClass = "admin_table";
                    TableCell cel = new TableCell();
                    TableRow row = new TableRow();
                    TableHeaderCell hcel = new TableHeaderCell();
                    LinkButton link = new LinkButton();
                    //строка заголовков
                    hcel = new TableHeaderCell();
                    hcel.Text = "Наименование";
                    row.Cells.Add(hcel);

                    hcel = new TableHeaderCell();
                    hcel.Text = "Действие";
                    row.Cells.Add(hcel);

                    tab.Rows.Add(row);
                    for (int i = 0; i < lis.Count; i++)
                    {
                        row = new TableRow();

                        cel = new TableCell();
                                                
                        cel.Text = lis[i].ElementAt(1).Value;

                        row.Cells.Add(cel);

                        cel = new TableCell();
                        link = new LinkButton();
                        link.Text = "Удалить";
                        link.ID = "deleteTemplates_" + lis[i].ElementAt(0).Value;
                        link.Click += new EventHandler(link_Click);
                        cel.Controls.Add(link);
                        row.Cells.Add(cel);

                        tab.Rows.Add(row);
                        
                    }
                    view_base.Controls.Add(tab);
                }
                else
                {
                    HtmlGenericControl mes = new HtmlGenericControl("span");
                    mes.InnerHtml = "Нет сохраненных шаблонов!";
                    view_base.Controls.Add(mes);
                }
            }
            catch (Exception er)
            {
                Response.Redirect("../error_page.aspx?error_message=" + HttpUtility.UrlEncode(er.Message), true);
            }
        }

        void link_Click(object sender, EventArgs e)
        {
            bagClass b = new bagClass();
            int id = 0;
            int str_id = Int32.TryParse((sender as LinkButton).ID.Split('_')[1], out id) ? id : 0;
            if (str_id != 0)
            {
               b.connect("deleteTemplates", new string[] { str_id.ToString() });                
            }
            Response.Redirect(Request.RawUrl);
        }
    }
}

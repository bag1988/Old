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
    public partial class users : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            bagClass b = new bagClass();
            if (b.get_role() != "admin")
            {
                Response.Redirect("default.aspx");
            }
            viewBase();
        }

        void viewBase()
        {
            bagClass b = new bagClass();
            try
            {
                var lis = b.connect("get_users");
                if (lis.Count > 0)
                {
                    Table tab = new Table();
                    tab.CssClass = "admin_table";
                    TableCell cel = new TableCell();
                    TableRow row = new TableRow();                    
                    LinkButton link = new LinkButton();
                    //строка заголовков
                    admin ad = new admin();
                    Dictionary<string, int> dHeader = new Dictionary<string, int>();
                    dHeader.Add("Логин", 20);
                    dHeader.Add("Email", 25);
                    dHeader.Add("Роль", 25);
                    dHeader.Add("Действие", 30);
                    tab.Rows.Add(ad.createHeaderRow(dHeader));

                    tab.Rows.Add(row);
                    for (int i = 0; i < lis.Count; i++)
                    {
                        row = new TableRow();

                        cel = new TableCell();
                        cel.Text = b.str_decrypt(lis[i].ElementAt(1).Value);
                        row.Cells.Add(cel);

                        cel = new TableCell();
                        cel.Text = b.str_decrypt(lis[i].ElementAt(3).Value);
                        row.Cells.Add(cel);

                        cel = new TableCell();
                        cel.Text= b.str_decrypt(lis[i].ElementAt(4).Value)=="admin"?"Администратор":"Пользователь";
                        row.Cells.Add(cel);

                        cel = new TableCell();
                        if (b.str_decrypt(lis[i].ElementAt(4).Value) != "admin")
                        {                            
                            link = new LinkButton();
                            link.Text = "Удалить";
                            link.ID = lis[i].ElementAt(0).Value + "_del";
                            link.Click += new EventHandler(del_l_Click);
                            cel.Controls.Add(link);
                            row.Cells.Add(cel);
                        }

                        link = new LinkButton();
                        link.Text = "Редактировать";
                        link.PostBackUrl = "edit_user.aspx?user=" + lis[i].ElementAt(0).Value;
                        cel.Controls.Add(link);
                        row.Cells.Add(cel);

                        tab.Rows.Add(row);
                        view_base.Controls.Add(tab);
                    }
                }
            }
            catch (Exception er)
            {
                Response.Redirect("../error_page.aspx?error_message=" + HttpUtility.UrlEncode(er.Message), true);
            }
        }

        void del_l_Click(object sender, EventArgs e)
        {
            string id = (sender as LinkButton).ID.Split('_')[0];
            bagClass b = new bagClass();
            b.connect("delete_user", new string[] { id });            
            Response.Redirect(Request.RawUrl);
           
        }
    }
}

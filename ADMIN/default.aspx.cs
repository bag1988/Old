using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace BAG.admin
{
    public partial class _default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            bagClass b = new bagClass();
            if (b.get_role() == "admin")
            {
                Response.Redirect("view_page.aspx");
            }
            if (b.get_role() == "registr")
            {
                Response.Redirect("../default.aspx");
            }
            if (Request.Params["userPassword"] != null && Request.Params["userName"] != null)
            {                
                bool log = b.enter_user(Request.Params["userName"], Request.Params["userPassword"]);
                if (log)
                {
                    Response.Redirect(Request.RawUrl);
                }
            }
        }        
    }
}

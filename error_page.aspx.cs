using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace BAG
{
    public partial class error_page : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Request.QueryString["error_message"] != null)
            {
                error_div.InnerText = Request.QueryString["error_message"];
            }
        }
    }
}

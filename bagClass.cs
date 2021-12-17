using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI.HtmlControls;
using System.IO;
using System.Web.UI;
using System.Security.Cryptography;
using System.Text;
using System.Net.Mail;
using System.Net;
using System.Web.UI.WebControls;
using System.Web.Security;
using System.Text.RegularExpressions;

namespace BAG
{
    public class bagClass
    {
        //загрузка данных из базы
        public List<Dictionary<string, string>> connect(string nameFunc, string[] args=null)
        {
            List<Dictionary<string, string>> lis = new List<Dictionary<string, string>>();
            Dictionary<string, string> dic = new Dictionary<string, string>();
            
            System.Data.SqlClient.SqlConnection connection = new System.Data.SqlClient.SqlConnection();
            connection.ConnectionString = @"Data Source=(LocalDB)\MSSQLLocalDB;AttachDbFilename=D:\сайт\BAGold\bag\bag\App_Data\BAGBase.mdf;Integrated Security=True";
            try
            {
                string str_connect = "";
                
                if (new Regex(@"[\s\']").IsMatch(nameFunc))
                {
                    return null;
                }
                str_connect = "exec " + nameFunc + " ";
                if (args != null)
                {
                    for (var i = 0; i < args.Length; i++)
                    {
                        str_connect += "'" + args[i].Replace("'", "%quotes") + "'";
                        if (i + 1 != args.Length)
                            str_connect += ",";
                    }
                }
                connection.Open();
                System.Data.SqlClient.SqlCommand command = new System.Data.SqlClient.SqlCommand(str_connect, connection);
                System.Data.SqlClient.SqlDataReader read = command.ExecuteReader();

                while (read.Read())
                {
                    dic = new Dictionary<string, string>();
                    for (int i = 0; i < read.FieldCount; i++)
                    {
                        dic.Add(read.GetName(i), read[i].ToString().Replace("%quotes", "'"));
                    }
                    lis.Add(dic);
                }
                read.Close();
                command.Dispose();
                connection.Close();
            }
            catch
            {
                connection.Close();
            }
            return lis;
        }
        //авторизация пользователя
        public bool enter_user(string user_name, string user_password)
        {            
            Page pag = new Page();
            List<Dictionary<string, string>> lis;
            if (user_name != "" && user_password != "")
            {              
                lis = connect("login_user", new string[] { str_encrypt(user_name), str_encrypt(user_password) });
                if (lis.Count > 0)
                {
                    FormsAuthenticationTicket t = new FormsAuthenticationTicket(str_encrypt(user_name), true, 60);
                    FormsAuthentication.SetAuthCookie(t.Name, true);
                    pag.Session["bagUsersPassword"] = str_encrypt(user_password);
                    pag.Session["bagUsersName"] = str_encrypt(user_name);
                    return true;
                }
            }
            return false;
        }

        public bool login_user()
        {
            bool ok = false;
            List<Dictionary<string, string>> lis;
            try
            {
                Page pag = new Page();
                if (pag.Session["bagUsersName"]!=null && pag.Session["bagUsersPassword"] != null)
                {
                    lis = connect("login_user", new string[] { pag.Session["bagUsersName"].ToString(), pag.Session["bagUsersPassword"].ToString() });
                    if (lis.Count > 0)
                        ok = true;
                }
            }
            catch { ok = false; }
            return ok;
        }

        public string get_role()
        {
            string role = "";
            List<Dictionary<string, string>> lis;
            try
            {
                Page pag = new Page();
                if (pag.Session["bagUsersName"]!=null && pag.Session["bagUsersPassword"] != null)
                {
                    lis = connect("login_user", new string[] { pag.Session["bagUsersName"].ToString(), pag.Session["bagUsersPassword"].ToString() });
                    if (lis.Count > 0)
                        role = str_decrypt(lis[0]["role_user"]);
                }
            }
            catch { role = ""; }
            return role;
        }

        public string str_encrypt(string password)
        {
            return Encrypt(password);
        }

        public string str_decrypt(string password)
        {
            return Decrypt(password);
        }

        static string Encrypt(string plainText)
        {
            string password = "x$s*76@#0gslw%$ssa999$#5qqw.)";
            string salt = "B!@#$a23021988G";
            string hashAlgorithm = "SHA1";
            int passwordIterations = 2;
            string initialVector = "16CHARSLONG12345";
            int keySize = 256;
            if (string.IsNullOrEmpty(plainText))
                return "";

            byte[] initialVectorBytes = Encoding.ASCII.GetBytes(initialVector);
            byte[] saltValueBytes = Encoding.ASCII.GetBytes(salt);
            byte[] plainTextBytes = Encoding.UTF8.GetBytes(plainText);

            PasswordDeriveBytes derivedPassword = new PasswordDeriveBytes(password, saltValueBytes, hashAlgorithm, passwordIterations);
            byte[] keyBytes = derivedPassword.GetBytes(keySize / 8);
            RijndaelManaged symmetricKey = new RijndaelManaged();
            symmetricKey.Mode = CipherMode.CBC;

            byte[] cipherTextBytes = null;

            using (ICryptoTransform encryptor = symmetricKey.CreateEncryptor(keyBytes, initialVectorBytes))
            {
                using (MemoryStream memStream = new MemoryStream())
                {
                    using (CryptoStream cryptoStream = new CryptoStream(memStream, encryptor, CryptoStreamMode.Write))
                    {
                        cryptoStream.Write(plainTextBytes, 0, plainTextBytes.Length);
                        cryptoStream.FlushFinalBlock();
                        cipherTextBytes = memStream.ToArray();
                        memStream.Close();
                        cryptoStream.Close();
                    }
                }
            }

            symmetricKey.Clear();
            return Convert.ToBase64String(cipherTextBytes);
        }

        static string Decrypt(string cipherText)
        {
            try
            {
                string password = "x$s*76@#0gslw%$ssa999$#5qqw.)";
                string salt = "B!@#$a23021988G";
                string hashAlgorithm = "SHA1";
                int passwordIterations = 2;
                string initialVector = "16CHARSLONG12345";
                int keySize = 256;
                if (string.IsNullOrEmpty(cipherText))
                    return "";

                byte[] initialVectorBytes = Encoding.ASCII.GetBytes(initialVector);
                byte[] saltValueBytes = Encoding.ASCII.GetBytes(salt);
                byte[] cipherTextBytes = Convert.FromBase64String(cipherText);

                PasswordDeriveBytes derivedPassword = new PasswordDeriveBytes(password, saltValueBytes, hashAlgorithm, passwordIterations);
                byte[] keyBytes = derivedPassword.GetBytes(keySize / 8);

                RijndaelManaged symmetricKey = new RijndaelManaged();
                symmetricKey.Mode = CipherMode.CBC;

                byte[] plainTextBytes = new byte[cipherTextBytes.Length];
                int byteCount = 0;

                using (ICryptoTransform decryptor = symmetricKey.CreateDecryptor(keyBytes, initialVectorBytes))
                {
                    using (MemoryStream memStream = new MemoryStream(cipherTextBytes))
                    {
                        using (CryptoStream cryptoStream = new CryptoStream(memStream, decryptor, CryptoStreamMode.Read))
                        {
                            byteCount = cryptoStream.Read(plainTextBytes, 0, plainTextBytes.Length);
                            memStream.Close();
                            cryptoStream.Close();
                        }
                    }
                }

                symmetricKey.Clear();
                return Encoding.UTF8.GetString(plainTextBytes, 0, byteCount);
            }
            catch { return ""; }
        }
        //smtp
        public bool send_email(string str_messege, string email_str, string str_theme)
        {
            bool str_error = false;
            try
            {
                var lis = connect("get_smtp_options");
                if (lis.Count > 0)
                {
                    //создание письма
                    SmtpClient Smtp = new SmtpClient(str_decrypt(lis[0]["smtp_server"]), Convert.ToInt32(str_decrypt(lis[0]["smtp_port"])));
                    Smtp.EnableSsl = lis[0]["smtp_ssl"] == "true" ? true : false;
                    Smtp.Credentials = new NetworkCredential(str_decrypt(lis[0]["smtp_user"]), str_decrypt(lis[0]["smtp_password"]));

                    //Формирование письма
                    MailMessage Message = new MailMessage();
                    Message.IsBodyHtml = true;
                    Message.From = new MailAddress(str_decrypt(lis[0]["smtp_email"]));
                    Message.To.Add(new MailAddress(email_str));
                    Message.Subject = str_theme;
                    Message.Body = str_messege;

                    Smtp.Send(Message);//отправка
                    Message.Dispose();
                    str_error = true;
                }
                else
                    str_error = false;
            }
            catch
            {
                str_error = false;
            }
            return str_error;
        }
        //регулярные выражения
        public string get_regularexpression(string regular_name)
        {
            Dictionary<string, string> dic_regular = new Dictionary<string, string>();
            dic_regular.Add("email", @"^([a-zA-Z0-9]([-.\w]*[a-zA-Z0-9])*@([a-zA-Z0-9][-\w]*[a-zA-Z0-9]\.)+[a-zA-Z]{2,9})$");
            dic_regular.Add("password", @"[0-9a-zA-Z_\!\@\#\$\%\(\)\?]{4,20}");
            dic_regular.Add("text", @"[\w\s_-]{3,20}");
            dic_regular.Add("login", @"[A-Za-z0-9_-]{3,20}");
            dic_regular.Add("phone", @"^((\+*\d{1,3}){1}((\s|-)\d{1,3}){4})$");
            return dic_regular[regular_name];
        }
                
        //страничная навигация
        public HtmlGenericControl getNavigationView(string count, string idPage, int maxView, string urlPage)
        {
            HtmlGenericControl div = new HtmlGenericControl("ul");
            int countView = 0;
            countView = Int32.TryParse(count, out countView) ? countView : 0;
            if (countView != 0)
            {
                int thisPage = Convert.ToInt32(idPage) + 1;
                countView = (Int32)Math.Ceiling(Convert.ToDouble(countView) / Convert.ToDouble(maxView));
                int minPage = thisPage - 4;
                int maxPage = 0;
                if (countView <= 10)
                {
                    minPage = 1;
                    maxPage = countView;
                }
                else
                {

                    minPage = minPage <= 0 ? 1 : minPage;
                    maxPage = thisPage < 5 ? 10 : minPage + 9;

                    if (maxPage > countView)
                    {
                        minPage = countView - 9;
                        maxPage = countView;
                    }
                }
                
                for (int i = minPage; i <= countView && i <= maxPage; i++)
                {
                    HtmlGenericControl li = new HtmlGenericControl("li");
                    if (thisPage == i)
                    {
                        li.InnerText = i.ToString();
                    }
                    else
                    {
                        HtmlGenericControl a = new HtmlGenericControl("a");
                        a.InnerText = i.ToString();
                        a.Attributes.Add("href", urlPage + "?page=" + (i - 1).ToString());
                        li.Controls.Add(a);
                    }
                    div.Controls.Add(li);
                }
            }
            return div;
        }

        //режим редоктирования
        public bool get_edit_mode
        {
            get
            {
                Page p = new Page();
                if (p.Session["bag_edit_mode"] != null)
                {
                    switch (p.Session["bag_edit_mode"].ToString().ToLower())
                    {
                        case "true": return true;
                        case "false": return false;
                    }
                }
                return false;
            }
            set
            {
                Page p = new Page();
                p.Session["bag_edit_mode"] = value.ToString(); 
            }
        }

        public string getUserId()
        {
            string idUser = "";            
            List<Dictionary<string, string>> lis;
            try
            {
                Page pag = new Page();
                if (pag.User.Identity.IsAuthenticated && pag.Session["bagUsersPassword"] != null)
                {
                    lis = connect("login_user", new string[] { pag.User.Identity.Name, pag.Session["bagUsersPassword"].ToString() });
                    if (lis.Count > 0)
                        idUser = lis[0].ElementAt(0).Value;
                }
            }
            catch { idUser = ""; }
            return idUser;
        }
        
    }
}

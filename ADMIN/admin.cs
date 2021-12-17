using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace BAG.admin
{
    public class admin
    {
        public TableRow createHeaderRow(Dictionary<string, int> nameHeader)
        {
            TableRow row = new TableRow();
            for (int i = 0; i < nameHeader.Count; i++)
            {
                TableHeaderCell cel = new TableHeaderCell();
                cel.Text = nameHeader.ElementAt(i).Key;
                cel.Attributes.Add("width", nameHeader.ElementAt(i).Value + "%");
                row.Controls.Add(cel);
            }
            return row;
        }

        public bool CompressDirectory(string[] sFiles, string sOutZip)
        {
            bool b = false;
            try
            {
                using (FileStream outFile = new FileStream(sOutZip, FileMode.Create, FileAccess.Write, FileShare.None))
                using (GZipStream str = new GZipStream(outFile, CompressionMode.Compress))
                    foreach (string sFilePath in sFiles)
                    {
                        string sNameFile = Path.GetFileName(sFilePath);
                        string sDir = Path.GetDirectoryName(sFilePath);
                        CompressFile(sDir, sNameFile, str);
                    }
                b = true;
            }
            catch
            {
                b = false;
            }
            return b;
        }

        public void CompressFile(string sDir, string sNameFile, GZipStream zipStream)
        {
            //Compress file name            
            char[] chars = sNameFile.ToCharArray();
            zipStream.Write(BitConverter.GetBytes(chars.Length), 0, sizeof(int));
            foreach (char c in chars)
                zipStream.Write(BitConverter.GetBytes(c), 0, sizeof(char));

            //Compress file content
            byte[] bytes = File.ReadAllBytes(Path.Combine(sDir, sNameFile));
            zipStream.Write(BitConverter.GetBytes(bytes.Length), 0, sizeof(int));
            zipStream.Write(bytes, 0, bytes.Length);
            File.Delete(Path.Combine(sDir, sNameFile));
        }

        public bool DecompressFile(string sDir, GZipStream zipStream)
        {
            //Decompress file name
            byte[] bytes = new byte[sizeof(int)];
            int Readed = zipStream.Read(bytes, 0, sizeof(int));
            if (Readed < sizeof(int))
                return false;

            int iNameLen = BitConverter.ToInt32(bytes, 0);
            bytes = new byte[sizeof(char)];
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < iNameLen; i++)
            {
                zipStream.Read(bytes, 0, sizeof(char));
                char c = BitConverter.ToChar(bytes, 0);
                sb.Append(c);
            }
            string sFileName = sb.ToString();
            
            //Decompress file content
            bytes = new byte[sizeof(int)];
            zipStream.Read(bytes, 0, sizeof(int));
            int iFileLen = BitConverter.ToInt32(bytes, 0);

            bytes = new byte[iFileLen];
            zipStream.Read(bytes, 0, bytes.Length);

            string sFilePath = Path.Combine(sDir, sFileName);
            string sFinalDir = Path.GetDirectoryName(sFilePath);
            if (!Directory.Exists(sFinalDir))
                Directory.CreateDirectory(sFinalDir);

            using (FileStream outFile = new FileStream(sFilePath, FileMode.Create, FileAccess.Write, FileShare.None))
                outFile.Write(bytes, 0, iFileLen);

            return true;
        }

        public void DecompressToDirectory(string sCompressedFile, string sDir)
        {
            using (FileStream inFile = new FileStream(sCompressedFile, FileMode.Open, FileAccess.Read, FileShare.None))
            using (GZipStream zipStream = new GZipStream(inFile, CompressionMode.Decompress, true))
                while (DecompressFile(sDir, zipStream)) ;
        }
        
    }
}
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web;

namespace ContactAppAPI.CommonUpdates
{
    public class ErrorLog
    {
        /// <summary>
        /// Initialize the object
        /// </summary>
        static ErrorLog()
        {

        }

        /// <summary>
        /// Initialize the object with provided values
        /// </summary>
        /// <param name="ex"></param>
        public static void Log(Exception ex)
        {
            DisplayError(ex);
        }


        public static void WriteErrorLog(string strSourceDetails)
        {
            string path = "~/ErrorLog/SynchContact_" + DateTime.Today.ToString("dd-MMM-yyyy") + ".txt";
            if (!File.Exists(System.Web.HttpContext.Current.Server.MapPath(path)))
            {
                File.Create(System.Web.HttpContext.Current.Server.MapPath(path)).Close();
            }
            using (StreamWriter w = File.AppendText(System.Web.HttpContext.Current.Server.MapPath(path)))
            {
                w.WriteLine("\r\nSYNCH contact error : ");
                w.WriteLine(DateTime.Now.ToString(CultureInfo.InvariantCulture));
                w.WriteLine("Current Page : " + System.Web.HttpContext.Current.Request.Url.ToString());
                w.WriteLine("Source : " + strSourceDetails);
                w.WriteLine("__________________________");
                w.Flush();
                w.Close();
            }
        }

        /// <summary>
        /// If an error will goto error log
        /// </summary>
        /// <param name="ex"></param>
        public static void DisplayError(Exception ex)
        {
            string strErrorPath = GetErrorLocation();
            if (!Directory.Exists(strErrorPath))
                Directory.CreateDirectory(strErrorPath);
            StreamWriter streamWriter = new StreamWriter(strErrorPath + "Error Log " + DateTime.Now.ToString("dd-MM-yyyy") + ".txt", true);
            StackTrace stackTrace = new StackTrace();
            StackFrame stackFrame = stackTrace.GetFrame(1);
            MethodBase methodBase = stackFrame.GetMethod();
            streamWriter.WriteLine(DateTime.Now.ToString().Trim());
            streamWriter.WriteLine(methodBase.Name.ToString().Trim());
            streamWriter.WriteLine(ex.TargetSite.Name.ToString().Trim());
            streamWriter.WriteLine(ex.Message.ToString().Trim());
            streamWriter.WriteLine(ex.StackTrace.ToString().Trim());
            streamWriter.WriteLine("----------------------------------------------------");
            streamWriter.WriteLine("----------------------------------------------------");
            streamWriter.Close();
        }

        /// <summary>
        /// Error location
        /// </summary>
        /// <returns></returns>
        public static string GetErrorLocation()
        {
            return ConfigurationManager.AppSettings["ErrorLocation"].ToString().Trim();
        }


    }
}
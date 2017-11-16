using System;
using System.IO;

namespace webhose
{
    public class WebhoseRequest
    {
        private string token;
        private WebhoseResponse response;
        const string url = "https://webhose.io";
        public WebhoseRequest(string token)
        {
            this.token = token;
        }


        public void config(string token)
        {
            this.token = token;
        }

        public void setAPI(string token)
        {
            this.token = token;
        }

        public string getAPI()
        {
            return token;
        }




        public WebhoseResponse getResponse(string query, string ts, string format, int iLoop)
        {
            try
            {
                response = new WebhoseResponse(query, url, token, ts, format, iLoop);
                return response;
            }
            catch (System.Net.WebException)
            {
                Console.WriteLine("Something went Wrong with the request please check you API key or you query");
                throw new System.IO.IOException();
            }

        }

        //public WebhoseResponse getResponse(WebhoseQuery query)
        //      {
        //          string stringQuary = query.ToString();
        //          return this.getResponse(stringQuary);
        //      }

    }
}

using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Net;
using System.Xml;
namespace webhose
{
    public class WebhoseResponse
    {
        public JObject jsonfile;
        public List<WebhosePost> posts;
        public int totalResults;
        public string next;
        public int left;
        public int moreResultsAvailable;
        public string jsonString;


        //public WebhoseResponse(string query, string url, string token)
        //{
        //    string headers = "/search?token=" + token + "&q=" + query + "&size=10&sort=relevancy&language=english&site_category=news&site_type=news;
        //    using (var webClient = new System.Net.WebClient())
        //    {
        //        ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls11;
        //        webClient.Encoding = Encoding.UTF8;
        //        var json = webClient.DownloadString(url + headers);
        //        jsonfile = JsonConvert.DeserializeObject<JObject>(json);


        //    }

        //    totalResults = (int)jsonfile["totalResults"];
        //    next = url + jsonfile["next"];
        //    left = (int)jsonfile["requestsLeft"];
        //    moreResultsAvailable = (int)jsonfile["moreResultsAvailable"];
        //    posts = retrievePosts(jsonfile);
        //}
        public WebhoseResponse(string query, string url, string token, string ts, string format, int iLoop)
        {
            //string headers = "/search?token=" + token+ "&format=" + format + "&ts=" + ts + "&q=" + query + "&size=10";

            //string headers = "/search?token=" + token + "&format=" + format + "&ts=" + ts + "&q=" + query + "&size=" + iLoop + "&sort=crawled&language=english&site_category=news&site_type=news&latest=true&order=desc";

            //string headers = "/search?token=" + token + "&format=" + format + "&ts=" + ts + "&sort=crawled&q=" + query + "&size=" + iLoop + "&language=english&site_type=news&site_suffix=com"; //&domain_rank=<500&performance_score=>7+

            //string headers = "/search?token="+ token + "&format="+ format + "&sort=relevancy&size=7&q=" + query + "%20language%3Aenglish%20site_type%3Anews%20site_suffix%3Acom%20domain_rank%3A%3C500%20performance_score%3A%3E7";
            string headers = "/search?token="+ token + "&format="+ format + "&sort=relevancy&language=english&site_type=news&size="+ iLoop + "&q=" + query + "&order=desc";
            using (var webClient = new System.Net.WebClient())
            {
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls11;
                webClient.Encoding = Encoding.UTF8;
                var json = webClient.DownloadString(url + headers);
                jsonString = json.ToString();
                // jsonfile = JsonConvert.DeserializeObject<JObject>(json);
            }

            //totalResults = (int)jsonfile["totalResults"];
            //next = url + jsonfile["next"];
            //left = (int)jsonfile["requestsLeft"];
            //moreResultsAvailable = (int)jsonfile["moreResultsAvailable"];

        }
        public WebhoseResponse(String url)
        {
            using (var webClient = new System.Net.WebClient())
            {
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls11;
                webClient.Encoding = Encoding.UTF8;
                var json = webClient.DownloadString(url);

                jsonfile = (JObject)JsonConvert.DeserializeObject(json);
            }

            totalResults = (int)jsonfile["totalResults"];
            next = "https://webhose.io" + jsonfile["next"];
            left = (int)jsonfile["requestsLeft"];
            moreResultsAvailable = (int)jsonfile["moreResultsAvailable"];
            posts = retrievePosts(jsonfile);
        }

        public WebhoseResponse getNext()
        {
            if (next.Equals(""))
            {
                return null;
            }
            else
            {
                if (moreResultsAvailable == 0)
                {
                    return null;
                }
                return new WebhoseResponse(next);
            }
        }

        public override string ToString()
        {
            StringBuilder responseString = new StringBuilder();
            foreach (WebhosePost post in posts)
            {
                responseString.Append(post.ToString());
                responseString.Append("\n\n");
            }

            responseString.Append("More Inforamtion:\n" +
                "total_results: " + totalResults + "\n" +
                "moreResultsAvailable: " + moreResultsAvailable + "\n" +
                "next: " + next + "\n" +
                "requests_left: " + left + "\n");

            return responseString.ToString();
        }

        private List<WebhosePost> retrievePosts(JObject json)
        {
            List<WebhosePost> postsList = new List<WebhosePost>();
            foreach (JToken post in json["posts"])
            {
                postsList.Add(new WebhosePost(post));
            }
            return postsList;
        }

    }
}

using ContactAppAPI.Models.Feed;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.ServiceModel.Syndication;
using System.Text;
using System.Text.RegularExpressions;
using System.Web.Http;
using System.Xml;
using System.Xml.XPath;
using webhose;

namespace ContactAppAPI.Controllers.Feed
{
    [RoutePrefix("api/Feed")]
    public class FeedsController : ApiController
    {
        public string webhoseToken = ConfigurationManager.AppSettings["WebhoseToken"].ToString();
        public string WebhoseTS = string.Empty;

        #region " Get User interest"

        /// <summary>
        /// Get contact list
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="ContactId"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [Route("getFeeds")]
        [HttpGet]
        public HttpResponseMessage GetFeeds(int FeedId)
        {
            List<FeedsModel> contactModelsList = new List<FeedsModel>();
            contactModelsList = this.GetContactList(FeedId);
            return Request.CreateResponse(HttpStatusCode.OK, contactModelsList);
        }

        [HttpPost]
        public List<FeedsModel> GetContactList(int UserId)
        {
            List<FeedsModel> feedModelsList = new List<FeedsModel>();
            List<FeedsModel> GetXMLList = new List<FeedsModel>();
            if (!string.IsNullOrEmpty(Convert.ToString(UserId)) && (UserId != 0))
            {
                DataTable dtFeedList = new DataTable();
                FeedsModel feedsModel = new FeedsModel();
                dtFeedList = feedsModel.GetFeedList(UserId);
                string LoadFeeds = string.Empty;
                if (dtFeedList.Rows.Count > 0)
                    GetXMLList = ParseRssFile(dtFeedList);
            }
            return GetXMLList;
        }


        private List<FeedsModel> ParseRssFile(DataTable dtContactInterest)
        {
            List<FeedsModel> feedModelsList = new List<FeedsModel>();
            string searchName = string.Empty;
            WebhoseTS = Convert.ToString(ConvertToTimestamp(DateTime.Now));
            foreach (DataRow drInterest in dtContactInterest.Rows)
            {
                searchName = Convert.ToString(drInterest["interestname"]);
                WebhoseRequest clientRequest = new WebhoseRequest(webhoseToken); // Token ID
                WebhoseResponse response = clientRequest.getResponse(searchName, WebhoseTS, "json", Convert.ToInt32(ConfigurationManager.AppSettings["TrendingCount"]));
                dynamic dynJson = JsonConvert.DeserializeObject(response.jsonString);
                foreach (var item in dynJson["posts"])
                {
                    FeedsModel feedXMLModel = new FeedsModel();
                    string title = item["title"] != null ? item["title"] : string.Empty;
                    string link = item["url"] != null ? item["url"] : string.Empty;
                    string description = item["text"] != null ? item["text"] : string.Empty;
                    string ImageURL = item["thread"]["main_image"] != null ? item["thread"]["main_image"] : string.Empty;
                    DateTime FeedPostedOn = item["published"] != null ? Convert.ToDateTime(item["published"]) : DateTime.Now;

                    if (!string.IsNullOrEmpty(title) && !string.IsNullOrEmpty(title))
                    {
                        feedXMLModel.FeedTitle = title;
                        feedXMLModel.FeedLink = link;
                        feedXMLModel.FeedDescription = description;
                        feedXMLModel.FeedPostedOn = FeedPostedOn;
                        feedXMLModel.FeedImageURL = ImageURL;
                        feedModelsList.Add(feedXMLModel);
                    }
                }
            }
            return feedModelsList;
        }


        #endregion

        #region "Get Location Feeds"

        [AllowAnonymous]
        [Route("GetFeeduserLocation")]
        [HttpGet]
        public HttpResponseMessage GetFeeduserLocation(string userId)
        {
            List<FeedsModel> feedList = new List<FeedsModel>();
            FeedsModel feedModel = new FeedsModel();
            DataTable dtUserDetails = feedModel.GetUserDetails(Convert.ToInt32(userId));

            if (dtUserDetails.Rows.Count > 0)
            {
                string location = Convert.ToString(dtUserDetails.Rows[0]["City"]);
                if (!string.IsNullOrEmpty(location))
                    feedList = this.ContactLocationFeeds(location);
            }
            return Request.CreateResponse(HttpStatusCode.OK, feedList);
        }

        private List<FeedsModel> ContactLocationFeeds(string location)
        {
            List<FeedsModel> feedList = new List<FeedsModel>();
            string searchName = '"' + Convert.ToString(location) + '"';
            WebhoseTS = Convert.ToString(ConvertToTimestamp(DateTime.Now));
            WebhoseQuery clientQuery = new WebhoseQuery();
            WebhoseRequest clientRequest = new WebhoseRequest(webhoseToken); // Token ID
            WebhoseResponse response = clientRequest.getResponse(searchName, WebhoseTS, "json", Convert.ToInt32(ConfigurationManager.AppSettings["TrendingCount"]));
            dynamic dynJson = JsonConvert.DeserializeObject(response.jsonString);
            foreach (var item in dynJson["posts"])
            {
                FeedsModel feedXMLModel = new FeedsModel();
                string title = item["title"] != null ? item["title"] : string.Empty;
                string link = item["url"] != null ? item["url"] : string.Empty;
                string description = item["text"] != null ? item["text"] : string.Empty;
                string ImageURL = item["thread"]["main_image"] != null ? item["thread"]["main_image"] : string.Empty;
                DateTime FeedPostedOn = item["published"] != null ? Convert.ToDateTime(item["published"]) : DateTime.Now;
                if (!string.IsNullOrEmpty(title) && !string.IsNullOrEmpty(title))
                {
                    feedXMLModel.FeedTitle = title;
                    feedXMLModel.FeedLink = link;
                    feedXMLModel.FeedDescription = description;
                    feedXMLModel.FeedRating = 0;
                    feedXMLModel.FeedPostedOn = FeedPostedOn;
                    feedXMLModel.FeedImageURL = ImageURL;
                    feedList.Add(feedXMLModel);
                }
            }
            return feedList;
        }

        #endregion

        #region " Get specific contact feeds"

        /// <summary>
        /// Get contact list
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="ContactId"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [Route("getContactFeeds")]
        [HttpGet]
        public HttpResponseMessage getContactFeed(int ContactId)
        {
            List<FeedsModel> contactModelsList = new List<FeedsModel>();
            contactModelsList = this.GetContactFeedList(ContactId);
            return Request.CreateResponse(HttpStatusCode.OK, contactModelsList);
        }

        [HttpPost]
        public List<FeedsModel> GetContactFeedList(int ContactId)
        {
            List<FeedsModel> feedModelsList = new List<FeedsModel>();
            List<FeedsModel> GetXMLList = new List<FeedsModel>();
            if (!string.IsNullOrEmpty(Convert.ToString(ContactId)) && (ContactId != 0))
            {
                DataTable dtFeedList = new DataTable();
                FeedsModel feedsModel = new FeedsModel();
                dtFeedList = feedsModel.GetContactFeedList(ContactId);
                string LoadFeeds = string.Empty;
                if (dtFeedList.Rows.Count > 0)
                    GetXMLList = ParseContactRssFile(dtFeedList);
            }
            return GetXMLList;
        }


        private List<FeedsModel> ParseContactRssFile(DataTable dtContactInterest)
        {
            string searchName = string.Empty;
            List<FeedsModel> feedModelsList = new List<FeedsModel>();
            WebhoseTS = Convert.ToString(ConvertToTimestamp(DateTime.Now));
            foreach (DataRow drInterest in dtContactInterest.Rows)
            {


                searchName = '"' + Convert.ToString(drInterest["interestname"]) + '"';

                WebhoseRequest clientRequest = new WebhoseRequest(webhoseToken); // Token ID
                WebhoseResponse response = clientRequest.getResponse(searchName, WebhoseTS, "json", Convert.ToInt32(ConfigurationManager.AppSettings["TrendingCount"]));
                dynamic dynJson = JsonConvert.DeserializeObject(response.jsonString);
                foreach (var item in dynJson["posts"])
                {
                    FeedsModel feedXMLModel = new FeedsModel();
                    string title = item["title"] != null ? item["title"] : string.Empty;
                    string link = item["url"] != null ? item["url"] : string.Empty;
                    string description = item["text"] != null ? item["text"] : string.Empty;
                    string ImageURL = item["thread"]["main_image"] != null ? item["thread"]["main_image"] : string.Empty;
                    DateTime FeedPostedOn = item["published"] != null ? Convert.ToDateTime(item["published"]) : DateTime.Now;

                    if (!string.IsNullOrEmpty(title) && !string.IsNullOrEmpty(title))
                    {
                        feedXMLModel.FeedTitle = title;
                        feedXMLModel.FeedLink = link;
                        feedXMLModel.FeedDescription = description;
                        //feedXMLModel.FeedRating = Convert.ToInt32(drInterest["favoriterating"]);
                        feedXMLModel.FeedPostedOn = FeedPostedOn;
                        feedXMLModel.FeedImageURL = ImageURL;
                        feedModelsList.Add(feedXMLModel);
                    }
                }
            }
            return feedModelsList;
        }


        #endregion

        /*
        private List<FeedsModel> LoadWebHoseAPI(int FeedRating)
        {
            List<FeedsModel> feedModelsList = new List<FeedsModel>();
            WebhoseRequest clientRequest = new WebhoseRequest("d280333c-c64a-41a7-9b3a-9b59f2df06cb");
            WebhoseResponse response = clientRequest.getResponse("TCS", "1493115888000", "json");
            dynamic dynJson = JsonConvert.DeserializeObject(response.jsonString);
            foreach (var item in dynJson["posts"])
            {

                FeedsModel feedXMLModel = new FeedsModel();
                string link = item["title"] != null ? item["title"] : string.Empty;
                string title = item["url"] != null ? item["url"] : string.Empty;
                string description = item["text"] != null ? item["text"] : string.Empty;
                string ImageURL = item["thread"]["main_image"] != null ? item["thread"]["main_image"] : string.Empty;
                DateTime FeedPostedOn = item["published"] != null ? Convert.ToDateTime(item["published"]) : DateTime.Now;
                feedXMLModel.FeedTitle = title;
                feedXMLModel.FeedLink = link;
                feedXMLModel.FeedDescription = description;
                feedXMLModel.FeedRating = FeedRating;
                feedXMLModel.FeedPostedOn = FeedPostedOn;
                feedXMLModel.FeedImageURL = ImageURL;
                feedModelsList.Add(feedXMLModel);
            }

            return feedModelsList;
        }
        */

        static string Strip(string text)
        {
            return Regex.Replace(text, @"<(.|\n)*?>", String.Empty);
        }

        //private List<FeedsModel> GetFeedLocation(string CountryID, string Location)
        //{
        //    List<FeedsModel> feedModelsList = new List<FeedsModel>();
        //    string FeedUrl = "https://news.google.com/news/section?cf=all&hl=en&pz=1&ned=" + CountryID + "&geo=" + Location + "&output=rss";
        //    XmlTextReader xmlReader = new XmlTextReader(FeedUrl);
        //    XmlDocument xmlDoc = new XmlDocument();
        //    xmlDoc.Load(xmlReader);

        //    XPathNavigator navigator = xmlDoc.CreateNavigator();

        //    string mainTitle = Strip(navigator.SelectSingleNode("rss/channel/image/title").Value);
        //    string mainUrl = Strip(navigator.SelectSingleNode("rss/channel/image/url").Value);
        //    string mainLink = Strip(navigator.SelectSingleNode("rss/channel/image/link").Value);


        //    XmlNamespaceManager xmlNameSpace = new XmlNamespaceManager(xmlDoc.NameTable);
        //    xmlNameSpace.AddNamespace("media", "http://search.yahoo.com/mrss/");


        //    // Parse the Items in the RSS file
        //    XmlNodeList rssNodes = xmlDoc.SelectNodes("rss/channel/item");

        //    StringBuilder rssContent = new StringBuilder();

        //    // Iterate through the items in the RSS file
        //    foreach (XmlNode rssNode in rssNodes)
        //    {

        //        FeedsModel feedXMLModel = new FeedsModel();
        //        XmlNode rssSubNode = rssNode.SelectSingleNode("title");
        //        string title = rssSubNode != null ? rssSubNode.InnerText : string.Empty;

        //        rssSubNode = rssNode.SelectSingleNode("link");
        //        string link = rssSubNode != null ? rssSubNode.InnerText : string.Empty;

        //        rssSubNode = rssNode.SelectSingleNode("description");
        //        string description = rssSubNode != null ? Regex.Replace(rssSubNode.InnerText, "<.*?>", "") : string.Empty;



        //        rssSubNode = rssNode.SelectSingleNode("pubDate");
        //        DateTime FeedPostedOn = rssSubNode != null ? Convert.ToDateTime(rssSubNode.InnerText) : DateTime.Now;

        //        //rssNodes = xmlDoc.SelectNodes("//item/media:thumbnail/@url", xmlNameSpace);
        //        //string ImageURL = rssNodes.Item(Convert.ToInt32(rssNodsItemValue)).Value;
        //        //rssNodsItemValue = Convert.ToInt32(rssNodsItemValue) + 1;

        //        feedXMLModel.FeedTitle = title;
        //        feedXMLModel.FeedLink = link;
        //        feedXMLModel.FeedDescription = description;
        //        feedXMLModel.FeedPostedOn = FeedPostedOn;
        //        //feedXMLModel.FeedImageURL = ImageURL;
        //        feedModelsList.Add(feedXMLModel);

        //    }

        //    // Return the string that contain the RSS items
        //    return feedModelsList;
        //}


        private long ConvertToTimestamp(DateTime value)
        {
            TimeZoneInfo NYTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time");
            DateTime NyTime = TimeZoneInfo.ConvertTime(value, NYTimeZone);
            TimeZone localZone = TimeZone.CurrentTimeZone;
            System.Globalization.DaylightTime dst = localZone.GetDaylightChanges(NyTime.Year);
            NyTime = NyTime.AddHours(-1);
            DateTime epoch = new DateTime(1970, 1, 1, 0, 0, 0, 0).ToLocalTime();
            TimeSpan span = (NyTime - epoch);
            return (long)Convert.ToDouble(span.TotalSeconds);
        }
    }
}

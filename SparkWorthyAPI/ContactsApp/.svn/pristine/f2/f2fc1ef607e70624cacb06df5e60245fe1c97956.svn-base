using System;
using Newtonsoft.Json.Linq;

namespace webhose
{
    public class ThreadToken
    {

        public string url;
        public string siteFull;
        public string site;
        public string siteSection;
        public string sectionTitle;
        public string title;
        public string titleFull;
        public string published;
        public string participantsCount;
        public string siteType;
        public string country;
        public string spamScore;
		public string performanceScore;


        public ThreadToken(JToken thread)
		{
			try {
				url = (string)thread ["url"];
				siteFull = (string)thread ["site_full"];
				site = (string)thread ["site"];
				siteSection = (string)thread ["site_section"];
				sectionTitle = (string)thread ["section_title"];
				title = (string)thread ["title"];
				titleFull = (string)thread ["title_full"];
				published = (string)thread ["published"];
				participantsCount = (string)thread ["participants_count"];
				siteType = (string)thread ["site_type"];
				country = (string)thread ["country"];
				spamScore = (string)thread ["spam_score"];
				performanceScore = (string)thread ["performance_score"];
			} catch (Exception) {
				throw new Exception ("thread token is not available");
			}

		}

        public override string ToString()
		{
			string print = "url: " + url + "\n" +
			               "full_site: " + siteFull + "\n" +
			               "site: " + site + "\n" +
			               "site_section: " + siteSection + "\n" +
			               "section_title: " + sectionTitle + "\n" +
			               "title: " + title + "\n" +
			               "full_title: " + titleFull + "\n" +
			               "published: " + published + "\n" +
			               "participants_count: " + participantsCount + "\n" +
			               "site_type:" + siteType + "\n" +
			               "country: " + country + "\n" +
			               "spam_score: " + spamScore + "\n" +
			               "performance_score: " + performanceScore;


			return print;
		}
    }
}

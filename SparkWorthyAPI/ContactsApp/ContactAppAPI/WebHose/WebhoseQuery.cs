using System;
using System.Collections.Generic;
using System.Text;
using System.Collections;


namespace webhose
{

    //Query Object for be able to use advance search in you program
    public enum Languages
    {
        arabic, bulgarian, catalan, chinese, croatian, czech, danish, dutch, english, estonian, finnish, french, german, greek, hebrew, hungarian,
        icelandic, indonesian, italian, japanese, korean, latvian, lithuanian, norwegian, persian, polish, portuguese, romanian, russian, serbian, slovak, slovenian,
        spanish
        , swedish, turkish
    };

    public enum SiteTypes { discussions, news, blogs };

    public class WebhoseQuery
    {
		private List<string> allTerms;
        private List<string> someTerms;
        private String phrase;
        private String exclude;
		private List<SiteTypes> siteTypes;
        private List<Languages> languages;
        private List<string> sites;
        private String title;
		private String bodyText;
		private List<string> siteSuffix;
		private string site;
		private string author;
		private List<string> countries;
		private int responseSize;


		public WebhoseQuery()
		{
			this.allTerms = null;
			this.someTerms = null;
			this.phrase = null;
			this.exclude = null;
			this.siteTypes = null;
			this.languages = null;
			this.sites = null;
			this.title = null;
			this.bodyText = null;
			this.siteSuffix = null;
			this.site = null;
			this.author = null;
			this.countries = null;
			this.responseSize = 100;
		}

		public string Site
		{
			get {return this.site;}
			set {this.site = value;} 
		}

		public string Phrase
		{
			get {return this.phrase;}
			set {this.phrase = value;} 
		}

        public string Author
        {
			get {return this.author;}
			set {this.author = value;} 
        }

        public string Exclude
        {
            get { return this.exclude; }
            set { this.exclude = value; }
        }
        public string Title
        {
            get { return this.title; }
            set { this.title = value; }
        }

        public string BodyText
        {
            get { return this.bodyText; }
            set { this.bodyText = value; }
        }

		public int ResponseSize
		{
			get { return this.responseSize; }
			set	{ this.responseSize = value; }
		}

		public void AddOrganization(params string[] terms)
		{
			for (int i = 0; i < terms.Length; i++) {
				terms [i] = "organization:\"" + terms [i] + "\"";
			}
			AddAllTerms (terms);
		}

        public void AddAllTerms(params string[] terms) 
        {
            if (allTerms == null) 
            {
                allTerms = new List<string>();
            }
            allTerms.AddRange(terms);
        }

        public void AddSomeTerms(params string[] terms)
        {
            if (someTerms == null)
            {
                someTerms = new List<string>();
            }
            someTerms.AddRange(terms);
        }

        public void AddSiteTypes(params SiteTypes[] terms)
        {
            if (siteTypes == null)
            {
                siteTypes = new List<SiteTypes>();
            }
            siteTypes.AddRange(terms);
        }


        public void AddLanguages(params Languages[] terms)
        {
            if (languages == null)
            {
                languages = new List<Languages>();
            }
            languages.AddRange(terms);
        }


		public void AddSiteSuffix(params string[] suffix) {

			if (siteSuffix == null) 
			{
				siteSuffix = new List<string>();
			}
			siteSuffix.AddRange (suffix);
		}

        public void AddSites(params string[] terms)
        {
            if (sites == null)
            {
                sites = new List<string>();
            }
            sites.AddRange(sites);
        }
        

		public void AddCountries(params string[] terms)
		{
			if (countries == null)
			{
				countries = new List<string>();
			}
			countries.AddRange(terms);
		}



		public override String ToString() {
			List<string> terms = new List<string>();

			AddTerm(terms, allTerms, " AND ", null,"allTerms");
            if (phrase != null){
                terms.Add(" \"" + phrase + "\" ");
            }
			AddTerm(terms, someTerms, " OR ", null,"someTerms");
			
			if (exclude != null) {
				terms.Add(" -" + exclude + " ");
			}
            if (title != null)
            {
                terms.Add(" thread.title:(" + title + ")");
            }
            if (bodyText != null)
            {
                terms.Add(" text:(" + bodyText + ")");
            }
            AddTerm(terms, languages, "&", "language", "languages");
            AddTerm(terms, sites, "&", "site", "sites");
            AddTerm(terms, siteTypes, "&", "site_type","siteTypes");
			AddTerm (terms, siteSuffix, "&", "site_suffix", "siteSuffix");
			AddTerm (terms, countries, "&", "thread.country", "countries");
			if (site != null) 
			{
				terms.Add ("&site=" + site);
			}
			if (author != null) 
			{
				terms.Add ("&author=" + author);
			}
			if (responseSize != 100) 
			{
				terms.Add ("&size=" + responseSize);
			}
				
            
            string query = String.Join("", terms.ToArray());
            return query;
		}

		private void AddTerm(List<String> terms, ICollection parts, String boolOp, String fieldName,String whatTerm) {
			if(parts == null) return;

			StringBuilder sb = new StringBuilder();
			Boolean first = true;
			foreach(Object part in parts) {
				if(first) {
					first = false;
                    switch (whatTerm)
                    {
                        case "allTerms":
                            sb.Append("(");
                            break;
                        case "someTerms":
                            sb.Append(" (");
                            break;
                        case "sites":
                            sb.Append("&");
                            break;
                        case "siteTypes":
                            sb.Append("&");
                            break;
                        case "languages":
                            sb.Append("&");
                            break;
						default:
							sb.Append ("&");
							break;
                    }
				} 
				else
				{
                    sb.Append(boolOp);
				}
				if(fieldName != null) 
				{
					sb.Append(fieldName).Append("=");
				}
  
                    sb.Append(part);    
			}
            if (whatTerm.Equals("allTerms") || whatTerm.Equals("someTerms"))
            {
                sb.Append(")");
            }
			terms.Add(sb.ToString());
		}
	}
}
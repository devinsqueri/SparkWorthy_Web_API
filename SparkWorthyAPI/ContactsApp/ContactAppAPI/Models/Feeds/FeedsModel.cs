using ContactAppAPI.CommonUpdates;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace ContactAppAPI.Models.Feed
{
    public class FeedsModel
    {

        #region "Property"

        /// <summary>
        /// get or set the FeedId
        /// </summary>
        public int FeedId { get; set; }

        /// <summary>
        /// get or set the InterestId
        /// </summary>
        public int InterestId { get; set; }

        /// <summary>
        /// get or set the FeedURL
        /// </summary>
        public string FeedURL { get; set; }

        /// <summary>
        /// get or set the FeedTitle
        /// </summary>
        public string FeedTitle { get; set; }

        /// <summary>
        /// get or set the FeedLink
        /// </summary>
        public string FeedLink { get; set; }

        /// <summary>
        /// get or set the FeedDescription
        /// </summary>
        public string FeedDescription { get; set; }

        public int FeedRating { get; set; }

        public DateTime FeedPostedOn { get; set; }

        public string FeedImageURL { get; set; }

        #endregion

        #region "Private Methods"

        /// <summary>
        /// Get group list
        /// </summary>
        /// <param name="UserId"></param>
        /// <returns></returns>
        protected internal DataTable GetFeedList(int UserId)
        {
            SqlCommand sqlCommand = new SqlCommand("usp_get_feeds");
            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.Parameters.AddWithValue("@UserId", UserId.ToString().Trim());
            DBOperations dbOperations = new DBOperations();
            return dbOperations.GetTableData(sqlCommand);
        }

        /// <summary>
        /// Get group list
        /// </summary>
        /// <param name="UserId"></param>
        /// <returns></returns>
        protected internal DataTable GetContactFeedList(int ContactId)
        {
            SqlCommand sqlCommand = new SqlCommand("usp_get_feeds_contact");
            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.Parameters.AddWithValue("@ContactId", ContactId.ToString().Trim());
            DBOperations dbOperations = new DBOperations();
            return dbOperations.GetTableData(sqlCommand);
        }

        protected internal DataTable GetUserDetails(int UserId)
        {
            SqlCommand sqlCommand = new SqlCommand("usp_get_UserDetails");
            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.Parameters.AddWithValue("@UserId", UserId.ToString().Trim());
            DBOperations dbOperations = new DBOperations();
            return dbOperations.GetTableData(sqlCommand);
        }

        #endregion

    }
}
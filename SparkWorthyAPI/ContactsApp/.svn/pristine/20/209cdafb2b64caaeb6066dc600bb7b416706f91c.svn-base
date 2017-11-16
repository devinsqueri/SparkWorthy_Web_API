using ContactAppAPI.CommonUpdates;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace ContactAppAPI.Models
{
    public class LoginModels
    {

        #region "Property"

        /// <summary>
        /// get or set the User Id
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// get or set the User Name
        /// </summary>
        public string UserName { get; set; }

        public string PhoneNO { get; set; }

        /// <summary>
        /// get or set the User Name
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// get or set the Password
        /// </summary>
        public string Password { get; set; }

        /// <summary>
        /// get or set the Active
        /// </summary>
        public bool Active { get; set; }

        /// <summary>
        /// get or set the CompanyName
        /// </summary>
        public string CompanyName { get; set; }

        /// <summary>
        /// get or set the CompanyWebSiteFeed
        /// </summary>
        public string CompanyWebSiteFeed { get; set; }

        /// <summary>
        /// get or set the Position
        /// </summary>
        public string Position { get; set; }

        /// <summary>
        /// get or set the Country
        /// </summary>
        public string Country { get; set; }

        /// <summary>
        /// get or set the City
        /// </summary>
        public string City { get; set; }

        /// <summary>
        /// get or set the State
        /// </summary>
        public string State { get; set; }

        /// <summary>
        /// get or set the ZipCode
        /// </summary>
        public string ZipCode { get; set; }

        /// <summary>
        /// get or set the CreatedOn
        /// </summary>
        public DateTime CreatedOn { get; set; }

        /// <summary>
        /// get or set the ModifiedOn
        /// </summary>
        public DateTime ModifiedOn { get; set; }

        /// <summary>
        /// get or set the ProfilePicture
        /// </summary>
        public string ProfilePicture { get; set; }


        #endregion

        #region "Public Methods"

        /// <summary>
        /// Save update user detail
        /// </summary>
        /// <returns></returns>
        public string UpdateUsers()
        {
            SqlCommand sqlcommand = new SqlCommand("usp_update_user_profile");
            sqlcommand.CommandType = CommandType.StoredProcedure;
            sqlcommand.Parameters.AddWithValue("@UserId", this.UserId.ToString().Trim());
            sqlcommand.Parameters.AddWithValue("@UserName", this.UserName.ToString().Trim());
            sqlcommand.Parameters.AddWithValue("@CompanyWebSiteFeed", this.CompanyWebSiteFeed.ToString().Trim());
            sqlcommand.Parameters.AddWithValue("@Country", this.Country.ToString().Trim());
            DBOperations dbOperation = new DBOperations();
            string outputValue = string.Empty;
            bool Status = dbOperation.SaveData(sqlcommand, out outputValue, "");
            if (Status)
                return "true";
            else
                return "false";
        }

        /// <summary>
        /// Save update user detail
        /// </summary>
        /// <returns></returns>
        public string UpdateProfilePicture()
        {
            SqlCommand sqlcommand = new SqlCommand("usp_update_user_profile_picture");
            sqlcommand.CommandType = CommandType.StoredProcedure;
            sqlcommand.Parameters.AddWithValue("@UserId", this.UserId.ToString().Trim());
            sqlcommand.Parameters.AddWithValue("@ProfilePicture", this.ProfilePicture.ToString().Trim());
            DBOperations dbOperation = new DBOperations();
            string outputValue = string.Empty;
            bool Status = dbOperation.SaveData(sqlcommand, out outputValue, "");
            if (Status)
                return "true";
            else
                return "false";
        }


        #endregion

        #region "Private Methods"

        /// <summary>
        /// Get login details
        /// </summary>
        /// <param name="loginModels"></param>
        /// <returns></returns>
        protected internal DataTable GetLoginUsers(LoginModels loginModels)
        {
            SqlCommand sqlCommand = new SqlCommand("usp_get_login_user");
            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.Parameters.AddWithValue("@UserName", loginModels.UserName.ToString().Trim());
            sqlCommand.Parameters.AddWithValue("@Password", loginModels.Password.ToString().Trim());
            DBOperations dbOperations = new DBOperations();
            return dbOperations.GetTableData(sqlCommand);
        }

        #endregion"

    }
}
using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ContactApp.Startup))]
namespace ContactApp
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}

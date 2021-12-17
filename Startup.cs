using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(bag.Startup))]
namespace bag
{
    public partial class Startup {
        public void Configuration(IAppBuilder app) {
            ConfigureAuth(app);
        }
    }
}

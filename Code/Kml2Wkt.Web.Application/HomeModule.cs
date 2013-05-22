using Nancy;

namespace Kml2Wkt.Web.Application
{
    public class HomeModule : NancyModule
    {
        public HomeModule()
        {
            Get["/"] = _ => { return View["index"]; };
        }
    }
}
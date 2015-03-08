using StockWebApplication.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StockWebApplication.Controllers
{
    public class StockController : Controller
    {
        //
        // GET: /Stock/

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult SubmitOption(OptionViewModel model)
        {
            var x = model.OptionID;
            return new JsonResult();
        }

    }
}

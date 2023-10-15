using FalconPay.Web.DB;
using FalconPay.Web.Models;
using FalconPay.Web.Repos;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Text.Json;

namespace FalconPay.Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
          
            return View();
        }

        public IActionResult Privacy()
        {
            SplToken sp = new SplToken();
            sp.TokenAddress = "1";
            sp.TokenName = "SOLANA";
            SplToken sp1 = new SplToken();
            sp1.TokenAddress = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
            sp1.TokenName = "USDC";
            SplToken sp2 = new SplToken();
            sp2.TokenAddress = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";
            sp2.TokenName = "USDT";
            SplToken sp3 = new SplToken();
            sp3.TokenAddress = "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263";
            sp3.TokenName = "BONK";
            SplToken sp4 = new SplToken();
            sp4.TokenAddress = "SHDWyBxihqiCj6YekG2GUr7wqKLeLAMK1gHZck9pL6y";
            sp4.TokenName = "SHADOW";
            List<SplToken> spl = new List<SplToken>();
            spl.Add(sp); spl.Add(sp1);
            spl.Add(sp2);
            spl.Add(sp3);
            spl.Add(sp4);
            SplRepo spr = new SplRepo();
            spr.add(spl);
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        [HttpPost]
        public IActionResult Add([FromBody]string jsonreq)
        {
            var options = new JsonSerializerOptions
            {
                Converters = {new JsonBoolConverter() },
            };
            var sp =JsonSerializer.Deserialize<PaymentModel>(jsonreq,options);
            Payment p = new Payment();
            p.Link = sp.TransferUrl;
            p.RecieverWallet = sp.RecipientWallet;
            p.RequestedAmount = sp.RequestedAmount;
            p.Status = false;
           
            return View();
        }
    }
}
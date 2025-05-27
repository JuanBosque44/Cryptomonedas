using Microsoft.AspNetCore.Mvc;

namespace ApiCriptos.Controllers
{
    [ApiController]
    [Route("[Controller]")]
    public class CryptoController : ControllerBase
    {
        public IActionResult Index()
        {
            return Ok();
        }
    }
}

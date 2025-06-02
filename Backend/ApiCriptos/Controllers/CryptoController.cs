using ApiCriptos.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace ApiCriptos.Controllers
{
    [ApiController]
    [Route("[Controller]")]
    public class CryptoController : ControllerBase
    {
        [HttpPost]
        public IActionResult Agregar(Transaccion transaccion)
        {
            return Ok();
        }

        [HttpGet]
        public IActionResult ListarMonedas()
        {
            List<Moneda> monedas = new List<Moneda>();

            return Ok(monedas);
        }
        [HttpGet]
        public IActionResult ListarTransacciones()
        {
            List<Transaccion> transacciones = new List<Transaccion>();
            return Ok(transacciones);
        }
    }
}

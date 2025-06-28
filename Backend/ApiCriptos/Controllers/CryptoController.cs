using ApiCriptos.Datos;
using ApiCriptos.Modelos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApiCriptos.Controllers
{
    [ApiController]
    [Route("[Controller]")]
    public class CryptoController : ControllerBase
    {
        AppDBContext db;
        public CryptoController(AppDBContext _context)
        {
            db = _context;
        }

        [HttpPost("RealizarTrans")]
        public IActionResult Agregar(Transaccion transaccion)
        {
            db.Add(transaccion);
            db.SaveChanges();
            return Ok();
        }

        [HttpGet("ListarCriptos")]
        public IActionResult ListarMonedas()
        {
            List<Moneda> monedas = db.Moneda.ToList();
            return Ok(monedas);
        }
        [HttpGet("ListarTransaccion")]
        public IActionResult ListarTransacciones()
        {
            List<Transaccion> transacciones = db.Transaccion.Include(e=> e.Moneda).ToList();
            return Ok(transacciones);
        }
    }
}

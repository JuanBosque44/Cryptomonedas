namespace ApiCriptos.Datos
{
    using ApiCriptos.Modelos;
    using Microsoft.EntityFrameworkCore;
    using System.Threading;

    public class AppDBContext : DbContext
    {
        //use este codigo para crear la primer migracion
        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    optionsBuilder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=Criptomonedas;Trusted_Connection=True;MultipleActiveResultSets=True");
        //}
        public AppDBContext(DbContextOptions options) : base(options)
        {

        }
        public DbSet<Moneda> Moneda { get; set; }
        public DbSet<Transaccion> Transaccion { get; set; }

    }
}

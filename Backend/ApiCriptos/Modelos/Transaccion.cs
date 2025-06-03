namespace ApiCriptos.Modelos
{
    
    public class Transaccion
    {
        public int Id { get; set; }
        public string Accion { get; set; }
        public double Monto { get; set; }
        public double Cantidad { get; set; }
        public DateTime Fecha { get; set; }
        public int MonedaId { get; set; }
        public Moneda? Moneda { get; set; }


    }
}

function ObtenerDatos(){
    fetch("https://criptoya.com/api/BTC/ARS/0") 
    .then(response => {
        if (!response.ok) {
            alert(response.status);
            if (document.title == "Inicio"){
                const bodytabla = document.getElementById("tabla")
                const tabla = document.createElement("tr")
                const fila =  document.createElement("td")
                fila.textContent = 'No hay datos disponibles';
                tabla.appendChild(fila);
                bodytabla.appendChild(tabla)
            }
        }
        return response.json();
    })
    .then(data => {
        mostrarInfo(data);
    })
    .catch(error => console.error("Error al obtener la informacion:", error));

}

function mostrarInfo(criptos) {
    const bodytabla = document.getElementById("tabla");

    for (const exchange in criptos) {
        const tabla = document.createElement("tr");

        const nombre = document.createElement("td");
        nombre.textContent = exchange.toUpperCase();
        tabla.appendChild(nombre);

        const precio = document.createElement("td");
        precio.textContent = criptos[exchange].totalAsk;
        tabla.appendChild(precio);

        const venta = document.createElement("td");
        venta.textContent = criptos[exchange].totalBid;
        tabla.appendChild(venta);

        const fecha = document.createElement("td")
        fecha.textContent = "27/05/2025"
        tabla.appendChild(fecha)

        bodytabla.appendChild(tabla);
    }
}
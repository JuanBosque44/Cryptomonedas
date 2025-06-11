const moneda = document.getElementById("selectmoneda")
const bodytabla = document.getElementById("tabla");
const tablaTrans = document.getElementById("tablaTransacciones")
function CargarMonedas(){
    VerificarSesion()
    fetch("https://localhost:7162/Crypto/ListarCriptos")
    .then(response => {
        if (!response.ok) {
            alert(response.status);
        }
        return response.json();
    })
    .then(data => {
        moneda.innerHTML = ""
        data.forEach(element => {
            const opcion = document.createElement("option")
            opcion.textContent = element.abreviatura
            moneda.appendChild(opcion)
        });
        ObtenerDatos()
    })
    .catch(error => {
        Errores(error)
    });
}

function Errores(error){
    console.error("Error al obtener la informacion:", error)
        
        const tabler = document.createElement("tr")
        const errores = document.createElement("td")
        errores.colSpan = 4
        errores.textContent = "No hay datos disponibles"
        tabler.appendChild(errores)
        if (document.title == "Inicio"){
            bodytabla.appendChild(tabler)
        }
        else if (document.title == "Historial de movimientos"){
            tablaTrans.appendChild(errores)
        }
        
}

function VerificarSesion(){
    const usuario = localStorage.getItem("User")
    const contra = localStorage.getItem("Password")
    if (!usuario && !contra){
        window.location.replace("Usuario.html")
    }
    console.log("Sesion iniciada")
}

function ObtenerDatos(){
   
    var sel = moneda.value
    fetch("https://criptoya.com/api/"+sel+"/ARS/0") 
    .then(response => {
        if (!response.ok) {
            alert(response.status);
            Errores(response.status)
        }
        return response.json();
    })
    .then(data => {
        mostrarInfo(data);
    })
    .catch(error => console.error("Error al obtener la informacion:", error));

}

function mostrarInfo(criptos) {
/*     const bodytabla = document.getElementById("tabla");
 */    bodytabla.innerHTML = "";

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
        fecha.textContent = new Date()
        tabla.appendChild(fecha)

        bodytabla.appendChild(tabla);
    }

    if (criptos == null){
        const tabler = document.createElement("tr")
        const errores = document.createElement("td")
        errores.colSpan = 4
        errores.textContent = "No hay datos disponibles"
    }
}

function IniciarSesion(){
    const nombre = document.getElementById("NombreUsuario").value
    const contrasena = document.getElementById("ContrasenaUsuario").value
    var usuarioG = localStorage.getItem("User")
    var contra = localStorage.getItem("Password")
    if (nombre === null || contrasena === null){
        alert("Ingrese los datos de inicio de sesion")
    }
    else{
        if (usuarioG === null || usuarioG != nombre){
            localStorage.setItem("User", nombre)
            localStorage.setItem("Password", contrasena)
            location.reload()
        }
        if (usuarioG === nombre && contra === contrasena){
            window.location.assign("Inicio.html")
        }
    }
}

function CargarTransacciones(){
    VerificarSesion()
    fetch("https://localhost:7162/Crypto/ListarTransaccion")
    .then(response =>{
        if(!response.ok){
            alert(response.status);
            Errores(response.status)
        }
        return response.json()
    })
    .then(data => {
        const tablaTransaccion = document.getElementById("tablaTransacciones")
        tablaTransaccion.innerHTML = ""
        data.forEach(trans => {
            const tabla = document.createElement("tr");

            const nombre = document.createElement("td");
            nombre.textContent = trans.accion;
            tabla.appendChild(nombre);

            const precio = document.createElement("td");
            precio.textContent = trans.moneda.abreviatura;
            tabla.appendChild(precio);

            const venta = document.createElement("td");
            venta.textContent = trans.monto;
            tabla.appendChild(venta);

            const fechas = document.createElement("td")
            fechas.textContent = trans.fecha
            tabla.appendChild(fechas)

            tablaTrans.appendChild(tabla);
        });
    })
    .catch(error =>{
        Errores(error)
    })
}
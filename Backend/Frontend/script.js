const moneda = document.getElementsByClassName("selectmoneda")[0]
const bodytabla = document.getElementById("tabla");
const tablaTrans = document.getElementById("tablaTransacciones")
var saldo = Number(localStorage.getItem("Saldo"))
var datos

function Inicio(){
    VerificarSesion()
    fetch("https://localhost:7162/Crypto/ListarTransaccion")
    .then(response => {
        if (!response.ok){
            alert(response.status)
        }
        return response.json();
    })
    .then(data => {
            //primera tabla: Mis inversiones
            const tablaMisInversiones = document.getElementById("MisInversiones");
            tablaMisInversiones.innerHTML = "";
            const abreviaciones = {};
            data.forEach(trans => {
                const abrev = trans.moneda.abreviatura;
                if (!abreviaciones[abrev]) {
                    abreviaciones[abrev] = {
                        cantidad: 0,
                        monto: 0
                    };
                }
                if (trans.accion == "Compra") {
                    abreviaciones[abrev].cantidad += trans.cantidad;
                    abreviaciones[abrev].monto += trans.monto;
                } else if (trans.accion == "Venta") {
                    abreviaciones[abrev].cantidad -= trans.cantidad;
                    abreviaciones[abrev].monto -= trans.monto;
                }
            });
            for (const abrev in abreviaciones) {
                const fila = document.createElement("tr");
                const MonedaAbreviada = document.createElement("td");
                MonedaAbreviada.textContent = abrev;
                fila.appendChild(MonedaAbreviada);
                const CantidadMoneda = document.createElement("td");
                CantidadMoneda.textContent = abreviaciones[abrev].cantidad.toFixed(4); 
                fila.appendChild(CantidadMoneda);
                const MontoMoneda = document.createElement("td");
                MontoMoneda.textContent = abreviaciones[abrev].monto.toFixed(2);
                fila.appendChild(MontoMoneda);
                tablaMisInversiones.appendChild(fila);
            }
            //segunda tabla: Saldos
            const tablaSaldos = document.getElementById("Saldos")
            var comprasTotales = 0
            var ventasTotales = 0
            data.forEach(elm => {
                if (elm.accion == "Compra"){
                    comprasTotales += elm.monto
                }
                else if (elm.accion == "Venta"){
                    ventasTotales += elm.monto
                }
            })
            const fila = document.createElement("tr")
            const Inversion = document.createElement("td")
            var inv = comprasTotales - ventasTotales
            Inversion.textContent = inv.toFixed(2)
            fila.appendChild(Inversion)
            const disponible = document.createElement("td")
            var disp = ventasTotales + saldo
            disponible.textContent = disp.toFixed(2)
            fila.appendChild(disponible)
            const Total = document.createElement("td")
            var tot = inv + ventasTotales + saldo
            Total.textContent = tot.toFixed(2)
            fila.appendChild(Total)
            tablaSaldos.appendChild(fila)
            
            CargarMonedas()
        })
        .catch(error => {
            Errores(error);
        });
}



function CargarMonedas(){
    VerificarSesion()
    var accionSeleccionada
    if(document.title == "Transacciones") accionSeleccionada = document.getElementById("elegirAccion").value 
    else accionSeleccionada = "Compra"
    //rellena el select con todas las monedas disponibles para vender
    if (accionSeleccionada == "Venta"){
        fetch("https://localhost:7162/Crypto/ListarTransaccion")
        .then(response => {
            if (!response.ok) {
                alert(response.status);
            }
            return response.json();
        })
        .then(data => {
            moneda.innerHTML = ""
            data.forEach(element => {
                if(element.accion == "Compra"){
                    const opcion = document.createElement("option")
                    opcion.value = element.monedaId
                    opcion.textContent = element.moneda.abreviatura
                    opcion.setAttribute("data-abrev", element.moneda.abreviatura);
                    opcion.setAttribute("data-cantidad", element.cantidad)

                    moneda.appendChild(opcion)
                }               
            })
        })
        .catch(error => {
            Errores(error)
        });
    }
    //rellena el select con todas las monedas disponibles para comprar
    else{
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
                opcion.value = element.id
                opcion.textContent = element.abreviatura
                opcion.setAttribute("data-abrev", element.abreviatura);
                moneda.appendChild(opcion)
            });
            if (document.title == "Inicio")ObtenerDatos()
        })
        .catch(error => {
            Errores(error)
        });
    }
    
}

function Errores(error){
    console.error("Error al obtener la informacion:", error)
        
        const tabler = document.createElement("tr")
        const errores = document.createElement("td")
        const errorOpciones = document.createElement("option")
        errores.colSpan = 4
        errores.textContent = "No hay datos disponibles"
        errorOpciones.textContent = "Sin datos"
        tabler.appendChild(errores)
        if (document.title == "Inicio"){
            bodytabla.appendChild(tabler)
            moneda.appendChild(errorOpciones)
        }
        else if (document.title == "Historial de movimientos"){
            tablaTrans.appendChild(tabler)
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
   
    let selected = document.querySelector(".selectmoneda option:checked");
    let abrev = selected.getAttribute("data-abrev");
    fetch("https://criptoya.com/api/"+abrev+"/ARS/0") 
    .then(response => {
        if (!response.ok) {
            alert(response.status);
            Errores(response.status)
        }
        return response.json();
    })
    .then(data => {
        if (document.title == "Transacciones"){
            RealizarTransaccion(data)
        }
        else{
            mostrarInfo(data);        

        }
    })
    .catch(error => {
        Errores(error)
    });

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
        var fechaRecibida = new Date()
        fechaCorta = fechaRecibida.toISOString()
        fecha.textContent = fechaCorta.slice(0,16)        
        tabla.appendChild(fecha)

        bodytabla.appendChild(tabla);
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

            const cantidad = document.createElement("td");
            cantidad.textContent = trans.cantidad;
            tabla.appendChild(cantidad);

            const venta = document.createElement("td");
            venta.textContent = trans.monto;
            tabla.appendChild(venta);

            const fechas = document.createElement("td")
            var fechaRecibida = new Date(trans.fecha)
            fechaCorta = fechaRecibida.toISOString()
            fechas.textContent = fechaCorta.slice(0,16)
            tabla.appendChild(fechas)

            tablaTrans.appendChild(tabla);
        });
    })
    .catch(error =>{
        Errores(error)
    })
}

 function RealizarTransaccion(datos){
    var accion = document.getElementById("elegirAccion").value
    var moneda = document.getElementById("elegirMoneda").value
    var selected = document.querySelector(".selectmoneda option:checked");
    var cantidadMoneda = selected.getAttribute("data-cantidad");
    var cantidad = document.getElementById("cantidad").value
    //a partir de aqui valida si es compra o venta
    if (accion == "Compra"){
        var montos = cantidad * datos.buenbit.totalAsk
        if(!moneda || !cantidad || cantidad <= 0 || montos > saldo){
            alert("No se han registrado datos validos")
        }
        else{
            EjecutarTransaccion(accion, cantidad, montos, moneda)
            saldo -= montos
            localStorage.setItem("Saldo", saldo)
        }
    }
    else if (accion == "Venta"){
        if (!cantidad || cantidad > cantidadMoneda || cantidad <= 0){
            alert("No se han registrado datos validos")
        }
        else{
            var montos = cantidad * datos.buenbit.totalBid
            EjecutarTransaccion(accion, cantidad, montos, moneda)
            saldo += montos
            localStorage.setItem("Saldo", saldo)
        }
    }
    
}

function EjecutarTransaccion(accion, cantidad, montos, moneda){
    const nuevaTransaccion = {
                Id:0,
                Accion:accion,
                Cantidad: Number(cantidad),
                monto : parseFloat(montos.toFixed(2)),
                Fecha: new Date().toISOString(),
                MonedaId:parseInt(moneda)
            }
            console.log(JSON.stringify(nuevaTransaccion));

            fetch("https://localhost:7162/Crypto/RealizarTrans",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(nuevaTransaccion)
            })
            .then(response => {
                if(!response.ok){
                    alert("No se ha podido concretar la transaccion: " + response.status)
                }
                else{
                    alert("Datos guardados")
                }
            })
            .catch(error => {
                Errores(error)
            })
}

function MostrarSaldo(){

    if (!saldo){
        const saldo = document.getElementById("sald")
        saldo.textContent = "Saldo: $0"
    }
    else{
        const saldo = document.getElementById("sald")
        saldo.textContent = "Saldo: $"+localStorage.getItem("Saldo")
    }
    if(document.title== "Inicio") Inicio()
    else if (document.title== "Transacciones") CargarMonedas()
}

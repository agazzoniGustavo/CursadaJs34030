
const contenedorProductos = document.getElementById('contenedor-productos');


const contenedorCarrito = document.getElementById('carrito-contenedor');

const botonVaciar = document.getElementById('vaciar-carrito');

const contadorCarrito = document.getElementById('contadorCarrito');


const cantidad = document.getElementById('cantidad');
const precioTotal = document.getElementById('precioTotal');
const cantidadTotal = document.getElementById('cantidadTotal');
const procesarCompra = document.getElementById(`procesarCompra`);
const activarFuncion = document.querySelector("#activarFuncion");
const totalProceso = document.querySelector("#totalProceso");
const formulario = document.querySelector('#procesar-pago');

if (activarFuncion) {
    activarFuncion.addEventListener("click", procesarPedido);
}

document.addEventListener("DOMContentLoaded", () => {
    carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    
    document.querySelector(`#activarFuncion`).click(procesarPedido)

});

if(formulario){
    formulario.addEventListener('submit', enviarCompra)
}
if (procesarCompra) {
    procesarCompra.addEventListener("click", () => {
    if (carrito.length === 0) {
        Swal.fire({
        title: "¡Tu carrito está vacio!",
        text: "Compra algo para continuar con la compra",
        icon: "error",
        confirmButtonText: "Aceptar",
        });
    } else {
        location.href = "compra.html";
    }
    });
}


if(botonVaciar){
botonVaciar.addEventListener('click', () => {
    carrito.length = 0
    actualizarCarrito()
})
}

//INYECTAR EL HTML
stockProductos.forEach((producto) => {
    const div = document.createElement('div')
    div.classList.add('producto')
    div.innerHTML = `
    <img src=${producto.img} alt= "">
    <h3>${producto.nombre}</h3>
    <p>${producto.desc}</p>
    <p class="precioProducto">Precio:$ ${producto.precio}</p>
    <button id="agregar${producto.id}" class="boton-agregar">Agregar <i class="fas fa-shopping-cart"></i></button>

    `
    contenedorProductos.appendChild(div)


    const boton = document.getElementById(`agregar${producto.id}`)
    //Por cada elemento de mi array, creo un div, lo cuelgo, le pongo un id particular, una vez colgado
    //le hago un get element by id (el de agregar) Obtengo el elemento y a dicho elemento le agrego
    //el add event listener

    boton.addEventListener('click', () => {
        //ejecuta el agregar el carrito con la id del producto
        agregarAlCarrito(producto.id)
        //
    })
})

//AGREGAR AL CARRITO
const agregarAlCarrito = (prodId) => {

    //PARA AUMENTAR LA CANTIDAD Y QUE NO SE REPITA
    const existe = carrito.some (prod => prod.id === prodId) 

    if (existe){ //SI YA ESTÁ EN EL CARRITO, ACTUALIZA LA CANTIDAD
        const prod = carrito.map (prod => { 
            if (prod.id === prodId){
                prod.cantidad++
            }
        })
    } else { //EN CASO DE QUE NO ESTÉ, AGREGA EL CURSOR AL CARRITO
        const item = stockProductos.find((prod) => prod.id === prodId)
        carrito.push(item)
    }

    actualizarCarrito() 
    //MODIFICA EL CARRITO
}

const eliminarDelCarrito = (prodId) => {
    const item = carrito.find((prod) => prod.id === prodId)

    const indice = carrito.indexOf(item) 

    carrito.splice(indice, 1) 

    actualizarCarrito() 
    console.log(carrito)
}

const actualizarCarrito = () => {

    contenedorCarrito.innerHTML = "" 

    carrito.forEach((prod) => {
        const div = document.createElement('div')
        div.className = ('productoEnCarrito')
        div.innerHTML = `
        <p>${prod.nombre}</p>
        <p>Precio:$${prod.precio}</p>
        <p>Cantidad: <span id="cantidad">${prod.cantidad}</span></p>
        <button onclick="eliminarDelCarrito(${prod.id})" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>
        `

        contenedorCarrito.appendChild(div)
        
        localStorage.setItem('carrito', JSON.stringify(carrito))

    })

    if(carrito.length === 0){
        contenedorCarrito.innerHTML = `<p class="text-center text-primary parrafo"> Tu Carrito está vacio!!</p>`
    } else {
        console.log(`Algo`)
    }


    contadorCarrito.innerText = carrito.length // actualizo con la longitud del carrito.

    console.log(carrito)
    precioTotal.innerText = carrito.reduce((acc, prod) => acc + prod.cantidad * prod.precio, 0)

}

function procesarPedido() {
    carrito.forEach((prod) => {
    const listaCompra = document.querySelector("#lista-compra tbody");
    const { id, nombre, precio, img, cantidad } = prod;
    if (listaCompra) {
        const row = document.createElement("tr");
        row.innerHTML += `
                <td>
                <img class="img-fluid img-carrito" src="${img}"/>
                </td>
                <td>${nombre}</td>
                <td>${precio}</td>
                <td>${cantidad}</td>
                <td>${precio * cantidad}</td>
            `;
        listaCompra.appendChild(row);
    }
    });
    totalProceso.innerText = carrito.reduce(
      (acc, prod) => acc + prod.cantidad * prod.precio,
    0
    );
}


function enviarCompra(e){
    e.preventDefault()
    const persona = document.querySelector('#persona').value
    const email = document.querySelector('#correo').value

    if(email === '' || persona == ''){
    Swal.fire({
        title: "¡Debes completar tu email y nombre!",
        text: "Rellena el formulario",
        icon: "error",
        confirmButtonText: "Aceptar",
    })
} else {

    const btn = document.getElementById('button');
    
       btn.value = 'Enviando...';
    
       const serviceID = 'default_service';
       const templateID = 'template_w0kcjl5';
    
       emailjs.sendForm(serviceID, templateID, this)
        .then(() => {
          btn.value = 'Finalizar compra';
          alert('Email enviado correctamente!');
        }, (err) => {
          btn.value = 'Finalizar compra';
          alert(JSON.stringify(err));
        });
    
    
        const spinner = document.querySelector('#spinner')
        spinner.classList.add('d-flex')
        spinner.classList.remove('d-none')
     
        setTimeout(() => {
          spinner.classList.remove('d-flex')
          spinner.classList.add('d-none')
          formulario.reset()
     
          const alertExito = document.createElement('p')
          alertExito.classList.add('alert', 'alerta', 'd-block', 'text-center', 'col-12', 'mt-2', 'alert-success')
          alertExito.textContent = 'Compra realizada correctamente'
          formulario.appendChild(alertExito)
     
          setTimeout(() => {
            alertExito.remove()
          }, 3000)
     
     
        }, 3000)
      }
      localStorage.clear()
     
      }

      // API WeatherMap
      window.addEventListener('load', ()=> {
        let lon
        let lat
    
        let temperaturaValor = document.getElementById('temperatura-valor')  
        let temperaturaDescripcion = document.getElementById('temperatura-descripcion')  
        
        let ubicacion = document.getElementById('ubicacion')  
        let iconoAnimado = document.getElementById('icono-animado') 
    
        let vientoVelocidad = document.getElementById('viento-velocidad') 
    
    
        if(navigator.geolocation){
           navigator.geolocation.getCurrentPosition( posicion => {

               lon = posicion.coords.longitude
               lat = posicion.coords.latitude
                //DESDE AQUIE MANEJO UBICACIÓN    
               const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=94b3f3c7782924fb07aa9f476c8d7de5`
    
    
               fetch(url)
                .then( response => { return response.json()})
                .then( data => {
                    
                    let temp = Math.round(data.main.temp)

                    temperaturaValor.textContent = `${temp} °C`
    
                    let desc = data.weather[0].description
                    temperaturaDescripcion.textContent = desc.toUpperCase()
                    ubicacion.textContent = data.name
                    
                    vientoVelocidad.textContent = `${data.wind.speed} m/s`
    
                    //ICONOS PARA ESTADO DE CLIMA
                    console.log(data.weather[0].main)
                    switch (data.weather[0].main) {
                        case 'Thunderstorm':
                          iconoAnimado.src='animated/thunder.svg'
                          console.log('TORMENTA');
                          break;
                        case 'Drizzle':
                          iconoAnimado.src='animated/rainy-2.svg'
                          console.log('LLOVIZNA');
                          break;
                        case 'Rain':
                          iconoAnimado.src='animated/rainy-7.svg'
                          console.log('LLUVIA');
                          break;
                        case 'Snow':
                          iconoAnimado.src='animated/snowy-6.svg'
                            console.log('NIEVE');
                          break;                        
                        case 'Clear':
                            iconoAnimado.src='animated/day.svg'
                            console.log('LIMPIO');
                          break;
                        case 'Atmosphere':
                          iconoAnimado.src='animated/weather.svg'
                            console.log('ATMOSFERA');
                            break;  
                        case 'Clouds':
                            iconoAnimado.src='animated/cloudy-day-1.svg'
                            console.log('NUBES');
                            break;  
                        default:
                          iconoAnimado.src='animated/cloudy-day-1.svg'
                          console.log('por defecto');
                      }
    
                })
                .catch( error => {
                    console.log(error)
                })
           })
              
        }
    })


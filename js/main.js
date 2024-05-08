let eliminado = 0;
let iniciado = false;
let yaexiste = false;
let divCantidadRepetido;

function hideCafe(){
    document.getElementById("peliOutput").style.display = "none";
}

/*LOGIN*/
async function login() {
    const datos = {
        usuario: document.getElementById('username').value,
        contraseña: document.getElementById('password').value
    };
    console.log(datos)
    try {
        const response = await fetch('http://localhost:3000/usuario/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos), // Make sure to include the 'action' property
        });
        console.log('Request payload:', JSON.stringify(datos)); // Log the payload
        if (response.ok) {
            const result = await response.json();
            localStorage.setItem('usuario', result.id);
            console.log(localStorage);
            console.log(result);
            const id_usu = result.id;
            const rols = result.rol;
            if (rols != "Cliente") {
                const intra = document.getElementById("intranet");
                intra.style.display = "block"
            }
            console.log(rols);
            console.log(id_usu);
            //aqui habria que dejar en el front el nombre del usuario

            //guardarEnDataRepository('usuario', result.id_usuario);
            console.log(result.usuario);
            console.log('Usuario logueado correctamente');
            iniciado = true;
        } else {
            console.error('Error al iniciar sesión');
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

/*CARRITO THINGS*/
async function realizarPedido() {

    const pedidoGuardado = JSON.parse(localStorage.getItem('pedido'));
    const lineasCompraGuardadas = JSON.parse(localStorage.getItem('lineasCompra'));

    fechaActual = new Date();
    fechaActual.setHours(fechaActual.getHours() + 2);
    pedidoGuardado.FECHA_PEDIDO = fechaActual;
    pedidoGuardado.ID_USUARIO = localStorage.getItem('usuario');

    const data = {
        pedido: pedidoGuardado,
        lineasCompra: lineasCompraGuardadas
    };

    console.log(data);

    try {
        const response = await fetch('http://localhost:3000/carrito/pagar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data), // Make sure to include the 'action' property
        });
        console.log('Request payload:', JSON.stringify(data)); // Log the payload
        if (response.ok) {
            console.log('Pedido creado exitosamente');
            // Eliminar datos del localStorage después de enviarlos al servidor
            localStorage.removeItem('pedido');
            localStorage.removeItem('lineasCompra');
        } else {
            console.error('Error al crear el pedido');
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}


async function agregarAlCarrito(producto) {
    // Obtener los datos actuales del carrito del local storage
    const lineasCompra = JSON.parse(localStorage.getItem('lineasCompra')) || [];
    const pedido = JSON.parse(localStorage.getItem('pedido')) || {};

    const indexProducto = lineasCompra.findIndex(item => item.ID_PRODUCTO === producto.ID_PRODUCTO);
    console.log(indexProducto);
    let nuevoProducto;
    if (indexProducto !== -1) {
        // Si el producto ya está en el carrito, aumentar su cantidad
        lineasCompra[indexProducto].CANTIDAD++;
        yaexiste = true;
    } else {

        // Agregar el nuevo producto al array lineasCompra
        nuevoProducto = {
            ID_PRODUCTO: producto.ID_PRODUCTO,
            CANTIDAD: producto.CANTIDAD,
            PRECIO_TOTAL: producto.PRECIO_TOTAL * producto.CANTIDAD,//el precio total que me pasa el producto todavia no está calculado. me dará el precio unitario
        };
        console.log(nuevoProducto);
        lineasCompra.push(nuevoProducto);
    }

    if (nuevoProducto) {
        pedido.SUBTOTAL_PEDIDO = (parseFloat(pedido.SUBTOTAL_PEDIDO) || 0) + parseFloat(nuevoProducto.PRECIO_TOTAL);
    }

    pedido.TOTAL_PEDIDO = parseFloat(pedido.SUBTOTAL_PEDIDO) + parseFloat(pedido.SUBTOTAL_PEDIDO * (pedido.IVA_PEDIDO / 100));
    console.log(lineasCompra);
    // Guardar el carrito actualizado en el local storage
    localStorage.setItem('lineasCompra', JSON.stringify(lineasCompra));
    localStorage.setItem('pedido', JSON.stringify(pedido));
}

function inicializarCarrito() {
    const pedidoInicial = {
        ID_USUARIO: 0,
        FECHA_PEDIDO: 'un dia',
        SUBTOTAL_PEDIDO: 0,
        TOTAL_PEDIDO: 0,
        IVA_PEDIDO: 21
    };
    const lineasCompraInicial = [];

    // Guardar el pedido y las líneas de compra en el almacenamiento local
    localStorage.setItem('pedido', JSON.stringify(pedidoInicial));
    localStorage.setItem('lineasCompra', JSON.stringify(lineasCompraInicial));
}


function borrarDelCarrito(idProducto) {
    // Obtener los datos actuales del carrito y del pedido del local storage
    let lineasCompra = JSON.parse(localStorage.getItem('lineasCompra'));
    let pedido = JSON.parse(localStorage.getItem('pedido'));

    // Filtrar los productos para excluir el que se quiere borrar
    const productoBorrado = lineasCompra.find(producto => producto.ID_PRODUCTO === parseInt(idProducto));
    lineasCompra = lineasCompra.filter(producto => producto.ID_PRODUCTO !== idProducto);

    // Restar el precio del producto borrado del subtotal y recalcular el total
    pedido.SUBTOTAL_PEDIDO -= productoBorrado.PRECIO_TOTAL;
    pedido.TOTAL_PEDIDO = pedido.SUBTOTAL_PEDIDO + (pedido.SUBTOTAL_PEDIDO * (pedido.IVA_PEDIDO / 100));

    // Actualizar el carrito y el pedido en el local storage
    localStorage.setItem('lineasCompra', JSON.stringify(lineasCompra));
    localStorage.setItem('pedido', JSON.stringify(pedido));
}


async function agregarCantidad(Producto) {
    let lineasCompra = JSON.parse(localStorage.getItem('lineasCompra')) || [];
    const pedido = JSON.parse(localStorage.getItem('pedido')) || {};
    let indexProducto;
    indexProducto = lineasCompra.findIndex(item => item.ID_PRODUCTO === (Producto.id_producto));

    if (indexProducto !== -1) {
        // Si el producto ya está en el carrito, aumentar su cantidad
        lineasCompra[indexProducto].CANTIDAD += 1;
        lineasCompra[indexProducto].PRECIO_TOTAL = lineasCompra[indexProducto].CANTIDAD * Producto.precio_unitario;
    }



    // Actualizar el subtotal y el total del pedido
    pedido.SUBTOTAL_PEDIDO = lineasCompra.reduce((subtotal, item) => subtotal + (item.PRECIO_TOTAL || 0), 0);
    pedido.TOTAL_PEDIDO = pedido.SUBTOTAL_PEDIDO + pedido.SUBTOTAL_PEDIDO * (pedido.IVA_PEDIDO / 100);


    // Guardar el carrito actualizado en el local storage
    localStorage.setItem('lineasCompra', JSON.stringify(lineasCompra));
    localStorage.setItem('pedido', JSON.stringify(pedido));

}




async function agregarCantidadRepetido(Producto) {
    let lineasCompra = JSON.parse(localStorage.getItem('lineasCompra')) || [];
    const pedido = JSON.parse(localStorage.getItem('pedido')) || {};
    let indexProducto;
    // Verificar si el producto ya está en el carrito 
    indexProducto = lineasCompra.findIndex(item => item.ID_PRODUCTO === (Producto.ID_PRODUCTO));

    if (indexProducto !== -1) {
        // Si el producto ya está en el carrito, aumentar su cantidad
        //lineasCompra[indexProducto].CANTIDAD += 1;
        console.log(lineasCompra[indexProducto].CANTIDAD);
        if (lineasCompra[indexProducto].CANTIDAD == 1) {
            lineasCompra[indexProducto].PRECIO_TOTAL = lineasCompra[indexProducto].CANTIDAD * (lineasCompra[indexProducto].PRECIO_TOTAL / (lineasCompra[indexProducto].CANTIDAD));
        } else {
            lineasCompra[indexProducto].PRECIO_TOTAL = lineasCompra[indexProducto].CANTIDAD * (lineasCompra[indexProducto].PRECIO_TOTAL / (lineasCompra[indexProducto].CANTIDAD - 1));
            console.log(lineasCompra[indexProducto].PRECIO_TOTAL);
        }
    }

    console.log(pedido);

    // Actualizar el subtotal y el total del pedido
    pedido.SUBTOTAL_PEDIDO = lineasCompra.reduce((subtotal, item) => subtotal + (item.PRECIO_TOTAL || 0), 0);
    pedido.TOTAL_PEDIDO = pedido.SUBTOTAL_PEDIDO + pedido.SUBTOTAL_PEDIDO * (pedido.IVA_PEDIDO / 100);

    console.log(pedido);


    // Guardar el carrito actualizado en el local storage
    localStorage.setItem('lineasCompra', JSON.stringify(lineasCompra));
    localStorage.setItem('pedido', JSON.stringify(pedido));
}


async function eliminarCantidad(Producto) {
    let lineasCompra = JSON.parse(localStorage.getItem('lineasCompra')) || [];
    const pedido = JSON.parse(localStorage.getItem('pedido')) || {};

    // Verificar si el producto ya está en el carrito
    const indexProducto = lineasCompra.findIndex(item => item.ID_PRODUCTO === Producto.id_producto);

    if (indexProducto !== -1 && lineasCompra[indexProducto].CANTIDAD > 1) {
        // Si el producto está en el carrito y la cantidad es mayor que 1, disminuir su cantidad
        lineasCompra[indexProducto].CANTIDAD -= 1;
        lineasCompra[indexProducto].PRECIO_TOTAL = lineasCompra[indexProducto].CANTIDAD * Producto.precio_unitario;

        localStorage.setItem('lineasCompra', JSON.stringify(lineasCompra));
    } else if (indexProducto !== -1 && lineasCompra[indexProducto].CANTIDAD === 1) {
        // Si el producto está en el carrito y la cantidad es igual a 1, eliminar el producto del carrito
        borrarDelCarrito(lineasCompra[indexProducto].ID_PRODUCTO);

        let lineas2Compra = JSON.parse(localStorage.getItem('lineasCompra')) || [];
        localStorage.setItem('lineasCompra', JSON.stringify(lineas2Compra));

        eliminado = -1;
    }

    // Actualizar el subtotal y el total del pedido
    pedido.SUBTOTAL_PEDIDO = lineasCompra.reduce((subtotal, item) => subtotal + (item.PRECIO_TOTAL || 0), 0);
    pedido.TOTAL_PEDIDO = pedido.SUBTOTAL_PEDIDO + pedido.SUBTOTAL_PEDIDO * (pedido.IVA_PEDIDO / 100);

    // Guardar el carrito actualizado en el local storage

    localStorage.setItem('pedido', JSON.stringify(pedido));

}


/*MODALES*/
// JavaScript para abrir y cerrar la ventana modal
var modal = document.getElementById("myModal");
var modal2 = document.getElementById("myModal2");
var modal3 = document.getElementById("myModal3");
var btn = document.getElementById("loginBtn");
var btn2 = document.getElementById("registerBtn");
var btn3 = document.getElementById("carrito");
var span = document.getElementsByClassName("close")[0];
var span2 = document.getElementsByClassName("close2")[0];
var span3 = document.getElementsByClassName("close3")[0];
var loggedInUser = localStorage.getItem("loggedInUser"); // Usuario que ha iniciado sesión

// Función para actualizar el estado del botón
function updateButton() {
    if (loggedInUser) {
        btn.innerText = "Hello, " + loggedInUser; // Cambia el texto del botón si hay un usuario logueado
    } else {
        btn.innerText = "Log In"; // Vuelve al texto original si no hay usuario logueado
    }
}

/*PRUEBA */

////////////////////////////////////

updateButton(); // Llama a la función para actualizar el botón cuando se carga la página


btn.onclick = function () {
    if (loggedInUser) {
        localStorage.removeItem("loggedInUser"); // Elimina el usuario del almacenamiento local
        loggedInUser = null;
        updateButton(); // Actualiza el botón
        location.reload(); // Recarga la página
    } else {
        modal.style.display = "block";
    }
}

btn2.onclick = function () {
    modal2.style.display = "block";
}

btn3.onclick = function () {
    modal3.style.display = "block";
}

span.onclick = function () {
    modal.style.display = "none";
}

span2.onclick = function () {
    modal2.style.display = "none";
}

span3.onclick = function () {
    modal3.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    } else if (event.target == modal2) {
        modal2.style.display = "none";
    } else if (event.target == modal3) {
        modal3.style.display = "none";
    }
}


// JavaScript para cambiar el texto del botón al nombre del usuario y almacenar en el almacenamiento local
var form = document.getElementById("loginForm");
form.onsubmit = function (event) {
    event.preventDefault(); // Evita que el formulario se envíe
    var username = document.getElementById("username").value;
    loggedInUser = username;
    localStorage.setItem("loggedInUser", loggedInUser); // Almacena el usuario en el almacenamiento local
    updateButton(); // Actualiza el botón
    modal.style.display = "none"; // Cierra la ventana modal
}


//////////////////////////

async function register() {
    const datosregistro = {
        usuario: document.getElementById('username2').value,
        email: document.getElementById('email').value,
        contraseña: document.getElementById('password2').value
    };
    console.log(datosregistro)
    try {
        const response = await fetch('http://localhost:3000/usuario/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosregistro), // Make sure to include the 'action' property
        });
        console.log('Request payload:', JSON.stringify(datosregistro)); // Log the payload
        if (response.ok) {
            const result = await response.json();
            console.log('Usuario Creado')
        } else {
            console.error('Error al registrarse');
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

//REGISTRO//
var registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que el formulario se envíe

    // Recuperar los valores del formulario
    var usuario = document.getElementById("username2").value;
    var email = document.getElementById("correo_usuario").value;
    var contraseña = document.getElementById("password2").value;

    // Aquí puedes hacer algo con los datos, como enviarlos a un servidor para registrar al usuario

    // Por ahora, solo mostraremos los valores en la consola
    console.log("Nombre de usuario:", usuario);
    console.log("Correo electrónico:", email);
    console.log("Contraseña:", contraseña);

    // Puedes redirigir al usuario a otra página después de registrarse, por ejemplo:
    // window.location.href = "pagina_de_bienvenida.html";
});


///////////


document.addEventListener('DOMContentLoaded', async () => {
    const repository = new DataRepository();
    const service = new DataService(repository);

    if (loggedInUser) {
        localStorage.removeItem("loggedInUser"); // Elimina el usuario del almacenamiento local
        loggedInUser = null;
        updateButton(); // Actualiza el botón
    }

    //HACER QUE APAREZCAN DIRECTAMENTE LOS CAFES AL CARGAR LA PÁGINA
    const productData = await service.getProducto();
    renderMovies(productData);

    //VARIABLES
    const loadButton = document.getElementById('loadButton');
    var peliOutput = document.getElementById('peliOutput');
    const loadCategoriaMovies = document.getElementById('loadCategoriaMovies');
    const opciones = document.getElementById('opciones');
    const movieInput = document.getElementById('movieInput');
    const favOutput = document.getElementById('mostrarFavorito');
    const registerForm = document.getElementById('registerForm');


    loginForm.addEventListener('submit', async () => {
        event.preventDefault();
        await login();
    });

    registerForm.addEventListener('submit', async () => {
        event.preventDefault();
        register();
        registerForm.reset();
    });

    localStorage.setItem("lineasCompra", []);

    inicializarCarrito();

    //DOM DE CATEGORIAS
    const categoriaBtns = document.querySelectorAll('.categoria-btn');
    const productosContainer = document.querySelector('.productos');
    categoriaBtns.forEach(btn => {
        
        btn.addEventListener('click', async () => {
            const tipoCafe = btn.value;
            console.log(tipoCafe);
            try {
                let response;
                if (tipoCafe === 'none') {
                  console.log("funciono productos");
                    // Si se selecciona "none", realizar la solicitud para obtener todos los productos
                    response = await fetch(`http://localhost:3000/producto`); 
                } else {
                  console.log("funciono categoria");
                    // De lo contrario, realizar la solicitud para obtener los productos de la categoría seleccionada
                    response = await fetch(`http://localhost:3000/producto/categoria?tipo=${tipoCafe}`);
                }

                if (response.ok) {
                    const productData = await response.json();
                    console.log(productData);
    
                    //Esto limpia el contenedor antes de agregar nuevos cafes
                    peliOutputGenero.innerHTML = "";
    
                    //Esto agrega nuevos cafes al contenedor
                    productData.forEach(element => {
                        const card = crearCard(element);
                        peliOutputGenero.appendChild(card);
                    });
                } else {
                    console.error('Error al obtener productos por categoría');
                }
            } catch (error) {
                console.error('Error al obtener productos por categoría', error);
            }
        });
  }); 


    botonFinalizarCompra = document.getElementById('PayBtn');
    botonFinalizarCompra.addEventListener('click', async () => {
        if (iniciado) {
            await realizarPedido();
            location.reload(); // Recarga la página
        } else {
            alert('No se ha iniciado sesión')
        }

        //
    });
});





function renderMovies(productData) {
    const peliOutputGenero = document.getElementById('peliOutputGenero');
    peliOutputGenero.innerHTML = '';
    if (productData) {
        productData.forEach(element => {
            console.log(productData[[element]]);
            card = crearCard(element);
            peliOutputGenero.appendChild(card);
        })
    } else {
        peliOutputGenero.innerHTML = `<p>Error al cargar los datos del Movies.</p>`;
    }
}


function crearCard(productData) {
    console.log('Product Data:', productData);
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');

    const card = document.createElement('div');
    card.classList.add('card');

    const idProducto = document.createElement('p');
    idProducto.textContent = `ID Producto: ${productData.id}`;

    // Crear elementos para la tarjeta (título, descripción, imagen, fecha de lanzamiento)
    const tituloElement = document.createElement('h2');
    tituloElement.textContent = productData.nombre_producto;
    tituloElement.style.fontFamily = 'mordredBold';
    tituloElement.style.fontSize = '20px';

    const precioProducto = document.createElement('h3');
    precioProducto.textContent = productData.precio_unitario + '€';
    precioProducto.style.fontFamily = 'mordredBold';
    precioProducto.style.fontSize = '25px';

    const descripcionElement = document.createElement('p');
    descripcionElement.textContent = productData.descripcion_producto;

    const imagenElement = document.createElement('img');
    imagenElement.src = productData.imagen;
    imagenElement.alt = productData.nombre_producto;


    const buttonElementAdd = document.createElement('button');
    buttonElementAdd.textContent = 'Add to Cart';

    /*AñadirCarrito*/
    buttonElementAdd.addEventListener('click', async (event) => {
        event.stopPropagation(); // Use event instead of e
        const producto = {
            ID_PRODUCTO: productData.id_producto,
            CANTIDAD: 1,
            PRECIO_TOTAL: productData.precio_unitario, // Precio total del producto (debes obtenerlo de tu interfaz de usuario)
        };
        console.log(producto);
        await agregarAlCarrito(producto);

        let pedido = JSON.parse(localStorage.getItem('pedido')) || [];
        const divtaxes = document.getElementById('taxes');
        const divsubtotal = document.getElementById('subtotal');
        const divtotal = document.getElementById('total');
        divsubtotal.textContent = 'Subtotal: ' + pedido.SUBTOTAL_PEDIDO + '€';
        divtaxes.textContent = 'Taxes: ' + (pedido.TOTAL_PEDIDO - pedido.SUBTOTAL_PEDIDO).toFixed(2) + '€';

        console.log(yaexiste);
        if (!yaexiste) {
            const nuevoElementoCarrito = document.createElement('div');
            nuevoElementoCarrito.textContent = productData.nombre_producto;

            const nuevaImagen = document.createElement('img');
            nuevaImagen.src = productData.imagen; // Reemplaza con la ruta de la imagen que deseas agregar
            nuevaImagen.style.paddingLeft = '5px';
            nuevaImagen.style.paddingRight = '5px';
            nuevaImagen.style.height = "50%";
            nuevaImagen.style.width = "50%";
            nuevaImagen.alt = 'Descripción de la imagen'; // Reemplaza con una descripción adecuada
            nuevoElementoCarrito.appendChild(nuevaImagen);

            const divCantidad = document.createElement('div');
            divCantidad.textContent = 'Quantity: 1'; // Puedes establecer un valor inicial aquí
            divCantidad.id = productData.id_producto;
            nuevoElementoCarrito.appendChild(divCantidad);

            const buttonRestarCantidad = document.createElement('button');
            buttonRestarCantidad.style.backgroundImage = "url('./img/-.png')";
            buttonRestarCantidad.style.backgroundSize = "cover";
            buttonRestarCantidad.style.backgroundColor = "transparent";
            buttonRestarCantidad.style.border = "none";
            buttonRestarCantidad.style.cursor = "pointer";
            buttonRestarCantidad.style.height = '20px';
            buttonRestarCantidad.style.width = '20px';
            buttonRestarCantidad.style.paddingLeft = '5px';
            buttonRestarCantidad.style.paddingRight = '5px';
            buttonRestarCantidad.setAttribute('data-card-id', productData.id_producto);
            nuevoElementoCarrito.appendChild(buttonRestarCantidad);



            const buttonSumarCantidad = document.createElement('button');
            buttonSumarCantidad.style.backgroundImage = "url('./img/+.png')";
            buttonSumarCantidad.style.backgroundSize = "cover";
            buttonSumarCantidad.style.backgroundColor = "transparent";
            buttonSumarCantidad.style.border = "none";
            buttonSumarCantidad.style.cursor = "pointer";
            buttonSumarCantidad.style.height = '20px';
            buttonSumarCantidad.style.width = '20px';
            buttonSumarCantidad.style.margin = "10px";
            buttonSumarCantidad.setAttribute('data-card-id', productData.id_producto);
            nuevoElementoCarrito.appendChild(buttonSumarCantidad);

            const listaCarrito = document.getElementById('listaCarrito');
            listaCarrito.appendChild(nuevoElementoCarrito);

            const modal = document.getElementById('myModal3');
            modal.style.display = 'block';
            console.log(nuevoElementoCarrito);


            buttonRestarCantidad.addEventListener("click", function () {
                eliminarCantidad(productData);
                if (eliminado == -1) {
                    nuevoElementoCarrito.parentNode.removeChild(nuevoElementoCarrito);

                    const divtaxes = document.getElementById('taxes');
                    const divsubtotal = document.getElementById('subtotal');
                    const divtotal = document.getElementById('total');
                    divtotal.textContent = 'Total: ' + 0 + '€';
                    divsubtotal.textContent = 'Subtotal: ' + 0 + '€';
                    divtaxes.textContent = 'Taxes: ' + 0 + '€';

                    pedido.SUBTOTAL_PEDIDO = 0;
                    pedido.TOTAL_PEDIDO = 0;

                    // Actualizar el carrito y el pedido en el local storage
                    localStorage.setItem('pedido', JSON.stringify(pedido));
                    eliminado = 0;


                } else {

                    let lineasCompra = JSON.parse(localStorage.getItem('lineasCompra')) || [];
                    const indexProducto = lineasCompra.findIndex(item => item.ID_PRODUCTO === (productData.id_producto));
                    divCantidad.textContent = 'Quantity: ' + lineasCompra[indexProducto].CANTIDAD;

                    let pedido = JSON.parse(localStorage.getItem('pedido')) || [];
                    const divtaxes = document.getElementById('taxes');
                    const divsubtotal = document.getElementById('subtotal');
                    const divtotal = document.getElementById('total');
                    divtotal.textContent = 'Total: ' + pedido.TOTAL_PEDIDO.toFixed(2) + '€';
                    divsubtotal.textContent = 'Subtotal: ' + pedido.SUBTOTAL_PEDIDO + '€';
                    divtaxes.textContent = 'Taxes: ' + (pedido.TOTAL_PEDIDO - pedido.SUBTOTAL_PEDIDO).toFixed(2) + '€';
                }
            });

            buttonSumarCantidad.addEventListener("click", function () {
                agregarCantidad(productData);

                let lineasCompra = JSON.parse(localStorage.getItem('lineasCompra')) || [];
                const indexProducto = lineasCompra.findIndex(item => item.ID_PRODUCTO === (productData.id_producto));
                divCantidad.textContent = 'Quantity: ' + lineasCompra[indexProducto].CANTIDAD;


                let pedido = JSON.parse(localStorage.getItem('pedido')) || [];
                const divtotal = document.getElementById('total');
                const divtaxes = document.getElementById('taxes');
                const divsubtotal = document.getElementById('subtotal');
                divtotal.textContent = 'Total: ' + pedido.TOTAL_PEDIDO.toFixed(2) + '€';
                divsubtotal.textContent = 'Subtotal: ' + pedido.SUBTOTAL_PEDIDO + '€';
                divtaxes.textContent = 'Taxes: ' + (pedido.TOTAL_PEDIDO - pedido.SUBTOTAL_PEDIDO).toFixed(2) + '€';
            });


        }
        else {
            agregarCantidadRepetido(producto);

            let lineasCompra = JSON.parse(localStorage.getItem('lineasCompra')) || [];
            const indexProducto = lineasCompra.findIndex(item => item.ID_PRODUCTO === (producto.ID_PRODUCTO));


            const divCantidad = document.getElementById(producto.ID_PRODUCTO);
            divCantidad.textContent = 'Quantity: ' + lineasCompra[indexProducto].CANTIDAD;


            const modal = document.getElementById('myModal3');
            modal.style.display = 'block';
        }

        //let pedido = JSON.parse(localStorage.getItem('pedido')) || [];
        /*const divtotal = document.getElementById('total');*/
        divtotal.textContent = 'Total: ' + pedido.TOTAL_PEDIDO + '€';
        yaexiste = false;
    });

    buttonElementAdd.style.backgroundColor = '#bf6428';
    buttonElementAdd.style.color = 'white';
    buttonElementAdd.style.border = 'none';
    buttonElementAdd.style.padding = '5px 10px';
    buttonElementAdd.style.fontSize = '14px';
    buttonElementAdd.style.borderRadius = '5px';
    buttonElementAdd.style.marginTop = '10px'; // Margen superior de 10px
    buttonElementAdd.style.marginBottom = '10px'; // Margen inferior de 10px
    buttonElementAdd.style.cursor = 'pointer';
    buttonElementAdd.style.padding = '7px'; // Padding de 5px en todos los lados

    // Agrega evento al pasar el ratón por encima
    buttonElementAdd.addEventListener("mouseover", function () {
        buttonElementAdd.style.backgroundColor = "#e87000";
    });

    // Agrega evento al quitar el ratón de encima
    buttonElementAdd.addEventListener("mouseout", function () {
        buttonElementAdd.style.backgroundColor = "#bf6428";
    });


    card.addEventListener('click', () => {
        e.stopPropagation();
        createModalForCard(card, productData);
    });

    // Agregar los elementos a la tarjeta
    card.appendChild(imagenElement);
    card.appendChild(idProducto);
    card.appendChild(tituloElement);
    card.appendChild(precioProducto);
    card.appendChild(buttonElementAdd);
    createModalForCard(card, productData);
    cardContainer.appendChild(card);

    cardContainer.addEventListener('click', () => {
        createModalForCard(card, productData);
    });

    return cardContainer;
}

function createModalForCard(card, productData) {
    // Crear el modal
    const modal = document.createElement('div');
    modal.classList.add('modal');

    // Crear el contenido del modal
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const closeButton = document.createElement('span');
    closeButton.classList.add('close');
    closeButton.textContent = 'X';
    modalContent.appendChild(closeButton);

    // Agregar el título de la película al modal
    const modalTitle = document.createElement('h2');
    modalTitle.textContent = productData.nombre_producto;
    modalContent.appendChild(modalTitle);

    const modalTrailerWrapper = document.createElement('div');
    modalTrailerWrapper.style.position = 'relative';
    modalContent.appendChild(modalTrailerWrapper);

    const trailerIframe = document.createElement('img');
    trailerIframe.src = productData.imagen;
    trailerIframe.style.height= "300px";
    trailerIframe.style.width= "300px";
    modalTrailerWrapper.appendChild(trailerIframe);

    const modalDescription = document.createElement('p');
    modalDescription.textContent = productData.descripcion_producto;
    modalContent.appendChild(modalDescription);

    // Agregar el contenido al modal
    modal.appendChild(modalContent);

    // Agregar el modal al cuerpo del documento
    document.body.appendChild(modal);

    // Mostrar el modal cuando se hace clic en la tarjeta
    card.addEventListener('click', (event) => {
        event.stopPropagation();
        modal.style.display = 'block';
    });

    // Cerrar el modal cuando se hace clic en el botón de cerrar o fuera del modal
    modal.addEventListener('click', (event) => {
        if (event.target === modal || event.target.classList.contains('close')) {
            modal.style.display = 'none';
        }
    });
}

//////
function toggleOpacity() {
    var element = document.getElementById('buttons');
    // Revisamos la opacidad 
    if (element.style.opacity == 1) {
        // Si la opacidad es 1, la ponemos a 0
        element.style.opacity = 0;
    } else {
        // Si la opacidad no es 1, la ponemos a 1
        element.style.opacity = 1;
    }
}
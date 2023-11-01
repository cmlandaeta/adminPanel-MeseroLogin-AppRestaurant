const user = JSON.parse(localStorage.getItem("usuario"));
//console.log(user);
const btnGuardarCliente = document.querySelector("#guardar-cliente");

const url = "http://localhost:3000/menu";
const pedido = "http://localhost:3000/clientes";

// estructura para guardar

let cliente = {
  id: "",
  mesero: "",
  mesa: "",
  hora: "",
  pedido: [],
};

const categorias = {
  1: "Pizzas",
  2: "Postres",
  3: "Jugos",
  4: "Comida",
  5: "Cafe",
  6: "Bebidas",
};

// Cierre de Sesion y Validacion de Usuario en el Storage
if (!user) {
  //caso de que el usuario no este en LS lo devuelve a la pagina principal
  window.location.href = "../login/index.html";
} else {
  const usuario = document.querySelector("#usuario");
  usuario.textContent = `Bienvenido, ${user}`;
  const cerrarBtn = document.querySelector("#cerrar-btn");
  cerrarBtn.addEventListener("click", async (e) => {
    localStorage.removeItem("user");
    window.location.href = "../login/index.html";
  });
}

//Eventos ------
//Llama la lista de clientes atendido segun mesero loguedo
document.addEventListener("DOMContentLoaded", () => {
  listarClientedeMesero();
});

btnGuardarCliente.addEventListener("click", guardarCliente);

// Funciones ------

function guardarCliente() {
  const mesa = document.querySelector("#mesa").value;
  const hora = document.querySelector("#hora").value;

  camposVacios = [mesa, hora].some((campo) => campo === "");

  if (camposVacios) {
    //si los campos estan vacios
    const existeAlerta = document.querySelector(".invalid-feedback");

    if (!existeAlerta) {
      const alerta = document.createElement("div");
      alerta.classList.add("text-center", "text-danger");
      alerta.textContent = "Los Campos no Deben estar vacios";
      document.querySelector(".modal-body form").appendChild(alerta);

      setTimeout(() => {
        alerta.remove();
      }, 3000);
    }
  } else {
    //en caso de tener los campos llenos

    //console.log("campos llenos")

    cliente = { ...cliente, mesa, hora }; // aca se guarda temporalmente el pedido  actual en el objeto cliente para luego pasarlo al json server o mongo

    const modalForm = document.querySelector("#formulario");
    const modal = bootstrap.Modal.getInstance(modalForm);
    modal.hide();

    mostrarSecciones();
    obtenerMenu();
  }
}

function mostrarSecciones() {
  const secciones = document.querySelectorAll(".d-none");

  // console.log(secciones)

  secciones.forEach((seccion) => seccion.classList.remove("d-none"));
}

function obtenerMenu() {
  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => mostrarMenu(resultado))
    .catch((error) => console.log(error));

  function mostrarMenu(menu) {
    const contenido = document.querySelector("#menu .contenido");

    menu.forEach((pos) => {
      const fila = document.createElement("div");
      fila.classList.add("row", "border-top");

      const nombre = document.createElement("div");
      nombre.textContent = pos.nombre;
      nombre.classList.add("col-md-3", "py-3");

      const precio = document.createElement("div");
      precio.textContent = "$" + pos.precio;
      precio.classList.add("col-md-3", "py-3");

      const categoria = document.createElement("div");
      categoria.textContent = categorias[pos.categoria]; // llamo el objeto categoria y le paso la categoria del json
      categoria.classList.add("col-md-3", "py-3");

      const inputCantidad = document.createElement("input");
      (inputCantidad.type = "number"), (inputCantidad.min = 0);
      inputCantidad.value = 0;
      inputCantidad.id = `producto-${pos.id}`; // es usado el const producto eliminado
      inputCantidad.classList.add("col-1");
      inputCantidad.onchange = function () {
        nombre.classList.add("col-md-4");
        const cantidad = parseInt(inputCantidad.value); // se agregar cantidad al arreglo
        //console.log({...pos,cantidad})

        agregarOrden({ ...pos, cantidad }); // agrego cantidad como push al arreglo
      };

      const agregar = document.createElement("div");
      agregar.classList.add("col-md-1", "py-3", "inputCant");
      agregar.appendChild(inputCantidad);

      fila.appendChild(nombre);
      fila.appendChild(precio);
      fila.appendChild(categoria);
      fila.appendChild(inputCantidad);
      fila.appendChild(agregar);

      contenido.appendChild(fila);
    });
  }
}

function agregarOrden(producto) {
  let { pedido } = cliente;

  //console.log(pedido);

  if (producto.cantidad > 0) {
    // validar que el producto exista
    if (pedido.some((item) => item.id === producto.id)) {
      // haya prodcuto

      const pedidoActualizado = pedido.map((i) => {
        if (i.id === producto.id) {
          i.cantidad = producto.cantidad;
        }
        return i;
      });
      cliente.pedido = [...pedidoActualizado];
    } else {
      // caso de que no exista el producto
      // agregamos
      cliente.pedido = [...pedido, producto];
      console.log(cliente);
    }
  } else {
    //caso cantidad es igual 0

    const resultado = pedido.filter((item) => item.id !== producto.id);
    cliente.pedido = resultado;
  }

  limpiarHTML();

  if (cliente.pedido.length) {
    actualizarResumen();
  } else {
    mensajePedidoVacio();
  }
}

function actualizarResumen() {
  const contenido = document.querySelector("#resumen .contenido");
  const resumen = document.createElement("div");
  resumen.classList.add("col-md-4", "card", "shadow", "py-5", "px-3");

  // mostrar la mesero
  const mesero = document.createElement("p");
  mesero.textContent = "Mesero: ";
  mesero.classList.add("fw-bold", "text-danger");

  const meseroCliente = document.createElement("span");
  meseroCliente.textContent = user;
  mesero.appendChild(meseroCliente);

  // mostrar la mesa
  const mesa = document.createElement("p");
  mesa.textContent = "Mesa: ";
  mesa.classList.add("fw-bold");

  const mesaCliente = document.createElement("span");
  mesaCliente.textContent = cliente.mesa;
  mesa.appendChild(mesaCliente);

  // mostrar hora

  const hora = document.createElement("p");
  hora.textContent = "Hora ";
  hora.classList.add("fw-bold");

  const horaCliente = document.createElement("span");
  horaCliente.textContent = cliente.hora;
  hora.appendChild(horaCliente);

  // mostrar los item del menu selecionado

  const heading = document.createElement("h3");
  heading.textContent = "Pedido ";
  heading.classList.add("my-4");

  const grupo = document.createElement("ul");
  grupo.classList.add("list-group");

  // producto pedido

  const { pedido } = cliente;

  pedido.forEach((item) => {
    const { nombre, cantidad, precio, id } = item;

    const lista = document.createElement("li");
    lista.classList.add("list-group-item");

    const nombreP = document.createElement("h4");
    nombreP.textContent = nombre;
    nombreP.classList.add("text-center", "my-4");

    const cantidadP = document.createElement("p");
    cantidadP.classList.add("fw-bold");
    cantidadP.textContent = "Cantidad: ";

    const cantidadValor = document.createElement("span");
    cantidadValor.textContent = cantidad;

    const precioP = document.createElement("p");
    precioP.classList.add("fw-bold");
    precioP.textContent = "Precio: ";

    const precioValor = document.createElement("span");
    precioValor.textContent = `$${precio}`;

    const subtotalP = document.createElement("span");
    subtotalP.classList.add("fw-bold");
    subtotalP.textContent = "Subtotal: ";

    const subtotalPValor = document.createElement("span");
    subtotalPValor.textContent = calcularSubtotal(item);

    //boton eliminar
    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("btn", "btn-danger");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.onclick = function () {
      eliminarProducto(id);
    };

    cantidadP.appendChild(cantidadValor);
    precioP.appendChild(precioValor);
    subtotalP.appendChild(subtotalPValor);

    lista.appendChild(nombreP);
    lista.appendChild(cantidadP);
    lista.appendChild(precioP);
    lista.appendChild(subtotalP);
    lista.appendChild(btnEliminar);

    grupo.appendChild(lista);
  });
  resumen.appendChild(mesero);
  resumen.appendChild(mesa);
  resumen.appendChild(hora);
  resumen.appendChild(heading);
  resumen.appendChild(grupo);

  contenido.appendChild(resumen);

  //mostrar la calculadora de propina

  formularioPropina();
}

function formularioPropina() {
  const contenido = document.querySelector("#resumen .contenido");
  const formulario = document.createElement("div");
  formulario.classList.add("col-md-4", "formulario");

  const heading = document.querySelector("h3");
  heading.classList.add("my-4");
  heading.textContent = "Propina";

  // propina 5%

  const op5 = document.createElement("input");
  op5.type = "radio";
  op5.name = "propina";
  op5.value = "5";
  op5.classList.add("form-check-input");
  op5.onclick = calcularPropina;

  const labelop5 = document.createElement("label");
  labelop5.textContent = "5% ";
  labelop5.classList.add("form-check-label");

  // propina 10%

  const op10 = document.createElement("input");
  op10.type = "radio";
  op10.name = "propina";
  op10.value = "10";
  op10.classList.add("form-check-input");
  op10.onclick = calcularPropina;

  const labelop10 = document.createElement("label");
  labelop10.textContent = "10%";
  labelop10.classList.add("form-check-label");

  formulario.appendChild(heading);
  formulario.appendChild(op5);
  formulario.appendChild(labelop5);
  formulario.appendChild(op10);
  formulario.appendChild(labelop10);

  contenido.appendChild(formulario);
}

function calcularPropina() {
  //console.log('entre')

  const radioSeleccionado = document.querySelector(
    '[name="propina"]:checked'
  ).value;
  //console.log(radioSeleccionado)

  const { pedido } = cliente;
  let subtotal = 0;

  pedido.forEach((i) => {
    subtotal += i.cantidad * i.precio;
  });

  const divTotales = document.createElement("div");
  divTotales.classList.add("total-pagar");

  //propina
  const propina = (subtotal * parseInt(radioSeleccionado)) / 100;
  const iva = subtotal * 0.16;
  const total = propina + subtotal + iva;

  // subtotal
  const subtotalP = document.createElement("p");
  subtotalP.textContent = "Subtotal Pedido: ";
  subtotalP.classList.add("fw-bold", "fs-3", "mt-5");

  const subtotalPValor = document.createElement("span");
  subtotalPValor.textContent = `$${subtotal}`;
  subtotalP.appendChild(subtotalPValor);

  // Iva
  const ivaP = document.createElement("p");
  ivaP.textContent = "IVA 16%: ";

  const ivaValor = document.createElement("span");
  ivaValor.textContent = `$${iva}`;
  ivaP.appendChild(ivaValor);

  // propina

  const propinaP = document.createElement("p");
  propinaP.textContent = "Propina: ";

  const propinaValor = document.createElement("span");
  propinaValor.textContent = `$${propina}`;
  propinaP.appendChild(propinaValor);

  const totalP = document.createElement("p");
  totalP.textContent = "Total a pagar: ";

  const totalValor = document.createElement("span");
  totalValor.textContent = `$${total}`;
  totalP.appendChild(totalValor);

  const btnEnviarCuenta = document.createElement("button");
  btnEnviarCuenta.classList.add("btn", "btn-info");
  btnEnviarCuenta.textContent = "Enviar Cuenta";
  btnEnviarCuenta.onclick = function () {
    enviarCuenta();
  };

  const totalPagarDiv = document.querySelector(".total-pagar");
  if (totalPagarDiv) {
    totalPagarDiv.remove();
  }

  divTotales.appendChild(subtotalP);
  divTotales.appendChild(ivaP);
  divTotales.appendChild(propinaP);
  divTotales.appendChild(totalP);
  divTotales.appendChild(btnEnviarCuenta);

  const formulario = document.querySelector(".formulario");
  formulario.appendChild(divTotales);
}

function calcularSubtotal(p) {
  const { cantidad, precio } = p;
  return `$${cantidad * precio}`;
}

function eliminarProducto(id) {
  const { pedido } = cliente;
  cliente.pedido = pedido.filter((i) => i.id !== id);

  //console.log(cliente.pedido)

  limpiarHTML();

  //console.log(cliente.pedido.length)

  if (cliente.pedido.length) {
    actualizarResumen();
  } else {
    //console.log('pedido vacio')

    mensajePedidoVacio();
  }
  // ahora como eliminamos el producto debemos actualizar la cantidad a cero

  const prodcutoEliminado = `#producto-${id}`; // se pasa la variable ${id} junto a p en el html
  const inputEliminado = document.querySelector(prodcutoEliminado);
  inputEliminado.value = 0;
}

function mensajePedidoVacio() {
  const contenido = document.querySelector("#resumen .contenido");
  const texto = document.createElement("p");
  texto.classList.add("text-center");
  texto.textContent = "Agrega Productos al Pedido";
  contenido.appendChild(texto);
}

function limpiarHTML() {
  const contenido = document.querySelector("#resumen .contenido");
  while (contenido.firstChild) {
    contenido.removeChild(contenido.firstChild);
  }
}

async function enviarCuenta() {
  try {
    await fetch(pedido, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ ...cliente, mesero: user, id: "" }),
    });

    window.location.href = "./index.html";
  } catch (error) {
    console.log(error);
  }
}

async function listarClientedeMesero() {
  const contenido2 = document.querySelector("#resumen2");
  const listaDePedidos = document.querySelector("#listado-Pedidos");

  try {
    const respuesta = await fetch(pedido, {
      method: "GET",
    });

    const list = await respuesta.json(); // se pasa a Json la consulta del fecth
    const clientList = list.filter((lista) => lista.mesero === user);

    //console.log(clientList);

    clientList.forEach((lista) => {
      const { mesero, mesa, hora, pedido } = lista;
      let Pedidos = "";

      const listaPedidos = pedido;

      listaPedidos.forEach((element) => {
        Pedidos += element.cantidad + " " + element.nombre + ",";
      });

      //console.log(listaPedidos);

      const fila = document.createElement("tr");

      fila.innerHTML += `     <td class="py-4 px-6 border-b border-gray-200 whitespace-no-wrap"> 
                                <p class="text-red-700 font-bold text-lg font-bold text-sm leading-5">${mesero}</>
                            </td>
                            <td class="py-4 px-6 border-b border-gray-200 whitespace-no-wrap">
                                <p class="text-gray-700 font-medium text-lg font-bold text-sm leading-5">${mesa}</>
                            </td>
                            <td class="py-4 px-6 border-b border-gray-200 whitespace-no-wrap">
                                <p class="text-gray-700 font-medium text-lg font-bold text-sm leading-5">${hora}</>
                            </td>
                            <td class="py-4 px-6 border-b border-gray-200 whitespace-no-wrap">
                          
                            <p class="text-gray-700 font-medium text-lg font-bold text-sm leading-5">${Pedidos}</>
                         
                            
                        </td>
                            `;

      listaDePedidos.appendChild(fila);

      // mostrar los item del menu selecionado
    });
  } catch (error) {
    console.log(error);
  }
}

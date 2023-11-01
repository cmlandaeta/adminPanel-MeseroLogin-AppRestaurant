import { obternerProductos, eliminarProducto } from "./api.js";
const user = JSON.parse(localStorage.getItem("usuario"));
const listado = document.querySelector("#listado-Productos");

// Cierre de Session y Validacion de Usuario en el Storage

if (user !== "Admin") {
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

//eventos

document.addEventListener("DOMContentLoaded", mostrarProductos);

listado.addEventListener("click", confirmarEliminar);

//funciones

async function mostrarProductos() {
  // uso async xq en la funcion exportada va async tambien
  const productos = await obternerProductos();

  //console.log(productos);

  productos.forEach((i) => {
    const { nombre, precio, categoria, id } = i;

    const fila = document.createElement("tr");

    fila.innerHTML += `    <td class="py-4 px-6 border-b border-gray-200 whitespace-no-wrap"> 
                                <p class="text-gray-700 font-medium text-lg font-bold text-sm leading-5">${nombre}</>
                            </td>
                            <td class="py-4 px-6 border-b border-gray-200 whitespace-no-wrap">
                                <p class="text-gray-700 font-medium text-lg font-bold text-sm leading-5">${precio}</>
                            </td>
                            <td class="py-4 px-6 border-b border-gray-200 whitespace-no-wrap">
                                <p class="text-gray-700 font-medium text-lg font-bold text-sm leading-5">${categoria}</>
                            </td>
                            <td class="py-4 px-6 border-b border-gray-200 whitespace-no-wrap">
                            <a href="editar-producto.html?id=${id}" class="text-teal-600 mr-5 hover:text-teal-900">Editar</a>
                            <a href="#" data-producto="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                            </td>`;

    listado.appendChild(fila);
  });
}

async function confirmarEliminar(e) {
  if (e.target.classList.contains("eliminar")) {
    //veo que trae el evento con e y target para aupuntar la classe que contiene eliminar
    const prodcutoId = parseInt(e.target.dataset.producto);

    const confirmar = confirm("Quieres Eliminar este Producto?");

    if (confirmar) {
      await eliminarProducto(prodcutoId);
    }
  }
}

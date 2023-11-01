const url = "http://localhost:3000/menu";
const users = "http://localhost:3000/users";

export const nuevoProducto = async (producto) => {
  try {
    await fetch(url, {
      method: "POST",
      body: JSON.stringify(producto), // aqui en el body debo enviar JSON
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const obternerProductos = async () => {
  try {
    const resultado = await fetch(url);
    const productos = await resultado.json();
    return productos;
  } catch (error) {
    console.log(error);
  }
};

export const obternerProducto = async (id) => {
  try {
    const resultado = await fetch(`${url}/${id}`);
    const producto = resultado.json();
    return producto;
  } catch (error) {}
};

export const editarProducto = async (producto) => {
  try {
    await fetch(`${url}/${producto.id}`, {
      method: "PUT", // put actualiza por id por id
      body: JSON.stringify(producto),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const eliminarProducto = async (id) => {
  try {
    await fetch(`${url}/${id}`, {
      method: "DELETE",
    });
  } catch (error) {}
};

//////// USuarios

export const nuevoUsuario = async (user) => {
  try {
    await fetch(users, {
      method: "POST",
      body: JSON.stringify(user), // aqui en el body debo enviar JSON
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const obternerUsuarios = async () => {
  try {
    const resultado = await fetch(users);
    const usuarios = await resultado.json();
    return usuarios;
  } catch (error) {
    console.log(error);
  }
};

export const obternerUsuario = async (id) => {
  try {
    const resultado = await fetch(`${users}/${id}`);
    const producto = resultado.json();
    return producto;
  } catch (error) {}
};

export const editarUsuario = async (usuario) => {
  try {
    await fetch(`${users}/${usuario.id}`, {
      method: "PUT", // put actualiza por id por id
      body: JSON.stringify(usuario),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const eliminarUsuario = async (id) => {
  try {
    await fetch(`${users}/${id}`, {
      method: "DELETE",
    });
  } catch (error) {}
};

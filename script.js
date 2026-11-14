"use strict";

// Catálogo inicial: cada objeto representa un curso disponible.
const cursos = [
  { id: "html", nombre: "HTML y fundamentos web", inicial: "H", descripcion: "Aprende a organizar el contenido de una página con etiquetas semánticas y formularios.", nivel: "Principiante", duracion: "4 semanas", temario: "Estructura de un documento, etiquetas semánticas, enlaces, imágenes, tablas y formularios." },
  { id: "css", nombre: "Diseño de páginas con CSS", inicial: "C", descripcion: "Construye interfaces ordenadas y adaptables usando estilos, Flexbox y Grid.", nivel: "Principiante", duracion: "5 semanas", temario: "Selectores, colores, tipografía, modelo de caja, Flexbox, Grid y diseño responsivo." },
  { id: "javascript", nombre: "Programación con JavaScript", inicial: "JS", descripcion: "Agrega interacción a las páginas mediante variables, funciones, eventos y el DOM.", nivel: "Básico", duracion: "6 semanas", temario: "Variables, tipos de datos, operadores, condiciones, funciones, arreglos, eventos y manipulación del DOM." }
];

// Los registros se mantienen en memoria mientras la página está abierta.
const inscripciones = [];

// Referencias a los elementos que JavaScript debe actualizar.
const listaCursos = document.querySelector("#listaCursos");
const buscador = document.querySelector("#buscador");
const limpiarBusqueda = document.querySelector("#limpiarBusqueda");
const formulario = document.querySelector("#formulario");
const campoNombre = document.querySelector("#nombre");
const campoCorreo = document.querySelector("#correo");
const campoCurso = document.querySelector("#curso");
const mensaje = document.querySelector("#mensaje");
const listaInscripciones = document.querySelector("#listaInscripciones");
const contadorCursos = document.querySelector("#contadorCursos");
const contadorRegistros = document.querySelector("#contadorRegistros");

/** Normaliza texto para que la búsqueda no dependa de mayúsculas o tildes. */
function normalizarTexto(texto) {
  return texto.toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

/** Dibuja las tarjetas que coinciden con el filtro recibido. */
function mostrarCursos(cursosParaMostrar) {
  listaCursos.replaceChildren();
  contadorCursos.textContent = `${cursosParaMostrar.length} ${cursosParaMostrar.length === 1 ? "curso disponible" : "cursos disponibles"}`;
  if (cursosParaMostrar.length === 0) {
    const aviso = document.createElement("p");
    aviso.className = "estado-vacio";
    aviso.textContent = "No encontramos cursos con ese término. Intenta con HTML, CSS o JavaScript.";
    listaCursos.append(aviso);
    return;
  }

  cursosParaMostrar.forEach((curso) => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta-curso";
    const icono = document.createElement("div");
    icono.className = "icono-curso";
    icono.setAttribute("aria-hidden", "true");
    icono.textContent = curso.inicial;
    const titulo = document.createElement("h3");
    titulo.textContent = curso.nombre;
    const descripcion = document.createElement("p");
    descripcion.textContent = curso.descripcion;
    const etiquetas = document.createElement("ul");
    etiquetas.className = "etiquetas-curso";
    [curso.nivel, curso.duracion].forEach((dato) => {
      const etiqueta = document.createElement("li");
      etiqueta.textContent = dato;
      etiquetas.append(etiqueta);
    });
    const detalle = document.createElement("div");
    detalle.className = "detalle-curso";
    detalle.hidden = true;
    const textoDetalle = document.createElement("p");
    textoDetalle.textContent = `Temario: ${curso.temario}`;
    detalle.append(textoDetalle);
    const acciones = document.createElement("div");
    acciones.className = "acciones-curso";
    const botonDetalle = document.createElement("button");
    botonDetalle.className = "boton boton-secundario";
    botonDetalle.type = "button";
    botonDetalle.textContent = "Ver temario";
    botonDetalle.setAttribute("aria-expanded", "false");
    botonDetalle.addEventListener("click", () => {
      const estabaAbierto = !detalle.hidden;
      detalle.hidden = estabaAbierto;
      botonDetalle.textContent = estabaAbierto ? "Ver temario" : "Ocultar temario";
      botonDetalle.setAttribute("aria-expanded", String(!estabaAbierto));
    });
    const botonElegir = document.createElement("button");
    botonElegir.className = "boton boton-principal";
    botonElegir.type = "button";
    botonElegir.textContent = "Elegir este curso";
    botonElegir.addEventListener("click", () => seleccionarCurso(curso.nombre));
    acciones.append(botonDetalle, botonElegir);
    tarjeta.append(icono, titulo, descripcion, etiquetas, detalle, acciones);
    listaCursos.append(tarjeta);
  });
}

/** Selecciona el curso y lleva al formulario de inscripción. */
function seleccionarCurso(nombreCurso) {
  campoCurso.value = nombreCurso;
  document.querySelector("#inscripcion").scrollIntoView({ behavior: "smooth", block: "start" });
  campoNombre.focus({ preventScroll: true });
  mostrarMensaje(`Seleccionaste ${nombreCurso}. Completa tus datos para continuar.`, "exito");
}

/** Muestra mensajes al usuario mediante textContent. */
function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = `mensaje ${tipo}`;
}

/** Actualiza la lista de inscripciones y el contador. */
function mostrarInscripciones() {
  listaInscripciones.replaceChildren();
  contadorRegistros.textContent = `${inscripciones.length} ${inscripciones.length === 1 ? "registro" : "registros"}`;
  if (inscripciones.length === 0) {
    const estado = document.createElement("p");
    estado.className = "estado-vacio";
    estado.textContent = "Todavía no hay inscripciones registradas.";
    listaInscripciones.append(estado);
    return;
  }
  inscripciones.forEach((inscripcion) => {
    const registro = document.createElement("article");
    registro.className = "registro";
    const datos = document.createElement("div");
    const nombre = document.createElement("strong");
    nombre.textContent = inscripcion.nombre;
    const detalle = document.createElement("small");
    detalle.textContent = `${inscripcion.correo} · ${inscripcion.curso}`;
    datos.append(nombre, detalle);
    const botonEliminar = document.createElement("button");
    botonEliminar.className = "boton boton-secundario";
    botonEliminar.type = "button";
    botonEliminar.textContent = "Eliminar registro";
    botonEliminar.setAttribute("aria-label", `Eliminar inscripción de ${inscripcion.nombre}`);
    botonEliminar.addEventListener("click", () => eliminarInscripcion(inscripcion.id));
    registro.append(datos, botonEliminar);
    listaInscripciones.append(registro);
  });
}

/** Elimina un registro del arreglo y actualiza el DOM. */
function eliminarInscripcion(idInscripcion) {
  const indice = inscripciones.findIndex((registro) => registro.id === idInscripcion);
  if (indice === -1) return;
  const [registroEliminado] = inscripciones.splice(indice, 1);
  mostrarInscripciones();
  mostrarMensaje(`Se eliminó la inscripción de ${registroEliminado.nombre}.`, "exito");
}

/** Comprueba los datos y agrega una inscripción de demostración. */
function registrarInscripcion(evento) {
  evento.preventDefault();
  if (!formulario.checkValidity()) {
    formulario.reportValidity();
    mostrarMensaje("Revisa los campos señalados antes de registrar la inscripción.", "error");
    return;
  }
  const nombre = campoNombre.value.trim().replace(/\s+/g, " ");
  const correo = campoCorreo.value.trim();
  const curso = campoCurso.value;
  if (nombre.length < 3) {
    campoNombre.setAttribute("aria-invalid", "true");
    campoNombre.focus();
    mostrarMensaje("El nombre debe tener al menos 3 caracteres.", "error");
    return;
  }
  if (!cursos.some((cursoDisponible) => cursoDisponible.nombre === curso)) {
    mostrarMensaje("Selecciona uno de los cursos disponibles.", "error");
    campoCurso.focus();
    return;
  }
  campoNombre.removeAttribute("aria-invalid");
  campoCorreo.removeAttribute("aria-invalid");
  campoCurso.removeAttribute("aria-invalid");
  inscripciones.push({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, nombre, correo, curso });
  mostrarInscripciones();
  formulario.reset();
  mostrarMensaje(`¡Inscripción registrada! ${nombre}, quedaste inscrito(a) en ${curso}.`, "exito");
}

buscador.addEventListener("input", () => {
  const termino = normalizarTexto(buscador.value);
  const resultados = cursos.filter((curso) => normalizarTexto(`${curso.nombre} ${curso.descripcion} ${curso.temario}`).includes(termino));
  mostrarCursos(resultados);
});
limpiarBusqueda.addEventListener("click", () => {
  buscador.value = "";
  mostrarCursos(cursos);
  buscador.focus();
});
formulario.addEventListener("submit", registrarInscripcion);
formulario.addEventListener("reset", () => {
  campoNombre.removeAttribute("aria-invalid");
  campoCorreo.removeAttribute("aria-invalid");
  campoCurso.removeAttribute("aria-invalid");
  mostrarMensaje("", "");
});

// Renderiza el catálogo y el estado inicial de la lista al abrir la página.
mostrarCursos(cursos);
mostrarInscripciones();

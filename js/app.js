// Variables
const carrito = document.querySelector('#carrito')
const contenedorCarrito = document.querySelector('#lista-carrito tbody')
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito')
const listaCursos = document.querySelector('#lista-cursos')
let articulosCarrito = []

cargarEventListener();

function cargarEventListener() {
    // Cuando agregas un curso presionando "Agregar al carrito"
    listaCursos.addEventListener('click', agregarCurso)

    // Elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso)

    // Muestra los cursos de Local Storage
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse( localStorage.getItem('carrito') ) || []

        carritoHTML()
    })

    // Vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = [] // reseteamos el arreglo

        limpiarHTML() // eliminamos todo el HTML
    })
}


// Funciones
function agregarCurso(e) {
    e.preventDefault()

    if( e.target.classList.contains('agregar-carrito') ) {
        // console.log('Agregando al carrito');
        const cursoSeleccionado = e.target.parentElement.parentElement
        leerDatosCurso(cursoSeleccionado)

    }
}

// Elimina un curso del carrito
function eliminarCurso(e) {
    if( e.target.classList.contains('borrar-curso') ) {
        const cursoId = e.target.getAttribute('data-id')

        // Elimina del arreglo de articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId)
        // console.log(articulosCarrito);

        carritoHTML() // Iteramos sobre el carrito y mostramos su HTML
    }
}

// Lee el contenido del HTML al que le dimos click y extrae la información del curso
function leerDatosCurso( curso ) {
    // console.log(curso);

    // Crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }
    // console.log(infoCurso);

    // Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some( curso => curso.id === infoCurso.id )
    if( existe ) {
        // Actualizamos la cantidad
        const cursos = articulosCarrito.map( curso=> {
            if( curso.id === infoCurso.id ) {
                curso.cantidad++
                return curso // retorna el objeto actualizado
            } else {
                return curso // retorna los objetos que no son los duplicados
            }
        })
        articulosCarrito = [...cursos]
    } else {
        // Agrega elementos al arreglo de carrito - lo que tiene carrito mas infoCurso
        articulosCarrito = [...articulosCarrito, infoCurso]
    }


    carritoHTML()
}

// Muestra el carrito de compras en el HTML
function carritoHTML() {
    // Limpiamos el HTML
    limpiarHTML()

    // Recorre el carrito y genera el HTML
    articulosCarrito.forEach( curso => {
        const  { imagen, titulo, precio, cantidad, id } = curso
        const row = document.createElement('tr')
        row.innerHTML = `
            <td>
                <img src="${imagen}" width="100">
            </td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${curso.id}"> X </a>
            </td>
        `;

        // Agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row)
    })

    // Sincronizar con Local Storage
    sincronizarStorage()
}

// Sincronizamos el carrito de compras al storage
function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito))
}

// Limpia el carrito de compras (tbody)
function limpiarHTML() {
    // contenedorCarrito.innerHTML = '' - FORMA LENTA

    // Para un mejor performance
    while ( contenedorCarrito.firstChild ) {
        contenedorCarrito.removeChild( contenedorCarrito.firstChild )
    }
}
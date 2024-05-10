class DataRepository {
    async listarProducto() {
        const response = await fetch(`http://localhost:3000/producto`);
        if (!response.ok) { 
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    async fetchProductoCategoria(tipoCafe) {
        const response = await fetch(`http://localhost:3000/producto/categoria?tipo=${tipoCafe}`);
        if (!response.ok) { 
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();/*quitar await*/
    }
}

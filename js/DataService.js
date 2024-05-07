class DataService {
    constructor(repository) {
        this.repository = repository;
    }

    //DEVUELVE TODAS LAS PELIS
    async getProducto() {
        try {
            const data = await this.repository.listarProducto();
            return data; // Aquí puedes añadir lógica para procesar los datos si es necesario
        } catch (error) {
            console.error('Error getting pelis data:', error);
        }
    }

    //DEVUELVE TODAS LAS PELIS POR CATEGORIA
    async getProductoCategoria() {
        try {
            const data = await this.repository.fetchProductoCategoria();
            return data; // Aquí puedes añadir lógica para procesar los datos si es necesario
        } catch (error) {
            console.error('Error getting pelis data:', error);
        }
    }

    //DEVUELVE TODAS MIS PELICULAS FAVORITAS
    async getPelisFav(id_usuario) {
        try {
            const data = await this.repository.fetchPelisFav(id_usuario);
            return data; // Aquí puedes añadir lógica para procesar los datos si es necesario
        } catch (error) {
            console.error('Error getting pelis data:', error);
        }
    }
}
 
import {
    useEffect,
    useState
} from "react";

import { useAuth }
    from "../context/AuthContext";

import { API_BASE_URL }
    from "../config/apiConfig";


function ListaVehiculos({
    vehiculos,
    onRecargar
}) {

    const [fotosUrl, setFotosUrl] =
        useState({});


    const [vehiculoEditando, setVehiculoEditando] =
        useState(null);

    const [marcaEditar, setMarcaEditar] =
        useState("");

    const [modeloEditar, setModeloEditar] =
        useState("");

    const [archivoEditar, setArchivoEditar] =
        useState(null);


    const [mensaje, setMensaje] =
        useState("");

    const [error, setError] =
        useState("");

    const [procesando, setProcesando] =
        useState(false);


    const { token } =
        useAuth();


    /*
     * DESCARGAR FOTOGRAFIAS PROTEGIDAS
     */
    useEffect(() => {

        const urlsCreadas = [];

        let cancelado = false;


        const descargarFotos =
            async () => {

                const nuevasUrls = {};


                for (
                    const vehiculo
                    of vehiculos
                ) {

                    try {

                        const response =
                            await fetch(

                                `${API_BASE_URL}/auth/vehiculos/${vehiculo.id}/foto`,

                                {
                                    headers: {

                                        Authorization:
                                            `Bearer ${token}`
                                    }
                                }
                            );


                        if (response.ok) {

                            const blob =
                                await response.blob();


                            const urlLocal =
                                URL.createObjectURL(
                                    blob
                                );


                            urlsCreadas.push(
                                urlLocal
                            );


                            nuevasUrls[
                                vehiculo.id
                            ] = urlLocal;
                        }


                    } catch (error) {

                        console.log(
                            "Error al descargar foto:",
                            error
                        );
                    }
                }


                if (!cancelado) {

                    setFotosUrl(
                        nuevasUrls
                    );
                }
            };


        setFotosUrl({});


        if (vehiculos.length > 0) {

            descargarFotos();
        }


        /*
         * Liberamos las Object URL
         * anteriores cuando la lista cambia
         * o el componente se desmonta.
         */
        return () => {

            cancelado = true;


            for (
                const url
                of urlsCreadas
            ) {

                URL.revokeObjectURL(
                    url
                );
            }
        };


    }, [vehiculos, token]);


    /*
     * ELIMINAR
     */
    const eliminarVehiculo =
        async (vehiculo) => {


            const confirmar =
                window.confirm(
                    `¿Deseas eliminar ${vehiculo.marca} ${vehiculo.modelo}?`
                );


            if (!confirmar) {

                return;
            }


            setMensaje("");

            setError("");

            setProcesando(true);


            try {

                const response =
                    await fetch(

                        `${API_BASE_URL}/auth/vehiculos/${vehiculo.id}`,

                        {
                            method: "DELETE",

                            headers: {

                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );


                if (!response.ok) {

                    const texto =
                        await response.text();

                    throw new Error(
                        texto ||
                        "No se pudo eliminar el vehiculo"
                    );
                }


                setMensaje(
                    "Vehiculo eliminado con exito"
                );


                await onRecargar();


            } catch (error) {

                setError(
                    error.message
                );


            } finally {

                setProcesando(false);
            }
        };


    /*
     * ABRIR MODAL
     */
    const abrirEdicion =
        (vehiculo) => {

            setMensaje("");

            setError("");

            setVehiculoEditando(
                vehiculo
            );

            setMarcaEditar(
                vehiculo.marca
            );

            setModeloEditar(
                vehiculo.modelo
            );

            setArchivoEditar(null);
        };


    /*
     * CERRAR MODAL
     */
    const cerrarEdicion = () => {

        setVehiculoEditando(null);

        setMarcaEditar("");

        setModeloEditar("");

        setArchivoEditar(null);
    };


    /*
     * UPDATE
     */
    const actualizarVehiculo =
        async (e) => {

            e.preventDefault();


            if (!vehiculoEditando) {

                return;
            }


            setMensaje("");

            setError("");

            setProcesando(true);


            const formData =
                new FormData();


            formData.append(
                "marca",
                marcaEditar
            );

            formData.append(
                "modelo",
                modeloEditar
            );


            /*
             * La foto es OPCIONAL.
             */
            if (archivoEditar) {

                formData.append(
                    "file",
                    archivoEditar
                );
            }


            try {

                const response =
                    await fetch(

                        `${API_BASE_URL}/auth/vehiculos/${vehiculoEditando.id}`,

                        {
                            method: "PUT",

                            headers: {

                                Authorization:
                                    `Bearer ${token}`
                            },

                            body: formData
                        }
                    );


                if (!response.ok) {

                    const texto =
                        await response.text();

                    throw new Error(
                        texto ||
                        "No se pudo actualizar el vehiculo"
                    );
                }


                setMensaje(
                    "Vehiculo actualizado con exito"
                );


                cerrarEdicion();


                await onRecargar();


            } catch (error) {

                setError(
                    error.message
                );


            } finally {

                setProcesando(false);
            }
        };


    return (

        <section className="listado-section">

            <div className="listado-header">

                <div>

                    <h2>
                        Vehículos registrados
                    </h2>

                    <p>
                        Total: {vehiculos.length}
                    </p>

                </div>

            </div>


            {mensaje && (

                <p className="mensaje-exito">

                    {mensaje}

                </p>
            )}


            {error && (

                <p className="mensaje-error">

                    {error}

                </p>
            )}


            {
                vehiculos.length === 0
                    ? (

                        <div className="sin-registros">

                            No hay vehículos registrados.

                        </div>

                    )
                    : (

                        <div className="vehiculos-grid">

                            {
                                vehiculos.map(
                                    (vehiculo) => (

                                        <article
                                            className="vehiculo-card"
                                            key={vehiculo.id}
                                        >

                                            <div className="vehiculo-imagen-contenedor">

                                                {
                                                    fotosUrl[
                                                        vehiculo.id
                                                    ]
                                                        ? (

                                                            <img
                                                                className="vehiculo-imagen"
                                                                src={
                                                                    fotosUrl[
                                                                        vehiculo.id
                                                                    ]
                                                                }
                                                                alt={
                                                                    `${vehiculo.marca} ${vehiculo.modelo}`
                                                                }
                                                            />

                                                        )
                                                        : (

                                                            <div className="imagen-cargando">

                                                                Cargando imagen...

                                                            </div>
                                                        )
                                                }

                                            </div>


                                            <div className="vehiculo-card-body">

                                                <span className="vehiculo-id">

                                                    ID #{vehiculo.id}

                                                </span>


                                                <h3>

                                                    {vehiculo.marca}

                                                </h3>


                                                <p>

                                                    <strong>
                                                        Modelo:
                                                    </strong>{" "}

                                                    {vehiculo.modelo}

                                                </p>


                                                <p className="mime-text">

                                                    <strong>
                                                        Formato:
                                                    </strong>{" "}

                                                    {
                                                        vehiculo.mimeType
                                                    }

                                                </p>


                                                <div className="card-actions">

                                                    <button
                                                        className="btn-editar"
                                                        type="button"
                                                        disabled={
                                                            procesando
                                                        }
                                                        onClick={() =>
                                                            abrirEdicion(
                                                                vehiculo
                                                            )
                                                        }
                                                    >
                                                        Editar
                                                    </button>


                                                    <button
                                                        className="btn-eliminar"
                                                        type="button"
                                                        disabled={
                                                            procesando
                                                        }
                                                        onClick={() =>
                                                            eliminarVehiculo(
                                                                vehiculo
                                                            )
                                                        }
                                                    >
                                                        Eliminar
                                                    </button>

                                                </div>

                                            </div>

                                        </article>
                                    )
                                )
                            }

                        </div>
                    )
            }


            {
                vehiculoEditando && (

                    <div className="modal-overlay">

                        <div className="modal-card">

                            <div className="modal-header">

                                <h2>
                                    Editar vehículo
                                </h2>


                                <button
                                    type="button"
                                    className="modal-cerrar"
                                    onClick={
                                        cerrarEdicion
                                    }
                                >
                                    ×
                                </button>

                            </div>


                            <form
                                className="modal-form"
                                onSubmit={
                                    actualizarVehiculo
                                }
                            >

                                <div className="form-group">

                                    <label>
                                        Marca
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            marcaEditar
                                        }
                                        onChange={(e) =>
                                            setMarcaEditar(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Modelo
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            modeloEditar
                                        }
                                        onChange={(e) =>
                                            setModeloEditar(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Nueva fotografía
                                        (opcional)
                                    </label>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setArchivoEditar(
                                                e.target.files[0]
                                                || null
                                            )
                                        }
                                    />

                                    <small>
                                        Si no seleccionas una imagen,
                                        se conservará la actual.
                                    </small>

                                </div>


                                <div className="modal-actions">

                                    <button
                                        className="btn-secundario"
                                        type="button"
                                        onClick={
                                            cerrarEdicion
                                        }
                                        disabled={
                                            procesando
                                        }
                                    >
                                        Cancelar
                                    </button>


                                    <button
                                        className="btn-principal"
                                        type="submit"
                                        disabled={
                                            procesando
                                        }
                                    >

                                        {
                                            procesando
                                                ? "Guardando..."
                                                : "Guardar cambios"
                                        }

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>
                )
            }

        </section>
    );
}


export default ListaVehiculos;
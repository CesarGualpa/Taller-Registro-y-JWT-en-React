import {
    useCallback,
    useEffect,
    useState
} from "react";

import { useNavigate } from "react-router-dom";

import { API_BASE_URL }
    from "../config/apiConfig";

import { useAuth }
    from "../context/AuthContext";

import ListaVehiculos
    from "../components/ListaVehiculos";


function GestionVehiculos() {

    const [marca, setMarca] =
        useState("");

    const [modelo, setModelo] =
        useState("");

    const [archivo, setArchivo] =
        useState(null);

    const [listaVehiculos, setListaVehiculos] =
        useState([]);

    const [errorMsg, setErrorMsg] =
        useState("");

    const [successMsg, setSuccessMsg] =
        useState("");

    const [cargando, setCargando] =
        useState(true);


    const navigate =
        useNavigate();


    const { token } =
        useAuth();


    /*
     * CARGAR LISTADO
     */
    const cargarVehiculos =
        useCallback(async () => {

            try {

                setCargando(true);

                const response =
                    await fetch(
                        `${API_BASE_URL}/auth/vehiculos`,
                        {
                            headers: {

                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "No se pudo obtener la lista de vehiculos"
                    );
                }


                const datos =
                    await response.json();


                setListaVehiculos(datos);


            } catch (error) {

                setErrorMsg(
                    error.message
                );


            } finally {

                setCargando(false);
            }

        }, [token]);


    /*
     * CARGAR AL ENTRAR
     */
    useEffect(() => {

        cargarVehiculos();

    }, [cargarVehiculos]);


    /*
     * SELECCIONAR ARCHIVO
     */
    const manejarArchivo = (e) => {

        const file =
            e.target.files[0];

        setArchivo(
            file || null
        );
    };


    /*
     * REGISTRAR VEHICULO
     */
    const manejarSubmit =
        async (e) => {

            e.preventDefault();

            setErrorMsg("");

            setSuccessMsg("");


            if (!archivo) {

                setErrorMsg(
                    "Debe seleccionar una foto del vehiculo"
                );

                return;
            }


            const formData =
                new FormData();


            formData.append(
                "file",
                archivo
            );

            formData.append(
                "marca",
                marca
            );

            formData.append(
                "modelo",
                modelo
            );


            try {

                const response =
                    await fetch(
                        `${API_BASE_URL}/auth/vehiculos/registrar`,
                        {
                            method: "POST",

                            headers: {

                                Authorization:
                                    `Bearer ${token}`
                            },

                            body: formData
                        }
                    );


                if (!response.ok) {

                    const mensaje =
                        await response.text();

                    throw new Error(
                        mensaje ||
                        "No se pudo registrar el vehiculo"
                    );
                }


                setSuccessMsg(
                    "Vehiculo registrado con exito"
                );


                setMarca("");

                setModelo("");

                setArchivo(null);


                await cargarVehiculos();


            } catch (error) {

                setErrorMsg(
                    error.message
                );
            }
        };


    return (

        <main className="gestion-page">

            <div className="gestion-header">

                <div>

                    <h1>
                        Gestión de Vehículos
                    </h1>

                    <p>
                        CRUD completo con imágenes
                    </p>

                </div>


                <button
                    className="btn-secundario"
                    onClick={() =>
                        navigate("/perfil")
                    }
                >
                    Volver al perfil
                </button>

            </div>


            <section className="form-panel">

                <h2>
                    Registrar nuevo vehículo
                </h2>


                <form
                    className="vehiculo-form"
                    onSubmit={manejarSubmit}
                >

                    <div className="form-group">

                        <label>
                            Marca
                        </label>

                        <input
                            type="text"
                            value={marca}
                            onChange={(e) =>
                                setMarca(
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
                            value={modelo}
                            onChange={(e) =>
                                setModelo(
                                    e.target.value
                                )
                            }
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Fotografía
                        </label>

                        <input
                            key={
                                archivo
                                    ? archivo.name
                                    : "sin-archivo"
                            }
                            type="file"
                            accept="image/*"
                            onChange={
                                manejarArchivo
                            }
                            required
                        />

                    </div>


                    <button
                        className="btn-principal"
                        type="submit"
                    >
                        Registrar Vehículo
                    </button>

                </form>


                {errorMsg && (

                    <p className="mensaje-error">

                        {errorMsg}

                    </p>
                )}


                {successMsg && (

                    <p className="mensaje-exito">

                        {successMsg}

                    </p>
                )}

            </section>


            {cargando ? (

                <p className="cargando-texto">

                    Cargando vehículos...

                </p>

            ) : (

                <ListaVehiculos
                    vehiculos={
                        listaVehiculos
                    }
                    onRecargar={
                        cargarVehiculos
                    }
                />
            )}

        </main>
    );
}


export default GestionVehiculos;
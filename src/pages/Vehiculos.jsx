import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/apiConfig";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useCallback} from "react";
import listarVehiculos from "../components/ListaVehiculos";

function Vehiculos() {
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [archivo, setArchivo] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [succesMsg, setSuccesMsg] = useState("");
    const navigate = useNavigate();
    const { token } = useAuth
    const [ListaVehiculos, setListaVehiculos] = useState([]);
    const cargarVehiculos = useCallback (async ()=>{
        try {
            const response = await fetch(`${API_BASE_URL}/auth/vehiculos`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error("No se pudo obtener la lista de vehiculos")
            }
            const datos = await response.json();
            setListaVehiculos(datos);
        } catch (error) {
            setErrorMsg(error.message)
        }
    }, [token])
    useEffect(()=>{
        cargarVehiculos();
    }, [cargarVehiculos])
    const manejarArchivo = (e) => {
        setArchivo(e.target.files[0]);
    };
    const manejarSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccesMsg("");
        if (!archivo) {
            setErrorMsg("Debe seleccionar una foto del vehiculo")
            return;
        }
        const formData = new FormData();
        formData.append("file", archivo)
        formData.append("marca", marca)
        formData.append("modelo", modelo)
        try {
            const response = await fetch(`${API_BASE_URL}/auth/vehiculo/registrar`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }, body: formData
            });
            if (!response.ok) {
                throw new Error("No se pudo registrar el vehiculo")
            }
            setSuccesMsg("Vehiculo resgistrado con exito");
            setMarca("");
            setModelo("");
            setArchivo(null);
            cargarVehiculos();
        } catch (error) {
            setErrorMsg(error.message)
        }
    }
    return (
        <div>
            <button onClick={() => navigate("/perfil")}>Volver al perfil</button>
            <h1>Gestion de Vehiculos</h1>
            <h2>Registrar nuevo vehiculo</h2>
            <form onSubmit={manejarSubmit}>
                <div>
                    <label>Marca: </label>
                    <input
                        type="text"
                        value={marca}
                        onChange={(e) => setMarca(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Modelo: </label>
                    <input
                        type="text"
                        value={modelo}
                        onChange={(e) => setModelo(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Foto: </label>
                    <input
                        type="imege/*"
                        value={marca}
                        onChange={manejarArchivo}
                    />
                </div>
                <button type="submit">Registrar Vehiculo</button>
            </form>
            {errorMsg && <p>{errorMsg}</p>}
            {succesMsg && <p>{succesMsg}</p>}
            <listarVehiculos
            vehiculos={ListaVehiculos}
            />
        </div>
    );
}

export default Vehiculos;

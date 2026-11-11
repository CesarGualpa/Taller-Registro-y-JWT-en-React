import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { API_BASE_URL } from "../config/apiConfig";


function Registrar() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rol, setRol] = useState("USER");

    const [mensajeExito, setMensajeExito] = useState("");
    const [error, setError] = useState("");
    const [enviando, setEnviando] = useState(false);

    const navigate = useNavigate();


    const manejarSubmit = async (e) => {

        e.preventDefault();

        setMensajeExito("");
        setError("");
        setEnviando(true);


        try {

            const response = await fetch(
                `${API_BASE_URL}/auth/registrar`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        username,
                        password,
                        rol
                    })
                }
            );


            if (!response.ok) {

                const mensajeServidor =
                    await response.text();

                throw new Error(
                    mensajeServidor ||
                    "No se pudo registrar el usuario"
                );
            }


            await response.json();


            setMensajeExito(
                "Usuario registrado correctamente. Redirigiendo al inicio de sesión..."
            );


            setTimeout(() => {

                navigate("/login");

            }, 2000);


        } catch (error) {

            setError(
                error.message ||
                "Error al conectar con el servidor"
            );

        } finally {

            setEnviando(false);
        }
    };


    return (

        <main className="auth-page">

            <section className="auth-card">

                <h1 className="auth-title">
                    Crear Cuenta
                </h1>

                <p className="auth-subtitle">
                    Completa tus datos para registrarte
                </p>


                <form
                    className="auth-form"
                    onSubmit={manejarSubmit}
                >

                    <div className="form-group">

                        <label htmlFor="username">
                            Nombre de usuario
                        </label>

                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            placeholder="Ingresa un nombre de usuario"
                            required
                            disabled={enviando}
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="password">
                            Contraseña
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Ingresa una contraseña"
                            required
                            disabled={enviando}
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="rol">
                            Rol
                        </label>

                        <select
                            id="rol"
                            value={rol}
                            onChange={(e) =>
                                setRol(e.target.value)
                            }
                            disabled={enviando}
                        >

                            <option value="USER">
                                USER
                            </option>

                            <option value="ADMIN">
                                ADMIN
                            </option>

                        </select>

                    </div>


                    {mensajeExito && (

                        <p className="mensaje-exito">
                            {mensajeExito}
                        </p>

                    )}


                    {error && (

                        <p className="mensaje-error">
                            {error}
                        </p>

                    )}


                    <button
                        className="auth-button"
                        type="submit"
                        disabled={enviando}
                    >

                        {
                            enviando
                                ? "Registrando..."
                                : "Registrarse"
                        }

                    </button>

                </form>


                <div className="auth-footer">

                    <span>
                        ¿Ya tienes una cuenta?
                    </span>

                    <Link
                        className="auth-link"
                        to="/login"
                    >
                        Iniciar sesión
                    </Link>

                </div>

            </section>

        </main>
    );
}

export default Registrar;
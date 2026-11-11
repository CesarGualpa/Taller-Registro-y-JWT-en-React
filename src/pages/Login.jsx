import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/apiConfig";

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");

    const navigate = useNavigate();

    const { login } = useAuth();


    const manejarSubmit = async (e) => {

        e.preventDefault();

        setErr("");

        try {

            const response = await fetch(
                `${API_BASE_URL}/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        username,
                        password
                    })
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Usuario o contraseña incorrectos"
                );
            }


            const datos = await response.json();

            login(datos.token);

            navigate("/perfil");

        } catch (error) {

            setErr(error.message);
        }
    };


    return (

        <main className="auth-page">

            <section className="auth-card">

                <h1 className="auth-title">
                    Iniciar Sesión
                </h1>

                <p className="auth-subtitle">
                    Ingresa tus credenciales para continuar
                </p>


                <form
                    className="auth-form"
                    onSubmit={manejarSubmit}
                >

                    <div className="form-group">

                        <label htmlFor="username">
                            Usuario
                        </label>

                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            placeholder="Ingresa tu usuario"
                            required
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
                            placeholder="Ingresa tu contraseña"
                            required
                        />

                    </div>


                    {err && (

                        <p className="mensaje-error">
                            {err}
                        </p>

                    )}


                    <button
                        className="auth-button"
                        type="submit"
                    >
                        Ingresar
                    </button>

                </form>


                <div className="auth-footer">

                    <span>
                        ¿No tienes una cuenta?
                    </span>

                    <Link
                        className="auth-link"
                        to="/registrar"
                    >
                        Registrarse
                    </Link>

                </div>

            </section>

        </main>
    );
}

export default Login;
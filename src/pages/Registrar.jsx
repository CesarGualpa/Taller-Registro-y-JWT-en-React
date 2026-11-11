import { useState } from "react";
import { Link } from "react-router-dom";

function Registrar() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rol, setRol] = useState("USER");


    return (

        <main className="auth-page">

            <section className="auth-card">

                <h1 className="auth-title">
                    Crear Cuenta
                </h1>

                <p className="auth-subtitle">
                    Registra un nuevo usuario
                </p>


                <form className="auth-form">

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
                            required
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
                        >

                            <option value="USER">
                                USER
                            </option>

                            <option value="ADMIN">
                                ADMIN
                            </option>

                        </select>

                    </div>


                    <button
                        className="auth-button"
                        type="submit"
                    >
                        Registrarse
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
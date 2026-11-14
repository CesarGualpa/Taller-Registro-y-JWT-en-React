import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Registrar from "./pages/Registrar";
import GestionVehiculos from "./pages/GestionVehiculos";

import "./index.css";

function App() {
    return (
        <AuthProvider>

            <BrowserRouter>

                <Routes>

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/registrar"
                        element={<Registrar />}
                    />


                    <Route element={<ProtectedRoute />}>

                        <Route
                            path="/perfil"
                            element={<Perfil />}
                        />

                        <Route
                            path="/gestion"
                            element={<GestionVehiculos />}
                        />

                        <Route
                            path="/vehiculos"
                            element={
                                <Navigate
                                    to="/gestion"
                                    replace
                                />
                            }
                        />

                    </Route>


                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/login"
                                replace
                            />
                        }
                    />

                </Routes>

            </BrowserRouter>

        </AuthProvider>
    );
}

export default App;
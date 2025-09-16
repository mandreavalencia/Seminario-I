import { useState, Suspense } from "react";  
import { useSelector, useDispatch, Provider } from "react-redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useParams } from "react-router-dom";

// ---------------- REDUX STORE ----------------
const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1 },
    decrement: (state) => { state.value -= 1 },
  }
});

const { increment, decrement } = counterSlice.actions;

const store = configureStore({
  reducer: { counter: counterSlice.reducer }
});

// ---------------- COMPONENTES ----------------
function Header({ mensaje }) {
  return (
    <header style={{ 
      background: "linear-gradient(90deg, #0077cc, #6a0dad)",
      color: "white", padding: "20px", borderRadius: "8px",
      textAlign: "center", fontSize: "1.5rem", marginBottom: "20px",
      fontWeight: "bold", letterSpacing: "1px"
    }}>
      {mensaje}
    </header>
  );
}

function Person({ nombre, edad, color }) {
  return (
    <div
      style={{
        backgroundColor: color, padding: "20px", margin: "10px auto",
        borderRadius: "15px", width: "260px", textAlign: "center",
        color: "#222", fontWeight: "500", transition: "0.3s",
        boxShadow: "2px 2px 12px rgba(0,0,0,0.15)", cursor: "pointer"
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
    >
      <h3>{nombre}</h3>
      <p>Edad: {edad}</p>
    </div>
  );
}

function Card({ children }) {
  return (
    <div
      style={{
        border: "none", borderRadius: "12px", padding: "15px",
        margin: "10px auto", width: "300px", background: "#fff",
        boxShadow: "4px 4px 15px rgba(0,0,0,0.1)"
      }}
    >
      {children}
    </div>
  );
}

// ---------------- PÁGINAS ----------------
function Home() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();
  const [lastAction, setLastAction] = useState(null);

  return (
    <div style={{ textAlign: "center" }}>
      <Header mensaje="✨ Bienvenido a la App ✨" />
      {/* Ocultamos "Estado Global con Redux" en UI, pero lo explicamos en el código */}
      <button 
        onClick={() => { dispatch(decrement()); setLastAction("dec"); }}
        style={btnStyle}
      > - </button>
      <span style={{
        margin: "0 15px", fontSize: "2rem", fontWeight: "bold",
        color: lastAction === "inc" ? "green" : lastAction === "dec" ? "red" : "black"
      }}>
        {count}
      </span>
      <button 
        onClick={() => { dispatch(increment()); setLastAction("inc"); }}
        style={btnStyle}
      > + </button>
    </div>
  );
}

const btnStyle = {
  padding: "10px 15px",
  border: "none",
  borderRadius: "8px",
  background: "linear-gradient(90deg, #6a0dad, #0077cc)",
  color: "white",
  cursor: "pointer",
  transition: "0.3s"
};

function Personas() {
  const [colorGlobal, setColorGlobal] = useState("pink");

  const colores = ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", 
                   "#9bf6ff", "#a0c4ff", "#bdb2ff", "#ffc6ff"];

  const cambiarColor = () => {
    const randomColor = colores[Math.floor(Math.random() * colores.length)];
    setColorGlobal(randomColor);
  };

  return (
    <div style={{ textAlign: "center" }}>
      {/* Ocultamos "Lifting State Up" en la UI */}
      <button onClick={cambiarColor} style={btnStyle}>
        🎨 Cambiar Color Global
      </button>

      <Card><Link to="/persona/Alejandro"><Person nombre="Alejandro" edad="21" color={colorGlobal} /></Link></Card>
      <Card><Link to="/persona/Ana"><Person nombre="Ana" edad="24" color={colorGlobal} /></Link></Card>
      <Card><Link to="/persona/Andrea"><Person nombre="Andrea" edad="24" color={colorGlobal} /></Link></Card>
    </div>
  );
}

function PersonaDetalle() {
  const { nombre } = useParams();
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Detalles de {nombre}</h2>
      <p>Aquí podrías mostrar más información sobre {nombre}.</p>
    </div>
  );
}

function About() {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Acerca de la App</h2>
      <p>Esta app demuestra Redux, Props, Lifting, Routing y más 🚀</p>
    </div>
  );
}

// Guard para rutas protegidas
function RequireAuth({ children, isLogged }) {
  return isLogged ? children : <Navigate to="/" replace />;
}

// ---------------- APP PRINCIPAL ----------------
function AppContent() {
  const [isLogged, setIsLogged] = useState(false);

  return (
    <Router>
      {/* Barra de navegación con estilo */}
      <nav style={{
        display: "flex", gap: "20px", justifyContent: "center",
        margin: "20px", padding: "10px", borderRadius: "8px",
        background: "linear-gradient(90deg, #0077cc, #6a0dad)",
        color: "white"
      }}>
        <Link to="/" style={linkStyle}>Inicio</Link>
        <Link to="/personas" style={linkStyle}>Personas</Link>
        <Link to="/about" style={linkStyle}>Acerca de</Link>
        <button onClick={() => setIsLogged(!isLogged)} style={btnStyle}>
          {isLogged ? "Logout" : "Login"}
        </button>
      </nav>

      <Suspense fallback={<h2>Cargando...</h2>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/personas" element={<Personas />} />
          <Route path="/persona/:nombre" element={<PersonaDetalle />} />
          <Route path="/about" element={
            <RequireAuth isLogged={isLogged}>
              <About />
            </RequireAuth>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

const linkStyle = { 
  color: "white", textDecoration: "none", fontWeight: "bold" 
};

// Envolvemos la App en el Provider para Redux
function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;

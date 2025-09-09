import { useState } from "react";
import { useSelector, useDispatch, Provider } from "react-redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";

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
      background: "#222", 
      color: "white", 
      padding: "15px", 
      borderRadius: "8px",
      textAlign: "center",
      fontSize: "1.3rem",
      marginBottom: "20px",
      fontWeight: "bold"
    }}>
      {mensaje}
    </header>
  );
}

function Person({ nombre, edad, color }) {
  return (
    <div
      style={{
        backgroundColor: color,
        padding: "15px",
        margin: "10px auto",
        borderRadius: "10px",
        width: "250px",
        textAlign: "center",
        color: "#222",
        fontWeight: "500",
        transition: "background-color 0.5s ease"
      }}
    >
      <h3>Nombre: {nombre}</h3>
      <p>Edad: {edad}</p>
    </div>
  );
}

function Card({ children }) {
  return (
    <div
      style={{
        border: "2px solid #444",
        borderRadius: "12px",
        padding: "15px",
        margin: "10px auto",
        width: "280px",
        background: "#fdfdfd",
        boxShadow: "2px 2px 10px rgba(0,0,0,0.2)",
      }}
    >
      {children}
    </div>
  );
}

// ---------------- APP PRINCIPAL ----------------
function AppContent() {
  // Estado global (Redux)
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  // Estado compartido (lifting state up)
  const [colorGlobal, setColorGlobal] = useState("pink");
  const [lastAction, setLastAction] = useState(null); // "inc" o "dec"

  // 🎨 Paleta de colores divertidos
  const colores = [
    "#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", 
    "#9bf6ff", "#a0c4ff", "#bdb2ff", "#ffc6ff"
  ];

  const cambiarColor = () => {
    const randomColor = colores[Math.floor(Math.random() * colores.length)];
    setColorGlobal(randomColor);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", textAlign: "center" }}>
      <Header mensaje=" BIENVENIDO A LA APP " />

      {/* Sección Redux */}
      <section style={{ marginBottom: "30px" }}>
        <h2> Estado Global con Redux</h2>
        <button onClick={() => { dispatch(decrement()); setLastAction("dec"); }}> - </button>
        
        <span 
          key={count} // importante para que la animación se dispare al cambiar
          style={{ 
            margin: "0 15px", 
            fontSize: "1.8rem", 
            fontWeight: "bold",
            display: "inline-block",
            transition: "transform 0.3s ease, color 0.3s ease",
            transform: "scale(1.2)",
            color: lastAction === "inc" ? "green" : lastAction === "dec" ? "red" : "black"
          }}
        >
          {count}
        </span>

        <button onClick={() => { dispatch(increment()); setLastAction("inc"); }}> + </button>
      </section>

      {/* Sección Lifting */}
      <section>
        <h2>Lifting State Up</h2>
        <button
          style={{ 
            marginBottom: "15px", 
            padding: "8px 12px", 
            border: "none", 
            borderRadius: "8px", 
            background: "#0077cc", 
            color: "white", 
            cursor: "pointer"
          }}
          onClick={cambiarColor}
        >
          Cambiar Color Global
        </button>

        <Card><Person nombre="Alejandro" edad="21" color={colorGlobal} /></Card>
        <Card><Person nombre="Ana" edad="24" color={colorGlobal} /></Card>
        <Card><Person nombre="Andrea" edad="24" color={colorGlobal} /></Card>
      </section>

      <Header mensaje=" GRACIAS POR VISITARNOS " />
    </div>
  );
}

// Envolvemos la App en el Provider para Redux
function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;

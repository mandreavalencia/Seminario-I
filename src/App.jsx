import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Header(props) {
  console.log(props);
  return (
    <header style={{ background: "#222", color: "white", padding: "10px" }}>
       <h2>{props.mensajeInicio}</h2>
      <h2>{props.mensajeFinal}</h2>
    </header>
  );
}
function Person(props) {
  console.log(props);
return (
<div className="person" style={{
backgroundColor: props.color,
}}>
<h3>Nombre: {props.nombre}</h3>
<p>Edad: {props.edad}</p>
</div>

)


}
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>

      <Header mensajeInicio="BIENVENIDO"/>

<Person nombre="Alejandro" edad="21" color="pink"/>
<Person nombre="Ana" edad="24" color="purple"/>
<Person nombre="Andrea" edad="24" color="red"/>

 
      <Header  mensajeFinal="GRACIAS POR VISITARNOS"/>


      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

    </>
  )
}

export default App

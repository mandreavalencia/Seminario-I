function Person(props) {
  return (
    <div
      className="person"
      style={{
        backgroundColor: props.color,
        padding: "10px",
        margin: "5px",
        borderRadius: "5px"
      }}
    >
      <h3>Nombre: {props.nombre}</h3>
      <p>Edad: {props.edad}</p>
    </div>
  );
}

export default Person; 

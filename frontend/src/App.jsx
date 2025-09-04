
import React from "react";
import CollectionList from "./components/CollectionList";

function App() {
  const token = localStorage.getItem("token"); // after login

  return (
    <div>
      <CollectionList token={token} />
    </div>
  );
}

export default App;



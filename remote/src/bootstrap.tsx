import * as ReactDOMClient from "react-dom/client";
import React from "react";
import Widget from "./components/Widget";

const container = document.getElementById("root");

// Create a root.
const root = ReactDOMClient.createRoot(container);
root.render(<Widget />);

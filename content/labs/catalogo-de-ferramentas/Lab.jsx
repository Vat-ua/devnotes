import ToolCatalog from "./components/ToolCatalog.jsx";
import { codeFiles } from "./code-files.js";
import "./styles.css";

function Lab() {
  return <ToolCatalog />;
}

Lab.codeFiles = codeFiles;

export default Lab;

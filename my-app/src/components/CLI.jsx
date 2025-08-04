import { useState } from "react";
import axios from "axios";

export default function CLI() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([]);

  const handleCommand = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const command = input;
    setInput("");
    setOutput((prev) => [...prev, `$ ${command}`]);

    try {
      const response = await axios.post("http://localhost:8000/cli", {
        command,
      });
      setOutput((prev) => [...prev, response.data.output]);
    } catch (error) {
      setOutput((prev) => [...prev, "Error: Command failed"]);
    }
  };

  return (
    <div className="bg-black text-green-500 p-4 rounded-lg font-mono h-[500px] overflow-y-auto shadow-md">
      {output.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
      <form onSubmit={handleCommand} className="flex mt-2">
        <span className="mr-2 text-white">$</span>
        <input
          type="text"
          className="flex-grow bg-transparent outline-none text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
        />
      </form>
    </div>
  );
}

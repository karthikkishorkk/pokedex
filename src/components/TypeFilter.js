// src/components/TypeFilter.js
import { useEffect, useState } from "react";
import './TypeFilter.css';

const TypeFilter = ({ onTypeSelect }) => {
  const [types, setTypes] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/type")
      .then(res => res.json())
      .then(data => {
        const filtered = data.results.filter(t => t.name !== "unknown" && t.name !== "shadow");
        setTypes(filtered);
      });
  }, []);

  const handleChange = (e) => {
    const type = e.target.value;
    setSelected(type);
    onTypeSelect(type); // notify parent
  };

  return (
    <div className="type-filter">
      <label htmlFor="type-select">Filter by Type:</label>
      <select id="type-select" value={selected} onChange={handleChange}>
        <option value="">All</option>
        {types.map(type => (
          <option key={type.name} value={type.name}>{type.name}</option>
        ))}
      </select>
    </div>
  );
};

export default TypeFilter;

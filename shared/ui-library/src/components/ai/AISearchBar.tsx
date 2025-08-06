import React, { useState } from "react";
import './AISearchBar.css';

export const AISearchBar: React.FC<{ onSearch: (query: string) => void }> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  return (
    <div className="ai-searchbar glassmorphism">
      <input
        className="ai-searchbar-input"
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search with AI..."
        onKeyDown={e => e.key === "Enter" && onSearch(query)}
      />
      <button className="ai-searchbar-btn" onClick={() => onSearch(query)}>
        <span className="ai-searchbar-icon">🔍</span>
      </button>
    </div>
  );
};

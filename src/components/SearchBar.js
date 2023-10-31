// src/components/SearchBar.js
import React, { useState } from "react";
import axios from "axios";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);

  const handleChange = async (e) => {
    setQuery(e.target.value); // setQuery(e.target.value.toLowerCase());
    if (e.target.value.split(" ").length > 0) {
      try {
        const response = await axios.post(
          "http://localhost:8000/query_by_sentence",
          {
            sentence: e.target.value,
            n_results: 5,
            include: ["documents", "distances", "metadatas"],
          }
        );
        setResult(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setResult(null);
      }
    }
  };

  const handleSearch = async () => {
    try {
      await axios.post("http://localhost:8000/documents", {
        sentence: query.toLowerCase(),
        metadata: {
          language: "English",
          country: "USA",
          user_id: "user001",
          time: "1633720367.0",
        },
      });
      // Optionally, clear the query or provide user feedback
      setQuery("");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const renderResult = () => {
    if (
      !result ||
      !result.documents ||
      !result.distances ||
      !result.metadatas
    ) {
      return null;
    }
    return result.documents[0].map((document, index) => {
      const distance = parseFloat(result.distances[0][index]);
      return (
        <div key={index} className="result-line">
          <div>
            user: {result.metadatas[0][index].user_id} - distance:{" "}
            {isNaN(distance) ? result.distances[0][index] : distance.toFixed(2)}{" "}
            : {document}
          </div>
        </div>
      );
    });
  };

  return (
    <div>
      <div className="input-container">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search..."
          className="search-bar"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>
      <div className="search-result">{renderResult()}</div>
    </div>
  );
}

export default SearchBar;

import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();
        setPokemon(data.results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  const fetchPokemonDetails = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setSelectedPokemon(data);
    } catch (error) {
      console.error('Error fetching Pokemon details:', error);
    }
  };

  const filteredPokemon = pokemon.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="pokeball"></div>
        <p>Carregando Pokémons...</p>
      </div>
    );
  }

  return (
    <div className="pokedex-app">
      <header className="app-header">
        <h1>Pokédex</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar Pokémon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="pokedex-container">
        <div className="pokemon-list">
          {filteredPokemon.map((p) => {
            const pokemonId = p.url.split('/')[6];
            return (
              <div 
                key={p.name} 
                className="pokemon-card"
                onClick={() => fetchPokemonDetails(p.url)}
              >
                <img 
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`} 
                  alt={p.name}
                />
                <p>#{String(pokemonId).padStart(3, '0')}</p>
                <h3>{p.name.charAt(0).toUpperCase() + p.name.slice(1)}</h3>
              </div>
            );
          })}
        </div>

        {selectedPokemon && (
          <div className="pokemon-details">
            <div className="details-card">
              <h2>{selectedPokemon.name.charAt(0).toUpperCase() + selectedPokemon.name.slice(1)}</h2>
              <p>#{String(selectedPokemon.id).padStart(3, '0')}</p>
              
              <div className="pokemon-image">
                <img 
                  src={selectedPokemon.sprites.other['official-artwork'].front_default} 
                  alt={selectedPokemon.name}
                />
              </div>
              
              <div className="types">
                {selectedPokemon.types.map(type => (
                  <span key={type.slot} className={`type ${type.type.name}`}>
                    {type.type.name}
                  </span>
                ))}
              </div>
              
              <div className="stats">
                <h3>Estatísticas</h3>
                {selectedPokemon.stats.map(stat => (
                  <div key={stat.stat.name} className="stat-bar">
                    <span>{stat.stat.name}:</span>
                    <div className="bar-container">
                      <div 
                        className="bar-fill" 
                        style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                      ></div>
                      <span className="stat-value">{stat.base_stat}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
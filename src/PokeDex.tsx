import "./App.css";
import { useState, useEffect, ChangeEvent } from "react";
import ReactLoading from "react-loading";
import axios from "axios";
import Modal from "react-modal";
import React from "react";

Modal.setAppElement('#root');

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonDetail {
  name: string;
  sprites: {
    front_default: string;
  };
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
}

function PokeDex() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [pokemonDetail, setPokemonDetail] = useState<PokemonDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonsPerPage] = useState(40);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchPokemons = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=100");
        setPokemons(response.data.results);
      } catch (error) {
        console.error("Error fetching pokemons:", error);
      }
      setIsLoading(false);
    };
    fetchPokemons();
  }, []);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = () => {
    const sortedPokemons = [...pokemons].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setPokemons(sortedPokemons);
  };

  const handlePagination = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleItemClick = async (pokemon: Pokemon) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
      setPokemonDetail(response.data);
    } catch (error) {
      console.error("Error fetching pokemon details:", error);
    }
    setIsLoading(false);
  };

  const filteredPokemons = pokemons.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPokemon = currentPage * pokemonsPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
  const currentPokemons = filteredPokemons.slice(indexOfFirstPokemon, indexOfLastPokemon);

  const totalPages = Math.ceil(filteredPokemons.length / pokemonsPerPage);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Pokedex!</h1>
        {isLoading && !!pokemonDetail && <ReactLoading type="bubbles" color="#ffffff" />}
        <input
          type="text"
          placeholder="Search Pokemon..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button onClick={handleSort}>
          Sort {sortOrder === 'asc' ? 'Descending' : 'Ascending'}
        </button>
        <ul>
          {currentPokemons.map(pokemon => (
            <li
              key={pokemon.name}
              onClick={() => handleItemClick(pokemon)}
              style={{ cursor: 'pointer' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f2f2bf'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = ''}>
              {pokemon.name}
            </li>
          ))}
        </ul>
        <div>
          {Array.from({ length: totalPages }, (_, index) => (
            <button key={index} onClick={() => handlePagination(index + 1)}>
              {index + 1}
            </button>
          ))}
        </div>
        {pokemonDetail && (
          <Modal
            isOpen={!!pokemonDetail}
            onRequestClose={() => setPokemonDetail(null)}
            style={{
              content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
                background: '#1e1e1e',
                color: 'white',
                borderRadius: '10px',
                width: '300px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              },
              overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              },
            }}
          >
            {pokemonDetail && (
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ textTransform: 'capitalize', marginBottom: '20px' }}>{pokemonDetail.name}</h2>
                <img
                  src={pokemonDetail.sprites.front_default}
                  alt={pokemonDetail.name}
                  style={{ marginBottom: '20px' }}
                />
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ borderBottom: '1px solid #fff', padding: '10px 0' }}>Stats</th>
                      <th style={{ borderBottom: '1px solid #fff', padding: '10px 0' }}>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pokemonDetail.stats.map(stat => (
                      <tr key={stat.stat.name}>
                        <td style={{ padding: '8px 0', textTransform: 'capitalize' }}>{stat.stat.name}</td>
                        <td style={{ padding: '8px 0' }}>{stat.base_stat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Modal>
        )}
      </header>
    </div>
  );
}

export default PokeDex;

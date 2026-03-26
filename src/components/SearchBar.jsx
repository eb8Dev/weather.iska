import { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/50 group-focus-within:text-white transition-colors">
        <Search size={20} />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/20 transition-all shadow-lg"
        placeholder="Search for a city..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button 
        type="submit" 
        className="absolute inset-y-1 right-1 px-4 bg-blue-500/80 hover:bg-blue-600/80 text-white text-sm font-medium rounded-xl transition-colors backdrop-blur-sm"
      >
        Search
      </button>
    </form>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Cookie, ChevronRight, Loader2 } from 'lucide-react';
import { Button, Input, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@builderly/ui';

// ============================================================================
// SEARCH COMPONENTS
// ============================================================================

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  url: string;
  image?: string;
  type?: 'product' | 'page' | 'category' | 'article';
  price?: number;
}

interface SearchBoxProps {
  placeholder?: string;
  showIcon?: boolean;
  showClearButton?: boolean;
  autoComplete?: boolean;
  showRecentSearches?: boolean;
  instantSearch?: boolean;
  debounceMs?: number;
  minChars?: number;
  maxResults?: number;
  searchEndpoint?: string;
  onSearch?: (query: string) => void;
  onResultClick?: (result: SearchResult) => void;
  className?: string;
}

export function SearchBox({
  placeholder = 'Suchen...',
  showIcon = true,
  showClearButton = true,
  autoComplete = true,
  showRecentSearches = true,
  instantSearch = true,
  debounceMs = 300,
  minChars = 2,
  maxResults = 5,
  searchEndpoint,
  onSearch,
  onResultClick,
  className = '',
}: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load recent searches from localStorage
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(recent.slice(0, 5));
  }, []);

  useEffect(() => {
    if (!instantSearch || query.length < minChars) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        if (searchEndpoint) {
          const res = await fetch(`${searchEndpoint}?q=${encodeURIComponent(query)}&limit=${maxResults}`);
          const data = await res.json();
          setResults(data.results || []);
        } else {
          // Mock search for demo
          setResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, instantSearch, minChars, debounceMs, maxResults, searchEndpoint]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Save to recent searches
      const newRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
      setRecentSearches(newRecent);
      localStorage.setItem('recentSearches', JSON.stringify(newRecent));
      
      onSearch?.(query);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = results.length > 0 ? results : recentSearches;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      if (results.length > 0) {
        const result = results[selectedIndex];
        if (result) handleResultClick(result);
      } else {
        const term = recentSearches[selectedIndex];
        if (term) setQuery(term);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleResultClick = (result: SearchResult) => {
    onResultClick?.(result);
    setIsOpen(false);
    setQuery('');
  };

  const handleRecentClick = (searchTerm: string) => {
    setQuery(searchTerm);
    onSearch?.(searchTerm);
    setIsOpen(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const showDropdown = isOpen && (
    (autoComplete && results.length > 0) ||
    (showRecentSearches && recentSearches.length > 0 && query.length === 0)
  );

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        {showIcon && (
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        )}
        <Input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`${showIcon ? 'pl-10' : ''} ${showClearButton && query ? 'pr-10' : ''}`}
        />
        {showClearButton && query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
        )}
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
          {/* Results */}
          {results.length > 0 && (
            <div className="py-2">
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className={`w-full px-4 py-2 flex items-center gap-3 text-left hover:bg-gray-50 ${
                    selectedIndex === index ? 'bg-gray-50' : ''
                  }`}
                >
                  {result.image && (
                    <img src={result.image} alt="" className="h-10 w-10 object-cover rounded" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{result.title}</p>
                    {result.description && (
                      <p className="text-sm text-gray-500 truncate">{result.description}</p>
                    )}
                  </div>
                  {result.price !== undefined && (
                    <span className="text-sm font-medium">{result.price.toFixed(2)} €</span>
                  )}
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {showRecentSearches && recentSearches.length > 0 && query.length === 0 && (
            <div className="py-2">
              <div className="px-4 py-1 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 uppercase">Letzte Suchen</span>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Löschen
                </button>
              </div>
              {recentSearches.map((term, index) => (
                <button
                  key={term}
                  onClick={() => handleRecentClick(term)}
                  className={`w-full px-4 py-2 flex items-center gap-2 text-left hover:bg-gray-50 ${
                    selectedIndex === index ? 'bg-gray-50' : ''
                  }`}
                >
                  <Search className="h-4 w-4 text-gray-400" />
                  <span>{term}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface SearchResultsProps {
  query?: string;
  results?: SearchResult[];
  layout?: 'grid' | 'list';
  columns?: number;
  showFilters?: boolean;
  showSort?: boolean;
  showPagination?: boolean;
  resultsPerPage?: number;
  noResultsText?: string;
  searchingText?: string;
  onResultClick?: (result: SearchResult) => void;
  className?: string;
}

export function SearchResults({
  query = '',
  results = [],
  layout = 'grid',
  columns = 4,
  showFilters = true,
  showSort = true,
  noResultsText = 'Keine Ergebnisse gefunden',
  searchingText = 'Suche nach',
  onResultClick,
  className = '',
}: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <p className="text-gray-500">{noResultsText}</p>
        {query && (
          <p className="text-sm text-gray-400 mt-1">
            {searchingText} &quot;{query}&quot;
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {results.length} Ergebnis{results.length !== 1 ? 'se' : ''} 
          {query && ` für "${query}"`}
        </p>
        {showSort && (
          <select className="text-sm border rounded-md px-2 py-1">
            <option value="relevance">Relevanz</option>
            <option value="price-asc">Preis aufsteigend</option>
            <option value="price-desc">Preis absteigend</option>
            <option value="newest">Neueste</option>
          </select>
        )}
      </div>

      {/* Results Grid/List */}
      <div
        className={layout === 'grid' ? 'grid gap-4' : 'flex flex-col gap-4'}
        style={layout === 'grid' ? { gridTemplateColumns: `repeat(${columns}, 1fr)` } : undefined}
      >
        {results.map((result) => (
          <button
            key={result.id}
            onClick={() => onResultClick?.(result)}
            className={`text-left ${
              layout === 'grid'
                ? 'bg-white border rounded-lg p-4 hover:shadow-md transition-shadow'
                : 'bg-white border rounded-lg p-4 flex gap-4 hover:shadow-md transition-shadow'
            }`}
          >
            {result.image && (
              <img
                src={result.image}
                alt={result.title}
                className={layout === 'grid' ? 'w-full aspect-square object-cover rounded mb-3' : 'h-24 w-24 object-cover rounded'}
              />
            )}
            <div>
              <h3 className="font-medium">{result.title}</h3>
              {result.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{result.description}</p>
              )}
              {result.price !== undefined && (
                <p className="font-semibold mt-2">{result.price.toFixed(2)} €</p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// COOKIE BANNER
// ============================================================================

interface CookieBannerProps {
  title?: string;
  description?: string;
  acceptText?: string;
  declineText?: string;
  settingsText?: string;
  position?: 'bottom' | 'top' | 'center';
  showDecline?: boolean;
  showSettings?: boolean;
  privacyUrl?: string;
  privacyText?: string;
  cookieCategories?: Array<{
    id: string;
    name: string;
    description: string;
    required?: boolean;
  }>;
  onAccept?: (categories: string[]) => void;
  onDecline?: () => void;
  className?: string;
}

export function CookieBanner({
  title = 'Wir respektieren deine Privatsphäre',
  description = 'Wir verwenden Cookies, um deine Erfahrung auf unserer Website zu verbessern.',
  acceptText = 'Alle akzeptieren',
  declineText = 'Ablehnen',
  settingsText = 'Einstellungen',
  position = 'bottom',
  showDecline = true,
  showSettings = true,
  privacyUrl = '/datenschutz',
  privacyText = 'Datenschutzerklärung',
  cookieCategories = [
    { id: 'necessary', name: 'Notwendig', description: 'Diese Cookies sind für die Grundfunktionen erforderlich.', required: true },
    { id: 'analytics', name: 'Analyse', description: 'Helfen uns zu verstehen, wie Besucher unsere Website nutzen.' },
    { id: 'marketing', name: 'Marketing', description: 'Werden verwendet, um personalisierte Werbung anzuzeigen.' },
  ],
  onAccept,
  onDecline,
  className = '',
}: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    cookieCategories.filter(c => c.required).map(c => c.id)
  );

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allCategories = cookieCategories.map(c => c.id);
    localStorage.setItem('cookieConsent', JSON.stringify({
      accepted: true,
      categories: allCategories,
      timestamp: new Date().toISOString(),
    }));
    onAccept?.(allCategories);
    setIsVisible(false);
  };

  const handleDecline = () => {
    const requiredOnly = cookieCategories.filter(c => c.required).map(c => c.id);
    localStorage.setItem('cookieConsent', JSON.stringify({
      accepted: false,
      categories: requiredOnly,
      timestamp: new Date().toISOString(),
    }));
    onDecline?.();
    setIsVisible(false);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      accepted: true,
      categories: selectedCategories,
      timestamp: new Date().toISOString(),
    }));
    onAccept?.(selectedCategories);
    setShowSettingsModal(false);
    setIsVisible(false);
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (!isVisible) return null;

  const positionClasses = {
    bottom: 'fixed bottom-0 left-0 right-0',
    top: 'fixed top-0 left-0 right-0',
    center: 'fixed inset-0 flex items-center justify-center bg-black/50',
  };

  return (
    <>
      <div className={`${positionClasses[position]} z-50 ${className}`}>
        <div className={`bg-white shadow-lg p-6 ${position === 'center' ? 'rounded-xl max-w-lg mx-4' : 'border-t'}`}>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <Cookie className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-gray-600 mt-1 text-sm">
                  {description}{' '}
                  <a href={privacyUrl} className="text-primary hover:underline">
                    {privacyText}
                  </a>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-4 justify-end">
              {showSettings && (
                <Button variant="outline" onClick={() => setShowSettingsModal(true)}>
                  {settingsText}
                </Button>
              )}
              {showDecline && (
                <Button variant="outline" onClick={handleDecline}>
                  {declineText}
                </Button>
              )}
              <Button onClick={handleAcceptAll}>
                {acceptText}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Cookie-Einstellungen</DialogTitle>
            <DialogDescription>
              Wähle aus, welche Cookies du akzeptieren möchtest.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {cookieCategories.map((category) => (
              <div key={category.id} className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id={`cookie-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => toggleCategory(category.id)}
                  disabled={category.required}
                  className="mt-1"
                />
                <label htmlFor={`cookie-${category.id}`} className="flex-1">
                  <span className="font-medium">{category.name}</span>
                  {category.required && (
                    <span className="text-xs text-gray-400 ml-2">(Erforderlich)</span>
                  )}
                  <p className="text-sm text-gray-500">{category.description}</p>
                </label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettingsModal(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSaveSettings}>
              Auswahl speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

import React, { useState, ReactNode, useRef, useEffect, PropsWithChildren } from 'react';
import styled from 'styled-components';
import { FiSearch } from 'react-icons/fi';
import Fuse from 'fuse.js';

interface FiltersProps {
  onFilterChange: (query: string) => void;
  children?: ReactNode;
  tags: Array<string>;
}

export default function Filters({ onFilterChange, children, tags }: PropsWithChildren<FiltersProps>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechStack, setSelectedTechStack] = useState<string | null>(null);
  const [predictiveResults, setPredictiveResults] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onFilterChange(query);

    if (!selectedTechStack && query.trim() === '') {
      onFilterChange('');
    } else if (!selectedTechStack) {
      const options = {
        keys: ['name'],
        threshold: 0.2,
      };
      const fuse = new Fuse(tags, options);
      const result = fuse.search(query);

      setPredictiveResults(result.map((item) => item.item));
    }
  };

  const handlePredictiveItemClick = (item: string) => {
    setSelectedTechStack(item);
    onFilterChange(item);
    setSearchQuery(item);
    setIsDropdownOpen(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder="Search"
        value={selectedTechStack ? selectedTechStack : searchQuery}
        onChange={handleSearchChange}
        onFocus={() => {
          setSelectedTechStack(null);
          setSearchQuery('');
          setIsDropdownOpen(true);
        }}
      />
      <SearchIconContainer>
        <StyledSearchIcon />
      </SearchIconContainer>
      {isDropdownOpen && predictiveResults.length > 0 && (
        <PredictiveResults ref={dropdownRef}>
          {predictiveResults.map((result, index) => (
            <PredictiveResultItem
              key={index}
              onClick={() => handlePredictiveItemClick(result)}
            >
              {result}
            </PredictiveResultItem>
          ))}
        </PredictiveResults>
      )}
      {children}
    </SearchContainer>
  );
}

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  padding: 8px;
  border: none;
  border-bottom: 1px solid rgba(var(--text));
  outline: none;
  width: 30%;
  background: none;
  color: rgba(var(--text));
  font-size: 14px;
`;

const SearchIconContainer = styled.div`
  margin-left: 10px;
  color: rgba(var(--text));
`;

const StyledSearchIcon = styled(FiSearch)`
  font-size: 20px;
  color: rgba(var(--yellow));

  &:hover {
    color: rgba(var(--text));
  }
`;

const PredictiveResults = styled.div`
  position: absolute;
  top: 120%;
  left: 50%;
  transform: translateX(-50%);
  width: 30%;
  background-color: black;
  color: white;
  border-radius: 4px;
  z-index: 1;
  text-align: center;
  font-size: 16px;
  padding: 8px;
`;

const PredictiveResultItem = styled.div`
  padding: 8px;
  cursor: pointer;

  &:hover {
    background-color: rgba(var(--text), 0.5);
  }
`;

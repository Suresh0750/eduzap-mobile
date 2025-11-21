import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Search, X } from './Icons';
import { Button } from './ui/Button';

interface RequestFiltersProps {
  onSearchChange: (query: string) => void;
  onSortChange: (order: 'asc' | 'desc') => void;
  onClearSearch: () => void;
  currentSearch: string;
  currentSort: 'asc' | 'desc';
}

export const RequestFilters: React.FC<RequestFiltersProps> = ({
  onSearchChange,
  onSortChange,
  onClearSearch,
  currentSearch,
  currentSort,
}) => {
  const [localSearch, setLocalSearch] = useState(currentSearch);
  const timeoutRef = useRef<NodeJS.Timeout | number | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (localSearch.trim() || localSearch.length === 0) {
        onSearchChange(localSearch);
      }
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [localSearch, onSearchChange]);

  const handleClear = () => {
    setLocalSearch('');
    onClearSearch();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search requests by title..."
            placeholderTextColor="#6b7280"
            value={localSearch}
            onChangeText={setLocalSearch}
          />
          {localSearch.length > 0 && (
            <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
              <X size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Button
        title={currentSort === 'asc' ? 'A → Z' : 'Z → A'}
        onPress={() => onSortChange(currentSort === 'asc' ? 'desc' : 'asc')}
        variant="outline"
        size="sm"
        style={styles.sortButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  searchContainer: {
    flex: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#f3f4f6',
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  sortButton: {
    minWidth: 80,
  },
});


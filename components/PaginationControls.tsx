import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChevronLeft, ChevronRight } from './Icons';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isModal?: string | number | null,
  setIsModal? : ()=>void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isModal,
  setIsModal
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      if(isModal)setIsModal?.()
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    console.log('check the next page ',+JSON.stringify(isModal))
    if (currentPage < totalPages) {
      if(isModal)setIsModal?.()
      onPageChange(currentPage + 1);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, currentPage === 1 && styles.buttonDisabled]}
        onPress={handlePrevious}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={20} color={currentPage === 1 ? '#6b7280' : '#ffffff'} />
      </TouchableOpacity>

      <View style={styles.pageInfo}>
        <Text style={styles.pageText}>
          Page {currentPage} of {totalPages}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, currentPage === totalPages && styles.buttonDisabled]}
        onPress={handleNext}
        disabled={currentPage === totalPages}
      >
        <ChevronRight size={20} color={currentPage === totalPages ? '#6b7280' : '#ffffff'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    gap: 16,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  pageInfo: {
    minWidth: 100,
    alignItems: 'center',
  },
  pageText: {
    color: '#f3f4f6',
    fontSize: 14,
    fontWeight: '500',
  },
});


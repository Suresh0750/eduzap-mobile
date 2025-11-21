import React, { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Upload } from './Icons';

export interface ImagePreviewProps {
  uri: string | null;
  isLoading: boolean;
  onRemove: () => void;
  onPick: () => void;
}

export const ImagePreview = memo(({ uri, isLoading, onRemove, onPick }: ImagePreviewProps) => {
  if (!uri) {
    return (
      <TouchableOpacity style={styles.imagePicker} onPress={onPick} disabled={isLoading}>
        <Upload size={24} color="#60a5fa" />
        <Text style={styles.imagePickerText}>Tap to select image</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.imagePreview}>
      <Image key={uri} source={{ uri }} style={styles.image} fadeDuration={0} />
      <TouchableOpacity style={styles.removeImageButton} onPress={onRemove}>
        <Text style={styles.removeImageText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
});

ImagePreview.displayName = 'ImagePreview';

const styles = StyleSheet.create({
  imagePicker: {
    height: 120,
    borderWidth: 2,
    borderColor: '#374151',
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1f2937',
  },
  imagePickerText: {
    marginTop: 8,
    color: '#60a5fa',
    fontSize: 14,
  },
  imagePreview: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


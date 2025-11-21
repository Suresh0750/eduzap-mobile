import { FormErrors, IRequest } from '@/lib/types';
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { AlertCircle, CheckCircle, Upload } from './Icons';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';

interface RequestFormProps {
  onSuccess?: () => void;
}

export const RequestForm: React.FC<RequestFormProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [formData, setFormData] = useState<IRequest>({
    name: '',
    phone: '',
    title: '',
  });

  const handleChange = (field: keyof IRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const pickImage = async () => {
   
  };

  const removeImage = () => {
    setImageUri(null);
    setErrors((prev) => ({ ...prev, image: undefined }));
  };

  const handleSubmit = async () => {
    
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Card style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Request Anything</Text>
            <Text style={styles.subtitle}>We Deliver in 2 Hours</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Your Name *"
              value={formData.name}
              onChangeText={(value:string) => handleChange('name', value)}
              placeholder="Enter your full name"
              disabled={isLoading}
              error={errors.name}
            />

            <Input
              label="Phone Number *"
              value={formData.phone}
              onChangeText={(value:string) => handleChange('phone', value)}
              placeholder="10-digit phone number"
              keyboardType="phone-pad"
              maxLength={10}
              disabled={isLoading}
              error={errors.phone}
            />

            <Input
              label="Request Title *"
              value={formData.title}
              onChangeText={(value:string) => handleChange('title', value)}
              placeholder="E.g., RS Agrawal Maths Book"
              disabled={isLoading}
              error={errors.title}
            />

            <View style={styles.imageSection}>
              <Text style={styles.label}>Upload Image (Optional)</Text>
              {!imageUri ? (
                <TouchableOpacity
                  style={styles.imagePicker}
                  onPress={pickImage}
                  disabled={isLoading}
                >
                    <Upload size={24} color="#60a5fa" />
                  <Text style={styles.imagePickerText}>Tap to select image</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.imagePreview}>
                  <Image source={{ uri: imageUri }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={removeImage}
                  >
                    <Text style={styles.removeImageText}>✕</Text>
                  </TouchableOpacity>
                </View>
              )}
              {errors.image && (
                <View style={styles.errorContainer}>
                  <AlertCircle size={16} color="#ef4444" />
                  <Text style={styles.errorText}>{errors.image}</Text>
                </View>
              )}
            </View>

            {errors.submit && (
              <View style={styles.errorAlert}>
                <AlertCircle size={20} color="#ef4444" />
                <Text style={styles.errorAlertText}>{errors.submit}</Text>
              </View>
            )}

            {success && (
              <View style={styles.successAlert}>
                <CheckCircle size={20} color="#10b981" />
                <Text style={styles.successAlertText}>Request submitted successfully!</Text>
              </View>
            )}

            <Button
              title={isLoading ? 'Submitting...' : 'Submit Request'}
              onPress={handleSubmit}
              disabled={isLoading}
              loading={isLoading}
              style={styles.submitButton}
            />

            <Text style={styles.footerText}>
              Your request will be processed immediately
            </Text>
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    width: '100%',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f3f4f6',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#e5e7eb',
    marginBottom: 8,
  },
  imageSection: {
    marginBottom: 8,
  },
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
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
  },
  errorAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  errorAlertText: {
    flex: 1,
    color: '#ef4444',
    fontSize: 14,
  },
  successAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  successAlertText: {
    flex: 1,
    color: '#10b981',
    fontSize: 14,
  },
  submitButton: {
    marginTop: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
  },
});


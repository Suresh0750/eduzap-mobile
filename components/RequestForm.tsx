import { useCreateRequestMutation } from '@/lib/api';
import * as ImagePicker from 'expo-image-picker';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { FormErrors, IRequest } from '../lib/types';
import { mapZodErrors, requestSchema } from '../lib/validate';
import { AlertCircle, CheckCircle } from './Icons';
import { ImagePreview } from './ImagePreview';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';


interface RequestFormProps {
  onSuccess?: () => void;
}

const RequestFormComponent = ({ onSuccess }: RequestFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [formData, setFormData] = useState<IRequest>({
    name: '',
    phone: '',
    title: '',
  });
  const errorTimerID = useRef<number | null>(null);
  
  
  const nameInputRef = useRef<TextInput>(null);
  const phoneInputRef = useRef<TextInput>(null);
  const titleInputRef = useRef<TextInput>(null);


  const [mediaPermission, requestMediaPermission] = ImagePicker.useMediaLibraryPermissions();
  const createRequestMutation = useCreateRequestMutation();
  const handleChange = (field: keyof IRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const ensureMediaPermission = useCallback(async () => {
    if (mediaPermission?.granted) return true;
  
    const permissionResponse = await requestMediaPermission();
    if (!permissionResponse?.granted) {
      Alert.alert('Permission needed', 'Please grant media library permissions to upload images.');
      return false;
    }
    return true;
  }, [mediaPermission, requestMediaPermission]);
  
  const pickImage = useCallback(async () => {
    const hasPermission = await ensureMediaPermission();
    if (!hasPermission) return;
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
  
    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
    }
  }, [ensureMediaPermission]);
  

  useEffect(()=>{
    console.log('Rerender in Request Form')
  })

  const removeImage = () => {
    setImageUri(null);
    setErrors((prev) => ({ ...prev, image: undefined }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors({});
    setSuccess(false);

   
    try {
       // * Validate form data
    const validationResult = requestSchema.safeParse(formData);
    if (!validationResult.success) {
      const mappedErrors = mapZodErrors(validationResult.error.issues);
      setErrors(mappedErrors);
      setIsLoading(false);
      
     
      if (mappedErrors.name) {
        nameInputRef.current?.focus();
      } else if (mappedErrors.phone) {
        phoneInputRef.current?.focus();
      } else if (mappedErrors.title) {
        titleInputRef.current?.focus();
      } else {
        nameInputRef.current?.focus();
      }
      return;
    }

      // Create FormData for multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append('name', validationResult.data.name);
      formDataToSend.append('phone', validationResult.data.phone);
      formDataToSend.append('title', validationResult.data.title);

      if (imageUri) {
        const filename = imageUri.split('/').pop() || 'image.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        formDataToSend.append('image', {
          uri: imageUri,
          name: filename,
          type,
        } as any);
      }

      const response = await createRequestMutation.mutateAsync(formDataToSend);
     
      if (response?.data) {
        setSuccess(true);
        setFormData({ name: '', phone: '', title: '' });
        setImageUri(null);
        
        setTimeout(() => {
          setSuccess(false);
        }, 3000);

        onSuccess?.();
        Toast.show({
          type: 'success',
          text1: 'Success 🎉',
          text2: 'Request submitted successfully!',
        });
      } else {
        console.log("response from server side error", response);
        setErrors({ submit: 'Failed to submit request. Please try again.' });
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to submit request. Please try again.';
      setErrors({ submit: errorMessage });
      Toast.show({
        type: 'error',
        text1: 'Error ❌',
        text2: errorMessage ? errorMessage :'Something went wrong. Please try again.',
      });
      
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    return ()=>{
      if(errorTimerID.current){
        clearTimeout(errorTimerID.current);
        errorTimerID.current = null;
      }
    }
  },[])

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Request Anything</Text>
          <Text style={styles.subtitle}>We Deliver in 2 Hours</Text>
        </View>

        <View style={styles.form}>
          <Input
            ref={nameInputRef}
            label="Your Name *"
            value={formData.name}
            onChangeText={(value) => handleChange('name', value)}
            placeholder="Enter your full name"
            disabled={isLoading}
            error={errors.name}
          />

          <Input
            ref={phoneInputRef}
            label="Phone Number *"
            value={formData.phone}
            onChangeText={(value) => handleChange('phone', value)}
            placeholder="10-digit phone number"
            keyboardType="phone-pad"
            maxLength={10}
            disabled={isLoading}
            error={errors.phone}
          />

          <Input
            ref={titleInputRef}
            label="Request Title *"
            value={formData.title}
            onChangeText={(value) => handleChange('title', value)}
            placeholder="E.g., RS Agrawal Maths Book"
            disabled={isLoading}
            error={errors.title}
          />

          <View style={styles.imageSection}>
            <Text style={styles.label}>Upload Image (Optional)</Text>
            <ImagePreview
              uri={imageUri}
              isLoading={isLoading}
              onRemove={removeImage}
              onPick={pickImage}
            />
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
    </View>
  );
};

export const RequestForm = memo(RequestFormComponent);
RequestForm.displayName = 'RequestForm';

const styles = StyleSheet.create({
  container: {
    width: '100%',
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


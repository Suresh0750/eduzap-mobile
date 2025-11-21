import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import {
  Button,
  ButtonProps,
  Text,
  TouchableOpacity,
  View,
} from 'react-native-ui-lib';

type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export interface AlertAction {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  buttonProps?: Partial<ButtonProps>;
}

export interface UserAlertProps {
  title: string;
  description?: string;
  variant?: AlertVariant;
  actions?: AlertAction[];
  dismissible?: boolean;
  onDismiss?: () => void;
  testID?: string;
  style?: ViewStyle;
}

const VARIANT_STYLES: Record<
  AlertVariant,
  { background: string; border: string; accent: string; text: string }
> = {
  info: {
    background: '#0f172a',
    border: '#38bdf8',
    accent: '#38bdf8',
    text: '#e2e8f0',
  },
  success: {
    background: '#052e16',
    border: '#22c55e',
    accent: '#22c55e',
    text: '#dcfce7',
  },
  warning: {
    background: '#0f172a',
    border: '#3b82f6',
    accent: '#3b82f6',
    text: '#e2e8f0',
  },
  danger: {
    background: '#450a0a',
    border: '#f87171',
    accent: '#f87171',
    text: '#fee2e2',
  },
};

export const UserAlert: React.FC<UserAlertProps> = ({
  title,
  description,
  variant = 'info',
  actions,
  dismissible = false,
  onDismiss,
  testID = 'user-alert',
  style,
}) => {
  const palette = VARIANT_STYLES[variant];

  return (
    <View
      testID={testID}
      style={[
        styles.container,
        {
          backgroundColor: palette.background,
          borderColor: palette.border,
        },
        style,
      ]}
    >
      <View style={[styles.accent, { backgroundColor: palette.accent }]} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: palette.text }]}>{title}</Text>
        {description ? (
          <Text style={[styles.description, { color: palette.text }]}>
            {description}
          </Text>
        ) : null}
        {actions?.length ? (
          <View style={styles.actions}>
            {actions.map((action, index) => {
              const isSecondary = action.variant === 'secondary';

              return (
                <Button
                  key={`${action.label}-${index}`}
                  label={action.label}
                  size={Button.sizes.small}
                  outline={isSecondary}
                  onPress={action.onPress}
                  style={[
                    styles.button,
                    isSecondary && { borderColor: palette.accent },
                  ]}
                  backgroundColor={!isSecondary ? palette.accent : undefined}
                  labelStyle={[
                    styles.buttonLabel,
                    {
                      color: isSecondary ? palette.accent : '#0f172a',
                    },
                  ]}
                  {...action.buttonProps}
                />
              );
            })}
          </View>
        ) : null}
      </View>
      {dismissible ? (
        <TouchableOpacity
          accessibilityLabel="Dismiss alert"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={onDismiss}
          style={styles.dismissButton}
        >
          <Text style={[styles.dismissLabel, { color: palette.text }]}>×</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  accent: {
    width: 4,
    borderRadius: 4,
    alignSelf: 'stretch',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    opacity: 0.9,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  button: {
    minWidth: 110,
  },
  buttonLabel: {
    fontWeight: '600',
  },
  dismissButton: {
    padding: 4,
    marginLeft: 4,
  },
  dismissLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
});



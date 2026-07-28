import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useColorScheme } from '@/src/hooks/useColorScheme';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: any;
  showLoginPrompt?: boolean;
  onLoginPress?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Aucun pronostic',
  message = 'Vous n\'avez pas encore de pronostics. Commencez à parier sur des matchs !',
  icon,
  showLoginPrompt = false,
  onLoginPress,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {icon && <Image source={icon} style={styles.icon} />}
      
      <Text style={[styles.title, isDark && styles.titleDark]}>{title}</Text>
      <Text style={[styles.message, isDark && styles.messageDark]}>{message}</Text>
      
      {showLoginPrompt && (
        <Text style={[styles.loginPrompt, isDark && styles.loginPromptDark]}>
          Connectez-vous pour commencer à parier
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'white',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 20,
    opacity: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  titleDark: {
    color: '#fff',
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  messageDark: {
    color: '#aaa',
  },
  loginPrompt: {
    fontSize: 14,
    color: '#6200ee',
    marginTop: 16,
    fontWeight: '600',
  },
  loginPromptDark: {
    color: '#bb86fc',
  },
});

export default EmptyState;

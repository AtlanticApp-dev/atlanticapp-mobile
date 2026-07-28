import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Bienvenue dans Pronos',
      description: 'Découvrez une nouvelle façon de suivre les compétitions en pariant sur vos matchs préférés !',
      image: null, // Placeholder for image
    },
    {
      title: 'Comment ça marche ?',
      description: 'Pronostiquez le score des matchs avant leur début. Plus votre prédiction est précise, plus vous gagnez de points.',
      image: null,
    },
    {
      title: 'Système de points',
      description: '1 point pour un pari perdu\n10 points pour un pari gagné (bon vainqueur)\n20 points pour un pari gagné avec le score exact !',
      image: null,
    },
    {
      title: 'Classement',
      description: 'Comparez vos performances avec celles des autres utilisateurs dans le classement général ou par sport.',
      image: null,
    },
  ];

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mark onboarding as completed
      try {
        await AsyncStorage.setItem('pronosOnboardingCompleted', 'true');
      } catch (error) {
        console.error('Error saving onboarding status:', error);
      }
      onComplete();
    }
  };

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem('pronosOnboardingCompleted', 'true');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
    onComplete();
  };

  const currentStepData = steps[currentStep];

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Step indicator */}
        <View style={styles.stepIndicatorContainer}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.stepIndicator,
                index === currentStep && styles.stepIndicatorActive,
              ]}
            />
          ))}
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={[styles.title, isDark && styles.titleDark]}>
            {currentStepData.title}
          </Text>
          
          <Text style={[styles.description, isDark && styles.descriptionDark]}>
            {currentStepData.description}
          </Text>

          {/* Visual representation of points system */}
          {currentStep === 2 && (
            <View style={styles.pointsContainer}>
              <View style={[styles.pointItem, styles.lostBet]}>
                <Text style={styles.pointLabel}>Pari perdu</Text>
                <Text style={styles.pointValue}>1 pt</Text>
              </View>
              <View style={[styles.pointItem, styles.wonBet]}>
                <Text style={styles.pointLabel}>Bon vainqueur</Text>
                <Text style={styles.pointValue}>10 pts</Text>
              </View>
              <View style={[styles.pointItem, styles.exactScore]}>
                <Text style={styles.pointLabel}>Score exact</Text>
                <Text style={styles.pointValue}>20 pts</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Navigation buttons */}
      <View style={styles.buttonContainer}>
        {currentStep > 0 && (
          <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => setCurrentStep(currentStep - 1)}>
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Précédent</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleNext}>
          <Text style={[styles.buttonText, styles.primaryButtonText]}>
            {currentStep < steps.length - 1 ? 'Suivant' : 'Commencer'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Skip button */}
      {currentStep < steps.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={[styles.skipButtonText, isDark && styles.skipButtonTextDark]}>Passer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 100,
    paddingHorizontal: 24,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
    gap: 8,
  },
  stepIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
  },
  stepIndicatorActive: {
    backgroundColor: '#6200ee',
    width: 24,
  },
  contentContainer: {
    alignItems: 'center',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  titleDark: {
    color: '#fff',
  },
  description: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
    textAlign: 'center',
  },
  descriptionDark: {
    color: '#d1d5db',
  },
  pointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    width: '100%',
  },
  pointItem: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    minWidth: 100,
  },
  lostBet: {
    backgroundColor: '#fee2e2',
  },
  wonBet: {
    backgroundColor: '#dcfce7',
  },
  exactScore: {
    backgroundColor: '#fef3c7',
  },
  pointLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  pointValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24,
    paddingVertical: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  primaryButton: {
    backgroundColor: '#6200ee',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6200ee',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: 'white',
  },
  secondaryButtonText: {
    color: '#6200ee',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    padding: 8,
  },
  skipButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  skipButtonTextDark: {
    color: '#9ca3af',
  },
});

export default Onboarding;

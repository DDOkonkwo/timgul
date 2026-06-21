import { Image } from 'expo-image';
import { router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BACKGROUND_COLOR = '#f42a80';
const SPINNER_FADE_MS = 450;

export default function SplashScreenRoute() {
  const insets = useSafeAreaInsets();
  const [showSpinner, setShowSpinner] = useState(false);
  const [showAppName, setShowAppName] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => undefined);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const spinnerTimer = setTimeout(() => {
      setShowSpinner(true);
    }, 3000);

    const hideSpinnerTimer = setTimeout(() => {
      setShowSpinner(false);
    }, 8000);

    const appNameTimer = setTimeout(() => {
      setShowAppName(true);
    }, 8000 + SPINNER_FADE_MS);

    const navigateTimer = setTimeout(() => {
      router.replace('/login');
    }, 10000 + SPINNER_FADE_MS);

    return () => {
      clearTimeout(spinnerTimer);
      clearTimeout(hideSpinnerTimer);
      clearTimeout(appNameTimer);
      clearTimeout(navigateTimer);
    };
  }, [isReady]);

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/logo-white.png')}
        contentFit="contain"
        style={styles.logo}
      />

      <View style={[styles.bottomCenter, { bottom: insets.bottom + 32 }]}>
        {showSpinner ? (
          <Animated.View exiting={FadeOut.duration(SPINNER_FADE_MS)} key="spinner">
            <ActivityIndicator size="small" color="#ffffff" />
          </Animated.View>
        ) : null}

        {showAppName ? (
          <Animated.Text entering={FadeIn.duration(800)} style={styles.appName}>
            Timgul
          </Animated.Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
  },
  bottomCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 20,
  },
  appName: {
    color: '#ffffff',
    fontFamily: 'Bright Retro',
    fontSize: 15.4,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

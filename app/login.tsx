import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/logo-red.svg')}
        style={styles.logo}
        contentFit="contain"
      />

      <View style={styles.formCard}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#9aa0a6"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#9aa0a6"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Pressable style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login with Email</Text>
        </Pressable>
      </View>

      <View style={styles.socialRow}>
        <Pressable style={[styles.socialCircle, styles.googleCircle]}>
          <Image
            source={require('@/assets/images/google.svg')}
            style={styles.socialIcon}
            contentFit="contain"
          />
        </Pressable>

        <Pressable style={[styles.socialCircle, styles.appleCircle]}>
          <Image
            source={require('@/assets/images/apple.svg')}
            style={styles.socialIcon}
            contentFit="contain"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8fb',
    paddingHorizontal: 20,
    gap: 12,
  },
  logo: {
    width: 168,
    height: 168,
    marginBottom: 8,
  },
  formCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#111111',
  },
  loginButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#f42a80',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 4,
  },
  socialCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  googleCircle: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  appleCircle: {
    backgroundColor: '#111111',
  },
  socialIcon: {
    width: 32,
    height: 32,
  },
});

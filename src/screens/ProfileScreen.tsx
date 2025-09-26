import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../services/connectionFirebase';
import { updateEmail, updatePassword, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Cadastro: undefined;
  Main: undefined;
  Profile: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [email, setEmail] = useState(currentUser?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Show displayName if available; fallback to email prefix (before @) or 'Usuário'
  // Use only the displayName field for the user's name; do NOT fallback to email prefix
  const initialDisplay = currentUser?.displayName || 'Usuário';
  const [displayName, setDisplayName] = useState(initialDisplay);
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || null);
  const [showPasswordEditor, setShowPasswordEditor] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setCurrentUser(u);
      setEmail(u?.email || '');
      // update displayName strictly from auth profile (no fallback to email)
      setDisplayName(u?.displayName || 'Usuário');
      setPhotoURL(u?.photoURL || null);
    });
    return () => unsub();
  }, []);

  const isValidEmail = (value: string) => {
    // simple but effective email validation
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value.toLowerCase());
  };

  const reauthenticate = async () => {
    if (!currentUser || !currentUser.email) return Promise.reject(new Error('No user'));
    if (!currentPassword) return Promise.reject(new Error('Por favor, informe sua senha atual para confirmar a operação'));
    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
    return reauthenticateWithCredential(currentUser, credential);
  };

  const handleUpdateEmail = async () => {
    if (!email) return Alert.alert('Erro', 'Email não pode ser vazio');
    setLoading(true);
    try {
      // Reautenticar (exige senha atual)
      await reauthenticate();
      await updateEmail(currentUser!, email);
      Alert.alert('Sucesso', 'Email atualizado com sucesso');
      setCurrentPassword('');
    } catch (err: any) {
      console.error('updateEmail error:', err.code, err.message);
      // Provide actionable messages for common Firebase errors
      if (err.code === 'auth/operation-not-allowed') {
        Alert.alert('Erro', 'Esta operação não é permitida pelo provedor. Verifique nas configurações do Firebase se a alteração de email está habilitada ou se é necessário verificar o novo email antes de trocar.');
      } else if (err.code === 'auth/email-already-in-use') {
        Alert.alert('Erro', 'Este email já está em uso por outro usuário.');
      } else if (err.code === 'auth/requires-recent-login') {
        Alert.alert('Erro', 'Por segurança, por favor entre novamente antes de alterar o email.');
      } else {
        Alert.alert('Erro', err.message || 'Não foi possível atualizar o email');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      return Alert.alert('Erro', 'Senha deve ter pelo menos 6 caracteres');
    }
    setLoading(true);
    try {
      await reauthenticate();
      await updatePassword(currentUser!, newPassword);
      Alert.alert('Sucesso', 'Senha atualizada com sucesso');
      setNewPassword('');
      setCurrentPassword('');
    } catch (err: any) {
      console.error(err);
      Alert.alert('Erro', err.message || 'Não foi possível atualizar a senha');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Deletar conta',
      'Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Deletar', style: 'destructive', onPress: async () => {
          setLoading(true);
          try {
            await reauthenticate();
            await deleteUser(currentUser!);
            // After deleting the user, ensure we sign out and navigate home
            try { await auth.signOut(); } catch (e) { console.warn('signOut after delete failed', e); }
            Alert.alert('Conta deletada', 'Sua conta foi excluída com sucesso');
            navigation.navigate('Home');
          } catch (err: any) {
            console.error(err);
            Alert.alert('Erro', err.message || 'Não foi possível deletar a conta');
          } finally {
            setLoading(false);
          }
        }}
      ]
    );
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.centerRow}>
          {photoURL ? (
            <Image source={{ uri: photoURL }} style={styles.avatar} />
          ) : (
            <Image source={require('../../assets/logosemfundo.png')} style={styles.avatar} />
          )}
        </View>

        {/* Display name (read-only) */}
        <Text style={styles.title}>{displayName || 'Usuário'}</Text>


        {/* Email and password inside boxed cards for clearer visualization */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Email</Text>
              {isEditingEmail ? (
                <TextInput style={[styles.input, { marginTop: 6 }]} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
              ) : (
                <Text style={styles.fieldValue}>{currentUser?.email || ''}</Text>
              )}
            </View>

            <TouchableOpacity style={styles.smallIconButton} onPress={() => setIsEditingEmail((v) => !v)}>
              <Text style={styles.smallIconText}>{isEditingEmail ? '✕' : '✎'}</Text>
            </TouchableOpacity>
          </View>

          {isEditingEmail && (
            <View style={{ marginTop: 12 }}>
              <Text style={styles.label}>Senha atual (para confirmar)</Text>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
              />

              {/* Live validation for email */}
              <View style={{ marginTop: 10 }}>
                {emailError ? <Text style={{ color: '#e74c3c', marginBottom: 8 }}>{emailError}</Text> : null}
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={async () => {
                  if (!email) return Alert.alert('Erro', 'Email não pode ser vazio');
                  if (!isValidEmail(email)) return Alert.alert('Erro', 'Email inválido');
                  setLoading(true);
                  try {
                    await reauthenticate();
                    await updateEmail(currentUser!, email);
                    Alert.alert('Sucesso', 'Email atualizado com sucesso');
                    setIsEditingEmail(false);
                    setCurrentPassword('');
                    setEmailError('');
                  } catch (err: any) {
                    console.error(err);
                    Alert.alert('Erro', err.message || 'Não foi possível atualizar o email');
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Senha</Text>
              <Text style={styles.fieldValueMasked}>{'••••••••'}</Text>
            </View>
            <TouchableOpacity style={styles.smallIconButton} onPress={() => setShowPasswordEditor((v) => !v)}>
              <Text style={styles.smallIconText}>{showPasswordEditor ? '✕' : '✎'}</Text>
            </TouchableOpacity>
          </View>

          {showPasswordEditor && (
            <View style={{ marginTop: 12 }}>
              <Text style={styles.label}>Senha atual</Text>
              <TextInput style={styles.input} value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry />

              <Text style={[styles.label, { marginTop: 12 }]}>Nova senha</Text>
              <TextInput style={styles.input} value={newPassword} onChangeText={setNewPassword} secureTextEntry />

              <TouchableOpacity style={styles.saveButton} onPress={async () => {
                setLoading(true);
                try {
                  await reauthenticate();
                  await updatePassword(currentUser!, newPassword);
                  Alert.alert('Sucesso', 'Senha atualizada com sucesso');
                  setNewPassword('');
                  setCurrentPassword('');
                  setShowPasswordEditor(false);
                } catch (err: any) {
                  console.error(err);
                  Alert.alert('Erro', err.message || 'Não foi possível atualizar a senha');
                } finally {
                  setLoading(false);
                }
              }} disabled={loading}>
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount} disabled={loading}>
          <Text style={styles.deleteText}>Deletar Conta</Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  inner: { padding: 20, flex: 1 },
  centerRow: { alignItems: 'center', marginBottom: 12 },
  avatar: { width: 96, height: 96, borderRadius: 48, marginBottom: 8 },
  readLabel: { fontSize: 14, fontWeight: '600', color: '#2c3e50', marginTop: 12 },
  readValue: { fontSize: 16, color: '#2c3e50', marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 20, color: '#2c3e50' },
  label: { fontSize: 14, fontWeight: '600', color: '#2c3e50', marginBottom: 8 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#e9ecef' },
  button: { backgroundColor: '#3498db', padding: 14, borderRadius: 12, marginTop: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  deleteButton: { marginTop: 24, padding: 12, borderRadius: 10, alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e74c3c' },
  deleteText: { color: '#e74c3c', fontWeight: '700' },

  // Additional styles for inline editing controls
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  nameInput: { fontSize: 22, fontWeight: '700', padding: 4, minWidth: 140, textAlign: 'center' },
  smallIconButton: { marginLeft: 8, padding: 6 },
  smallIconText: { fontSize: 16, color: '#3498db', fontWeight: '700' },
  emailRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 12, marginTop: 12, borderWidth: 1, borderColor: '#e9ecef' },
  cardRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  fieldLabel: { fontSize: 13, color: '#6c757d', fontWeight: '600' },
  fieldValue: { fontSize: 16, color: '#2c3e50', marginTop: 6 },
  fieldValueMasked: { fontSize: 16, color: '#2c3e50', marginTop: 6, letterSpacing: 4 },
  saveButton: { marginTop: 10, backgroundColor: '#2ecc71', padding: 12, borderRadius: 10, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: '700' },
});

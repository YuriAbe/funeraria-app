import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [loading, setLoading] = useState(false);

  // Profile fields (read-only display, fetched from Firebase or defaults)
  const [displayName, setDisplayName] = useState(currentUser?.displayName || 'Usuário');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [cidade, setCidade] = useState(''); // TODO: fetch from DB if stored
  const [telefone, setTelefone] = useState(''); // TODO: fetch from DB if stored, format (XX) XXXXX-XXXX
  const [dataNascimento, setDataNascimento] = useState(''); // TODO: fetch from DB if stored, format DD/MM/AAAA
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || null);

  // Editing states for each field
  const [showPasswordEditor, setShowPasswordEditor] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [isEditingCidade, setIsEditingCidade] = useState(false);
  const [tempCidade, setTempCidade] = useState('');

  const [isEditingTelefone, setIsEditingTelefone] = useState(false);
  const [tempTelefone, setTempTelefone] = useState('');

  const [isEditingDataNascimento, setIsEditingDataNascimento] = useState(false);
  const [tempDataNascimento, setTempDataNascimento] = useState('');

  // Delete account flow
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      setCurrentUser(u);
      setEmail(u?.email || '');
      setDisplayName(u?.displayName || 'Usuário');
      setPhotoURL(u?.photoURL || null);
      
      // Load saved profile data from AsyncStorage
      if (u) {
        await loadProfileData(u.uid);
      }
    });
    return () => unsub();
  }, []);

  // Save profile data to AsyncStorage
  const saveProfileData = async (userId: string, data: { cidade?: string; telefone?: string; dataNascimento?: string }) => {
    try {
      const key = `profile_${userId}`;
      const existing = await AsyncStorage.getItem(key);
      const profile = existing ? JSON.parse(existing) : {};
      const updated = { ...profile, ...data };
      await AsyncStorage.setItem(key, JSON.stringify(updated));
      console.log('Profile data saved locally:', updated);
    } catch (err) {
      console.error('Error saving profile data:', err);
    }
  };

  // Load profile data from AsyncStorage
  const loadProfileData = async (userId: string) => {
    try {
      const key = `profile_${userId}`;
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        const profile = JSON.parse(stored);
        if (profile.cidade) setCidade(profile.cidade);
        if (profile.telefone) setTelefone(profile.telefone);
        if (profile.dataNascimento) setDataNascimento(profile.dataNascimento);
        console.log('Profile data loaded from local storage:', profile);
      }
    } catch (err) {
      console.error('Error loading profile data:', err);
    }
  };

  // Helper: format phone number as (XX) XXXXX-XXXX
  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  // Helper: apply phone mask while typing
  const applyPhoneMask = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    if (cleaned.length <= 11) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  };

  // Helper: format date as DD/MM/AAAA
  const formatDate = (dateStr: string) => {
    const cleaned = dateStr.replace(/\D/g, '');
    if (cleaned.length === 8) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
    }
    return dateStr;
  };

  // Helper: apply date mask while typing
  const applyDateMask = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
  };

  // Validation: check if date is valid (DD/MM/AAAA)
  const isValidDate = (dateStr: string) => {
    const cleaned = dateStr.replace(/\D/g, '');
    if (cleaned.length !== 8) return false;
    const day = parseInt(cleaned.slice(0, 2), 10);
    const month = parseInt(cleaned.slice(2, 4), 10);
    const year = parseInt(cleaned.slice(4, 8), 10);
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > new Date().getFullYear()) return false;
    return true;
  };

  const isValidEmail = (value: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value.toLowerCase());
  };

  const reauthenticate = async () => {
    if (!currentUser || !currentUser.email) return Promise.reject(new Error('No user'));
    if (!currentPassword) return Promise.reject(new Error('Por favor, informe sua senha atual para confirmar a operação'));
    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
    return reauthenticateWithCredential(currentUser, credential);
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
      setShowPasswordEditor(false);
    } catch (err: any) {
      console.error(err);
      Alert.alert('Erro', err.message || 'Não foi possível atualizar a senha');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCidade = async () => {
    if (!tempCidade.trim()) return Alert.alert('Erro', 'Cidade não pode ser vazia');
    setLoading(true);
    try {
      setCidade(tempCidade);
      // Save to AsyncStorage
      if (currentUser) {
        await saveProfileData(currentUser.uid, { cidade: tempCidade });
      }
      setIsEditingCidade(false);
      Alert.alert('Sucesso', 'Cidade atualizada com sucesso');
    } catch (err: any) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível atualizar a cidade');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTelefone = async () => {
    const cleaned = tempTelefone.replace(/\D/g, '');
    if (cleaned.length < 10 || cleaned.length > 11) {
      return Alert.alert('Erro', 'Telefone deve ter 10 ou 11 dígitos (DDD + número)');
    }
    setLoading(true);
    try {
      setTelefone(cleaned);
      // Save to AsyncStorage
      if (currentUser) {
        await saveProfileData(currentUser.uid, { telefone: cleaned });
      }
      setIsEditingTelefone(false);
      Alert.alert('Sucesso', 'Telefone atualizado com sucesso');
    } catch (err: any) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível atualizar o telefone');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDataNascimento = async () => {
    if (!isValidDate(tempDataNascimento)) {
      return Alert.alert('Erro', 'Data inválida. Use o formato DD/MM/AAAA');
    }
    const cleaned = tempDataNascimento.replace(/\D/g, '');
    setLoading(true);
    try {
      setDataNascimento(cleaned);
      // Save to AsyncStorage
      if (currentUser) {
        await saveProfileData(currentUser.uid, { dataNascimento: cleaned });
      }
      setIsEditingDataNascimento(false);
      Alert.alert('Sucesso', 'Data de nascimento atualizada com sucesso');
    } catch (err: any) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível atualizar a data de nascimento');
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


        {/* Read-only profile fields in cards */}
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Nome</Text>
          <Text style={styles.fieldValue}>{displayName || 'Usuário'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Email</Text>
          <Text style={styles.fieldValue}>{email || 'Não informado'}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Cidade</Text>
              {isEditingCidade ? (
                <TextInput
                  style={[styles.input, { marginTop: 6 }]}
                  value={tempCidade}
                  onChangeText={setTempCidade}
                  placeholder="Digite a cidade"
                />
              ) : (
                <Text style={styles.fieldValue}>{cidade || 'Não informado'}</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.smallIconButton}
              onPress={() => {
                if (isEditingCidade) {
                  setIsEditingCidade(false);
                } else {
                  setTempCidade(cidade);
                  setIsEditingCidade(true);
                }
              }}
            >
              <Text style={styles.smallIconText}>{isEditingCidade ? '✕' : '✎'}</Text>
            </TouchableOpacity>
          </View>

          {isEditingCidade && (
            <TouchableOpacity style={styles.saveButton} onPress={handleUpdateCidade} disabled={loading}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Telefone</Text>
              {isEditingTelefone ? (
                <TextInput
                  style={[styles.input, { marginTop: 6 }]}
                  value={tempTelefone}
                  onChangeText={(text) => setTempTelefone(applyPhoneMask(text))}
                  placeholder="(XX) XXXXX-XXXX"
                  keyboardType="phone-pad"
                  maxLength={15}
                />
              ) : (
                <Text style={styles.fieldValue}>{telefone ? formatPhone(telefone) : 'Não informado'}</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.smallIconButton}
              onPress={() => {
                if (isEditingTelefone) {
                  setIsEditingTelefone(false);
                } else {
                  setTempTelefone(telefone ? formatPhone(telefone) : '');
                  setIsEditingTelefone(true);
                }
              }}
            >
              <Text style={styles.smallIconText}>{isEditingTelefone ? '✕' : '✎'}</Text>
            </TouchableOpacity>
          </View>

          {isEditingTelefone && (
            <TouchableOpacity style={styles.saveButton} onPress={handleUpdateTelefone} disabled={loading}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Data de Nascimento</Text>
              {isEditingDataNascimento ? (
                <TextInput
                  style={[styles.input, { marginTop: 6 }]}
                  value={tempDataNascimento}
                  onChangeText={(text) => setTempDataNascimento(applyDateMask(text))}
                  placeholder="DD/MM/AAAA"
                  keyboardType="number-pad"
                  maxLength={10}
                />
              ) : (
                <Text style={styles.fieldValue}>{dataNascimento ? formatDate(dataNascimento) : 'Não informado'}</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.smallIconButton}
              onPress={() => {
                if (isEditingDataNascimento) {
                  setIsEditingDataNascimento(false);
                } else {
                  setTempDataNascimento(dataNascimento ? formatDate(dataNascimento) : '');
                  setIsEditingDataNascimento(true);
                }
              }}
            >
              <Text style={styles.smallIconText}>{isEditingDataNascimento ? '✕' : '✎'}</Text>
            </TouchableOpacity>
          </View>

          {isEditingDataNascimento && (
            <TouchableOpacity style={styles.saveButton} onPress={handleUpdateDataNascimento} disabled={loading}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Password card: only editable field */}

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

        {/* Delete flow: show inline password confirmation before performing deletion */}
        {!showDeleteConfirm ? (
          <TouchableOpacity style={styles.deleteButton} onPress={() => setShowDeleteConfirm(true)} disabled={loading}>
            <Text style={styles.deleteText}>Deletar Conta</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Confirme sua senha para deletar a conta</Text>
            <TextInput style={[styles.input, { marginTop: 8 }]} value={deletePassword} onChangeText={setDeletePassword} secureTextEntry placeholder="Senha atual" />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
              <TouchableOpacity style={[styles.saveButton, { backgroundColor: '#e74c3c', flex: 1, marginRight: 8 }]} onPress={async () => {
                // perform delete using the provided password
                setLoading(true);
                try {
                  if (!deletePassword) return Alert.alert('Erro', 'Informe sua senha para confirmar a exclusão');
                  // reauthenticate using the deletePassword
                  if (!currentUser || !currentUser.email) throw new Error('Usuário não autenticado');
                  const credential = EmailAuthProvider.credential(currentUser.email, deletePassword);
                  await reauthenticateWithCredential(currentUser, credential);
                  await deleteUser(currentUser);
                  try { await auth.signOut(); } catch (e) { console.warn('signOut after delete failed', e); }
                  Alert.alert('Conta deletada', 'Sua conta foi excluída com sucesso');
                  setShowDeleteConfirm(false);
                  setDeletePassword('');
                  navigation.navigate('Home');
                } catch (err: any) {
                  console.error('deleteUser error:', err.code, err.message || err);
                  if (err.code === 'auth/wrong-password') {
                    Alert.alert('Erro', 'Senha incorreta. Tente novamente.');
                  } else if (err.code === 'auth/requires-recent-login') {
                    Alert.alert('Erro', 'Por segurança, faça login novamente antes de deletar a conta.');
                  } else {
                    Alert.alert('Erro', err.message || 'Não foi possível deletar a conta');
                  }
                } finally {
                  setLoading(false);
                }
              }}>
                <Text style={styles.saveButtonText}>Confirmar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#6c757d', flex: 1 }]} onPress={() => { setShowDeleteConfirm(false); setDeletePassword(''); }}>
                <Text style={{ color: '#6c757d', fontWeight: '700' }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

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

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import {
  Container,
  Title,
  BackToSignInButton,
  BackToSignInButtonText,
} from './styles';

const SignIn: React.FC = () => {
  const [
    shouldRenderBackToSignInButton,
    _setShouldRenderBackToSignInButton,
  ] = useState(true);

  const navigation = useNavigation();

  const hideBackToSignInButton = useCallback(() => {
    _setShouldRenderBackToSignInButton(Platform.OS === 'ios');
  }, []);

  const showBackToSignInButton = useCallback(() => {
    _setShouldRenderBackToSignInButton(true);
  }, []);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', hideBackToSignInButton);

    Keyboard.addListener('keyboardDidHide', showBackToSignInButton);

    return () => {
      Keyboard.removeListener('keyboardDidShow', hideBackToSignInButton);

      Keyboard.removeListener('keyboardDidHide', showBackToSignInButton);
    };
  }, [hideBackToSignInButton, showBackToSignInButton]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoImg} />
            <View>
              <Title>Crie sua conta</Title>
            </View>

            <Input name="name" icon="user" placeholder="Nome" />
            <Input name="email" icon="mail" placeholder="E-mail" />
            <Input name="password" icon="lock" placeholder="Senha" />

            <Button>Cadastrar</Button>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      {shouldRenderBackToSignInButton && (
        <BackToSignInButton onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#fff" />
          <BackToSignInButtonText>Voltar para logon</BackToSignInButtonText>
        </BackToSignInButton>
      )}
    </>
  );
};

export default SignIn;

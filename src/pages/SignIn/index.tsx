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
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText,
} from './styles';

const SignIn: React.FC = () => {
  const [
    shouldRenderCreateAccountButton,
    _setShouldRenderCreateAccountButton,
  ] = useState(true);

  const navigation = useNavigation();

  const hideBackToSignInButton = useCallback(() => {
    _setShouldRenderCreateAccountButton(Platform.OS === 'ios');
  }, []);

  const showBackToSignInButton = useCallback(() => {
    _setShouldRenderCreateAccountButton(true);
  }, []);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', hideBackToSignInButton);
    Keyboard.addListener('keyboardDidHide', showBackToSignInButton);

    return () => {
      Keyboard.removeListener('keyboardDidShow', showBackToSignInButton);
      Keyboard.removeListener('keyboardDidHide', hideBackToSignInButton);
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
              <Title>Faça seu logon</Title>
            </View>

            <Input name="email" icon="mail" placeholder="E-mail" />
            <Input name="password" icon="lock" placeholder="Senha" />

            <Button>Entrar</Button>

            <ForgotPassword>
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      {shouldRenderCreateAccountButton && (
        <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
          <Icon name="log-in" size={20} color="#ff9000" />
          <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
        </CreateAccountButton>
      )}
    </>
  );
};

export default SignIn;

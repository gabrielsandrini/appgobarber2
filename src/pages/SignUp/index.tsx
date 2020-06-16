import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as Yup from 'yup';

import { useNavigation } from '@react-navigation/native';

import {
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TextInput,
  Alert,
} from 'react-native';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';
import Icon from 'react-native-vector-icons/Feather';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import {
  Container,
  Title,
  BackToSignInButton,
  BackToSignInButtonText,
} from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const [
    shouldRenderBackToSignInButton,
    _setShouldRenderBackToSignInButton,
  ] = useState(true);

  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const navigation = useNavigation();

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .email('Digite um e-mail válido')
            .required('E-mail obrigatório'),
          password: Yup.string().min(6, 'No mínimo 6 dígitos'),
        });

        await schema.validate(data, { abortEarly: false });

        await api.post('/users', data);

        navigation.goBack();

        Alert.alert(
          'Cadastro realizado!',
          'Você já pode fazer seu logon no GoBarber!',
        );
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro no cadastro',
          'Occoreu um erro ao fazer cadastro, tente novamente',
        );
      }
    },
    [navigation],
  );

  // Keyboard Handlers
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
            <Form onSubmit={handleSubmit} ref={formRef}>
              <Input
                name="name"
                icon="user"
                placeholder="Nome"
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => emailInputRef.current?.focus()}
              />
              <Input
                ref={emailInputRef}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />
              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Cadastrar
              </Button>
            </Form>
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

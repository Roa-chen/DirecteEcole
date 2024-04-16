import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, Button, ActivityIndicator, TouchableOpacity, Alert, Switch, Keyboard, BackHandler } from 'react-native';
import { BorderRadius, Colors, FontSize, Spaces, SubTitleText, TitleText } from '../GlobalStyles';
import { FetchingResponse } from '../assets/constants';
import { getQuestions } from '../services';
import { FlatList } from 'react-native-gesture-handler';

interface Props {
  logIn: (username: string, password: string, response: string, token: string) => Promise<FetchingResponse>
}

const Auth: React.FC<Props> = ({ logIn }) => {

  const [usernameText, setUsernameText] = useState('');
  const [passwordText, setPasswordText] = useState('');
  const [response, setResponse] = useState('');
  const [token, setToken] = useState('');

  const [question, setQuestion] = useState('');

  let [responses, setResponses] = useState<[string] | []>([]);
  let [responsesB64, setResponsesB64] = useState<[string] | []>([]);

  const [isQuestion, setIsQuestion] = useState(false);


  const [showPassword, setShowPassword] = useState(false);
  const [fetching, setFetching] = useState(false);


  return (

    !isQuestion ? (
      <View style={styles.container}>
        <Text style={styles.title}>DirecteEcole</Text>

        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}>

          <TextInput style={styles.textInput} placeholder='Identifiant EcoleDirecte' value={usernameText} onChangeText={setUsernameText} cursorColor={Colors.callToAction} selectionColor={Colors.transparentCallToAction} autoCapitalize='none' />
          <TextInput style={styles.textInput} placeholder='Mot de passe EcoleDirecte' value={passwordText} onChangeText={setPasswordText} cursorColor={Colors.callToAction} selectionColor={Colors.transparentCallToAction} autoCapitalize='none' secureTextEntry={!showPassword} />

          <View style={styles.showPasswordContainer} >
            <Text style={styles.showPasswordText} >Afficher le mot de passe</Text>
            <Switch
              value={showPassword}
              thumbColor={Colors.callToAction}
              trackColor={{
                true: Colors.transparentCallToAction
              }}
              onValueChange={(value) => setShowPassword(!showPassword)}
            />
          </View>

          <View style={{
            width: '70%',
            height: 1,
            backgroundColor: Colors.lightBackground,
            marginTop: Spaces.small,
            marginBottom: Spaces.medium,
          }} />

          <TouchableOpacity
            onPress={() => {
              setFetching(true)

              getQuestions(usernameText, passwordText).then((connectionResponse) => {
                setFetching(false);
                if (!connectionResponse.success) {
                  Alert.alert('Erreur:', connectionResponse.message)
                } else {
                  setQuestion(connectionResponse.data?.question ?? '');
                  setResponses(connectionResponse.data?.responses ?? []);
                  setResponsesB64(connectionResponse.data?.responsesB64 ?? []);
                  setToken(connectionResponse?.token ?? '');
                  setIsQuestion(true);
                }
                Keyboard.dismiss()
              })
            }}
            style={{ width: '100%' }}
          >
            <>
              <View style={styles.connectionButton}>
                <Text style={styles.connectionText}>Se connecter</Text>
                {fetching && <ActivityIndicator color={Colors.transparentCallToAction} style={styles.activityIndicator} size={'large'} />}
              </View>
            </>
          </TouchableOpacity>
        </View>
      </View>
    ) : (
      <View style={styles.container}>

        <TouchableOpacity style={styles.backButton} onPress={() => {
          setIsQuestion(false)
          setUsernameText("");
          setPasswordText("");
        }}>
          <Text style={[styles.responseText, { color: Colors.callToAction, marginVertical: 0 }]}>Retour</Text>
        </TouchableOpacity>

        {/* <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}> */}


          <Text style={styles.questionText}>{question}</Text>

        {/* </View> */}

        <FlatList
          data={responses}
          style={{ width: '100%' }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: selfResponse, index }) => (
            <View key={'response-' + index} style={[styles.responseContainer, (response == responsesB64[index]) && { borderColor: Colors.callToAction, borderWidth: 2 }]}>
              <TouchableOpacity style={{ width: '100%', alignItems: 'center', justifyContent: 'center', marginVertical: Spaces.extra_small }} onPress={() => {
                setResponse(responsesB64[index]);
                console.log(selfResponse, responses[index], response);
              }}>

                <Text style={styles.responseText}>{selfResponse}</Text>
              </TouchableOpacity>
            </View>
          )
          }
        />

        <TouchableOpacity
          onPress={() => {
            setFetching(true)
            logIn(usernameText, passwordText, response, token).then((connectionResponse) => {
              setFetching(false)
              if (!connectionResponse.success) {
                Alert.alert('Erreur:', connectionResponse.message)
              }
              Keyboard.dismiss()
            })
          }}
          style={[styles.connectionButton, { marginVertical: Spaces.small, borderRadius: BorderRadius.small }]}
        >
          <Text style={styles.responseText}>Valider</Text>
          {fetching && <ActivityIndicator color={Colors.transparentCallToAction} style={styles.activityIndicator} size={'large'} />}
        </TouchableOpacity>
      </View>
    )
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: Spaces.large,
  },
  title: {
    ...TitleText,
    fontSize: FontSize.large * 2,
  },
  textInput: {
    backgroundColor: Colors.lightBackground,
    width: '100%',
    paddingHorizontal: Spaces.small,
    marginBottom: Spaces.small,
    borderRadius: BorderRadius.medium,
    ...SubTitleText,
    color: Colors.lightText,
  },
  connectionButton: {
    borderColor: Colors.callToAction,
    borderWidth: 1,
    borderRadius: BorderRadius.medium,
    width: '100%',
    paddingVertical: Spaces.small,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  connectionText: {
    ...SubTitleText,
    fontSize: FontSize.medium,
    fontWeight: 'bold',
    color: Colors.lightText,
  },
  activityIndicator: {
    marginLeft: Spaces.small,
  },
  showPasswordContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  showPasswordText: {
    ...SubTitleText,
    marginLeft: Spaces.extra_small,
  },
  responseContainer: {
    backgroundColor: Colors.lightBackground,
    borderRadius: BorderRadius.small,
    borderColor: Colors.transparentCallToAction,
    borderWidth: 1,
    marginBottom: Spaces.extra_small,
    width: '100%',
    paddingVertical: Spaces.extra_small,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  questionText: {
    ...SubTitleText,
    fontSize: FontSize.medium,
    fontWeight: 'bold',
    color: Colors.lightText,
    marginBottom: Spaces.large,
    marginTop: Spaces.small,
  },
  responseText: {
    ...SubTitleText,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: Spaces.small,
    // position: 'absolute',
    // top: Spaces.small,
    // left: Spaces.small,
  }
})

export default Auth;
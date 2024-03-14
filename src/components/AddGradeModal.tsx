import React, { useState } from 'react';
import { View, StyleSheet, Button, Text, TouchableOpacity, Keyboard } from 'react-native';
import Modal from './Modal/Modal';
import TitleLine from './Modal/TitleLine';
import InputLine from './Modal/InputLine';
import { useAppDispatch } from '../assets/utils';
import { createGrade } from '../reducers/UserSlice';
import { Discipline, Period } from '../assets/constants';
import { BorderRadius, Colors, FontSize, Spaces, SubTitleText } from '../GlobalStyles';

interface Props {
  visible: boolean,
  onDismiss: () => void,
  periodIndex: number,
  discipline: Discipline,
}

const AddGradeModal: React.FC<Props> = ({ visible, onDismiss, periodIndex, discipline }) => {

  const dispatch = useAppDispatch();

  const [value, setValue] = useState<string>("");
  const [denominator, setDenominator] = useState("20");
  const [coefficient, setCoefficient] = useState("1");



  return (
    <Modal visible={visible} onDismiss={onDismiss}>
      <View style={styles.container}>
        <TitleLine text='Paramètres de la note' />

        <InputLine name={'Valeur'} value={value} onChange={setValue} numeric autoFocus />
        <InputLine name={'Denominateur'} value={denominator} onChange={setDenominator} numeric />
        <InputLine name={'Coefficient'} value={coefficient} onChange={setCoefficient} numeric />

        <View style={{ width: '100%' }}>
          <TouchableOpacity onPress={() => {
            if (value > denominator) {
              return;
            }
            dispatch(createGrade({
              value: Number(value),
              denominator: Number(denominator),
              coef: Number(coefficient),
              codeDiscipline: discipline.codeDiscipline,
              periodIndex,
            }))
            visible = false;
            onDismiss();
          }} >

            <View style={styles.buttonContainer}>
              <Text style={styles.buttonText}>Créer</Text>
            </View>
          </TouchableOpacity>
        </View>

      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  buttonContainer: {
    borderColor: Colors.callToAction,
    borderWidth: 1,
    borderRadius: BorderRadius.medium,
    width: '100%',
    paddingVertical: Spaces.small,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: Spaces.medium,
  },
  buttonText: {
    ...SubTitleText,
    fontSize: FontSize.medium,
    fontWeight: 'bold',
    color: Colors.lightText,
  },
})

export default AddGradeModal;
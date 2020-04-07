import React from 'react';
import {Button, Modal, StyleSheet, Text} from 'react-native';

const RosConnectionModal = props => {
  return (
    <Modal visible={props.visible} animationType={props.animationType}>
      <Text>Ciao</Text>
      <Button title={'Hide'} onPress={() => props.onHide()} />
    </Modal>
  );
};

const styles = StyleSheet.create({});

export default RosConnectionModal;

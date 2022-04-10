import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Platform,Image
} from 'react-native';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import { initializeApp, getApp } from 'firebase/app';
import { getAuth, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
 
export default function LoginScreen() {
  // Ref or state management hooks
  const app = getApp();
  const auth = getAuth();
  const recaptchaVerifier = React.useRef(null);
  const [phoneNumber, setPhoneNumber] = React.useState();
  const [verificationId, setVerificationId] = React.useState();
  const [verificationCode, setVerificationCode] = React.useState();
 
  const firebaseConfig = app ? app.options : undefined;
  const [message, showMessage] = React.useState();
  const attemptInvisibleVerification = false;
  return (
    
    <View >
      
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options}
        // attemptInvisibleVerification
      />
      <Image style={styles.Image} source={require('./assets/Logo-Login.png')}/>
      <View style={styles.content}>
      <Text style={{ marginTop: 20 }}>กรอกหมายเลขโทรศัพท์ :</Text>
      <TextInput
        style={{ marginVertical: 10, fontSize: 17 }}
        placeholder="+66 999 999 9999"
        autoFocus
        autoCompleteType="tel"
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        onChangeText={phoneNumber => setPhoneNumber(phoneNumber)}
      />
      <Button color={"#CF8083"} style={styles.Button}
        title="ส่งรหัสยืนยันตัวตนไปยังหมายเลขโทรศัพท์"
        disabled={!phoneNumber}
        onPress={async () => {
          // The FirebaseRecaptchaVerifierModal ref implements the
          // FirebaseAuthApplicationVerifier interface and can be
          // passed directly to `verifyPhoneNumber`.
          try {
            const phoneProvider = new PhoneAuthProvider(auth);
            const verificationId = await phoneProvider.verifyPhoneNumber(
              phoneNumber,
              recaptchaVerifier.current
            );
            setVerificationId(verificationId);
            showMessage({
              text: 'รหัสยืนยันถูกส่งไปยัง'+{phoneNumber}+'เรียบร้อยแล้ว',
            });
          } catch (err) {
            showMessage({ text: `Error: ${err.message}`, color: 'red' });
          }
        }}
      />
      <Text style={{ marginTop: 20 }}>กรอกรัหสยืนยันตัวตน </Text>
      <TextInput
        style={{ marginVertical: 10, fontSize: 17 }}
        editable={!!verificationId}
        placeholder="88150"
        onChangeText={setVerificationCode}
      />
      <Button color={"#CF8083"} style={styles.Button}
        title="ยืนยันรหัสยืนยันตัวตน"
        disabled={!verificationId}
        onPress={async () => {
          try {
            const credential = PhoneAuthProvider.credential(
              verificationId,
              verificationCode
            );
            await signInWithCredential(auth, credential);
            showMessage({ text: 'ยืนยันตัวตนสำเร็จ 👍' });
          } catch (err) {
            showMessage({ text: `Error: ${err.message}`, color: 'red' });
          }
        }}
      />
      {message ? (
        <TouchableOpacity
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 0xffffffee, justifyContent: 'center' },
          ]}
          onPress={() => showMessage(undefined)}>
          <Text
            style={{
              color: message.color || 'blue',
              fontSize: 17,
              textAlign: 'center',
              margin: 20,
            }}>
            {message.text}
          </Text>
        </TouchableOpacity>
      ) : (
        undefined
      )}
      {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
      </View>
      <StatusBar backgroundColor="rgba(140,0,0,0.3)" style="light" barStyle="light-content"/>
    </View>
  );
}

const styles = StyleSheet.create({
  Image:{
    width:"100%",
    height:"40%",
    marginTop:"10%",
  },
  content:{
    padding:"5%", 
    backgroundColor:"#FBE9DD",
    height:"60%",
    borderRadius:10
  },
});
import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, LogBox, Image,SafeAreaView,ScrollView } from 'react-native';
import firebase from 'firebase/compat/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { Provider as PaperProvider, Card, List, Button } from 'react-native-paper';
import Constants from 'expo-constants';
import LoginScreen from './Login';

const firebaseConfig = {
  apiKey: "AIzaSyArFK_LCKtIVGwzys-t5uyVMvu_YIiI1y0",
  authDomain: "waewhereproject.firebaseapp.com",
  projectId: "waewhereproject",
  storageBucket: "waewhereproject.appspot.com",
  messagingSenderId: "435883205021",
  appId: "1:435883205021:web:f9e4deb5ce4aed2ba78f74"
};



LogBox.ignoreAllLogs(true);
 
try {
  firebase.initializeApp(firebaseConfig);
} catch (err) {   }
 
function dbListener(path,setData){
   const tb = ref(getDatabase(), path);
   onValue(tb, (snapshot)=>{
     setData(snapshot.val());
   })
}
 
function renderWaewhere(item,index, setItem){
  // var icon = <Image style={{width:30,height:20}} source={{uri:`https://covid19.who.int/countryFlags/${item.code}.png`}}/>

  return <List.Item onPress={()=>setItem(item)} title={item.name} description={item.time} ></List.Item>
}
function coverphoto(props){
  var cover = "a";
  if(props.item.code == "cov00"){
    cover = require('./assets/cov00.jpg');
  }
  else if(props.item.code == "cov01"){
    cover = require('./assets/cov01.jpg');
  }
  else if(props.item.code == "cov02"){
    cover = require('./assets/cov02.jpg');
  }
  else if(props.item.code == "cov03"){
    cover = require('./assets/cov03.jpg');
  }
  else{
    cover = require('./assets/cov04.jpg');
  }
  return cover
}
 
function Detail(props){
  var cover = props.item.code;
   return <View>
     <Card >
         <Card.Cover source={coverphoto(props)}></Card.Cover>
      <Card.Title title={props.item.name} />
      <Card.Content>
        <Text>คำอธิบาย : {props.item.caption}</Text>
        <Text>ตำแหน่งที่ตั้ง : {props.item.location}</Text>
        <Text>เวลาที่ควรมา : {props.item.time}</Text>
        <Text>กิจกรรมที่แนะนำ : {props.item.recommend}</Text>
        <Text>แผนที่ : {props.item.map}</Text>
      </Card.Content>
      </Card>
     <Button  onPress={() => props.setItem(null) }>
      Back
      </Button>
   </View>
};

function Loading(){
  return <View><Text>Loading</Text></View>
}
 
 
export default function App() {
  const [waewhere, setWaewhere] = React.useState([]);
  const [user, setUser] = React.useState(null);
  const [citem, setCitem] = React.useState(null);
 
  React.useEffect(() => {
    var auth = getAuth();
    auth.onAuthStateChanged(function (us) {
      setUser(us);
    });
    dbListener("/waewhere", setWaewhere);
  }, []);
 
  if (user == null) {
    return <LoginScreen/>;
  }
  if (waewhere.length == 0) {
    return <Loading />;
  }
 
  if(citem!=null){
    return <Detail item={citem} setItem={setCitem} />;
  }
  return (
<PaperProvider>      
    <View style={styles.container}>    
     <ScrollView >          
      <Card >      
      <Card.Cover source={require("./assets/Logo-Home.png")}/>  
      {/* <Card.Title title="Coronavirus Situation" style={styles.scroll}/>     */}
      <Card.Content style={styles.scroll}>
      <Text style={styles.Text}>Your Phone Number: {user.phoneNumber}</Text>          
      <FlatList data={waewhere}
        renderItem={ ({item,index})=> renderWaewhere(item, index, setCitem) } >
      </FlatList>          
      </Card.Content>
             
      </Card>              
     </ScrollView>  
    </View>
    <Text> เลือก {JSON.stringify(citem)}</Text>
    <Button icon="logout" mode="contained" onPress={() => getAuth().signOut()}>
      Sign Out
      </Button>
      {/* <Button icon="logout" mode="contained" onPress={() => addItem(corona.length) }>
      Add
      </Button> */}
      <StatusBar backgroundColor="rgba(200,0,0,0.4)" style="light" barStyle="light-content"/>
    </PaperProvider>
 
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight,
  },Text: {
    color:'#E68E00',
  },
  scroll:{
    maxHeight:"100%",
    backgroundColor: '#E8FEFE',
  },
  Image:{
    width:200,
    height:120,
  }
});


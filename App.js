import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, LogBox, Image, SafeAreaView, ScrollView } from 'react-native';
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
} catch (err) { }

function dbListener(path, setData) {
  const tb = ref(getDatabase(), path);
  onValue(tb, (snapshot) => {
    setData(snapshot.val());
  })
}

function renderWaewhere(item, index, setItem) {
  // var icon = <Image style={{width:30,height:20}} source={{uri:`https://covid19.who.int/countryFlags/${item.code}.png`}}/>

  return <List.Item style={styles.menu} onPress={() => setItem(item)} title={item.name} description={"ช่วงเวลาแนะนำ : " + item.time} ></List.Item>
}
function coverphoto(props) {
  var cover = "a";
  if (props.item.code == "cov00") {
    cover = require('./assets/cov00.jpg');
  }
  else if (props.item.code == "cov01") {
    cover = require('./assets/cov01.jpg');
  }
  else if (props.item.code == "cov02") {
    cover = require('./assets/cov02.jpg');
  }
  else if (props.item.code == "cov03") {
    cover = require('./assets/cov03.jpg');
  }
  else {
    cover = require('./assets/cov04.jpg');
  }
  return cover
}

function Detail(props) {
  var cover = props.item.code;
  return <View style={styles.showdetail}>
    <Image style={styles.img2} source={coverphoto(props)} />
    <ScrollView >
      <Card style={styles.showdetail}>

        <Card.Title style={styles.title} title={props.item.name} />
        <Card.Content style={styles.content}>

          <Text style={styles.line}>คำอธิบาย : {props.item.caption}</Text>
          <Text style={styles.line}>ตำแหน่งที่ตั้ง : {props.item.location}</Text>
          <Text style={styles.line}>ช่วงเวลาแนะนำ : {props.item.time}</Text>
          <Text style={styles.line}>กิจกรรมที่แนะนำ : {props.item.recommend}</Text>
          <Text style={styles.line}>แผนที่ : {props.item.map}</Text>
          <Button onPress={() => props.setItem(null)} style={styles.back} mode="contained" >
            กลับหน้าหลัก
          </Button>
        </Card.Content>

      </Card>
    </ScrollView >

  </View>
};

function Loading() {
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
    return <LoginScreen />;
  }
  if (waewhere.length == 0) {
    return <Loading />;
  }

  if (citem != null) {
    return <Detail item={citem} setItem={setCitem} />;
  }
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Image style={styles.img} source={require("./assets/Logo-Home.png")} />
        <ScrollView >
          <Card >

            {/* <Card.Title title="Coronavirus Situation" style={styles.scroll}/>     */}
            <Card.Content style={styles.scroll}>
              <Text style={styles.Text}>หมายเลขโทรศัพท์ที่เข้าใช้งาน : {user.phoneNumber}</Text>
              <FlatList data={waewhere}
                renderItem={({ item, index }) => renderWaewhere(item, index, setCitem)} >
              </FlatList>
            </Card.Content>
            <Card.Cover source={require("./assets/map.png")} />
          </Card>
        </ScrollView>
      </View>

      <Button icon="logout" mode="contained" onPress={() => getAuth().signOut()} style={styles.out}>
        ออกจากระบบ
      </Button>
      {/* <Button icon="logout" mode="contained" onPress={() => addItem(corona.length) }>
      Add
      </Button> */}
      <StatusBar backgroundColor="rgba(200,0,0,0.4)" style="light" barStyle="light-content" />
    </PaperProvider>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight,
  },
  Text: {
    color: '#E68E00',
  },
  scroll: {
    maxHeight: "100%",
    backgroundColor: '#FDF6F1',
    padding: "6%",
  },
  Image: {
    width: 200,
    height: 120,
  },
  menu: {
    color: "#FDF6F1",
    backgroundColor: '#5CA6B5',
    marginTop: "5%",
    marginLeft: "3%",
    marginRight: "3%",
    borderRadius: 5,
  },
  out: {
    backgroundColor: '#D9AF58',
  },
  back: {
    backgroundColor: '#D9AF58',

  },
  showdetail: {
    backgroundColor: '#FBE9DD',
    height: "100%",
  },
  title: {
    marginTop: "2%",
    marginLeft: "3%",
    color: '#325D88',
  },
  content: {
    backgroundColor: '#FDF4EE',
    paddingTop: "5%",
    paddingLeft: "7%",
    paddingRight: "7%",
    paddingBottom: "7%",
    margin: "5%",
    marginBottom: "11%",
    borderRadius: 7,
  },
  line: {
    marginBottom: "9%",
  },
  img: {
    width: "100%",
    height: "30%"
  },
  img2: {
    width: "100%",
    height: "25%"
  }
});


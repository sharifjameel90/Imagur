import React from 'react'
import { 
  View, 
  StyleSheet, 
  TextInput, 
  Image, 
  ScrollView, 
  TouchableWithoutFeedback, 
  Keyboard,
  PermissionsAndroid
} from 'react-native'
import { Header, Button, Overlay , Text} from 'react-native-elements'
import RNFetchBlob from 'rn-fetch-blob';
export default function App() {
  const [image, setImage] = React.useState()
  const [count, setCount] = React.useState()
  const [value, setValue] = React.useState()
  const [visible, setVisible] = React.useState(false);
  const [imageurl, setImageUrl] = React.useState()

  const offOverlay = () => {
    setVisible(false);
    setImageUrl()
  };
  const onOverlay = (OverlayImageUrl) => {
    setVisible(true)
    setImageUrl(OverlayImageUrl)
  }

  const checkPermission = async() => {
    if (Platform.OS === 'ios') {
      downloadFile();
      offOverlay()
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'Application needs access to your storage to download File',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Start downloading
          downloadFile();
          offOverlay()
        } else {
          // If permission denied then show alert
          alert('Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        alert("++++"+err);
      }
    }
  };
  const downloadFile = () => {
   
    // Get today's date to add the time suffix in filename
    let date = new Date();
    // File URL which we want to download
    let FILE_URL = imageurl;    
    // Function to get extention of the file url
    let file_ext = getFileExtention(FILE_URL);
   
    file_ext = '.' + file_ext[0];
   
    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
    const { config, fs } = RNFetchBlob;
    let RootDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir+
          '/file_' + 
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,   
      },
    };
    config(options)
      .fetch('GET', FILE_URL)
      .then(res => {
        // Alert after successful downloading
        alert('File Downloaded Successfully.');

      });
  };
 
  const getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ?
             /[^.]+$/.exec(fileUrl) : undefined;
  };
    const Overlays = () => {
      return (
        <View style={{width:150, height:150}}>
          <Overlay isVisible={visible} onBackdropPress={offOverlay}>
            <Button onPress={checkPermission} style={{padding:5}} title="Download"/>
          </Overlay>
        </View>
        )
    }

   function FetchData() {
    if(image && count) {
      return fetch(`https://bing-image-search1.p.rapidapi.com/images/search?q=${image}&count=${count}`,{
        "method": "GET",
        "headers": {
          "x-rapidapi-key": "Your App ID",
          "x-rapidapi-host": "bing-image-search1.p.rapidapi.com"
        }
      })
  .then((response) => response.json())
  .then((responseJson) => {
    setValue(responseJson.value)
  })
  .catch(err => {
    console.error(err);
  });
    } else {
      alert("Please Enter Every value")
    }
  }
   function Clear() {
    setValue()
    setCount('')
    setImage('')
  }
  if(value && count) {
    return (
      <>
      <Header
        leftComponent={{ icon: 'arrow-back',onPress: () => Clear(), color: '#fff' }}
        centerComponent={{ text: 'Imagur', style: { color: '#fff' } }}
      />
      <ScrollView>
        {value.map((items) => (
          <TouchableWithoutFeedback onLongPress={() => {
            onOverlay(items.contentUrl)
           }}
           delayLongPress={2000}
        >

        <Image source={{uri: items.contentUrl}} key={items.imageId} style={{ resizeMode: 'cover', width: items.thumbnail.width, height: items.thumbnail.height }}/>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>
      <Overlays/>
      </>
    )
  }
  return (
    <>
      <Header
        centerComponent={{ text: 'Imagur', style: { color: '#fff' } }}
      />
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={styles.container}>
      <TextInput placeholder="Image Name" style={styles.textInput} value={image} onChangeText={setImage}/>
      <TextInput placeholder="How Much Images You Want" style={styles.textInput} value={count} onChangeText={setCount}/>
        <Button onPress={() => FetchData()} title="Search Image"/>
    </View>
    </TouchableWithoutFeedback>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    marginBottom: 30,
    width: 300,
    height: 50,
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 1,
  },
  image: {
    width: 300,
    height: 100,
  },
  text: {
    fontSize: 20
  }
})

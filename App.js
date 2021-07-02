import React from 'react'
import { 
  View, 
  // Button, 
  StyleSheet, 
  TextInput, 
  Image, 
  ScrollView, 
  Text,
  TouchableWithoutFeedback, 
  Keyboard,
  Platform,
  SafeAreaView,
} from 'react-native'
import { Header, Button } from 'react-native-elements'
export default function App() {
  const [image, setImage] = React.useState()
  const [count, setCount] = React.useState()
  const [value, setValue] = React.useState()
   function FetchData() {
    if(image && count) {
      return fetch(`https://bing-image-search1.p.rapidapi.com/images/search?q=${image}&count=${count}`,{
        "method": "GET",
        "headers": {
          "x-rapidapi-key": "your-api-key",
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
        <Image source={{uri: items.contentUrl}} key={items.imageId} style={{ resizeMode: 'cover', width: items.thumbnail.width, height: items.thumbnail.height }}/>
        ))}
      </ScrollView>
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
      <TextInput placeholder="Image Name *" style={styles.textInput} value={image} onChangeText={setImage}/>
      <TextInput placeholder="How Much Images You Want *" style={styles.textInput} value={count} onChangeText={setCount}/>
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

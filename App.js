import React, { useState, useCallback, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Image,
  Dimensions,
  ScrollView,
  StatusBar,
  TouchableHighlight,
  BackHandler,
  TouchableOpacity
} from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import ImageZoom from 'react-native-image-pan-zoom'
import useSearchPhotos from './hooks/useSearchPhotos'

export default function App() {
  const [page, setPage] = useState(1)
  const [text, setText] = useState('')
  const [view, setView] = useState('gallery')
  const [selectedPhoto, setSelectedPhoto] = useState({})
  const { photos, loading } = useSearchPhotos(page, text, setPage)

  const uriGenerator = useCallback(
    photo =>
      `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${
        photo.secret
      }.jpg`,
    []
  )

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      if (view === 'info') {
        setView('gallery')
        return true
      }
      return false
    })
    return () => {
      BackHandler.removeEventListener('hardwareBackPress')
    }
  }, [view])

  return (
    <View style={styles.container}>
      {view === 'gallery' && (
        <>
          <View style={styles.header}>
            {photos.length === 0 && !loading && (
              <Image
                style={styles.flickrImg}
                source={require('./assets/flickrlogo.jpg')}
              />
            )}
            <View style={styles.textInputContainer}>
              <AntDesign name='search1' size={18} />
              <TextInput
                style={styles.textInput}
                placeholder='Search for photos'
                onChangeText={text => setText(text)}
                value={text}
              />
            </View>
          </View>
          {loading && <Text style={styles.loading}>Loading</Text>}
          <ScrollView
            onScroll={e => {
              let paddingToBottom = 10000
              paddingToBottom += e.nativeEvent.layoutMeasurement.height
              if (
                e.nativeEvent.contentOffset.y >=
                e.nativeEvent.contentSize.height - paddingToBottom
              ) {
                if (!loading) setPage(p => p + 1)
              }
            }}
            scrollEventThrottle={5000}
          >
            {photos.map(photo => (
              <TouchableHighlight
                key={photo.secret}
                onPress={() => {
                  setSelectedPhoto(photo)
                  setView('info')
                }}
              >
                <Image
                  style={styles.image}
                  source={{ uri: uriGenerator(photo) }}
                />
              </TouchableHighlight>
            ))}
          </ScrollView>
        </>
      )}
      {view === 'info' && (
        <View style={styles.info}>
          <ImageZoom
            cropWidth={Dimensions.get('window').width}
            cropHeight={450}
            imageWidth={Dimensions.get('window').width}
            imageHeight={450}
          >
            <Image
              style={styles.image}
              source={{ uri: uriGenerator(selectedPhoto) }}
            />
          </ImageZoom>
          <Text>{selectedPhoto.title}</Text>
          <View style={{ flexGrow: 1 }} />
          <TouchableOpacity
            onPress={() => setView('gallery')}
            title='BACK'
            style={styles.custumButton}
          >
            <Text s style={styles.backText}>
              BACK
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: '#fff',
    marginTop: StatusBar.currentHeight
  },
  textInput: {
    height: 40,
    borderBottomColor: 'black',
    marginLeft: 8,
    flexGrow: 1
  },
  textInputContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 3,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginLeft: 8,
    padding: 3
  },
  image: {
    resizeMode: 'cover',
    width: '100%',
    height: 450
  },
  flickrImg: {
    width: 200,
    height: 200
  },
  header: {
    display: 'flex',
    alignItems: 'center'
  },
  loading: {
    textAlign: 'center'
  },
  info: {
    display: 'flex',
    justifyContent: 'flex-end',
    height: '100%'
  },
  backButton: {
    marginBottom: 15
  },
  custumButton: {
    height: 50,
    backgroundColor: '#F5F5F5',
    marginTop: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  backText: {
    fontWeight: 'bold',
    color: '#6b6a6a'
  }
})

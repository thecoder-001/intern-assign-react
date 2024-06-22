import React from 'react';
import { View, ScrollView, ImageSourcePropType, StyleSheet } from "react-native";
import { Snackbar, Text, useTheme, Portal } from 'react-native-paper';
import { FFmpegKit } from 'ffmpeg-kit-react-native';
import VideoPhotoCombo from '@/components/VideoPhotoCombo';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { SafeAreaView } from 'react-native-safe-area-context';



interface ComboData {
  videoSource: number;
  photoSource: ImageSourcePropType;
}

export default function Index() {
  const theme = useTheme();

  // snackbar
  const [visible, setVisible] = React.useState(false);
  const onShowSnackBar = () => setVisible(true);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  // hardcoded assets
  const combos: ComboData[] = [
    {
      videoSource: require('@/assets/videos/Video1.mp4'),
      photoSource: require('@/assets/images/Selfie1.jpeg')
    },
    {
      videoSource: require('@/assets/videos/Video2.mp4'),
      photoSource: require('@/assets/images/Selfie2.jpeg')
    },
    {
      videoSource: require('@/assets/videos/Video3.mp4'),
      photoSource: require('@/assets/images/Selfie3.jpeg')
    },
  ];
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Portal.Host>
        <Text variant="headlineLarge" style={{ alignSelf: 'center' }}>Flick</Text>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {combos.map((combo, index) => (
            <VideoPhotoCombo
              key={index}
              index={index + 1}
              videoSource={combo.videoSource}
              photoSource={combo.photoSource}
              onShowSnackBar={onShowSnackBar}
            />
          ))}
        </ScrollView>
        <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          action={{
            label: 'Error!',
            onPress: () => {
              console.log('Error!');
              onDismissSnackBar();
            },
          }}>
          Saved!
        </Snackbar>
      </Portal.Host>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    // fontSize: 24,
    // fontWeight: 'bold',
    // textAlign: 'center',
    // padding: 20,
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
});
import React, { useState } from 'react';
import { View, Image, ImageSourcePropType, StyleSheet, Dimensions, Alert, Platform, Linking } from "react-native";
import VideoPreview from "@/components/VideoPreview";
import { Text, useTheme, IconButton, Dialog, Portal, Button } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { FFmpegKit } from 'ffmpeg-kit-react-native';
import * as Haptics from 'expo-haptics';


interface VideoPhotoComboProps {
  index: number;
  videoSource: number;
  photoSource: ImageSourcePropType;
  onShowSnackBar: () => void;
}

const VideoPhotoCombo: React.FC<VideoPhotoComboProps> = ({ index, videoSource, photoSource, onShowSnackBar }) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const windowWidth = Dimensions.get('window').width;
  // width and height for previews, preserving 16:9 aspect ratio
  const mediaWidth = (windowWidth - 100) * 0.42;
  const mediaHeight = (mediaWidth * 16) / 9;
  // for the dialog window
  const dialogWidth = (windowWidth) * 0.42;
  const dialogHeight = (dialogWidth * 16) / 9;

  // dialog code
  const [visible, setVisible] = React.useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const [outputUri, setOutputUri] = useState<string | null>(null);
  const openPhotos = () => {
    switch (Platform.OS) {
      case "ios":
        Linking.openURL("photos-redirect://");
        break;
      case "android":
        Linking.openURL("content://media/internal/images/media");
        break;
      default:
        console.log("Could not open gallery app");
    }
  }


  const handleDownload = async () => {
    setIsLoading(true); // show loading animation
    try {
      console.log(`Downloading combo ${index}`);
      // resolve the asset to URIs
      const videoUri = Image.resolveAssetSource(videoSource).uri;
      const photoUri = Image.resolveAssetSource(photoSource).uri;
      const outputUri = `${FileSystem.documentDirectory}output.mp4`;

      const ffmpegCommand = `-y -i "${videoUri}" -i "${photoUri}" -filter_complex "
      [1:v]scale=160:160,geq='st(3,pow(X-(W/2),2)+pow(Y-(H/2),2));if(lte(ld(3),pow(min(W/2,H/2),2)),255,0)':128:128,setsar=1[mask];
      [1:v]scale=160:160[a];[a][mask]alphamerge[b];[0:v][b]overlay=10:H-h-10" -b:v 2M -c:a copy "${outputUri}"`;
      // scales the photo to 160x160, creates a circular mask, and overlays it on the video
      // also manually set birate to 2M as it's choppy/blocky otherwise
      // directly copy audio

      console.log('FFmpeg command:', ffmpegCommand);

      // request media permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Media Library permission not granted');
      }

      await FFmpegKit.execute(ffmpegCommand);

      // save the output video to the media library & set output uri for dialog
      await MediaLibrary.saveToLibraryAsync(outputUri);
      setOutputUri(outputUri);

    } catch (error) {
      console.error('FFmpeg process failed', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      onShowSnackBar();
    } finally {
      setIsLoading(false);
      showDialog();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentRow}>
        <View style={styles.indexing}>
          <Text variant="titleLarge" style={styles.mediaTitle}>{index}.</Text>
        </View>
        <View style={styles.mediaWrapper}>
          <Text variant="titleLarge" style={styles.mediaTitle}>Video {index}</Text>
          <View style={[styles.mediaFrame, { width: mediaWidth, height: mediaHeight }]}>
            <VideoPreview source={videoSource} width={mediaWidth} height={mediaHeight} />
          </View>
        </View>
        <View style={styles.mediaWrapper}>
          <Text variant="titleLarge" style={styles.mediaTitle}>Photo {index}</Text>
          <View style={[styles.mediaFrame, { width: mediaWidth, height: mediaHeight }]}>
            <Image
              source={photoSource}
              style={styles.media}
              resizeMode="cover"
            />
          </View>
        </View>
        <View style={styles.buttonWrapper}>
          {isLoading ? (
            <LottieView
              source={require('@/assets/lottie/Loading-animation.json')}
              autoPlay
              loop
              style={styles.lottieAnimation}
            />
          ) : (
            <IconButton
              icon="download"
              mode="contained"
              size={40}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                handleDownload();
            }}
              iconColor={theme.colors.background}
              containerColor={theme.colors.primary}
            />
          )}
        </View>
      </View>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog} style={{ width: mediaWidth + 100, alignSelf: 'center' }}>
          <Dialog.Title>Saved!</Dialog.Title>
          <Dialog.Content>
            {outputUri && typeof outputUri === 'string' ? (
              <View style={[styles.mediaFrame, { width: dialogWidth, height: dialogHeight, alignSelf: 'center' }]}>
                <VideoPreview source={{ uri: outputUri }} width={dialogWidth} height={dialogHeight} />
              </View>
            ) : (
              <Text>No output video available</Text>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={openPhotos}>Open gallery</Button>
            <Button onPress={hideDialog}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  indexing: {
    alignSelf: 'flex-start',
    width: '6%'
  },
  mediaWrapper: {
    width: '42%',
  },
  mediaTitle: {
    marginBottom: 5,
  },
  mediaFrame: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  buttonWrapper: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadButton: {
    backgroundColor: '#e0e0e0',
  },
  lottieAnimation: {
    width: 40,
    height: 40,
  },
});

export default VideoPhotoCombo;
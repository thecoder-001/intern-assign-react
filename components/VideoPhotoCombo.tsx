import React, { useState } from 'react';
import { View, Image, ImageSourcePropType, StyleSheet, Dimensions, Alert } from "react-native";
import VideoPreview from "@/components/VideoPreview";
import { Text, useTheme, IconButton, Snackbar } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { FFmpegKit } from 'ffmpeg-kit-react-native';

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
  const mediaWidth = (windowWidth - 60) * 0.42;
  const mediaHeight = (mediaWidth * 16) / 9;

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      console.log(`Downloading combo ${index}`);
      const videoUri = Image.resolveAssetSource(videoSource).uri;
      const photoUri = Image.resolveAssetSource(photoSource).uri;
      const outputUri = `${FileSystem.documentDirectory}output.mp4`;
    
      const ffmpegCommand = `-y -i "${videoUri}" -i "${photoUri}" -filter_complex "
      [1:v]scale=160:160,geq='st(3,pow(X-(W/2),2)+pow(Y-(H/2),2));if(lte(ld(3),pow(min(W/2,H/2),2)),255,0)':128:128,setsar=1[mask];
      [1:v]scale=160:160[a];[a][mask]alphamerge[b];[0:v][b]overlay=10:H-h-10" -b:v 2M -c:a copy "${outputUri}"`;
    
      console.log('FFmpeg command:', ffmpegCommand);
    
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Media Library permission not granted');
      }
    
      await FFmpegKit.execute(ffmpegCommand);
      
      await MediaLibrary.saveToLibraryAsync(outputUri);
      

    } catch (error) {
      console.error('FFmpeg process failed', error);
      Alert.alert('Error', 'Failed to save the video');
    } finally {
      setIsLoading(false);
      onShowSnackBar();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.primary }]}>{index}</Text>
      <View style={styles.contentRow}>
        <View style={styles.mediaWrapper}>
          <Text style={[styles.mediaTitle, { color: theme.colors.secondary }]}>Video {index}</Text>
          <View style={[styles.mediaFrame, { width: mediaWidth, height: mediaHeight }]}>
            <VideoPreview source={videoSource} width={mediaWidth} height={mediaHeight} />
          </View>
        </View>
        <View style={styles.mediaWrapper}>
          <Text style={[styles.mediaTitle, { color: theme.colors.secondary }]}>Photo {index}</Text>
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
              onPress={handleDownload}
              iconColor={theme.colors.background}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mediaWrapper: {
    width: '42%',
  },
  mediaTitle: {
    fontSize: 16,
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
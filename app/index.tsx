import { ThemedText } from "@/components/ThemedText";
import { View, Image } from "react-native";
import VideoPreview from "@/components/VideoPreview";
import { Text, useTheme, Button, IconButton } from 'react-native-paper';
import { useRef, useState, useEffect } from "react";


export default function Index() {
  const theme = useTheme();
  const ref = useRef(null);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.surface
      }}
    >
      <Text variant="headlineLarge">Flick</Text>

      <View style={{ flex: 1, padding: 10, flexDirection: "row" }}>
        <View style={{ flex: 1, padding: 10 }}>
          <Text variant="titleLarge">1. Video</Text>
          <VideoPreview source={require('@/assets/videos/Video1.mp4')} />
        </View>
        <View style={{ flex: 1, padding: 10 }}>
          <Text variant="titleLarge">Photo</Text>
          {/* <Image
            source={require('@/assets/images/Selfie1.jpeg')} style={{ alignSelf: 'center', maxHeight: 200, maxWidth: 200 }}
          /> */}
        </View>
        <IconButton icon="download" mode="contained" size={40} onPress={() => console.log('Pressed')}></IconButton>
      </View>

      {/* <View style={{ flex: 1, padding: 10, flexDirection: "row" }}>
        <View style={{ flex: 1, padding: 10 }}>
          <Text variant="titleLarge">1. Video</Text>
          <Button icon="video" mode="text" onPress={() => console.log('Pressed')}>Select video</Button>
        </View>
        <View style={{ flex: 1, padding: 10 }}>
          <Text variant="titleLarge">Photo</Text>
          <Button icon="image" mode="text" onPress={() => console.log('Pressed')}>Select photo</Button>
        </View>
        <IconButton icon="download" mode="contained" size={40} onPress={() => console.log('Pressed')}></IconButton>
      </View> */}




      {/* <Text variant="titleLarge">2. Video    photo</Text>
      <Text variant="titleLarge">3. Video    photo</Text>
      <Text>Edit app/index.tsx to edit this screen.</Text> */}

    </View>
  );
}

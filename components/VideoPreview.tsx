import { Video, ResizeMode } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { IconButton, TouchableRipple } from 'react-native-paper';

export default function VideoPreview({ source }) {
    const video = useRef(null);
    const [status, setStatus] = useState({});
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayPause = () => {
        if (status.isPlaying) {
            video.current.pauseAsync();
        } else {
            video.current.playAsync();
        }
    };

    useEffect(() => {
        setIsPlaying(status.isPlaying || false);
    }, [status]);

    const windowWidth = Dimensions.get('window').width;
    const videoHeight = (windowWidth * 9) / 16;

    return (
        <View style={styles.container}>
            <Video
                ref={video}
                style={[styles.video, { width: windowWidth, height: videoHeight }]}
                source={source}
                resizeMode={ResizeMode.COVER}
                isLooping
                onPlaybackStatusUpdate={setStatus}
            />
            <View style={styles.playButtonContainer}>
                <IconButton
                    mode='contained-tonal'
                    icon={isPlaying ? '' : 'play'}
                    size={48}
                    onPress={handlePlayPause}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    video: {
        // width and height are now set dynamically
    },
    playButtonContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
});
import { Video, ResizeMode } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { IconButton } from 'react-native-paper';

interface VideoPreviewProps {
    source: number | { uri: string };
    width: number;
    height: number;
}

export default function VideoPreview({ source, width, height }: VideoPreviewProps) {
    const video = useRef(null);
    const [status, setStatus] = useState({});
    const [isPlaying, setIsPlaying] = useState(false);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const handlePlayPause = () => {
        if (status.isPlaying) {
            video.current.pauseAsync();
        } else {
            video.current.playAsync();
        }
    };

    useEffect(() => {
        setIsPlaying(status.isPlaying || false);
        Animated.timing(fadeAnim, {
            toValue: status.isPlaying ? 0 : 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [status, fadeAnim]);

    return (
        <View style={[styles.container, { width, height }]}>
            <Video
                ref={video}
                style={{ width, height }}
                source={source}
                resizeMode={ResizeMode.COVER}
                isLooping
                onPlaybackStatusUpdate={setStatus}
            />
            <Animated.View style={[styles.playButtonContainer, { opacity: fadeAnim }]}>
                <IconButton
                    mode='contained-tonal'
                    icon={isPlaying ? 'pause' : 'play'}
                    size={48}
                    onPress={handlePlayPause}
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    playButtonContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
});
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { CATEGORY_META, type CityLocation } from '../data/locations';

interface ProximityBannerProps {
  location: CityLocation;
  onView: (location: CityLocation) => void;
  onDismiss: () => void;
}

const AUTO_DISMISS_MS = 6000;

export default function ProximityBanner({ location, onView, onDismiss }: ProximityBannerProps) {
  const fade = useRef(new Animated.Value(0)).current;
  const category = CATEGORY_META[location.category];

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [fade, onDismiss]);

  return (
    <Animated.View style={[styles.banner, { opacity: fade }]}>
      <Pressable style={styles.content} onPress={() => onView(location)}>
        <Text style={styles.emoji}>{category.emoji}</Text>
        <View style={styles.textBlock}>
          <Text style={styles.title}>You're near {location.name}</Text>
          <Text style={styles.subtitle}>Tap to view · you're within 5 m</Text>
        </View>
      </Pressable>
      <Pressable style={styles.close} onPress={onDismiss} hitSlop={8}>
        <Text style={styles.closeText}>✕</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 14,
    paddingVertical: 12,
    paddingLeft: 12,
    paddingRight: 6,
    marginHorizontal: 12,
    marginTop: 8,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 22,
    marginRight: 10,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
  },
  close: {
    padding: 6,
  },
  closeText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
});

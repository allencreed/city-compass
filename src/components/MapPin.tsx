import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CATEGORY_META, type LocationCategory } from '../data/locations';
import { colors } from '../theme';

interface MapPinProps {
  category: LocationCategory;
  checked: boolean;
  onPress: () => void;
}

/**
 * Teardrop pin matching the design mockup: rounded top, gently rounded bottom
 * tip, rotated 45°, with the icon counter-rotated so it stays upright.
 * Stamp Orange when unvisited, Passport Blue when stamped.
 */
export default function MapPin({ category, checked, onPress }: MapPinProps) {
  const bg = checked ? colors.primary : colors.accentContainer;
  return (
    <Pressable onPress={onPress} style={styles.wrap} hitSlop={8}>
      <View style={styles.teardrop}>
        <View style={[styles.pin, { backgroundColor: bg }]}>
          <Text style={styles.icon}>{CATEGORY_META[category].emoji}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teardrop: {
    width: 38,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pin: {
    width: 34,
    height: 42,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    borderBottomLeftRadius: 17,
    borderBottomRightRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
    shadowColor: '#031632',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  icon: {
    fontSize: 15,
    transform: [{ rotate: '-45deg' }],
  },
});

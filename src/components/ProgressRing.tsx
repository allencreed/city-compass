import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, fonts } from '../theme';

interface ProgressRingProps {
  size?: number;
  stroke?: number;
  progress: number; // 0..1
  color?: string;
  trackColor?: string;
  label: string;
  sublabel?: string;
}

export default function ProgressRing({
  size = 80,
  stroke = 6,
  progress,
  color = colors.accent,
  trackColor = colors.surfaceVariant,
  label,
  sublabel = 'Stamps',
}: ProgressRingProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(1, Math.max(0, progress));
  const offset = circumference * (1 - clamped);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.sublabel}>{sublabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: colors.primary,
    fontFamily: fonts.label,
    fontSize: 14,
  },
  sublabel: {
    color: colors.accentDark,
    fontFamily: fonts.label,
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 1,
  },
});

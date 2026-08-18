import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LOCATIONS } from '../data/locations';
import { colors, fonts, radii, spacing } from '../theme';
import { parseVenueQr } from '../utils/qr';

type ScannerModalProps = {
  onClose: () => void;
  /** Called once a valid City Compass venue code has been scanned. */
  onStamped: (venueId: string) => void;
};

export default function ScannerModal({ onClose, onStamped }: ScannerModalProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [torchOn, setTorchOn] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | null>(null);
  const [resultVenue, setResultVenue] = useState<(typeof LOCATIONS)[number] | null>(null);
  /** What the camera last read — diagnostics so a failed scan tells us why. */
  const [lastRead, setLastRead] = useState<string | null>(null);
  const [mountError, setMountError] = useState<string | null>(null);
  const handledRef = useRef(false);

  const handleBarcode = ({ data }: BarcodeScanningResult) => {
    if (handledRef.current) return;
    handledRef.current = true;
    setLastRead(data);

    const venueId = parseVenueQr(data);
    if (venueId) {
      setResultVenue(LOCATIONS.find((l) => l.id === venueId) ?? null);
      setResult('success');
      onStamped(venueId);
      setTimeout(() => {
        handledRef.current = false;
        onClose();
      }, 1600);
    } else {
      setResult('error');
      setTimeout(() => {
        setResult(null);
        handledRef.current = false;
      }, 2600);
    }
  };

  // Permission not loaded yet
  if (!permission) return null;

  if (!permission.granted) {
    return (
      <View style={styles.overlay}>
        <View style={styles.permissionCard}>
          <Text style={styles.permissionEmoji}>📷</Text>
          <Text style={styles.permissionTitle}>Camera access needed</Text>
          <Text style={styles.permissionText}>
            City Compass uses your camera to scan venue QR codes and stamp your passport.
          </Text>
          <Pressable style={styles.primaryButton} onPress={requestPermission}>
            <Text style={styles.primaryButtonText}>Allow camera</Text>
          </Pressable>
          <Pressable style={styles.closeLink} onPress={onClose}>
            <Text style={styles.closeLinkText}>Not now</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.overlay}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={torchOn}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={handleBarcode}
        onMountError={(e) => setMountError(e.message)}
      />

      {/* Scan frame */}
      <View style={styles.frame} pointerEvents="none">
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />
      </View>
      <Text style={styles.hint}>Point your camera at the venue&apos;s QR code</Text>

      {/* Top controls */}
      <View style={styles.topBar}>
        <Pressable onPress={onClose} hitSlop={10} style={styles.roundButton}>
          <Text style={styles.roundButtonText}>✕</Text>
        </Pressable>
        <Pressable
          onPress={() => setTorchOn((v) => !v)}
          hitSlop={10}
          style={[styles.roundButton, torchOn && styles.roundButtonActive]}
        >
          <Text style={styles.roundButtonText}>🔦</Text>
        </Pressable>
      </View>

      {/* Camera failed to start — show why instead of a silent black screen */}
      {mountError && (
        <View style={styles.mountErrorCard}>
          <Text style={styles.mountErrorTitle}>Camera failed to start</Text>
          <Text style={styles.mountErrorText}>{mountError}</Text>
          <Text style={styles.mountErrorHint}>
            If you're on iOS, check that Camera access is allowed for Expo Go in
            Settings → Privacy. If it just says 'Camera is not available', close and
            reopen the scanner.
          </Text>
          <Pressable style={styles.mountErrorButton} onPress={onClose}>
            <Text style={styles.mountErrorButtonText}>Close</Text>
          </Pressable>
        </View>
      )}

      {/* Scan result */}
      {result === 'success' && (
        <View style={styles.resultBanner}>
          <Text style={styles.resultEmoji}>🎉</Text>
          <Text style={styles.resultTitle}>Passport stamped!</Text>
          <Text style={styles.resultSub}>
            {resultVenue?.name ?? 'Venue'} · +{resultVenue?.rewardPoints ?? 0} pts
          </Text>
        </View>
      )}
      {result === 'error' && (
        <View style={[styles.resultBanner, styles.resultBannerError]}>
          <Text style={styles.resultTitleError}>Not a City Compass QR</Text>
          <Text style={styles.resultSubError}>Try another code</Text>
          {lastRead !== null && (
            <Text style={styles.resultRaw} numberOfLines={2}>
              Read: {lastRead}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    zIndex: 50,
  },
  frame: {
    position: 'absolute',
    top: '32%',
    alignSelf: 'center',
    width: 240,
    height: 240,
  },
  corner: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderColor: colors.accent,
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 12 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 12 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 12 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 12 },
  hint: {
    position: 'absolute',
    top: '32%',
    marginTop: 258,
    alignSelf: 'center',
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  topBar: {
    position: 'absolute',
    top: 54,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roundButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundButtonActive: {
    backgroundColor: colors.accent,
  },
  roundButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  resultBanner: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: '18%',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  resultBannerError: {
    backgroundColor: '#FFF3F0',
  },
  resultEmoji: {
    fontSize: 34,
    marginBottom: spacing.xs,
  },
  resultTitle: {
    fontFamily: fonts.headlineBold,
    fontSize: 18,
    color: colors.primary,
  },
  resultTitleError: {
    fontFamily: fonts.headlineBold,
    fontSize: 17,
    color: colors.error,
  },
  resultSub: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.accentDark,
    marginTop: 2,
  },
  resultSubError: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  resultRaw: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    marginTop: 6,
    textAlign: 'center',
  },
  mountErrorCard: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: '14%',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  mountErrorTitle: {
    fontFamily: fonts.headlineBold,
    fontSize: 17,
    color: colors.error,
    marginBottom: spacing.xs,
  },
  mountErrorText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  mountErrorHint: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  mountErrorButton: {
    backgroundColor: colors.accentDark,
    borderRadius: radii.sm,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  mountErrorButtonText: {
    fontFamily: fonts.label,
    fontSize: 13,
    color: colors.onPrimary,
    textTransform: 'uppercase',
  },
  permissionCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  permissionEmoji: {
    fontSize: 44,
    marginBottom: spacing.md,
  },
  permissionTitle: {
    fontFamily: fonts.headlineBold,
    fontSize: 20,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  permissionText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: spacing.lg,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: colors.accentDark,
    borderRadius: radii.sm,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: fonts.label,
    fontSize: 13,
    color: colors.onPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  closeLink: {
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  closeLinkText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
});

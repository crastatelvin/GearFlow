import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { Shield, Zap, X, Camera as CameraIcon, CheckCircle } from 'lucide-react-native';

export default function CameraScreen({ onCapture, onClose }: { onCapture: (uri: string) => void, onClose: () => void }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<any>(null);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.text}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.btn}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const data = await cameraRef.current.takePictureAsync();
      setPhoto(data.uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Shield size={24} color="#39FF14" />
        <Text style={styles.headerTitle}>AI PART VERIFICATION</Text>
        <TouchableOpacity onPress={onClose}>
          <X size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {!photo ? (
        <CameraView style={styles.camera} ref={cameraRef}>
          <View style={styles.overlay}>
            <View style={styles.guideBox}>
              <Text style={styles.guideText}>PLACE DESTROYED PACKAGING & LICENSE PLATE HERE</Text>
            </View>
          </View>
        </CameraView>
      ) : (
        <View style={styles.preview}>
          <Image source={{ uri: photo }} style={styles.image} />
          <View style={styles.successBadge}>
            <Zap size={20} color="#000" />
            <Text style={styles.successText}>PHOTO READY FOR AI ANALYSIS</Text>
          </View>
        </View>
      )}

      <View style={styles.controls}>
        {!photo ? (
          <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
            <View style={styles.captureBtnInner} />
          </TouchableOpacity>
        ) : (
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.retakeBtn} onPress={() => setPhoto(null)}>
              <Text style={styles.retakeText}>RETAKE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={() => onCapture(photo)}>
              <Text style={styles.confirmText}>SUBMIT TO AI</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
  },
  camera: {
    flex: 1,
    margin: 20,
    borderRadius: 32,
    overflow: 'hidden',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideBox: {
    width: '80%',
    height: '60%',
    borderWidth: 2,
    borderColor: '#39FF14',
    borderStyle: 'dashed',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#39FF1411',
  },
  guideText: {
    color: '#39FF14',
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
    padding: 20,
  },
  preview: {
    flex: 1,
    margin: 20,
    borderRadius: 32,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
  },
  successBadge: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#39FF14',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 16,
  },
  successText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '900',
  },
  controls: {
    padding: 40,
    alignItems: 'center',
  },
  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureBtnInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#39FF14',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  retakeBtn: {
    flex: 1,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffffff33',
    alignItems: 'center',
  },
  retakeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
  },
  confirmBtn: {
    flex: 2,
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#39FF14',
    alignItems: 'center',
  },
  confirmText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '900',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 40,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  btn: {
    backgroundColor: '#39FF14',
    padding: 16,
    borderRadius: 12,
  },
  btnText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import { ChevronLeft, Camera, ShieldCheck, CheckCircle2, AlertTriangle, FileText, Upload, Clock } from 'lucide-react-native';

export default function KYCPortal() {
  const [docs, setDocs] = useState([
    { id: 'aadhar', name: 'Aadhar Card', status: 'VERIFIED', icon: <CheckCircle2 size={20} color="#39FF14" /> },
    { id: 'pan', name: 'PAN Card', status: 'PENDING', icon: <Clock size={20} color="#FFA500" /> },
    { id: 'dl', name: 'Driving License', status: 'MISSING', icon: <AlertTriangle size={20} color="#FF4444" /> },
    { id: 'vehicle', name: 'Vehicle Documents', status: 'MISSING', icon: <AlertTriangle size={20} color="#FF4444" /> },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn}>
          <ChevronLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>KYC VERIFICATION</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.infoBox}>
           <ShieldCheck size={40} color="#39FF14" />
           <Text style={styles.infoTitle}>TRUST IS OUR GEAR</Text>
           <Text style={styles.infoDesc}>Complete your verification to unlock higher payouts and priority dispatches.</Text>
        </View>

        <View style={styles.docList}>
           {docs.map((doc) => (
             <TouchableOpacity key={doc.id} style={styles.docCard}>
                <View style={styles.docIconBox}>
                   <FileText size={24} color="#555" />
                </View>
                <View style={styles.docInfo}>
                   <Text style={styles.docName}>{doc.name}</Text>
                   <Text style={[styles.docStatus, { color: doc.status === 'VERIFIED' ? '#39FF14' : doc.status === 'PENDING' ? '#FFA500' : '#FF4444' }]}>
                      {doc.status}
                   </Text>
                </View>
                <View style={styles.statusIcon}>
                   {doc.icon}
                </View>
                {doc.status === 'MISSING' && (
                  <TouchableOpacity style={styles.uploadBtn}>
                     <Camera size={18} color="#000" />
                  </TouchableOpacity>
                )}
             </TouchableOpacity>
           ))}
        </View>

        <TouchableOpacity style={styles.submitBtn}>
           <Text style={styles.submitBtnText}>CONTINUE VERIFICATION</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  scrollContent: {
    padding: 24,
  },
  infoBox: {
     backgroundColor: '#39FF1408',
     borderWidth: 1,
     borderColor: '#39FF1422',
     borderRadius: 32,
     padding: 32,
     alignItems: 'center',
     textAlign: 'center',
     marginBottom: 32,
  },
  infoTitle: {
     color: '#39FF14',
     fontSize: 18,
     fontWeight: '900',
     marginTop: 16,
     marginBottom: 8,
  },
  infoDesc: {
     color: '#777',
     fontSize: 14,
     textAlign: 'center',
     lineHeight: 20,
  },
  docList: {
     gap: 16,
     marginBottom: 32,
  },
  docCard: {
     backgroundColor: '#0A0A0A',
     borderRadius: 24,
     padding: 20,
     flexDirection: 'row',
     alignItems: 'center',
     borderWidth: 1,
     borderColor: '#ffffff0a',
  },
  docIconBox: {
     width: 48,
     height: 48,
     backgroundColor: '#111',
     borderRadius: 16,
     alignItems: 'center',
     justifyContent: 'center',
     marginRight: 16,
  },
  docInfo: {
     flex: 1,
  },
  docName: {
     color: '#fff',
     fontSize: 14,
     fontWeight: 'bold',
  },
  docStatus: {
     fontSize: 10,
     fontWeight: '900',
     marginTop: 4,
  },
  statusIcon: {
     marginRight: 12,
  },
  uploadBtn: {
     backgroundColor: '#39FF14',
     width: 36,
     height: 36,
     borderRadius: 12,
     alignItems: 'center',
     justifyContent: 'center',
  },
  submitBtn: {
     backgroundColor: '#111',
     borderWidth: 1,
     borderColor: '#39FF1444',
     padding: 20,
     borderRadius: 24,
     alignItems: 'center',
  },
  submitBtnText: {
     color: '#39FF14',
     fontSize: 14,
     fontWeight: '900',
     letterSpacing: 2,
  }
});

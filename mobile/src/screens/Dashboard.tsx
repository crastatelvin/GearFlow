import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Linking, Platform } from 'react-native';
import { Settings, Wallet, MapPin, Zap, Shield, User, Clock, ChevronRight, X, Check, Navigation } from 'lucide-react-native';

export default function Dashboard() {
  const [hasNewLead, setHasNewLead] = useState(true);
  const [currentStatus, setCurrentStatus] = useState('IDLE');

  const handleAccept = () => {
    setHasNewLead(false);
    setCurrentStatus('IN_ROUTE');
  };

  const handleReject = () => {
    setHasNewLead(false);
    setCurrentStatus('IDLE');
  };

  const openMaps = (lat = 28.6139, lng = 77.2090) => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${lat},${lng}`;
    const label = 'Customer Location';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    Linking.openURL(url!);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.mechanicName}>Alex Gearhead <Shield size={16} color="#39FF14" /></Text>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
          <User color="#39FF14" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Wallet & Stats */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.mainStat]}>
            <View style={styles.statHeader}>
              <Wallet size={20} color="#000" />
              <Text style={styles.statLabelDark}>WEEKLY EARNINGS</Text>
            </View>
            <Text style={styles.statValueDark}>₹4,850.00</Text>
            <View style={styles.statFooter}>
              <Text style={styles.statSubTextDark}>+₹1,200 today</Text>
            </View>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Zap size={20} color="#39FF14" />
              <Text style={styles.statLabel}>JOBS DONE</Text>
            </View>
            <Text style={styles.statValue}>12</Text>
          </View>
        </View>

        {/* New Lead Alert */}
        {hasNewLead && (
          <View style={styles.newLeadAlert}>
             <View style={styles.newLeadHeader}>
                <Text style={styles.newLeadTitle}>NEW SERVICE REQUEST</Text>
                <Text style={styles.newLeadTimer}>0:45</Text>
             </View>
             <Text style={styles.bikeModelLarge}>Royal Enfield Interceptor 650</Text>
             <View style={styles.locationContainer}>
                <MapPin size={16} color="#39FF14" />
                <Text style={styles.locationText}>2.4 km away • Sector 14</Text>
             </View>
             
             <View style={styles.decisionRow}>
                <TouchableOpacity onPress={handleReject} style={[styles.decisionBtn, styles.rejectBtn]}>
                   <X color="#ff4444" size={24} />
                   <Text style={styles.rejectBtnText}>REJECT</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAccept} style={[styles.decisionBtn, styles.acceptBtn]}>
                   <Check color="#000" size={24} />
                   <Text style={styles.acceptBtnText}>ACCEPT JOB</Text>
                </TouchableOpacity>
             </View>
          </View>
        )}

        {/* Active Dispatch Section */}
        {currentStatus === 'IN_ROUTE' && (
          <>
            <Text style={styles.sectionTitle}>ACTIVE DISPATCH</Text>
            <TouchableOpacity style={styles.leadCard}>
              <View style={styles.leadHeader}>
                <View style={styles.activeBadge}>
                  <View style={styles.pulseDot} />
                  <Text style={styles.activeText}>IN ROUTE</Text>
                </View>
                <Text style={styles.timeText}>15 mins away</Text>
              </View>
              
              <Text style={styles.bikeModel}>Royal Enfield Classic 350</Text>
              <View style={styles.locationContainer}>
                <MapPin size={16} color="#39FF14" />
                <Text style={styles.locationText}>Downtown, Sector 5, Block B</Text>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity onPress={() => openMaps()} style={styles.navigateBtn}>
                   <Navigation size={18} color="#000" />
                   <Text style={styles.navigateBtnText}>NAVIGATE TO CUSTOMER</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.viewBtn}>
                  <Text style={styles.viewBtnText}>VIEW DETAILS</Text>
                  <ChevronRight size={18} color="#39FF14" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </>
        )}

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>RESOURCES</Text>
        <View style={styles.resourcesRow}>
           <TouchableOpacity style={styles.resourceCard}>
              <Shield size={24} color="#39FF14" />
              <Text style={styles.resourceText}>KYC Portal</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.resourceCard}>
              <Clock size={24} color="#39FF14" />
              <Text style={styles.resourceText}>Work Logs</Text>
           </TouchableOpacity>
        </View>

        {/* System Health */}
        <Text style={styles.sectionTitle}>SYSTEM STATUS</Text>
        <View style={styles.healthCard}>
          <View style={styles.healthRow}>
            <Clock size={18} color="#555" />
            <Text style={styles.healthText}>Last Sync: Just now</Text>
            <View style={styles.healthBadge}>
              <Text style={styles.healthBadgeText}>ONLINE</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.goOfflineBtn}>
          <Text style={styles.goOfflineText}>GO OFFLINE</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: '#555',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  mechanicName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -1,
  },
  profileBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#39FF1433',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ffffff0a',
  },
  mainStat: {
    flex: 1.5,
    backgroundColor: '#39FF14',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  statLabel: {
    color: '#555',
    fontSize: 10,
    fontWeight: '900',
  },
  statLabelDark: {
    color: '#000',
    fontSize: 10,
    fontWeight: '900',
  },
  statValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
  },
  statValueDark: {
    color: '#000',
    fontSize: 28,
    fontWeight: '900',
  },
  statFooter: {
    marginTop: 4,
  },
  statSubTextDark: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
    opacity: 0.6,
  },
  sectionTitle: {
    color: '#39FF14',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 16,
  },
  newLeadAlert: {
    backgroundColor: '#0A0A0A',
    borderRadius: 32,
    padding: 24,
    borderWidth: 2,
    borderColor: '#39FF14',
    marginBottom: 32,
  },
  newLeadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  newLeadTitle: {
    color: '#39FF14',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  newLeadTimer: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    backgroundColor: '#333',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bikeModelLarge: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 8,
  },
  decisionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  decisionBtn: {
    flex: 1,
    height: 60,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  rejectBtn: {
    backgroundColor: '#ff444411',
    borderWidth: 1,
    borderColor: '#ff444433',
  },
  acceptBtn: {
    backgroundColor: '#39FF14',
  },
  rejectBtnText: {
    color: '#ff4444',
    fontSize: 12,
    fontWeight: '900',
  },
  acceptBtnText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '900',
  },
  leadCard: {
    backgroundColor: '#0A0A0A',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: '#39FF1433',
    marginBottom: 32,
  },
  leadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#39FF1411',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#39FF14',
  },
  activeText: {
    color: '#39FF14',
    fontSize: 10,
    fontWeight: '900',
  },
  timeText: {
    color: '#555',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bikeModel: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
  },
  locationText: {
    color: '#777',
    fontSize: 14,
    fontWeight: '500',
  },
  actionRow: {
    borderTopWidth: 1,
    borderTopColor: '#ffffff0a',
    paddingTop: 20,
    gap: 12,
  },
  navigateBtn: {
    backgroundColor: '#39FF14',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  navigateBtnText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '900',
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewBtnText: {
    color: '#39FF14',
    fontSize: 14,
    fontWeight: '900',
  },
  resourcesRow: {
     flexDirection: 'row',
     gap: 12,
     marginBottom: 32,
  },
  resourceCard: {
     flex: 1,
     backgroundColor: '#0A0A0A',
     borderWidth: 1,
     borderColor: '#ffffff0a',
     borderRadius: 24,
     padding: 24,
     alignItems: 'center',
     gap: 12,
  },
  resourceText: {
     color: '#fff',
     fontSize: 12,
     fontWeight: 'bold',
  },
  healthCard: {
    backgroundColor: '#0A0A0A',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ffffff0a',
  },
  healthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  healthText: {
    color: '#555',
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
  },
  healthBadge: {
    backgroundColor: '#39FF1422',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  healthBadgeText: {
    color: '#39FF14',
    fontSize: 10,
    fontWeight: '900',
  },
  bottomBar: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#ffffff0a',
  },
  goOfflineBtn: {
    width: '100%',
    padding: 18,
    backgroundColor: '#111',
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff444433',
  },
  goOfflineText: {
    color: '#ff4444',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  }
});

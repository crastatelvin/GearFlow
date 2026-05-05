import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';

const SYNC_QUEUE_KEY = '@gearflow_sync_queue';

export interface SyncAction {
  id: string;
  type: 'STATUS_UPDATE' | 'LOCATION_UPDATE' | 'QUOTE_SUBMIT' | 'PHOTO_UPLOAD';
  payload: any;
  timestamp: number;
}

class SyncManager {
  private queue: SyncAction[] = [];

  constructor() {
    this.loadQueue();
  }

  private async loadQueue() {
    const stored = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
    if (stored) {
      this.queue = JSON.parse(stored);
    }
  }

  private async saveQueue() {
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(this.queue));
  }

  public async addAction(action: Omit<SyncAction, 'id' | 'timestamp'>) {
    const newAction: SyncAction = {
      ...action,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };

    this.queue.push(newAction);
    await this.saveQueue();
    
    // Attempt to sync immediately if online
    this.sync();
  }

  public async sync() {
    const network = await Network.getNetworkStateAsync();
    if (!network.isConnected || !network.isInternetReachable) {
      console.log('📡 System Offline: Action queued locally.');
      return;
    }

    if (this.queue.length === 0) return;

    console.log(`🔄 Syncing ${this.queue.length} actions to GearFlow cloud...`);

    const actionsToSync = [...this.queue];
    
    try {
      // Logic to send to Backend API / n8n Webhook
      // For each action in actionsToSync:
      // await axios.post('/sync', action);
      
      // On success, clear the queue
      this.queue = this.queue.filter(a => !actionsToSync.find(ats => ats.id === a.id));
      await this.saveQueue();
      console.log('✅ Sync Complete.');
    } catch (error) {
      console.error('❌ Sync Failed:', error);
    }
  }
}

export const syncManager = new SyncManager();

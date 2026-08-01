import { OfflineCashRecord } from '../types';

const STORAGE_KEY = 'donationapp_offline_cash_queue';

export const getOfflineQueue = (): OfflineCashRecord[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveToOfflineQueue = (record: Omit<OfflineCashRecord, 'tempId' | 'recordedAt' | 'synced'>): OfflineCashRecord => {
  const queue = getOfflineQueue();
  const newRecord: OfflineCashRecord = {
    ...record,
    tempId: 'OFFLINE_' + Date.now(),
    recordedAt: new Date().toISOString(),
    synced: false,
  };
  queue.push(newRecord);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  return newRecord;
};

export const clearOfflineQueue = () => {
  localStorage.removeItem(STORAGE_KEY);
};

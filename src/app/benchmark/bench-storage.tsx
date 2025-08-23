import { Button, ButtonText, Screen } from '@/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'bench' });

function now() {
  // performance.now() has finer resolution if available
  // @ts-ignore
  return global.performance?.now?.() ?? Date.now();
}

async function benchAsyncStorage(iter = 1000, payloadSize = 256) {
  const keyPrefix = 'bench:as:';
  const payload = 'x'.repeat(payloadSize);
  // clear
  await AsyncStorage.clear();

  // writes
  let t0 = now();
  for (let i = 0; i < iter; i++) {
    await AsyncStorage.setItem(keyPrefix + i, payload);
  }
  const writeMs = now() - t0;

  // reads
  t0 = now();
  for (let i = 0; i < iter; i++) {
    // eslint-disable-next-line no-await-in-loop
    await AsyncStorage.getItem(keyPrefix + i);
  }
  const readMs = now() - t0;

  return { lib: 'AsyncStorage', iter, payloadSize, writeMs, readMs };
}

async function benchMMKV(iter = 1000, payloadSize = 256) {
  const keyPrefix = 'bench:mmkv:';
  const payload = 'x'.repeat(payloadSize);
  // clear this MMKV instance
  for (let i = 0; i < iter; i++) storage.delete(keyPrefix + i);

  // writes (sync)
  let t0 = now();
  for (let i = 0; i < iter; i++) {
    storage.set(keyPrefix + i, payload);
  }
  const writeMs = now() - t0;

  // reads (sync)
  t0 = now();
  for (let i = 0; i < iter; i++) {
    storage.getString(keyPrefix + i);
  }
  const readMs = now() - t0;

  return { lib: 'MMKV', iter, payloadSize, writeMs, readMs };
}

export default function BenchStorage() {
  const [result, setResult] = useState<any | null>(null);
  const [running, setRunning] = useState(false);

  const run = useCallback(async () => {
    if (running) return;
    setRunning(true);
    try {
      const iter = 2000;       // increase to 10k if you want
      const payloadSize = 512; // bytes; adjust to your typical value size

      // Warm-up
      await benchAsyncStorage(200, 64);
      await benchMMKV(200, 64);

      const as = await benchAsyncStorage(iter, payloadSize);
      const mk = await benchMMKV(iter, payloadSize);

      setResult({ as, mk });
    } finally {
      setRunning(false);
    }
  }, [running]);

  return (
    <Screen scrollable>
      <Button
        onPress={run}
        variant="primary"
      >
        <ButtonText>{running ? 'Running…' : 'Run benchmark'}</ButtonText>
      </Button>

      {result && (
        <View style={{ marginTop: 16 }}>
          <Text style={{ color: '#fff', fontSize: 16, marginBottom: 8 }}>Iterations: {result.as.iter}</Text>
          {[result.as, result.mk].map((r: any) => (
            <View key={r.lib} style={{ marginBottom: 12, padding: 12, borderRadius: 8, backgroundColor: '#1b1b1b' }}>
              <Text style={{ color: '#9cf', fontWeight: '700' }}>{r.lib}</Text>
              <Text style={{ color: '#ddd' }}>payload: {r.payloadSize}B</Text>
              <Text style={{ color: '#ddd' }}>write: {r.writeMs.toFixed(1)} ms</Text>
              <Text style={{ color: '#ddd' }}>read: {r.readMs.toFixed(1)} ms</Text>
              <Text style={{ color: '#ddd' }}>
                writes/sec: {(r.iter / (r.writeMs / 1000)).toFixed(1)} • reads/sec: {(r.iter / (r.readMs / 1000)).toFixed(1)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </Screen>
  );
}
// scripts/decode-firebase-config.cjs
const fs = require('fs');

function writeIf(envName, outPath) {
  const b64 = process.env[envName];
  if (!b64) return false;
  const data = Buffer.from(b64, 'base64').toString('utf8');
  fs.writeFileSync(outPath, data);
  console.log(`Wrote ${outPath}`);
  return true;
}

const wroteAndroid = writeIf('EXPO_PUBLIC_ANDROID_GOOGLESERVICES_JSON_B64', 'google-services.json');
const wroteIOS = writeIf('EXPO_PUBLIC_IOS_GOOGLESERVICE_PLIST_B64', 'GoogleService-Info.plist');

if (!wroteAndroid && !wroteIOS) {
  console.warn('No Firebase secrets found to decode.');
}
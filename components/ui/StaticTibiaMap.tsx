// app/components/StaticTibiaMap.tsx
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

type Props = { coord: string; height?: number };

export default function StaticTibiaMap({ coord, height = 300 }: Props) {
  // garante formato x,y,z:zoom
  const hash = coord.includes(':')
    ? coord.trim()
    : (() => { const [x,y,z,zoom='0']=coord.replace(/\s+/g,'').split(','); return `${x},${y},${z}:${zoom}`; })();

  const html = `
<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
<link rel="stylesheet" href="https://tibiamaps.io/_css/map.css">
<style>
  html,body,#map{height:100%;margin:0}
  body{overscroll-behavior:none}
</style>
</head>
<body>
  <div id="map"></div>

  <script>
    // 1) Defina o hash ANTES de carregar o script
    window.location.hash = "#${hash}";
  </script>

  <script src="https://tibiamaps.io/_js/map.js"
          onload="
            // 2) Após carregar, reforça o hash e dispara o evento para quem escuta
            try {
              window.location.hash = '#${hash}';
              window.dispatchEvent(new HashChangeEvent('hashchange'));
            } catch(e) {}
            // 3) Tenta desabilitar via API (se o objeto 'map' existir)
            (function lock(){
              if (window.map) {
                try{
                  map.dragging && map.dragging.disable();
                  map.touchZoom && map.touchZoom.disable();
                  map.scrollWheelZoom && map.scrollWheelZoom.disable();
                  map.doubleClickZoom && map.doubleClickZoom.disable();
                  map.boxZoom && map.boxZoom.disable();
                  map.keyboard && map.keyboard.disable();
                  map.tap && map.tap.disable();
                  map.zoomControl && map.zoomControl.remove();
                }catch(e){}
              } else { setTimeout(lock,80); }
            })();
          ">
  </script>
</body>
</html>`.trim();

  return (
    <View style={{ width: '100%', height }}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        javaScriptEnabled
        domStorageEnabled
        bounces={false}
        style={{ backgroundColor: 'transparent' }}
        // IMPORTANTE: remonta o WebView quando 'coord' muda
        key={hash}
      />
    </View>
  );
}
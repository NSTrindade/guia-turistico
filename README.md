# Guia Turístico e Histórico Interativo (PAM II – Projeto 3)

App React Native (Expo) que destaca pontos turísticos de São Paulo conforme o usuário se move pela cidade.

Repositório: https://github.com/NSTrindade/guia-turistico

## APK para teste
O APK (build release, abre sozinho, sem servidor) está em:

**`apk/guia-turistico.apk`**

Para instalar: copie o arquivo para um celular Android, abra e permita a instalação de fontes desconhecidas. Ao abrir, aceite as permissões de **localização** e **notificações**.

O mapa usa a chave do Google Maps embutida no APK. No `app.json` do repositório a chave fica como `AIzaSyDAFnYDZ2QtfFO3zfz_jh93vBNKlm17-0k`; para compilar o projeto você precisa colocar a sua.

## Requisitos do projeto atendidos
| Recurso | Implementação |
|---|---|
| Mapas | `react-native-maps` com marcadores coloridos por categoria (museu, parque, monumento) e círculo de raio do ponto selecionado |
| Notificações | `expo-notifications`: curiosidade histórica ao entrar no raio de um ponto |
| Widget | `react-native-android-widget`: foto e nome do monumento mais próximo (via GPS) |
| Sensor | `Accelerometer`: "Agite para um ponto aleatório" centraliza o mapa |
| Dados | `src/data/pontos.json` (estático, sem banco externo) |

## Como usar o app
- O mapa mostra os pontos turísticos e a sua posição.
- Use os filtros (Todos, museu, parque, monumento) e toque num ponto ou num card para centralizar no mapa.
- **Agite o celular** para ir a um ponto aleatório.
- Ao chegar perto de um ponto, o app envia uma notificação com uma curiosidade histórica.
- **Widget:** na tela inicial, segure em um espaço vazio > Widgets > "Guia Turístico" > "Monumento mais próximo". Abra o app uma vez antes, para ele receber a localização.

## Como executar o código
Pré-requisitos: Node 18+, Android Studio (SDK) e JDK 17. No Windows, instale o SDK em um caminho **sem espaços** (ex.: `C:\Android\Sdk`) e defina `ANDROID_HOME`.

1. `npm install`
2. Coloque a chave do Google Maps em `app.json` (`android.config.googleMaps.apiKey`). Crie em https://console.cloud.google.com ativando **Maps SDK for Android**.
3. `npx expo prebuild --clean`
4. Celular com depuração USB (ou emulador com Google Play): `npx expo run:android`
5. Nas próximas vezes: `npm start` e abrir o app instalado.

> Não funciona no Expo Go: o widget exige build nativo (dev client).

### Gerar o APK (release)
```
npx expo run:android --variant release
```
O arquivo é gerado em `android/app/build/outputs/apk/release/app-release.apk`.

## Estrutura
```
App.js                      tela principal (mapa, lista, GPS, sensor)
index.js                    registro do app e do widget
apk/guia-turistico.apk      APK release para teste
src/data/pontos.json        pontos de interesse
src/utils/geo.js            Haversine e ponto mais próximo
src/services/notificacoes.js
src/widget/                 widget Android
```

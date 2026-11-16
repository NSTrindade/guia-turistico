# Guia Turístico e Histórico Interativo (PAM II – Projeto 3)

App React Native (Expo) que destaca pontos turísticos de São Paulo conforme você se move pela cidade.

## Requisitos do projeto atendidos
| Recurso | Implementação |
|---|---|
| Mapas | `react-native-maps` com marcadores coloridos por categoria (museu, parque, monumento) e círculo de raio do ponto selecionado |
| Notificações | `expo-notifications`: curiosidade histórica ao entrar no raio de um ponto |
| Widget | `react-native-android-widget`: foto e nome do monumento mais próximo (via GPS) |
| Sensor | `Accelerometer`: "Agite para um ponto aleatório" centraliza o mapa |
| Dados | `src/data/pontos.json` (estático, sem banco externo) |

## Como executar
Pré-requisitos: Node 18+, Android Studio (SDK + emulador ou celular com depuração USB) e JDK 17.

1. `npm install`
2. Coloque sua chave do Google Maps em `app.json` (`android.config.googleMaps.apiKey`). Crie em https://console.cloud.google.com ativando **Maps SDK for Android**.
3. `npx expo prebuild --clean`
4. `npx expo run:android` (compila e instala o app com dev client)
5. Nas próximas vezes: `npm start` e abrir o app instalado.

> Não funciona no Expo Go: widget e react-native-maps com chave própria exigem build nativo (dev client).

### Testar no emulador
No emulador Android: `...` > Location, defina uma coordenada (ex.: MASP: -23.5614, -46.6559) para disparar a notificação. Para o sensor, use Virtual sensors > Move > "Shake".

### Adicionar o widget
Na tela inicial do Android: segure > Widgets > "Guia Turístico" > "Monumento mais próximo". Abra o app uma vez para ele receber a localização.

## Criar o repositório no GitHub
```bash
git init
git add .
git commit -m "Projeto Guia Turístico - PAM II"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/guia-turistico.git
git push -u origin main
```
Crie antes o repositório vazio em https://github.com/new (sem README). Não suba sua chave do Maps: antes do commit, deixe `COLOQUE_SUA_CHAVE_GOOGLE_MAPS_AQUI` no `app.json`.

## Estrutura
```
App.js                      tela principal (mapa, lista, GPS, sensor)
index.js                    registro do app e do widget
src/data/pontos.json        pontos de interesse
src/utils/geo.js            Haversine e ponto mais próximo
src/services/notificacoes.js
src/widget/                 widget Android
```

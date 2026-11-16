import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function prepararNotificacoes() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('curiosidades', {
      name: 'Curiosidades históricas',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function notificarCuriosidade(ponto) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `📍 Você está perto de: ${ponto.nome}`,
      body: ponto.curiosidade,
    },
    trigger: null, // dispara imediatamente
  });
}

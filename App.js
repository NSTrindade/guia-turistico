import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, useColorScheme } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestWidgetUpdate } from 'react-native-android-widget';

import pontos from './src/data/pontos.json';
import { distanciaMetros, formatarDistancia, maisProximo } from './src/utils/geo';
import { prepararNotificacoes, notificarCuriosidade } from './src/services/notificacoes';
import { MonumentoWidget } from './src/widget/MonumentoWidget';
import { CHAVE_WIDGET } from './src/widget/widgetTaskHandler';

const CORES = { museu: '#8b5cf6', parque: '#16a34a', monumento: '#f97316' };
const ICONES = { museu: '🏛️', parque: '🌳', monumento: '🗿' };
const REGIAO_INICIAL = { latitude: -23.5505, longitude: -46.6333, latitudeDelta: 0.08, longitudeDelta: 0.08 };
const LIMITE_SHAKE = 1.8; // em "g"

export default function App() {
  const esquema = useColorScheme();
  const escuro = esquema === 'dark';
  const tema = escuro
    ? { bg: '#111827', card: '#1f2937', texto: '#f9fafb', sub: '#9ca3af' }
    : { bg: '#f3f4f6', card: '#ffffff', texto: '#111827', sub: '#6b7280' };

  const mapRef = useRef(null);
  const jaNotificados = useRef(new Set());
  const ultimoShake = useRef(0);
  const [posicao, setPosicao] = useState(null);
  const [filtro, setFiltro] = useState('todos');
  const [selecionado, setSelecionado] = useState(null);

  // Lista ordenada por distância (quando há GPS)
  const lista = useMemo(() => {
    const base = pontos
      .filter((p) => filtro === 'todos' || p.categoria === filtro)
      .map((p) => ({
        ...p,
        distancia: posicao ? distanciaMetros(posicao.latitude, posicao.longitude, p.latitude, p.longitude) : null,
      }));
    return posicao ? base.sort((a, b) => a.distancia - b.distancia) : base;
  }, [posicao, filtro]);

  const centralizar = useCallback((p) => {
    setSelecionado(p);
    mapRef.current?.animateToRegion(
      { latitude: p.latitude, longitude: p.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 },
      600
    );
  }, []);

  // Localização + notificações + widget
  useEffect(() => {
    let assinatura;
    (async () => {
      await prepararNotificacoes();
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Sem GPS não é possível destacar locais próximos.');
        return;
      }
      assinatura = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, distanceInterval: 20, timeInterval: 5000 },
        async (loc) => {
          const { latitude, longitude } = loc.coords;
          setPosicao({ latitude, longitude });

          // Notificação ao entrar no raio de um ponto (uma vez por ponto)
          for (const p of pontos) {
            const d = distanciaMetros(latitude, longitude, p.latitude, p.longitude);
            if (d <= p.raio && !jaNotificados.current.has(p.id)) {
              jaNotificados.current.add(p.id);
              notificarCuriosidade(p);
            } else if (d > p.raio * 2) {
              jaNotificados.current.delete(p.id); // permite notificar de novo ao voltar
            }
          }

          // Atualiza widget com o monumento mais próximo
          const prox = maisProximo(pontos, latitude, longitude);
          const dados = { nome: prox.nome, foto: prox.foto, distanciaTexto: `a ${formatarDistancia(prox.distancia)}` };
          try {
            await AsyncStorage.setItem(CHAVE_WIDGET, JSON.stringify(dados));
            await requestWidgetUpdate({
              widgetName: 'MonumentoProximo',
              renderWidget: () => <MonumentoWidget ponto={dados} />,
              widgetNotFound: () => {},
            });
          } catch (e) {}
        }
      );
    })();
    return () => assinatura?.remove();
  }, []);

  // Acelerômetro: "Agite para um ponto aleatório"
  useEffect(() => {
    Accelerometer.setUpdateInterval(150);
    const sub = Accelerometer.addListener(({ x, y, z }) => {
      const forca = Math.sqrt(x * x + y * y + z * z);
      const agora = Date.now();
      if (forca > LIMITE_SHAKE && agora - ultimoShake.current > 1500) {
        ultimoShake.current = agora;
        const p = pontos[Math.floor(Math.random() * pontos.length)];
        centralizar(p);
      }
    });
    return () => sub.remove();
  }, [centralizar]);

  const filtros = ['todos', 'museu', 'parque', 'monumento'];

  return (
    <View style={[s.container, { backgroundColor: tema.bg }]}>
      <StatusBar style={escuro ? 'light' : 'dark'} />
      <MapView
        ref={mapRef}
        style={s.mapa}
        initialRegion={REGIAO_INICIAL}
        showsUserLocation
        showsMyLocationButton
      >
        {lista.map((p) => (
          <React.Fragment key={p.id}>
            <Marker
              coordinate={{ latitude: p.latitude, longitude: p.longitude }}
              title={p.nome}
              description={p.descricao}
              pinColor={CORES[p.categoria]}
              onPress={() => setSelecionado(p)}
            />
            {selecionado?.id === p.id && (
              <Circle
                center={{ latitude: p.latitude, longitude: p.longitude }}
                radius={p.raio}
                strokeColor={CORES[p.categoria]}
                fillColor={CORES[p.categoria] + '33'}
              />
            )}
          </React.Fragment>
        ))}
      </MapView>

      <View style={s.filtros}>
        {filtros.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFiltro(f)}
            style={[s.chip, { backgroundColor: filtro === f ? '#2563eb' : tema.card }]}
          >
            <Text style={{ color: filtro === f ? '#fff' : tema.texto, fontSize: 12 }}>
              {f === 'todos' ? 'Todos' : `${ICONES[f]} ${f}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[s.dica, { color: tema.sub }]}>📳 Agite o celular para um ponto surpresa</Text>

      <FlatList
        style={s.lista}
        data={lista}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => centralizar(item)}
            style={[s.card, { backgroundColor: tema.card }, selecionado?.id === item.id && s.cardAtivo]}
          >
            <Image source={{ uri: item.foto }} style={s.foto} />
            <View style={{ flex: 1 }}>
              <Text style={[s.nome, { color: tema.texto }]}>{ICONES[item.categoria]} {item.nome}</Text>
              <Text style={{ color: tema.sub, fontSize: 12 }} numberOfLines={2}>{item.descricao}</Text>
              {item.distancia != null && (
                <Text style={s.dist}>{formatarDistancia(item.distancia)}</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  mapa: { flex: 0.5 },
  filtros: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingVertical: 8 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 },
  dica: { textAlign: 'center', fontSize: 12, marginBottom: 4 },
  lista: { flex: 0.5, paddingHorizontal: 10 },
  card: { flexDirection: 'row', gap: 10, padding: 8, borderRadius: 12, marginBottom: 8, alignItems: 'center' },
  cardAtivo: { borderWidth: 2, borderColor: '#2563eb' },
  foto: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#d1d5db' },
  nome: { fontWeight: '700', fontSize: 14 },
  dist: { color: '#10b981', fontSize: 12, fontWeight: '600', marginTop: 2 },
});

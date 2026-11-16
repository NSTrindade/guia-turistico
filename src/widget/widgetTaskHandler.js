import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MonumentoWidget } from './MonumentoWidget';

export const CHAVE_WIDGET = '@guia/monumento_proximo';

// Chamado pelo Android quando o widget é adicionado/atualizado.
// Lê o último "monumento mais próximo" salvo pelo app.
export async function widgetTaskHandler(props) {
  const { widgetAction, renderWidget } = props;
  if (
    widgetAction === 'WIDGET_ADDED' ||
    widgetAction === 'WIDGET_UPDATE' ||
    widgetAction === 'WIDGET_RESIZED'
  ) {
    let ponto = null;
    try {
      const salvo = await AsyncStorage.getItem(CHAVE_WIDGET);
      ponto = salvo ? JSON.parse(salvo) : null;
    } catch (e) {}
    renderWidget(<MonumentoWidget ponto={ponto} />);
  }
}

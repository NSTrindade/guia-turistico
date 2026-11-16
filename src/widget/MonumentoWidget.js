import React from 'react';
import { FlexWidget, TextWidget, ImageWidget } from 'react-native-android-widget';

export function MonumentoWidget({ ponto }) {
  if (!ponto) {
    return (
      <FlexWidget
        style={{ height: 'match_parent', width: 'match_parent', backgroundColor: '#1f2937',
          borderRadius: 16, justifyContent: 'center', alignItems: 'center', padding: 12 }}
      >
        <TextWidget text="Abra o app para localizar o monumento mais próximo" style={{ fontSize: 14, color: '#ffffff' }} />
      </FlexWidget>
    );
  }
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{ height: 'match_parent', width: 'match_parent', backgroundColor: '#1f2937',
        borderRadius: 16, flexDirection: 'row', alignItems: 'center', padding: 8 }}
    >
      <ImageWidget
        image={ponto.foto}
        imageWidth={90}
        imageHeight={90}
        style={{ height: 90, width: 90, borderRadius: 12 }}
      />
      <FlexWidget style={{ flex: 1, paddingLeft: 12 }}>
        <TextWidget text="Mais próximo de você" style={{ fontSize: 11, color: '#9ca3af' }} />
        <TextWidget text={ponto.nome} maxLines={2} style={{ fontSize: 16, fontWeight: 'bold', color: '#ffffff' }} />
        <TextWidget text={ponto.distanciaTexto} style={{ fontSize: 13, color: '#34d399' }} />
      </FlexWidget>
    </FlexWidget>
  );
}

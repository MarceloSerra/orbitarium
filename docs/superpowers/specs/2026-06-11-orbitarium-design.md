# Orbitarium - Sistema Solar 3D Interativo

## Overview

Um explorador 3D do sistema solar usando React Three Fiber, @react-three/drei, e React Spring. O projeto renderiza o Sol, os 8 planetas com texturas realistas (NASA + fallback procedural), órbitas visíveis, e um fundo espacial com estrelas e galáxias distantes. Ao clicar em qualquer corpo celeste, um drawer lateral mostra informações detalhadas incluindo fatos curiosos.

## Tech Stack

| Tecnologia | Propósito |
|------------|-----------|
| Vite + TypeScript | Build tool e type safety |
| React 18+ | Framework UI |
| React Three Fiber (R3F) | Renderização 3D declarativa |
| @react-three/drei | Helpers: OrbitControls, Stars, Text, Html |
| @react-spring/three | Animações orbitais suaves |
| Zustand | Estado global mínimo (planeta selecionado) |
| Framer Motion | Animações UI do drawer |

## Arquitetura

```
orbitarium/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
├── README.md
├── .agents/
│   └── AGENTS.md              # Configuração de agentes para manutenção
├── docs/
│   ├── architecture.md         # Decisões arquiteturais
│   ├── components.md           # Guia de componentes
│   └── contributing.md         # Como contribuir
├── src/
│   ├── main.tsx                # Entry point
│   ├── App.tsx                 # Root component
│   ├── types/
│   │   └── planet.ts           # Interfaces: PlanetData, OrbitConfig, celestialInfo
│   ├── data/
│   │   └── planets.ts          # Dados reais + constantes de escala híbrida
│   ├── textures/
│   │   └── texture-manager.ts  # Carrega NASA URLs com fallback procedural
│   ├── components/
│   │   ├── SolarSystem.tsx     # Cena completa (Sol + planetas + órbitas)
│   │   ├── Planet.tsx          # Componente reutilizável de planeta
│   │   ├── Sun.tsx             # Sol com glow shader
│   │   ├── OrbitPath.tsx       # Linha orbital visível (raio de orbitação)
│   │   └── SpaceBackground.tsx # Fundo preto + estrelas + galáxias distantes
│   ├── ui/
│   │   ├── InfoPanel.tsx       # Drawer lateral com detalhes do planeta
│   │   └── OrbitControls.tsx   # Controles de câmera (rotate, zoom, pan)
│   └── hooks/
│       └── use-orbit.ts        # Hook para animação orbital com React Spring
├── public/
│   └── textures/               # Texturas cacheadas localmente
```

## Design Decisions

### Escala Híbrida
- **Tamanhos**: Proporcionais reais (Júpiter >> Terra >> Marte)
- **Distâncias**: Comprimidas para visualização (planetas visíveis sem zoom extremo)
- Constantes definidas em `data/planets.ts` com `scaledRadius` e `scaledDistance`

### Texturas Duplas
1. **Primária**: URLs NASA (https://svs.gsfc.nasa.gov/) - texturas reais de alta resolução
2. **Fallback**: Procedural shaders gerando cores baseadas nos dados reais do planeta
3. Implementado em `texture-manager.ts` com retry e timeout

### Animação Orbital
- React Spring para interpolação suave dos ângulos orbitais
- Velocidades proporcionais às reais (Mercúrio rápido, Netuno lento)
- Pause/resume via UI controls

### InfoPanel Drawer
- Slide-in do lado direito ao clicar num planeta
- Framer Motion para animação suave
- Contém: nome, imagem, massa, raio, distância solar, período orbital, temperatura, composição, fatos curiosos
- Close button e click outside para fechar

## Componentes Chave

### Planet.tsx
```tsx
interface PlanetProps {
  data: PlanetData;
  orbitAngle: number;
  onClick: () => void;
}
```
Responsável por renderizar um planeta com textura, anéis (Saturno), e rotação axial.

### Sun.tsx
Shader customizado para efeito de glow/corona solar. Point light central iluminando a cena.

### OrbitPath.tsx
Linha circular visível mostrando o raio de orbitação de cada planeta.

### SpaceBackground.tsx
Fundo preto com `Stars` do drei (pontos distantes) + partículas para galáxias.

### InfoPanel.tsx
Drawer animado com dados formatados, imagem do planeta, e scroll se necessário.

## Dados Planetários

Cada planeta inclui:
- Nome, tipo (rochoso/gasoso/geleira)
- Massa (kg), raio (km)
- Distância média do Sol (AU → scaled)
- Período orbital (dias terrestres)
- Temperatura média (°C)
- Composição atmosférica
- Número de luas
- Fatos curiosos (2-3 por planeta)
- URL textura NASA + cor fallback

## Estado Global (Zustand)

```ts
interface Store {
  selectedPlanet: PlanetData | null;
  setSelectedPlanet: (planet: PlanetData | null) => void;
  orbitSpeed: number;
  setOrbitSpeed: (speed: number) => void;
}
```

## Erros & Edge Cases

- Textura falha → fallback procedural automático
- Click em planeta já selecionado → toggle close do drawer
- Múltiplos clicks rápidos → debounce no handler
- Performance: limit stars a 5000, usar instanced mesh para partículas

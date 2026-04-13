# Jogo de Tiro na Favela - Implementation Plan

Vou criar um jogo básico de tiro com a temática de favela diretamente no seu `App.jsx` usando React e HTML5 Canvas.

## User Review Required
> [!IMPORTANT]
> O jogo será um minigame onde você controla um personagem que pode atirar em inimigos que aparecem na tela. Preciso da sua aprovação para gerar os gráficos (pixel art) e substituir o conteúdo do `App.jsx` atual.

## Proposed Changes

Vou seguir as seguintes etapas:

### 1. Geração de Arte (Assets)
Vou usar inteligência artificial para gerar imagens de pixel art exclusivas para o jogo, que ficarão salvas no projeto e deixarão o visual sensacional:
- Um background com cenário de favela.
- Sprite do jogador.
- Sprite dos inimigos.

### 2. Criação do Jogo
#### [MODIFY] src/App.jsx
- Implementar o motor do jogo usando o elemento `<canvas>`.
- Adicionar movimentação do jogador (Cima/Baixo/Esquerda/Direita).
- Adicionar mecânica de atirar (Barra de Espaço ou Clique).
- Sistema de pontuação e "Game Over".
- Adicionar um menu inicial bonito.

#### [MODIFY] src/App.css
- Adicionar estilos para centralizar o jogo e criar uma interface de usuário temática (telas de início, game over e pontuação).

## Open Questions
- Você quer que o jogador se mova livremente pela tela ou estilo Space Invaders (apenas para os lados ou cima/baixo atirando para frente)? Minha sugestão é estilo "Side-scroller" (atirador lateral) onde o jogador fica à esquerda e os inimigos vêm da direita.
- Posso seguir com o estilo visual em Pixel Art?

## Verification Plan
Após implementar, vou instruir você sobre como rodar o jogo (usando seu servidor de desenvolvimento, provavelmente `npm run dev`) para que você possa testar a movimentação e combate.

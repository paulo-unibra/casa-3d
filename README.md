# Casa C8 — passeio virtual

Modelo 3D navegável da casa C8 em Igarassu, PE, feito a partir do laudo de avaliação de 27/02/2026 e das fotografias e vídeo enviados pelo proprietário.

## Iniciar

```bash
npm install
npm run dev
```

Para atualizar o GitHub Pages, execute `npm run build` e envie também os arquivos gerados na raiz (`index.html`, `assets/`, `fachada.jpg`, `lateral.jpg`). O Pages deve usar **Deploy from a branch → main → /(root)**. O arquivo `source.html` é a entrada do Vite para desenvolvimento; o `index.html` da raiz é o resultado compilado. O conteúdo de `dist/` também pode ser publicado em outra hospedagem estática.

## Controles

- **Vista superior (abertura):** arraste para girar, role/pinça para aproximar; os nomes dos cômodos ajudam a localizar cada área.
- **Caminhar:** arraste para olhar, use WASD/setas para andar e Q/E para girar. Em telas de toque, arraste na cena para olhar e use as setas na tela para andar. O botão **Ambientes** abre atalhos no celular.
- **Fachada/Teto:** mostra a casa por fora ou oculta a cobertura. **Ambientes:** botões levam a pontos de visita com a câmera voltada para o interior. **Recentrar:** retorna a câmera do modo atual à posição inicial.

## Planta e precisão

A planta enviada pelo proprietário define a **disposição** dos ambientes. Olhando da frente para os fundos: terraço à esquerda e quarto 1 à direita; sala ao centro com quarto 2 à direita; banheiro e área de serviço à esquerda dos fundos, cozinha à direita. Os acessos internos foram posicionados conforme as aberturas desenhadas na planta. Na parede lateral direita há somente uma janela, no quarto 2; a cozinha e o quarto 1 não têm janelas nessa lateral. A planta original está disponível na interface para comparação.

O laudo de 27/02/2026 informa **54,07 m² de área privativa** e **114,88 m² de terreno**, mas a planta enviada não contém cotas lineares. O contorno aproximado de 6,40 × 8,45 m e cada dimensão de parede, porta e janela foram estimados pelas proporções do desenho e pelas fotografias. Mobiliário e peças sanitárias são representações esquemáticas. Não use o modelo para obra ou mobiliário sob medida sem levantamento in loco.

O PDF, o vídeo e dados documentais pessoais não são publicados. O repositório inclui somente duas fotografias comprimidas da fachada/lateral e a planta enviada.

Se o dispositivo não oferecer WebGL, a página mostra uma mensagem de compatibilidade e as fotografias, sem permanecer indefinidamente na tela de carregamento.

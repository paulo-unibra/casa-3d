# Casa C8 — passeio virtual

Modelo 3D navegável da casa C8 em Igarassu, PE, feito a partir do laudo de avaliação de 27/02/2026 e das fotografias e vídeo enviados pelo proprietário.

## Iniciar

```bash
npm install
npm run dev
```

Para atualizar o GitHub Pages, execute `npm run build` e envie também os arquivos gerados na raiz (`index.html`, `assets/`, `fachada.jpg`, `lateral.jpg`). O Pages deve usar **Deploy from a branch → main → /(root)**. O arquivo `source.html` é a entrada do Vite para desenvolvimento; o `index.html` da raiz é o resultado compilado. O conteúdo de `dist/` também pode ser publicado em outra hospedagem estática.

## Controles

- **Visão aérea:** arraste para girar, role para aproximar, clique nos ambientes para focar.
- **Passeio:** mouse/arrasto para olhar, WASD ou setas para andar, Q/E para girar. Em telas de toque, arraste para olhar e use as setas.
- **Teto:** exibe ou oculta a cobertura. **Ambientes:** botões levam a pontos de visita.

## Precisão e fontes

O laudo informa **54,07 m² de área privativa** e **114,88 m² de terreno**, além de sala, dois quartos, cozinha, banheiro, terraço, área de serviço e jardim. As duas fotos da fachada e o vídeo mostram acabamentos, aberturas, circulação externa e parte dos interiores. O laudo não inclui planta baixa cotada; a testada de 1,00 m na tabela não é utilizável como largura física da unidade. Portanto o retângulo modelado com 6,40 × 8,45 m, as paredes, posições internas de portas e janelas, alturas e dimensões do lote são **estimativas visuais**. Não use este modelo para obra, compra de móveis sob medida ou projeto executivo sem levantamento in loco. A cobertura é simplificada; não há demonstração suficiente do telhado pelo interior.

O PDF, o vídeo e dados documentais pessoais não são publicados aqui. Somente duas fotografias da fachada, comprimidas para uso no visualizador, acompanham o código.

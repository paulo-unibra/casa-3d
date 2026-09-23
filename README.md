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
- **Garagem:** o botão leva à faixa lateral direita ampliada, com o carro prateado estacionado e espaço para circular. Também aparece na vista superior.
- **Portas e grades:** clique ou toque nas folhas dos quartos, banheiro, serviço, fundos, porta de correr da sala ou grades da fachada e dos fundos para abrir e fechar. Uma passagem fechada bloqueia a caminhada; afaste-se da soleira antes de fechá-la.

## Planta e precisão

A planta enviada pelo proprietário define a **disposição** dos ambientes. Olhando da frente para os fundos: terraço à esquerda e quarto 1 à direita; sala ao centro com quarto 2 à direita; banheiro e área de serviço à esquerda dos fundos, cozinha à direita. Os acessos internos foram posicionados conforme as aberturas desenhadas na planta. A grade frontal ocupa a abertura larga do terraço, a passagem terraço–sala tem porta de correr, e os quartos, banheiro e serviço têm folhas abertas no passeio. Na parede lateral direita há somente uma janela, no quarto 2; a cozinha e o quarto 1 não têm janelas nessa lateral. A planta original está disponível na interface para comparação.

O reboco externo usa amarelo claro conforme a fotografia da fachada; as faixas de cerâmica continuam verdes. As folhas das portas dos dois quartos e do banheiro são marrons. As portas metálicas de serviço e dos fundos mantêm seu acabamento claro.

Na frente da casa aparece uma figura fotográfica gerada a partir do retrato e do violão enviados pelo proprietário, sentada em um banquinho. Três poses são interpoladas continuamente: a mão direita toca o violão, a boca abre e fecha como se cantasse, e o corpo balança de leve. Ela acompanha a direção da câmera e não ocupa a passagem para a entrada. A animação é visual, sem gravação de voz ou música.

A segunda versão da figura usa fotografias adicionais do proprietário para aproximar seu rosto, cabelo e óculos reais, preservando o violão enviado como referência.

Ao lado dele, a cantora foi criada a partir das três fotos fornecidas. Ela aparece sentada em outro banquinho, com vestido longo de mangas compridas, e animações independentes de boca, gesto e balanço do corpo. Os dois permanecem ao lado da entrada, deixando livre o caminho do terraço. O canto de ambos é somente visual, sem áudio gravado.

O laudo de 27/02/2026 informa **54,07 m² de área privativa** e **114,88 m² de terreno**, mas a planta enviada não contém cotas lineares. O contorno aproximado de 6,40 × 8,45 m e cada dimensão de parede, porta e janela foram estimados pelas proporções do desenho e pelas fotografias. Mobiliário e peças sanitárias são representações esquemáticas. Não use o modelo para obra ou mobiliário sob medida sem levantamento in loco.

A garagem lateral foi alargada no modelo para cerca de 3,35 m livres sobre um piso de concreto. O Corsa prateado é uma representação 3D estilizada baseada na fotografia enviada, estacionado com a frente voltada para a rua. O proprietário preferiu o formato mais quadrado da primeira versão, com o emblema Chevrolet e a placa KLL3G96 acrescentados à frente. A largura da garagem foi estimada pela foto e pelo pedido do proprietário, sem cotas confirmadas no terreno.

O PDF, o vídeo e dados documentais pessoais não são publicados. O repositório inclui somente duas fotografias comprimidas da fachada/lateral e a planta enviada.

Se o dispositivo não oferecer WebGL, a página mostra uma mensagem de compatibilidade e as fotografias, sem permanecer indefinidamente na tela de carregamento.

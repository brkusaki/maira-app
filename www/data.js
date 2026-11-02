// Conteúdo fixo do app (listas, guias, calendário). Edite à vontade.
window.CONTEUDO = {
  recados: [
    "Você é a mulher mais forte que eu conheço. Te amo! 💛",
    "Falta pouco pra gente conhecer a Maya. Obrigado por tudo que você está fazendo por ela.",
    "Bebe uma água aí, mamãe! 💧",
    "Se precisar de qualquer coisa, é só apertar o botão do Bruno no app.",
    "A Maya tem muita sorte de ter você como mãe.",
    "Hoje descansa um pouquinho, tá? Eu cuido do resto.",
    "Cada noite mal dormida vai valer a pena. Você está indo muito bem!",
    "Tenho orgulho de você todos os dias.",
    "Não precisa dar conta de tudo sozinha. Somos um time. 🤝",
    "Você já fez isso duas vezes e fez lindo. Agora é a vez da Maya.",
  ],

  mala: {
    "Mãe": [
      "Camisolas/pijamas com abertura na frente (3)", "Sutiãs de amamentação (2)", "Calcinhas de cintura alta (5)",
      "Absorventes pós-parto (noturnos)", "Protetores de seio", "Pomada/lanolina para os mamilos", "Chinelo e meias",
      "Roupão", "Itens de higiene (escova, pasta, xampu, desodorante)", "Escova de cabelo e prendedor",
      "Roupa confortável para a saída", "Toalha (se a maternidade pedir)", "Carregador de celular (cabo longo)", "Lanchinhos e garrafinha de água",
    ],
    "Maya": [
      "Bodies (6)", "Mijões/calças (6)", "Macacões (4)", "Meias e luvinhas (3 pares)", "Toucas (2)",
      "Manta/cueiro (2)", "Fraldas RN (1 pacote)", "Lenços umedecidos ou algodão", "Pomada para assaduras",
      "Fraldas de pano (4)", "Saída de maternidade", "Bebê-conforto instalado no carro",
    ],
    "Documentos": [
      "RG e CPF da Maíra", "RG e CPF do Bruno", "Cartão do pré-natal / caderneta da gestante", "Exames e ultrassons",
      "Carteirinha do plano de saúde / cartão SUS", "Plano de parto impresso", "Certidão de casamento (se houver)",
    ],
    "Bruno (acompanhante)": [
      "Troca de roupa", "Itens de higiene", "Carregador", "Dinheiro/cartão para estacionamento e lanche", "Travesseiro",
    ],
  },

  alertasGestacao: [
    ["Perdeu líquido (bolsa rompeu)", "Anote a hora e a cor. Claro: vá para a maternidade sem correria. Verde, marrom ou com sangue: vá agora."],
    ["Sangramento vivo", "Sangramento como menstruação ou maior: vá para a maternidade agora."],
    ["Maya mexendo bem menos", "Use o contador de movimentos. Se não sentir 10 movimentos em 2 horas, ligue para a médica ou vá à maternidade."],
    ["Dor de cabeça forte, visão embaçada, inchaço súbito no rosto/mãos", "Podem ser sinais de pressão alta. Procure atendimento no mesmo dia."],
    ["Febre (38 °C ou mais)", "Procure atendimento."],
    ["Contrações regulares", "Use o contador. Como é o seu 3º parto, ele pode ser mais rápido: combine com a médica quando sair de casa."],
  ],

  alertasMae: [
    ["Sangramento que enche um absorvente em 1 hora ou coágulos grandes", "Procure atendimento agora."],
    ["Febre de 38 °C ou mais", "Pode ser infecção (útero, pontos, mama). Procure atendimento."],
    ["Mama vermelha, quente, dolorida e com febre", "Pode ser mastite. Procure a médica; não pare de amamentar sem orientação."],
    ["Dor, inchaço ou vermelhidão em uma perna só", "Procure atendimento no mesmo dia."],
    ["Pontos/cicatriz com pus, cheiro forte ou abrindo", "Procure atendimento."],
    ["Falta de ar ou dor no peito", "Ligue 192 (SAMU)."],
    ["Tristeza que não passa depois de 2 semanas, angústia, vontade de sumir ou de se machucar", "Fale com alguém hoje: o Bruno, a médica, o CVV (188, 24h) ou a UBS. Isso tem tratamento e é mais comum do que parece."],
  ],

  alertasBebe: [
    ["Febre (37,8 °C ou mais na axila) antes dos 3 meses", "Pronto-socorro na hora, mesmo que pareça bem."],
    ["Respiração difícil, gemendo, lábios arroxeados", "Ligue 192 (SAMU)."],
    ["Muito molinha, difícil de acordar, recusando mamar", "Procure atendimento."],
    ["Amarelinha (icterícia) aumentando, chegando na barriga/pernas", "Avise a pediatra no mesmo dia."],
    ["Cocô branco, cinza ou bem clarinho", "Confira o cartão de cores da caderneta e procure a pediatra."],
    ["Poucas fraldas molhadas (menos de 6 por dia depois do 5º dia)", "Pode ser pouco leite. Fale com a pediatra."],
    ["Vômito verde ou em jato repetido", "Procure atendimento."],
    ["Umbigo vermelho em volta, com pus ou cheiro ruim", "Procure a pediatra."],
  ],

  testes: [
    ["pezinho", "Teste do pezinho", "Entre o 3º e o 5º dia de vida, na UBS ou maternidade."],
    ["orelhinha", "Teste da orelhinha", "Ainda na maternidade ou até 1 mês."],
    ["olhinho", "Teste do olhinho (reflexo vermelho)", "Na maternidade e nas consultas."],
    ["coracao", "Teste do coraçãozinho", "Entre 24 e 48 horas de vida, na maternidade."],
    ["linguinha", "Teste da linguinha", "Na maternidade, antes da alta."],
  ],

  // Calendário Nacional de Vacinação 2026 (Ministério da Saúde). dias = idade em dias aprox.
  vacinas: [
    ["bcg", 0, "Ao nascer", "BCG (dose única)"],
    ["hepb", 0, "Ao nascer", "Hepatite B"],
    ["m2", 60, "2 meses", "Penta 1ª, VIP 1ª, Rotavírus 1ª, Pneumocócica 1ª"],
    ["m3", 90, "3 meses", "Meningocócica C 1ª"],
    ["m4", 120, "4 meses", "Penta 2ª, VIP 2ª, Rotavírus 2ª, Pneumocócica 2ª"],
    ["m5", 150, "5 meses", "Meningocócica C 2ª"],
    ["m6", 180, "6 meses", "Penta 3ª, VIP 3ª, Influenza, Covid-19 1ª"],
    ["m7", 210, "7 meses", "Covid-19 2ª"],
    ["m9", 270, "9 meses", "Febre amarela, Covid-19 3ª"],
    ["m12", 365, "12 meses", "Pneumocócica reforço, Meningocócica ACWY, Tríplice viral 1ª"],
    ["m15", 456, "15 meses", "DTP reforço, VIP reforço, Tríplice viral 2ª, Varicela, Hepatite A"],
  ],

  docs: [
    ["dnv", "Declaração de Nascido Vivo (DNV)", "A maternidade entrega. Guarde bem: precisa dela no cartório."],
    ["certidao", "Certidão de nascimento", "No cartório ou no posto da maternidade (se tiver). Faça o quanto antes; o CPF já sai junto."],
    ["sus", "Cartão SUS da Maya", "Na UBS, com a certidão."],
    ["plano", "Incluir a Maya no plano de saúde", "Até 30 dias do nascimento para não ter carência."],
    ["caderneta", "Caderneta da Criança", "A maternidade entrega. Leve em todas as consultas e vacinas."],
    ["licmae", "Licença-maternidade / salário-maternidade", "Avisar o trabalho ou pedir no INSS (Meu INSS) se for autônoma/MEI."],
    ["licpai", "Licença-paternidade do Bruno", "Confirmar os dias com o RH."],
    ["pediatra", "Primeira consulta com a pediatra", "Normalmente na 1ª semana de vida."],
    ["revisao", "Consulta pós-parto da Maíra", "Até uns 42 dias depois do parto."],
  ],

  fraldaDica: "Esperado de xixi: 1º dia 1 fralda, 2º dia 2, 3º dia 3... e a partir do 5º–6º dia 6 ou mais por dia. Cocô: preto e grudento (mecônio) nos primeiros 2 dias, depois esverdeado e então amarelo-mostarda.",
  mamadaDica: "Recém-nascido costuma mamar de 8 a 12 vezes em 24 horas (a cada 2–3 horas). Comece a próxima mamada pelo lado que terminou ou que ficou mais cheio.",

  dicasMae: [
    ["Água", "Amamentando dá muita sede. Deixe uma garrafa do lado do lugar onde amamenta."],
    ["Pega", "Boca bem aberta, lábios virados pra fora, pegando boa parte da aréola. Doeu muito? Tire com o dedinho no canto da boca e tente de novo."],
    ["Durma quando ela dormir", "Pelo menos uma soneca por dia. Louça espera."],
    ["Visitas", "Pode dizer não ou pedir visitas curtas. Quem vier, que traga comida. 😄"],
    ["Baby blues", "Choro fácil e emoção à flor da pele nas 2 primeiras semanas é comum. Se passar disso ou pesar demais, fale com a médica."],
    ["Peça ajuda", "Use o botão do Bruno: ele recebe a mensagem no WhatsApp."],
  ],

  pedidosBruno: [
    "Me traz água, por favor 💧", "Preciso de você aqui agora", "Pode trocar a fralda da Maya?", "Traz um lanche pra mim? 🍫",
    "Pega a Maya um pouquinho pra eu descansar?", "Acho que entrei em trabalho de parto! 🚨", "Tô bem, só com saudade ❤️",
  ],
};

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

  // Calendário Nacional de Vacinação 2026 (Ministério da Saúde) — idade em dias aproximada.
  // [id do grupo, dias, rótulo, [[id da dose, vacina, dose, previne]]]
  vacinas: [
    ["bcg", 0, "Ao nascer", [["bcg", "BCG", "Dose única", "Formas graves de tuberculose"], ["hepb", "Hepatite B", "Dose ao nascer", "Hepatite B"]]],
    ["m2", 60, "2 meses", [["penta1", "Penta (DTP + Hib + Hepatite B)", "1ª dose", "Difteria, tétano, coqueluche, Haemophilus b e hepatite B"], ["vip1", "VIP (poliomielite inativada)", "1ª dose", "Paralisia infantil"], ["rota1", "Rotavírus", "1ª dose", "Diarreia por rotavírus"], ["pneumo1", "Pneumocócica", "1ª dose", "Pneumonia, meningite e otite por pneumococo"]]],
    ["m3", 90, "3 meses", [["menc1", "Meningocócica C", "1ª dose", "Meningite C"]]],
    ["m4", 120, "4 meses", [["penta2", "Penta (DTP + Hib + Hepatite B)", "2ª dose", "Difteria, tétano, coqueluche, Haemophilus b e hepatite B"], ["vip2", "VIP (poliomielite inativada)", "2ª dose", "Paralisia infantil"], ["rota2", "Rotavírus", "2ª dose", "Diarreia por rotavírus"], ["pneumo2", "Pneumocócica", "2ª dose", "Pneumonia, meningite e otite por pneumococo"]]],
    ["m5", 150, "5 meses", [["menc2", "Meningocócica C", "2ª dose", "Meningite C"]]],
    ["m6", 180, "6 meses", [["penta3", "Penta (DTP + Hib + Hepatite B)", "3ª dose", "Difteria, tétano, coqueluche, Haemophilus b e hepatite B"], ["vip3", "VIP (poliomielite inativada)", "3ª dose", "Paralisia infantil"], ["flu1", "Influenza (gripe)", "1ª dose", "Gripe — na 1ª vez são 2 doses com 30 dias"], ["covid1", "Covid-19", "1ª dose", "Covid-19"]]],
    ["m7", 210, "7 meses", [["covid2", "Covid-19", "2ª dose", "Covid-19"]]],
    ["m9", 270, "9 meses", [["fa1", "Febre amarela", "1ª dose", "Febre amarela"], ["covid3", "Covid-19", "3ª dose", "Covid-19"]]],
    ["m12", 365, "12 meses", [["pneumoR", "Pneumocócica", "Reforço", "Pneumonia, meningite e otite por pneumococo"], ["acwy", "Meningocócica ACWY", "Dose", "Meningites A, C, W e Y"], ["scr1", "Tríplice viral", "1ª dose", "Sarampo, caxumba e rubéola"]]],
    ["m15", 456, "15 meses", [["dtp1", "DTP (tríplice bacteriana)", "1º reforço", "Difteria, tétano e coqueluche"], ["vipR1", "VIP (poliomielite)", "1º reforço", "Paralisia infantil"], ["scr2", "Tríplice viral", "2ª dose", "Sarampo, caxumba e rubéola"], ["var1", "Varicela", "1ª dose", "Catapora"], ["hepa", "Hepatite A", "Dose", "Hepatite A"]]],
    ["a4", 1461, "4 anos", [["dtp2", "DTP (tríplice bacteriana)", "2º reforço", "Difteria, tétano e coqueluche"], ["vipR2", "VIP (poliomielite)", "2º reforço", "Paralisia infantil"], ["var2", "Varicela", "2ª dose", "Catapora"], ["faR", "Febre amarela", "Reforço", "Febre amarela"]]],
  ],

  // Semana a semana da gestação: [semana, título, texto, dica]
  semanasGestacao: [
    [36, "Reta final", "A Maya está quase pronta: ganha gordurinha toda semana e vai se encaixando de cabeça para baixo.", "Deixe a mala pronta e combine com o Bruno o caminho até a maternidade."],
    [37, "A termo precoce", "Ela segue ganhando uns 200 g por semana e treina sugar, engolir e \"respirar\" o líquido amniótico. Em média tem uns 48 cm e 2,9 kg.", "Confira a mala e os documentos. Já pode imprimir o plano de parto."],
    [38, "Quase lá", "Os órgãos estão formados; cérebro e pulmões continuam amadurecendo. Em média, 49 cm e 3,1 kg.", "As contrações de treino ficam mais frequentes. Use o cronômetro para ver se estão ficando regulares."],
    [39, "Termo completo", "A partir de 39 semanas é termo completo. Ela tem cada vez menos espaço, mas os movimentos continuam: só mudam de jeito. Em média, 50 cm e 3,3 kg.", "Os movimentos não devem diminuir. Se perceber menos, faça a contagem de movimentos."],
    [40, "Semana da DPP", "Poucos bebês nascem exatamente na data provável: o normal é chegar entre 37 e 42 semanas. Em média, 51 cm e 3,4 kg.", "Descanse, coma bem e mantenha as consultas em dia."],
    [41, "Termo tardio", "A médica costuma pedir avaliações mais frequentes, como cardiotocografia e ultrassom, e conversar sobre indução.", "Siga o plano combinado com a médica e fique atenta aos movimentos."],
    [42, "Pós-termo", "A equipe acompanha bem de perto e normalmente indica o nascimento.", "Mantenha contato com a maternidade e a médica."],
  ],
  // Semana a semana da bebê: [até o dia de vida, título, texto, dica]
  semanasBebe: [
    [6, "Primeira semana", "Perder até uns 10% do peso nos primeiros dias é esperado. Ela dorme de 16 a 18 horas por dia, em cochilos, e mama de 8 a 12 vezes.", "Teste do pezinho entre o 3º e o 5º dia. Conte as fraldas: a partir do 5º dia, 6 ou mais de xixi."],
    [13, "Segunda semana", "Ela deve recuperar o peso de nascimento até umas 2 semanas de vida. O coto do umbigo costuma cair entre 1 e 3 semanas.", "Mantenha o coto limpo e seco, do jeito que a pediatra orientar."],
    [20, "Terceira semana", "É comum um pico de crescimento por volta de 2 a 3 semanas: ela pode querer mamar bem mais por alguns dias. Isso ajuda a aumentar o leite.", "Muita mamada nesses dias é normal. Peça ajuda pro Bruno com o resto."],
    [34, "Quarta e quinta semanas", "Ela olha por mais tempo para rostos e se acalma com a voz de vocês. O choro costuma aumentar nessa fase.", "Colo, som contínuo (aba Ninar) e embalar ajudam muito."],
    [55, "Seis e sete semanas", "O choro costuma chegar ao pico por volta de 6 semanas e depois diminuir. O sorriso social, de propósito pra vocês, costuma aparecer entre 6 e 8 semanas.", "Quando vier o primeiro sorriso, guarde nos Momentos!"],
    [89, "Dois meses", "Faz sons (os \"arrulhos\"), acompanha objetos com o olhar e sustenta melhor a cabeça de barriguinha para baixo (sempre acordada e com alguém olhando).", "Mês das vacinas de 2 meses. Leve a caderneta!"],
    [119, "Três meses", "Descobre as mãos, leva tudo à boca, ri mais e firma bem o pescoço.", "Conversar e cantar com ela ajuda muito no desenvolvimento."],
    [179, "Quatro e cinco meses", "Pode começar a rolar, agarra objetos e dá gargalhadas.", "Nunca deixe sozinha na cama ou no trocador: ela já pode virar."],
    [99999, "Seis meses ou mais", "Senta com apoio e se prepara para começar a comer, sempre com orientação da pediatra.", "Converse com a pediatra sobre a introdução alimentar."],
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

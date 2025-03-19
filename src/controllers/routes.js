require('dotenv').config({ path: '.env' });

const router = require('express').Router();
const { verifyKeyMiddleware } = require('discord-interactions');
const { PUBLIC_KEY } = process.env;

// Configuração do middleware de verificação
router.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString('utf8');
    },
  })
);

// Rota principal de interações
router.post(
  '/',
  verifyKeyMiddleware(PUBLIC_KEY), // Middleware de verificação
  (req, res) => {
    console.log('chama');
    const { type } = req.body;

    // Resposta para PING
    if (type === 1) {
      return res.status(200).json({ type: 1 });
    }

    // Tratamento de outros tipos de interação
    switch (type) {
      case 2: // Comando slash
        return handleCommand(req, res);
      case 3: // Componentes de mensagem
        return handleComponent(req, res);
      default:
        return res
          .status(400)
          .json({ error: 'Tipo de interação não suportado' });
    }
  }
);

// Funções auxiliares
function handleCommand(req, res) {
  const { data } = req.body;
  console.log(`Comando recebido: ${data.name}`);

  // Exemplo de resposta para um comando /teste
  if (data.name === 'teste') {
    return res.json({
      type: 4,
      data: {
        content: 'Funciona! ✅',
        flags: 64, // Ephemeral response
      },
    });
  }

  res.status(404).json({ error: 'Comando não encontrado' });
}

function handleComponent(req, res) {
  const { data } = req.body;
  console.log(`Componente acionado: ${data.custom_id}`);

  // Exemplo de resposta para um botão
  return res.json({
    type: 7, // UPDATE_MESSAGE
    data: {
      content: 'Botão clicado! 🎉',
      components: [],
    },
  });
}

module.exports = router;

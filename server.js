const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Banco fake
const usuarioDB = {
  usuario: "gustavo",
  senha: "1234"
};

// Rota login
app.post("/login", (req, res) => {
  const { usuario, senha } = req.body;

  if (usuario === usuarioDB.usuario && senha === usuarioDB.senha) {
    return res.json({ success: true });
  } else {
    return res.status(401).json({ success: false });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
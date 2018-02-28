import expressPromiseRouter from 'express-promise-router'
import connection from '../config/database.js'
import Contato from '../models/contato.js'

const router = expressPromiseRouter();

//GET
router.get('/:idContato?', (req, res, next) => {
  const contato = { _id: req.query.idContato }
  const contexto = { contato, res }
  return Promise.resolve(contexto)
     .then(buscarContato)
     .then(contexto => res.status(200).json(contexto.retorno))
     .catch(err => handleError(err, res, 'Erro ao buscar contatos'))
})

//POST
router.post('/', (req, res, next) => {
  const contato = new Contato(req.body)
  const contexto = { contato, res }
  return Promise.resolve(contexto)
    .then(salvarContato)
    .then(id => res.status(200).json({ sucesso: true, contato: { _id: contato._id }}))
    .catch(err => handleError(err, res, 'Erro ao salvar contato'))
})

//PUT
router.put('/', (req, res, next) => {
  const contato = req.body
  const contexto = { contato, res }
  return Promise.resolve(contexto)
    .then(buscarContato)
    .then(alterarContato)
    .then(contexto => res.status(200).json({ sucesso: true }))
    .catch(err => handleError(err, res, 'Erro ao alterar contato'))
})
//DELETE
router.delete('/:idContato?', (req, res, next) => {
  console.log('aqui');
  const contato = { _id: req.query.idContato }
  const contexto = { contato , res}
  return Promise.resolve(contexto)
    .then(deletarContato)
    .then(contexto => res.status(200).json({ sucesso: true }))
    .catch(err => handleError(err, res, 'Erro ao deletar contato'))
})

const buscarContato = contexto => {
  return new Promise((resolve, reject) => {
    let filtro = {}
    if(contexto.contato._id) {
      filtro = { _id: contexto.contato._id }
    }
    Contato.find(filtro).exec((err, retorno) => {
      if(err) reject(err)
      contexto.retorno = retorno
      resolve(contexto)
    })
  })
}

const salvarContato = contexto => {
  contexto.contato.save((err, retorno) => {
    if(err) handleError(err, contexto.res, 'Erro ao salvar contato')
    Promise.resolve(retorno)
  })
}

const alterarContato = contexto => {
  const contatoAlteracoes = contexto.contato
  const update = {}

  if(contatoAlteracoes.nome) {
      update.nome = contatoAlteracoes.nome
  }
  if(contatoAlteracoes.canal) {
    update.canal = contatoAlteracoes.canal
  }
  if(contatoAlteracoes.valor) {
    update.valor = contatoAlteracoes.valor
  }
  if(contatoAlteracoes.obs) {
    update.obs = contatoAlteracoes.obs
  }
  Contato.update({ _id: contatoAlteracoes._id }, update, err => {
    if (err) Promise.reject(err)
    Promise.resolve(contexto)
  })
}

const deletarContato = contexto => {
  Contato.remove({ _id : contexto.contato._id }, err => {
    if(err) Promise.reject(err)
    Promise.resolve(contexto)
  })
}

const handleError = (err, res, mensagem) => {
    console.log(err)
    var retornoErro = { mensagem, serverError: err }
    return res.status(400).json(retornoErro)
}

export default router

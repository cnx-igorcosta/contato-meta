import mongoose from 'mongoose'


export const connection = {
  connect: uri => {
      mongoose.Promise = global.Promise;
      mongoose.connect(uri)

      mongoose.connection.on('connected', _=> {
        console.log(`Mongoose! Conectado em ${uri}`)
      })
      mongoose.connection.on('disconnected', _=> {
        console.log(`Mongoose! Desconectado de ${uri}`)
      })
      mongoose.connection.on('error', erro => {
        console.log(`Mongoose! Erro na conexão: ${erro}`)
      })
      process.on('SIGINT', _ => {
        mongoose.connection.close( _=> {
          console.log('Mongoose! Desconectado pelo término da aplicação')
          // 0 indica que a finalização ocorreu sem erros
          process.exit(0)
        })
      })
  }
}

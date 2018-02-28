import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const contatoSchema = new Schema({
  nome :  {type : String},
  canal:  {type : String},
  valor:  {type : String},
  obs:    {type : String}
});

var Contato = mongoose.model('Contato', contatoSchema);

export default Contato;

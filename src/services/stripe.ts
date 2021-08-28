/*
  Esse Stripe é um SDK - Software Development Kit - uma biblioteca para nós lidarmos
  diretamente com a API. Com ela não precisaremos realizar todas as requisições via
  HTTP!
*/
import Stripe from 'stripe'
/* Importando o package.json para recupera a versão da aplicação a partir dele */
import { version } from '../../package.json';

// O construtor do Stripe onde recebe parâmetros!
export const stripe = new Stripe(
  /*
    O primeiro dele é a chave secreta da API do Stripe. O valor que inserimos
    dentro de uma Variável Ambiente - no arquivo .env.local!
  */
  process.env.STRIPE_API_KEY, // Acessandos as Variáveis Ambiente através do "process.env"!
  
  {
    // versão da API!
    apiVersion: '2020-08-27',
    // objeto que contém informações como meta-dados.
    appInfo: {
      /*
        Nome da aplicação! (Identifica qual aplicação está realizando as requisições a API)
      */
      name: 'NewsDev',
      /*
        Versão da aplicação. Podemos buscar dentro do próprio
        package.json! Importando  o arquivo 
      */
      //version: '0.1.0' // Sem importar do package.json!
      
      version // Importando do package.json!
    }
  }
)
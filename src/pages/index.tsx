import Head from 'next/head';
import styles from './home.module.scss';
// Importação de dentro do Next do tipo para a função getStaticProps!
import { GetStaticProps } from 'next';
import { SubscribeButton } from '../components/SubscribeButton';

// Importação do serviço que criamos do Stripe!
import { stripe } from '../services/stripe';

  /*
  Para que a prop 'product' não fique coma tipagem 'any',definir uma
  interface para as props do componente Home!
*/

interface HomeProps {
    product: {
        priceId: string;
        amount: number;
    }
}


export default function Home({product}:HomeProps) {
  return (
    <>
    
        <Head>
            <title>Home | ig.news</title>
        </Head>
        <main className={styles.contentContainer}>
            <section className={styles.hero}>
                <span>👏 Hey, welcome</span>
                <h1>News about the <span>React</span> world</h1>
                <p>
                    Get access to all the publications <br />
                    <span>for {product.amount} month</span>
                    </p>
                    <SubscribeButton priceId={product.priceId}/>
                
                    </section>
                    <img src="/images/avatar.svg" alt="Girl coding" />
                    
        </main>

    </>

  )
}

/*
  Alteramos a função de 'getServerSideProps' para 'getStaticProps'
  e alteramos a tipagem da função para o tipo de mesmo nome! (atençao na importaçao)
 */


export const getStaticProps: GetStaticProps = async() => {
  const price = await stripe.prices.retrieve('price_1JTV7kAtz0pNEsaB3k5LvciG')

  const product = {
      priceId: price.id,
      amount: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
      }).format((price.unit_amount / 100)),
  };

  return { 
      props: {
          product,
      },
      revalidate: 60 * 60 * 24,
  }
} 


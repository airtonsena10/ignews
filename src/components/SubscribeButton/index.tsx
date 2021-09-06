// Importando o signIn e o useSession de dentro do next-auth/client
import { useSession, signIn } from "next-auth/client";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [session] = useSession();
  /*
    criando uma função que tratará da ação de inscrever o usuário
    para possibilitá-lo de acessar os conteúdos da aplicação!
  */

  async function handleSubscribe() {
    if (!session) {
      /*
      Se o usuário não estiver logado a aplicação redirecionará ele para a
      autenticação com o github.      */
      signIn("github");
      return;  // colocamos esse "return"para  informa que mais nenhum código deve ser
              // executado, saindo da função.
    }

    try {
      const response = await api.post("/subscribe");

      const { sessionId } = response.data;

      const stripe = await getStripeJs();
      console.log(stripe);

      await stripe.redirectToCheckout({ sessionId });
    } catch {}
  }
  return (
    <button
      type="button"
      className={styles.SubscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}

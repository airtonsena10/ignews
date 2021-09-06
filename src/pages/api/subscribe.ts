/* eslint-disable import/no-anonymous-default-export */

import { NextApiRequest, NextApiResponse } from "next";
// Importamos getSession de next-auth/client.
import { getSession } from "next-auth/client";
import { query as q } from "faunadb";
import { fauna } from "../../services/fauna";
// Importamos a nossa configuração do Stripe.
import { stripe } from "../../services/stripe";

/*
  Criamos um tipo do Typescript para fazer com quê ele deixe de reclamar
  sobre o 'ref', quando o acessamos para obter o id do usuário!
*/

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  };
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    /*
        getSession recebe um objeto contendo a requisição. Assim ele obtém os cookies
        dela (que é onde o next-auth armazena o token de autenticação do usuário)
        para que nós consigamos obter a sessão do usuário, assim obtendo também o
        usuário em si! */

    const session = await getSession({ req });

    const user = await fauna.query<User>(
      q.Get(q.Match(q.Index("user_by_email"), q.Casefold(session.user.email))),
    );

    let customerId = user.data.stripe_customer_id;

    if (!customerId) {
      // Criando o customer do Stripe a partir dos dados do usuário da sessão.
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,

        /*
              Com o customer já criado, precisamos simplesmente criar uma query que
              atualize o usuário relacionado ao email que temos com a informação do
              id do customer recém-criado!
            */
      });

      await fauna.query(
        q.Update(q.Ref(q.Collection("users"), user.ref.id), {
          data: {
            stripe_customer_id: stripeCustomer.id,
          },
        }),
      );

      customerId = stripeCustomer.id;
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      billing_address_collection: "required", // quais itens o user dever preenche
      line_items: [{ price: "price_1JTV7kAtz0pNEsaB3k5LvciG", quantity: 1 }],
      mode: "subscription", // informa que o pagamento será recorrente e não único!
      allow_promotion_codes: true, // Permite códigos de promoções (descontos)!
      // Caso a operação seja bem sucedida, o usuário será redirecionado para essa url!
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    return res.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
};

import { query as q } from "faunadb";
/*
  Precisar importar o 'query' de dentro do faunadb, para poder
  criar nossas queries.
   renomeá-lo para apenas 'q' por causa  de que vamos repetí-lo
  várias vezes assim facilita na digitaçao dos comandos
*/
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { fauna } from "../../../services/fauna";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: "read:user",
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn(user, account, profile) {
      const { email } = user;

      try {
        await fauna.query(
          q.If(
            /* verificando se o usuário não existe. 
            */
            q.Not(
              q.Exists(
                /*
                para fazer uma comparação  utilizamos o email do usuário
                que está realizando a autenticação.
                Utilizamos o método 'Match' do Fauna!
              */
                q.Match(q.Index("user_by_email"), q.Casefold(user.email)),
              ),
            ),
            /* Create: método para fazer uma inserção no FaunaDB.
                    */
            q.Create(q.Collection("users"), {
              data: { email } /* inserir apenas o email do usuário! */,
            }),
            q.Get(
              q.Match(
                q.Index("user_by_email"),

                q.Casefold(user.email),
              ),
            ),
            /*
                    Para evitar diferenciar o valor do filtro de busca entre
                    maiúscula e minúscula,utilizamos a função 'Casefold'.
                    Ela irá normalizar o case do email para ficar tudo lowercase!
                    (casefold)
                  */
          ),
        );

        return true;
      } catch {
        return false;
      }
    },
  },
});

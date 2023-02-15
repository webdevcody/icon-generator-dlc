import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { api } from "../utils/api";
import { useRouter } from "next/router";
import { Footer } from "../components/Footer";
import Image from "next/image";

const LoginPage: NextPage = () => {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const isPaid = api.payment.isPaidEmail.useQuery(
    { email },
    {
      enabled: false,
    }
  );

  function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    isPaid
      .refetch()
      .then(({ data }) => {
        if (data?.isValid) {
          setEmail("");
          router.push(`/dlc?email=${email}`).catch(console.error);
        } else {
          setError("invalid login");
        }
      })
      .catch(() => {
        setError("something went wrong");
      });
  }

  return (
    <>
      <Head>
        <title>Icon Generator DCL - Login</title>
        <meta name="description" content="Login to access the DLC" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-center">
        <section className="container m-auto grid max-w-screen-lg pt-24 pb-32">
          <div className="flex w-full flex-col items-center gap-8">
            <Image
              src="/secure.svg"
              width="300"
              height="300"
              className="mb-4"
              alt="a lock image"
            />
            <h1 className="text-4xl text-white">Login</h1>

            <form onSubmit={login}>
              <fieldset className="flex flex-col gap-4">
                <input
                  className="w-80 rounded p-4 py-3"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  type="email"
                  name="email"
                  placeholder="your-email@example.com"
                ></input>
                <button className="text-md w-80 rounded bg-gradient-to-r from-wdc-primary-darker to-blue-400 py-3 px-4 py-2 text-white hover:to-blue-500">
                  Sign In
                </button>
              </fieldset>

              <span className="text-red-400">{error}</span>
            </form>
          </div>
        </section>

        <div className="w-full bg-wdc-darker-blue py-12">
          <Footer />
        </div>
      </main>
    </>
  );
};

export default LoginPage;

import { createTRPCRouter, publicProcedure } from "../trpc";

import { z } from "zod";
import Stripe from "stripe";
import { env } from "../../../env/server.mjs";
import { client } from "../../../utils/dynamo";
import AWS from "aws-sdk";
import { TRPCError } from "@trpc/server";

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: env.ACCESS_KEY_ID,
    secretAccessKey: env.SECRET_ACCESS_KEY,
  },
  region: "us-east-1",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export const paymentRouter = createTRPCRouter({
  isPaidEmail: publicProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .query(async ({ input }) => {
      const account = await client
        .get({
          TableName: env.TABLE_NAME,
          Key: {
            pk: `email|${input.email}`,
            sk: `email|${input.email}`,
          },
        })
        .promise();

      return {
        isValid: account.Item ? true : false,
      };
    }),
  createCheckout: publicProcedure.mutation(() => {
    return stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "us_bank_account"],
      line_items: [
        {
          price: env.PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${env.HOST_NAME}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.HOST_NAME}/`,
    });
  }),
  getStripeSession: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const session = await stripe.checkout.sessions.retrieve(input.sessionId);
      return {
        email: session.customer_details?.email,
      };
    }),
  getDownloadUrl: publicProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .query(async ({ input }) => {
      const account = await client
        .get({
          TableName: env.TABLE_NAME,
          Key: {
            pk: `email|${input.email}`,
            sk: `email|${input.email}`,
          },
        })
        .promise();

      // TODO: protected route logic middleware
      if (!account.Item) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "no access",
        });
      }

      const downloadUrl = await s3.getSignedUrlPromise("getObject", {
        Bucket: env.DLC_BUCKET_NAME,
        Key: "icon-generator-dlc.zip",
      });

      return downloadUrl;
    }),
});

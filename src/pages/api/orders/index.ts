import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { ordersValidationSchema } from 'validationSchema/orders';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getOrders();
    case 'POST':
      return createOrders();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getOrders() {
    const data = await prisma.orders.findMany({});
    return res.status(200).json(data);
  }

  async function createOrders() {
    await ordersValidationSchema.validate(req.body);
    const data = await prisma.orders.create({
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}

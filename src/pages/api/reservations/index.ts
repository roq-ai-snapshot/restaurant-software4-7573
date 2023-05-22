import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { reservationsValidationSchema } from 'validationSchema/reservations';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getReservations();
    case 'POST':
      return createReservations();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getReservations() {
    const data = await prisma.reservations.findMany({});
    return res.status(200).json(data);
  }

  async function createReservations() {
    await reservationsValidationSchema.validate(req.body);
    const data = await prisma.reservations.create({
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

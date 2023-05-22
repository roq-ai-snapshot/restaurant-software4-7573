import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { notificationsValidationSchema } from 'validationSchema/notifications';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getNotifications();
    case 'PUT':
      return updateNotifications();
    case 'DELETE':
      return deleteNotifications();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getNotifications() {
    const data = await prisma.notifications.findFirst({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }

  async function updateNotifications() {
    await notificationsValidationSchema.validate(req.body);
    const data = await prisma.notifications.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteNotifications() {
    const data = await prisma.notifications.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}

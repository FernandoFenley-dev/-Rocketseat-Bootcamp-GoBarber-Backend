/* eslint-disable camelcase */
import { ObjectID } from 'mongodb';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';

class NotificationsRepository implements INotificationsRepository {
  private notificaitons: Notification[] = [];

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();
    // para inicializarmos o id no mongo:
    // id: new ObjectID()
    Object.assign(notification, { content, recipient_id, id: new ObjectID() });

    this.notificaitons.push(notification);

    return notification;
  }
}

export default NotificationsRepository;

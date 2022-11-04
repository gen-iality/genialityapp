import { DispatchMessageService } from '@/context/MessageService';
import { firestore } from '@/helpers/firebase';
import { CreatePlayerDto, Point, WhereIs } from '../types';

export const get = async (eventId: string): Promise<WhereIs | null> => {
  try {
    const whereIs = await getWhereIs(eventId);
    const points = await getWhereIsPoints(eventId);
    if (whereIs === null) return null;
    return { ...whereIs, points };
  } catch (error) {
    DispatchMessageService({
      type: 'error',
      msj: 'Error al obtener la dinamica',
      action: 'show',
    });
    return null;
  }
};

export const getWhereIs = async (eventId: string) => {
  const whereIsDoc = await firestore
    .collection('whereIsByEvent')
    .doc(eventId)
    .get();
  if (!whereIsDoc.exists) return null;
  return whereIsDoc.data() as WhereIs;
};

export const getWhereIsPoints = async (eventId: string): Promise<Point[]> => {
  const pointsDoc = await firestore
    .collection('whereIsByEvent')
    .doc(eventId)
    .collection('points')
    .get();
  if (pointsDoc.empty) return [];
  const points = pointsDoc.docs.map((doc) => doc.data());
  if (points === null) return [];
  return points as Point[];
};

export const createPlayer = async (createPlayerDto: CreatePlayerDto) => {
  try {
    const { event_id, event_user_id, ...rest } = createPlayerDto;
    await firestore
      .collection('whereIsByEvent')
      .doc(createPlayerDto.event_id)
      .collection('players')
      .doc(createPlayerDto.event_user_id)
      .set(rest);
  } catch (error) {
    DispatchMessageService({ type: 'error', msj: 'Error al obtener la dinamica', action: 'show' });
    return null;
  }
};

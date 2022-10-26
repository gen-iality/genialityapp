import type { ActivityType } from "../types/activityType";
import type { OpenedWidget } from '../types/contextType';
import { formWidgetFlow, activityTypeNames } from '../constants/ui';
import { WidgetType } from '../constants/enum';

export function useGetWidgetForActivityType (currentActivityType: ActivityType.Name): [string, OpenedWidget | undefined] {
  let index;
  switch (currentActivityType) {
    case activityTypeNames.live:
      index = 0;
      break;
    case activityTypeNames.meeting:
      index = 1;
      break;
    case activityTypeNames.video:
      index = 2;
      break;
    case activityTypeNames.quizing:
      index = 3;
      break;
    case activityTypeNames.survey:
      index = 4;
      break;
    case activityTypeNames.pdf:
        index = 5;
        break;
    case activityTypeNames.pdf:
      index = 6;
      break;
    default:
      console.error(`No puede reconocer actividad de tipo "${currentActivityType}"`);
      break;
  }

  if (index !== undefined) {
    // Set the title, and the data to the views
    const currentOpenedCard: ActivityType.CardUI = formWidgetFlow.cards[index];
    console.debug('opened widget is:', currentOpenedCard);
    const title = currentOpenedCard.MainTitle;

    if (currentOpenedCard.widgetType === WidgetType.FORM) {
      console.debug('Pass the form widget')
      return [title, currentOpenedCard.form];
    } else {
      console.debug('Whole widget was passed');
      return [title, currentOpenedCard];
    }
  } else {
    console.error('Tries to understand', currentActivityType, ' but I think weird stuffs..');
    return ['', undefined];
  }
}

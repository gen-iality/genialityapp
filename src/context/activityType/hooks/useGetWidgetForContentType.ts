import { formWidgetFlow, activityTypeNames, activityContentValues } from '../constants/ui';
import type { ActivityType } from '../types/activityType';

export function useGetWidgetForContentType (type: ActivityType.GeneralTypeValue): ActivityType.CardUI | ActivityType.FormUI | null {
  switch (type) {
    case activityTypeNames.live:
      return formWidgetFlow.cards[0];

    // liveBroadcastCards
    case activityContentValues.streaming:
      return (formWidgetFlow.cards[0].cards as ActivityType.CardUI[])[0] as ActivityType.CardUI;
    case activityContentValues.vimeo:
      return (formWidgetFlow.cards[0].cards as ActivityType.CardUI[])[1].form as ActivityType.FormUI;
    case activityContentValues.youtube:
      return (formWidgetFlow.cards[0].cards as ActivityType.CardUI[])[2].form as ActivityType.FormUI;

    case activityTypeNames.meeting:
      return formWidgetFlow.cards[1].form as ActivityType.FormUI;

    case activityTypeNames.video:
      return formWidgetFlow.cards[2];
    case activityContentValues.url:
      return (formWidgetFlow.cards[2].cards as ActivityType.CardUI[])[0].form as ActivityType.FormUI;
    case activityContentValues.file:
      return (formWidgetFlow.cards[2].cards as ActivityType.CardUI[])[1].form as ActivityType.FormUI;
    default:
      return null;
  }
}

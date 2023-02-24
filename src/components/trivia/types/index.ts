export interface State {
  _id:                       string;
  idSurvey:                  string;
  isLoading:                 boolean;
  loading:                   boolean;
  redirect:                  boolean;
  survey:                    string;
  activity_id:               string;
  dataAgenda:                DataAgendum[];
  quantityQuestions:         number;
  listQuestions:             any[];
  points:                    number;
  question:                  Question[];
  visibleModal:              boolean;
  confirmLoading:            boolean;
  key:                       number;
  currentQuestion:           CurrentQuestion | null;
  allow_anonymous_answers:   boolean;
  allow_gradable_survey:     boolean;
  hasMinimumScore:           boolean;
  isGlobal:                  boolean;
  showNoVotos:               boolean;
  freezeGame:                boolean;
  openSurvey:                boolean;
  publish:                   boolean;
  time_limit:                number;
  show_horizontal_bar:       boolean;
  allow_vote_value_per_user: boolean;
  ranking:                   boolean;
  displayGraphsInSurveys:    boolean;
  initialMessage:            string | null;
  win_Message:               string | null;
  neutral_Message:           string | null;
  lose_Message:              string | null;
  graphyType:                string;
  minimumScore:              number;
}

export interface CurrentQuestion extends Question {
  questionIndex:              number
}

export interface DataAgendum {
  _id:                                string;
  name:                               string;
  subtitle:                           null;
  image:                              null;
  description:                        null;
  capacity:                           number;
  event_id:                           string;
  datetime_end:                       Date;
  datetime_start:                     Date;
  date_start_zoom:                    Date;
  date_end_zoom:                      Date;
  updated_at:                         Date;
  created_at:                         Date;
  access_restriction_types_available: null;
  activity_categories:                any[];
  space:                              null;
  hosts:                              any[];
  type:                               null;
  access_restriction_roles:           any[];
}

export interface Question {
  title:   string;
  type:    string;
  choices: string[];
  id:      string;
  image:   null;
  points:  string;
}

import { Chart, ChartConfiguration } from "chart.js";

export interface GraphicsState {
  dataSurvey:      DataSurvey | null;
  currentPage:     number;
  graphicsFrame:   GraphicsFrame;
  currentChart: {
    labels: string[],
    dataValues: number[],
  }
  chart:           Chart | null;
  chartCreated:    boolean;
  usersRegistered: number;
  titleQuestion:   string;
  isMobile:        boolean;
  isTablet:        boolean;
  dataVotos:       DataVoto[];
  totalUser:       number;
  totalVotosUser:  number;
  resultVotos:     ResultVotos;
}

export interface DataSurvey {
  _id:                       string;
  survey:                    string;
  show_horizontal_bar:       boolean;
  graphyType:                'x' | 'y' | string;
  allow_vote_value_per_user: boolean;
  event_id:                  string;
  activity_id:               string;
  points:                    number;
  initialMessage:            null;
  time_limit:                number;
  win_Message:               null;
  neutral_Message:           null;
  lose_Message:              null;
  allow_anonymous_answers:   boolean;
  allow_gradable_survey:     boolean;
  hasMinimumScore:           boolean;
  isGlobal:                  boolean;
  showNoVotos:               boolean;
  freezeGame:                boolean;
  open:                      boolean;
  publish:                   boolean;
  minimumScore:              number;
  updated_at:                Date;
  created_at:                Date;
  questions:                 Question[];
  displayGraphsInSurveys:    boolean;
  rankingVisible:            boolean;
}

export interface Question {
  title:   string;
  type:    string;
  choices: string[];
  id:      string;
  image:   null;
  points:  string;
}

export interface DataVoto {
  voto:       number;
  porcentaje: number;
  answer:     string;
  option:     string;
  color:      string;
}

export interface GraphicsFrame {
  horizontalBar: ChartConfiguration;
  verticalBar:   ChartConfiguration;
  ChartPie:      ChartConfiguration;
}

export interface ChartPie {
  type:    string;
  data:    Data;
  options: ChartPieOptions;
}

export interface Data {
  labels:   string[];
  datasets: Dataset[];
}

export interface Dataset {
  label:                string;
  labelColor:           string;
  backgroundColor:      string[];
  borderColor:          string[];
  borderWidth:          number;
  hoverBackgroundColor: string[];
  hoverBorderColor:     string[];
  alphabet:             string[];
  data:                 number[];
}

export interface ChartPieOptions {
  position:   string;
  title:      OptionsTitle;
  responsive: boolean;
  animation:  Animation;
  legend:     OptionsLegend;
}

export interface Animation {
  duration: number;
  easing:   string;
}

export interface OptionsLegend {
  labels: PurpleLabels;
}

export interface PurpleLabels {
  fontColor: string;
}

export interface OptionsTitle {
  fontSize: number;
  display:  boolean;
  text:     string;
}

export interface HorizontalBar {
  type:      string;
  data:      Data;
  options:   HorizontalBarOptions;
  indexAxis: string;
}

export interface HorizontalBarOptions {
  responsive: boolean;
  title:      OptionsTitle;
  position:   string;
  plugins:    Plugins;
  scales:     PurpleScales;
  indexAxis:  string;
}

export interface Plugins {
  datalabels: Datalabels;
  legend:     PluginsLegend;
}

export interface Datalabels {
  color:     string;
  textAlign: string;
  anchor:    string;
  align:     number;
}

export interface PluginsLegend {
  display:  boolean;
  labels:   FluffyLabels;
  maxWidth: string;
  position: string;
}

export interface FluffyLabels {
  font: Font;
}

export interface Font {
  size:      string;
  family:    string;
  textAlign: string;
  boxWidth:  string;
}

export interface PurpleScales {
  y: PurpleX;
  x: PurpleX;
}

export interface PurpleX {
  axis:        string;
  type:        string;
  beginAtZero: boolean;
  ticks:       PurpleTicks;
  display:     boolean;
  offset:      boolean;
  reverse:     boolean;
  bounds:      string;
  grace:       number;
  grid:        Grid;
  title:       XTitle;
  id:          string;
  position:    string;
}

export interface Grid {
  display:          boolean;
  lineWidth:        number;
  drawBorder:       boolean;
  drawOnChartArea:  boolean;
  drawTicks:        boolean;
  tickLength:       number;
  offset:           boolean;
  borderDash:       any[];
  borderDashOffset: number;
  borderWidth:      number;
  color:            string;
  borderColor:      string;
}

export interface PurpleTicks {
  minRotation:       number;
  maxRotation:       number;
  mirror:            boolean;
  textStrokeWidth:   number;
  textStrokeColor:   string;
  padding:           number;
  display:           boolean;
  autoSkip:          boolean;
  autoSkipPadding:   number;
  labelOffset:       number;
  minor:             Chart;
  major:             Chart;
  align:             string;
  crossAlign:        string;
  showLabelBackdrop: boolean;
  backdropColor:     string;
  backdropPadding:   number;
  color:             string;
}

export interface XTitle {
  display: boolean;
  text:    string;
  padding: Padding;
  color:   string;
}

export interface Padding {
  top:    number;
  bottom: number;
}

export interface VerticalBar {
  type:    string;
  data:    Data;
  options: VerticalBarOptions;
}

export interface VerticalBarOptions {
  position:   string;
  title:      OptionsTitle;
  responsive: boolean;
  animation:  Animation;
  legend:     OptionsLegend;
  scales:     FluffyScales;
  indexAxis:  string;
}

export interface FluffyScales {
  x: XElement[];
  y: XElement[];
}

export interface XElement {
  ticks: FluffyTicks;
}

export interface FluffyTicks {
  beginAtZero: boolean;
  stepSize:    number;
  fontSize:    number;
  fontColor:   string;
  fontStyle:   string;
}

export interface ResultVotos {
  sumadVotacion:        number;
  usuariosSinRespuesta: number;
  porcentajevotos:      number;
}

export interface GraphicsData {
	dataValues: number[]
	labels: string[]
}

export interface VoteResponse {
  id:         string;
  id_user:    string;
  response:   string;
  id_survey:  string;
  user_email: string;
  created:    CreatedVoteResponse;
  voteWeight?: number;
  user_name:  string;
}

export interface CreatedVoteResponse {
  seconds:     number;
  nanoseconds: number;
}

import * as Survey from 'survey-react';
import 'survey-react/modern.css';

function InternarlSurveyStyles(eventStyles) {
  /** extrae las propiedades por defecto del thema 'modern' para modificarl los colores */
  var defaultThemeColors = Survey.StylesManager.ThemeColors['modern'];
  // Validacion para evitar el color blanco en la ui de la encuesta
  let color =
    eventStyles.textMenu == '#FFFFFF' || eventStyles.textMenu == '#ffffff'
      ? eventStyles.toolbarDefaultBg
      : eventStyles.textMenu;
  /** Color a los botones de check de las respuestas */
  defaultThemeColors['$border-color'] = color;
  /** Color a los chulitos del boton de check en la respuesta */
  defaultThemeColors['$checkmark-color'] = color;

  /** Color de la barra y el boton, tambien al seleccionar cambia el color del relleno de check */
  defaultThemeColors['$main-color'] = '#3681E3';

  /** Color del relleno del check y del la barra de del scroll */
  defaultThemeColors['$main-hover-color'] = color;

  /** Color al texto de progreso */
  defaultThemeColors['$progress-text-color'] = color;

  /** Color de fondo para la pregunta al momento de escoger una respuesta. Actualmente transparente */
  defaultThemeColors['$answer-background-color'] = '#ffffff00';

  /** Color al texto de las repuestas */
  // defaultThemeColors["$text-color"] = color;

  /** Color que se aplica en fondo del la barra de scroll */
  // defaultThemeColors["$add-button-color"] = "color";

  Survey.StylesManager.applyTheme('modern');
}

export default InternarlSurveyStyles;

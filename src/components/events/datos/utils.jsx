import { Divider, List, Modal, Typography } from 'antd';

const { confirm } = Modal;
const { Text } = Typography;

const checkInInstructions = [
  'Si ya hay asistentes inscritos en el curso, se deberá actualizar la información de dicho campo.',
  'Esta función está disponible solo para cédula de ciudadanía Colombiana.',
  'Se requiere Lector de documentos.',
  'Durante la inscripción se almacenará la información capturada del documento.',
];

const checkInFields = [
  {
    id: undefined,
    name: 'checkInField',
    description: undefined,
    label: 'Documento',
    unique: false,
    mandatory: true,
    options: undefined,
    order_weight: undefined,
    type: 'checkInField',
    visibleByAdmin: true,
    visibleByContacts: undefined,
  },
  {
    id: undefined,
    name: 'gender',
    description: undefined,
    label: 'Genero',
    unique: false,
    mandatory: true,
    options: undefined,
    order_weight: undefined,
    type: 'text',
    visibleByAdmin: true,
    visibleByContacts: undefined,
  },
  {
    id: undefined,
    name: 'bloodtype',
    description: undefined,
    label: 'RH',
    unique: false,
    mandatory: true,
    options: undefined,
    order_weight: undefined,
    type: 'text',
    visibleByAdmin: true,
    visibleByContacts: undefined,
  },
  {
    id: undefined,
    name: 'birthdate',
    description: undefined,
    label: 'Fecha de nacimiento',
    unique: false,
    mandatory: true,
    options: undefined,
    order_weight: undefined,
    type: 'date',
    visibleByAdmin: true,
    visibleByContacts: undefined,
  },
];

// a little function to help us with reordering the result
export const Reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 6;
export const getItemStyle = (isDragging, draggableStyle) => {
  return {
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    textAlign: 'left',

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : '#1BD5DF',

    // styles we need to apply on draggables
    ...draggableStyle,
  };
};

export const getQuestionListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? '#CA4FC4' : '',
  padding: 8,
  width: 350,
});

export const createFieldForCheckInPerDocument = async ({ value, checkInFieldsIds, save, remove }) => {
  const saveCheckInField = async () => {
    checkInFields.map(async (checkInField) => {
      await save(checkInField);
    });
  };

  if (value.target.checked) {
    confirm({
      title: `Al habilitar el checkIn por documento, recuerda que:`,
      content: (
        <List
          size='small'
          dataSource={checkInInstructions}
          renderItem={(item, index) => (
            <List.Item>
              <Text>
                {index + 1}. {item}
              </Text>
            </List.Item>
          )}
        />
      ),
      okText: 'Habilitar',
      okType: 'primary',
      cancelText: 'Cancelar',
      onOk() {
        saveCheckInField();
      },
    });
  } else {
    confirm({
      title: `¿Se deshabilitará el checkIn por documento estás seguro?`,
      // content: 'Una vez eliminado, no lo podrá recuperar',
      okText: 'Si',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        checkInFieldsIds.map(async (checkInFieldId) => {
          await remove(checkInFieldId, true);
        });
      },
    });
  }
};

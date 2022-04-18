import { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Reorder, getItemStyle, getQuestionListStyle } from './utils';
import { DragOutlined } from '@ant-design/icons';
import { Typography, Button, notification } from 'antd';
import { Actions } from '../../../helpers/request';

const { Title } = Typography;

class DragDrop extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user_properties: [],
      available: true,
    };
    this.onDragEnd = this.onDragEnd.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.list !== prevProps.list) {
      this.setState({ user_properties: this.props.list });
    }
  }

  // async componentDidMount() {
  //     const { eventId } = this.props
  //     let user_properties
  //     user_properties = await EventFieldsApi.getAll(eventId)
  //     this.setState({ user_properties })

  // }

  //Funcion para guardar el orden de los datos
  async submit() {
    await Actions.put(`api/events/${this.props.eventId}`, this.state.properties);

    notification.open({
      message: 'Información salvada',
      description: 'El orden de la recopilacion de datos se ha guardado',
      onClick: () => {},
    });
  }

  //Funcion para enviar al estado el orden reciente del dragAndDrop
  onDragEnd(result) {
    // Si el draggable sale del dragDropContext no realiza ninguna accion
    if (!result.destination) {
      return;
    }

    //si hay un cambio en droppable re-organiza el array y lo envia al estado
    if (result.type === 'user_properties') {
      const user_properties = Reorder(this.state.user_properties, result.source.index, result.destination.index);

      this.setState({ available: false, user_properties, properties: { user_properties: user_properties } });
      //si no se puede re-organizar, devuelve al estado original el array y lo envia al estado
    } else {
      const answers = Reorder(
        this.state.user_properties[parseInt(result.type, 10)].answers,
        result.source.index,
        result.destination.index
      );

      const user_properties = JSON.parse(JSON.stringify(this.state.user_properties));

      user_properties[result.type].answers = answers;

      this.setState({
        user_properties,
      });
    }
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    const { user_properties, available } = this.state;
    return (
      <div>
        <DragDropContext onDragEnd={this.onDragEnd} onDragUpdate={this.onDragUpdate}>
          <Title level={4}>Organiza los datos de los asistentes</Title>
          <Droppable droppableId='droppable' type='user_properties'>
            {(provided, snapshot) => (
              <div ref={provided.innerRef} style={getQuestionListStyle(snapshot.isDraggingOver)}>
                {user_properties.map((list, index) => (
                  <Draggable
                    key={list.uuid ? list.uuid : list._id}
                    draggableId={list.uuid ? list.uuid : list._id}
                    index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
                        <span style={{ marginRight: '5%' }}>
                          <DragOutlined />
                        </span>
                        {list.label}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <Button style={{ marginTop: '3%' }} disabled={available} onClick={this.submit}>
          Guardar orden de Datos
        </Button>
      </div>
    );
  }
}

export default DragDrop;

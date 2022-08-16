import { Component } from 'react';
import 'dayjs/locale/es';
import { Actions } from '../../helpers/request';
import UserRegistration from '../events/userRegistration';
import withContext from '../../context/withContext';
import { GetTokenUserFirebase } from 'helpers/HelperAuth';
import { DispatchMessageService } from '../../context/MessageService';

class TicketsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      active: '',
      code_discount: '',
      tickets: [],
      ticketstoshow: [],
      selectValues: {},
      disabledSelect: [],
      summaryList: [],
      listSeats: [],
      ticketsadded: {},
      haspayments: false,
      disabled: false,
      loading: false,
      total: 0,
      currencyFormatConfig: { style: 'currency', minimumFractionDigits: 0, maximumFractionDigits: 0 },
      isVisible: false,
    };
    this.chart = [];
    this.request = this.request.bind(this);
  }

  componentDidMount() {
    //Deshabilitar virual conference
    this.props.setVirtualConference(false);

    const haspayments = !!this.props.cEvent.value.tickets.find((item) => item.price !== '0');
    async function GetUserToken() {
      let token = await GetTokenUserFirebase();
      return token;
    }

    let evius_token = GetUserToken();

    //Arreglo de tiquetes
    const tickets = this.props.cEvent.value.tickets.map((ticket) => {
      //Encuentro el stage relacionado
      const stage = !this.props.cEvent.value.stages
        ? null
        : this.props.cEvent.value.stages.find((stage) => stage.stage_id === ticket.stage_id);
      //Lista de opciones para el select
      ticket.options =
        stage && (stage.status === 'ended' || stage.status === 'notstarted')
          ? []
          : Array.from(Array(parseInt(ticket.max_per_person, 10) || 1)).map((e, i) => i + 1);
      return ticket;
    });

    //Se encunetra el primer stage que esté activo para mostrarlo
    let stage = !this.props.cEvent.value.stages
      ? null
      : this.props.cEvent.value.stages.find((stage) => stage.status === 'active');
    //por si ninguna etapa se encuetra activa
    stage =
      !stage && this.props.cEvent.value.stages && this.props.cEvent.value.stages[0]
        ? this.props.cEvent.value.stages[0]
        : null;

    const id = stage ? stage.stage_id : ''; //Condición para traer el _id de stage. Se usa para prevenir que los datos del api vengan malos
    const ticketstoshow = tickets; //tickets.filter((ticket) => ticket.stage_id == id); //Filtrar los tiquetes del stage activo

    //"5e835d9fd74d5c6cfd379992"
    //Persistencia de tiquetes seleccionados después de login
    let info = localStorage.getItem('info'); //Se trae info
    if (info && evius_token) {
      info = JSON.parse(info);
      const values = {};
      info.show.map((item) => (values[item.id] = item.quantity));
      this.setState({ total: info.total, summaryList: info.show, selectValues: values, disabled: false });
    }
    this.setState({ auth: !!evius_token, haspayments, active: id, tickets, ticketstoshow });
  }

  //Al salir del landing se limpia la informacion de los tiquetes seleccionados.
  componentWillUnmount() {
    localStorage.removeItem('info');
    this.props.setVirtualConference(true);
  }

  changeStep = (step) => {
    if (!this.state.auth) return this.props.handleModal(); //Si no está logueado muestro popup
    if (step === 1 && this.state.summaryList.length <= 0) return;
    this.setState({ step });
  };

  //Función CLICK para los tabs stage
  selectStage = (stage) => {
    const id = stage.stage_id;
    const ticketstoshow = this.state.tickets.filter((ticket) => ticket.stage_id === id); //Filtra tiquetes del stage
    this.setState({ active: id, ticketstoshow });
  };

  //Función para el select tiquetes
  handleQuantity = (e) => {
    let { name, value } = e.target;
    name = name.split('_')[1];
    const ticketsadded = Object.assign(this.state.ticketsadded);
    if (value === '0') this.removeTicket(name);
    else {
      ticketsadded[name] = value;
      const list = this.props.cEvent.value.seatsConfig ? [...this.state.ticketstoshow].map((i) => i._id) : [];
      this.setState({ ticketsadded, disabledSelect: list.filter((i) => i !== name) }, () => {
        this.renderSummary();
      });
    }
    this.setState({ selectValues: { ...this.state.selectValues, [name]: value } });
  };

  //Función para remover tiquete del resument
  removeTicket = (id) => {
    const ticketsadded = Object.assign(this.state.ticketsadded);
    const summaryList = [...this.state.summaryList];
    const pos = summaryList.map((item) => item.id).indexOf(id);
    const info = summaryList[pos];
    const price = parseInt(info.price.replace(/[^0-9]/g, ''), 10);
    summaryList.splice(pos, 1);
    delete ticketsadded[id];
    this.setState((prevState) => {
      return {
        ticketsadded,
        summaryList,
        selectValues: { ...this.state.selectValues, [id]: '0' },
        total: prevState.total - price,
        step: 0,
        disabledSelect: [],
      };
    });
  };

  //Función para mostrar el resumen
  renderSummary = () => {
    const tickets = this.props.cEvent.value.tickets;
    const show = [];
    let total = 0;
    Object.keys(this.state.ticketsadded).map((key) => {
      const info = tickets.find((ticket) => ticket._id === key);
      const amount = this.state.ticketsadded[key];
      console.log('PRECIO==>', price);
      const price = info.price
        ? info.price === 'Gratis'
          ? 0
          : parseInt(info.price.replace(/[^0-9]/g, ''), 10) * amount
        : 0;
      total += price;
      const cost =
        price <= 0
          ? 'Gratis'
          : new Intl.NumberFormat('es-CO', {
              style: 'currency',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
              currency: info.currency,
            }).format(price);
      return show.push({ name: info.title, quantity: amount, id: info._id, price: cost });
    });
    if (!this.state.auth) localStorage.setItem('info', JSON.stringify({ total, show }));
    this.setState({ summaryList: show, total });
  };

  //Función botón RESERVAR
  onClick = (codeDiscount) => {
    if (this.state.summaryList.length <= 0) return; //Si no hay tiquetes no hace nada, prevenir click raro
    console.log('SUMMARYLIST==>', this.state.summaryList);
    console.log('AUTH==>', this.state.auth);
    if (!this.state.auth) return this.props.handleModal(); //Si no está logueado muestro popup

    //@TODO si no tiene sillas debe pasar derecho al checkout y si el tickete tiene silla debe ir en el tickete eso es del API y usado aca
    //Construyo body de acuerdo a peticiones de api
    let tienesilla = false;
    this.state.summaryList.map((item) => {
      if (item.name !== 'General') {
        tienesilla = true;
      }
    });

    if (this.state.step === 0 && !tienesilla) {
      return this.submit(false);
    }
    if (this.state.step === 0) {
      if (this.props.cEvent.value.seatsConfig) return this.setState({ step: 1 });
      else return this.submit(false);
    }

    if (this.state.step === 1) return this.submit(true);
  };

  //Función COMPRAR, recibe sillas si tiene o no
  submit = (seats) => {
    const data = { tickets: [] };
    //Construyo body de acuerdo a peticiones de api
    this.state.summaryList.map((item) => {
      data[`ticket_${item.id}`] = item.quantity;
      return data.tickets.push(item.id);
    });
    if (seats) {
      //Si tiene sillas hago validaciones de cantidad de tiquetes y sillas seleccionadas
      const quantity = this.state.summaryList.map((i) => parseInt(i.quantity, 10)).reduce((a, b) => a + b, 0);

      this.chart.listSelectedObjects((list) => {
        //Si las sillas son iguales a los tiquetes lo deja pasar, sino muestra toast
        if (quantity === list.length) {
          data.seats = list;
          this.request(data);
        } else {
          DispatchMessageService({
            type: 'info',
            msj: `Te quedan ${quantity - list.length} puestos por seleccionar`,
            action: 'show',
          });
        }
      });
    } else this.request(data);
  };

  //Función que hace la petición, carga loading y muestra reusltado en log si hay error muestra en log y en un toast
  async request(data) {
    console.log('DATA', data);
    this.setState({ loading: true });
    try {
      data.code_discount = this.state.code_discount;
      const resp = await Actions.post(`/es/e/${this.props.cEvent.value._id}/checkout`, data);

      if (resp.status === 'success') {
        //Si la peteción es correcta redirijo a la url que enviaron
        window.location.replace(resp.redirectUrl);
      } else {
        //Muestro error parseado
        this.setState({ loading: false });
        DispatchMessageService({
          type: 'error',
          msj: JSON.stringify(resp),
          action: 'show',
        });
      }
    } catch (err) {
      DispatchMessageService({
        type: 'error',
        msj: JSON.stringify(err),
        action: 'show',
      });
      console.error(err);
      this.setState({ loading: false });
    }
  }

  //Función para manejar si se selecciona o no alguna silla. Para mostrar o quitar del resumen
  handleObject = (object, flag) => {
    const listSeats = [...this.state.listSeats];
    if (flag) listSeats.push({ parent: object.category.label, name: object.seatId });
    else listSeats.splice(listSeats.map((e) => e.seatId).indexOf(object.seatId), 1);
    this.setState({ listSeats });
  };

  render() {
    const {
      state: {
        active,
        ticketstoshow,
        summaryList,
        loading,
        selectValues,
        total,
        step,
        disabled,
        listSeats,
        disabledSelect,
      },
      props: { stages, seatsConfig, experience, fees },
      selectStage,
      handleQuantity,
      onClick,
      changeStep,
    } = this;
    return (
      <>
        <UserRegistration extraFields={[]} />

        {/* <Col span={8}>
          <TicketsEvent
              changeStep={changeStep}
              onClick={onClick}
              handleQuantity={handleQuantity}
              selectStage={selectStage}
              ticketstoshow={ticketstoshow}
              active={active}
              summaryList={summaryList}
              step={step}
              total={total}
              seatsConfig={seatsConfig}
              stages={stages}
              experience={experience}
              fees={fees}
              disabled={disabled}
              listSeats={listSeats}
              disabledSelect={disabledSelect}
              loading={loading}
              selectValues={selectValues}
              currencyFormatConfig={this.state.currencyFormatConfig}
              removeTicket={this.removeTicket}
            />
           </Col>*/}
      </>
    );
  }
}

let TicketsFormwithContext = withContext(TicketsForm);
export default TicketsFormwithContext;

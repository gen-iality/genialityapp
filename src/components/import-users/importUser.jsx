import { Component } from 'react'
import { Link } from 'react-router-dom'
import Importacion from './importacion'
import Preview from './preview'
import Result from './result'
import Async from 'async'
import Header from '@antdComponents/Header'
import { Steps } from 'antd'
import { StateMessage } from '@context/MessageService'

const { Step } = Steps

class ImportUsers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 0,
      list: [],
      toImport: [],
      password: '',
    }
  }

  handleXls = (list) => {
    if (list.length >= 2) {
      this.setState((prevState) => {
        return { list, step: prevState.step + 1 }
      })
    }
  }

  importUsers = (users, password) => {
    const self = this
    StateMessage.show(
      'loading',
      'loading',
      ' Por favor espere mientras se envía la información...',
    )

    if (password) {
      const genericPassword = []
      for (let i = 0; i < users[0].list.length; i++) {
        genericPassword.push(password)
      }
      users.push({ key: 'password', list: genericPassword, used: true })
    }

    try {
      // Agregamos el campo ticket_id sino hacemos esto, la validación de campos seleccionados para importar lo quita y finalmente se pierde
      users = users.map((column) => {
        if (column.key === 'ticket_id') {
          column.used = true
        }
        return column
      })

      //Quitamos de los usuarios traidos del excel los campos que no se seleccionaron para importar  y luego enviamos
      //al componente result que realiza la importación uno a uno usando el api
      Async.waterfall(
        [
          function (cb) {
            const newUsers = users.filter((user) => {
              return user.used
            })
            cb(null, newUsers)
          },
          function (newUsers, cb) {
            const long = newUsers[0].list.length
            const itemsecondwaterfall = []
            let initwaterfallcounter = 0
            for (; initwaterfallcounter < long; ) {
              itemsecondwaterfall[initwaterfallcounter] = {}
              initwaterfallcounter++
            }
            if (initwaterfallcounter === long) {
              cb(null, itemsecondwaterfall, newUsers)
            }
          },
          function (items, newUsers, cb) {
            const len = newUsers.length
            for (let i = 0; i < items.length; i++) {
              for (let j = 0; j < len; j++) {
                items[i][newUsers[j].key] = newUsers[j].list[i]
              }
            }
            cb(items)
          },
        ],
        function (result) {
          self.setState((prevState) => {
            return { step: prevState.step + 1, toImport: result }
          })
        },
      )
      StateMessage.destroy('loading')
      StateMessage.show(null, 'success', 'Información cargada correctamente!')
    } catch (e) {
      StateMessage.destroy('loading')
      StateMessage.show(null, 'error', 'Error cargando la información')
    }
  }

  closeModal = () => {
    this.setState({ list: [] })
    this.props.handleModal()
  }

  // getDerivedStateFromProps(nextProps) {
  //   if (nextProps.modal !== this.props.modal) {
  //     this.setState({ modal: nextProps.modal, step: 0 });
  //   }
  // }

  /* onChange = step => {
    console.log('onChange:', step);
    this.setState({ step });
  }; */

  render() {
    const layout = [
      <Importacion
        key={1}
        handleXls={this.handleXls}
        extraFields={this.props.extraFields}
        organization={this.props.organization}
        event={this.props.event || null}
      />,
      <Preview
        key={2}
        list={this.state.list}
        eventId={this.props.eventId}
        importUsers={this.importUsers}
        extraFields={this.props.extraFields}
      />,
      <Result
        key={3}
        list={this.state.toImport}
        eventId={this.props.eventId}
        extraFields={this.props.extraFields}
        organization={this.props.organization}
        locationParams={this.props.locationParams}
      />,
    ]
    return (
      <>
        <Header
          title={<Link to={`${this.props.parentUrl}/invitados`}>Invitados</Link>}
          back
          description="Importación de usuarios - Excel"
        />
        <br />
        <Steps current={this.state.step} /* onChange={this.onChange} */>
          <Step title="Importar" />
          <Step title="Relacionar" />
          <Step title="Resultado" />
        </Steps>
        <br />

        <div>{layout[this.state.step]}</div>
      </>
    )
  }
}

export default ImportUsers

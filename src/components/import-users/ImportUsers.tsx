import { FunctionComponent, useState } from 'react'
import { Link } from 'react-router-dom'
import Importation from './importation'
import Preview from './preview'
import Result from './result'
import Async from 'async'
import Header from '@antdComponents/Header'
import { Steps } from 'antd'
import { StateMessage } from '@context/MessageService'
import { FieldType } from './types'

interface IImportUsersProps {
  event: any
  eventId: string
  extraFields: any[]
  organization?: any
  locationParams: any
  handleModal?: () => void
}

const { Step } = Steps

const ImportUsers: FunctionComponent<IImportUsersProps> = (props) => {
  const [step, setStep] = useState(0)
  const [list, setList] = useState<FieldType[]>([])
  const [toImport, setToImport] = useState<any[]>([])

  const [disableSendMail, setDisableSendMail] = useState(false)

  const handleXls = (thingList: FieldType[]) => {
    console.debug('xlsx loaded:', thingList)
    if (thingList.length >= 2) {
      setStep((previous) => previous + 1)
      setList(thingList)
    }
  }

  const onChangeCheckbox = (checked: boolean) => {
    setDisableSendMail(checked)
    console.debug('disableSendMail', disableSendMail)
  }

  const importUsers = (candidateUsers: FieldType[], password: string) => {
    console.debug('users to import', candidateUsers)
    StateMessage.show(
      'loading',
      'loading',
      ' Por favor espere mientras se envía la información...',
    )

    if (password) {
      const genericPassword: any[] = []
      for (let i = 0; i < candidateUsers[0].list.length; i++) {
        genericPassword.push(password)
      }
      candidateUsers.push({ key: 'password', list: genericPassword, used: true })
    }

    try {
      // Agregamos el campo ticket_id sino hacemos esto, la validación de campos seleccionados para importar lo quita y finalmente se pierde
      const preprocessedUsers = candidateUsers.map((column) => {
        if (column.key === 'ticket_id') {
          column.used = true
        }
        return column
      })

      //Quitamos de los usuarios traidos del excel los campos que no se seleccionaron para importar  y luego enviamos
      //al componente result que realiza la importación uno a uno usando el api
      Async.waterfall<FieldType[]>(
        [
          function (cb: (err: any, ...args: any[]) => void) {
            const newUsers = preprocessedUsers
            // const newUsers = users.filter((user) => {
            //   return user.used
            // })
            cb(null, newUsers)
          },
          function (
            newUsers: typeof preprocessedUsers,
            cb: (err: any, ...args: any[]) => void,
          ) {
            console.debug('importing (2)', { newUsers })
            const long = newUsers[0].list.length
            const itemSecondWaterfall: any[] = []
            let initWaterfallCounter = 0
            for (; initWaterfallCounter < long; ) {
              itemSecondWaterfall[initWaterfallCounter] = {}
              initWaterfallCounter++
            }
            if (initWaterfallCounter === long) {
              cb(null, itemSecondWaterfall, newUsers)
            }
          },
          function (
            items: any[],
            newUsers: typeof preprocessedUsers,
            cb: (err: any, ...args: any[]) => void,
          ) {
            console.debug('importing (3)', { items, newUsers })
            const len = newUsers.length
            for (let i = 0; i < items.length; i++) {
              for (let j = 0; j < len; j++) {
                items[i][newUsers[j].key] = newUsers[j].list[i]
              }
            }
            const noUndefinedItems = items
              .filter((item) => {
                if (item.names === undefined || item.email === undefined) {
                  console.warn('user event data is invalid:', item)
                  return false
                }
                return true
              })
              .map((item) => {
                if (item.rol_name === undefined) {
                  item.rol_name = typeof item.rol === 'string' ? item.rol : 'Attendee' // I see that the backend needs this and validate that this exists
                }
                return item
              })
            cb(null, noUndefinedItems)
          },
        ],
        function (err, result) {
          if (err) {
            console.error(err)
            StateMessage.show(
              null,
              'error',
              'Hay un error al procesar la cola de usuarios',
            )
            return
          }

          console.debug('importing (4)', { result })

          setStep((previous) => previous + 1)
          setToImport(result!)
        },
      )
      StateMessage.destroy('loading')
      StateMessage.show(null, 'success', 'Información cargada correctamente!')
    } catch (e) {
      StateMessage.destroy('loading')
      StateMessage.show(null, 'error', 'Error procesando la información')
      console.error(e)
    }
  }

  // const closeModal = () => {
  //   setList([])
  //   if (typeof props.handleModal === 'function') {
  //     props.handleModal()
  //   }
  // }

  const layout = [
    <Importation
      key={1}
      handleXls={handleXls}
      extraFields={props.extraFields}
      organization={props.organization}
      event={props.event || null}
    />,
    <Preview
      key={2}
      list={list}
      eventId={props.eventId}
      importUsers={importUsers}
      extraFields={props.extraFields}
      no_send_mail={disableSendMail}
      onChangeCheckbox={onChangeCheckbox}
    />,
    <Result
      key={3}
      list={toImport}
      eventId={props.eventId}
      extraFields={props.extraFields}
      organization={props.organization}
      locationParams={props.locationParams}
      no_send_mail={disableSendMail}
    />,
  ]

  return (
    <>
      <Header
        title={<Link to="..">Invitados</Link>}
        back
        description="Importación de usuarios - Excel"
      />
      <br />
      <Steps current={step} /* onChange={this.onChange} */>
        <Step title="Importar" />
        <Step title="Relacionar" />
        <Step title="Resultado" />
      </Steps>
      <br />

      <div>{layout[step]}</div>
    </>
  )
}

export default ImportUsers

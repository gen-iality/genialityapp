import { Table, Tag } from 'antd'
import { useState } from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router'
import API from '@helpers/request'
import Header from '@antdComponents/Header'

const OfertProduts = (props) => {
  // const goBack = () => props.history.goBack()
  const [oferts, setOferts] = useState([])

  const params = useParams()

  useEffect(() => {
    if (props.eventId) {
      obtenerOrdenes()
    }
    async function obtenerOrdenes() {
      const data = await API.get(
        `api/events/${props.eventId}/orders/ordersevent?filtered=[{"field":"items","value":"${params.id}"}]`,
      )

      if (data) {
        const orderOferts = data.data.data.sort(
          (a, b) => parseFloat(b.amount) - parseFloat(a.amount),
        )
        setOferts(orderOferts)
      }
    }
  }, [props.eventId])

  const columns = [
    {
      title: 'Correo',
      dataIndex: 'email',
      key: 'email',
      render(text) {
        return <a>{text}</a>
      },
    },
    {
      title: 'Nombre',
      dataIndex: 'first_name',
      key: 'name',
      render(value, item) {
        return (
          <>
            {item.first_name} {item.last_name}
          </>
        )
      },
    },
    {
      title: 'Fecha',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: 'Valor ofertado',
      key: 'amount',
      dataIndex: 'amount',
      render(price, item) {
        return (
          <>
            {' '}
            <Tag key={'amount-' + item._id}>{price}</Tag>
          </>
        )
      },
    },
  ]
  return (
    <>
      <Header title="Ofertas de la obra" back />
      <Table columns={columns} dataSource={oferts.length > 0 && oferts} />
    </>
  )
}

export default OfertProduts

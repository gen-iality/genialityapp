import { FunctionComponent } from 'react'
import { Badge, List } from 'antd'
import { TruncatedAgenda } from '@Utilities/types/AgendaType'
import { Link } from 'react-router-dom'
import { ActivityCustomIcon } from './ActivityCustomIcon'
import ReactQuill from 'react-quill'
import { activityContentValues } from '@context/activityType/constants/ui'

interface IListTheseActivitiesProps {
  dataSource: TruncatedAgenda[]
}

const ListTheseActivities: FunctionComponent<IListTheseActivitiesProps> = (props) => {
  const { dataSource } = props

  return (
    <List
      size="small"
      dataSource={dataSource}
      renderItem={(item: TruncatedAgenda) => (
        <item.ItemWrapper>
          <List.Item className="shadow-box">
            {item.host_picture && (
              <img
                style={{
                  width: '6rem',
                  height: '6rem',
                  borderRadius: '50%',
                  marginRight: '1rem',
                }}
                src={item.host_picture}
              ></img>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                flexFlow: 'row wrap',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  flexFlow: 'column wrap',
                  marginRight: '1rem',
                  //paddingLeft: '25px',
                }}
              >
                <div
                  style={{ display: 'flex', flexFlow: 'row wrap', margin: '0.5rem 0' }}
                >
                  {item.categories &&
                    item.categories.map((category, index) => {
                      return (
                        <Badge
                          key={index}
                          style={{
                            backgroundColor: category.color,
                            fontSize: '1rem',
                            marginRight: '0.5rem',
                          }}
                          count={category.name}
                        />
                      )
                    })}
                </div>
                <Link to={item.link}>
                  <div style={{ fontSize: '1.6rem' }}>
                    <ActivityCustomIcon
                      type={item.type!}
                      className="list-icon"
                      style={{ marginRight: '1em' }}
                    />
                    <span>{item.title}</span>
                  </div>
                </Link>
                <span style={{ fontSize: '1.6rem' }}>{item.name_host}</span>
                {item.short_description !== '<p><br></p>' && (
                  <ReactQuill
                    style={{ color: '#777' }}
                    value={item.short_description || ''}
                    readOnly
                    className="hide-toolbar ql-toolbar"
                    theme="bubble"
                  />
                )}
                {item.type &&
                  [activityContentValues.meet, activityContentValues.meeting].includes(
                    item.type,
                  ) && <small>Inicia en: {item.datetime_start}</small>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <span style={{ marginRight: '.5em' }}>
                  {(item.endComponents || []).map((render) => render())}
                  {item.isInfoOnly && (
                    <Badge style={{ backgroundColor: '#999' }} count="Info" />
                  )}
                </span>
                <Link to={item.link}>
                  {/* <span style={{ fontWeight: '100', fontSize: '1.2rem' }}>{item.timeString}</span> */}
                </Link>
              </div>
            </div>
          </List.Item>
        </item.ItemWrapper>
      )}
    />
  )
}

export default ListTheseActivities

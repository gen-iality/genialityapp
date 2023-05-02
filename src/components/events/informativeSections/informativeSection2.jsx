import { Component } from 'react'
import { Card, Row, Col, Typography } from 'antd'
import Parser from 'html-react-parser'
import withContext from '@context/withContext'

class InformativeSection2 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      markup: '',
      informativeSection1: null,
    }
  }

  componentDidMount() {
    this.setState({
      markup: this.props.cEvent.value.itemsMenu.informativeSection1.markup,
      informativeSection1: this.props.cEvent.value.itemsMenu.informativeSection1,
    })
  }
  render() {
    const { markup, informativeSection1 } = this.state

    return (
      <Row justify="center" gutter={[8, 8]} wrap>
        <Col span={23}>
          {informativeSection1 != null && (
            <div className="site-card-border-less-wrapper">
              <Card
                style={{
                  backgroundColor: this.props.cEvent.value.styles.toolbarDefaultBg,
                }}
                title={
                  <Typography.Title
                    level={4}
                    style={{ color: this.props.cEvent.value.styles.textMenu }}
                  >
                    {informativeSection1 && informativeSection1.name
                      ? informativeSection1.name
                      : 'Sección informativa'}
                  </Typography.Title>
                }
                bordered={false} /* style={{ width: 1000 }} */
              >
                <div
                  id="img-informative"
                  style={{ color: this.props.cEvent.value.styles.textMenu }}
                >
                  {markup != null && Parser(markup)}
                </div>
              </Card>
            </div>
          )}
        </Col>
      </Row>
    )
  }
}

const InformativeSection2WithContext = withContext(InformativeSection2)
export default InformativeSection2WithContext

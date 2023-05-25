import { connect } from 'react-redux'
import { Card, Button } from 'antd'
import { unsetCurrentSurvey } from '../../../redux/survey/actions'
import { setMainStage } from '../../../redux/stage/actions'
import { ArrowLeftOutlined } from '@ant-design/icons'

function SurveyDetail(props) {
  const handleClick = () => {
    const { unsetCurrentSurvey, setMainStage } = props
    unsetCurrentSurvey()
    setMainStage(null)
  }

  return (
    <Card>
      <Button
        style={{ backgroundColor: '#f7981d', color: '#ffffff' }}
        size="large"
        icon={<ArrowLeftOutlined />}
        block
        onClick={handleClick}
      >
        Volver al listado de evaluaciones
      </Button>
    </Card>
  )
}
const mapStateToProps = (state) => ({
  currentSurvey: state.survey.data.currentSurvey,
})

const mapDispatchToProps = {
  unsetCurrentSurvey,
  setMainStage,
}

export default connect(mapStateToProps, mapDispatchToProps)(SurveyDetail)

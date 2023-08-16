import { Route, Routes } from 'react-router-dom'
import Faqs from './faqs'
import Faq from './faq'

function FaqsRoutes(props) {
  const { event } = props
  return (
    <Routes>
      <Route path="/" element={<Faqs event={event} />} />
      <Route path="faq" element={<Faq event={event} {...props} />} />
    </Routes>
  )
}

export default FaqsRoutes

let specialistOptions = [
  { label: 'Alergología' },
  { label: 'Anatomía' },
  { label: 'Anestesiología' },
  { label: 'Angiología' },
  { label: 'Bioquímica' },
  { label: 'Cardiología' },
  { label: 'Cirugía Cardíaca' },
  { label: 'Cirugía general' },
  { label: 'Cirugía oral y maxilofacial' },
  { label: 'Cirugía ortopédica' },
  { label: 'Cirugía pediátrica' },
  { label: 'Cirugía plástica' },
  { label: 'Cirugía torácica' },
  { label: 'Cirugía vascular' },
  { label: 'Dermatología' },
  { label: 'Endocrinología' },
  { label: 'Estomatología' },
  { label: 'Farmacología' },
  { label: 'Farmacología clínica' },
  { label: 'Gastroenterología' },
  { label: 'Genética' },
  { label: 'Genética médica' },
  { label: 'Geriatría' },
  { label: 'Ginecología' },
  { label: 'Ginecología y obstetricia' },
  { label: 'Hematología' },
  { label: 'Hepatología' },
  { label: 'Infectología' },
  { label: 'Inmunología' },
  { label: 'Medicina aeroespacial' },
  { label: 'Medicina de urgencias' },
  { label: 'Medicina del deporte' },
  { label: 'Medicina del trabajo' },
  { label: 'Medicina familiar y comunitaria' },
  { label: 'Medicina física y rehabilitación' },
  { label: 'Medicina forense' },
  { label: 'Medicina intensiva' },
  { label: 'Medicina interna' },
  { label: 'Medicina nuclear' },
  { label: 'Medicina preventiva y salud pública' },
  { label: 'Microbiología y parasitología' },
  { label: 'Nefrología' },
  { label: 'Neumología' },
  { label: 'Neurocirugía' },
  { label: 'Neurofisiología clínica' },
  { label: 'Neurología' },
  { label: 'Nutriología' },
  { label: 'Oftalmología' },
  { label: 'Oncología médica' },
  { label: 'Oncología radioterápica' },
  { label: 'Otorrinolaringología' },
  { label: 'Pediatría' },
  { label: 'Radiología' },
  { label: 'Reumatología' },
  { label: 'Toxicología' },
  { label: 'Traumatología' },
  { label: 'Urología' },
]

specialistOptions = specialistOptions.map((specialist) => {
  return { label: specialist.label, value: specialist.label }
})

export default specialistOptions
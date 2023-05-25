let otherHealthAreaOptions = [
  { label: 'Enfermería' },
  { label: 'Bacterilogía' },
  { label: 'Nutrición y dietética' },
  { label: 'Paramédico' },
]

otherHealthAreaOptions = otherHealthAreaOptions.map((otherHealthArea) => {
  return { label: otherHealthArea.label, value: otherHealthArea.label }
})

export default otherHealthAreaOptions

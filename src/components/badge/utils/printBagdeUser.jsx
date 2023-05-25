const printBagdeUser = (ifrmPrint, badge, user) => {
  const canvas = document.getElementsByTagName('CANVAS')[0]
  const qr = canvas ? canvas.toDataURL() : ''
  const oIframe = ifrmPrint.current
  let oDoc = oIframe.contentWindow || oIframe.contentDocument
  if (oDoc.document) {
    oDoc = oDoc.document
  }
  oDoc.write('<head><title>Escarapela</title>')
  oDoc.write(
    '<body style="display: block; text-align: center;" onload="window.print()"><div>',
  )
  if (badge.length === 0) {
    oDoc.write(
      `<p style="font-family: Lato, sans-serif;font-size:12px;text-transform: uppercase">
       No hay data
      </p>`,
    )
  } else {
    let i = 0
    for (; i < badge.length; ) {
      if (badge[i].line) {
        if (badge[i].qr) oDoc.write(`<div><img src=${qr}></div>`)
        else
          oDoc.write(
            `<p style="font-family: Lato, sans-serif;font-size: ${
              badge[i].size
            }px;text-transform: uppercase">${
              user[badge[i].id_properties.value]
                ? user[badge[i].id_properties.value]
                : user[badge[i].id_properties.label]
                ? user[badge[i].id_properties.label]
                : ''
            }</p>`,
          )
        i++
      } else {
        if (badge[i + 1] && !badge[i + 1].line) {
          oDoc.write(`<div style="display: block; text-align: center;">`)
          if (!badge[i].qr) {
            oDoc.write(`<div style="margin-right: 20px">`)
            oDoc.write(
              `<p style="font-family: Lato, sans-serif;font-size: ${
                badge[i].size
              }px;text-transform: uppercase">${
                user[badge[i].id_properties.value]
                  ? user[badge[i].id_properties.value]
                  : user[badge[i].id_properties.label]
                  ? user[badge[i].id_properties.label]
                  : ''
              }</p>`,
            )
            oDoc.write(`</div>`)
          } else {
            oDoc.write(`<div style="margin-right: 20px">`)
            oDoc.write(`<div><img src=${qr}></div>`)
            oDoc.write(`</div>`)
          }
          if (!badge[i + 1].qr) {
            oDoc.write(`<div style="margin-right: 20px">`)
            oDoc.write(
              `<p style="font-family: Lato, sans-serif;font-size: ${
                badge[i + 1].size
              }px;text-transform: uppercase">${
                user[badge[i + 1].id_properties.value]
                  ? user[badge[i + 1].id_properties.value]
                  : user[badge[i + 1].id_properties.label]
                  ? user[badge[i + 1].id_properties.label]
                  : ''
              }</p>`,
            )
            oDoc.write(`</div>`)
          } else {
            oDoc.write(`<div style="margin-right: 20px">`)
            oDoc.write(`<div><img src=${qr}></div>`)
            oDoc.write(`</div>`)
          }
          oDoc.write(`</div>`)
          i = i + 2
        } else {
          oDoc.write(`<div style="display: block; text-align: center">`)
          oDoc.write(`<div style="margin-right: 20px">`)
          if (!badge[i].qr) {
            oDoc.write(
              `<p style="font-family: Lato, sans-serif;font-size: ${
                badge[i].size
              }px;text-transform: uppercase">${
                user[badge[i].id_properties.value]
                  ? user[badge[i].id_properties.value]
                  : user[badge[i].id_properties.label]
                  ? user[badge[i].id_properties.label]
                  : ''
              }</p>`,
            )
          } else {
            oDoc.write(`<div><img src=${qr}></div>`)
          }
          oDoc.write(`</div>`)
          oDoc.write(`</div>`)
          i++
        }
      }
    }
  }
  oDoc.close()
}
export default printBagdeUser

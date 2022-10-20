import QRCode from 'qrcode.react';

const renderPrint = (badges) => {
  const items = [];
  let i = 0;
  for (; i < badges.length; ) {
    let item;
    if (badges[i].line) {
      item = badges[i].qr ? (
        <QRCode value={'alejomg27@gmail.com'} size={64} />
      ) : (
        <div>
          <p style={{ fontSize: `${badges[i].size}px` }}>{badges[i].id_properties.label}</p>
        </div>
      );
      items.push(item);
      i++;
    } else {
      if (badges[i + 1] && !badges[i + 1].line) {
        item = (
          <div style={{ display: 'block', textAlign: 'center' }}>
            {!badges[i].qr ? (
              <div style={{ marginRight: '20px' }}>
                <p style={{ fontSize: `${badges[i].size}px` }}>{badges[i].id_properties.label}</p>
              </div>
            ) : (
              <div style={{ marginRight: '20px' }}>
                <QRCode value={'evius.co'} size={badges[i].size} />
              </div>
            )}
            {!badges[i + 1].qr ? (
              <div style={{ marginRight: '20px' }}>
                <p style={{ fontSize: `${badges[i + 1].size}px` }}>{badges[i + 1].id_properties.label}</p>
              </div>
            ) : (
              <div>
                <QRCode value={'evius.co'} size={badges[i + 1].size} />
              </div>
            )}
          </div>
        );
        items.push(item);
        i = i + 2;
      } else {
        item = (
          <div style={{ display: 'block', textAlign: 'center' }}>
            <div style={{ marginRight: '20px' }}>
              {!badges[i].qr ? (
                <p style={{ fontSize: `${badges[i].size}px` }}>{badges[i].id_properties.label}</p>
              ) : (
                <QRCode value={'evius.co'} size={badges[i].size} />
              )}
            </div>
          </div>
        );
        items.push(item);
        i++;
      }
    }
  }
  return items.map((item, key) => {
    return <React.Fragment key={key}>{item}</React.Fragment>;
  });
};
export default renderPrint;

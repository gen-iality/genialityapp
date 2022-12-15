import { Button } from 'antd';
import { useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print';
import { useBingo } from '../../hooks/useBingo'
import { useDrawerBingo } from '../../hooks/useDrawerBingo';
import BingoCard from '../BingoCard';
import PrintCardBoard from '../PrintCardBoard';
import PrintComponent from '../PrintComponent'

interface Props {
  isInLanding?: boolean
  bgColor?: string
  textColor?: string
}

export default function PrintBingoCartonButton(props: Props) {
  const { isInLanding, bgColor, textColor } = props
  const [open, setOpen] = useState(false)
  const bingoCardRef = useRef<HTMLDivElement>(null);
  const { bingo } = useBingo()
  const { arrayLocalStorage,
    arrayDataBingo,
    dataFirebaseBingo,
    changeValueLocalStorage,
    cardboardCode,
    getBingoListener,
    bingoPrint,
  } = useDrawerBingo()
  const [loading, setLoading] = useState(false);
  const handlePrintHook = useReactToPrint({
    content: () => bingoCardRef.current,
    documentTitle: `Bingo ID: ${cardboardCode}`,
    onAfterPrint: () => setLoading(false),
    /* pageStyle: `@media print {
      @page {
        size: letter;
        
        
      }
    }`, */
  });

  const onHandlePrint = () => {
    setLoading(true);
    handlePrintHook();
  };

  if (!bingo || !arrayDataBingo.length) return null

  return (
    <>
      {/* TODO: Marlon, please fix styles */}
      {!!isInLanding && !!bgColor && !!textColor && (
        <Button
          loading={loading}
          disabled={loading}
          onClick={() => onHandlePrint()}
          block
          style={{
            height: '48px',
            padding: '6.4px 30px',
            color: bgColor,
            backgroundColor: textColor,
            border: 'none',
          }}
          type='primary'
          size='large'
        >
          Imprimir cartón
        </Button>)}
      {!isInLanding && <PrintCardBoard bingoCardRef={bingoCardRef} cardboardCode={cardboardCode} />}
      <div style={{ display: 'none' }}>
        <BingoCard
          template={dataFirebaseBingo?.template}
          bingo={bingo}
          arrayDataBingo={arrayDataBingo}
          arrayLocalStorage={arrayLocalStorage}
          changeValueLocalStorage={changeValueLocalStorage}
          getBingoListener={getBingoListener}
          setOpenOrClose={setOpen}
        />
      </div>
      <PrintComponent
        bingo={bingo}
        bingoCardRef={bingoCardRef}
        cardboardCode={cardboardCode}
        bingoUsers={bingoPrint}
      />
    </>
  )
}

import { Rule } from 'antd/lib/form'
import { useEffect, useState, useCallback } from 'react'
import { IDynamicFieldData } from '../../dynamic-fields/types'

/**
 * This should be in the hook, and it should use intl
 */
const defaultErrorMessage = 'Es un campo necesario'


export default function useMandatoryRule(fieldData: IDynamicFieldData, errorMessage?: string) {
  const [basicRule, setBasicRule] = useState<Rule>({})
  const [primaryMandatory, setPrimaryMandatory] = useState(false)
  const [secondMandatory, setSecondMandatory] = useState(false)

  const setCondiction = useCallback((newCondiction: boolean) => {
    setSecondMandatory(newCondiction);
  }, [basicRule])

  useEffect(() => {
    setPrimaryMandatory(fieldData.mandatory)
    console.debug('set required rule from mandatory value', { mandatory: fieldData.mandatory })
  }, [fieldData.mandatory])

  useEffect(() => {
    const newRule: Rule = {
      required: secondMandatory || primaryMandatory,
      message: errorMessage ?? defaultErrorMessage,
    }
    setBasicRule(newRule)
    console.debug('set required rule from mandatory value', { primaryMandatory, secondMandatory })
  }, [primaryMandatory, secondMandatory])

  return {basicRule, setCondiction};
}

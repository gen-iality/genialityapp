import { Rule } from 'antd/lib/form'
import { useEffect, useState, useCallback } from 'react'
import { IDynamicFieldData } from './types'

/**
 * This should be in the hook, and it should use intl
 */
const defaultErrorMessage = 'Es un campo necesario'

export default function useMandatoryRule(fieldData: IDynamicFieldData, errorMessage?: string) {
  const [basicRule, setBasicRule] = useState<Rule>({})
  const [secondMandatory, setSecondMandatory] = useState(false)

  const setCondiction = useCallback((newCondiction: boolean) => {
    setSecondMandatory(newCondiction);
  }, [basicRule])

  useEffect(() => {
    const newRule: Rule = {
      required: secondMandatory || fieldData.mandatory,
      message: errorMessage ?? defaultErrorMessage,
    }

    setBasicRule(newRule)
  }, [fieldData.mandatory])

  return {basicRule, setCondiction};
}
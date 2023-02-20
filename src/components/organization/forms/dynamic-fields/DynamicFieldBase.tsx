import * as React from 'react'
import { injectIntl, WrappedComponentProps } from 'react-intl'
import { IDynamicFieldData } from './types'

export interface IDynamicFieldBaseProps extends WrappedComponentProps {
  fieldData: IDynamicFieldData,
  initialValue: any,
}

export interface IDynamicFieldBaseState {
}

class DynamicFieldBase extends React.Component<IDynamicFieldBaseProps, IDynamicFieldBaseState> {
  constructor(props: IDynamicFieldBaseProps) {
    super(props)

    this.state = {
    }
  }

  public render() {
    return <></>
  }
}

export default DynamicFieldBase


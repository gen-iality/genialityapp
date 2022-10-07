import LikertScaleEditor, { DataSource } from '@components/quiz/LikertScaleEditor';
import * as React from 'react';
import { useState } from 'react';


type SampleData = {
  columns: {
    value: string | number,
    text: string,
  }[],
  rows: {
    value: string | number,
    text: string,
  }[],
  values: {
    [x: string]: number | string | null,
  }
};

// Taken from: https://surveyjs.io/form-library/examples/questiontype-matrix/reactjs#content-js
const sampleData = {
  "columns": [
    {
      "value": 5,
      "text": "Strongly agree"
    },
    {
      "value": 4,
      "text": "Agree"
    },
    {
      "value": 3,
      "text": "Neutral"
    },
    {
      "value": 2,
      "text": "Disagree"
    }, {
      "value": 1,
      "text": "Strongly disagree"
    },
  ],
  "rows": [
    {
      "value": "affordable",
      "text": "Product is affordable"
    }, {
      "value": "does what it claims",
      "text": "Product does what it claims"
    }, {
      "value": "better than others",
      "text": "Product is better than other products on the market"
    }, {
      "value": "easy to use",
      "text": "Product is easy to use"
    },
  ],
  // Added
  values: {
    'affordable': null,
    'does what it claims': null,
    'better than others': null,
    'easy to use': 1,
  }
};

export interface ILikertScaleEditorPageProps {
}

export function LikertScaleEditorPage (props: ILikertScaleEditorPageProps) {
  const [data, setData] = useState<DataSource | undefined>();

  return (
    <div>
      <LikertScaleEditor source={sampleData} onEdit={(x) => setData(x)}/>
      <br />
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
}

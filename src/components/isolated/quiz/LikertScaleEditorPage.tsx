import LikertScaleEditor from '@/components/quiz/LikertScaleEditor';
import * as React from 'react';

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
};

export interface ILikertScaleEditorPageProps {
}

export function LikertScaleEditorPage (props: ILikertScaleEditorPageProps) {
  return (
    <div>
      <LikertScaleEditor source={sampleData}/>
    </div>
  );
}

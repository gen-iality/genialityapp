import LikertScaleEditor from '@/components/quiz/LikertScaleEditor';
import * as React from 'react';

export interface ILikertScaleEditorPageProps {
}

export function LikertScaleEditorPage (props: ILikertScaleEditorPageProps) {
  return (
    <div>
      <LikertScaleEditor/>
    </div>
  );
}

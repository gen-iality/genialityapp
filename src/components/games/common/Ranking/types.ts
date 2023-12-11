export interface Score {
  time: any;
  name: string;
  email: string;
  uid: string;
  imageProfile: string;
  index: number;
  score: string;
  created_at: Date | string;
}


export interface IScoreParsed extends Omit<Score,'time' | 'email' | 'created_at'> {
  isFinish: boolean;
}


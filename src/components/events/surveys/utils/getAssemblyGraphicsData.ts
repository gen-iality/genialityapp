import {  VoteResponse } from "../types";


export interface ResponseGroup {
  response:   string;
  voteWeight: number;
  quantity:   number;
}

export type Acc = Record<string, ResponseGroup>

const groupedVotes = (votes: VoteResponse[]) =>
	votes.reduce((acc: Acc, vote: VoteResponse) => {
    if(!vote.voteWeight) return acc
		if (acc[vote.response]) {
			acc[vote.response].voteWeight += vote.voteWeight;
			acc[vote.response].quantity += 1;
		} else {
			acc[vote.response] = { response: vote.response, voteWeight: vote.voteWeight, quantity: 1 };
		}
		return acc;
	}, {});

export const getAssemblyGraphicsData = (data: VoteResponse[]) => {
	const votationGrouped = groupedVotes(data);
	const votes = Object.keys(votationGrouped).map(key => ({
		voteWeight: votationGrouped[key].voteWeight,
		quantity: votationGrouped[key].quantity,
	}));

	const totalVotesWeight = votes.reduce((acc, vote) => acc + vote.voteWeight, 0);

	const totalVotesQty = votes.reduce((acc, vote) => acc + vote.quantity, 0);

	const dataValues = votes.map(vote => (vote.voteWeight / totalVotesWeight) * 100);

	const labels = votes.map(vote => `${vote.quantity} votos ${(vote.voteWeight / totalVotesWeight) * 100} %`);

	return { dataValues, labels };
};

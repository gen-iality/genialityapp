import { singularOrPluralString } from "@/Utilities/singularOrPluralString";
import {  Label, VoteResponse } from "../types";
import { getColor } from "./getColor";
import { numberDecimalToTwoDecimals } from "./numberDecimalToTwoDecimals";
import { numberToAlphabet } from "./numberToAlphabet";


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
	const votesKeys = Object.keys(votationGrouped)
	const votes = votesKeys.map(key => ({
		voteWeight: votationGrouped[key].voteWeight,
		quantity: votationGrouped[key].quantity,
	}));

	const totalVotesWeight = votes.reduce((acc, vote) => acc + vote.voteWeight, 0);

	const totalVotesQty = votes.reduce((acc, vote) => acc + vote.quantity, 0);

	const dataValues = votes.map(vote => numberDecimalToTwoDecimals((vote.voteWeight / totalVotesWeight) * 100));

	const labels: Label[] = votes.map((vote, index) => ({
		complete: `${singularOrPluralString(vote.quantity, 'voto', 'votos')} ${numberDecimalToTwoDecimals((vote.voteWeight / totalVotesWeight) * 100)} %`,
		question: votesKeys[index],
		percentage: numberDecimalToTwoDecimals((vote.voteWeight / totalVotesWeight) * 100),
		quantity: vote.quantity,
		color: getColor(index),
		letter: numberToAlphabet(index),
	}));

	console.log('test:getAssemblyGraphicsData', { dataValues, labels })


	return { dataValues, labels };
};

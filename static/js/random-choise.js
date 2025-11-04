'use strict';

// Этот код я нагло украл и чуть доработал

function cumulativeWeights(weights){
	let total = 0;
	let result = [];
	for(let weight of weights){
		total += weight;
		result.push(total);
	}
	return result;
}

function pick(x, arr){
	let index = 0;
	while(x >= arr[index] && index < arr.length){
		index++;
	}
	return index;
}

function randomChoise(items, weights){
	if(!Array.isArray(items) ||
	   !Array.isArray(weights) ||
	   !(items.length === weights.length)){
		   throw new TypeError('Expected two equal length arrays');
	   }
	const cumulative = cumulativeWeights(weights);
	const rand = Math.random() * cumulative[cumulative.length - 1];
	return items[pick(rand, cumulative)];
}


function randomChoises(items, weights, count){
	if(!Array.isArray(items) ||
	   !Array.isArray(weights) ||
	   !(items.length === weights.length)){
		   throw new TypeError('Expected two equal length arrays');
	   }
	const cumulative = cumulativeWeights(weights);
    let result = [];
    for (let i = 0; i < count; i++){
        const rand = Math.random() * cumulative[cumulative.length - 1];
        result.push(items[pick(rand, cumulative)]);
    }
	return result;
}

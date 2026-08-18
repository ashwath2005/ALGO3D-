import { OP_TYPES, createStep } from '../engine/ExecutionEngine.js';

// --- 0/1 KNAPSACK PROBLEM ---
export const knapsack01 = {
  id: 'knapsack-01',
  name: '0/1 Knapsack (DP Table)',
  category: 'dynamicProgramming',
  structureType: 'matrix',
  complexity: { timeBest: 'O(n * W)', timeAverage: 'O(n * W)', timeWorst: 'O(n * W)', space: 'O(n * W)' },
  description: 'Determines the maximum value of items that can be included in a knapsack of capacity W without exceeding total weight.',
  code: `function knapsack(W, wt, val, n) {
  let K = Array.from({length: n + 1}, () => Array(W + 1).fill(0));
  for (let i = 0; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      if (i === 0 || w === 0) K[i][w] = 0;
      else if (wt[i - 1] <= w) {
        K[i][w] = Math.max(val[i - 1] + K[i - 1][w - wt[i - 1]], K[i - 1][w]);
      } else {
        K[i][w] = K[i - 1][w];
      }
    }
  }
  return K[n][W];
}`,
  execute(initialData, options = {}) {
    const W = 6;
    const wt = [2, 1, 3, 2];
    const val = [12, 10, 20, 15];
    const n = wt.length;

    const dpTable = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));
    const steps = [];

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      stateSnapshot: dpTable.map(r => [...r]),
      description: `Initialized 0/1 Knapsack table with Capacity W = ${W}, Items = ${n}`,
      variables: { Capacity: W, numItems: n },
      codeLine: 2
    }));

    for (let i = 1; i <= n; i++) {
      for (let w = 1; w <= W; w++) {
        steps.push(createStep({
          type: OP_TYPES.VISIT,
          indices: [i, w],
          stateSnapshot: dpTable.map(r => [...r]),
          description: `Evaluating item ${i} (Weight: ${wt[i - 1]}, Value: ${val[i - 1]}) for sub-capacity ${w}`,
          variables: { i, w, itemWeight: wt[i - 1], itemVal: val[i - 1] },
          codeLine: 4
        }));

        if (wt[i - 1] <= w) {
          const includeVal = val[i - 1] + dpTable[i - 1][w - wt[i - 1]];
          const excludeVal = dpTable[i - 1][w];
          dpTable[i][w] = Math.max(includeVal, excludeVal);

          steps.push(createStep({
            type: OP_TYPES.ASSIGN,
            indices: [i, w],
            values: [dpTable[i][w]],
            stateSnapshot: dpTable.map(r => [...r]),
            description: `DP[${i}][${w}] = max(Include: ${includeVal}, Exclude: ${excludeVal}) = ${dpTable[i][w]}`,
            variables: { includeVal, excludeVal, chosen: dpTable[i][w] },
            codeLine: 6
          }));
        } else {
          dpTable[i][w] = dpTable[i - 1][w];
          steps.push(createStep({
            type: OP_TYPES.ASSIGN,
            indices: [i, w],
            values: [dpTable[i][w]],
            stateSnapshot: dpTable.map(r => [...r]),
            description: `Item weight ${wt[i - 1]} > capacity ${w} => Exclude item. DP[${i}][${w}] = ${dpTable[i][w]}`,
            variables: { chosen: dpTable[i][w] },
            codeLine: 8
          }));
        }
      }
    }

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      indices: [n, W],
      values: [dpTable[n][W]],
      stateSnapshot: dpTable.map(r => [...r]),
      description: `0/1 Knapsack optimal maximum value = ${dpTable[n][W]}`,
      variables: { maxValue: dpTable[n][W] },
      codeLine: 11
    }));

    return steps;
  }
};

// --- LONGEST COMMON SUBSEQUENCE (LCS) ---
export const longestCommonSubsequence = {
  id: 'longest-common-subsequence',
  name: 'Longest Common Subsequence (LCS)',
  category: 'dynamicProgramming',
  structureType: 'matrix',
  complexity: { timeBest: 'O(m * n)', timeAverage: 'O(m * n)', timeWorst: 'O(m * n)', space: 'O(m * n)' },
  description: 'Finds the length of the longest subsequence present in both strings in the same relative order using a 2D DP matrix.',
  code: `function lcs(text1, text2) {
  let m = text1.length, n = text2.length;
  let dp = Array.from({length: m + 1}, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}`,
  execute(initialData, options = {}) {
    const text1 = 'ALGO';
    const text2 = 'LOGS';
    const m = text1.length;
    const n = text2.length;

    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    const steps = [];

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      stateSnapshot: dp.map(r => [...r]),
      description: `LCS between "${text1}" and "${text2}" (${m}x${n} matrix)`,
      variables: { text1, text2 },
      codeLine: 2
    }));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const char1 = text1[i - 1];
        const char2 = text2[j - 1];

        steps.push(createStep({
          type: OP_TYPES.VISIT,
          indices: [i, j],
          stateSnapshot: dp.map(r => [...r]),
          description: `Compare text1[${i - 1}] ('${char1}') with text2[${j - 1}] ('${char2}')`,
          variables: { char1, char2, i, j },
          codeLine: 5
        }));

        if (char1 === char2) {
          dp[i][j] = 1 + dp[i - 1][j - 1];
          steps.push(createStep({
            type: OP_TYPES.ASSIGN,
            indices: [i, j],
            values: [dp[i][j]],
            stateSnapshot: dp.map(r => [...r]),
            description: `Match ('${char1}')! dp[${i}][${j}] = 1 + dp[${i - 1}][${j - 1}] = ${dp[i][j]}`,
            variables: { lcsLength: dp[i][j] },
            codeLine: 6
          }));
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          steps.push(createStep({
            type: OP_TYPES.ASSIGN,
            indices: [i, j],
            values: [dp[i][j]],
            stateSnapshot: dp.map(r => [...r]),
            description: `Mismatch: dp[${i}][${j}] = max(top: ${dp[i - 1][j]}, left: ${dp[i][j - 1]}) = ${dp[i][j]}`,
            variables: { lcsLength: dp[i][j] },
            codeLine: 8
          }));
        }
      }
    }

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      indices: [m, n],
      values: [dp[m][n]],
      stateSnapshot: dp.map(r => [...r]),
      description: `LCS Finished! Length of longest common subsequence = ${dp[m][n]}`,
      variables: { result: dp[m][n] },
      codeLine: 11
    }));

    return steps;
  }
};

// --- COIN CHANGE (MINIMUM COINS) ---
export const coinChangeDP = {
  id: 'coin-change-dp',
  name: 'Coin Change (Min Coins)',
  category: 'dynamicProgramming',
  structureType: 'array',
  complexity: { timeBest: 'O(amount * coins)', timeAverage: 'O(amount * coins)', timeWorst: 'O(amount * coins)', space: 'O(amount)' },
  description: 'Finds the minimum number of coins needed to make a target amount using bottom-up dynamic programming memoization.',
  code: `function coinChange(coins, amount) {
  let dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (let coin of coins) {
      if (coin <= i) {
        dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
  execute(initialData, options = {}) {
    const coins = [1, 2, 5];
    const amount = 11;
    const dp = new Array(amount + 1).fill(99);
    dp[0] = 0;
    const steps = [];

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      stateSnapshot: [...dp],
      description: `Target amount: ${amount}, Coins available: [${coins.join(', ')}]`,
      variables: { amount, coins },
      codeLine: 2
    }));

    for (let i = 1; i <= amount; i++) {
      for (const coin of coins) {
        if (coin <= i) {
          const candidate = 1 + dp[i - coin];
          if (candidate < dp[i]) {
            dp[i] = candidate;
            steps.push(createStep({
              type: OP_TYPES.OVERWRITE,
              indices: [i],
              values: [dp[i]],
              stateSnapshot: [...dp],
              description: `Sub-amount ${i}: using coin ${coin} gives ${dp[i]} coins`,
              variables: { amount: i, coin, minCoins: dp[i] },
              codeLine: 6
            }));
          }
        }
      }
    }

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      indices: [amount],
      values: [dp[amount]],
      stateSnapshot: [...dp],
      description: `Minimum coins needed to form amount ${amount} = ${dp[amount]} coins`,
      variables: { minCoins: dp[amount] },
      codeLine: 10
    }));

    return steps;
  }
};

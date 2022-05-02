import { skipToken } from '@reduxjs/toolkit/query/react'
import { Currency, Token } from '@uniswap/sdk-core'
import { FeeAmount } from '@uniswap/v3-sdk'
import useBlockNumber from 'lib/hooks/useBlockNumber'
import ms from 'ms.macro'
import { useMemo } from 'react'
import ReactGA from 'react-ga4'
import { useFeeTierDistributionQuery } from 'state/data/enhanced'
import { FeeTierDistributionQuery } from 'state/data/generated'

import { PoolState, usePool } from './usePools'

// maximum number of blocks past which we consider the data stale
const MAX_DATA_BLOCK_AGE = 20

interface FeeTierDistribution {
  isLoading: boolean
  isError: boolean
  largestUsageFeeTier?: FeeAmount | undefined

  // distributions as percentages of overall liquidity
  distributions?: Record<FeeAmount, number | undefined>
}

export function useFeeTierDistribution(
  currency: Currency | undefined
): FeeTierDistribution {
  const { isFetching, isLoading, isUninitialized, isError, distributions } = usePoolTVL(
    currency?.wrapped
  )

  // fetch all pool states to determine pool state
  const [poolStateVeryLow] = usePool(currency, FeeAmount.LOWEST)
  const [poolStateLow] = usePool(currency, FeeAmount.LOW)
  const [poolStateMedium] = usePool(currency, FeeAmount.MEDIUM)
  const [poolStateHigh] = usePool(currency, FeeAmount.HIGH)

  return useMemo(() => {
    if (isLoading || isFetching || isUninitialized || isError || !distributions) {
      return {
        isLoading: isLoading || isFetching || !isUninitialized,
        isError,
        distributions,
      }
    }

    const largestUsageFeeTier = Object.keys(distributions)
      .map((d) => Number(d))
      .filter((d: FeeAmount) => distributions[d] !== 0 && distributions[d] !== undefined)
      .reduce((a: FeeAmount, b: FeeAmount) => ((distributions[a] ?? 0) > (distributions[b] ?? 0) ? a : b), -1)

    const percentages =
      !isLoading &&
      !isError &&
      distributions &&
      poolStateVeryLow !== PoolState.LOADING &&
      poolStateLow !== PoolState.LOADING &&
      poolStateMedium !== PoolState.LOADING &&
      poolStateHigh !== PoolState.LOADING
        ? {
            [FeeAmount.LOWEST]:
              poolStateVeryLow === PoolState.EXISTS ? (distributions[FeeAmount.LOWEST] ?? 0) * 100 : undefined,
            [FeeAmount.LOW]: poolStateLow === PoolState.EXISTS ? (distributions[FeeAmount.LOW] ?? 0) * 100 : undefined,
            [FeeAmount.MEDIUM]:
              poolStateMedium === PoolState.EXISTS ? (distributions[FeeAmount.MEDIUM] ?? 0) * 100 : undefined,
            [FeeAmount.HIGH]:
              poolStateHigh === PoolState.EXISTS ? (distributions[FeeAmount.HIGH] ?? 0) * 100 : undefined,
          }
        : undefined

    return {
      isLoading,
      isError,
      distributions: percentages,
      largestUsageFeeTier: largestUsageFeeTier === -1 ? undefined : largestUsageFeeTier,
    }
  }, [
    isLoading,
    isFetching,
    isUninitialized,
    isError,
    distributions,
    poolStateVeryLow,
    poolStateLow,
    poolStateMedium,
    poolStateHigh,
  ])
}

function usePoolTVL(token: Token | undefined) {
  const latestBlock = useBlockNumber()

  const { isLoading, isFetching, isUninitialized, isError, data } = useFeeTierDistributionQuery(
    token ? { token: token.address.toLowerCase() } : skipToken,
    {
      pollingInterval: ms`30s`,
    }
  )

  const { pool, _meta } = (data as FeeTierDistributionQuery) ?? {}

  return useMemo(() => {
    if (!latestBlock || !_meta || !pool) {
      return {
        isLoading,
        isFetching,
        isUninitialized,
        isError,
      }
    }

    if (latestBlock - (_meta?.block?.number ?? 0) > MAX_DATA_BLOCK_AGE) {
      ReactGA.event('exception', { description: `Graph stale (latest block: ${latestBlock})` })

      return {
        isLoading,
        isFetching,
        isUninitialized,
        isError,
      }
    }


    // sum tvl for token0 and token1 by fee tier
    const tvlByFeeTier = {
      [pool.latestDailies.APR]: [+pool.balanceCerUsd, +pool.balanceToken]
    }
    // const tvlByFeeTier = pool.reduce<{ [feeAmount: number]: [number | undefined, number | undefined] }>(
    //   (acc, value) => {
    //     acc[value.feeTier][0] = (acc[value.feeTier][0] ?? 0) + Number(value.totalValueLockedToken0)
    //     acc[value.feeTier][1] = (acc[value.feeTier][1] ?? 0) + Number(value.totalValueLockedToken1)
    //     return acc
    //   },
    //   {
    //     [FeeAmount.LOWEST]: [undefined, undefined],
    //     [FeeAmount.LOW]: [undefined, undefined],
    //     [FeeAmount.MEDIUM]: [undefined, undefined],
    //     [FeeAmount.HIGH]: [undefined, undefined],
    //   } as Record<FeeAmount, [number | undefined, number | undefined]>
    // )

    // sum total tvl for token0 and token1
    // const [sumToken0Tvl, sumToken1Tvl] = Object.values(tvlByFeeTier).reduce(
    //   (acc: [number, number], value) => {
    //     acc[0] += value[0] ?? 0
    //     acc[1] += value[1] ?? 0
    //     return acc
    //   },
    //   [0, 0]
    // )

    // returns undefined if both tvl0 and tvl1 are undefined (pool not created)
    const mean = (tvl0: number | undefined, sumTvl0: number, tvl1: number | undefined, sumTvl1: number) =>
      tvl0 === undefined && tvl1 === undefined ? undefined : ((tvl0 ?? 0) + (tvl1 ?? 0)) / (sumTvl0 + sumTvl1) || 0

    // const distributions: Record<FeeAmount, number | undefined> = {
    //   [FeeAmount.LOWEST]: mean(
    //     tvlByFeeTier[FeeAmount.LOWEST][0],
    //     sumToken0Tvl,
    //     tvlByFeeTier[FeeAmount.LOWEST][1],
    //     sumToken1Tvl
    //   ),
    //   [FeeAmount.LOW]: mean(tvlByFeeTier[FeeAmount.LOW][0], sumToken0Tvl, tvlByFeeTier[FeeAmount.LOW][1], sumToken1Tvl),
    //   [FeeAmount.MEDIUM]: mean(
    //     tvlByFeeTier[FeeAmount.MEDIUM][0],
    //     sumToken0Tvl,
    //     tvlByFeeTier[FeeAmount.MEDIUM][1],
    //     sumToken1Tvl
    //   ),
    //   [FeeAmount.HIGH]: mean(
    //     tvlByFeeTier[FeeAmount.HIGH][0],
    //     sumToken0Tvl,
    //     tvlByFeeTier[FeeAmount.HIGH][1],
    //     sumToken1Tvl
    //   ),
    // }

    const distributions: Record<FeeAmount, number | undefined> = {
      [FeeAmount.HIGH]: +pool.latestDailies.APR,
      100: undefined,
      500: undefined,
      3000: undefined
    }

    return {
      isLoading,
      isFetching,
      isUninitialized,
      isError,
      distributions,
    }
  }, [_meta, pool, isLoading, isError, isFetching, isUninitialized, latestBlock])
}

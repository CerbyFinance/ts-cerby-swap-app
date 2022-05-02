import { Currency } from '@uniswap/sdk-core'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import { useCombinedActiveList } from 'state/lists/hooks'
import { PoolInfo } from '../constants/lists';

/**
 * Returns a WrappedTokenInfo from the active token lists when possible,
 * or the passed token otherwise. */
export function useTokenInfoFromActiveList(currency: PoolInfo) {
  const { chainId } = useActiveWeb3React()
  const activeList = useCombinedActiveList()

  return useMemo(() => {
    if (!chainId) return

    try {
      return activeList[chainId][currency.address].token
    } catch (e) {
      return currency
    }
  }, [activeList, chainId, currency])
}

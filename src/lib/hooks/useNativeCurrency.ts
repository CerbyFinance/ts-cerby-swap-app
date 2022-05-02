import { PoolInfo } from '../../constants/lists'
import { SupportedChainId } from 'constants/chains'
import { nativeOnChain } from 'constants/tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'

export default function useNativeCurrency(): PoolInfo {
  const { chainId } = useActiveWeb3React()
  return useMemo(
    () =>
      chainId
        ? nativeOnChain(chainId)
        : // display mainnet when not connected
          nativeOnChain(SupportedChainId.MAINNET),
    [chainId]
  )
}

import { SupportedChainId } from './chains'

/**
 * These are the network URLs used by the interface when there is not another available source of chain data
 */
export const ANKR_NETWORK_URLS: { [key in SupportedChainId]: string } = {
  [SupportedChainId.MAINNET]: `https://rpc.ankr.com/eth`,
  [SupportedChainId.POLYGON]: `https://rpc.ankr.com/polygon`,
  [SupportedChainId.BINANCE]: `https://rpc.ankr.com/bsc`,
  [SupportedChainId.FANTOM]: `https://rpc.ankr.com/fantom`,
  [SupportedChainId.AVALANCHE]: `https://rpc.ankr.com/avalanche`,
  3: '',
  4: '',
  5: '',
  42: '',
  42161: '',
  421611: '',
  10: '',
  69: '',
  80001: '',
}

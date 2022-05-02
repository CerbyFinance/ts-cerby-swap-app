import { Currency } from '@uniswap/sdk-core'

export function currencyId(currency: PoolInfo): string {
  // if (currency.isNative) return 'ETH'
  return currency.address
  throw new Error('invalid currency')
}

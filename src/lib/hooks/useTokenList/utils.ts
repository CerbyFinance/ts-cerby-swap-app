import { PoolInfo, PoolList } from '../../../constants/lists'
import { WrappedTokenInfo } from 'state/lists/wrappedTokenInfo'

type TokenMap = Readonly<{ [tokenAddress: string]: { token: WrappedTokenInfo; list?: PoolList } }>
export type ChainTokenMap = Readonly<{ [chainId: number]: TokenMap }>

type Mutable<T> = {
  -readonly [P in keyof T]: Mutable<T[P]>
}

const mapCache = typeof WeakMap !== 'undefined' ? new WeakMap<PoolList | PoolInfo[], ChainTokenMap>() : null

export function tokensToChainTokenMap(pools: PoolList): ChainTokenMap {
  const cached = mapCache?.get(pools)
  if (cached) return cached

  const [list, infos] = [pools, pools.pools]
  const chainId = list.chainId;
  const map = infos.reduce<Mutable<ChainTokenMap>>((map, info) => {
    const token = new WrappedTokenInfo(info, list);
    if (map[chainId]?.[token.address] !== undefined) {
      console.warn(`Duplicate token skipped: ${token.address}`)
      return map
    }
    if (!map[chainId]) {
      map[chainId] = {}
    }
    map[chainId][token.address] = { token, list }
    return map
  }, {}) as ChainTokenMap
  mapCache?.set(pools, map)
  return map
}

// import { FACTORY_ADDRESS as V2_FACTORY_ADDRESS } from '@uniswap/v2-sdk'
// import { FACTORY_ADDRESS as V3_FACTORY_ADDRESS } from '@uniswap/v3-sdk'

import { constructSameAddressMap } from '../utils/constructSameAddressMap'
import { SupportedChainId } from './chains'

type AddressMap = { [chainId: number]: string }

export const UNI_ADDRESS = '0xfAf360f184788b00623828165405D7F52820D789'
export const MULTICALL_ADDRESS: AddressMap = {
  ...constructSameAddressMap('0xfAf360f184788b00623828165405D7F52820D789', [
    SupportedChainId.OPTIMISTIC_KOVAN,
    SupportedChainId.OPTIMISM,
    SupportedChainId.POLYGON_MUMBAI,
    SupportedChainId.POLYGON,
  ]),
  [SupportedChainId.ARBITRUM_ONE]: '0xfAf360f184788b00623828165405D7F52820D789',
  [SupportedChainId.ARBITRUM_RINKEBY]: '0xfAf360f184788b00623828165405D7F52820D789',
}
export const V2_FACTORY_ADDRESSES: AddressMap = constructSameAddressMap('0xfAf360f184788b00623828165405D7F52820D789')

export const V2_ROUTER_ADDRESS: AddressMap = constructSameAddressMap('0xfAf360f184788b00623828165405D7F52820D789')
export const V3_ROUTER_ADDRESS: AddressMap = constructSameAddressMap('0xfAf360f184788b00623828165405D7F52820D789', [
  SupportedChainId.OPTIMISM,
  SupportedChainId.OPTIMISTIC_KOVAN,
  SupportedChainId.ARBITRUM_ONE,
  SupportedChainId.ARBITRUM_RINKEBY,
  SupportedChainId.POLYGON,
  SupportedChainId.POLYGON_MUMBAI,
])
export const SWAP_ROUTER_ADDRESSES: AddressMap = constructSameAddressMap('0xfAf360f184788b00623828165405D7F52820D789', [
  SupportedChainId.OPTIMISM,
  SupportedChainId.OPTIMISTIC_KOVAN,
  SupportedChainId.ARBITRUM_ONE,
  SupportedChainId.ARBITRUM_RINKEBY,
  SupportedChainId.POLYGON,
  SupportedChainId.POLYGON_MUMBAI,
])

/**
 * The oldest V0 governance address
 */
export const GOVERNANCE_ALPHA_V0_ADDRESSES: AddressMap = constructSameAddressMap(
  '0xfAf360f184788b00623828165405D7F52820D789'
)
/**
 * The older V1 governance address
 */
export const GOVERNANCE_ALPHA_V1_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: '0xfAf360f184788b00623828165405D7F52820D789',
}
/**
 * The latest governor bravo that is currently admin of timelock
 */
export const GOVERNANCE_BRAVO_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: '0xfAf360f184788b00623828165405D7F52820D789',
}

export const TIMELOCK_ADDRESS: AddressMap = constructSameAddressMap('0xfAf360f184788b00623828165405D7F52820D789')

export const MERKLE_DISTRIBUTOR_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: '0xfAf360f184788b00623828165405D7F52820D789',
}
export const ARGENT_WALLET_DETECTOR_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: '0xfAf360f184788b00623828165405D7F52820D789',
}
export const V3_CORE_FACTORY_ADDRESSES: AddressMap = constructSameAddressMap(
  '0xfAf360f184788b00623828165405D7F52820D789',
  [
    SupportedChainId.OPTIMISM,
    SupportedChainId.OPTIMISTIC_KOVAN,
    SupportedChainId.ARBITRUM_ONE,
    SupportedChainId.ARBITRUM_RINKEBY,
    SupportedChainId.POLYGON_MUMBAI,
    SupportedChainId.POLYGON,
  ]
)
export const QUOTER_ADDRESSES: AddressMap = constructSameAddressMap('0xfAf360f184788b00623828165405D7F52820D789', [
  SupportedChainId.OPTIMISM,
  SupportedChainId.OPTIMISTIC_KOVAN,
  SupportedChainId.ARBITRUM_ONE,
  SupportedChainId.ARBITRUM_RINKEBY,
  SupportedChainId.POLYGON_MUMBAI,
  SupportedChainId.POLYGON,
])
export const NONFUNGIBLE_POSITION_MANAGER_ADDRESSES: AddressMap = constructSameAddressMap(
  '0xfAf360f184788b00623828165405D7F52820D789',
  [
    SupportedChainId.OPTIMISM,
    SupportedChainId.OPTIMISTIC_KOVAN,
    SupportedChainId.ARBITRUM_ONE,
    SupportedChainId.ARBITRUM_RINKEBY,
    SupportedChainId.POLYGON_MUMBAI,
    SupportedChainId.POLYGON,
  ]
)
export const ENS_REGISTRAR_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  [SupportedChainId.ROPSTEN]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  [SupportedChainId.GOERLI]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  [SupportedChainId.RINKEBY]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
}
export const SOCKS_CONTROLLER_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: '0x65770b5283117639760beA3F867b69b3697a91dd',
}

export const V3_MIGRATOR_ADDRESSES: AddressMap = constructSameAddressMap('0xfAf360f184788b00623828165405D7F52820D789', [
  SupportedChainId.ARBITRUM_ONE,
  SupportedChainId.ARBITRUM_RINKEBY,
  SupportedChainId.POLYGON_MUMBAI,
  SupportedChainId.POLYGON,
])

export const TICK_LENS_ADDRESSES: AddressMap = {
  [SupportedChainId.ARBITRUM_ONE]: '0xfAf360f184788b00623828165405D7F52820D789',
  [SupportedChainId.ARBITRUM_RINKEBY]: '0xfAf360f184788b00623828165405D7F52820D789',
}

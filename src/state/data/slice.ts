import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { createApi } from '@reduxjs/toolkit/query/react'
import { SupportedChainId } from 'constants/chains'
import { DocumentNode } from 'graphql'
import { ClientError, gql, GraphQLClient } from 'graphql-request'
import { AppState } from 'state'

// List of supported subgraphs. Note that the app currently only support one active subgraph at a time
const CHAIN_SUBGRAPH_URL: Record<number, string> = {
  [SupportedChainId.MAINNET]: 'http://localhost:8000/subgraphs/name/CerbySwap/testGanache',
  [SupportedChainId.RINKEBY]: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',

  [SupportedChainId.ARBITRUM_ONE]: 'https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-minimal',

  [SupportedChainId.OPTIMISM]: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-optimism-dev',

  [SupportedChainId.POLYGON]: 'http://localhost:8000/subgraphs/name/CerbySwap/testGanache',
}

export const api = createApi({
  reducerPath: 'dataApi',
  baseQuery: graphqlRequestBaseQuery(),
  endpoints: (builder) => ({
    allV3Ticks: builder.query({
      query: ({ poolAddress, skip = 0 }) => ({
        document: gql`
          query allTicks($poolAddress: String!, $skip: Int!) {
            poolDailies(first: 1000, skip: $skip, where: { token: $poolAddress }, orderBy: startUnix) {
              tick: startUnix
              balanceToken
              balanceCerUsd
              price
            }
          }
        `,
        variables: {
          poolAddress,
          skip,
        },
      }),
    }),
    feeTierDistribution: builder.query({
      query: ({ token }) => ({
        document: gql`
          query feeTierDistribution($token: ID!) {
            _meta {
              block {
                number
              }
            }
            pool(
              id: $token
            ) {
              balanceToken
              balanceCerUsd
              latestDailies {
                APR
              }
            }
          }
        `,
        variables: {
          token
        },
      }),
    }),
  }),
})

// Graphql query client wrapper that builds a dynamic url based on chain id
function graphqlRequestBaseQuery(): BaseQueryFn<
  { document: string | DocumentNode; variables?: any },
  unknown,
  Pick<ClientError, 'name' | 'message' | 'stack'>,
  Partial<Pick<ClientError, 'request' | 'response'>>
> {
  return async ({ document, variables }, { getState }) => {
    try {
      const chainId = (getState() as AppState).application.chainId

      const subgraphUrl = chainId ? CHAIN_SUBGRAPH_URL[chainId] : undefined

      if (!subgraphUrl) {
        return {
          error: {
            name: 'UnsupportedChainId',
            message: `Subgraph queries against ChainId ${chainId} are not supported.`,
            stack: '',
          },
        }
      }

      return { data: await new GraphQLClient(subgraphUrl).request(document, variables), meta: {} }
    } catch (error) {
      if (error instanceof ClientError) {
        const { name, message, stack, request, response } = error
        return { error: { name, message, stack }, meta: { request, response } }
      }
      throw error
    }
  }
}

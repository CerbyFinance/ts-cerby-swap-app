// import type { TokenInfo } from '@uniswap/token-lists'
import { PoolInfo, PoolList } from '../../../constants/lists';
import type { Ajv, ValidateFunction } from 'ajv'

enum ValidationSchema {
  LIST = 'list',
  TOKENS = 'tokens',
}

const validator = new Promise<Ajv>(async (resolve) => {
  const [ajv, schema] = await Promise.all([import('ajv'), import('../../../deps/tokenlist.schema.json')])
  const validator = new ajv.default({ allErrors: true })
    .addSchema(schema, ValidationSchema.LIST)
    // Adds a meta scheme of Pick<TokenList, 'tokens'>
    .addSchema(
      {
        ...schema,
        $id: schema.$id + '#pools',
        required: ['pools'],
      },
      "pools"
    )
  resolve(validator)
})

function getValidationErrors(validate: ValidateFunction | undefined): string {
  return (
    validate?.errors?.map((error) => [error.dataPath, error.message].filter(Boolean).join(' ')).join('; ') ??
    'unknown error'
  )
}

/**
 * Validates an array of tokens.
 * @param json the TokenInfo[] to validate
 */
export async function validateTokens(json: PoolInfo[]): Promise<PoolInfo[]> {
  const validate = (await validator).getSchema(ValidationSchema.TOKENS)
  if (validate?.({ tokens: json })) {
    return json
  }
  throw new Error(`Token list failed validation: ${getValidationErrors(validate)}`)
}

/**
 * Validates a token list.
 * @param json the TokenList to validate
 */
export default async function validateTokenList(json: PoolList): Promise<PoolList> {
  const validate = (await validator).getSchema(ValidationSchema.LIST)
  if (validate?.(json)) {
    return json
  }
  throw new Error(`Token list failed validation: ${getValidationErrors(validate)}`)
}

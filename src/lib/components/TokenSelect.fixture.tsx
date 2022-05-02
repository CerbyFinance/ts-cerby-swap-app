// import DEFAULT_TOKEN_LIST from '@uniswap/default-token-list'
import { TokenListProvider } from 'lib/hooks/useTokenList'

import { Modal } from './Dialog'
import { TokenSelectDialog } from './TokenSelect'

export default function Fixture() {
  return (
    <Modal color="module">
      <TokenListProvider>
        <TokenSelectDialog onSelect={() => void 0} />
      </TokenListProvider>
    </Modal>
  )
}

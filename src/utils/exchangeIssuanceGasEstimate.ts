import { BigNumber } from '@ethersproject/bignumber'
import { ChainId } from '@usedapp/core'

import { ETH, MATIC, Token } from 'constants/tokens'
import { getExchangeIssuanceZeroExContract } from 'hooks/useExchangeIssuanceZeroEx'
import { getIssuanceModule } from 'utils/issuanceModule'

export async function getExchangeIssuanceGasEstimate(
  library: any,
  chainId: ChainId,
  isIssuance: boolean,
  inputToken: Token,
  outputToken: Token,
  setTokenAmount: BigNumber,
  inputTokenAmount: BigNumber,
  quoteData: string[]
): Promise<BigNumber> {
  let gasEstimate = BigNumber.from(0)

  const setTokenSymbol = isIssuance ? outputToken.symbol : inputToken.symbol
  const issuanceModule = getIssuanceModule(setTokenSymbol, chainId)

  const outputTokenAddress =
    chainId === ChainId.Polygon
      ? outputToken.polygonAddress
      : outputToken.address
  const inputTokenAddress =
    chainId === ChainId.Polygon ? inputToken.polygonAddress : inputToken.address
  if (!outputTokenAddress || !inputTokenAddress) return gasEstimate

  try {
    const contract = await getExchangeIssuanceZeroExContract(
      library?.getSigner(),
      chainId ?? ChainId.Mainnet
    )

    if (isIssuance) {
      const isSellingNativeChainToken =
        inputToken.symbol === ETH.symbol || inputToken.symbol === MATIC.symbol

      if (isSellingNativeChainToken) {
        gasEstimate = await contract.estimateGas.issueExactSetFromETH(
          outputTokenAddress,
          setTokenAmount,
          quoteData,
          issuanceModule.address,
          issuanceModule.isDebtIssuance,
          { value: inputTokenAmount }
        )
      } else {
        const maxAmountInputToken = inputTokenAmount
        gasEstimate = await contract.estimateGas.issueExactSetFromToken(
          outputTokenAddress,
          inputTokenAddress,
          setTokenAmount,
          maxAmountInputToken,
          quoteData,
          issuanceModule.address,
          issuanceModule.isDebtIssuance
        )
      }
    } else {
      const isRedeemingNativeChainToken =
        inputToken.symbol === ETH.symbol || inputToken.symbol === MATIC.symbol
      const minOutputReceive = inputTokenAmount

      if (isRedeemingNativeChainToken) {
        gasEstimate = await contract.estimateGas.redeemExactSetForETH(
          inputTokenAddress,
          setTokenAmount,
          minOutputReceive,
          quoteData,
          issuanceModule.address,
          issuanceModule.isDebtIssuance,
          { gasLimit: 1800000 }
        )
      } else {
        gasEstimate = await contract.estimateGas.redeemExactSetForToken(
          inputTokenAddress,
          outputTokenAddress,
          setTokenAmount,
          minOutputReceive,
          quoteData,
          issuanceModule.address,
          issuanceModule.isDebtIssuance,
          {
            gasLimit: 2000000,
            maxFeePerGas: 100000000000,
            maxPriorityFeePerGas: 2000000000,
          }
        )
      }
    }
  } catch (error) {
    console.log('Error estimating gas for 0x exchange issuance', error)
  }

  return gasEstimate
}

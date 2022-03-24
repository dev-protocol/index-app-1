import { BigNumber } from '@ethersproject/bignumber'

import { convertPositionToSetComponent } from './SetComponentsProvider'

const tokenList = [
  {
    address: '0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b',
    chainId: 1,
    name: 'Defi Pulse Index',
    symbol: 'DPI',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/sushiswap/icons/master/token/dpi.jpg',
  },
  {
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    chainId: 1,
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    decimals: 8,
    logoURI:
      'https://raw.githubusercontent.com/sushiswap/icons/master/token/btc.jpg',
  },
  {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    chainId: 1,
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    logoURI:
      'https://raw.githubusercontent.com/sushiswap/icons/master/token/usdc.jpg',
  },
]

describe('convertPositionToSetComponent()', () => {
  test('should convert asset positions - 18 decimals', async () => {
    const position = {
      component: '0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b',
      module: '0x0000000000000000000000000000000000000000',
      unit: BigNumber.from('214327685725896634'),
      positionState: 0,
      data: '0x',
    }
    const componentPriceUsd = 179.62
    const componentPriceChangeUsd = 3.492931259266907
    const setPriceUsd = 109.49

    const converted = await convertPositionToSetComponent(
      position,
      tokenList,
      componentPriceUsd,
      componentPriceChangeUsd,
      setPriceUsd
    )

    expect(converted).toStrictEqual({
      address: '0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b',
      id: 'defi pulse index',
      quantity: '0.214327685725896634',
      symbol: 'DPI',
      name: 'Defi Pulse Index',
      image:
        'https://raw.githubusercontent.com/sushiswap/icons/master/token/dpi.jpg',
      totalPriceUsd: '38.49753891008555339908',
      dailyPercentChange: '3.492931259266907',
      percentOfSet: '35.16',
      percentOfSetNumber: 35.16,
    })
  })

  test('should convert asset positions - other than 18 decimals', async () => {
    const position = {
      component: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      module: '0x0000000000000000000000000000000000000000',
      unit: BigNumber.from('81869'),
      positionState: 0,
      data: '0x',
    }
    const componentPriceUsd = 43038
    const componentPriceChangeUsd = 1.9632687674971652
    const setPriceUsd = 109.49

    const converted = await convertPositionToSetComponent(
      position,
      tokenList,
      componentPriceUsd,
      componentPriceChangeUsd,
      setPriceUsd
    )

    expect(converted).toStrictEqual({
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      id: 'wrapped bitcoin',
      quantity: '0.00081869',
      symbol: 'WBTC',
      name: 'Wrapped Bitcoin',
      image:
        'https://raw.githubusercontent.com/sushiswap/icons/master/token/btc.jpg',
      totalPriceUsd: '35.23478022',
      dailyPercentChange: '1.9632687674971652',
      percentOfSet: '32.18',
      percentOfSetNumber: 32.18,
    })
  })

  test('should convert debt positions', async () => {
    const position = {
      component: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      module: '0x8d5174eD1dd217e240fDEAa52Eb7f4540b04F419',
      unit: BigNumber.from('-66347705'),
      positionState: 1,
      data: '0x',
    }
    const componentPriceUsd = 0.998448
    const componentPriceChangeUsd = -0.22628548528702983
    const setPriceUsd = 80.81

    const converted = await convertPositionToSetComponent(
      position,
      tokenList,
      componentPriceUsd,
      componentPriceChangeUsd,
      setPriceUsd
    )

    expect(converted).toStrictEqual({
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      id: 'usd coin',
      quantity: '-66.347705',
      symbol: 'USDC',
      name: 'USD Coin',
      image:
        'https://raw.githubusercontent.com/sushiswap/icons/master/token/usdc.jpg',
      totalPriceUsd: '-66.24473336184',
      dailyPercentChange: '-0.22628548528702983',
      percentOfSet: '-81.98',
      percentOfSetNumber: -81.98,
    })
  })
})

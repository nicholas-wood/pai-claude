# Automated trading system: recommendation

## Recommendation

Build a small, boring, deterministic rules engine that runs once a day, trades a paper account for at least three months, then runs propose-then-approve (it writes the order ticket, you tap approve on your phone, it submits) before you ever let it place orders unattended. Put the AI beside the system (research, code review, monitoring, post-mortems), never on the order path. The asset class decides the broker, and that is the one question you need to answer before anything else.

The edge is not a smarter signal. It is removing yourself from execution while keeping your rules simple enough to test.

## Before anything else

Read the Virgin Australia employee securities trading policy. VA is ASX-listed, so you are almost certainly under pre-clearance and blackout rules for VA securities and possibly restrictions on active personal trading. That policy can veto the whole project or shape the instrument list, so it comes first.

## The one question that changes the answer

| If you want to trade | Broker | Why |
|---|---|---|
| ASX (or ASX plus US) | Interactive Brokers Australia (IBKR Pro) | The only mainstream AU broker with a real API for ASX. Tiger Brokers is the only confirmed alternative and has a TypeScript SDK. CommSec, Stake and Selfwealth have no public trading API. |
| US equities only | IBKR, or Alpaca if it will onboard you | Alpaca's paper API is open to anyone today. Its Australian live eligibility is no longer stated on its site; confirm with their support before designing around it. |
| Crypto | Kraken, Independent Reserve or Coinbase Advanced | All serve Australians with AUD rails and full REST plus WebSocket APIs. Independent Reserve has the best-documented AU-native API. Swyftx has a real demo environment. |

My default for you is IBKR for ASX. If you end up US-only, QuantConnect Lean with IBKR is arguably the stronger solo default (survivorship-free data, backtest and live parity, little to build) at the cost of Python or C#. If crypto, TypeScript is the natural fit because ccxt is native TS. It covers ASX and US from one account, has a paper account tethered to the live one, and ASX live data (Level 1 plus depth) is AUD 25 a month non-professional plus roughly USD 15 for US bundles.

## The IBKR constraint that shapes the architecture

IBKR does not offer OAuth to individuals in 2026. You authenticate with username and password through either the TWS API socket (needs IB Gateway running) or the Client Portal Gateway (a small Java process, REST plus WebSocket, periodic re-auth). Either way you need a persistent process on a box you control. A purely serverless design is off the table. Your Linux box or a small VM is fine, but isolate it: a dedicated user or VM, credentials nowhere else, nothing else running on it. Unattended Gateway also means 2FA prompts, daily resets and weekly re-authentication, which is the practical reason propose-then-approve is the right first live phase: it keeps every risk control and removes the unattended-auth problem.

## Architecture (six layers, built in this order)

1. **Risk layer first.** Position cap per instrument, total exposure cap, daily loss limit, max drawdown, a fail-closed kill switch with several triggers (drawdown, order rate, heartbeat, broker state mismatch). Build this before the first strategy.
2. **Execution adapter.** One thin module against the broker API. Idempotent order submission (client order IDs), reconciliation of the internal book against the broker before every run, and no order goes out until reconciliation passes.
3. **Data.** For a daily strategy you need end-of-day bars, which are kilobytes. Norgate (AU, survivorship-bias aware with delisted securities, about AUD 22 to 52 a month, but its updater is Windows-only, which matters on a Linux box) or EODHD (from about USD 20 a month, has ASX with franking data) for history; the broker feed for the live close. Do not build a streaming pipeline until a strategy needs it.
4. **Strategy engine.** Pure functions: bars in, target positions out. No side effects, so the same code backtests and trades live.
5. **Ops.** A scheduled run keyed to each exchange calendar in its own timezone (US hours fall overnight in AEST and the daylight-saving shifts do not align), treating the broker as the source of truth for positions because splits and dividends break naive reconciliation, structured logs, a Telegram or Pulse alert on every order and every risk trip, and a dashboard showing live versus backtest expectancy per strategy version, trade count, drawdown against limit, and the change log.
6. **Research.** Backtesting, walk-forward validation, and hypothesis generation. This is where AI and Python earn their place.

## Operator governance matters more than exposure limits

Standard risk controls bound exposure. They do not bound you. The three loops that kill retail systems are overfitting to backtests, sizing up after wins, and tinkering after losses. The rules that break those loops:

- Strategy versions are immutable once live. A new version needs a minimum number of trades or days on paper before it gets capital.
- Position size is a fixed fraction of equity scaled by realised volatility, never a function of recent profit or loss.
- Risk parameters may tighten instantly. Loosening takes effect next session from a flat book with a written reason.
- Keep a holdout period of data you do not touch until final sign-off. Walk-forward results are the only backtest evidence that counts.

## Cadence: daily, not intraday

Daily or weekly rebalancing removes the real-time feed, the always-on process, most of the infrastructure cost, and most of the friction. It is also where retail systematic strategies actually survive after costs. Intraday adds latency sensitivity and data cost with no evidence of a retail edge.

## Where the AI goes

Not on the order path. The execution service should have no inference dependency at all, so the rule is structural rather than a policy you can flip. AI belongs in: strategy hypothesis generation, code review of the strategy and risk layers, auditing backtests for lookahead and survivorship bias, log summarisation, anomaly explanation, and post-mortems. If you ever want to trial an LLM filter, run it in shadow mode, logged, and evaluate it as its own strategy under the same sample-size gate.

## TypeScript versus Python

Orchestration, risk, execution and ops in TypeScript on bun, as usual. Be clear-eyed that IBKR has no official TS SDK: the Client Portal REST and WebSocket API is fine from TS, but the TWS socket route means the single-maintainer @stoqey/ib library. The mature IBKR client is Python (ib_async), so a thin Python broker sidecar is a legitimate exception if the TS client bites. ccxt is native TS for crypto and Tiger ships an official TS SDK.

Research is the exception. TypeScript has no credible backtester. The Python ecosystem is where walk-forward testing lives: vectorbt (alive, v1.1 in July 2026, Apache plus Commons Clause, fine for personal use) or NautilusTrader (most mature, IBKR adapter, but mid-way through a breaking v2 rewrite). backtrader is dead. If you want Python anywhere, this is the place to approve it. The alternative is a hand-rolled TS backtester for simple daily strategies, sharing the strategy functions with live, which is credible only if the strategies stay simple.

## Backtest pitfalls to design against

Lookahead (using the close to decide a trade at the close), survivorship bias (use a bias-aware source like Norgate), overfitting (parameter count versus sample size), and ignoring commissions, spread, slippage and tax.

## Tax and legal

- Trading your own money algorithmically needs no AFSL. ASIC's automated-trading guide (RG 241) binds the broker, not you. Running anyone else's money or selling signals flips that completely.
- Frequent algorithmic share trading pushes you toward ATO "share trader" status: gains become ordinary income, you lose the 50 per cent CGT discount, and losses fall under the non-commercial loss rules. The ATO weights volume less heavily for crypto. Decide the cadence with your accountant before going live, and keep a full trade log from day one.
- Automation itself strengthens the ATO business-like indicators for trader status. If classed a trader, Division 35 non-commercial loss rules can quarantine losses, and the income threshold in those rules is likely relevant at your income. US trading adds W-8BEN, FX gains and foreign tax offsets. Have the system emit an ATO-ready parcel ledger from day one.
- Fee floor: minimum brokerage per ASX trade means small positions pay a material percentage, and US trades add FX conversion. Size positions in the thousands, not hundreds, or the minimum ticket eats the edge. Check the current IBKR AU minimum before setting position size.
- Use a separate, small account so the system is buffered from your net wealth.

## Alternatives and why they are not the default

- TradingView alerts to a webhook to a small bun executor. Fastest to stand up, weak testing rigour, and Pine strategies are hard to govern. Fine for a first experiment, not the platform.
- QuantConnect Lean. Best backtesting, but live trading needs a paid seat and it is C# or Python.
- freqtrade. Excellent and well maintained, crypto only, Python.
- A full NautilusTrader deployment. The right answer if you go big, but wait for v2 to stabilise.

## First three actions

1. Read the VA trading policy, then decide the asset class. Everything else keys off those two.
2. Open an IBKR Australia account (or the crypto exchange) and get the paper account plus API authentication working from your Linux box. This is the step with the most surprises.
3. Write the risk layer and reconciliation first, with tests, before any strategy. Then a trivial strategy (for example monthly rebalance of two ETFs) to exercise the whole path on paper.

## Sources

IBKR API and Web API: https://www.interactivebrokers.com/campus/ibkr-api-page/web-api-trading/ · IBKR AU market data: https://www.interactivebrokers.com.au/en/pricing/market-data-pricing.php · Tiger OpenAPI: https://docs-en.itigerup.com/ · Alpaca availability: https://alpaca.markets/support/countries-alpaca-is-available · Alpaca data: https://docs.alpaca.markets/docs/about-market-data-api · Kraken AU: https://support.kraken.com/articles/360046261932-australia-faq · Independent Reserve API: https://www.independentreserve.com/au/features/api · Norgate: https://norgatedata.com/stockmarketpackages.php · EODHD ASX: https://eodhd.com/asx-data · vectorbt: https://github.com/polakowo/vectorbt · NautilusTrader: https://github.com/nautechsystems/nautilus_trader · @stoqey/ib: https://github.com/stoqey/ib · ATO trader vs investor: https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/shares-and-similar-investments/share-investing-versus-share-trading · ASIC AFSL: https://asic.gov.au/for-finance-professionals/afs-licensees/do-you-need-an-afs-licence/ · RG 241: https://asic.gov.au/regulatory-resources/find-a-document/regulatory-guides/rg-241-electronic-trading/

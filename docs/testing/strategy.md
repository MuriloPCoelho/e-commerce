# Estratégia de Testes — Projeto e‑commerce

Este documento resume uma estratégia prática e priorizada de testes para um projeto de e‑commerce. Guarde como referência para quando for implementar a infraestrutura de testes (unitários, integração, E2E, visuais).

## Contrato curto
- Inputs: UI e API da aplicação (componentes React, endpoints Next/Node, integrações externas).
- Outputs: Garantia automatizada de comportamento esperado (UI, integração e fluxo de negócio).
- Formas de falha: regressão visual, quebra de fluxo (checkout), bugs de validação, integração com terceiros.
- Critério de sucesso: pipelines CI que falham rapidamente em regressões críticas (P0) antes do deploy.

## Ferramentas recomendadas
- Unit / Component tests: Vitest + @testing-library/react + testing-library/user-event
- Mocks API para frontend: MSW (Mock Service Worker)
- Integração backend / API: SuperTest (para HTTP handlers) ou testes integrados com banco isolado
- E2E: Playwright (recomendado) ou Cypress
- Visual / UI regression: Storybook + Chromatic ou Playwright snapshots / Percy
- Contratos/webhooks: Pact (opcional) ou testes de integração end-to-end com stubs

## Estrutura de pastas sugerida
- tests/
  - unit/ (componentes, utilitários)
  - integration/ (API handlers, DB integration)
  - e2e/ (Playwright tests)
- test-utils/ (renderWithProviders, mock routers, factories)
- src/__mocks__/ (mocks locais, se necessário)
- .playwright/ (config Playwright)
- .storybook/ (config Storybook)

## Priorização de casos (P0 = crítico)

P0 — imprescindíveis
- Autenticação: sign-up, sign-in, token refresh, logout.
- Carrinho: adicionar/remover produtos, calcular subtotal/total, alterar quantidade.
- Checkout happy path: criar pedido, decrementar estoque, gerar confirmação.
- Pagamentos: fluxo simulado com sandbox e tratamento de erro (pagamento recusado).
- Ordens: armazenamento correto no DB e confirmação por e‑mail (ou enfileiramento).
- Segurança: proteção de rotas, validação de inputs críticos.
- Inventário concorrente: tratamento quando estoque baixo.

P1 — importantes
- Busca/filtragem/paginação em produtos.
- Cálculo de frete e impostos.
- Códigos promocionais (aplicação e limites).
- Endereços do usuário (CRUD) e seleção no checkout.
- Logs e métricas essenciais (erro do checkout).

P2 — qualidade / nice-to-have
- Testes visuais (regressão) para componentes críticos.
- Testes de acessibilidade automatizados (axe, jest-axe).
- Testes de performance críticos (page load, bundle size).

## Integrações externas críticas
- Gateway de pagamento: usar sandbox + teste de falha.
- Serviço de e‑mail: stub/spy (verificar que mensagem foi enfileirada).
- Webhooks: endpoints validados por assinatura; testes simulando webhooks.
- Serviços de envio/ERP: validar re‑tentativas e falhas.

## Edge cases importantes
- Carrinho em múltiplas abas/concorrência.
- Promo codes combinados e limites de uso.
- Sessões expiradas durante checkout.
- Pagamentos duplicados (idempotência).
- Falha parcial (pagamento ok, erro ao gravar pedido) — compensação/rollback.

## Exemplos práticos

### Teste unitário (Vitest + RTL) — `Input` size
Arquivo sugerido: `tests/unit/Input.test.tsx`

```ts
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Input } from '../../src/components/ui/input'

describe('Input component', () => {
  it('applies correct size class for size="sm"', () => {
    render(<Input size="sm" placeholder="Email" />)
    const input = screen.getByPlaceholderText('Email')
    expect(input).toHaveClass('h-9')
  })

  it('accepts typing and forwards props', async () => {
    render(<Input data-testid="email" />)
    const user = userEvent.setup()
    const el = screen.getByTestId('email') as HTMLInputElement
    await user.type(el, 'hello@example.com')
    expect(el.value).toBe('hello@example.com')
  })
})
```

Notas:
- Use asserts por classe quando o componente depende de classes Tailwind.
- Configure `vitest` com `@testing-library/jest-dom` matchers no setupFile.

### Teste E2E (Playwright) — fluxo de compra simplificado
Arquivo sugerido: `tests/e2e/checkout.spec.ts`

```ts
import { test, expect } from '@playwright/test'

test('user can buy a product (happy path)', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await page.click('text=Products')
  await page.click('text=Product Title Example')
  await page.click('text=Add to bag')
  await page.goto('http://localhost:3000/bag')
  await page.click('text=Checkout')
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="address"]', 'Rua Teste, 123')
  await page.fill('input[name="cardNumber"]', '4242424242424242')
  await page.fill('input[name="expiry"]', '12/30')
  await page.fill('input[name="cvc"]', '123')
  await page.click('text=Pay')
  await expect(page.locator('text=Obrigado pelo seu pedido')).toBeVisible()
})
```

## Comandos de instalação (PowerShell)
```powershell
# Unit + RTL + Vitest
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# MSW para mocks de rede
npm install -D msw

# Playwright (E2E)
npx playwright install
npm install -D @playwright/test

# SuperTest para API
npm install -D supertest
```

## Comandos de execução
```powershell
# Unit tests
npx vitest

# Playwright E2E
npx playwright test

# Coverage
npx vitest --coverage
```

## Boas práticas
- Use MSW para evitar testar contra APIs reais nos testes unitários.
- Use DB isolado (in-memory ou containers) para testes de integração.
- Automatize E2E em branches principais e PRs críticos apenas.
- Comece cobrindo P0; escreva testes unitários e de integração extensivos antes de proliferar E2E.

## Próximos passos sugeridos
- Scaffolder um setup mínimo de Vitest + RTL no repo (config + script npm + exemplo de teste para `Input`).
- Scaffolder um teste Playwright básico e a configuração Playwright.
- Adicionar `test-utils` com `renderWithProviders` para facilitar testes de componentes.

---

Arquivo criado automaticamente pelo assistente — atualizado em 2025-10-22.

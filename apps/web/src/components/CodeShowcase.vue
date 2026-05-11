<script setup lang="ts">
import { computed, ref } from "vue"

import type { CodeLanguage } from "@data"

const active = ref<CodeLanguage>("go")
const tabs: Array<{ key: CodeLanguage; label: string }> = [
  { key: "go", label: "Go" },
  { key: "ts", label: "TypeScript" },
  { key: "php", label: "PHP" },
]

const copyLabel = ref("Copy")
const paneRefs = ref<Record<CodeLanguage, HTMLElement | null>>({
  go: null,
  ts: null,
  php: null,
})

function setPane(key: CodeLanguage, el: Element | null) {
  paneRefs.value[key] = el as HTMLElement | null
}

const activePane = computed(() => paneRefs.value[active.value])

async function copyActive() {
  const text = activePane.value?.innerText
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    copyLabel.value = "Copied"
    setTimeout(() => {
      copyLabel.value = "Copy"
    }, 1200)
  } catch {
    /* clipboard unavailable; leave label unchanged */
  }
}
</script>

<template>
  <div class="code-showcase">
    <div class="code-frame">
      <div class="code-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="code-tab"
          :class="{ active: active === tab.key }"
          @click="active = tab.key"
        >
          {{ tab.label }}
        </button>
        <button type="button" class="code-copy" @click="copyActive">{{ copyLabel }}</button>
      </div>
      <div class="code-body">
        <div
          :ref="(el) => setPane('go', el as Element | null)"
          class="code-pane"
          :class="{ active: active === 'go' }"
        >
<pre><span class="tok-c">// idempotent ledger handler — at-most-once posting</span>
<span class="tok-k">package</span> ledger

<span class="tok-k">import</span> (
    <span class="tok-s">"context"</span>
    <span class="tok-s">"errors"</span>
)

<span class="tok-k">func</span> (s *<span class="tok-t">Service</span>) <span class="tok-f">Post</span>(ctx <span class="tok-n">context</span>.<span class="tok-t">Context</span>, e <span class="tok-t">Entry</span>) (<span class="tok-t">Receipt</span>, <span class="tok-t">error</span>) {
    <span class="tok-k">if</span> e.Amount.<span class="tok-f">IsZero</span>() {
        <span class="tok-k">return</span> <span class="tok-t">Receipt</span>{}, errors.<span class="tok-f">New</span>(<span class="tok-s">"zero amount"</span>)
    }

    <span class="tok-k">return</span> s.tx.<span class="tok-f">WithIdempotency</span>(ctx, e.Key, <span class="tok-k">func</span>(tx *<span class="tok-t">Tx</span>) (<span class="tok-t">Receipt</span>, <span class="tok-t">error</span>) {
        <span class="tok-k">if</span> err := tx.<span class="tok-f">Debit</span>(e.From, e.Amount); err != <span class="tok-n">nil</span> {
            <span class="tok-k">return</span> <span class="tok-t">Receipt</span>{}, err
        }
        <span class="tok-k">if</span> err := tx.<span class="tok-f">Credit</span>(e.To, e.Amount); err != <span class="tok-n">nil</span> {
            <span class="tok-k">return</span> <span class="tok-t">Receipt</span>{}, err
        }
        <span class="tok-k">return</span> tx.<span class="tok-f">Commit</span>(e)
    })
}</pre>
        </div>
        <div
          :ref="(el) => setPane('ts', el as Element | null)"
          class="code-pane"
          :class="{ active: active === 'ts' }"
        >
<pre><span class="tok-c">// result-typed payment intent with retry policy</span>
<span class="tok-k">import</span> { <span class="tok-t">Result</span>, retry } <span class="tok-k">from</span> <span class="tok-s">"@core/runtime"</span>

<span class="tok-k">export const</span> <span class="tok-f">processPayment</span> = <span class="tok-k">async</span> (
  intent: <span class="tok-t">PaymentIntent</span>,
): <span class="tok-t">Promise</span>&lt;<span class="tok-t">Result</span>&lt;<span class="tok-t">Receipt</span>, <span class="tok-t">PaymentError</span>&gt;&gt; =&gt; {
  <span class="tok-k">const</span> validated = <span class="tok-k">await</span> <span class="tok-f">validate</span>(intent)
  <span class="tok-k">if</span> (!validated.ok) <span class="tok-k">return</span> validated

  <span class="tok-k">return</span> <span class="tok-f">retry</span>({
    attempts: <span class="tok-n">3</span>,
    backoff: <span class="tok-s">"exponential"</span>,
    idempotencyKey: intent.id,
  }).<span class="tok-f">run</span>(() =&gt; ledger.<span class="tok-f">commit</span>(validated.value))
}</pre>
        </div>
        <div
          :ref="(el) => setPane('php', el as Element | null)"
          class="code-pane"
          :class="{ active: active === 'php' }"
        >
<pre><span class="tok-c">// banking-grade transactional handler</span>
<span class="tok-k">namespace</span> App\Payments;

<span class="tok-k">final class</span> <span class="tok-t">TransferHandler</span>
{
    <span class="tok-k">public function</span> <span class="tok-f">__construct</span>(
        <span class="tok-k">private readonly</span> <span class="tok-t">LedgerRepository</span> $ledger,
        <span class="tok-k">private readonly</span> <span class="tok-t">EventBus</span> $bus,
    ) {}

    <span class="tok-k">public function</span> <span class="tok-f">handle</span>(<span class="tok-t">TransferCommand</span> $cmd): <span class="tok-t">Receipt</span>
    {
        <span class="tok-k">return</span> $this-&gt;ledger-&gt;<span class="tok-f">transactional</span>(<span class="tok-k">fn</span>() =&gt;
            $this-&gt;bus-&gt;<span class="tok-f">dispatch</span>(
                <span class="tok-k">new</span> <span class="tok-t">TransferExecuted</span>($cmd-&gt;id, $cmd-&gt;amount)
            )
        );
    }
}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

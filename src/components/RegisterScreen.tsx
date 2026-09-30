import { useState, type FormEvent } from 'react'
import { cleanInstagram } from '../lib/format'
import { instagramExists } from '../lib/supabase'

export type Player = { name: string; instagram: string }

export function RegisterScreen({ onStart }: { onStart: (p: Player) => void }) {
    const [name, setName] = useState('')
    const [instagram, setInstagram] = useState('')
    const [follows, setFollows] = useState(false)
    const [consent, setConsent] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [checking, setChecking] = useState(false)

    async function submit(e: FormEvent) {
        e.preventDefault()
        const ig = cleanInstagram(instagram)
        if (name.trim().length < 2) return setError('Informe seu nome.')
        if (!/^[a-z0-9._]{1,30}$/.test(ig)) return setError('Informe um @ do Instagram válido.')
        if (!follows) return setError('Confirme que está seguindo @avanteglobalseguros.')
        if (!consent) return setError('É preciso autorizar a exibição no ranking.')

        setError(null)
        setChecking(true)
        try {
            if (await instagramExists(ig)) {
                return setError(`O @${ig} já participou. Cada @ pode jogar uma vez.`)
            }
            onStart({ name: name.trim(), instagram: ig })
        } catch {
            setError('Não foi possível verificar agora. Tente de novo.')
        } finally {
            setChecking(false)
        }
    }

    const input = 'rounded-xl border border-line bg-ink px-4 py-3 outline-none focus:border-upper'
    const label = 'text-xs font-semibold uppercase tracking-wider text-muted'

    return (
        <div className="grid overflow-hidden rounded-3xl border border-line bg-panel md:grid-cols-[1.2fr_1fr]">
            <section className="flex flex-col justify-between gap-8 p-7 md:p-12">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-upper-2">Você conhece a Upper?</p>
                    <h1 className="mt-5 text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
                        5 perguntas.<br />50 segundos.<br />Valendo ranking.
                    </h1>
                    <p className="mt-6 max-w-md text-muted">
                        Responda rápido e com precisão. Cada acerto faz o caminhão avançar pela rota e soma 100 pontos.
                        Cada pergunta tem 10 segundos e, em caso de empate, o menor tempo fica à frente.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                    {['🚚 5 trechos', '⏱ 10s por pergunta', '🏆 Top 3'].map((t) => (
                        <span key={t} className="rounded-full border border-line bg-panel-2 px-3 py-1.5">{t}</span>
                    ))}
                </div>
            </section>

            <form onSubmit={submit} className="flex flex-col gap-4 border-t border-line bg-panel-2/60 p-7 md:border-l md:border-t-0 md:p-10">
                <div>
                    <h2 className="text-2xl font-bold">Antes de começar</h2>
                    <p className="mt-1 text-sm text-muted">Preencha seus dados. Eles serão usados para identificar sua participação e montar o ranking.</p>
                </div>

                <label className="flex flex-col gap-1.5">
                    <span className={label}>Seu nome</span>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Felipe Ribeiro" maxLength={60} className={input} />
                </label>

                <label className="flex flex-col gap-1.5">
                    <span className={label}>Seu Instagram</span>
                    <input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@seuinstagram"
                        maxLength={60} autoCapitalize="none" autoCorrect="off" className={input} />
                </label>

                <div className="rounded-xl border border-upper/30 bg-upper/10 p-4 text-sm">
                    Para participar, lembre-se de seguir a <strong>Avante Global Seguros</strong> no Instagram:{' '}
                    <a href="https://www.instagram.com/avanteglobalseguros/" target="_blank" rel="noreferrer"
                        className="font-semibold text-upper-2 hover:underline">@avanteglobalseguros ↗</a>
                </div>

                <label className="flex items-start gap-3 text-sm">
                    <input type="checkbox" checked={follows} onChange={(e) => setFollows(e.target.checked)} className="mt-0.5 size-4 accent-upper" />
                    <span>Confirmo que estou seguindo <strong>@avanteglobalseguros</strong>.</span>
                </label>

                <label className="flex items-start gap-3 text-sm">
                    <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 size-4 accent-upper" />
                    <span>Autorizo o uso do meu nome e @ do Instagram para identificação e exibição no ranking desta ação.</span>
                </label>

                {error && <p className="text-sm font-medium text-bad">{error}</p>}

                <button
                    type="submit"
                    disabled={checking}
                    className="mt-2 rounded-xl bg-upper px-5 py-4 font-bold tracking-wide text-ink transition hover:bg-upper-2 disabled:opacity-60"
                >
                    {checking ? 'VERIFICANDO...' : 'COMEÇAR O DESAFIO →'}
                </button>
                <p className="text-xs text-muted">O cronômetro começa apenas quando a primeira pergunta aparecer. Depois disso, não é possível pausar.</p>
            </form>
        </div>
    )
}
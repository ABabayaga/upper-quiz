import { useState, type FormEvent, type ReactNode } from 'react'
import { cleanInstagram } from '../lib/format'
import { instagramExists } from '../lib/supabase'
import { sendToSheet } from '../lib/sheets'

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
            const player = { name: name.trim(), instagram: ig }
            sendToSheet(player)
            onStart(player)
        } catch {
            setError('Não foi possível verificar agora. Tente de novo.')
        } finally {
            setChecking(false)
        }
    }

    const input = 'rounded-lg bg-ink px-4 py-3 outline-none ring-1 ring-transparent transition placeholder:text-muted/60 focus:ring-upper'
    const label = 'text-sm font-medium text-muted'

    return (
        <div className="grid overflow-hidden rounded-xl bg-panel md:grid-cols-[1.2fr_1fr]">
            <section className="flex flex-col gap-8 p-6 md:p-12">
                <img src="/logo_branca.png" alt="UPPER GR" className="h-10 w-auto self-start md:h-12" />
                <div>
                    <h1 className="font-display text-5xl font-bold uppercase leading-[0.92] md:text-7xl">
                        Quanto você conhece a Upper GR?
                    </h1>
                    <p className="mt-5 max-w-md text-lg text-muted">
                        5 perguntas, 10 segundos cada. Os 3 melhores aparecem no telão.
                    </p>
                </div>
            </section>

            <form onSubmit={submit} className="flex flex-col gap-4 bg-panel-2 p-6 md:p-10">
                <h2 className="font-display text-2xl font-semibold uppercase">Antes de começar</h2>

                <label className="flex flex-col gap-1.5">
                    <span className={label}>Seu nome</span>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Felipe Ribeiro" maxLength={60} className={input} />
                </label>

                <label className="flex flex-col gap-1.5">
                    <span className={label}>Seu Instagram</span>
                    <input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@seuinstagram"
                        maxLength={60} autoCapitalize="none" autoCorrect="off" className={input} />
                </label>

                <div className="rounded-lg bg-upper/10 p-4 text-sm">
                    Para participar, lembre-se de seguir a <strong className="font-semibold">Avante Global Seguros</strong> no Instagram:{' '}
                    <a href="https://www.instagram.com/avanteglobalseguros/" target="_blank" rel="noreferrer"
                        className="font-semibold text-upper-2 underline-offset-2 hover:underline">@avanteglobalseguros</a>
                </div>

                <Checkbox checked={follows} onChange={setFollows}>
                    Confirmo que estou seguindo <strong className="font-semibold">@avanteglobalseguros</strong>.
                </Checkbox>

                <Checkbox checked={consent} onChange={setConsent}>
                    Autorizo o uso do meu nome e @ do Instagram para identificação e exibição no ranking desta ação.
                </Checkbox>

                {error && <p className="text-sm font-medium text-bad">{error}</p>}

                <button
                    type="submit"
                    disabled={checking}
                    className="mt-2 rounded-lg bg-upper px-5 py-3.5 font-display text-xl font-bold uppercase tracking-wide text-ink transition hover:bg-upper-2 disabled:opacity-60"
                >
                    {checking ? 'Verificando...' : 'Começar o desafio'}
                </button>
            </form>
        </div>
    )
}

type CheckboxProps = { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }

function Checkbox({ checked, onChange, children }: CheckboxProps) {
    return (
        <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
            <span className="mt-px grid size-5 shrink-0 place-items-center rounded bg-ink ring-1 ring-muted/40 transition peer-checked:bg-upper peer-checked:ring-upper peer-focus-visible:ring-2 peer-focus-visible:ring-upper-2">
                <svg viewBox="0 0 16 16" className={`size-3.5 transition-opacity ${checked ? 'opacity-100' : 'opacity-0'}`}
                    fill="none" stroke="var(--color-ink)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3.5 8.5l3 3 6-7" />
                </svg>
            </span>
            <span>{children}</span>
        </label>
    )
}

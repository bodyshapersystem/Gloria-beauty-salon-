"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";
import { supabase } from "@/lib/supabase/client";

function money(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export function CartDrawer() {
  const { items, isOpen, close, removeItem, setQty, subtotalCents, count, clear } = useCart();
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    supabase.auth.getSession().then(({ data }) => setLoggedIn(!!data.session));
  }, [isOpen]);

  async function placeOrder() {
    setError(null);
    setPlacing(true);
    const { error: e } = await supabase.rpc("create_order_from_cart", {
      p_items: items.map((x) => ({ product_slug: x.slug, quantity: x.qty })),
    });
    setPlacing(false);
    if (e) {
      setError(e.message);
      return;
    }
    setPlaced(true);
    clear();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[95] bg-espresso/35 flex justify-end" onClick={close}>
      <aside
        className="h-full w-full max-w-[440px] bg-ivory flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-champagne/30">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={18} className="text-mocha" />
            <h2 className="font-serif text-[22px]">Tu carrito</h2>
          </div>
          <button onClick={close} className="text-taupe" aria-label="Cerrar carrito">
            <X size={22} />
          </button>
        </div>

        {placed ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            <div className="w-14 h-14 rounded-full bg-espresso text-ivory flex items-center justify-center mb-6">
              <Check size={24} />
            </div>
            <h3 className="font-serif text-[28px] leading-tight">Pedido recibido</h3>
            <p className="mt-3 text-[13px] text-taupe leading-relaxed">
              Te contactaremos en breve para coordinar el pago y el retiro en salón.
            </p>
            <button
              onClick={() => {
                setPlaced(false);
                close();
              }}
              className="mt-7 rounded-full bg-espresso px-6 py-3 text-[10px] uppercase tracking-[0.14em] text-ivory"
            >
              Seguir viendo la tienda
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            <ShoppingBag size={30} className="text-taupe/50" />
            <p className="mt-4 font-serif text-[24px]">Tu carrito está vacío</p>
            <p className="mt-2 text-[12px] text-taupe">Agrega productos desde la tienda.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {items.map((item) => (
                <div key={item.slug} className="flex gap-4">
                  <div className="relative w-[64px] h-[64px] shrink-0 bg-blush overflow-hidden">
                    {item.image && (
                      <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[9.5px] tracking-[0.1em] text-taupe uppercase truncate">
                          {item.brand}
                        </p>
                        <p className="font-serif italic text-[16px] leading-tight truncate">
                          {item.name}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.slug)}
                        className="text-taupe shrink-0"
                        aria-label={`Quitar ${item.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 border border-taupe/30 rounded-full px-1">
                        <button
                          onClick={() => setQty(item.slug, item.qty - 1)}
                          className="w-6 h-6 grid place-items-center text-mocha"
                          aria-label="Restar"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-[12px] w-4 text-center">{item.qty}</span>
                        <button
                          onClick={() => setQty(item.slug, item.qty + 1)}
                          className="w-6 h-6 grid place-items-center text-mocha"
                          aria-label="Sumar"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-[13px] font-serif italic text-mocha">
                        {money(item.priceCents * item.qty)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-champagne/30 px-6 py-5">
              <div className="flex items-center justify-between text-[13px] mb-4">
                <span className="text-taupe">
                  Subtotal ({count} {count === 1 ? "artículo" : "artículos"})
                </span>
                <span className="font-serif text-[20px]">{money(subtotalCents)}</span>
              </div>

              {error && <p className="mb-3 text-[11.5px] text-red-700">{error}</p>}

              {loggedIn === false ? (
                <div className="rounded-lg bg-blush/40 px-4 py-3.5 text-center">
                  <p className="text-[12px] text-mocha mb-3">
                    Inicia sesión en Gloria Access para completar tu pedido.
                  </p>
                  <Link
                    href="/access/login"
                    className="inline-block rounded-full bg-espresso px-6 py-3 text-[10px] uppercase tracking-[0.14em] text-ivory"
                  >
                    Iniciar sesión
                  </Link>
                </div>
              ) : (
                <button
                  onClick={placeOrder}
                  disabled={placing || loggedIn === null}
                  className="w-full rounded-full bg-espresso px-6 py-3.5 text-[11px] uppercase tracking-[0.14em] text-ivory disabled:opacity-50"
                >
                  {placing ? "Enviando..." : "Confirmar pedido"}
                </button>
              )}
              <p className="mt-3 text-[10.5px] text-taupe text-center">
                Pago y retiro se coordinan en salón — pago en línea próximamente.
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

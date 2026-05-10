import { CheckoutSuccessPanel } from "@/components/checkout/checkout-success-panel";
import { SiteShell } from "@/components/layout/site-shell";

type CheckoutSuccessPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  const params = await searchParams;
  const tranId = typeof params.tran_id === "string" ? params.tran_id : "";
  const valId = typeof params.val_id === "string" ? params.val_id : "";

  return (
    <SiteShell>
      <section className="section-shell py-14">
        <CheckoutSuccessPanel tranId={tranId} valId={valId} />
      </section>
    </SiteShell>
  );
}

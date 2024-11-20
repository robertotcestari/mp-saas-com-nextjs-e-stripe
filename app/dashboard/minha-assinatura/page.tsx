import { auth } from '@/auth';
import BannerWarning from '@/components/banner-warning';
import PricingCard from '@/components/pricing-card';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  fetchSubscriptionByEmail,
  translateSubscriptionInterval,
  translateSubscriptionStatus,
} from '@/lib/stripe';
import { CreditCard, XCircle } from 'lucide-react';
import Form from 'next/form';
import cancelSubscriptionAction from './cancel-subscription-action';
import Link from 'next/link';

export default async function MySubscription() {
  const session = await auth();
  const userEmail = session?.user?.email as string;
  const subscription = await fetchSubscriptionByEmail(userEmail);

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Minha Assinatura</h1>
      {subscription && (
        <div className="flex gap-10">
          <PlanCard subscription={subscription} />
          <ActionCard subscription={subscription} />
        </div>
      )}
      {!subscription && (
        <>
          <BannerWarning text="Você precisa de uma assinatura ativa. Quer tal assinar agora?" />
          <PricingCard />
        </>
      )}
    </>
  );
}

function PlanCard({ subscription }: { subscription: any }) {
  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <CardTitle>Detalhes da Assinatura</CardTitle>
        <CardDescription>Informações sobre seu plano atual</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Plano:</span>
            <span>{subscription.plan.nickname}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">ID:</span>
            <span className="text-xs">{subscription.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="text-green-600">
              {translateSubscriptionStatus(subscription.status)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Próxima cobrança:</span>
            <span>
              {new Date(
                subscription.current_period_end * 1000
              ).toLocaleDateString('pt-BR')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Valor:</span>
            <span>
              {(subscription.plan.amount / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Ciclo:</span>
            <span>
              {translateSubscriptionInterval(subscription.plan.interval)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActionCard({ subscription }: { subscription: any }) {
  return (
    <Card className="w-full max-w-sm h-full">
      <CardHeader>
        <CardTitle>Ações</CardTitle>
        <CardDescription>Gerencie sua assinatura</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Link
            target="_blank"
            href={process.env.STRIPE_CUSTOMER_PORTAL_URL ?? ''}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <CreditCard className="mr-2 h-5 w-5 text-gray-400" />
            Atualizar método de pagamento
          </Link>
          <Form action={cancelSubscriptionAction}>
            <input
              type="hidden"
              name="subscriptionId"
              value={subscription.id}
            />
            <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              <XCircle className="mr-2 h-5 w-5" />
              Cancelar assinatura
            </button>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}

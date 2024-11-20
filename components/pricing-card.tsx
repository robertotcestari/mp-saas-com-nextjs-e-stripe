import { Check } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import PaymentButton from './payment-button';
import { fetchSubscriptionByEmail } from '@/lib/stripe';
import { auth } from '@/auth';

export default async function PricingCard() {
  const session = await auth();
  const userEmail = session?.user?.email as string;
  const subscription = await fetchSubscriptionByEmail(userEmail);

  return (
    <Card className="w-[350px] text-left md:mt-20 mt-10">
      <CardHeader>
        <CardTitle>Plano Pro Premium VIP</CardTitle>
        <CardDescription>
          Tudo que você precisa para seus estudos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold mb-8 mt-4">
          R$29
          <span className="font-normal text-muted-foreground text-lg">
            /mês
          </span>{' '}
        </p>
        <ul>
          <li className="flex gap-2 text-muted-foreground">
            <Check className="w-4 text-green-600" />
            Acesso a 1 ebook por mês
          </li>
          <li className="flex gap-2 text-muted-foreground">
            <Check className="w-4 text-green-600" />
            Curadoria especial
          </li>
          <li className="flex gap-2 text-muted-foreground">
            <Check className="w-4 text-green-600" />
            Acesso ilimitado
          </li>
          <li className="flex gap-2 text-muted-foreground">
            <Check className="w-4 text-green-600" />
            Cancele quando quiser
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        {!subscription && <PaymentButton>Assine Agora</PaymentButton>}
      </CardFooter>
    </Card>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "../ui/Loader";
import { Transaction } from "@/utils/mockData";

interface SettleDebtsCardProps {
  transactions: Transaction[];
  onSettle: () => Promise<void>;
  isSettling: boolean;
  currency: { symbol: string };
  memberMap: { [key: string]: { name: string; email: string } };
}

export const SettleDebtsCard = ({
  transactions,
  onSettle,
  isSettling,
  currency,
  memberMap,
}: SettleDebtsCardProps) => {
  const getDisplayName = (id: string) => {
    if (memberMap[id]) {
      return `${memberMap[id].name} (${memberMap[id].email})`;
    }
    return id;
  };

  return (
    <Card className="border-none shadow-subtle">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Settle Group Debts</CardTitle>
        <Button 
          onClick={onSettle}
          disabled={isSettling}
          className="rounded-md"
        >
          {isSettling ? (
            <>
              <Loader size="sm" className="mr-2" />
              Calculating...
            </>
          ) : (
            "Settle Debts"
          )}
        </Button>
      </CardHeader>
      
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No settlement transactions yet. Click "Settle Debts" to calculate who owes whom.
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-3 font-medium text-sm text-muted-foreground pb-2 border-b">
              <span>From</span>
              <span className="text-center">To</span>
              <span className="text-right">Amount</span>
            </div>
            {transactions.map((tx) => (
              <div 
                key={tx.TransactionID}
                className="grid grid-cols-3 items-center py-2"
              >
                <span className="truncate">{getDisplayName(tx.From)}</span>
                <span className="text-center truncate">{getDisplayName(tx.To)}</span>
                <span className="text-right font-medium">
                  {currency.symbol}{parseFloat(tx.Amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
